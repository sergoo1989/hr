import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class PayrollService {
  async generateMonthlyPayroll(month: number, year: number) {
    const db = InMemoryDatabase.getInstance();
    const employees = db.getAllEmployees();

    const payrollData = employees.map((emp) => {
      // الراتب الأساسي والبدلات (مع القيم الافتراضية حسب قانون العمل السعودي)
      const basicSalary = emp.basicSalary || emp.salary || 0;
      const housingAllowance = emp.housingAllowance || 0;
      const transportAllowance = emp.transportAllowance || 0;
      const totalAllowances = housingAllowance + transportAllowance;
      const grossSalary = basicSalary + totalAllowances;

      // بيانات الحضور للشهر المحدد
      const attendances = db.getAttendancesByEmployeeId(emp.id).filter(a => {
        const date = new Date(a.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });

      const presentDays = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      const absentDays = attendances.filter(a => a.status === 'ABSENT').length;
      const lateDays = attendances.filter(a => a.status === 'LATE').length;
      const totalLateMinutes = attendances.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);
      const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

      // حساب الخصومات
      const dailySalary = grossSalary / 30;
      const absentDeduction = absentDays * dailySalary;
      const lateDeduction = (totalLateMinutes / 480) * dailySalary; // 480 دقيقة = 8 ساعات عمل
      
      // حساب الإضافي (1.5 ضعف الأجر الفعلي للساعة حسب قانون العمل السعودي)
      const hourlyRate = grossSalary / 240; // 240 ساعة عمل شهرياً
      const overtimeAmount = totalOvertimeHours * hourlyRate * 1.5;

      // السلف
      const advances = db.findAdvancesByEmployeeId(emp.id)
        .filter(a => a.status === 'APPROVED');
      const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
      const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;

      // التأمينات الاجتماعية (10% للموظف السعودي)
      const gosiDeduction = emp.nationality === 'سعودي' ? grossSalary * 0.10 : 0;

      const totalDeductions = absentDeduction + lateDeduction + advanceDeduction + gosiDeduction;
      const netSalary = grossSalary + overtimeAmount - totalDeductions;

      return {
        employeeId: emp.id,
        employeeName: emp.fullName,
        employeeNumber: emp.employeeNumber,
        department: emp.department,
        month,
        year,
        basicSalary,
        housingAllowance,
        transportAllowance,
        totalAllowances,
        grossSalary,
        presentDays,
        absentDays,
        lateDays,
        lateDeduction: Math.round(lateDeduction * 100) / 100,
        absentDeduction: Math.round(absentDeduction * 100) / 100,
        overtimeHours: totalOvertimeHours,
        overtimeAmount: Math.round(overtimeAmount * 100) / 100,
        advanceDeduction: Math.round(advanceDeduction * 100) / 100,
        gosiDeduction: Math.round(gosiDeduction * 100) / 100,
        totalDeductions: Math.round(totalDeductions * 100) / 100,
        netSalary: Math.round(netSalary * 100) / 100,
      };
    });

    return payrollData;
  }

  async getEmployeePayroll(employeeId: number, month: number, year: number) {
    const db = InMemoryDatabase.getInstance();
    const employee = db.findEmployeeById(employeeId);

    if (!employee) {
      throw new Error('الموظف غير موجود');
    }

    // الراتب الأساسي والبدلات من قاعدة البيانات
    const basicSalary = employee.basicSalary || employee.salary || 0;
    const housingAllowance = employee.housingAllowance || 0;
    const transportAllowance = employee.transportAllowance || 0;
    const totalAllowances = housingAllowance + transportAllowance;
    const grossSalary = basicSalary + totalAllowances;

    // بيانات الحضور
    const attendances = db.getAttendancesByEmployeeId(employeeId).filter(a => {
      const date = new Date(a.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

    const presentDays = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const absentDays = attendances.filter(a => a.status === 'ABSENT').length;
    const lateDays = attendances.filter(a => a.status === 'LATE').length;
    const totalLateMinutes = attendances.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);
    const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

    // حساب الخصومات
    const dailySalary = grossSalary / 30;
    const absentDeduction = absentDays * dailySalary;
    const lateDeduction = (totalLateMinutes / 480) * dailySalary;
    
    // الإضافي (حسب قانون العمل السعودي - من الأجر الفعلي)
    const hourlyRate = grossSalary / 240;
    const overtimeAmount = totalOvertimeHours * hourlyRate * 1.5;

    // السلف
    const advances = db.findAdvancesByEmployeeId(employeeId)
      .filter(a => a.status === 'APPROVED');
    const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
    const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;

    // التأمينات
    const gosiDeduction = employee.nationality === 'سعودي' ? grossSalary * 0.10 : 0;

    const totalDeductions = absentDeduction + lateDeduction + advanceDeduction + gosiDeduction;
    const netSalary = grossSalary + overtimeAmount - totalDeductions;

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeNumber: employee.employeeNumber,
      department: employee.department,
      month,
      year,
      basicSalary,
      housingAllowance,
      transportAllowance,
      totalAllowances,
      grossSalary,
      presentDays,
      absentDays,
      lateDays,
      lateMinutes: totalLateMinutes,
      lateDeduction: Math.round(lateDeduction * 100) / 100,
      absentDeduction: Math.round(absentDeduction * 100) / 100,
      overtimeHours: totalOvertimeHours,
      overtimeAmount: Math.round(overtimeAmount * 100) / 100,
      advances: totalAdvances,
      advanceDeduction: Math.round(advanceDeduction * 100) / 100,
      gosiDeduction: Math.round(gosiDeduction * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100,
    };
  }

  async getPayrollSummary(month: number, year: number) {
    const payrollData = await this.generateMonthlyPayroll(month, year);

    const totalGrossSalary = payrollData.reduce((sum, p) => sum + p.grossSalary, 0);
    const totalOvertimeAmount = payrollData.reduce((sum, p) => sum + p.overtimeAmount, 0);
    const totalDeductions = payrollData.reduce((sum, p) => sum + p.totalDeductions, 0);
    const totalNetSalary = payrollData.reduce((sum, p) => sum + p.netSalary, 0);

    return {
      month,
      year,
      employeeCount: payrollData.length,
      totalGrossSalary: Math.round(totalGrossSalary * 100) / 100,
      totalOvertimeAmount: Math.round(totalOvertimeAmount * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      totalNetSalary: Math.round(totalNetSalary * 100) / 100,
      employees: payrollData,
    };
  }
}