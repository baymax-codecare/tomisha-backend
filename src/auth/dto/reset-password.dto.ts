import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @Length(8, 50)
  public newPassword: string;

  @IsString()
  @IsNotEmpty()
  public token: string;
}