import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class EmployeeService {
  public db = InMemoryDatabase.getInstance();

  async getEmployeeProfile(userId: number) {
    const user = this.db.findUserById(userId);
    if (!user || !user.employeeId) {
      throw new Error('الموظف غير موجود');
    }
    return this.db.findEmployeeById(user.employeeId);
  }

  async getEmployeeLeaves(employeeId: number) {
    return this.db.findLeavesByEmployeeId(employeeId)
      .sort((a, b) => {
        const aDate = typeof a.requestDate === 'string' ? new Date(a.requestDate) : a.requestDate;
        const bDate = typeof b.requestDate === 'string' ? new Date(b.requestDate) : b.requestDate;
        return bDate.getTime() - aDate.getTime();
      });
  }

  async getEmployeeLeaveBalance(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new Error('الموظف غير موجود');
    }

    const startDate = new Date(employee.hireDate);
    const now = new Date();
    const yearsWorked = (now.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

    const totalDays = yearsWorked >= 5 ? 30 : 21;
    const leaves = this.db.findLeavesByEmployeeId(employeeId).filter(l => l.status === 'APPROVED');
    const usedDays = leaves.reduce((sum, l) => sum + l.daysCount, 0);
    // حساب رصيد الإجازة بالأجر الفعلي حسب قانون العمل السعودي
    const basicSalary = employee.basicSalary || employee.salary;
    const actualWage = basicSalary + (employee.housingAllowance || 0) + (employee.transportAllowance || 0);
    const leaveBalance = (actualWage / 30) * (totalDays - usedDays);

    return {
      totalDays,
      usedDays,
      remainingDays: totalDays - usedDays,
      leaveBalance,
    };
  }

  async getEmployeeAttendance(employeeId: number) {
    return [];
  }

  async getEmployeeAdvances(employeeId: number) {
    return this.db.findAdvancesByEmployeeId(employeeId)
      .sort((a, b) => {
        const aDate = typeof a.requestDate === 'string' ? new Date(a.requestDate) : a.requestDate;
        const bDate = typeof b.requestDate === 'string' ? new Date(b.requestDate) : b.requestDate;
        return bDate.getTime() - aDate.getTime();
      });
  }

  async getEmployeeAssets(employeeId: number) {
    return this.db.findAssetsByEmployeeId(employeeId)
      .sort((a, b) => {
        const aDate = typeof a.assignedDate === 'string' ? new Date(a.assignedDate) : a.assignedDate;
        const bDate = typeof b.assignedDate === 'string' ? new Date(b.assignedDate) : b.assignedDate;
        return bDate.getTime() - aDate.getTime();
      });
  }

  async confirmAssetReceipt(employeeId: number, assetId: number) {
    const asset = this.db.confirmAssetReceipt(assetId, employeeId);
    if (!asset) {
      throw new Error('العهدة غير موجودة أو تم تأكيدها مسبقاً');
    }
    return { 
      success: true, 
      message: 'تم تأكيد استلام العهدة بنجاح',
      asset 
    };
  }

  async getEmployeeDocuments(employeeId: number) {
    return [];
  }

  async requestLeave(employeeId: number, leaveData: any) {
    return this.db.createLeave({
      employeeId,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      daysCount: leaveData.daysCount,
      reason: leaveData.reason,
      requestDate: new Date().toISOString(),
      status: 'PENDING',
    });
  }

  async requestAdvance(employeeId: number, advanceData: any) {
    return this.db.createAdvance({
      employeeId,
      amount: advanceData.amount,
      reason: advanceData.reason,
      requestDate: new Date().toISOString(),
      status: 'PENDING',
    });
  }

  async getAllEmployees() {
    return this.db.findAllEmployees();
  }

  async createEmployee(employeeData: any) {
    const employeeRecord: any = {
      fullName: employeeData.fullName,
      // employeeNumber will be auto-generated in DB
      nationalId: employeeData.nationalId,
      phoneNumber: employeeData.phoneNumber || employeeData.phone,
      email: employeeData.email,
      hireDate: employeeData.hireDate,
      jobTitle: employeeData.jobTitle,
      department: employeeData.department,
      salary: employeeData.basicSalary,
      basicSalary: employeeData.basicSalary,
      housingAllowance: employeeData.housingAllowance,
      transportAllowance: employeeData.transportAllowance,
      nationality: employeeData.nationality,
      workType: employeeData.workType || 'FULL_TIME',
      sponsorshipType: employeeData.sponsorshipType || 'COMPANY',
      ticketEntitlement: employeeData.ticketEntitlement || false,
      ticketClass: employeeData.ticketClass || 'ECONOMY',
    };
    
    // Add non-Saudi employee fields if nationality is NON_SAUDI
    if (employeeData.nationality === 'NON_SAUDI') {
      if (employeeData.contractDuration) employeeRecord.contractDuration = employeeData.contractDuration;
      if (employeeData.contractLeaveDays) employeeRecord.contractLeaveDays = employeeData.contractLeaveDays;
      if (employeeData.passportNumber) employeeRecord.passportNumber = employeeData.passportNumber;
      if (employeeData.passportExpiryDate) employeeRecord.passportExpiryDate = employeeData.passportExpiryDate;
      if (employeeData.workPermitExpiryDate) employeeRecord.workPermitExpiryDate = employeeData.workPermitExpiryDate;
      if (employeeData.passportFeesExpiryDate) employeeRecord.passportFeesExpiryDate = employeeData.passportFeesExpiryDate;
      if (employeeData.medicalInsuranceExpiryDate) employeeRecord.medicalInsuranceExpiryDate = employeeData.medicalInsuranceExpiryDate;
      if (employeeData.contractEndDate) employeeRecord.contractEndDate = employeeData.contractEndDate;
    }
    
    return this.db.createEmployee(employeeRecord);
  }

  async updateEmployee(employeeId: number, employeeData: any) {
    const updateData: any = {
      fullName: employeeData.fullName,
      phoneNumber: employeeData.phoneNumber || employeeData.phone,
      email: employeeData.email,
      jobTitle: employeeData.jobTitle,
      department: employeeData.department,
      basicSalary: employeeData.basicSalary,
      housingAllowance: employeeData.housingAllowance,
      transportAllowance: employeeData.transportAllowance,
      nationality: employeeData.nationality,
      workType: employeeData.workType,
      sponsorshipType: employeeData.sponsorshipType,
      ticketEntitlement: employeeData.ticketEntitlement,
      ticketClass: employeeData.ticketClass,
    };
    
    // Add non-Saudi fields if applicable
    if (employeeData.nationality === 'NON_SAUDI') {
      if (employeeData.contractDuration) updateData.contractDuration = employeeData.contractDuration;
      if (employeeData.contractLeaveDays) updateData.contractLeaveDays = employeeData.contractLeaveDays;
      if (employeeData.passportNumber) updateData.passportNumber = employeeData.passportNumber;
      if (employeeData.passportExpiryDate) updateData.passportExpiryDate = employeeData.passportExpiryDate;
      if (employeeData.workPermitExpiryDate) updateData.workPermitExpiryDate = employeeData.workPermitExpiryDate;
      if (employeeData.passportFeesExpiryDate) updateData.passportFeesExpiryDate = employeeData.passportFeesExpiryDate;
      if (employeeData.medicalInsuranceExpiryDate) updateData.medicalInsuranceExpiryDate = employeeData.medicalInsuranceExpiryDate;
      if (employeeData.contractEndDate) updateData.contractEndDate = employeeData.contractEndDate;
    }
    
    return this.db.updateEmployee(employeeId, updateData);
  }

  async deleteEmployee(employeeId: number) {
    const employee = this.db.employees.find(e => e.id === employeeId);
    if (!employee) {
      throw new Error('الموظف غير موجود');
    }

    // Remove employee from the array
    const index = this.db.employees.findIndex(e => e.id === employeeId);
    if (index > -1) {
      this.db.employees.splice(index, 1);
    }

    // Remove associated user
    const userIndex = this.db.users.findIndex(u => u.employeeId === employeeId);
    if (userIndex > -1) {
      this.db.users.splice(userIndex, 1);
    }

    // حفظ البيانات بعد الحذف
    this.db.saveToStorage();

    return { message: 'تم حذف الموظف بنجاح', success: true };
  }
}
