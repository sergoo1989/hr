import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule],
  controllers: [PayrollController, PayrollPdfController],
  providers: [PayrollReportService, PayrollPdfService],
})
export class ReportsModule {}