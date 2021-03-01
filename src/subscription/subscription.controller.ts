import { Body, Controller, Get, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateSubscriptionDto } from './dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public findCompanySubscriptions(@Query('companyId', ParseUUIDPipe) companyId: string, @Req() req: Request) {
    return this.subscriptionService.findMySubscription(companyId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() req: Request) {
    return this.subscriptionService.create(createSubscriptionDto, req.user.id);
  }
}
