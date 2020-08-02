import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Occupation } from './occupation.entity';

@Entity({ name: 'occupation-preferences' })
export class OccupationPreference {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public occupationId: string;

  @Column('smallint')
  public preferenceId: number;

  @Column('smallint')
  public level: number;

  @ManyToOne(() => Occupation, occu => occu.preferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occupationId' })
  public occupation: Occupation;
}
