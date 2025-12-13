"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let PayrollService = class PayrollService {
    async generateMonthlyPayroll(month, year) {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const employees = db.getAllEmployees();
        const payrollData = employees.map((emp) => {
            const basicSalary = emp.salary;
            const advances = db.findAdvancesByEmployeeId(emp.id)
                .filter(a => a.status === 'APPROVED');
            const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
            const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;
            const assets = db.findAssetsByEmployeeId(emp.id)
                .filter(a => !a.returned);
            const assetCharges = assets.length * 0;
            const totalDeductions = advanceDeduction + assetCharges;
            const netSalary = basicSalary - totalDeductions;
            return {
                employeeId: emp.id,
                employeeName: emp.fullName,
                month,
                year,
                basicSalary,
                advances: totalAdvances,
                advanceDeduction,
                assetCharges,
                totalDeductions,
                netSalary,
            };
        });
        return payrollData;
    }
    async getEmployeePayroll(employeeId, month, year) {
        const db = in_memory_db_1.InMemoryDatabase.getInstance();
        const employee = db.findEmployeeById(employeeId);
        if (!employee) {
            throw new Error('الموظف غير موجود');
        }
        const basicSalary = employee.basicSalary || employee.salary;
        const housingAllowance = employee.housingAllowance || 0;
        const transportAllowance = employee.transportAllowance || 0;
        const actualWage = basicSalary + housingAllowance + transportAllowance;
        const leaves = db.findLeavesByEmployeeId(employeeId)
            .filter(l => l.status === 'APPROVED');
        const leaveDays = leaves.reduce((sum, l) => sum + l.daysCount, 0);
        const leaveDeduction = (actualWage / 30) * leaveDays;
        const advances = db.findAdvancesByEmployeeId(employeeId)
            .filter(a => a.status === 'APPROVED');
        const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
        const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;
        const assets = db.findAssetsByEmployeeId(employeeId)
            .filter(a => !a.returned);
        const assetCharges = assets.length * 0;
        const totalDeductions = leaveDeduction + advanceDeduction + assetCharges;
        const netSalary = basicSalary - totalDeductions;
        return {
            employeeId: employee.id,
            employeeName: employee.fullName,
            month,
            year,
            basicSalary,
            housingAllowance,
            transportAllowance,
            actualWage,
            leaveDays,
            leaveDeduction,
            advances: totalAdvances,
            advanceDeduction,
            assetCharges,
            totalDeductions,
            netSalary,
        };
    }
    async getPayrollSummary(month, year) {
        const payrollData = await this.generateMonthlyPayroll(month, year);
        const totalBasicSalary = payrollData.reduce((sum, p) => sum + p.basicSalary, 0);
        const totalDeductions = payrollData.reduce((sum, p) => sum + p.totalDeductions, 0);
        const totalNetSalary = payrollData.reduce((sum, p) => sum + p.netSalary, 0);
        return {
            month,
            year,
            totalEmployees: payrollData.length,
            totalBasicSalary,
            totalDeductions,
            totalNetSalary,
            employees: payrollData,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)()
], PayrollService);
//# sourceMappingURL=payroll.service.js.map