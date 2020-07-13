import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('auth.facebook.clientId'),
      clientSecret: configService.get('auth.facebook.secret'),
      callbackURL: 'http://localhost:3100/api/auth/redirect/facebook',
      profileFields: ['id', 'email', 'name', 'picture'],
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void): Promise<void> {
    const { email, first_name, last_name, picture: { data: { url: picture = null } = {} } = {} } = {} = profile._json || {};

    const existedUser = await this.userService.findOne({ where: { email } });
    if (existedUser) {
      return done(null, {
        id: existedUser.id,
        email,
        firstName: existedUser.firstName,
        lastName: existedUser.lastName,
        picture: existedUser.picture,
      });
    }

    done(null, {
      email,
      firstName: first_name,
      lastName: last_name,
      picture,
      isNew: true,
    });
  }
}
