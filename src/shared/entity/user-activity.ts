import { Column, ManyToOne, JoinColumn } from 'typeorm';
import { FileEntity } from 'src/shared/entity/file';
import { User } from 'src/user/user.entity';
import { Company } from 'src/company/company.entity';

export abstract class UserActivity extends FileEntity {
  @Column('date')
  public start: Date;

  @Column('date')
  public end: Date;

  @Column({ nullable: true })
  public description: string;

  @Column('uuid', { nullable: true })
  public userId: string;

  @Column('uuid', { nullable: true })
  public companyId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  public company: Company;
}
