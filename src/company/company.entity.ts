import { Entity, PrimaryGeneratedColumn, Column, Index, BeforeInsert, OneToMany } from 'typeorm';
import { generate as generateSlug } from 'shortid';
import { CompanyStatus } from './type/company-status.enum';
import { EntityTimestamp } from 'src/shared/entity/timestamp';
import { CompanyLocation } from './company-location.entity';
import { UserCompany } from 'src/user-company/user-company.entity';

@Entity({ name: 'companies' })
export class Company extends EntityTimestamp {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({ unique: true })
  @Column()
  public email: string;

  @Index()
  @Column('time', { nullable: true })
  public emailExpireAt: Date;

  @Index({ unique: true })
  @Column()
  public slug: string;

  @Index()
  @Column('smallint', { default: CompanyStatus.ENABLED })
  public status: CompanyStatus;

  @Column({ nullable: true, length: 500 })
  public name: string;

  @Column({ nullable: true, length: 250 })
  public cover: string;

  @Column({ nullable: true, length: 250 })
  public picture: string;

  @Column({ nullable: true })
  public slogan: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public website: string;

  @Column('date', { nullable: true })
  public foundedAt: Date;

  @Column('smallint', { nullable: true })
  public size: number;

  @Column('smallint', { nullable: true })
  public totalPermanents: number;

  @Column('smallint', { nullable: true })
  public totalInterns: number;

  @OneToMany(() => CompanyLocation, companyLoc => companyLoc.company, { cascade: true })
  public locations: CompanyLocation[];

  @OneToMany(() => UserCompany, userComp => userComp.company, { cascade: true })
  public userCompanies: UserCompany[];

  @BeforeInsert()
  public beforeInsert(): void {
    this.slug = generateSlug();
  }
}
