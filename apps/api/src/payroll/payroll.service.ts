import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class PayrollService {
  async generateMonthlyPayroll(month: number, year: number) {
    const db = InMemoryDatabase.getInstance();
    const employees = db.getAllEmployees();

    const payrollData = employees.map((emp) => {
      const basicSalary = emp.salary;

      const advances = db.findAdvancesByEmployeeId(emp.id)
        .filter(a => a.status === 'APPROVED');
      const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
      const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;

      const assets = db.findAssetsByEmployeeId(emp.id)
        .filter(a => !a.returned);
      const assetCharges = assets.length * 0;

      const totalDeductions = advanceDeduction + assetCharges;
      const netSalary = basicSalary - totalDeductions;

      return {
        employeeId: emp.id,
        employeeName: emp.fullName,
        month,
        year,
        basicSalary,
        advances: totalAdvances,
        advanceDeduction,
        assetCharges,
        totalDeductions,
        netSalary,
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

    // حساب الأجر الفعلي حسب قانون العمل السعودي (المادة 2)
    // الأجر الفعلي = الأساسي + جميع البدلات المستحقة
    const basicSalary = employee.basicSalary || employee.salary;
    const housingAllowance = employee.housingAllowance || 0;
    const transportAllowance = employee.transportAllowance || 0;
    const actualWage = basicSalary + housingAllowance + transportAllowance;
    
    const leaves = db.findLeavesByEmployeeId(employeeId)
      .filter(l => l.status === 'APPROVED');
    const leaveDays = leaves.reduce((sum, l) => sum + l.daysCount, 0);
    // استخدام الأجر الفعلي لحساب بدل الإجازة (المواد 109 و 111)
    const leaveDeduction = (actualWage / 30) * leaveDays;

    const advances = db.findAdvancesByEmployeeId(employeeId)
      .filter(a => a.status === 'APPROVED');
    const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
    const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;

    const assets = db.findAssetsByEmployeeId(employeeId)
      .filter(a => !a.returned);
    const assetCharges = assets.length * 0;
    
    const totalDeductions = leaveDeduction + advanceDeduction + assetCharges;
    const netSalary = basicSalary - totalDeductions;

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      month,
      year,
      basicSalary,
      housingAllowance,
      transportAllowance,
      actualWage,
      leaveDays,
      leaveDeduction,
      advances: totalAdvances,
      advanceDeduction,
      assetCharges,
      totalDeductions,
      netSalary,
    };
  }

  async getPayrollSummary(month: number, year: number) {
    const payrollData = await this.generateMonthlyPayroll(month, year);

    const totalBasicSalary = payrollData.reduce((sum, p) => sum + p.basicSalary, 0);
    const totalDeductions = payrollData.reduce((sum, p) => sum + p.totalDeductions, 0);
    const totalNetSalary = payrollData.reduce((sum, p) => sum + p.netSalary, 0);

    return {
      month,
      year,
      totalEmployees: payrollData.length,
      totalBasicSalary,
      totalDeductions,
      totalNetSalary,
      employees: payrollData,
    };
  }
}