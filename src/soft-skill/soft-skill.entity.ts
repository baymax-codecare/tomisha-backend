import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'soft-skills' })
export class SoftSkill {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('smallint')
  public skillId: number;

  @Column('smallint')
  public level: number;

  @Column({ length: 500, nullable: true })
  public description: string;

  @Column('uuid', { nullable: true })
  public jobId: string;

  @Column('uuid', { nullable: true })
  public userId: string;

  @ManyToOne(() => User, user => user.softSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;
}
