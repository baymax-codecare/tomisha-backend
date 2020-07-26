import { Controller, Patch, UseGuards, Body, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PatchMeDto } from './dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private userService: UserService) {}

  @Patch()
  public patchMe(@Body() patchMeDto: PatchMeDto, @Req() req): Promise<User> {
    return this.userService.update(req.user.id, patchMeDto);
  }

  @Get()
  public getMe(@Req() req): Promise<User> {
    return this.userService.findMe(req.user.id);
  }
}
