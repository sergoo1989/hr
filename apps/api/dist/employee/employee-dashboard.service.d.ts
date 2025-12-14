export declare class EmployeeDashboardService {
    private db;
    calculateLeaveBalance(employeeId: number): Promise<{
        totalDays: number;
        usedDays: number;
        remainingDays: number;
        dailyWage: number;
        leaveBalance: number;
    }>;
    getAvailableTravelTicket(employeeId: number): Promise<{
        available: boolean;
        year: number;
    }>;
    issueTravelTicket(employeeId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    calculateEOSB(employeeId: number): Promise<{
        yearsWorked: number;
        amount: number;
        fraction: number;
    }>;
    getCompleteEmployeeData(employeeId: number): Promise<{
        employee: import("../database/in-memory-db").Employee;
        leaves: any[];
        advances: any[];
        assets: any[];
    }>;
    getEmployeeFinalSettlement(employeeId: number): Promise<{
        endOfServiceBenefit: number;
        leaveBalance: number;
        totalDue: number;
    }>;
    checkTicketUsage(employeeId: number): Promise<{
        used: boolean;
        year: number;
    }>;
    markTicketAsUsed(ticketId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getEmployeeDashboard(employeeId: number): Promise<{
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
    checkTravelTicketEligibility(employeeId: number): Promise<{
        available: boolean;
        year: number;
    }>;
    useTravelTicket(employeeId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    calculateEndOfService(employeeId: number): Promise<{
        yearsWorked: number;
        amount: number;
        fraction: number;
    }>;
}
