import { Type } from 'class-transformer';
import { IsDate, IsInt, Min, Max, IsArray, ArrayMinSize, ArrayUnique, IsString } from 'class-validator';

export class AcceptEmploymentInvitationDto {
  @IsString()
  public token: string;

  @IsInt()
  public professionId: number;

  @Type(() => Date)
  @IsDate()
  public startAt: Date;

  @IsInt()
  @Min(0)
  @Max(100)
  public minWorkload: number;

  @IsInt()
  @Min(0)
  @Max(100)
  public maxWorkload: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  public relationships: number[];
}
