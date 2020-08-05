import { Module, Global } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Global()
@Module({
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
