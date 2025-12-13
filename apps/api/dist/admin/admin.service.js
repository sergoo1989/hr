"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let AdminService = class AdminService {
    constructor() {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
    async getPendingLeaves() {
        return this.db.findPendingLeaves().map(leave => (Object.assign(Object.assign({}, leave), { employee: this.db.findEmployeeById(leave.employeeId) })));
    }
    async getAllLeaves() {
        return this.db.findAllLeaves().map(leave => (Object.assign(Object.assign({}, leave), { employee: this.db.findEmployeeById(leave.employeeId) })));
    }
    async updateLeaveStatus(leaveId, status) {
        return this.db.updateLeaveStatus(leaveId, status);
    }
    async getPendingAdvances() {
        return this.db.findPendingAdvances().map(advance => (Object.assign(Object.assign({}, advance), { employee: this.db.findEmployeeById(advance.employeeId) })));
    }
    async updateAdvanceStatus(advanceId, status) {
        return this.db.updateAdvanceStatus(advanceId, status);
    }
    async createContract(contractData) {
        return { success: true, message: 'تم إنشاء العقد بنجاح' };
    }
    async updateContract(contractId, contractData) {
        return { success: true, message: 'تم تحديث العقد بنجاح' };
    }
    async recordAttendance(attendanceData) {
        return { success: true, message: 'تم تسجيل الحضور بنجاح' };
    }
    async getAllAssets() {
        return this.db.findAllAssets();
    }
    async assignAsset(assetData) {
        const asset = this.db.createAsset({
            employeeId: assetData.employeeId,
            assetType: assetData.assetType,
            description: assetData.description,
            assignedDate: new Date().toISOString(),
            returned: false,
            confirmed: false,
        });
        return asset;
    }
    async returnAsset(assetId) {
        const asset = this.db.findAssetById(assetId);
        if (asset) {
            asset.returned = true;
            asset.returnDate = new Date().toISOString();
            this.db.saveToStorage();
            return asset;
        }
        throw new Error('الأصل غير موجود');
    }
    async deleteAsset(assetId) {
        const result = this.db.deleteAsset(assetId);
        if (result) {
            return { success: true, message: 'تم حذف العهدة بنجاح' };
        }
        throw new Error('العهدة غير موجودة');
    }
    async addDocument(documentData) {
        return { success: true, message: 'تم إضافة المستند بنجاح' };
    }
    async getExpiringDocuments() {
        return [];
    }
    async issueTravelTicket(ticketData) {
        return { success: true, message: 'تم إصدار تذكرة السفر بنجاح' };
    }
    async calculateEmployeeEntitlements(employeeId) {
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
        }
        else {
            eosbAmount = (employee.salary / 2) * 5 + employee.salary * (yearsWorked - 5);
        }
        const leaves = this.db.findLeavesByEmployeeId(employeeId).filter(l => l.status === 'APPROVED');
        const usedLeaveDays = leaves.reduce((sum, l) => sum + l.daysCount, 0);
        const remainingLeaveDays = annualLeaveDays - usedLeaveDays;
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
    getMonthsDifference(startDate, endDate) {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        return months + endDate.getMonth() - startDate.getMonth();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)()
], AdminService);
//# sourceMappingURL=admin.service.js.map