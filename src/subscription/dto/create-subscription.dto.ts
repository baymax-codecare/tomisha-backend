import { IsInt, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  public planId?: string;

  @IsInt()
  public jobAmount?: number;

  @IsString()
  @IsNotEmpty()
  public stripeToken: string;

  @IsUUID()
  public companyId: string;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  public password: string;
}
