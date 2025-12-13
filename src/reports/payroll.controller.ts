import { Controller, Get, Query, Res, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PayrollReportService } from './payroll.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollReportService: PayrollReportService) {}

  @Get('payroll')
  @Roles('HR', 'FINANCE', 'ADMIN')
  async downloadPayroll(@Query('runId') runId: string, @Res() res: Response) {
    try {
      const buffer = await this.payrollReportService.generatePayrollXlsx(runId);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="payroll.xlsx"`);
      return res.send(buffer);
    } catch (e) {
      throw new HttpException(e.message || 'Failed to generate payroll report', HttpStatus.BAD_REQUEST);
    }
  }
}