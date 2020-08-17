import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { AuthUser } from 'src/auth/type/auth-user.interface';
import { CreateApplicationDto } from './dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  public findMyApplications(authUser: AuthUser): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { userId: authUser.id },
      relations: [
        'occupation',
        'company',
        'job',
      ],
    });
  }

  public findOne(slug: string): Promise<Application> {
    return this.applicationRepository.findOneOrFail({
      where: { slug },
      relations: [
        'occupation',
        'company',
        'job',
      ],
    });
  }

  public create(createApplicationDto: CreateApplicationDto, authUser: AuthUser): Promise<Application> {
    const application = this.applicationRepository.create(createApplicationDto);
    application.userId = authUser.id;

    return this.applicationRepository.save(application);
  }
}
