import { DashboardService } from './dashboard.service';
import { AdminDashboardService } from './admin-dashboard.service';
export declare class DashboardController {
    private dashboardService;
    private adminDashboardService;
    constructor(dashboardService: DashboardService, adminDashboardService: AdminDashboardService);
    getAdminDashboard(): Promise<{
        stats: {
            totalEmployees: number;
            activeEmployees: number;
            pendingLeaves: number;
            expiringDocuments: number;
            monthlyPayroll: number;
            pendingAdvances: number;
            saudiCount: number;
            nonSaudiCount: number;
            remoteCount: number;
            partTimeCount: number;
            personalSponsorCount: number;
        };
        charts: {
            departmentDistribution: {
                name: string;
                value: any;
            }[];
            nationalityDistribution: {
                name: string;
                value: number;
            }[];
            leaveDistribution: {
                name: string;
                value: any;
            }[];
            salaryDistribution: {
                name: string;
                value: any;
            }[];
        };
        tables: {
            pendingLeaves: import("../database/in-memory-db").Leave[];
            expiringDocuments: any[];
            recentHires: any[];
            pendingAdvances: import("../database/in-memory-db").Advance[];
        };
        analytics: {
            leaveBalances: {
                employeeId: any;
                fullName: any;
                employeeNumber: any;
                annualLeaveDays: any;
                usedDays: any;
                remainingDays: number;
                dailyRate: number;
                leaveBalanceAmount: number;
            }[];
            endOfServiceEligible: {
                employeeId: any;
                fullName: any;
                employeeNumber: any;
                hireDate: any;
                yearsWorked: number;
                monthsWorked: number;
                monthlySalary: any;
                endOfServiceAmount: number;
                eligible: boolean;
            }[];
            ticketEligible: {
                id: number;
                fullName: string;
                employeeNumber: string;
                ticketClass: "ECONOMY" | "BUSINESS";
                estimatedCost: number;
            }[];
        };
    }>;
    getQuickStats(): Promise<{
        totalEmployees: number;
        activeEmployees: number;
        pendingLeaves: number;
        expiringDocuments: number;
        monthlyPayroll: number;
        pendingAdvances: number;
        saudiCount: number;
        nonSaudiCount: number;
        remoteCount: number;
        partTimeCount: number;
        personalSponsorCount: number;
    }>;
    getGeneralStats(): Promise<{
        totalEmployees: number;
        activeContracts: number;
        pendingLeaves: number;
        pendingAdvances: number;
        activeAssets: number;
    }>;
    getChartData(): Promise<{
        departmentDistribution: {
            name: string;
            value: any;
        }[];
        nationalityDistribution: {
            name: string;
            value: number;
        }[];
        leaveDistribution: {
            name: string;
            value: any;
        }[];
        salaryDistribution: {
            name: string;
            value: any;
        }[];
    }>;
    getExpiringDocumentsAlert(): Promise<any[]>;
    getPayrollReport(startDate: string, endDate: string): Promise<{
        data: any[];
    }>;
    getLeaveReport(startDate: string, endDate: string): Promise<{
        data: any[];
    }>;
    getEmployeesStats(): Promise<{
        total: number;
        byContractType: {
            UNLIMITED: number;
        };
    }>;
    getLeavesStats(year?: string): Promise<{
        total: number;
        byType: {
            ANNUAL: number;
        };
        byStatus: Record<string, number>;
        totalDaysApproved: number;
    }>;
    getAdvancesStats(): Promise<{
        total: number;
        byStatus: Record<string, number>;
        totalAmountApproved: number;
    }>;
    getExpiringDocuments(): Promise<{
        total: number;
        byType: {};
        documents: any[];
    }>;
    getMonthlyAttendance(month: string, year: string): Promise<{
        month: number;
        year: number;
        totalDays: number;
        byEmployee: {};
    }>;
}
