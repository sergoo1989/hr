import { InMemoryDatabase } from '../database/in-memory-db';
import { EmailService } from '../email/email.service';
export declare class EmployeeService {
    private emailService;
    db: InMemoryDatabase;
    constructor(emailService: EmailService);
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
    deleteLeave(employeeId: number, leaveId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAdvance(employeeId: number, advanceId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllEmployees(): Promise<import("../database/in-memory-db").Employee[]>;
    createEmployee(employeeData: any): Promise<import("../database/in-memory-db").Employee>;
    private generateTemporaryPassword;
    updateEmployee(employeeId: number, employeeData: any): Promise<import("../database/in-memory-db").Employee>;
    deleteEmployee(employeeId: number): Promise<{
        message: string;
        success: boolean;
    }>;
    createEmployeesBulk(employeesData: any[]): Promise<{
        successCount: number;
        failedCount: number;
        errors: Array<{
            employee: string;
            error: string;
        }>;
        employees: any[];
    }>;
}
