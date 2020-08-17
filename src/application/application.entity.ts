import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { generate as generateSlug } from 'shortid';
import { EntityTimestamp } from 'src/shared/entity/timestamp';
import { User } from 'src/user/user.entity';
import { Job } from 'src/job/job.entity';
import { Occupation } from 'src/occupation/occupation.entity';
import { Company } from 'src/company/company.entity';

@Entity({ name: 'applications' })
export class Application extends EntityTimestamp {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { nullable: true })
  public userId: string;

  @Column('uuid')
  public jobId: string;

  @Column('uuid')
  public occupationId: string;

  @Column('uuid')
  public companyId: string;

  @Column()
  public slug: string;

  @Column('smallint', { default: 1 })
  public status: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  public job: Job;

  @ManyToOne(() => Occupation)
  @JoinColumn({ name: 'occupationId' })
  public occupation: Occupation;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  public company: Company;

  @BeforeInsert()
  public beforeInsert(): void {
    this.slug = generateSlug();
  }
}
