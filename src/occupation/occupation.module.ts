import { Module } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { OccupationController } from './occupation.controller';

@Module({
  providers: [OccupationService],
  controllers: [OccupationController]
})
export class OccupationModule {}
