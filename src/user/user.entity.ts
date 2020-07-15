import { Column, Entity, PrimaryGeneratedColumn, Index, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import { hash } from '../shared/utils';
import * as shortid from 'shortid';

export enum UserType {
  EMPLOYEE = 1,
  EMPLOYER = 2,
  AGENCY = 3,
}

export enum UserStatus {
  READY = 1,
  DISABLED = 0,
}

export enum UserGener {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

export enum UserCivilStatus {
  SINGLE = 1,
  MARRIED = 2,
  IN_A_RELATIONSHIP = 3,
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({ unique: true })
  @Column()
  public email: string;

  @Exclude()
  @Column({ select: false })
  public password: string;

  @Column('smallint', { nullable: true })
  public type: UserType;

  @Index({ unique: true })
  @Column()
  public slug: string;

  @Column({ nullable: true, default: false })
  public verified: boolean;

  @Index()
  @Column('smallint', { default: UserStatus.READY })
  public status: UserStatus;

  @Column('smallint', { nullable: true })
  public gender: UserGener;

  @Column('smallint', { nullable: true })
  public civilStatus: UserCivilStatus;

  @Column({ nullable: true })
  public firstName: string;

  @Column({ nullable: true })
  public lastName: string;

  @Column({ nullable: true })
  public phone: string;

  @Column({ nullable: true })
  public picture: string;

  @Column('date', { nullable: true })
  public dob: Date;

  @Column({ nullable: true })
  public cover: string;

  @Column({ nullable: true })
  public coutry: string;

  @Column({ nullable: true })
  public city: string;

  @Column({ nullable: true })
  public street: string;

  @Column({ nullable: true, length: 500 })
  public address: string;

  @Column({ nullable: true })
  public postcode: string;

  @Column({ nullable: true })
  public nationality: string;

  @Column({ nullable: true })
  public pob: string;

  @Column({ nullable: true })
  public residentPermit: string;

  @Column({ nullable: true })
  public driveLicense: string;

  @Column()
  public createdAt: Date;

  @BeforeInsert()
  public beforeInsert(): void {
    this.createdAt = new Date();
    this.password = hash(this.password);
    this.slug = shortid.generate();
  }
}
