import { IsString, Length, IsOptional } from 'class-validator';

export class FindUsersDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  public firstName?: string;

  @IsString()
  @Length(1, 250)
  @IsOptional()
  public lastName?: string;
}
