import { Column, Entity, PrimaryGeneratedColumn, Index, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { generate as generateSlug } from 'shortid';
import { UserStatus } from './type/user-status.enum';
import { UserType } from './type/user-type.enum';
import { UserGender } from './type/user-gender.enum';
import { UserMaritalStatus } from './type/user-marital-status.enum';
import { hash } from '../shared/utils';
import { Contact } from '../shared/entity/contact';
import { UserDocument } from './user-document.entity';
import { UserExperience } from './user-experience.entity';
import { UserSkill } from './user-skill.entity';
import { UserLanguage } from './user-language.entity';
import { UserSchool } from './user-school.entity';
import { UserTraining } from './user-training.entity';
import { UserFile } from './user-file.entity';
import { CompanyUser } from 'src/company-user/company-user.entity';

@Entity({ name: 'users' })
export class User extends Contact {
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

  @Column('smallint', { default: 0 })
  public progress: number;

  @Index()
  @Column('smallint', { default: UserStatus.AVAILABLE_ACTIVELY })
  public status: UserStatus;

  @Column('smallint', { nullable: true })
  public gender: UserGender;

  @Column('smallint', { nullable: true })
  public maritalStatus: UserMaritalStatus;

  @Column({ nullable: true, length: 250 })
  public firstName: string;

  @Column({ nullable: true, length: 250 })
  public lastName: string;

  @Column({ nullable: true, length: 250 })
  public cover: string;

  @Column({ nullable: true, length: 250 })
  public picture: string;

  @Column({ nullable: true, length: 3 })
  public country: string;

  @Column({ nullable: true, length: 250 })
  public street: string;

  @Column({ nullable: true, length: 250 })
  public city: string;

  @Column({ nullable: true, length: 50 })
  public zip: string;

  @Column({ nullable: true, length: 50 })
  public phone: string;

  @Column('date', { nullable: true })
  public dob: Date;

  @Column({ nullable: true, length: 3 })
  public nationality: string;

  @Column({ nullable: true, length: 500 })
  public pob: string;

  @Column('smallint', { array: true, nullable: true })
  public hobbies: number[];

  @OneToMany(() => UserDocument, userDoc => userDoc.user, { cascade: true })
  public documents: UserDocument[];

  @OneToMany(() => UserLanguage, userLang => userLang.user, { cascade: true })
  public languages: UserLanguage[];

  @OneToMany(() => UserSchool, userSchool => userSchool.user, { cascade: true })
  public schools: UserTraining[];

  @OneToMany(() => UserTraining, userTr => userTr.user, { cascade: true })
  public trainings: UserTraining[];

  @OneToMany(() => UserSkill, userSkill => userSkill.user, { cascade: true })
  public skills: UserSkill[];

  @OneToMany(() => UserExperience, userExp => userExp.user, { cascade: true })
  public experiences: UserExperience[];

  @OneToMany(() => UserFile, userFile => userFile.user, { cascade: true })
  public files: UserFile[];

  @ManyToMany(() => User)
  @JoinTable()
  public references: User[];

  @OneToMany(() => CompanyUser, userComp => userComp.user, { cascade: true })
  public companyUsers: CompanyUser[];

  @BeforeInsert()
  public beforeInsert(): void {
    this.password = hash(this.password);
    this.slug = generateSlug();
  }
}
