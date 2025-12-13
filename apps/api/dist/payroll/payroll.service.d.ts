export declare class PayrollService {
    generateMonthlyPayroll(month: number, year: number): Promise<{
        employeeId: number;
        employeeName: string;
        month: number;
        year: number;
        basicSalary: number;
        advances: number;
        advanceDeduction: number;
        assetCharges: number;
        totalDeductions: number;
        netSalary: number;
    }[]>;
    getEmployeePayroll(employeeId: number, month: number, year: number): Promise<{
        employeeId: number;
        employeeName: string;
        month: number;
        year: number;
        basicSalary: number;
        housingAllowance: number;
        transportAllowance: number;
        actualWage: number;
        leaveDays: number;
        leaveDeduction: number;
        advances: number;
        advanceDeduction: number;
        assetCharges: number;
        totalDeductions: number;
        netSalary: number;
    }>;
    getPayrollSummary(month: number, year: number): Promise<{
        month: number;
        year: number;
        totalEmployees: number;
        totalBasicSalary: number;
        totalDeductions: number;
        totalNetSalary: number;
        employees: {
            employeeId: number;
            employeeName: string;
            month: number;
            year: number;
            basicSalary: number;
            advances: number;
            advanceDeduction: number;
            assetCharges: number;
            totalDeductions: number;
            netSalary: number;
        }[];
    }>;
}
