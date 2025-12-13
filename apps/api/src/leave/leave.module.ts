import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';

@Module({
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
