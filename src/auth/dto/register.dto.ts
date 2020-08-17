import { IsNotEmpty, IsString, Length, IsJWT } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(8, 50)
  public password: string;

  @IsString()
  @IsJWT()
  @IsNotEmpty()
  public token: string;

  @IsString()
  @IsNotEmpty()
  public captcha: string;
}
