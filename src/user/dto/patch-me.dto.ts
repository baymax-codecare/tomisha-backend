import { IsEnum, IsString, IsOptional, Length, IsDateString, IsArray, IsInt, MaxLength } from 'class-validator';
import { UserType } from '../type/user-type.enum';
import { UserStatus } from '../type/user-status.enum';
import { UserGender } from '../type/user-gender.enum';
import { UserMaritalStatus } from '../type/user-marital-status.enum';
import { UserSkill } from '../user-skill.entity';
import { UserDocument } from '../user-document.entity';
import { UserExperience } from '../user-experience.entity';
import { User } from '../user.entity';
import { UserLanguage } from '../user-language.entity';
import { UserSchool } from '../user-school.entity';
import { UserTraining } from '../user-training.entity';
import { UserFile } from '../user-file.entity';

export class PatchMeDto {
  @IsInt()
  @IsOptional()
  public progress: number;

  @IsEnum(UserType)
  @IsOptional()
  public type: UserType;

  @IsEnum(UserStatus)
  @IsOptional()
  public status: UserStatus;

  @IsEnum(UserGender)
  @IsOptional()
  public gender: UserGender;

  @IsEnum(UserMaritalStatus)
  @IsOptional()
  public maritalStatus: UserMaritalStatus;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public firstName: string;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public lastName: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  public cover: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  public picture: string;

  @IsString()
  @Length(1, 3)
  @IsOptional()
  public country: string;

  @IsString()
  @Length(1, 3)
  @IsOptional()
  public nationality: string;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public street: string;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public city: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  public zip: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  public phone: string;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public pob: string;

  @IsDateString()
  @IsOptional()
  public dob: string;

  @IsArray()
  @IsOptional()
  public hobbies: number[];

  @IsArray()
  @IsOptional()
  public documents: UserDocument[];

  @IsArray()
  @IsOptional()
  public languages: UserLanguage[];

  @IsArray()
  @IsOptional()
  public schools: UserSchool[];

  @IsArray()
  @IsOptional()
  public trainings: UserTraining[];

  @IsArray()
  @IsOptional()
  public skills: UserSkill[];

  @IsArray()
  @IsOptional()
  public experiences: UserExperience[];

  @IsArray()
  @IsOptional()
  public files: UserFile[];

  @IsArray()
  @IsOptional()
  public references: User[];
}
