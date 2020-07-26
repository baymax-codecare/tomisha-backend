import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserActity } from '../shared/entity/user-activity';

@Entity({ name: 'user-schools' })
export class UserSchool extends UserActity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 250, nullable: true })
  public title: string;
}
