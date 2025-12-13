// DTOs for Employee Dashboard
export class LeaveBalanceDto {
  entitledDays: number;
  usedDays: number;
  remainingDays: number;
  dailyRate: number;
  cashBalance: number;
}

export class TravelTicketDto {
  hasTicket: boolean;
  ticket: any;
  isUsed: boolean;
  canUse: boolean;
}

export class EndOfServiceDto {
  eligible: boolean;
  serviceYears: number;
  lastSalary: number;
  estimatedAmount: number;
}

export class EmployeeDashboardDto {
  employeeName: string;
  lastLogin: Date;
  leaveBalance: LeaveBalanceDto;
  travelTicket: TravelTicketDto;
  endOfService: EndOfServiceDto;
  alerts: any[];
  quickStats: any;
}
