import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AdminDashboardService } from './admin-dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, AdminDashboardService],
  exports: [DashboardService, AdminDashboardService],
})
export class DashboardModule {}
