import { IsInt, IsString, MaxLength, IsBoolean, IsArray, ArrayMinSize, ArrayUnique, Min, Max, IsDateString, IsObject } from 'class-validator';
import { Company } from 'src/company/company.entity';
import { JobSkill } from '../job-skill.entity';
import { CompanyLocation } from 'src/company-location/company-location.entity';
import { CompanyUser } from 'src/company-user/company-user.entity';
import { JobProfession } from '../job-profession.entity';

export class CreateJobDto {
  @IsInt()
  public professionId: number;

  @IsString()
  @MaxLength(250)
  public title: string;

  @IsString()
  @MaxLength(250)
  public cover: string;

  @IsBoolean()
  public public: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  public genders: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  public relationships: number[];

  @IsInt()
  @Min(0)
  @Max(100)
  public minWorkload: number;

  @IsInt()
  @Min(0)
  @Max(100)
  public maxWorkload: number;

  @IsString()
  @MaxLength(5000)
  public tasks: string;

  @IsString()
  @MaxLength(5000)
  public benefits: string;

  @IsString()
  @MaxLength(5000)
  public requirements: string;

  @IsDateString()
  public publishAt: Date;

  @IsObject()
  public company: Company;

  @IsArray()
  public skills: JobSkill[];

  @IsArray()
  public locations: CompanyLocation[];

  @IsArray()
  public companyUsers: CompanyUser[];

  @IsArray()
  public professions: JobProfession[];
}
