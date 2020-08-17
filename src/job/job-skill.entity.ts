import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';

@Entity({ name: 'job-skills' })
export class JobSkill {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public jobId: string;

  @Column('smallint')
  public skillId: number;

  @Column('smallint')
  public level: number;

  @Column()
  public description: number;

  @ManyToOne(() => Job, job => job.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  public job: Job;
}
