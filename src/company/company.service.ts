import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { UserService } from 'src/user/user.service';
import { VerificationService } from 'src/verification/verification.service';
import { VerificationType } from 'src/verification/type/verification-type.enum';
import { NotificationService } from 'src/notification/notification.service';
import { EmploymentService } from 'src/employment/employment.service';
import { NotificationType } from 'src/notification/type/notification-type.enum';
import { RequestJoinDto } from './dto';
import { User } from 'src/user/user.entity';
import { UserType } from 'src/user/type/user-type.enum';
import { EmploymentPermission } from 'src/employment/type/employment-permission.enum';

const COMPANY_EMAIL_EXPIRES_IN = 86400 * 5;

@Injectable()
export class CompanyService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private mailService: MailerService,
    private verificationService: VerificationService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    @Inject(forwardRef(() => EmploymentService))
    private employmentService: EmploymentService,
  ) {}

  public async searchByEmail (email: string): Promise<User> {
    const company = await this.userService.userRepo.createQueryBuilder('co')
      .innerJoinAndMapOne('co.headquater', 'co.branches', 'br', 'br.isHeadquater')
      .select(['co.id', 'co.email', 'br.name', 'br.status', 'br.picture'])
      .where('co.email = :email', { email })
      .getOne();

    if (!company) {
      throw new NotFoundException();
    }

    return company;
  }

  public async getPublicCompany(slug: string): Promise<User> {
    return this.userService.userRepo.createQueryBuilder('com')
      .innerJoin('com.branches', 'bran')
      .leftJoinAndMapOne('bran.address', 'bran.addresses', 'addr')
      .where('com.slug = :slug', { slug })
      .select([
        'com.id',
        'com.slug',
        'com.status',
        'bran.id',
        'bran.slug',
        'bran.status',
        'bran.isHeadquater',
        'bran.picture',
        'bran.cover',
        'bran.name',
        'bran.description',
        'addr',
      ])
      .getOne();
  }

  public async getDetailById(companyId: string, authUserId: string): Promise<User> {
    await this.employmentService.verifyPermission(authUserId, companyId, EmploymentPermission.CREATE_BRANCH);

    return this.userService.userRepo.createQueryBuilder('com')
      .leftJoinAndSelect('com.branches', 'bra')
      .leftJoinAndMapOne('bra.address', 'bra.addresses', 'bad')
      .leftJoinAndSelect('com.staffs', 'sta')
      .leftJoinAndSelect('sta.profession', 'spr')
      .leftJoinAndSelect('sta.user', 'sus')
      .leftJoinAndMapOne('sus.address', 'sus.addresses', 'sad')
      .getOne();
  }

  public async verifyEmail(businessEmail: string, authUserId: string): Promise<void> {
    const email = businessEmail.toLowerCase().trim()

    if (!!(await this.userService.userRepo.findOne({ where: { email }, select: ['id'] }))) {
      throw new BadRequestException('Email is already in use');
    }

    const user = await this.userService.userRepo.findOne({ where: { id: authUserId }, select: ['id', 'firstName', 'lastName'] });

    await this.mailService.sendMail({
      to: email,
      subject: 'Bitte bestätige deine E-Mail-Adresse',
      template: 'verify-email',
      context: {
        receiverName: user.firstName + ' ' + user.lastName,
        href:  await this.verificationService.createTokenUrl({
          type: VerificationType.COMPANY_VERIFY_EMAIL,
          id: email,
          expiresIn: COMPANY_EMAIL_EXPIRES_IN,
        }),
        expHours: Math.round(COMPANY_EMAIL_EXPIRES_IN / 3600),
      },
    })
  }

  public async create(token: string, authUserId: string): Promise<User> {
    const [tokenPayload, authUser] = await Promise.all([
      this.verificationService.validateToken(token, { type: VerificationType.COMPANY_VERIFY_EMAIL }),
      this.userService.userRepo.findOneOrFail({ where: { id: authUserId }, select: ['type'] }),
    ]);
    const company = this.userService.userRepo.create({
      email: tokenPayload.id,
      type: authUser.type === UserType.AGENT ? UserType.AGENCY : UserType.COMPANY,
    });
    return this.userService.userRepo.save(company);
  }

  public async requestJoinCompany (requestJoinDto: RequestJoinDto, authUserId: string) {
    const { companyId } = requestJoinDto;
    const [company, sender] = await Promise.all([
      this.userService.userRepo.findOneOrFail({ where: { id: companyId }, select: ['email'] }),
      this.userService.userRepo.findOneOrFail({ where: { id: authUserId }, select: ['firstName', 'lastName', 'email'] }),
      this.employmentService.employmentRepo.findOne({ companyId, userId: authUserId }).then((employment) => {
        if (employment) {
          throw new BadRequestException('Already joined');
        }
      }),
    ]);

    const notification = await this.notificationService.create({
      type: NotificationType.COMPANY_JOIN_REQUEST,
      fromUserId: authUserId,
      companyId: requestJoinDto.companyId,
      message: requestJoinDto.message,
      minRole: EmploymentPermission.CREATE_EMPLOYEE,
    });

    const senderName = [sender.firstName, sender.lastName].filter(Boolean).join(' ');

    await this.mailService.sendMail({
      to: company.email,
      template: 'request-join-company',
      subject: 'Mitarbeiter hinzufügen?',
      context: {
        message: requestJoinDto.message,
        href: await this.verificationService.createTokenUrl({
          type: VerificationType.COMPANY_JOIN_REQUEST,
          id: authUserId + ':' + companyId,
          expiresIn: COMPANY_EMAIL_EXPIRES_IN,
          senderId: authUserId,
          receiverId: companyId,
          notificationId: notification.id,
          data: {
            semderEmail: sender.email,
            senderName,
          },
        }),
      }
    });
  }

  public async patchCompany(companyId: string, patchCompanyDto: any, authUserId: string): Promise<void> {
    await this.employmentService.verifyPermission(authUserId, companyId, EmploymentPermission.CREATE_BRANCH);

    const company = this.userService.userRepo.create({ id: companyId, ...patchCompanyDto });

    try {
      await this.userService.userRepo.save(company);
    } catch (e) {
      if (e?.code === '23505' && e.detail?.includes?.('slug')) {
        throw new BadRequestException('URL is already in use');
      } else {
        throw e;
      }
    }
  }
}
