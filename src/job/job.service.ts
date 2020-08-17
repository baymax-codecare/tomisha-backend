import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Like, Any } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto, FindJobsDto } from './dto';
import { AuthUser } from 'src/auth/type/auth-user.interface';
import { JobStatus } from './type/JobStatus.enum';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  public find(findJobsDto: FindJobsDto): Promise<{ items: Job[], total: number }> {
    const {
      order = 'publishAt',
      asc = false,
      skip = 0,
      take = 20,
      title,
      relationships,
      ...where
    } = findJobsDto;

    Object.assign(where, {
      public: true,
      publishAt: LessThanOrEqual(new Date().toISOString()),
      status: JobStatus.OPEN,
    });

    if (title) {
      Object.assign(where, {
        title: Like(`%${title}%`),
      });
    }

    if (relationships) {
      Object.assign(where, {
        relationships: Any(relationships),
      });
    }

    return this.jobRepository
      .findAndCount({
        where,
        take,
        skip,
        order: { [order]: asc ? 'ASC' : 'DESC' },
      })
      .then(([items, total]) => ({ items, total }));
  }

  public findOne(slug: string): Promise<Job> {
    return this.jobRepository.findOneOrFail({ slug });
  }

  public create(createJobDto: CreateJobDto, authUser: AuthUser): Promise<Job> {
    const newJob = this.jobRepository.create(createJobDto);
    newJob.creatorId = authUser.id;

    return this.jobRepository.save(newJob);
  }
}
