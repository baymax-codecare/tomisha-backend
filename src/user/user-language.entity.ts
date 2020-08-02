import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserActivity } from '../shared/entity/user-activity';

@Entity({ name: 'user-languages' })
export class UserLanguage extends UserActivity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50, nullable: true })
  public lang: string;

  @Column({ length: 250, nullable: true })
  public title: string;

  @Column('smallint', { nullable: true })
  public level: number;
}
