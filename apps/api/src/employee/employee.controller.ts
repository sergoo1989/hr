import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EmployeeService } from './employee.service';
import { EmployeeDashboardService } from './employee-dashboard.service';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private dashboardService: EmployeeDashboardService
  ) {}

  // ====== المسارات المقترحة في الوثيقة ======
  
  /**
   * GET /api/employees/me/dashboard - لوحة المعلومات الكاملة
   * حسب الوثيقة: نموذج 2 - لوحة معلومات الموظف
   */
  @Get('me/dashboard')
  async getMyDashboard(@Request() req) {
    return this.dashboardService.getEmployeeDashboard(req.user.employeeId);
  }

  /**
   * GET /api/employees/me - البيانات الشخصية
   */
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.employeeService.getEmployeeProfile(req.user.employeeId);
  }

  /**
   * GET /api/employees/me/leave-balance - رصيد الإجازات
   * حسب الوثيقة: calculateLeaveBalance
   */
  @Get('me/leave-balance')
  async getMyLeaveBalance(@Request() req) {
    return this.dashboardService.calculateLeaveBalance(req.user.employeeId);
  }

  @Get('me/leaves')
  async getMyLeaves(@Request() req) {
    return this.employeeService.getEmployeeLeaves(req.user.employeeId);
  }

  @Get('me/attendance')
  async getMyAttendance(@Request() req) {
    return this.employeeService.getEmployeeAttendance(req.user.employeeId);
  }

  @Get('me/advances')
  async getMyAdvances(@Request() req) {
    return this.employeeService.getEmployeeAdvances(req.user.employeeId);
  }

  @Get('me/assets')
  async getMyAssets(@Request() req) {
    return this.employeeService.getEmployeeAssets(req.user.employeeId);
  }

  @Post('me/assets/:id/confirm')
  async confirmAssetReceipt(@Request() req, @Param('id') id: string) {
    return this.employeeService.confirmAssetReceipt(req.user.employeeId, parseInt(id));
  }

  @Get('me/documents')
  async getMyDocuments(@Request() req) {
    return this.employeeService.getEmployeeDocuments(req.user.employeeId);
  }

  @Post('me/leaves')
  async requestLeave(@Request() req, @Body() leaveData: any) {
    return this.employeeService.requestLeave(req.user.employeeId, leaveData);
  }

  @Delete('me/leaves/:id')
  async deleteMyLeave(@Request() req, @Param('id') id: string) {
    return this.employeeService.deleteLeave(req.user.employeeId, parseInt(id));
  }

  @Post('me/advances')
  async requestAdvance(@Request() req, @Body() advanceData: any) {
    return this.employeeService.requestAdvance(req.user.employeeId, advanceData);
  }

  @Delete('me/advances/:id')
  async deleteMyAdvance(@Request() req, @Param('id') id: string) {
    return this.employeeService.deleteAdvance(req.user.employeeId, parseInt(id));
  }

  /**
   * GET /api/employees/me/travel-ticket - حالة تذكرة السفر
   * حسب الوثيقة: checkTravelTicketEligibility
   */
  @Get('me/travel-ticket')
  async getMyTravelTicket(@Request() req) {
    return this.dashboardService.checkTravelTicketEligibility(req.user.employeeId);
  }

  /**
   * POST /api/employees/me/travel-ticket/use - استخدام تذكرة السفر
   */
  @Post('me/travel-ticket/use')
  async useTravelTicket(@Request() req) {
    return this.dashboardService.useTravelTicket(req.user.employeeId);
  }

  /**
   * GET /api/employees/me/end-of-service - بدل نهاية الخدمة المتوقع
   * حسب الوثيقة: calculateEndOfService
   */
  @Get('me/end-of-service')
  async getMyEndOfService(@Request() req) {
    return this.dashboardService.calculateEndOfService(req.user.employeeId);
  }

  @Get()
  @Roles('ADMIN')
  async getAllEmployees() {
    return this.employeeService.getAllEmployees();
  }

  @Get(':id')
  @Roles('ADMIN')
  async getEmployee(@Param('id') id: string) {
    const employee = this.employeeService.db.findEmployeeById(parseInt(id));
    if (!employee) {
      throw new Error('الموظف غير موجود');
    }
    return employee;
  }

  @Post()
  @Roles('ADMIN')
  async createEmployee(@Body() employeeData: any) {
    return this.employeeService.createEmployee(employeeData);
  }

  @Post('bulk')
  @Roles('ADMIN')
  async createEmployeesBulk(@Body() body: { employees: any[] }) {
    return this.employeeService.createEmployeesBulk(body.employees);
  }

  @Put(':id')
  @Roles('ADMIN')
  async updateEmployee(@Param('id') id: string, @Body() employeeData: any) {
    return this.employeeService.updateEmployee(parseInt(id), employeeData);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteEmployee(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(parseInt(id));
  }
}
