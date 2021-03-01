import { IsString, IsUUID, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { EmploymentRole } from '../type/employment-role.enum';

export class CreateEmploymentDto {
  @IsString()
  public token: string;

  @IsUUID()
  public branchId: string;

  @IsEnum(EmploymentRole)
  public role: EmploymentRole;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  public password?: string;
}
