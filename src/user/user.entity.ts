import { Column, Entity, PrimaryGeneratedColumn, Index, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import { hash } from '../shared/utils';

export enum UserStatus {
  READY = 1,
  DISABLED = 0,
}

export enum UserGener {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

@Entity({ name: 'exUsers' })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column()
  public username: string;

  @Index({ unique: true })
  @Column()
  public email: string;

  @Exclude()
  @Column({ select: false })
  public password: string;

  @Index()
  @Column('smallint', { default: UserStatus.READY })
  public status: UserStatus;

  @Column({ nullable: true })
  public fullName: string;

  @Column({ nullable: true })
  public phone: string;

  @Column('smallint', { nullable: true })
  public gender: UserGener;

  @Column('datetime', { nullable: true })
  public birthday: Date;

  @Column({ length: 500, nullable: true })
  public address: string;

  @Column('datetime')
  public createdAt: Date;

  @BeforeInsert()
  public setCreatedDate(): void {
    this.createdAt = new Date();
  }

  @BeforeInsert()
  public hashPassword(): void {
    this.password = hash(this.password);
  }
}
