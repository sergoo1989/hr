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
        const actualWage = basicSalary + (employee.housingAllowance || 0) + (employee.transportAllowance || 0);
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
        if (employeeData.email) {
            try {
                const username = employeeData.fullName
                    .toLowerCase()
                    .replace(/\s+/g, '.')
                    .replace(/[^a-z0-9.]/g, '');
                const temporaryPassword = this.generateTemporaryPassword();
                const user = await this.db.createUser(username, temporaryPassword, 'EMPLOYEE', employee.id, employeeData.email, true, true);
                const activationLink = `http://localhost:3000/frontend/change-password.html`;
                await this.emailService.sendEmployeeActivationEmail(employeeData.email, employeeData.fullName, username, temporaryPassword, activationLink);
                console.log(`✅ تم إرسال بريد التفعيل إلى: ${employeeData.email}`);
                console.log(`👤 اسم المستخدم: ${username}`);
                console.log(`🔑 كلمة المرور المؤقتة: ${temporaryPassword}`);
            }
            catch (error) {
                console.error('❌ خطأ في إنشاء حساب أو إرسال بريد:', error);
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
        const employee = this.db.employees.find(e => e.id === employeeId);
        if (!employee) {
            throw new Error('الموظف غير موجود');
        }
        const index = this.db.employees.findIndex(e => e.id === employeeId);
        if (index > -1) {
            this.db.employees.splice(index, 1);
        }
        const userIndex = this.db.users.findIndex(u => u.employeeId === employeeId);
        if (userIndex > -1) {
            this.db.users.splice(userIndex, 1);
        }
        this.db.saveToStorage();
        return { message: 'تم حذف الموظف بنجاح', success: true };
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map