import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class AdminService {
  private db = InMemoryDatabase.getInstance();

  async getPendingLeaves() {
    return this.db.findPendingLeaves().map(leave => ({
      ...leave,
      employee: this.db.findEmployeeById(leave.employeeId),
    }));
  }

  async getAllLeaves() {
    return this.db.findAllLeaves().map(leave => ({
      ...leave,
      employee: this.db.findEmployeeById(leave.employeeId),
    }));
  }

  async updateLeaveStatus(leaveId: number, status: string) {
    return this.db.updateLeaveStatus(leaveId, status as 'APPROVED' | 'REJECTED');
  }

  async getPendingAdvances() {
    return this.db.findPendingAdvances().map(advance => ({
      ...advance,
      employee: this.db.findEmployeeById(advance.employeeId),
    }));
  }

  async updateAdvanceStatus(advanceId: number, status: string) {
    return this.db.updateAdvanceStatus(advanceId, status as 'APPROVED' | 'REJECTED');
  }

  async createContract(contractData: any) {
    return { success: true, message: 'تم إنشاء العقد بنجاح' };
  }

  async updateContract(contractId: number, contractData: any) {
    return { success: true, message: 'تم تحديث العقد بنجاح' };
  }

  async recordAttendance(attendanceData: any) {
    return { success: true, message: 'تم تسجيل الحضور بنجاح' };
  }

  async getAllAssets() {
    return this.db.findAllAssets();
  }

  async assignAsset(assetData: any) {
    const asset = this.db.createAsset({
      employeeId: assetData.employeeId,
      assetType: assetData.assetType,
      description: assetData.description,
      assignedDate: new Date().toISOString(),
      returned: false,
      confirmed: false, // العهدة تحتاج تأكيد من الموظف
    });
    return asset;
  }

  async returnAsset(assetId: number) {
    const asset = this.db.findAssetById(assetId);
    if (asset) {
      asset.returned = true;
      asset.returnDate = new Date().toISOString();
      this.db.saveToStorage();
      return asset;
    }
    throw new Error('الأصل غير موجود');
  }

  async deleteAsset(assetId: number) {
    const result = this.db.deleteAsset(assetId);
    if (result) {
      return { success: true, message: 'تم حذف العهدة بنجاح' };
    }
    throw new Error('العهدة غير موجودة');
  }

  async addDocument(documentData: any) {
    return { success: true, message: 'تم إضافة المستند بنجاح' };
  }

  async getExpiringDocuments() {
    return [];
  }

  async issueTravelTicket(ticketData: any) {
    return { success: true, message: 'تم إصدار تذكرة السفر بنجاح' };
  }

  async calculateEmployeeEntitlements(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    
    if (!employee) {
      throw new Error('الموظف غير موجود');
    }

    const startDate = new Date(employee.hireDate);
    const now = new Date();
    const monthsWorked = this.getMonthsDifference(startDate, now);
    const yearsWorked = monthsWorked / 12;

    let annualLeaveDays = yearsWorked >= 5 ? 30 : 21;
    let eosbAmount = 0;

    if (yearsWorked < 5) {
      eosbAmount = (employee.salary / 2) * yearsWorked;
    } else {
      eosbAmount = (employee.salary / 2) * 5 + employee.salary * (yearsWorked - 5);
    }

    const leaves = this.db.findLeavesByEmployeeId(employeeId).filter(l => l.status === 'APPROVED');
    const usedLeaveDays = leaves.reduce((sum, l) => sum + l.daysCount, 0);
    const remainingLeaveDays = annualLeaveDays - usedLeaveDays;
    // حساب رصيد الإجازة بالأجر الفعلي حسب قانون العمل السعودي
    const basicSalary = employee.basicSalary || employee.salary;
    const actualWage = basicSalary + (employee.housingAllowance || 0) + (employee.transportAllowance || 0);
    const leaveBalance = (actualWage / 30) * remainingLeaveDays;

    return {
      endOfServiceBenefit: eosbAmount,
      leaveBalance,
      remainingLeaveDays,
      annualLeaveDays,
      yearsWorked: yearsWorked.toFixed(2),
      monthsWorked,
    };
  }

  private getMonthsDifference(startDate: Date, endDate: Date): number {
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    return months + endDate.getMonth() - startDate.getMonth();
  }
}
