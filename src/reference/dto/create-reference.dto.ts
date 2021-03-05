import {  IsInt, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class CreateReferenceDto {
  @IsUUID()
  @IsNotEmpty()
  public notificationId: string;

  @IsString()
  @MaxLength(1000)
  public description: string;

  @IsString()
  @MaxLength(500)
  public criterias: string;

  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  public rating: number;
}
