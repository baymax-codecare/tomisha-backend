import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { IsInt, IsOptional, MaxLength, IsString, Min, Max, IsArray } from 'class-validator';
import { Job } from '../job.entity';
import { Transform } from 'class-transformer';

export class FindJobsDto extends PaginationDto<Job> {
  @IsInt()
  @IsOptional()
  public professionId?: number;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  public title?: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  public city?: string;

  @IsString()
  @MaxLength(3)
  @IsOptional()
  public country?: string;

  @Transform((v) => +v)
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  public minWorkload?: number;

  @Transform((v) => +v)
  @IsInt()
  @Min(0)
  @Max(100000)
  @IsOptional()
  public maxWorkload?: number;

  @Transform((v) => +v)
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  public minSize?: number;

  @Transform((v) => +v)
  @IsInt()
  @Min(0)
  @Max(100000)
  @IsOptional()
  public maxSize?: number;

  @Transform((v) => +v)
  @IsArray()
  @IsOptional()
  public relationships?: number[]
}
