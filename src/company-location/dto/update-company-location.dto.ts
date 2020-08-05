import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCompanyLocationDto } from './create-company-location.dto';

export class UpdateCompanyLocationDto extends PartialType(
  OmitType(CreateCompanyLocationDto, ['companyId']),
) {}

