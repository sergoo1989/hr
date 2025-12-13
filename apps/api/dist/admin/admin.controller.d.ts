import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getPendingLeaves(): Promise<{
        employee: import("../database/in-memory-db").Employee;
        id: number;
        employeeId: number;
        type?: string;
        leaveType?: string;
        startDate: Date | string;
        endDate: Date | string;
        days?: number;
        daysCount?: number;
        status: "PENDING" | "APPROVED" | "REJECTED";
        requestDate: Date | string;
        reason?: string;
    }[]>;
    getAllLeaves(): Promise<{
        employee: import("../database/in-memory-db").Employee;
        id: number;
        employeeId: number;
        type?: string;
        leaveType?: string;
        startDate: Date | string;
        endDate: Date | string;
        days?: number;
        daysCount?: number;
        status: "PENDING" | "APPROVED" | "REJECTED";
        requestDate: Date | string;
        reason?: string;
    }[]>;
    approveLeave(id: string): Promise<import("../database/in-memory-db").Leave>;
    rejectLeave(id: string): Promise<import("../database/in-memory-db").Leave>;
    getPendingAdvances(): Promise<{
        employee: import("../database/in-memory-db").Employee;
        id: number;
        employeeId: number;
        amount: number;
        requestDate: Date | string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        reason?: string;
    }[]>;
    approveAdvance(id: string): Promise<import("../database/in-memory-db").Advance>;
    rejectAdvance(id: string): Promise<import("../database/in-memory-db").Advance>;
    resendActivationEmail(id: string): Promise<{
        message: string;
        email: string;
        username: string;
    }>;
    createContract(contractData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    updateContract(id: string, contractData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    recordAttendance(attendanceData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllAssets(): Promise<import("../database/in-memory-db").Asset[]>;
    assignAsset(assetData: any): Promise<import("../database/in-memory-db").Asset>;
    returnAsset(id: string): Promise<import("../database/in-memory-db").Asset>;
    deleteAsset(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addDocument(documentData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getExpiringDocuments(): Promise<any[]>;
    issueTravelTicket(ticketData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    calculateEntitlements(id: string): Promise<{
        endOfServiceBenefit: number;
        leaveBalance: number;
        remainingLeaveDays: number;
        annualLeaveDays: number;
        yearsWorked: string;
        monthsWorked: number;
    }>;
}
