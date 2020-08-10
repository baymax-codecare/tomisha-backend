import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { filterObject } from 'src/shared/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public findOne(opts: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(opts);
  }

  public findMe(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: [
        'documents',
        'languages',
        'schools',
        'trainings',
        'skills',
        'experiences',
        'references',
        'files',
        'languages.company',
        'languages.company.locations',
        'schools.company',
        'schools.company.locations',
        'trainings.company',
        'trainings.company.locations',
        'experiences.company',
        'experiences.company.locations',
      ],
    });
  }

  public search(searchUserDto: SearchUserDto): Promise<User[]> {
    const {
      firstName,
      lastName,
      phone,
      email,
    } = searchUserDto;

    return this.userRepository.find({
      where: filterObject({ firstName, lastName, phone, email }),
      select: ['id', 'email', 'picture', 'firstName', 'lastName', 'slug'],
      take: 5,
    });
  }

  public async inviteReference(authUser: any, referenceId: string) {
    const [referencedUser, user] = await Promise.all([
      this.userRepository.findOne(referenceId),
      this.userRepository.findOne(authUser.id, { relations: ['references'] }),
    ]);
    if (!referencedUser || !user || user.references.some((ref) => ref.id === referenceId)) {
      return;
    }

    const token = this.jwtService.sign({
      referenceId,
      userId: user.id,
    });

    await this.mailerService.sendMail({
      to: referencedUser.email,
      subject: 'Andreas Zimmerman bittet um Referenz BestätigungBitte bestätige deine E-Mail-Adresse',
      template: 'reference-invitation',
      context: {
        firstName: referencedUser.firstName,
        lastName: referencedUser.lastName,
        tokenUrl: this.configService.get('domain') + 'user/reference-callback?token=' + token,
        invitor: user.firstName + ' ' + user.lastName,
        picture: user.picture,
      },
    });
  }

  public async acceptReferenceInvitation(token: string) {
    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      throw new BadRequestException('URL is invalid or has been expired');
    }

    const { referenceId, userId } = decoded;

    const [referencedUser, user] = await Promise.all([
      this.userRepository.findOne(referenceId),
      this.userRepository.findOne(userId, { relations: ['references'] }),
    ]);

    if (!referencedUser || !user) {
      throw new NotFoundException('User not found');
    }

    const i = user.references.findIndex((ref) => ref.id === referenceId);
    if (i !== -1) {
      return;
    }

    user.references.push(referencedUser);

    await this.userRepository.save(user);
  }

  public update(id: any, updateUserDto: any): Promise<User> {
    const user = this.userRepository.create(updateUserDto as User);
    user.id = id;

    return this.userRepository.save(user);
  }

  public create(createUserDto: any): Promise<User> {
    const user = this.userRepository.create(createUserDto as User);

    return this.userRepository.save(user);
  }
}
