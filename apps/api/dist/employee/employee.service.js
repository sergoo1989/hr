"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
const email_service_1 = require("../email/email.service");
let EmployeeService = class EmployeeService {
    constructor(emailService) {
        this.emailService = emailService;
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
    async getEmployeeProfile(userId) {
        const user = this.db.findUserById(userId);
        if (!user || !user.employeeId) {
            throw new Error('الموظف غير موجود');
        }
        return this.db.findEmployeeById(user.employeeId);
    }
    async getEmployeeLeaves(employeeId) {
        return this.db.findLeavesByEmployeeId(employeeId)
            .sort((a, b) => {
            const aDate = typeof a.requestDate === 'string' ? new Date(a.requestDate) : a.requestDate;
            const bDate = typeof b.requestDate === 'string' ? new Date(b.requestDate) : b.requestDate;
            return bDate.getTime() - aDate.getTime();
        });
    }
    async getEmployeeLeaveBalance(employeeId) {
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
        const basicSalary = employee.basicSalary || employee.salary;
        const housingAllowance = employee.housingAllowance || (basicSalary * 0.25);
        const transportAllowance = employee.transportAllowance || (basicSalary * 0.10);
        const actualWage = basicSalary + housingAllowance + transportAllowance;
        const leaveBalance = (actualWage / 30) * (totalDays - usedDays);
        return {
            totalDays,
            usedDays,
            remainingDays: totalDays - usedDays,
            leaveBalance,
        };
    }
    async getEmployeeAttendance(employeeId) {
        return [];
    }
    async getEmployeeAdvances(employeeId) {
        return this.db.findAdvancesByEmployeeId(employeeId)
            .sort((a, b) => {
            const aDate = typeof a.requestDate === 'string' ? new Date(a.requestDate) : a.requestDate;
            const bDate = typeof b.requestDate === 'string' ? new Date(b.requestDate) : b.requestDate;
            return bDate.getTime() - aDate.getTime();
        });
    }
    async getEmployeeAssets(employeeId) {
        return this.db.findAssetsByEmployeeId(employeeId)
            .sort((a, b) => {
            const aDate = typeof a.assignedDate === 'string' ? new Date(a.assignedDate) : a.assignedDate;
            const bDate = typeof b.assignedDate === 'string' ? new Date(b.assignedDate) : b.assignedDate;
            return bDate.getTime() - aDate.getTime();
        });
    }
    async confirmAssetReceipt(employeeId, assetId) {
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
    async getEmployeeDocuments(employeeId) {
        return [];
    }
    async requestLeave(employeeId, leaveData) {
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
    async requestAdvance(employeeId, advanceData) {
        return this.db.createAdvance({
            employeeId,
            amount: advanceData.amount,
            reason: advanceData.reason,
            requestDate: new Date().toISOString(),
            status: 'PENDING',
        });
    }
    async deleteLeave(employeeId, leaveId) {
        const leave = this.db.findLeavesByEmployeeId(employeeId).find(l => l.id === leaveId);
        if (!leave) {
            throw new Error('طلب الإجازة غير موجود');
        }
        if (leave.status !== 'PENDING') {
            throw new Error('لا يمكن حذف طلب إجازة تمت الموافقة عليه أو رفضه');
        }
        const success = this.db.deleteLeave(leaveId);
        if (!success) {
            throw new Error('فشل في حذف طلب الإجازة');
        }
        return { success: true, message: 'تم حذف طلب الإجازة بنجاح' };
    }
    async deleteAdvance(employeeId, advanceId) {
        const advance = this.db.findAdvancesByEmployeeId(employeeId).find(a => a.id === advanceId);
        if (!advance) {
            throw new Error('طلب السلفة غير موجود');
        }
        if (advance.status !== 'PENDING') {
            throw new Error('لا يمكن حذف طلب سلفة تمت الموافقة عليه أو رفضه');
        }
        const success = this.db.deleteAdvance(advanceId);
        if (!success) {
            throw new Error('فشل في حذف طلب السلفة');
        }
        return { success: true, message: 'تم حذف طلب السلفة بنجاح' };
    }
    async getAllEmployees() {
        return this.db.findAllEmployees();
    }
    async createEmployee(employeeData) {
        const employeeRecord = {
            fullName: employeeData.fullName,
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
        if (employeeData.nationality === 'NON_SAUDI') {
            if (employeeData.contractDuration)
                employeeRecord.contractDuration = employeeData.contractDuration;
            if (employeeData.contractLeaveDays)
                employeeRecord.contractLeaveDays = employeeData.contractLeaveDays;
            if (employeeData.passportNumber)
                employeeRecord.passportNumber = employeeData.passportNumber;
            if (employeeData.passportExpiryDate)
                employeeRecord.passportExpiryDate = employeeData.passportExpiryDate;
            if (employeeData.workPermitExpiryDate)
                employeeRecord.workPermitExpiryDate = employeeData.workPermitExpiryDate;
            if (employeeData.passportFeesExpiryDate)
                employeeRecord.passportFeesExpiryDate = employeeData.passportFeesExpiryDate;
            if (employeeData.medicalInsuranceExpiryDate)
                employeeRecord.medicalInsuranceExpiryDate = employeeData.medicalInsuranceExpiryDate;
            if (employeeData.contractEndDate)
                employeeRecord.contractEndDate = employeeData.contractEndDate;
        }
        const employee = this.db.createEmployee(employeeRecord);
        if (employeeData.username && employeeData.password) {
            try {
                const username = employeeData.username;
                const password = employeeData.password;
                const role = employeeData.role || 'EMPLOYEE';
                const user = await this.db.createUser(username, password, role, employee.id, employeeData.email, true, false);
                console.log(`✅ تم إنشاء حساب للموظف: ${employeeData.fullName}`);
                console.log(`👤 اسم المستخدم: ${username}`);
                console.log(`🔐 الصلاحية: ${role}`);
                if (employeeData.email) {
                    try {
                        await this.emailService.sendEmployeeActivationEmail(employeeData.email, employeeData.fullName, username, password, `http://localhost:3000/frontend/login.html`);
                        console.log(`📧 تم إرسال البيانات إلى: ${employeeData.email}`);
                    }
                    catch (emailError) {
                        console.error('⚠️ خطأ في إرسال البريد:', emailError);
                    }
                }
            }
            catch (error) {
                console.error('❌ خطأ في إنشاء حساب المستخدم:', error);
            }
        }
        return employee;
    }
    generateTemporaryPassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    async updateEmployee(employeeId, employeeData) {
        const updateData = {
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
        if (employeeData.nationality === 'NON_SAUDI') {
            if (employeeData.contractDuration)
                updateData.contractDuration = employeeData.contractDuration;
            if (employeeData.contractLeaveDays)
                updateData.contractLeaveDays = employeeData.contractLeaveDays;
            if (employeeData.passportNumber)
                updateData.passportNumber = employeeData.passportNumber;
            if (employeeData.passportExpiryDate)
                updateData.passportExpiryDate = employeeData.passportExpiryDate;
            if (employeeData.workPermitExpiryDate)
                updateData.workPermitExpiryDate = employeeData.workPermitExpiryDate;
            if (employeeData.passportFeesExpiryDate)
                updateData.passportFeesExpiryDate = employeeData.passportFeesExpiryDate;
            if (employeeData.medicalInsuranceExpiryDate)
                updateData.medicalInsuranceExpiryDate = employeeData.medicalInsuranceExpiryDate;
            if (employeeData.contractEndDate)
                updateData.contractEndDate = employeeData.contractEndDate;
        }
        return this.db.updateEmployee(employeeId, updateData);
    }
    async deleteEmployee(employeeId) {
        const employee = this.db.findEmployeeById(employeeId);
        if (!employee) {
            throw new Error('الموظف غير موجود');
        }
        const employeeDeleted = this.db.deleteEmployee(employeeId);
        const userDeleted = this.db.deleteUserByEmployeeId(employeeId);
        if (!employeeDeleted) {
            throw new Error('فشل في حذف الموظف');
        }
        return { message: 'تم حذف الموظف بنجاح', success: true };
    }
    async createEmployeesBulk(employeesData) {
        const results = {
            successCount: 0,
            failedCount: 0,
            errors: [],
            employees: []
        };
        for (const employeeData of employeesData) {
            try {
                if (!employeeData.fullName || !employeeData.nationalId || !employeeData.department ||
                    !employeeData.jobTitle || !employeeData.hireDate || !employeeData.basicSalary) {
                    throw new Error('الحقول المطلوبة مفقودة');
                }
                const employee = await this.createEmployee(employeeData);
                results.employees.push(employee);
                results.successCount++;
            }
            catch (error) {
                results.failedCount++;
                results.errors.push({
                    employee: employeeData.fullName || 'غير محدد',
                    error: error.message || 'خطأ غير معروف'
                });
                console.error(`❌ فشل إضافة الموظف ${employeeData.fullName}:`, error);
            }
        }
        return results;
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map