import { IsString, Length } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  @Length(1, 250)
  public name: string;

  @IsString()
  @Length(1, 250)
  public cover: string;

  @IsString()
  @Length(1, 250)
  public picture: string;

  @IsString()
  public slogan: string;

  @IsString()
  public description: string;

  @IsString()
  public website: string;
}
