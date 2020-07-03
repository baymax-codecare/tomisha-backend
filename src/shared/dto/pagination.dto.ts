import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationDto<T> {
  @IsString()
  @IsOptional()
  public order?: keyof T;

  @Transform((v) => v === 'true')
  @IsBoolean()
  @IsOptional()
  public asc?: boolean;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public skip?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public take?: number;
}