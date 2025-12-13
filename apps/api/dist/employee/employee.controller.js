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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const employee_service_1 = require("./employee.service");
const employee_dashboard_service_1 = require("./employee-dashboard.service");
let EmployeeController = class EmployeeController {
    constructor(employeeService, dashboardService) {
        this.employeeService = employeeService;
        this.dashboardService = dashboardService;
    }
    async getMyDashboard(req) {
        return this.dashboardService.getEmployeeDashboard(req.user.employeeId);
    }
    async getMyProfile(req) {
        return this.employeeService.getEmployeeProfile(req.user.employeeId);
    }
    async getMyLeaveBalance(req) {
        return this.dashboardService.calculateLeaveBalance(req.user.employeeId);
    }
    async getMyLeaves(req) {
        return this.employeeService.getEmployeeLeaves(req.user.employeeId);
    }
    async getMyAttendance(req) {
        return this.employeeService.getEmployeeAttendance(req.user.employeeId);
    }
    async getMyAdvances(req) {
        return this.employeeService.getEmployeeAdvances(req.user.employeeId);
    }
    async getMyAssets(req) {
        return this.employeeService.getEmployeeAssets(req.user.employeeId);
    }
    async confirmAssetReceipt(req, id) {
        return this.employeeService.confirmAssetReceipt(req.user.employeeId, parseInt(id));
    }
    async getMyDocuments(req) {
        return this.employeeService.getEmployeeDocuments(req.user.employeeId);
    }
    async requestLeave(req, leaveData) {
        return this.employeeService.requestLeave(req.user.employeeId, leaveData);
    }
    async requestAdvance(req, advanceData) {
        return this.employeeService.requestAdvance(req.user.employeeId, advanceData);
    }
    async getMyTravelTicket(req) {
        return this.dashboardService.checkTravelTicketEligibility(req.user.employeeId);
    }
    async useTravelTicket(req) {
        return this.dashboardService.useTravelTicket(req.user.employeeId);
    }
    async getMyEndOfService(req) {
        return this.dashboardService.calculateEndOfService(req.user.employeeId);
    }
    async getAllEmployees() {
        return this.employeeService.getAllEmployees();
    }
    async getEmployee(id) {
        const employee = this.employeeService.db.findEmployeeById(parseInt(id));
        if (!employee) {
            throw new Error('الموظف غير موجود');
        }
        return employee;
    }
    async createEmployee(employeeData) {
        return this.employeeService.createEmployee(employeeData);
    }
    async updateEmployee(id, employeeData) {
        return this.employeeService.updateEmployee(parseInt(id), employeeData);
    }
    async deleteEmployee(id) {
        return this.employeeService.deleteEmployee(parseInt(id));
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Get)('me/dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyDashboard", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)('me/leave-balance'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyLeaveBalance", null);
__decorate([
    (0, common_1.Get)('me/leaves'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyLeaves", null);
__decorate([
    (0, common_1.Get)('me/attendance'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyAttendance", null);
__decorate([
    (0, common_1.Get)('me/advances'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyAdvances", null);
__decorate([
    (0, common_1.Get)('me/assets'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyAssets", null);
__decorate([
    (0, common_1.Post)('me/assets/:id/confirm'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "confirmAssetReceipt", null);
__decorate([
    (0, common_1.Get)('me/documents'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyDocuments", null);
__decorate([
    (0, common_1.Post)('me/leaves'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "requestLeave", null);
__decorate([
    (0, common_1.Post)('me/advances'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "requestAdvance", null);
__decorate([
    (0, common_1.Get)('me/travel-ticket'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyTravelTicket", null);
__decorate([
    (0, common_1.Post)('me/travel-ticket/use'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "useTravelTicket", null);
__decorate([
    (0, common_1.Get)('me/end-of-service'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMyEndOfService", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getAllEmployees", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getEmployee", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "deleteEmployee", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService,
        employee_dashboard_service_1.EmployeeDashboardService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map