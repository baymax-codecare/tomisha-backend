import {  IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReferenceDto {
  @IsString()
  @MaxLength(1000)
  public description: string;

  @IsString()
  @MaxLength(500)
  public criterias: string;

  @IsString()
  @IsNotEmpty()
  public token: string;

  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  public rating: number;
}
