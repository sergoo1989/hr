export declare class LeaveService {
    private db;
    calculateAnnualLeaveDays(yearsWorked: number): number;
    calculateSickLeavePayRate(totalSickDaysThisYear: number): number;
    canEncashLeave(isTerminated: boolean): boolean;
    calculateUnusedLeaveValue(unusedDays: number, dailyWage: number): number;
    requestLeave(employeeId: number, leaveData: any): Promise<import("../database/in-memory-db").Leave>;
}
