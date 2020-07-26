import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserActity } from '../shared/entity/user-activity';

@Entity({ name: 'user-trainings' })
export class UserTraining extends UserActity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 250, nullable: true })
  public title: string;

  @Column('smallint', { nullable: true })
  public type: number;
}
