import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Company } from 'src/company/company.entity';

@Entity({ name: 'company-users' })
export class CompanyUser {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column('uuid', { nullable: true })
  public companyId: string;

  @Index()
  @Column('uuid', { nullable: true })
  public userId: string;

  @Column('smallint', { array: true, nullable: true })
  public rights: number[];

  @ManyToOne(() => Company, company => company.companyUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  public company: Company;

  @ManyToOne(() => User, user => user.companyUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;
}
