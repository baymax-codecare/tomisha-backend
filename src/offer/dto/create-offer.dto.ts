import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateOfferDto {
  @IsUUID()
  @IsNotEmpty()
  public applicationId: number;

  @IsUUID()
  @IsNotEmpty()
  public companyId: string;

  @IsInt()
  @IsNotEmpty()
  public staffId: number;

  @IsUUID()
  @IsNotEmpty()
  public branchId: string;

  @IsUUID()
  @IsNotEmpty()
  public agentId: string;

  @IsUUID()
  @IsNotEmpty()
  public agencyId: string;

  @Type(() => Date)
  @IsDate()
  public startAt: Date;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  public message?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  public agentMessage?: string;
}
