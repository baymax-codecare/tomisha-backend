import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUserService } from './company-user.service';
import { CompanyUserController } from './company-user.controller';
import { CompanyUser } from './company-user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyUser]),
    UserModule,
  ],
  providers: [CompanyUserService],
  controllers: [CompanyUserController],
})
export class CompanyUserModule {}
