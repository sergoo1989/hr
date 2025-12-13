import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class LeaveService {
  private db = InMemoryDatabase.getInstance();

  /**
   * حساب أيام الإجازة السنوية حسب قانون العمل السعودي
   * 21 يوم للسنوات الأولى، 30 يوم بعد 5 سنوات متصلة
   */
  calculateAnnualLeaveDays(yearsWorked: number): number {
    return yearsWorked >= 5 ? 30 : 21;
  }

  /**
   * حساب الإجازة المرضية حسب قانون العمل السعودي (المادة 117)
   * 30 يوم براتب كامل، 60 يوم بـ 75%، 30 يوم بدون راتب
   */
  calculateSickLeavePayRate(totalSickDaysThisYear: number): number {
    if (totalSickDaysThisYear <= 30) {
      return 1.0; // 100%
    } else if (totalSickDaysThisYear <= 90) {
      return 0.75; // 75%
    } else {
      return 0; // بدون راتب
    }
  }

  /**
   * التحقق من إمكانية صرف الإجازة نقدًا
   * حسب المادة 109: ممنوع صرف الإجازة نقدًا أثناء الخدمة
   */
  canEncashLeave(isTerminated: boolean): boolean {
    return isTerminated; // فقط عند إنهاء الخدمة
  }

  /**
   * حساب قيمة الإجازة عند إنهاء الخدمة
   */
  calculateUnusedLeaveValue(unusedDays: number, dailyWage: number): number {
    return unusedDays * dailyWage;
  }

  async requestLeave(employeeId: number, leaveData: any) {
    const employee = this.db.findEmployeeById(employeeId);

    if (!employee) {
      throw new Error('الموظف غير موجود');
    }

    const leave = this.db.createLeave({
      employeeId,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      daysCount: leaveData.daysCount,
      reason: leaveData.reason,
      requestDate: new Date().toISOString(),
      status: 'PENDING',
    });
    
    return leave;
  }
}
