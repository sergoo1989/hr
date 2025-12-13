import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DocumentExpiryScheduler } from './document-expiry.scheduler';

@Controller('scheduler')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SchedulerController {
  constructor(private scheduler: DocumentExpiryScheduler) {}

  /**
   * GET /api/scheduler/check-documents - فحص يدوي للمستندات
   */
  @Get('check-documents')
  async manualCheck() {
    return this.scheduler.manualCheck();
  }

  /**
   * GET /api/scheduler/expiry-report - تقرير المستندات المنتهية
   */
  @Get('expiry-report')
  async getExpiryReport() {
    return this.scheduler.getExpiryReport();
  }
}
