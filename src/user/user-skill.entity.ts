import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user-skills' })
export class UserSkill {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('uuid')
  public userId: string;

  @Column('smallint')
  public skillId: number;

  @Column('smallint')
  public level: number;

  @ManyToOne(() => User, user => user.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;
}
