import { MoreThanOrEqual, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import * as dayjs from 'dayjs';

import { CreateSubscriptionDto } from './dto';
import { Subscription } from './subscription.entity';

import { EmploymentService } from 'src/employment/employment.service';
import { EmploymentRole } from 'src/employment/type/employment-role.enum';
import { AuthService } from 'src/auth/auth.service';

const CURRENCY = 'chf';
const JOB_PRICE = 12.9;
const VAT = 0.077;
const subscriptionPlans = [
  {
    id: 'premium',
    price: 24,
    months: 36,
  },
  {
    id: 'starter',
    price: 120,
    months: 1,
  },
  {
    id: 'basic',
    price: 60,
    months: 12,
  },
];

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectStripe()
    private readonly stripeClient: Stripe,
    @InjectRepository(Subscription)
    public subscriptionRepo: Repository<Subscription>,
    private employmentService: EmploymentService,
    private authService: AuthService,
  ) {}

  public async create(createSubscriptionDto: CreateSubscriptionDto, authUserId: string): Promise<Subscription> {
    const { password, jobAmount = 0, planId = null, stripeToken, companyId, metadata = {} } = createSubscriptionDto;

    const [staff] = await Promise.all([
      this.employmentService.employmentRepo.findOneOrFail({
        where: {
          userId: authUserId,
          companyId: companyId,
          role: MoreThanOrEqual(EmploymentRole.HR),
        },
      }),

      this.authService.verifyPassword(authUserId, password),
    ]);

    const plan = planId && subscriptionPlans.find((p) => p.id === planId)
    const amount = Math.round((jobAmount || 0) * JOB_PRICE + (plan ? plan.price * plan.months : 0) * (1 + VAT) * 100);

    let res = null;
    try {
      res = await this.stripeClient.charges.create({
        amount,
        source: stripeToken,
        currency: CURRENCY,
        metadata: {
          ...metadata,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    const promises = [];

    if (plan) {
      const planSub = this.subscriptionRepo.create({
        companyId,
        staffId: staff.id,
        planId,
        total: amount,
        vat: VAT,
        startAt: new Date(),
        endAt: dayjs().add(plan.months, 'month').toDate(),
        receipt: res.receipt_url,
      });

      promises.push(this.subscriptionRepo.save(planSub));
    }

    if (jobAmount) {
      const jobSub = this.subscriptionRepo.create({
        companyId,
        staffId: staff.id,
        jobAmount,
        remainingJobs: jobAmount,
        total: amount,
        vat: VAT,
        startAt: new Date(),
        endAt: dayjs().add(1, 'year').toDate(),
        receipt: res.receipt_url,
      });

      promises.push(this.subscriptionRepo.save(jobSub));
    }

    return Promise.all(promises).then(([sub]) => sub);
  }

  public async findMySubscription(companyId: string, authUserId: string): Promise<Subscription[]> {
    await this.employmentService.verifyPermission(authUserId, companyId);

    return this.subscriptionRepo.find({ where: { companyId } });
  }
}
