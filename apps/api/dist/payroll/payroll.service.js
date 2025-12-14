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
            const basicSalary = emp.basicSalary || emp.salary || 0;
            const housingAllowance = emp.housingAllowance || (basicSalary * 0.25);
            const transportAllowance = emp.transportAllowance || (basicSalary * 0.10);
            const totalAllowances = housingAllowance + transportAllowance;
            const grossSalary = basicSalary + totalAllowances;
            const attendances = db.getAttendancesByEmployeeId(emp.id).filter(a => {
                const date = new Date(a.date);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            });
            const presentDays = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
            const absentDays = attendances.filter(a => a.status === 'ABSENT').length;
            const lateDays = attendances.filter(a => a.status === 'LATE').length;
            const totalLateMinutes = attendances.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);
            const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
            const dailySalary = grossSalary / 30;
            const absentDeduction = absentDays * dailySalary;
            const lateDeduction = (totalLateMinutes / 480) * dailySalary;
            const hourlyRate = grossSalary / 240;
            const overtimeAmount = totalOvertimeHours * hourlyRate * 1.5;
            const advances = db.findAdvancesByEmployeeId(emp.id)
                .filter(a => a.status === 'APPROVED');
            const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
            const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;
            const gosiDeduction = emp.nationality === 'سعودي' ? grossSalary * 0.10 : 0;
            const totalDeductions = absentDeduction + lateDeduction + advanceDeduction + gosiDeduction;
            const netSalary = grossSalary + overtimeAmount - totalDeductions;
            return {
                employeeId: emp.id,
                employeeName: emp.fullName,
                employeeNumber: emp.employeeNumber,
                department: emp.department,
                month,
                year,
                basicSalary,
                housingAllowance,
                transportAllowance,
                totalAllowances,
                grossSalary,
                presentDays,
                absentDays,
                lateDays,
                lateDeduction: Math.round(lateDeduction * 100) / 100,
                absentDeduction: Math.round(absentDeduction * 100) / 100,
                overtimeHours: totalOvertimeHours,
                overtimeAmount: Math.round(overtimeAmount * 100) / 100,
                advanceDeduction: Math.round(advanceDeduction * 100) / 100,
                gosiDeduction: Math.round(gosiDeduction * 100) / 100,
                totalDeductions: Math.round(totalDeductions * 100) / 100,
                netSalary: Math.round(netSalary * 100) / 100,
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
        const basicSalary = employee.basicSalary || employee.salary || 0;
        const housingAllowance = employee.housingAllowance || (basicSalary * 0.25);
        const transportAllowance = employee.transportAllowance || (basicSalary * 0.10);
        const totalAllowances = housingAllowance + transportAllowance;
        const grossSalary = basicSalary + totalAllowances;
        const attendances = db.getAttendancesByEmployeeId(employeeId).filter(a => {
            const date = new Date(a.date);
            return date.getMonth() + 1 === month && date.getFullYear() === year;
        });
        const presentDays = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const absentDays = attendances.filter(a => a.status === 'ABSENT').length;
        const lateDays = attendances.filter(a => a.status === 'LATE').length;
        const totalLateMinutes = attendances.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);
        const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
        const dailySalary = grossSalary / 30;
        const absentDeduction = absentDays * dailySalary;
        const lateDeduction = (totalLateMinutes / 480) * dailySalary;
        const hourlyRate = grossSalary / 240;
        const overtimeAmount = totalOvertimeHours * hourlyRate * 1.5;
        const advances = db.findAdvancesByEmployeeId(employeeId)
            .filter(a => a.status === 'APPROVED');
        const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
        const advanceDeduction = totalAdvances > 0 ? totalAdvances / 12 : 0;
        const gosiDeduction = employee.nationality === 'سعودي' ? grossSalary * 0.10 : 0;
        const totalDeductions = absentDeduction + lateDeduction + advanceDeduction + gosiDeduction;
        const netSalary = grossSalary + overtimeAmount - totalDeductions;
        return {
            employeeId: employee.id,
            employeeName: employee.fullName,
            employeeNumber: employee.employeeNumber,
            department: employee.department,
            month,
            year,
            basicSalary,
            housingAllowance,
            transportAllowance,
            totalAllowances,
            grossSalary,
            presentDays,
            absentDays,
            lateDays,
            lateMinutes: totalLateMinutes,
            lateDeduction: Math.round(lateDeduction * 100) / 100,
            absentDeduction: Math.round(absentDeduction * 100) / 100,
            overtimeHours: totalOvertimeHours,
            overtimeAmount: Math.round(overtimeAmount * 100) / 100,
            advances: totalAdvances,
            advanceDeduction: Math.round(advanceDeduction * 100) / 100,
            gosiDeduction: Math.round(gosiDeduction * 100) / 100,
            totalDeductions: Math.round(totalDeductions * 100) / 100,
            netSalary: Math.round(netSalary * 100) / 100,
        };
    }
    async getPayrollSummary(month, year) {
        const payrollData = await this.generateMonthlyPayroll(month, year);
        const totalGrossSalary = payrollData.reduce((sum, p) => sum + p.grossSalary, 0);
        const totalOvertimeAmount = payrollData.reduce((sum, p) => sum + p.overtimeAmount, 0);
        const totalDeductions = payrollData.reduce((sum, p) => sum + p.totalDeductions, 0);
        const totalNetSalary = payrollData.reduce((sum, p) => sum + p.netSalary, 0);
        return {
            month,
            year,
            employeeCount: payrollData.length,
            totalGrossSalary: Math.round(totalGrossSalary * 100) / 100,
            totalOvertimeAmount: Math.round(totalOvertimeAmount * 100) / 100,
            totalDeductions: Math.round(totalDeductions * 100) / 100,
            totalNetSalary: Math.round(totalNetSalary * 100) / 100,
            employees: payrollData,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)()
], PayrollService);
//# sourceMappingURL=payroll.service.js.map