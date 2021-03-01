import { Controller, UseGuards, Get, Query, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SearchUserDto, FindUsersDto, FindUserDto } from './dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public search(@Query() findUsersDto: FindUsersDto, @Req() req: Request) {
    return this.userService.search(findUsersDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('single')
  public searchOne(@Query() searchUserDto: SearchUserDto, @Req() req: Request) {
    return this.userService.searchOne(searchUserDto, req.user.id)
  }

  @Get(':slug')
  public findOneBySlug (@Param('slug') slug: string, @Query() findUserDto: FindUserDto, @Req() req: Request): Promise<User> {
    return this.userService.findOne({ slug, occupationId: findUserDto.occupationId }, req.user?.id);
  }
}
