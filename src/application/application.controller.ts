import { Controller, Get, Req, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public findMyApplications(@Req() req) {
    return this.applicationService.findMyApplications(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  public findOne(@Param('slug') slug: string) {
    return this.applicationService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public create(@Body() createApplicationDto: CreateApplicationDto, @Req() req) {
    return this.applicationService.create(createApplicationDto, req.user);
  }
}
