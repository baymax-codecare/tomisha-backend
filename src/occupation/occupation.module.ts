import { Module } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { OccupationController } from './occupation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Occupation } from './occupation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Occupation])],
  providers: [OccupationService],
  controllers: [OccupationController]
})
export class OccupationModule {}
