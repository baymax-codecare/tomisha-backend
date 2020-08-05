import { IsUUID, IsArray } from "class-validator";

export class CreateCompanyUserDto {
  @IsUUID()
  public companyId: string;

  @IsUUID()
  public userId: string;

  @IsArray()
  public rights: number[];
}
