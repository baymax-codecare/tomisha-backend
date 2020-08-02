import { Controller } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ConfigService } from '@nestjs/config';

@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private configService: ConfigService,
  ) {}
}
