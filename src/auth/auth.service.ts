import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

import { UserService } from '../user/user.service';
import { compareHash, hash, getExpiresAt } from '../shared/utils';
import { AuthUser } from './type/auth-user.interface';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, RegisterDto } from './dto';
import { VerificationService } from 'src/verification/verification.service';

const FORGOT_PW_EXP_SEC = 24 * 60 * 60; // 1d
const VERIFY_EMAIL_EXP_SEC = 24 * 60 * 60; // 1d

const EMAIL_TOKEN_KEY_PREFIX = 'vrf';
const FORGOT_PW_TOKEN_KEY_PREFIX = 'pw';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private verificationService: VerificationService,
  ) {}

  public async validateUser(email: string, pass: string): Promise<AuthUser> {
    const user = await this.userService.findOne({
      where: { email: email?.toLowerCase?.().trim() },
      select: ['id', 'email', 'password', 'type', 'firstName', 'lastName', 'picture', 'progress'],
    });
    if (user && compareHash(pass, user.password)) {
      delete user.password;
      return user;
    } else {
      throw new BadRequestException('Email or password is incorrect');
    }
  }

  public async login(user: any) {
    return {
      user,
      accessToken: this.jwtService.sign({
        id: user.id,
        email: user.email,
        type: user.type,
      }),
      expiresAt: getExpiresAt(this.configService.get('auth.expiresIn')),
    };
  }

  public async getLoginCallbackUrl(user: any) {
    const token = this.jwtService.sign(user);
    const userStr = encodeURIComponent(JSON.stringify(user));
    const expiresAt = encodeURIComponent(getExpiresAt(this.configService.get('auth.expiresIn')));
    return this.configService.get('auth.callbackHref') + `?token=${token}&user=${userStr}&expiresAt=${expiresAt}`;
  }

  public async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { email, firstName, lastName } = verifyEmailDto;
    const existedUser = await this.userService.findOne({ where: { email }, select: ['id'] });
    if (!!existedUser) {
      throw new BadRequestException('Email is already in use');
    }

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bitte bestätige deine E-Mail-Adresse',
      template: 'verify-email',
      context: {
        firstName,
        lastName,
        expHours: Math.round(VERIFY_EMAIL_EXP_SEC / 3600),
        tokenUrl: await this.createVerifyEmailTokenUrl({
          email,
          firstName,
          lastName,
        }),
      },
    });
  }

  public createVerifyEmailTokenUrl(payload: any): Promise<string> {
    return this.verificationService.createTokenUrl({
      prefix: EMAIL_TOKEN_KEY_PREFIX,
      key: payload.email,
      payload,
      expiresIn: VERIFY_EMAIL_EXP_SEC,
      callbackHref: this.configService.get('auth.verifiedHref')
    })
  }

  public async registerLocal(registerDto: RegisterDto): Promise<any> {
    const { password, token, captcha, type } = registerDto;

    const hcaptchaUrl = `https://hcaptcha.com/siteverify?secret=${this.configService.get('hcaptcha.secret')}&response=${captcha}`;
    const hcaptchaResponse = await fetch(hcaptchaUrl, { method: 'post' });
    const json = await hcaptchaResponse.json();
    if (!json.success) {
      throw new BadRequestException('hCaptcha verification fail');
    }

    const tokenPayload = await this.verificationService.validateToken({
      prefix: EMAIL_TOKEN_KEY_PREFIX,
      decodedKey: 'email',
      token,
    });

    const newUser = await this.userService.create({
      password,
      type,
      email: tokenPayload.email,
      firstName: tokenPayload.firstName,
      lastName: tokenPayload.lastName,
      picture: tokenPayload.picture,
    });

    delete newUser.password;
    return newUser;
  }

  public async findOrCreateUser(user: any) {
    const existedUser = await this.userService.findOne({ where: { email: user.email } });
    return existedUser || this.userService.create(user);
  }

  public async changePassword(user: AuthUser, changePasswordDto: ChangePasswordDto) {
    const me = await this.userService.findOne({ where: { id: user.id }, select: ['id', 'password'] });

    if (me && compareHash(me.password, changePasswordDto.oldPassword)) {
      return this.userService.update(me.id, { password: hash(changePasswordDto.newPassword) });
    }

    throw new BadRequestException('Password is incorrect');
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findOne({ where: { email }, select: ['id', 'email', 'firstName', 'lastName'] });

    if (!user) {
      return;
    }

    const tokenUrl = await this.verificationService.createTokenUrl({
      prefix: FORGOT_PW_TOKEN_KEY_PREFIX,
      key: user.id,
      payload: {
        id: user.id,
        email: user.email,
      },
      expiresIn: FORGOT_PW_EXP_SEC,
      callbackHref: this.configService.get('auth.resetPasswordHref'),
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Dein Passwort zurücksetzen',
      template: 'forgot-pw-email',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        tokenUrl,
        expHours: Math.round(VERIFY_EMAIL_EXP_SEC / 3600),
      },
    })
      .catch(() => {
        throw new InternalServerErrorException('Server cannot send email');
      });
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    const tokenPayload = await this.verificationService.validateToken({
      prefix: FORGOT_PW_TOKEN_KEY_PREFIX,
      decodedKey: 'id',
      token,
    });

    await this.userService.update(tokenPayload.id, {
      password: hash(newPassword),
    });
  }
}
