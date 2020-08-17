import { Controller, UseGuards, Get, Query, Post, Body, Req, Res, Put, Param, ParseUUIDPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { SearchCompanyDto, CreateCompanyDto, FindCompanyDto, UpdateCompanyDto } from './dto';
import { Company } from './company.entity';

@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('single')
  public findCompany(@Query() findCompanyDto: FindCompanyDto): Promise<Company> {
    return this.companyService.findOne(findCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public findMyCompanies(@Req() req): Promise<Company[]> {
    return this.companyService.findMyCompanies(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public createCompany(@Body() createCompanyDto: CreateCompanyDto, @Req() req): Promise<Company> {
    return this.companyService.create(req.user, createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  public updateCompany(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  public search(@Query() searchCompanyDto: SearchCompanyDto): Promise<Company[]> {
    return this.companyService.search(searchCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-callback')
  public async verifyCallback(@Query('token') token: string, @Res() res): Promise<void> {
    await this.companyService.verifyCallback(token).catch(() => {});

    res.redirect(this.configService.get('webAppDomain'))
  }
}
