import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './company.entity';
import { SearchCompanyDto, CreateCompanyDto, FindCompanyDto, UpdateCompanyDto } from './dto';
import { AuthUser } from 'src/auth/type/auth-user.interface';
import { CompanyUser } from 'src/company-user/company-user.entity';
import { UserService } from 'src/user/user.service';
import { VerificationService } from 'src/verification/verification.service';
import { getExpiresAt } from 'src/shared/utils';

const COMPANY_EMAIL_EXPIRES_IN = 432000;
const COMPANY_EMAIL_KEY_PREFIX = 'ckp';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private userService: UserService,
    private mailService: MailerService,
    private configService: ConfigService,
    private verificationService: VerificationService,
  ) {}

  public async findMyCompanies(userId: string): Promise<Company[]> {
    return this.companyRepository
      .createQueryBuilder('c')
      .innerJoin('c.companyUsers', 'cu')
      .innerJoin('c.locations', 'loc')
      .where('cu.userId = :userId', { userId })
      .select(['c', 'loc'])
      .getMany();
  }

  public async findOne(findCompanyDto: FindCompanyDto): Promise<Company> {
    const { id, slug, userId } = findCompanyDto;
    if (id || slug) {
      return this.companyRepository.findOne({
        where: id ? { id } : { slug },
        relations: ['locations', 'companyUsers', 'companyUsers.user'],
      });
    } else {
      const company = await this.companyRepository
        .createQueryBuilder('c')
        .leftJoin('c.locations', 'loc')
        .innerJoin('c.companyUsers', 'cu')
        .innerJoin('cu.user', 'user')
        .where('cu.userId = :userId', { userId })
        .select(['c', 'loc', 'cu', 'user.id', 'user.email', 'user.picture', 'user.firstName', 'user.lastName', 'user.street'])
        .getOne();
      return company;
    }
  }

  public async create(authUser: AuthUser, createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);

    const user = await this.userService.findOne({ where: { id: authUser.id } });

    company.companyUsers = [{
      userId: user.id,
      rights: [1, 2, 3, 4],
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        street: user.street,
      },
    } as CompanyUser];

    company.emailExpireAt = new Date(getExpiresAt(COMPANY_EMAIL_EXPIRES_IN));

    const newCompany = await this.companyRepository.save(company);

    await this.mailService.sendMail({
      to: company.email,
      subject: 'Bitte bestätige deine E-Mail-Adresse',
      template: 'verify-email',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        tokenUrl: await this.verificationService.createTokenUrl({
          prefix: COMPANY_EMAIL_KEY_PREFIX,
          key: company.email,
          payload: {
            id: newCompany.id,
            email: company.email,
          },
          expiresIn: COMPANY_EMAIL_EXPIRES_IN,
          callbackHref: this.configService.get('domain') + 'company/verify-callback',
        }),
        expHours: Math.round(COMPANY_EMAIL_EXPIRES_IN / 3600),
      },
    })

    return newCompany;
  }

  public update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(updateCompanyDto);
    company.id = id;

    return this.companyRepository.save(company);
  }

  public async verifyCallback(token: string): Promise<void> {
    const tokenPayload = await this.verificationService.validateToken({
      token,
      prefix: COMPANY_EMAIL_KEY_PREFIX,
      decodedKey: 'email',
    });

    await this.companyRepository.update(tokenPayload.id, { emailExpireAt: null });
  }

  public search(searchCompanyDto: SearchCompanyDto): Promise<Company[]> {
    const { country, zip, city, name, ...where } = searchCompanyDto;
    const qb = this.companyRepository
      .createQueryBuilder('c')
      .leftJoin('c.locations', 'loc')

    for (const key of Object.keys(where)) {
      qb.andWhere(`c.${key} = :${key}`, { [key]: where[key] });
    }

    if (name) {
      qb.andWhere('c.name LIKE :name', { name: `%${name}%` });
    }

    if (country && zip && city) {
      qb
        .andWhere('loc.country = :country', { country })
        .andWhere('loc.zip = :zip', { zip })
        .andWhere('loc.city = :city', { city });
    }

    return qb
      .select(['c', 'loc'])
      .take(5)
      .getMany();
  }
}
