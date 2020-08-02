import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { AssetModule } from './asset/asset.module';
import { GlobalJwtModule } from './shared/jwt.module';
import { OccupationModule } from './occupation/occupation.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
      isGlobal: true,
    }),

    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('isProd') ? [] : [
          {
            rootPath: configService.get('uploadDir'),
            serveRoot: '/public',
          },
        ]
      }
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

    GlobalJwtModule,

    ScheduleModule.forRoot(),

    AuthModule,

    UserModule,

    AssetModule,

    OccupationModule,

    CompanyModule,
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