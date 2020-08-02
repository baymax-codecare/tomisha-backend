import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserActivity } from '../shared/entity/user-activity';

@Entity({ name: 'user-trainings' })
export class UserTraining extends UserActivity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 250, nullable: true })
  public title: string;

  @Column('smallint', { nullable: true })
  public type: number;
}
