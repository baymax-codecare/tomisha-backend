import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { IsInt, IsOptional, MaxLength, IsString, Min, Max, IsNumber, IsUUID } from 'class-validator';
import { Job } from '../job.entity';
import { Type } from 'class-transformer';

export class FindJobsDto extends PaginationDto<Job> {
  @IsUUID()
  @IsOptional()
  public companyId?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public professionId?: number;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  public title?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  public minWorkload?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  public maxWorkload?: number;

  @IsString()
  @IsOptional()
  public sizes?: string;

  @IsString()
  @IsOptional()
  public relationships?: string;

  @IsString()
  @IsOptional()
  public branchIds?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  public city?: String;

  @IsString()
  @MaxLength(3)
  @IsOptional()
  public country?: String;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public lat?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public lng?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public miles?: number;
}
