import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PayrollService } from './payroll.service';

@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Get('generate')
  async generatePayroll(@Query('month') month: string, @Query('year') year: string) {
    return this.payrollService.generateMonthlyPayroll(parseInt(month), parseInt(year));
  }

  @Get('employee/:id')
  async getEmployeePayroll(
    @Query('id') id: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.payrollService.getEmployeePayroll(
      parseInt(id),
      parseInt(month),
      parseInt(year),
    );
  }

  @Get('summary')
  async getPayrollSummary(@Query('month') month: string, @Query('year') year: string) {
    return this.payrollService.getPayrollSummary(parseInt(month), parseInt(year));
  }
}
