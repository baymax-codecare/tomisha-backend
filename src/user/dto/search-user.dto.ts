import { Transform } from 'class-transformer';
import { IsString, Length, IsOptional, IsEmail } from 'class-validator';

export class SearchUserDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  public firstName: string;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public lastName: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  public phone: string;

  @Transform(v => typeof v === 'string' ? v.toLowerCase().trim() : v)
  @IsEmail()
  @IsOptional()
  public email: string;

  @Transform(v => typeof v === 'string' ? v.toLowerCase().trim() : v)
  @IsEmail()
  @IsOptional()
  public businessEmail: string;
}
