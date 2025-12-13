import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DashboardService } from './dashboard.service';
import { AdminDashboardService } from './admin-dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
    private adminDashboardService: AdminDashboardService
  ) {}

  /**
   * GET /api/dashboard - لوحة التحكم الكاملة للإدارة
   * حسب الوثيقة: نموذج 7 - لوحة تحكم الإدارة
   */
  @Get()
  async getAdminDashboard() {
    return this.adminDashboardService.getAdminDashboard();
  }

  /**
   * GET /api/dashboard/stats - الإحصائيات السريعة
   */
  @Get('stats')
  async getQuickStats() {
    return this.adminDashboardService.getQuickStats();
  }

  @Get('stats/general')
  async getGeneralStats() {
    return this.dashboardService.getGeneralStats();
  }

  /**
   * GET /api/dashboard/charts - بيانات الرسوم البيانية
   */
  @Get('charts')
  async getChartData() {
    return this.adminDashboardService.getChartData();
  }

  /**
   * GET /api/dashboard/alerts/expiry - تنبيهات المستندات المنتهية
   * حسب الوثيقة: GET /api/admin/alerts/expiry
   */
  @Get('alerts/expiry')
  async getExpiringDocumentsAlert() {
    return this.adminDashboardService.getExpiringDocuments();
  }

  /**
   * GET /api/dashboard/reports/payroll - تقرير الرواتب
   * حسب الوثيقة: GET /api/admin/reports/leave
   */
  @Get('reports/payroll')
  async getPayrollReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.adminDashboardService.getPayrollReport(
      new Date(startDate),
      new Date(endDate)
    );
  }

  /**
   * GET /api/dashboard/reports/leave - تقرير الإجازات
   */
  @Get('reports/leave')
  async getLeaveReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.adminDashboardService.getLeaveReport(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('employees/stats')
  async getEmployeesStats() {
    return this.dashboardService.getEmployeesStats();
  }

  @Get('leaves/stats')
  async getLeavesStats(@Query('year') year?: string) {
    return this.dashboardService.getLeavesStats(year ? parseInt(year) : undefined);
  }

  @Get('advances/stats')
  async getAdvancesStats() {
    return this.dashboardService.getAdvancesStats();
  }

  @Get('documents/expiring')
  async getExpiringDocuments() {
    return this.dashboardService.getExpiringDocuments();
  }

  @Get('attendance/monthly')
  async getMonthlyAttendance(@Query('month') month: string, @Query('year') year: string) {
    return this.dashboardService.getMonthlyAttendance(parseInt(month), parseInt(year));
  }
}
