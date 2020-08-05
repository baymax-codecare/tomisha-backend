import { Controller, UseGuards, Get, Query, Post, Body, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserService } from './user.service';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  public search(@Query() searchUserDto: SearchUserDto): Promise<User[]> {
    return this.userService.search(searchUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite-reference')
  public inviteReference(@Body('id') id: string, @Req() req) {
    return this.userService.inviteReference(req.user, id);
  }

  @Get('reference-callback')
  public async acceptInvitation(@Query('token') token: string, @Res() res) {
    await this.userService.acceptReferenceInvitation(token);
    res.redirect(this.configService.get('webAppDomain'));
  }
}
