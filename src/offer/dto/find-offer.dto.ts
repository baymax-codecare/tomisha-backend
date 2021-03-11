import { IsOptional, IsUUID } from 'class-validator';

export class FindOfferDto {
  @IsUUID()
  @IsOptional()
  public companyId?: string;
}
