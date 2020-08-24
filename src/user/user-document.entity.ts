import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { DocumentGroup } from './type/document-group.enum';
import { Company } from 'src/company/company.entity';

@Entity({ name: 'user-documents' })
export class UserDocument {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { nullable: true })
  public userId: string;

  @Column('uuid', { nullable: true })
  public companyId: string;

  @Column('smallint', { nullable: true })
  public group: DocumentGroup;

  @Column('smallint', { nullable: true })
  public type: number;

  @Column({ length: 250, nullable: true })
  public front: string;

  @Column({ length: 250, nullable: true })
  public back: string;

  @Column('date', { nullable: true })
  public issuedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  public company: Company;
}
