import { Controller, Patch, UseGuards, Body, Req, Get } from '@nestjs/common';
import { Request } from 'express';

import { PatchMeDto } from './dto';
import { UserService } from './user.service';
import { User } from './user.entity';

import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private userService: UserService) {}

  @Patch()
  public patchPersonalInfo(@Body() patchMeDto: PatchMeDto, @Req() req: Request): Promise<User> {
    return this.userService.patchPersonalInfo(patchMeDto, req.user.id);
  }

  @Get()
  public getMe(@Req() req: Request): Promise<User> {
    return this.userService.findMe(req.user.id);
  }

  @Get('brief')
  public getBriefMe(@Req() req: Request): Promise<User> {
    return this.userService.getBriefMe(req.user.id);
  }
}
