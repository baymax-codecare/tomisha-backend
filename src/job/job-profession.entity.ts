import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';

@Entity({ name: 'job-professions' })
export class JobProfession {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { nullable: true })
  public jobId: string;

  @Column('uuid')
  public professionId: string;

  @Column('smallint', { default: 0 })
  public level: number;

  @Column('smallint', { default: 0 })
  public years: number;

  @Column()
  public description: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  public job: Job;
}
