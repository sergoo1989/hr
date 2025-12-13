import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { DocumentExpiryScheduler } from './document-expiry.scheduler';

@Module({
  controllers: [SchedulerController],
  providers: [DocumentExpiryScheduler],
  exports: [DocumentExpiryScheduler],
})
export class SchedulerModule {}
