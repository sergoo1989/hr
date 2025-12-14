import { EmployeeService } from './employee.service';
import { EmployeeDashboardService } from './employee-dashboard.service';
export declare class EmployeeController {
    private employeeService;
    private dashboardService;
    constructor(employeeService: EmployeeService, dashboardService: EmployeeDashboardService);
    getMyDashboard(req: any): Promise<{
        employee: import("../database/in-memory-db").Employee;
        leaveBalance: {
            totalDays: number;
            usedDays: number;
            remainingDays: number;
            dailyWage: number;
            leaveBalance: number;
        };
        travelTicket: {
            available: boolean;
            year: number;
        };
        endOfService: {
            yearsWorked: number;
            amount: number;
            fraction: number;
        };
    }>;
    getMyProfile(req: any): Promise<import("../database/in-memory-db").Employee>;
    getMyLeaveBalance(req: any): Promise<{
        totalDays: number;
        usedDays: number;
        remainingDays: number;
        dailyWage: number;
        leaveBalance: number;
    }>;
    getMyLeaves(req: any): Promise<import("../database/in-memory-db").Leave[]>;
    getMyAttendance(req: any): Promise<any[]>;
    getMyAdvances(req: any): Promise<import("../database/in-memory-db").Advance[]>;
    getMyAssets(req: any): Promise<import("../database/in-memory-db").Asset[]>;
    confirmAssetReceipt(req: any, id: string): Promise<{
        success: boolean;
        message: string;
        asset: import("../database/in-memory-db").Asset;
    }>;
    getMyDocuments(req: any): Promise<any[]>;
    requestLeave(req: any, leaveData: any): Promise<import("../database/in-memory-db").Leave>;
    deleteMyLeave(req: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    requestAdvance(req: any, advanceData: any): Promise<import("../database/in-memory-db").Advance>;
    deleteMyAdvance(req: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getMyTravelTicket(req: any): Promise<{
        available: boolean;
        year: number;
    }>;
    useTravelTicket(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getMyEndOfService(req: any): Promise<{
        yearsWorked: number;
        amount: number;
        fraction: number;
    }>;
    getAllEmployees(): Promise<import("../database/in-memory-db").Employee[]>;
    getEmployee(id: string): Promise<import("../database/in-memory-db").Employee>;
    createEmployee(employeeData: any): Promise<import("../database/in-memory-db").Employee>;
    createEmployeesBulk(body: {
        employees: any[];
    }): Promise<{
        successCount: number;
        failedCount: number;
        errors: {
            employee: string;
            error: string;
        }[];
        employees: any[];
    }>;
    updateEmployee(id: string, employeeData: any): Promise<import("../database/in-memory-db").Employee>;
    deleteEmployee(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
