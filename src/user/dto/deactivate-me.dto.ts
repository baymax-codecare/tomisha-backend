import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DeactivateMeDto {
  @IsString()
  @IsOptional()
  public message?: string;

  @IsInt()
  @IsOptional()
  public reason?: number;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
