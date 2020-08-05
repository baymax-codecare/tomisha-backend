import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindCompanyUsersDto {
  @IsUUID()
  @IsNotEmpty()
  public companyId: string;
}
