"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const employee_module_1 = require("./employee/employee.module");
const admin_module_1 = require("./admin/admin.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const payroll_module_1 = require("./payroll/payroll.module");
const leave_module_1 = require("./leave/leave.module");
const audit_module_1 = require("./audit/audit.module");
const termination_module_1 = require("./termination/termination.module");
const scheduler_module_1 = require("./scheduler/scheduler.module");
const settings_module_1 = require("./settings/settings.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_module_1.AuditModule,
            auth_module_1.AuthModule,
            employee_module_1.EmployeeModule,
            admin_module_1.AdminModule,
            dashboard_module_1.DashboardModule,
            payroll_module_1.PayrollModule,
            leave_module_1.LeaveModule,
            termination_module_1.TerminationModule,
            scheduler_module_1.SchedulerModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map