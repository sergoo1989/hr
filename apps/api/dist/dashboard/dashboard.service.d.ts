export declare class DashboardService {
    getGeneralStats(): Promise<{
        totalEmployees: number;
        activeContracts: number;
        pendingLeaves: number;
        pendingAdvances: number;
        activeAssets: number;
    }>;
    getEmployeesStats(): Promise<{
        total: number;
        byContractType: {
            UNLIMITED: number;
        };
    }>;
    getLeavesStats(year?: number): Promise<{
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
    getMonthlyAttendance(month: number, year: number): Promise<{
        month: number;
        year: number;
        totalDays: number;
        byEmployee: {};
    }>;
}
