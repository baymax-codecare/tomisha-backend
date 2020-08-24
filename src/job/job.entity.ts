import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, BeforeInsert, Index } from 'typeorm';
import { EntityTimestamp } from 'src/shared/entity/timestamp';
import { User } from '../user/user.entity';
import { JobProfession } from './job-profession.entity';
import { CompanyLocation } from 'src/company-location/company-location.entity';
import { CompanyUser } from 'src/company-user/company-user.entity';
import { Company } from 'src/company/company.entity';
import { JobSkill } from './job-skill.entity';
import { JobStatus } from './type/JobStatus.enum';
import { generateSlug } from 'src/shared/utils';

@Entity({ name: 'jobs' })
export class Job extends EntityTimestamp {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column('uuid', { nullable: true })
  public companyId: string;

  @Column('uuid', { nullable: true })
  public creatorId: string;

  @Index()
  @Column('smallint')
  public professionId: number;

  @Index()
  @Column()
  public slug: string;

  @Index()
  @Column('smallint', { default: JobStatus.OPEN })
  public status: JobStatus;

  @Column({ length: 250 })
  public title: string;

  @Column({ length: 250, nullable: true })
  public cover: string;

  @Index()
  @Column({ nullable: true, default: true })
  public public: boolean;

  @Column('smallint', { array: true, nullable: true })
  public genders: number[];

  @Column('smallint', { array: true, nullable: true })
  public relationships: number[];

  @Column('smallint', { default: 0 })
  public minWorkload: number;

  @Column('smallint', { default: 100 })
  public maxWorkload: number;

  @Column({ nullable: true })
  public tasks: string;

  @Column({ nullable: true })
  public benefits: string;

  @Column({ nullable: true })
  public requirements: string;

  @Index()
  @Column('date', { nullable: true })
  public publishAt: Date;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  public company: Company;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public creator: User;

  @OneToMany(() => JobProfession, jobPro => jobPro.job, { cascade: true })
  public professions: JobProfession[];

  @OneToMany(() => JobSkill, jobSkill => jobSkill.job, { cascade: true })
  public skills: JobSkill[];

  @ManyToMany(() => CompanyLocation)
  @JoinTable()
  public locations: CompanyLocation[];

  @ManyToMany(() => CompanyUser)
  @JoinTable()
  public companyUsers: CompanyUser[];

  @BeforeInsert()
  public beforeInsert(): void {
    this.slug = generateSlug();
  }
}
