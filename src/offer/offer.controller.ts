import { Controller, Get, Req, Param, Post, Body, UseGuards, ParseIntPipe, Res, Query, ParseUUIDPipe } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto, CreateOfferLogDto, FindMyOffersDto, FindOffersDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request, Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get()
  public find(@Query() findOffersDto: FindOffersDto, @Req() req: Request) {
    return this.offerService.find(findOffersDto, req.user.id);
  }

  @Get('me')
  public findMyOffers(@Query() findMyOffersDto: FindMyOffersDto, @Req() req: Request) {
    return this.offerService.findMyOffers(req.user.id, findMyOffersDto.agencyId);
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Query('companyId', ParseUUIDPipe) companyId: string) {
    return this.offerService.findOne(id, req.user.id, companyId);
  }

  @Post()
  public create(@Body() createOfferDto: CreateOfferDto, @Req() req: Request) {
    return this.offerService.create(createOfferDto, req.user.id);
  }

  @Post('log')
  public async log(@Body() createAPplicationLogDto: CreateOfferLogDto, @Req() req: Request, @Res() res: Response) {
    await this.offerService.createOfferLog(createAPplicationLogDto, req.user.id);
    res.sendStatus(200);
  }
}
