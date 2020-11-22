import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { FindCompanyUsersDto, CreateCompanyUserDto, UpdateCompanyUserDto } from './dto';
import { CompanyUser } from './company-user.entity';
import { VerificationService } from 'src/verification/verification.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from 'src/auth/type/auth-user.interface';

const COMPANY_USER_EMAIL_EXPIRES_IN = 30 * 3600
const COMPANY_USER_EMAIL_KEY_PREFIX = 'cur'

@Injectable()
export class CompanyUserService {
  constructor(
    @InjectRepository(CompanyUser)
    private companyUserRepository: Repository<CompanyUser>,
    private userService: UserService,
    private mailService: MailerService,
    private verificationService: VerificationService,
    private configService: ConfigService,
  ) {}

  public find(findCompanyUsersDto: FindCompanyUsersDto): Promise<CompanyUser[]> {
    return this.companyUserRepository.find({ where: findCompanyUsersDto, relations: ['user'] });
  }

  public async invite(authUser: AuthUser, createCompanyUserDto: CreateCompanyUserDto): Promise<CompanyUser> {
    const [user, inviter] = await Promise.all([
      this.userService.findOne({ where: { id: createCompanyUserDto.userId } }),
      this.userService.findOne({ where: { id: authUser.id } }),
    ]);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.mailService.sendMail({
      to: user.email,
      subject: `${inviter.firstName} ${inviter.lastName} via Tomisha`,
      template: 'company-user-invitation',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        picture: inviter.picture,
        inviter: inviter.firstName + ' ' + inviter.lastName,
        tokenUrl: await this.verificationService.createTokenUrl({
          prefix: COMPANY_USER_EMAIL_KEY_PREFIX,
          key: user.email,
          payload: {
            email: user.email,
            ...createCompanyUserDto,
          },
          expiresIn: COMPANY_USER_EMAIL_EXPIRES_IN,
          callbackHref: this.configService.get('domain') + 'company-user/invite-callback',
        }),
        expHours: Math.round(COMPANY_USER_EMAIL_EXPIRES_IN / 3600),
      },
    })

    const companyUser = this.companyUserRepository.create(createCompanyUserDto);

    return this.companyUserRepository.save(companyUser);
  }

  public async inviteCallback(token): Promise<void> {
    const tokenPayload = await this.verificationService.validateToken({
      token,
      prefix: COMPANY_USER_EMAIL_KEY_PREFIX,
      decodedKey: 'email',
    });

    const companyUser = this.companyUserRepository.create({
      userId: tokenPayload.userId,
      companyId: tokenPayload.companyId,
      rights: tokenPayload.rights,
    });

    await this.companyUserRepository.save(companyUser);
  }

  public update(id: string, updateCompanyUserDto: UpdateCompanyUserDto): Promise<CompanyUser> {
    const companyUser = this.companyUserRepository.create(updateCompanyUserDto);
    companyUser.id = id;

    return this.companyUserRepository.save(companyUser);
  }
}
