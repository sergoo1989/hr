export declare class LeaveBalanceDto {
    entitledDays: number;
    usedDays: number;
    remainingDays: number;
    dailyRate: number;
    cashBalance: number;
}
export declare class TravelTicketDto {
    hasTicket: boolean;
    ticket: any;
    isUsed: boolean;
    canUse: boolean;
}
export declare class EndOfServiceDto {
    eligible: boolean;
    serviceYears: number;
    lastSalary: number;
    estimatedAmount: number;
}
export declare class EmployeeDashboardDto {
    employeeName: string;
    lastLogin: Date;
    leaveBalance: LeaveBalanceDto;
    travelTicket: TravelTicketDto;
    endOfService: EndOfServiceDto;
    alerts: any[];
    quickStats: any;
}
