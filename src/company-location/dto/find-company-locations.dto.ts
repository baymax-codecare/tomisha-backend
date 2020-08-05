import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindCompanyLocationsDto {
  @IsUUID()
  @IsNotEmpty()
  public companyId: string;
}
