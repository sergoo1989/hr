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

    // تحديد عدد أيام الإجازة السنوية (21 يوم أول 5 سنوات، 30 يوم بعد ذلك)
    const totalDays = yearsWorked >= 5 ? 30 : 21;

    // حساب الأيام المستخدمة من الإجازات المعتمدة
    const approvedLeaves = this.db.findLeavesByEmployeeId(employeeId)
      .filter(l => l.status === 'APPROVED');
    const usedDays = approvedLeaves.reduce((sum, l) => sum + (l.daysCount || l.days || 0), 0);

    const remainingDays = totalDays - usedDays;
    const dailyWage = (employee.basicSalary || employee.salary || 0) / 30;
    const leaveBalance = remainingDays * dailyWage;

    return {
      totalDays,
      usedDays,
      remainingDays,
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
    const salary = employee.basicSalary || employee.salary || 0;
    let amount = 0;

    if (yearsWorked <= 5) {
      amount = (salary / 2) * yearsWorked;
    } else {
      amount = (salary / 2) * 5 + salary * (yearsWorked - 5);
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
