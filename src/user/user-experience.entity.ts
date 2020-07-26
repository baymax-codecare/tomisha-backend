import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserActity } from '../shared/entity/user-activity';

@Entity({ name: 'user-experiences' })
export class UserExperience extends UserActity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('smallint', { nullable: true })
  public type: number;

  @Column('smallint', { nullable: true })
  public professionId: number;

  @Column('smallint', { nullable: true })
  public progress: number;

  @Column('smallint', { nullable: true })
  public level: number;
}
