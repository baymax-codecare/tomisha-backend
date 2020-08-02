import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FileEntity } from 'src/shared/entity/file';
import { Occupation } from './occupation.entity';
import { Company } from 'src/company/company.entity';

@Entity({ name: 'occupation-experiences' })
export class OccupationExperience extends FileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('smallint', { nullable: true })
  public type: number;

  @Column('smallint', { nullable: true })
  public professionId: number;

  @Column('smallint', { nullable: true })
  public workload: number;

  @Column('smallint', { nullable: true })
  public level: number;

  @Column('date')
  public start: Date;

  @Column('date')
  public end: Date;

  @Column({ nullable: true })
  public description: string;

  @Column('uuid', { nullable: true })
  public companyId: string;

  @Column('uuid')
  public occupationId: string;

  @ManyToOne(() => Occupation, occu => occu.experiences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occupationId' })
  public occupation: Occupation;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  public company: Company;
}
