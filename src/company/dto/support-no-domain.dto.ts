import { Transform } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { Address } from 'src/address/address.entity';

export class SupportNoDomainDto {
  @IsString()
  @MaxLength(250)
  public firstName: string;

  @IsString()
  @MaxLength(250)
  public lastName: string;

  @IsObject()
  public address: Address;

  @IsString()
  @MaxLength(50)
  public phone: string;

  @Transform((email) => email?.toLowerCase?.().trim())
  @IsEmail()
  public email: string;

  @Transform((email) => email?.toLowerCase?.().trim())
  @IsEmail()
  public businessEmail: string;

  @IsString()
  @MaxLength(500)
  public name: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  public website?: string;

  @IsString()
  @MaxLength(500)
  public message: string;
}
