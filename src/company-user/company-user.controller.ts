import { Controller, Get, Query, Post, Body, Param, Put, ParseUUIDPipe, UseGuards, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompanyUserService } from './company-user.service';
import { FindCompanyUsersDto } from './dto/find-company-users.dto';
import { CreateCompanyUserDto, UpdateCompanyUserDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('company-user')
export class CompanyUserController {
  constructor(
    private companyUserService: CompanyUserService,
    private congiService: ConfigService,
  ) {}

  @Get()
  public find(@Query() findCompanyUsersDto: FindCompanyUsersDto) {
    return this.companyUserService.find(findCompanyUsersDto);
  }

  @Post('invite')
  public invite(@Body() createCompanyUserDto: CreateCompanyUserDto, @Req() req) {
    return this.companyUserService.invite(req.user, createCompanyUserDto);
  }

  @Get('invite-callback')
  public async inviteCallback(@Query('token') token: string, @Res() res) {
    await this.companyUserService.inviteCallback(token);
    res.redirect(this.congiService.get('webAppDomain'));
  }

  @Put(':id')
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyUserDto: UpdateCompanyUserDto) {
    return this.companyUserService.update(id, updateCompanyUserDto);
  }
}
