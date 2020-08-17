import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import { generate as generateSlug } from 'shortid';
import { User } from '../user/user.entity';
import { OccupationPreference } from './occupation-preference.entity';
import { OccupationSkill } from './occupation-skill.entity';
import { OccupationExperience } from './occupation-expereience.entity';
import { EntityTimestamp } from 'src/shared/entity/timestamp';

@Entity({ name: 'occupations' })
export class Occupation extends EntityTimestamp {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { nullable: true })
  public userId: string;

  @Column('smallint')
  public professionId: number;

  @Column()
  public slug: string;

  @Column('smallint', { default: 0 })
  public minWorkload: number;

  @Column('smallint', { default: 100 })
  public maxWorkload: number;

  @Column('smallint', { array: true, nullable: true })
  public relationships: number[];

  @Column({ length: 250, nullable: true })
  public skill: string;

  @Column({ nullable: true })
  public skillDescription: string;

  @Column({ nullable: true })
  public shortDescription: string;

  @OneToMany(() => OccupationPreference, occuPref => occuPref.occupation, { cascade: true })
  public preferences: OccupationPreference[];

  @OneToMany(() => OccupationSkill, occuSkill => occuSkill.occupation, { cascade: true })
  public skills: OccupationSkill[];

  @OneToMany(() => OccupationExperience, occuSkill => occuSkill.occupation, { cascade: true })
  public experiences: OccupationExperience[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @BeforeInsert()
  public beforeInsert(): void {
    this.slug = generateSlug();
  }
}
