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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getPendingLeaves() {
        return this.adminService.getPendingLeaves();
    }
    async getAllLeaves() {
        return this.adminService.getAllLeaves();
    }
    async approveLeave(id) {
        return this.adminService.updateLeaveStatus(parseInt(id), 'APPROVED');
    }
    async rejectLeave(id) {
        return this.adminService.updateLeaveStatus(parseInt(id), 'REJECTED');
    }
    async getPendingAdvances() {
        return this.adminService.getPendingAdvances();
    }
    async approveAdvance(id) {
        return this.adminService.updateAdvanceStatus(parseInt(id), 'APPROVED');
    }
    async rejectAdvance(id) {
        return this.adminService.updateAdvanceStatus(parseInt(id), 'REJECTED');
    }
    async resendActivationEmail(id) {
        return this.adminService.resendActivationEmail(parseInt(id));
    }
    async createContract(contractData) {
        return this.adminService.createContract(contractData);
    }
    async updateContract(id, contractData) {
        return this.adminService.updateContract(parseInt(id), contractData);
    }
    async recordAttendance(attendanceData) {
        return this.adminService.recordAttendance(attendanceData);
    }
    async getAllAssets() {
        return this.adminService.getAllAssets();
    }
    async assignAsset(assetData) {
        return this.adminService.assignAsset(assetData);
    }
    async returnAsset(id) {
        return this.adminService.returnAsset(parseInt(id));
    }
    async deleteAsset(id) {
        return this.adminService.deleteAsset(parseInt(id));
    }
    async addDocument(documentData) {
        return this.adminService.addDocument(documentData);
    }
    async getExpiringDocuments() {
        return this.adminService.getExpiringDocuments();
    }
    async issueTravelTicket(ticketData) {
        return this.adminService.issueTravelTicket(ticketData);
    }
    async calculateEntitlements(id) {
        return this.adminService.calculateEmployeeEntitlements(parseInt(id));
    }
    async getAllUsers() {
        return this.adminService.getAllUsersWithPasswords();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('leaves/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingLeaves", null);
__decorate([
    (0, common_1.Get)('leaves'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllLeaves", null);
__decorate([
    (0, common_1.Patch)('leaves/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveLeave", null);
__decorate([
    (0, common_1.Patch)('leaves/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectLeave", null);
__decorate([
    (0, common_1.Get)('advances/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingAdvances", null);
__decorate([
    (0, common_1.Patch)('advances/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveAdvance", null);
__decorate([
    (0, common_1.Patch)('advances/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectAdvance", null);
__decorate([
    (0, common_1.Post)('employees/:id/resend-activation'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resendActivationEmail", null);
__decorate([
    (0, common_1.Post)('contracts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createContract", null);
__decorate([
    (0, common_1.Put)('contracts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateContract", null);
__decorate([
    (0, common_1.Post)('attendance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "recordAttendance", null);
__decorate([
    (0, common_1.Get)('assets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAssets", null);
__decorate([
    (0, common_1.Post)('assets/assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignAsset", null);
__decorate([
    (0, common_1.Patch)('assets/:id/return'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "returnAsset", null);
__decorate([
    (0, common_1.Delete)('assets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAsset", null);
__decorate([
    (0, common_1.Post)('documents'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Get)('documents/expiring'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getExpiringDocuments", null);
__decorate([
    (0, common_1.Post)('travel-tickets'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "issueTravelTicket", null);
__decorate([
    (0, common_1.Get)('employees/:id/entitlements'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "calculateEntitlements", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map