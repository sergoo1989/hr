import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class AttendanceService {
  private db = InMemoryDatabase.getInstance();

  // تسجيل حضور
  checkIn(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException('الموظف غير موجود');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // تحقق من وجود تسجيل حضور لهذا اليوم
    const existingAttendance = this.db.getAttendanceByEmployeeAndDate(employeeId, today);
    if (existingAttendance) {
      throw new BadRequestException('تم تسجيل الحضور لهذا اليوم مسبقاً');
    }

    const checkInTime = new Date();
    const workStartTime = new Date();
    workStartTime.setHours(8, 0, 0, 0); // وقت الدوام: 8 صباحاً

    // حساب التأخير
    const lateMinutes = checkInTime > workStartTime
      ? Math.floor((checkInTime.getTime() - workStartTime.getTime()) / 60000)
      : 0;

    const attendance = this.db.createAttendance({
      employeeId,
      date: today,
      checkIn: checkInTime,
      lateMinutes,
      status: lateMinutes > 0 ? 'LATE' : 'PRESENT',
    });

    return attendance;
  }

  // تسجيل انصراف
  checkOut(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException('الموظف غير موجود');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = this.db.getAttendanceByEmployeeAndDate(employeeId, today);
    if (!attendance) {
      throw new BadRequestException('لم يتم تسجيل حضور لهذا اليوم');
    }

    if (attendance.checkOut) {
      throw new BadRequestException('تم تسجيل الانصراف لهذا اليوم مسبقاً');
    }

    const checkOutTime = new Date();
    const workEndTime = new Date();
    workEndTime.setHours(17, 0, 0, 0); // وقت الانصراف: 5 مساءً

    // حساب ساعات العمل
    const workHours = (checkOutTime.getTime() - new Date(attendance.checkIn).getTime()) / 3600000;
    
    // حساب الإضافي (إذا انصرف بعد 5 مساءً)
    const overtimeHours = checkOutTime > workEndTime
      ? Math.floor((checkOutTime.getTime() - workEndTime.getTime()) / 3600000 * 10) / 10
      : 0;

    // حساب الانصراف المبكر
    const earlyLeaveMinutes = checkOutTime < workEndTime
      ? Math.floor((workEndTime.getTime() - checkOutTime.getTime()) / 60000)
      : 0;

    const updatedAttendance = this.db.updateAttendance(attendance.id, {
      checkOut: checkOutTime,
      workHours: Math.floor(workHours * 10) / 10,
      overtimeHours: Math.floor(overtimeHours * 10) / 10,
      earlyLeaveMinutes,
    });

    return updatedAttendance;
  }

  // عرض سجل الحضور لموظف
  getEmployeeAttendance(employeeId: number, month?: number, year?: number) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException('الموظف غير موجود');
    }

    let attendances = this.db.getAttendancesByEmployeeId(employeeId);

    // فلترة حسب الشهر والسنة
    if (month && year) {
      attendances = attendances.filter(a => {
        const date = new Date(a.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });
    }

    // حساب الإحصائيات
    const totalDays = attendances.length;
    const presentDays = attendances.filter(a => a.status === 'PRESENT').length;
    const lateDays = attendances.filter(a => a.status === 'LATE').length;
    const absentDays = attendances.filter(a => a.status === 'ABSENT').length;
    const totalWorkHours = attendances.reduce((sum, a) => sum + (a.workHours || 0), 0);
    const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
    const totalLateMinutes = attendances.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);

    return {
      employee: {
        id: employee.id,
        fullName: employee.fullName,
        employeeNumber: employee.employeeNumber,
        department: employee.department,
        jobTitle: employee.jobTitle,
      },
      period: month && year ? `${year}-${month.toString().padStart(2, '0')}` : 'الكل',
      statistics: {
        totalDays,
        presentDays,
        lateDays,
        absentDays,
        totalWorkHours: Math.floor(totalWorkHours * 10) / 10,
        totalOvertimeHours: Math.floor(totalOvertimeHours * 10) / 10,
        totalLateMinutes,
      },
      attendances: attendances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  }

  // عرض سجل الحضور لجميع الموظفين
  getAllAttendance(date?: Date, month?: number, year?: number) {
    let attendances = this.db.getAllAttendances();

    // فلترة حسب التاريخ
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      attendances = attendances.filter(a => {
        const attDate = new Date(a.date);
        attDate.setHours(0, 0, 0, 0);
        return attDate.getTime() === searchDate.getTime();
      });
    } else if (month && year) {
      attendances = attendances.filter(a => {
        const attDate = new Date(a.date);
        return attDate.getMonth() + 1 === month && attDate.getFullYear() === year;
      });
    }

    // إضافة معلومات الموظف لكل سجل
    const attendancesWithEmployee = attendances.map(a => {
      const employee = this.db.findEmployeeById(a.employeeId);
      return {
        ...a,
        employee: employee ? {
          fullName: employee.fullName,
          employeeNumber: employee.employeeNumber,
          department: employee.department,
        } : null,
      };
    });

    return attendancesWithEmployee.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // تسجيل غياب يدوياً (للإدارة)
  markAbsent(employeeId: number, date: Date) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException('الموظف غير موجود');
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const existingAttendance = this.db.getAttendanceByEmployeeAndDate(employeeId, searchDate);
    if (existingAttendance) {
      throw new BadRequestException('يوجد سجل حضور لهذا اليوم بالفعل');
    }

    const attendance = this.db.createAttendance({
      employeeId,
      date: searchDate,
      status: 'ABSENT',
      lateMinutes: 0,
    });

    return attendance;
  }

  // تحديث سجل حضور (للإدارة)
  updateAttendanceRecord(id: number, data: any) {
    const attendance = this.db.getAttendanceById(id);
    if (!attendance) {
      throw new NotFoundException('سجل الحضور غير موجود');
    }

    const updatedAttendance = this.db.updateAttendance(id, data);
    return updatedAttendance;
  }

  // حذف سجل حضور (للإدارة)
  deleteAttendance(id: number) {
    const attendance = this.db.getAttendanceById(id);
    if (!attendance) {
      throw new NotFoundException('سجل الحضور غير موجود');
    }

    this.db.deleteAttendance(id);
    return { message: 'تم حذف سجل الحضور بنجاح' };
  }

  // تقرير الحضور الشهري
  getMonthlyReport(month: number, year: number) {
    const employees = this.db.getAllEmployees();
    const report = [];

    for (const employee of employees) {
      const attendances = this.db.getAttendancesByEmployeeId(employee.id).filter(a => {
        const date = new Date(a.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });

      const presentDays = attendances.filter(a => a.status === 'PRESENT').length;
      const lateDays = attendances.filter(a => a.status === 'LATE').length;
      const absentDays = attendances.filter(a => a.status === 'ABSENT').length;
      const totalWorkHours = attendances.reduce((sum, a) => sum + (a.workHours || 0), 0);
      const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
      const totalLateMinutes = attendances.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);

      report.push({
        employee: {
          id: employee.id,
          fullName: employee.fullName,
          employeeNumber: employee.employeeNumber,
          department: employee.department,
          jobTitle: employee.jobTitle,
        },
        statistics: {
          presentDays,
          lateDays,
          absentDays,
          totalWorkHours: Math.floor(totalWorkHours * 10) / 10,
          totalOvertimeHours: Math.floor(totalOvertimeHours * 10) / 10,
          totalLateMinutes,
          lateHours: Math.floor(totalLateMinutes / 60 * 10) / 10,
        },
      });
    }

    return {
      period: `${year}-${month.toString().padStart(2, '0')}`,
      employeeCount: employees.length,
      report: report.sort((a, b) => b.statistics.presentDays - a.statistics.presentDays),
    };
  }

  // إحصائيات الحضور لليوم
  getTodayStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendances = this.db.getAllAttendances().filter(a => {
      const attDate = new Date(a.date);
      attDate.setHours(0, 0, 0, 0);
      return attDate.getTime() === today.getTime();
    });

    const totalEmployees = this.db.getAllEmployees().length;
    const present = todayAttendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const late = todayAttendances.filter(a => a.status === 'LATE').length;
    const absent = totalEmployees - present;

    return {
      date: today,
      totalEmployees,
      present,
      late,
      absent,
      attendanceRate: totalEmployees > 0 ? Math.floor((present / totalEmployees) * 100) : 0,
    };
  }
}
