import { EmailService } from '../email/email.service';
export declare class AdminService {
    private emailService;
    private db;
    constructor(emailService: EmailService);
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
    updateLeaveStatus(leaveId: number, status: string): Promise<import("../database/in-memory-db").Leave>;
    getPendingAdvances(): Promise<{
        employee: import("../database/in-memory-db").Employee;
        id: number;
        employeeId: number;
        amount: number;
        requestDate: Date | string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        reason?: string;
    }[]>;
    updateAdvanceStatus(advanceId: number, status: string): Promise<import("../database/in-memory-db").Advance>;
    createContract(contractData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    updateContract(contractId: number, contractData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    recordAttendance(attendanceData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllAssets(): Promise<import("../database/in-memory-db").Asset[]>;
    assignAsset(assetData: any): Promise<import("../database/in-memory-db").Asset>;
    returnAsset(assetId: number): Promise<import("../database/in-memory-db").Asset>;
    deleteAsset(assetId: number): Promise<{
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
    calculateEmployeeEntitlements(employeeId: number): Promise<{
        endOfServiceBenefit: number;
        leaveBalance: number;
        remainingLeaveDays: number;
        annualLeaveDays: number;
        yearsWorked: string;
        monthsWorked: number;
    }>;
    resendActivationEmail(employeeId: number): Promise<{
        message: string;
        email: string;
        username: string;
    }>;
    private generateTemporaryPassword;
    private getMonthsDifference;
}
