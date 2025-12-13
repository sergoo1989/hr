"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let LeaveService = class LeaveService {
    constructor() {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
    calculateAnnualLeaveDays(yearsWorked) {
        return yearsWorked >= 5 ? 30 : 21;
    }
    calculateSickLeavePayRate(totalSickDaysThisYear) {
        if (totalSickDaysThisYear <= 30) {
            return 1.0;
        }
        else if (totalSickDaysThisYear <= 90) {
            return 0.75;
        }
        else {
            return 0;
        }
    }
    canEncashLeave(isTerminated) {
        return isTerminated;
    }
    calculateUnusedLeaveValue(unusedDays, dailyWage) {
        return unusedDays * dailyWage;
    }
    async requestLeave(employeeId, leaveData) {
        const employee = this.db.findEmployeeById(employeeId);
        if (!employee) {
            throw new Error('الموظف غير موجود');
        }
        const leave = this.db.createLeave({
            employeeId,
            leaveType: leaveData.leaveType,
            startDate: leaveData.startDate,
            endDate: leaveData.endDate,
            daysCount: leaveData.daysCount,
            reason: leaveData.reason,
            requestDate: new Date().toISOString(),
            status: 'PENDING',
        });
        return leave;
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)()
], LeaveService);
//# sourceMappingURL=leave.service.js.map