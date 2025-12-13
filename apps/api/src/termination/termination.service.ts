import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class TerminationService {
  private db = InMemoryDatabase.getInstance();

  calculateEOSBFraction(yearsWorked: number, terminationType: string): number {
    if (terminationType !== 'RESIGNATION') {
      return 1.0;
    }
    if (yearsWorked < 2) return 0;
    else if (yearsWorked < 5) return 1/3;
    else if (yearsWorked < 10) return 2/3;
    else return 1.0;
  }

  calculateEOSB(lastWage: number, yearsWorked: number, terminationType: string): number {
    let baseAmount = 0;
    if (yearsWorked < 5) {
      baseAmount = (lastWage / 2) * yearsWorked;
    } else {
      baseAmount = (lastWage / 2) * 5 + lastWage * (yearsWorked - 5);
    }
    const fraction = this.calculateEOSBFraction(yearsWorked, terminationType);
    return baseAmount * fraction;
  }

  async processFinalSettlement(employeeId: number, terminationDate: Date, terminationType: string, lastWorkingDay: Date) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) throw new Error('الموظف غير موجود');

    const startDate = new Date(employee.hireDate);
    const yearsWorked = (lastWorkingDay.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const eosbAmount = this.calculateEOSB(employee.basicSalary || 0, yearsWorked, terminationType);

    return {
      employeeId,
      terminationDate,
      yearsWorked: parseFloat(yearsWorked.toFixed(2)),
      eosbAmount,
      status: 'PENDING',
    };
  }

  async approveFinalSettlement(settlementId: number, approvedBy: number) {
    return { success: true, message: 'تم اعتماد مستحقات نهاية الخدمة' };
  }

  async markSettlementPaid(settlementId: number) {
    return { success: true, message: 'تم صرف مستحقات نهاية الخدمة' };
  }
}
