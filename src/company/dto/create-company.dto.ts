import { IsString, Length, IsDateString, IsInt, Min, Max, MaxLength } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  @Length(1, 250)
  public name: string;

  @IsString()
  @MaxLength(250)
  public cover: string;

  @IsString()
  @Length(1, 250)
  public email: string;

  @IsString()
  @MaxLength(250)
  public picture: string;

  @IsString()
  public slogan: string;

  @IsString()
  public description: string;

  @IsString()
  public website: string;

  @IsDateString()
  public foundedAt: string;

  @IsInt()
  @Min(0)
  @Max(100000)
  public totalPermanents: number;

  @IsInt()
  @Min(0)
  @Max(100000)
  public totalInterns: number;

  @IsInt()
  @Min(0)
  @Max(100000)
  public size: number;
}
