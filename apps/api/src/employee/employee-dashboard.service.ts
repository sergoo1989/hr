import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class EmployeeDashboardService {
  private db = InMemoryDatabase.getInstance();

  async calculateLeaveBalance(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new Error('الموظف غير موجود');
    }

    // حساب سنوات الخدمة
    const hireDate = new Date(employee.hireDate);
    const now = new Date();
    const yearsWorked = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // حساب عدد أيام الإجازة حسب الجنسية ونوع العقد
    let totalDays = 30; // الافتراضي للسعوديين
    
    if (employee.nationality === 'NON_SAUDI') {
      // للموظفين غير السعوديين: استخدام عدد أيام الإجازة من العقد
      totalDays = employee.contractLeaveDays || 30;
    } else if (employee.nationality === 'SAUDI') {
      // للسعوديين: 21 يوم أول 5 سنوات، ثم 30 يوم
      totalDays = yearsWorked >= 5 ? 30 : 21;
    }

    // Debug: تتبع مصدر بيانات أيام الإجازة
    console.log('[LeaveBalance]', {
      employeeId,
      fullName: employee.fullName,
      nationality: employee.nationality,
      contractLeaveDays: employee.contractLeaveDays,
      totalDays,
    });

    // حساب الأيام المستخدمة من الإجازات المعتمدة
    const approvedLeaves = this.db.findLeavesByEmployeeId(employeeId)
      .filter(l => l.status === 'APPROVED');
    const usedDays = approvedLeaves.reduce((sum, l) => sum + (l.daysCount || l.days || 0), 0);

    const remainingDays = totalDays - usedDays;
    
    // حساب الأجر الفعلي (الراتب الأساسي + البدلات) حسب قانون العمل السعودي المادة 111
    const basicSalary = employee.basicSalary || employee.salary || 0;
    const housingAllowance = employee.housingAllowance || 0;
    const transportAllowance = employee.transportAllowance || 0;
    const actualWage = basicSalary + housingAllowance + transportAllowance;
    
    const dailyWage = Math.round(actualWage / 30);
    const leaveBalance = remainingDays * dailyWage;

    return {
      totalDays,
      usedDays,
      remainingDays,
      dailyWage,
      leaveBalance,
    };
  }

  async getAvailableTravelTicket(employeeId: number) {
    return { available: true, year: new Date().getFullYear() };
  }

  async issueTravelTicket(employeeId: number) {
    return { success: true, message: 'تم إصدار تذكرة السفر' };
  }

  async calculateEOSB(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new Error('الموظف غير موجود');
    }

    // حساب سنوات الخدمة
    const hireDate = new Date(employee.hireDate);
    const now = new Date();
    const yearsWorked = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // حساب مكافأة نهاية الخدمة حسب قانون العمل السعودي
    // أول 5 سنوات: نصف راتب شهر عن كل سنة
    // بعد 5 سنوات: راتب شهر كامل عن كل سنة
    // يجب استخدام الأجر الفعلي (الأساسي + البدلات) حسب المادة 84
    const basicSalary = employee.basicSalary || employee.salary || 0;
    const housingAllowance = employee.housingAllowance || 0;
    const transportAllowance = employee.transportAllowance || 0;
    const actualWage = basicSalary + housingAllowance + transportAllowance;
    
    let amount = 0;

    if (yearsWorked <= 5) {
      amount = (actualWage / 2) * yearsWorked;
    } else {
      amount = (actualWage / 2) * 5 + actualWage * (yearsWorked - 5);
    }

    return {
      yearsWorked: Math.round(yearsWorked * 100) / 100,
      amount: Math.round(amount),
      fraction: 1.0,
    };
  }

  async getCompleteEmployeeData(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    return {
      employee,
      leaves: [],
      advances: [],
      assets: [],
    };
  }

  async getEmployeeFinalSettlement(employeeId: number) {
    return {
      endOfServiceBenefit: 0,
      leaveBalance: 0,
      totalDue: 0,
    };
  }

  async checkTicketUsage(employeeId: number) {
    return { used: false, year: new Date().getFullYear() };
  }

  async markTicketAsUsed(ticketId: number) {
    return { success: true, message: 'تم تعليم التذكرة كمستخدمة' };
  }

  async getEmployeeDashboard(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    return {
      employee,
      leaveBalance: await this.calculateLeaveBalance(employeeId),
      travelTicket: await this.getAvailableTravelTicket(employeeId),
      endOfService: await this.calculateEOSB(employeeId),
    };
  }

  async checkTravelTicketEligibility(employeeId: number) {
    return this.getAvailableTravelTicket(employeeId);
  }

  async useTravelTicket(employeeId: number) {
    return this.issueTravelTicket(employeeId);
  }

  async calculateEndOfService(employeeId: number) {
    return this.calculateEOSB(employeeId);
  }
}
