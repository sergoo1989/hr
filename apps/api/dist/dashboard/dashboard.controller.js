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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const dashboard_service_1 = require("./dashboard.service");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboardService, adminDashboardService) {
        this.dashboardService = dashboardService;
        this.adminDashboardService = adminDashboardService;
    }
    async getAdminDashboard() {
        return this.adminDashboardService.getAdminDashboard();
    }
    async getQuickStats() {
        return this.adminDashboardService.getQuickStats();
    }
    async getGeneralStats() {
        return this.dashboardService.getGeneralStats();
    }
    async getChartData() {
        return this.adminDashboardService.getChartData();
    }
    async getExpiringDocumentsAlert() {
        return this.adminDashboardService.getExpiringDocuments();
    }
    async getPayrollReport(startDate, endDate) {
        return this.adminDashboardService.getPayrollReport(new Date(startDate), new Date(endDate));
    }
    async getLeaveReport(startDate, endDate) {
        return this.adminDashboardService.getLeaveReport(new Date(startDate), new Date(endDate));
    }
    async getEmployeesStats() {
        return this.dashboardService.getEmployeesStats();
    }
    async getLeavesStats(year) {
        return this.dashboardService.getLeavesStats(year ? parseInt(year) : undefined);
    }
    async getAdvancesStats() {
        return this.dashboardService.getAdvancesStats();
    }
    async getExpiringDocuments() {
        return this.dashboardService.getExpiringDocuments();
    }
    async getMonthlyAttendance(month, year) {
        return this.dashboardService.getMonthlyAttendance(parseInt(month), parseInt(year));
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getQuickStats", null);
__decorate([
    (0, common_1.Get)('stats/general'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getGeneralStats", null);
__decorate([
    (0, common_1.Get)('charts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getChartData", null);
__decorate([
    (0, common_1.Get)('alerts/expiry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getExpiringDocumentsAlert", null);
__decorate([
    (0, common_1.Get)('reports/payroll'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPayrollReport", null);
__decorate([
    (0, common_1.Get)('reports/leave'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLeaveReport", null);
__decorate([
    (0, common_1.Get)('employees/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getEmployeesStats", null);
__decorate([
    (0, common_1.Get)('leaves/stats'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLeavesStats", null);
__decorate([
    (0, common_1.Get)('advances/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdvancesStats", null);
__decorate([
    (0, common_1.Get)('documents/expiring'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getExpiringDocuments", null);
__decorate([
    (0, common_1.Get)('attendance/monthly'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMonthlyAttendance", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService,
        admin_dashboard_service_1.AdminDashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map