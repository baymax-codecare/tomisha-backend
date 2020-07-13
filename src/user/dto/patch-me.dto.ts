import { IsEnum } from 'class-validator';
import { UserType } from '../user.entity';

export class PatchMeDto {
  @IsEnum(UserType)
  public type: UserType;
}