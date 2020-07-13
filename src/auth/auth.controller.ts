import { Controller, Request, Post, UseGuards, Res, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, RegisterDto, VerifyEmailDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Res() res): Promise<void> {
    await this.authService.verifyEmail(verifyEmailDto);
    res.sendStatus(200)
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.registerLocal(registerDto);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('facebook'))
  @Get('facebook')
  public async facebookAuth() {}

  @UseGuards(AuthGuard('facebook'))
  @Get('redirect/facebook')
  public async facebookAuthRedirect(@Req() req, @Res() res) {
    if (!!req.user?.isNew) {
      const tokenUrl = await this.authService.createVerifyEmailTokenUrl(req.user);
      res.redirect(tokenUrl);
    } else {
      const href = await this.authService.getLoginCallbackUrl(req.user);
      res.redirect(href);
    }
  }

  // @UseGuards(AuthGuard('google'))
  // @Get('google')
  // public async googleAuth() {}

  // @UseGuards(AuthGuard('google'))
  // @Get('redirect/google')
  // public async googleAuthRedirect(@Req() req, @Res() res) {
  //   if (!!req.user?.isNew) {
  //     const tokenUrl = await this.authService.createVerifyEmailTokenUrl(req.user);
  //     res.redirect(tokenUrl);
  //   } else {
  //     const href = await this.authService.getLoginCallbackUrl(req.user);
  //     res.redirect(href);
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Post('password/change')
  public async changePassword(@Request() req, @Res() res, @Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.changePassword(req.user, changePasswordDto);
    res.sendStatus(200);
  }

  @Post('password/forgot')
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Res() res) {
    await this.authService.forgotPassword(forgotPasswordDto);
    res.sendStatus(200);
  }

  @Post('password/reset')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res) {
    await this.authService.resetPassword(resetPasswordDto);
    res.sendStatus(200);
  }
}