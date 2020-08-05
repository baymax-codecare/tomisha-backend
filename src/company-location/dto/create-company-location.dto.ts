import { IsString, Length, IsUUID, IsOptional } from "class-validator";

export class CreateCompanyLocationDto {
  @IsString()
  @Length(1, 500)
  public name: string;

  @IsUUID()
  public companyId: string;

  @IsString()
  @Length(1, 3)
  @IsOptional()
  public country: string;

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
}
