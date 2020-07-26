import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'nestjs-redis';
import fetch from 'node-fetch';

import { UserService } from '../user/user.service';
import { compareHash, hash } from '../shared/utils';
import { AuthUser } from './type/auth-user.interface';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, RegisterDto } from './dto';

const FORGOT_PW_EXP_SEC = 24 * 60 * 60; // 1d
const VERIFY_EMAIL_EXP_SEC = 24 * 60 * 60; // 1d

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private redisService: RedisService,
    private configService: ConfigService,
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
      expiresAt: this.getExpDate(this.configService.get('auth.expiresIn')),
    };
  }

  public async getLoginCallbackUrl(user: any) {
    const token = this.jwtService.sign(user);
    const userStr = encodeURIComponent(JSON.stringify(user));
    const expiresAt = encodeURIComponent(this.getExpDate(this.configService.get('auth.expiresIn')));
    return this.configService.get('auth.callbackHref') + `?token=${token}&user=${userStr}&expiresAt=${expiresAt}`;
  }

  public async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { email, firstName, lastName } = verifyEmailDto;
    const existedUser = await this.userService.findOne({ where: { email }, select: ['id'] });
    if (!!existedUser) {
      throw new BadRequestException('Email is already in use');
    }

    const tokenUrl = await this.createVerifyEmailTokenUrl({
      email,
      firstName,
      lastName,
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bitte bestätige deine E-Mail-Adresse',
      template: 'verify-email',
      context: {
        firstName,
        lastName,
        tokenUrl,
        expHours: Math.round(VERIFY_EMAIL_EXP_SEC / 3600),
      },
    });
  }

  public createVerifyEmailTokenUrl(payload: any): Promise<string> {
    return this.createTokenUrl({
      key: this.genVerifyEmailKey(payload.email),
      payload,
      exp: VERIFY_EMAIL_EXP_SEC,
      callbackHref: this.configService.get('auth.verifiedHref'),
    })
  }

  public async registerLocal(registerDto: RegisterDto): Promise<any> {
    const { password, token, captcha } = registerDto;

    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${this.configService.get('recaptcha.secret')}&response=${captcha}`;
    const recaptchaResponse = await fetch(recaptchaUrl, { method: 'post' });
    const json = await recaptchaResponse.json();
    if (!json.success) {
      throw new BadRequestException('reCaptcha verification fail');
    }

    const newUser = await this.validateToken(token, 'email', this.genVerifyEmailKey, (decoded) => {;
      return this.userService.create({
        email: decoded.email,
        password,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        picture: decoded.picture,
      });
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

    const tokenUrl = await this.createTokenUrl({
      key: this.genForgotPasswordKey(user.id),
      payload: {
        id: user.id,
        email: user.email,
      },
      exp: FORGOT_PW_EXP_SEC,
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

    const redisClient = await this.redisService.getClient();
    const decoded = this.jwtService.verify(token);
    const key = this.genForgotPasswordKey(decoded.id);
    const savedToken = await redisClient.get(key);
    if (!decoded || !decoded.id || !savedToken || token !== savedToken) {
      throw new BadRequestException('Reset password URL is invalid or has been expired');
    }

    await this.validateToken(token, 'id', this.genForgotPasswordKey, (decoded) => {;
      return this.userService.update(decoded.id, {
        password: hash(newPassword),
      });
    });
  }

  private async createTokenUrl(opts: any) {
    const { key, payload, exp = 86400, callbackHref } = opts;
    const token = this.jwtService.sign(payload, { expiresIn: exp, noTimestamp: true });

    const redisClient = await this.redisService.getClient();
    await redisClient.set(key, token, 'EX', exp);

    const tokenUrl = `${callbackHref}?token=${token}&expiresAt=${encodeURIComponent(this.getExpDate(FORGOT_PW_EXP_SEC))}`;

    return tokenUrl;
  }

  private getExpDate(exp) {
    return new Date(Date.now() + exp * 1000).toUTCString();
  }

  private async validateToken(token: string, key: string, makeKey: (id: string) => string, cb: Function) {
    const decoded = this.jwtService.verify(token);

    if (decoded?.[key]) {
      const savedKey = makeKey(decoded[key]);
      const redisClient = await this.redisService.getClient();
      const savedToken = await redisClient.get(savedKey);

      if (savedToken === token) {
        const output = await cb(decoded);

        redisClient.del(savedKey);

        return output
      }
    }

    throw new BadRequestException('The token URL is invalid or has been expired');
  }

  private genForgotPasswordKey(id: string) {
    return `pw:${id}`;
  }

  private genVerifyEmailKey(email: string) {
    return `vrf:${email}`;
  }
}