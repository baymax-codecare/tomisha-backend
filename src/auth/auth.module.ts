import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { FacebookStrategy } from './fb.strategy';
import { FacebookMiddleware } from './fb.middleware';
// import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    UserModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    // GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FacebookMiddleware)
      .forRoutes({ path: 'auth/redirect/facebook', method: RequestMethod.GET });
  }
}