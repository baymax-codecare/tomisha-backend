import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule} from 'nestjs-redis';
import { Module } from '@nestjs/common';

import configuration from './config/configuration';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { ValidationPipe } from './shared/validation.pipe';
import { AllExceptionFilter } from './shared/exception.filter';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm'),
    }),

    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('redis'),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('mail'),
    }),

    ScheduleModule.forRoot(),

    AuthModule,

    UserModule,
  ],

  providers: [
    ...(process.env.NODE_ENV === 'production' ? [] : [{
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }]),
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})

export class AppModule {}