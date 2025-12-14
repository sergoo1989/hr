"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeDashboardService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let EmployeeDashboardService = class EmployeeDashboardService {
    constructor() {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
    async calculateLeaveBalance(employeeId) {
        const employee = this.db.findEmployeeById(employeeId);
        if (!employee) {
            throw new Error('الموظف غير موجود');
        }
        const hireDate = new Date(employee.hireDate);
        const now = new Date();
        const yearsWorked = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        const totalDays = yearsWorked >= 5 ? 30 : 21;
        const approvedLeaves = this.db.findLeavesByEmployeeId(employeeId)
            .filter(l => l.status === 'APPROVED');
        const usedDays = approvedLeaves.reduce((sum, l) => sum + (l.daysCount || l.days || 0), 0);
        const remainingDays = totalDays - usedDays;
        const basicSalary = employee.basicSalary || employee.salary || 0;
        const housingAllowance = employee.housingAllowance || (basicSalary * 0.25);
        const transportAllowance = employee.transportAllowance || (basicSalary * 0.10);
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
    async getAvailableTravelTicket(employeeId) {
        return { available: true, year: new Date().getFullYear() };
    }
    async issueTravelTicket(employeeId) {
        return { success: true, message: 'تم إصدار تذكرة السفر' };
    }
    async calculateEOSB(employeeId) {
        const employee = this.db.findEmployeeById(employeeId);
        if (!employee) {
            throw new Error('الموظف غير موجود');
        }
        const hireDate = new Date(employee.hireDate);
        const now = new Date();
        const yearsWorked = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        const basicSalary = employee.basicSalary || employee.salary || 0;
        const housingAllowance = employee.housingAllowance || (basicSalary * 0.25);
        const transportAllowance = employee.transportAllowance || (basicSalary * 0.10);
        const actualWage = basicSalary + housingAllowance + transportAllowance;
        let amount = 0;
        if (yearsWorked <= 5) {
            amount = (actualWage / 2) * yearsWorked;
        }
        else {
            amount = (actualWage / 2) * 5 + actualWage * (yearsWorked - 5);
        }
        return {
            yearsWorked: Math.round(yearsWorked * 100) / 100,
            amount: Math.round(amount),
            fraction: 1.0,
        };
    }
    async getCompleteEmployeeData(employeeId) {
        const employee = this.db.findEmployeeById(employeeId);
        return {
            employee,
            leaves: [],
            advances: [],
            assets: [],
        };
    }
    async getEmployeeFinalSettlement(employeeId) {
        return {
            endOfServiceBenefit: 0,
            leaveBalance: 0,
            totalDue: 0,
        };
    }
    async checkTicketUsage(employeeId) {
        return { used: false, year: new Date().getFullYear() };
    }
    async markTicketAsUsed(ticketId) {
        return { success: true, message: 'تم تعليم التذكرة كمستخدمة' };
    }
    async getEmployeeDashboard(employeeId) {
        const employee = this.db.findEmployeeById(employeeId);
        return {
            employee,
            leaveBalance: await this.calculateLeaveBalance(employeeId),
            travelTicket: await this.getAvailableTravelTicket(employeeId),
            endOfService: await this.calculateEOSB(employeeId),
        };
    }
    async checkTravelTicketEligibility(employeeId) {
        return this.getAvailableTravelTicket(employeeId);
    }
    async useTravelTicket(employeeId) {
        return this.issueTravelTicket(employeeId);
    }
    async calculateEndOfService(employeeId) {
        return this.calculateEOSB(employeeId);
    }
};
exports.EmployeeDashboardService = EmployeeDashboardService;
exports.EmployeeDashboardService = EmployeeDashboardService = __decorate([
    (0, common_1.Injectable)()
], EmployeeDashboardService);
//# sourceMappingURL=employee-dashboard.service.js.map