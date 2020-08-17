import { IsUUID, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsUUID()
  public jobId: string;

  @IsUUID()
  public occupationId: string;

  @IsUUID()
  public companyId: string;
}
