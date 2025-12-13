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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
let AppController = class AppController {
    getWelcome() {
        return {
            message: 'مرحباً بك في نظام إدارة الموارد البشرية والرواتب',
            version: '1.0.0',
            status: 'running',
            endpoints: {
                auth: {
                    login: 'POST /auth/login',
                    register: 'POST /auth/register'
                },
                employee: {
                    dashboard: 'GET /employees/me/dashboard',
                    leaveBalance: 'GET /employees/me/leave-balance',
                    travelTicket: 'GET /employees/me/travel-ticket',
                    endOfService: 'GET /employees/me/end-of-service',
                    leaves: 'GET /employees/me/leaves',
                    requestLeave: 'POST /employees/me/leaves',
                    advances: 'GET /employees/me/advances',
                    requestAdvance: 'POST /employees/me/advances'
                },
                admin: {
                    dashboard: 'GET /dashboard',
                    stats: 'GET /dashboard/stats',
                    charts: 'GET /dashboard/charts',
                    alertsExpiry: 'GET /dashboard/alerts/expiry',
                    payrollReport: 'GET /dashboard/reports/payroll?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD',
                    leaveReport: 'GET /dashboard/reports/leave?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD',
                    pendingLeaves: 'GET /admin/leaves/pending',
                    approveLeave: 'PATCH /admin/leaves/:id/approve',
                    rejectLeave: 'PATCH /admin/leaves/:id/reject'
                },
                scheduler: {
                    checkDocuments: 'GET /scheduler/check-documents',
                    expiryReport: 'GET /scheduler/expiry-report'
                }
            },
            documentation: {
                api: 'راجع ملف API_DOCUMENTATION.md',
                readme: 'راجع ملف README.md'
            },
            quickStart: {
                '1': 'سجل دخول: POST /auth/login مع {"username":"admin","password":"password123"}',
                '2': 'استخدم الـ token في header: Authorization: Bearer YOUR_TOKEN',
                '3': 'اطلب لوحة المعلومات: GET /employees/me/dashboard'
            }
        };
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            message: 'النظام يعمل بشكل صحيح'
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getWelcome", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map