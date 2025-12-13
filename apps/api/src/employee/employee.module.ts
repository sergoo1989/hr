import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeDashboardService } from './employee-dashboard.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeDashboardService],
  exports: [EmployeeService, EmployeeDashboardService],
})
export class EmployeeModule {}
