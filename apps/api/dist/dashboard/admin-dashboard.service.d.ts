export declare class AdminDashboardService {
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
    private getExpiringDocumentsCount;
    private getDaysDifference;
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
    private groupByDepartment;
    private groupLeavesByType;
    private groupSalaryRanges;
    getQuickTables(): Promise<{
        pendingLeaves: import("../database/in-memory-db").Leave[];
        expiringDocuments: any[];
        recentHires: any[];
        pendingAdvances: import("../database/in-memory-db").Advance[];
    }>;
    private getExpiringDocumentsList;
    private getRecentHires;
    getAnalytics(): Promise<{
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
    }>;
    private calculateLeaveBalances;
    private calculateEndOfService;
    getExpiringDocuments(): Promise<any[]>;
    getPayrollReport(startDate: Date, endDate: Date): Promise<{
        data: any[];
    }>;
    getLeaveReport(startDate: Date, endDate: Date): Promise<{
        data: any[];
    }>;
}
