import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserActivity } from '../shared/entity/user-activity';

@Entity({ name: 'user-schools' })
export class UserSchool extends UserActivity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 250, nullable: true })
  public title: string;
}
