export declare class TerminationService {
    private db;
    calculateEOSBFraction(yearsWorked: number, terminationType: string): number;
    calculateEOSB(lastWage: number, yearsWorked: number, terminationType: string): number;
    processFinalSettlement(employeeId: number, terminationDate: Date, terminationType: string, lastWorkingDay: Date): Promise<{
        employeeId: number;
        terminationDate: Date;
        yearsWorked: number;
        eosbAmount: number;
        status: string;
    }>;
    approveFinalSettlement(settlementId: number, approvedBy: number): Promise<{
        success: boolean;
        message: string;
    }>;
    markSettlementPaid(settlementId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
