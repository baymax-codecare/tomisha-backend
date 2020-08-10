import { Transform } from 'class-transformer';
import { IsString, Length, IsOptional, IsEmail } from 'class-validator';

export class SearchCompanyDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  public name?: string;

  @IsString()
  @Length(1, 3)
  @IsOptional()
  public country?: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  public zip?: string;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public city?: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  public phone?: string;

  @Transform(v => typeof v === 'string' ? v.toLowerCase().trim() : v)
  @IsEmail()
  @IsOptional()
  public email?: string;
}
