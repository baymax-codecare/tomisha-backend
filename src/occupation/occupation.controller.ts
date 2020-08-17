import { Controller, Get, Req, Param, Post, Body, UseGuards } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { CreateOccupationDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('occupation')
export class OccupationController {
  constructor(private occupationService: OccupationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public findMyOccupations(@Req() req) {
    return this.occupationService.findMyOccupations(req.user);
  }

  @Get(':slug')
  public findOne(@Param('slug') slug: string) {
    return this.occupationService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public create(@Body() createOccupationDto: CreateOccupationDto, @Req() req) {
    return this.occupationService.create(createOccupationDto, req.user);
  }
}
