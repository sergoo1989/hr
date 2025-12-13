import { Module } from '@nestjs/common';
import { TerminationService } from './termination.service';

@Module({
  providers: [TerminationService],
  exports: [TerminationService],
})
export class TerminationModule {}
