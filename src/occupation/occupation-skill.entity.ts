import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Occupation } from './occupation.entity';

@Entity({ name: 'occupation-skills' })
export class OccupationSkill {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public occupationId: string;

  @Column('smallint')
  public skillId: number;

  @Column('smallint')
  public level: number;

  @ManyToOne(() => Occupation, occu => occu.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occupationId' })
  public occupation: Occupation;
}
