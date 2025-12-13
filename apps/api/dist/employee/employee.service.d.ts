import { InMemoryDatabase } from '../database/in-memory-db';
export declare class EmployeeService {
    db: InMemoryDatabase;
    getEmployeeProfile(userId: number): Promise<import("../database/in-memory-db").Employee>;
    getEmployeeLeaves(employeeId: number): Promise<import("../database/in-memory-db").Leave[]>;
    getEmployeeLeaveBalance(employeeId: number): Promise<{
        totalDays: number;
        usedDays: number;
        remainingDays: number;
        leaveBalance: number;
    }>;
    getEmployeeAttendance(employeeId: number): Promise<any[]>;
    getEmployeeAdvances(employeeId: number): Promise<import("../database/in-memory-db").Advance[]>;
    getEmployeeAssets(employeeId: number): Promise<import("../database/in-memory-db").Asset[]>;
    confirmAssetReceipt(employeeId: number, assetId: number): Promise<{
        success: boolean;
        message: string;
        asset: import("../database/in-memory-db").Asset;
    }>;
    getEmployeeDocuments(employeeId: number): Promise<any[]>;
    requestLeave(employeeId: number, leaveData: any): Promise<import("../database/in-memory-db").Leave>;
    requestAdvance(employeeId: number, advanceData: any): Promise<import("../database/in-memory-db").Advance>;
    getAllEmployees(): Promise<import("../database/in-memory-db").Employee[]>;
    createEmployee(employeeData: any): Promise<import("../database/in-memory-db").Employee>;
    updateEmployee(employeeId: number, employeeData: any): Promise<import("../database/in-memory-db").Employee>;
    deleteEmployee(employeeId: number): Promise<{
        message: string;
        success: boolean;
    }>;
}
