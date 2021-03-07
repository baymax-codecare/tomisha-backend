import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EntityTimestamp } from 'src/shared/entity/timestamp';
import { User } from 'src/user/user.entity';
import { Job } from 'src/job/job.entity';
import { generateSlug } from 'src/shared/utils';
import { Employment } from 'src/employment/employment.entity';
import { Branch } from 'src/branch/branch.entity';
import { Application } from 'src/application/application.entity';
import { JobLog } from 'src/job-log/job-log.entity';

@Entity({ name: 'interviews' })
export class Interview extends EntityTimestamp {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('uuid')
  public userId: string;

  @Column('uuid')
  public jobId: string;

  @Column('uuid')
  public companyId: string;

  @Column()
  public applicationId: number;

  @Column({ nullable: true })
  public staffId: number;

  @Column('uuid')
  public branchId: string;

  @Column({ length: 50 })
  public slug: string;

  @Column({ length: 100, nullable: true })
  public message: string;

  @Column({ nullable: true })
  public startAt: Date;

  @OneToMany(() => JobLog, jobLog => jobLog.interview)
  public logs: JobLog[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  public job: Job;

  @ManyToOne(() => Employment)
  @JoinColumn({ name: 'staffId' })
  public staff: Employment;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branchId' })
  public branch: Branch;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'companyId' })
  public company: User;

  @ManyToOne(() => Application)
  @JoinColumn({ name: 'applicationId' })
  public application: Application;

  @BeforeInsert()
  public beforeInsert(): void {
    this.slug = generateSlug();
  }
}
