// أضف الموديول
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    // ...
    CompanyModule,
    ReportsModule,
  ],
})
export class AppModule {}