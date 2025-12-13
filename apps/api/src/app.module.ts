import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PayrollModule } from './payroll/payroll.module';
import { LeaveModule } from './leave/leave.module';
import { AuditModule } from './audit/audit.module';
import { TerminationModule } from './termination/termination.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SettingsModule } from './settings/settings.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuditModule,
    AuthModule,
    EmailModule,
    EmployeeModule,
    AdminModule,
    DashboardModule,
    PayrollModule,
    LeaveModule,
    TerminationModule,
    SchedulerModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
