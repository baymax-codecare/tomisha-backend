import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Contact } from 'src/shared/entity/contact';
import { Company } from '../company/company.entity';

@Entity({ name: 'company-locations' })
export class CompanyLocation extends Contact {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true, length: 500 })
  public name: string;

  @Column('uuid', { nullable: true })
  public companyId: string;

  @ManyToOne(() => Company, company => company.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  public company: Company;
}