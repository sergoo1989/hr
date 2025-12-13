"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminationService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let TerminationService = class TerminationService {
    constructor() {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
    calculateEOSBFraction(yearsWorked, terminationType) {
        if (terminationType !== 'RESIGNATION') {
            return 1.0;
        }
        if (yearsWorked < 2)
            return 0;
        else if (yearsWorked < 5)
            return 1 / 3;
        else if (yearsWorked < 10)
            return 2 / 3;
        else
            return 1.0;
    }
    calculateEOSB(lastWage, yearsWorked, terminationType) {
        let baseAmount = 0;
        if (yearsWorked < 5) {
            baseAmount = (lastWage / 2) * yearsWorked;
        }
        else {
            baseAmount = (lastWage / 2) * 5 + lastWage * (yearsWorked - 5);
        }
        const fraction = this.calculateEOSBFraction(yearsWorked, terminationType);
        return baseAmount * fraction;
    }
    async processFinalSettlement(employeeId, terminationDate, terminationType, lastWorkingDay) {
        const employee = this.db.findEmployeeById(employeeId);
        if (!employee)
            throw new Error('الموظف غير موجود');
        const startDate = new Date(employee.hireDate);
        const yearsWorked = (lastWorkingDay.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        const eosbAmount = this.calculateEOSB(employee.basicSalary || 0, yearsWorked, terminationType);
        return {
            employeeId,
            terminationDate,
            yearsWorked: parseFloat(yearsWorked.toFixed(2)),
            eosbAmount,
            status: 'PENDING',
        };
    }
    async approveFinalSettlement(settlementId, approvedBy) {
        return { success: true, message: 'تم اعتماد مستحقات نهاية الخدمة' };
    }
    async markSettlementPaid(settlementId) {
        return { success: true, message: 'تم صرف مستحقات نهاية الخدمة' };
    }
};
exports.TerminationService = TerminationService;
exports.TerminationService = TerminationService = __decorate([
    (0, common_1.Injectable)()
], TerminationService);
//# sourceMappingURL=termination.service.js.map