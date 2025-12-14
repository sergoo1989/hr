import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';
import { EmailService } from '../email/email.service';

@Injectable()
export class AdminService {
  private db = InMemoryDatabase.getInstance();

  constructor(private emailService: EmailService) {}

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

  async getAllAdvances() {
    return this.db.findAllAdvances().map(advance => ({
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
    
    // حساب الأجر الفعلي (الأساسي + البدلات) حسب قانون العمل السعودي
    const basicSalary = employee.basicSalary || employee.salary;
    const housingAllowance = employee.housingAllowance || (basicSalary * 0.25);
    const transportAllowance = employee.transportAllowance || (basicSalary * 0.10);
    const actualWage = basicSalary + housingAllowance + transportAllowance;
    
    // حساب مكافأة نهاية الخدمة بالأجر الفعلي
    let eosbAmount = 0;
    if (yearsWorked < 5) {
      eosbAmount = (actualWage / 2) * yearsWorked;
    } else {
      eosbAmount = (actualWage / 2) * 5 + actualWage * (yearsWorked - 5);
    }

    const leaves = this.db.findLeavesByEmployeeId(employeeId).filter(l => l.status === 'APPROVED');
    const usedLeaveDays = leaves.reduce((sum, l) => sum + l.daysCount, 0);
    const remainingLeaveDays = annualLeaveDays - usedLeaveDays;
    // حساب رصيد الإجازة بالأجر الفعلي
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

  async resendActivationEmail(employeeId: number) {
    const employee = this.db.findEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException('الموظف غير موجود');
    }

    if (!employee.email) {
      throw new BadRequestException('الموظف ليس لديه بريد إلكتروني');
    }

    // Find user by employeeId
    const user = this.db.findUserByEmployeeId(employeeId);
    if (!user) {
      throw new NotFoundException('حساب المستخدم غير موجود');
    }

    if (user.isActive && !user.mustChangePassword) {
      throw new BadRequestException('الحساب مفعّل بالفعل');
    }

    // Generate new temporary password
    const newTempPassword = this.generateTemporaryPassword();
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newTempPassword, 10);
    
    // Update password
    await this.db.updateUserPassword(user.id, hashedPassword);

    // Generate activation link
    const activationLink = `http://localhost:5500/frontend/login.html`;

    // Send email
    try {
      await this.emailService.sendEmployeeActivationEmail(
        employee.email,
        employee.fullName,
        user.username,
        newTempPassword,
        activationLink,
      );

      console.log(`✅ تم إعادة إرسال بريد التفعيل إلى: ${employee.email}`);
      console.log(`👤 اسم المستخدم: ${user.username}`);
      console.log(`🔑 كلمة المرور المؤقتة الجديدة: ${newTempPassword}`);

      return {
        message: 'تم إعادة إرسال بريد التفعيل بنجاح',
        email: employee.email,
        username: user.username,
      };
    } catch (error) {
      console.error('❌ خطأ في إعادة إرسال البريد الإلكتروني:', error);
      throw new BadRequestException('فشل في إرسال البريد الإلكتروني');
    }
  }

  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private getMonthsDifference(startDate: Date, endDate: Date): number {
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    return months + endDate.getMonth() - startDate.getMonth();
  }

  async getAllUsersWithPasswords() {
    const users = this.db.findAllUsers();
    return users.map(user => {
      const employee = this.db.findEmployeeById(user.employeeId);
      return {
        id: user.id,
        username: user.username,
        password: user.password, // إرجاع كلمة المرور (للأدمن فقط)
        role: user.role,
        email: user.email,
        isActive: user.isActive,
        employeeName: employee?.fullName || 'غير محدد',
        employeeNumber: employee?.employeeNumber || '-'
      };
    });
  }
}
