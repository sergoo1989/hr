import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getWelcome() {
    return {
      message: 'مرحباً بك في نظام إدارة الموارد البشرية والرواتب',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        auth: {
          login: 'POST /auth/login',
          register: 'POST /auth/register'
        },
        employee: {
          dashboard: 'GET /employees/me/dashboard',
          leaveBalance: 'GET /employees/me/leave-balance',
          travelTicket: 'GET /employees/me/travel-ticket',
          endOfService: 'GET /employees/me/end-of-service',
          leaves: 'GET /employees/me/leaves',
          requestLeave: 'POST /employees/me/leaves',
          advances: 'GET /employees/me/advances',
          requestAdvance: 'POST /employees/me/advances'
        },
        admin: {
          dashboard: 'GET /dashboard',
          stats: 'GET /dashboard/stats',
          charts: 'GET /dashboard/charts',
          alertsExpiry: 'GET /dashboard/alerts/expiry',
          payrollReport: 'GET /dashboard/reports/payroll?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD',
          leaveReport: 'GET /dashboard/reports/leave?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD',
          pendingLeaves: 'GET /admin/leaves/pending',
          approveLeave: 'PATCH /admin/leaves/:id/approve',
          rejectLeave: 'PATCH /admin/leaves/:id/reject'
        },
        scheduler: {
          checkDocuments: 'GET /scheduler/check-documents',
          expiryReport: 'GET /scheduler/expiry-report'
        }
      },
      documentation: {
        api: 'راجع ملف API_DOCUMENTATION.md',
        readme: 'راجع ملف README.md'
      },
      quickStart: {
        '1': 'سجل دخول: POST /auth/login مع {"username":"admin","password":"password123"}',
        '2': 'استخدم الـ token في header: Authorization: Bearer YOUR_TOKEN',
        '3': 'اطلب لوحة المعلومات: GET /employees/me/dashboard'
      }
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'النظام يعمل بشكل صحيح'
    };
  }
}
