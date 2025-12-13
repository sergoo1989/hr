"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let DashboardService = class DashboardService {
    async getGeneralStats() {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const totalEmployees = db.getTotalEmployees();
        const pendingLeaves = db.getPendingLeavesCount();
        const pendingAdvances = db.getPendingAdvancesCount();
        const activeAssets = db.getActiveAssetsCount();
        return {
            totalEmployees,
            activeContracts: totalEmployees,
            pendingLeaves,
            pendingAdvances,
            activeAssets,
        };
    }
    async getEmployeesStats() {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const employees = db.getAllEmployees();
        return {
            total: employees.length,
            byContractType: { UNLIMITED: employees.length },
        };
    }
    async getLeavesStats(year) {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const currentYear = year || new Date().getFullYear();
        const leaves = db.getAllLeaves();
        const yearLeaves = leaves.filter(l => {
            const leaveYear = new Date(l.startDate).getFullYear();
            return leaveYear === currentYear;
        });
        const byStatus = yearLeaves.reduce((acc, leave) => {
            acc[leave.status] = (acc[leave.status] || 0) + 1;
            return acc;
        }, {});
        const totalDays = yearLeaves
            .filter(l => l.status === 'APPROVED')
            .reduce((sum, l) => sum + l.daysCount, 0);
        return {
            total: yearLeaves.length,
            byType: { ANNUAL: yearLeaves.length },
            byStatus,
            totalDaysApproved: totalDays,
        };
    }
    async getAdvancesStats() {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const advances = db.getAllAdvances();
        const byStatus = advances.reduce((acc, adv) => {
            acc[adv.status] = (acc[adv.status] || 0) + 1;
            return acc;
        }, {});
        const totalAmount = advances
            .filter(a => a.status === 'APPROVED')
            .reduce((sum, a) => sum + a.amount, 0);
        return {
            total: advances.length,
            byStatus,
            totalAmountApproved: totalAmount,
        };
    }
    async getExpiringDocuments() {
        return {
            total: 0,
            byType: {},
            documents: [],
        };
    }
    async getMonthlyAttendance(month, year) {
        return {
            month,
            year,
            totalDays: 0,
            byEmployee: {},
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)()
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map