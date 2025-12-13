import { PayrollService } from './payroll.service';
export declare class PayrollController {
    private payrollService;
    constructor(payrollService: PayrollService);
    generatePayroll(month: string, year: string): Promise<{
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
    getEmployeePayroll(id: string, month: string, year: string): Promise<{
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
    getPayrollSummary(month: string, year: string): Promise<{
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
