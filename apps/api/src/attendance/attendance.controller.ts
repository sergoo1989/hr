import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ========== للموظفين ==========

  // تسجيل حضور الموظف
  @Post('check-in/:employeeId')
  @Roles('ADMIN', 'EMPLOYEE')
  checkIn(@Param('employeeId') employeeId: string) {
    return this.attendanceService.checkIn(+employeeId);
  }

  // تسجيل انصراف الموظف
  @Post('check-out/:employeeId')
  @Roles('ADMIN', 'EMPLOYEE')
  checkOut(@Param('employeeId') employeeId: string) {
    return this.attendanceService.checkOut(+employeeId);
  }

  // عرض سجل الحضور لموظف معين
  @Get('employee/:employeeId')
  @Roles('ADMIN', 'EMPLOYEE')
  getEmployeeAttendance(
    @Param('employeeId') employeeId: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.attendanceService.getEmployeeAttendance(
      +employeeId,
      month ? +month : undefined,
      year ? +year : undefined,
    );
  }

  // ========== للإدارة ==========

  // عرض جميع سجلات الحضور
  @Get()
  @Roles('ADMIN')
  getAllAttendance(
    @Query('date') date?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.attendanceService.getAllAttendance(
      date ? new Date(date) : undefined,
      month ? +month : undefined,
      year ? +year : undefined,
    );
  }

  // تسجيل غياب يدوياً
  @Post('mark-absent')
  @Roles('ADMIN')
  markAbsent(
    @Body() body: { employeeId: number; date: string },
  ) {
    return this.attendanceService.markAbsent(body.employeeId, new Date(body.date));
  }

  // تحديث سجل حضور
  @Put(':id')
  @Roles('ADMIN')
  updateAttendance(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.attendanceService.updateAttendanceRecord(+id, body);
  }

  // حذف سجل حضور
  @Delete(':id')
  @Roles('ADMIN')
  deleteAttendance(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(+id);
  }

  // تقرير الحضور الشهري
  @Get('report/monthly')
  @Roles('ADMIN')
  getMonthlyReport(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.attendanceService.getMonthlyReport(+month, +year);
  }

  // إحصائيات اليوم
  @Get('statistics/today')
  @Roles('ADMIN')
  getTodayStatistics() {
    return this.attendanceService.getTodayStatistics();
  }
}
