import { Controller, Get, Query, Post, Body, Param, Put, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CompanyLocationService } from './company-location.service';
import { FindCompanyLocationsDto } from './dto/find-company-locations.dto';
import { CreateCompanyLocationDto, UpdateCompanyLocationDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('company-location')
export class CompanyLocationController {
  constructor(private companyLocationService: CompanyLocationService) {}

  @Get()
  public find(@Query() findCompanyLocationsDto: FindCompanyLocationsDto) {
    return this.companyLocationService.find(findCompanyLocationsDto);
  }

  @Post()
  public create(@Body() createCompanyLocationDto: CreateCompanyLocationDto) {
    return this.companyLocationService.create(createCompanyLocationDto);
  }

  @Put(':id')
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyLocationDto: UpdateCompanyLocationDto) {
    return this.companyLocationService.update(id, updateCompanyLocationDto);
  }
}
