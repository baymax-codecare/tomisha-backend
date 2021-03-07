import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationService } from 'src/application/application.service';
import { JobLog } from 'src/job-log/job-log.entity';
import { JobLogService } from 'src/job-log/job-log.service';
import { JobLogAction } from 'src/job-log/type/job-log-action.enum';
import { EmploymentService } from 'src/employment/employment.service';
import { EmploymentPermission } from 'src/employment/type/employment-permission.enum';
import { UserStatus } from 'src/user/type/user-status.enum';
import { In, Not, Repository } from 'typeorm';
import { CreateOfferDto, CreateOfferLogDto, FindOffersDto } from './dto';
import { Offer } from './offer.entity';
import { EmploymentRole } from 'src/employment/type/employment-role.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepo: Repository<Offer>,
    private employmentService: EmploymentService,
    private applicationService: ApplicationService,
    private jobLogService: JobLogService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  public async findMyOffers(authUserId: string, agencyId?: string): Promise<{ items: Offer[], total: number }> {
    if (agencyId) {
      await this.employmentService.verifyPermission(authUserId, agencyId);
    }

    const qb = this.offerRepo
      .createQueryBuilder('of')
      .innerJoin('of.job', 'job')
      .innerJoin('job.profession', 'prof')
      .innerJoin('job.branch', 'bran')
      .innerJoinAndMapOne('bran.address', 'bran.addresses', 'addr');

    if (agencyId) {
      qb
        .where('of.agentId = :authUserId', { authUserId })
        .andWhere('of.agencyId = :agencyId', { agencyId });
    } else {
      qb.where('of.userId = :authUserId', { authUserId });
    }

    return qb
      .andWhere(qb =>
        'NOT EXISTS ' + qb.subQuery()
          .select('log.id')
          .from(JobLog, 'log')
          .where('log.offerId = of.id')
          .andWhere('log.action >= :yesAction', { yesAction: JobLogAction.YES })
          .getQuery()
      )
      .select([
      'of.id',
      'of.updatedAt',
      'prof.id',
      'prof.title',
      'job.id',
      'job.title',
      'bran.id',
      'bran.name',
      'bran.status',
      'bran.picture',
      'addr.zip',
      'addr.city',
    ])
    .orderBy('of.updatedAt', 'DESC')
    .getManyAndCount()
    .then(([items, total]) => ({ items, total }));
  }

  public async find(findOffersDto: FindOffersDto, authUserId: string): Promise<{ items: Offer[], total: number}> {
    const { jobId, companyId, status } = findOffersDto;

    await this.employmentService.verifyPermission(authUserId, companyId, EmploymentPermission.VIEW_APPLICATION);

    const qb = this.offerRepo
      .createQueryBuilder('of')
      .innerJoin('of.application', 'ap')
      .innerJoin('ap.occupation', 'oc')
      .innerJoin('oc.profession', 'prof')
      .innerJoin('of.user', 'user')
      .innerJoin('of.job', 'job');

    if (companyId) {
      qb.where('(of.companyId = :companyId OR of.agencyId = :companyId)', { companyId });
    }

    if (jobId) {
      qb.andWhere('of.jobId = :jobId', { jobId })
    }

    if (status) {
      qb.leftJoin('of.logs', 'log', 'log.action = :status', { status });
    } else {
      qb.leftJoin('of.logs', 'log');
    }

    return qb
      .andWhere('user.status NOT IN (:...userInactiveStatuses)', { userInactiveStatuses: [UserStatus.LOCKED, UserStatus.DEACTIVATED] })
      .select([
        'of.id',
        'of.userId',
        'of.companyId',
        'of.agencyId',
        'of.updatedAt',
        'log',
        'prof.title',
        'ap.id',
        'oc.id',
        'oc.shortDescription',
        'job.id',
        'job.title',
        'user.id',
        'user.picture',
        'user.status',
        'user.slug',
        'user.firstName',
        'user.lastName',
      ])
      .orderBy('of.updatedAt', 'DESC')
      .take(100)
      .getManyAndCount()
      .then(([items, total]) => ({ items, total }));
  }

  public async findOne(id: number, authUserId: string, companyId?: string, agencyId?: string): Promise<Offer> {
    const cId = companyId || agencyId
    if (cId) {
      await this.employmentService.verifyPermission(authUserId, cId, EmploymentPermission.VIEW_APPLICATION);
    }

    const qb = this.offerRepo
      .createQueryBuilder('of')
      .innerJoin('of.job', 'job')
      .innerJoin('job.profession', 'prof')
      .innerJoin('of.occupation', 'oc')
      .innerJoin('of.logs', 'log')
      .innerJoin('of.branch', 'bran')
      .leftJoinAndMapOne('bran.address', 'bran.addresses', 'badd')
      .innerJoin('of.staff', 'staf')
      .leftJoin('staf.user', 'suser')
      .leftJoin('staf.profession', 'sprof')
      .leftJoin('staf.branch', 'sbran')
      .leftJoin('of.agent', 'agent')
      .leftJoin('agent.user', 'asuser')
      .leftJoin('agent.profession', 'asprof')
      .leftJoin('agent.branch', 'asbran')
      .select([
        'of.id',
        'of.message',
        'of.agentMessage',
        'of.startAt',
        'job.id',
        'job.slug',
        'job.title',
        'prof.id',
        'prof.title',
        'log',
        'oc.id',
        'oc.slug',
        'bran.id',
        'bran.slug',
        'bran.picture',
        'bran.status',
        'bran.name',
        'badd.zip',
        'badd.city',
        'staf.id',
        'suser.id',
        'suser.slug',
        'suser.picture',
        'suser.status',
        'suser.firstName',
        'suser.lastName',
        'sprof.id',
        'sprof.title',
        'sbran.name',
        'agent.id',
        'asuser.id',
        'asuser.slug',
        'asuser.picture',
        'asuser.status',
        'asuser.firstName',
        'asuser.lastName',
        'asprof.id',
        'asprof.title',
        'asbran.name',
      ])
      .where('of.id = :id', { id });

    if (companyId) {
      qb.andWhere('of.companyId = :companyId', { companyId });
    } else if (agencyId) {
      qb.andWhere('of.agencyId = :agencyId', { agencyId });
    } else {
      qb.andWhere('of.userId = :authUserId', { authUserId });
    }

    const offer = await qb.getOne();

    if (!offer) {
      throw new NotFoundException();
    }

    if (!companyId && offer.userId !== authUserId) {
      delete offer.message;
    } else {
      delete offer.agentMessage;
    }

    return offer;
  }

  public async create(createOfferdto: CreateOfferDto, authUserId: string): Promise<Offer> {
    const [application] = await Promise.all([
      this.applicationService.applicationRepo.findOneOrFail({
        where: {
          id: createOfferdto.applicationId,
          companyId: createOfferdto.companyId
        },
        select: ['jobId', 'userId']
      }),

      this.employmentService.verifyPermission(authUserId, createOfferdto.companyId),

      this.jobLogService.jobLogRepo
        .count({
          action: Not(JobLogAction.DELETE),
          applicationId: createOfferdto.applicationId,
        })
        .then((log) => {
          if (log) {
            throw new BadRequestException('Offer already exists');
          }
        }),
    ]);

    const offer = this.offerRepo.create(createOfferdto);
    offer.userId = application.userId;
    offer.jobId = application.jobId;

    const newOffer = await this.offerRepo.save(offer);

    this.jobLogService.jobLogRepo.insert({ applicationId: application.id, action: JobLogAction.YES, userId: createOfferdto.companyId });

    return newOffer;
  }

  public async createOfferLog(createOfferLogDto: CreateOfferLogDto, authUserId: string): Promise<void> {
    const { action, offerId, offerIds = [], companyId, agencyId } = createOfferLogDto;
    const ids = offerIds.concat(offerId).filter(Boolean);

    const cId = companyId || agencyId;
    if (cId) {
      await this.employmentService.verifyPermission(authUserId, cId);
    }

    const qb = this.offerRepo
      .createQueryBuilder('of')
      .leftJoin('of.logs', 'log', 'log.action >= :yesAction', { yesAction: JobLogAction.YES })
      .leftJoin('of.agentEmployment', 'employment')
      .leftJoin('of.application', 'ap')
      .leftJoin('of.job', 'job')
      .select(['of.id', 'of.companyId', 'of.userId', 'log.userId', 'ap.occupationId', 'job'])
      .where('of.id IN (:...ids)', { ids });

    if (agencyId) {
      qb.andWhere('of.agencyId = :agencyId', { agencyId });
    } else if (companyId) {
      qb.andWhere('of.companyId = :companyId', { companyId });
    } else {
      qb.andWhere('of.userId = :authUserId', { authUserId });
    }

    const offers = await qb.getMany();

    const validOffers = []
    offers.forEach((offer) => {
      const valid = !offer.logs.some(log => log.action !== JobLogAction.YES || log.userId === authUserId)
      if (valid) {
        const isFinished = !offer.agentId ||
          isLogAccepted(offer.logs, authUserId === offer.userId ? offer.agentId : offer.userId);
        if (isFinished) {
          offer['isFinished'] = true;
        }

        validOffers.push(offer)
      }
    });

    if (!validOffers.length) {
      return;
    }

    this.offerRepo.update({ id: In(validOffers) }, { updatedAt: new Date() });

    const jobLogs = ids.map(offerId => ({ offerId, action, userId: companyId || agencyId || authUserId }));

    await this.jobLogService.jobLogRepo.insert(jobLogs);

    validOffers.forEach((offer) => {
      if (offer['isFinished']) {
        this.employmentService.employmentRepo.insert({
          userId: offer.userId,
          companyId: offer.companyId,
          occupationId: offer.application.occupationId,
          branchId: offer.job.branchId,
          professionId: offer.job.professionId,
          role: EmploymentRole.EMPLOYEE,
          relationships: offer.job.relationships,
          minWorkload: offer.job.minWorkload,
          maxWorkload: offer.job.maxWorkload,
          level: offer.job.level,
          years: offer.job.years,
          startedAt: offer.startAt,
        });

        this.userService.userRepo.update({ id: offer.userId }, { status: UserStatus.UNAVAILABLE })
      }
    });
  }
}

function isLogAccepted(logs, userId) {
  return logs.find(log => log.userId === userId)?.action === JobLogAction.YES;
}
