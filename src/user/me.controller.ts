import { Controller, Patch, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PatchMeDto } from './dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('me')
export class MeController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  public patchMe(@Body() patchMeDto: PatchMeDto, @Req() req): Promise<User> {
    return this.userService.update(req.user.id, patchMeDto);
  }
}
