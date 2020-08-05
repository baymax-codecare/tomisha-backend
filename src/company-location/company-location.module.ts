import { Module } from '@nestjs/common';
import { CompanyLocationService } from './company-location.service';
import { CompanyLocationController } from './company-location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyLocation } from './company-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyLocation])],
  providers: [CompanyLocationService],
  controllers: [CompanyLocationController]
})
export class CompanyLocationModule {}
