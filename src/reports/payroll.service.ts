import { Injectable } from '@nestjs/common';
import { PrismaClient, PayrollStatus } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { CompanyService } from '../company/company.service';

@Injectable()
export class PayrollReportService {
  private prisma = new PrismaClient();
  constructor(private readonly companyService: CompanyService) {}

  async generatePayrollXlsx(runId?: string): Promise<Buffer> {
    const payrollRun = await this.prisma.payrollRun.findFirst({
      where: { status: PayrollStatus.APPROVED, ...(runId ? { id: runId } : {}) },
      orderBy: { periodEnd: 'desc' },
      include: {
        items: {
          include: {
            employee: {
              include: { bankAccount: true, loans: true },
            },
          },
        },
      },
    });
    if (!payrollRun) throw new Error('لا يوجد PayrollRun بحالة APPROVED');

    const company = await this.companyService.getSettings();
    const logoPath = company?.logoUrl ? path.join(process.cwd(), company.logoUrl) : '';
    const themePrimary = company?.themePrimary ?? '#E2E2E2';
    const themeAlt = company?.themeSecondary ?? '#F9F9F9';

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('مسير الرواتب');

    // إدراج الشعار إن وجد
    if (logoPath && fs.existsSync(logoPath)) {
      const imageId = workbook.addImage({ filename: logoPath, extension: 'png' });
      sheet.addImage(imageId, 'A1:B3');
    }

    // ترويسة الأعمدة
    const headers = [
      '#',
      'اسم الموظف',
      'القسم',
      'ملاحظات',
      'الحساب/طريقة التحويل',
      'عدد الأيام',
      'الراتب الأساسي',
      'بدل السكن',
      'بدل النقل',
      'أوفر تايم',
      'بدل إضافي',
      'المجموع',
      'عهد',
      'مبلغ السلف',
      'استقطاعات السلف',
      'خصومات',
      'السلف بعد الخصم',
      'الراتب المستحق',
    ];
    sheet.addRow(headers);

    for (const [idx, item] of payrollRun.items.entries()) {
      // إجمالي القروض النشطة
      const activeLoans = (item.employee.loans || []).filter((l) => l.status === 'ACTIVE');
      const totalLoan = activeLoans.reduce((s, l) => s + l.amount, 0);

      // مجموع الأقساط المدفوعة حتى نهاية هذه الفترة
      const installmentsPaid = await this.prisma.payrollItem.aggregate({
        _sum: { loanDeduction: true },
        where: {
          employeeId: item.employeeId,
          payrollRun: { periodEnd: { lte: payrollRun.periodEnd } },
        },
      });
      const totalPaid = installmentsPaid._sum.loanDeduction ?? 0;
      const remaining = Math.max(0, totalLoan - totalPaid);

      const total =
        (item.basicSalary ?? 0) +
        (item.housingAllow ?? 0) +
        (item.transportAllow ?? 0) +
        (item.overtimeAmount ?? 0) +
        (item.otherAllow ?? 0);

      const net =
        item.netPay ??
        total - (item.deductions ?? 0) - (item.loanDeduction ?? 0) - (item.assetCharges ?? 0);

      sheet.addRow([
        idx + 1,
        item.employee.name,
        item.employee.department ?? '',
        item.notes ?? '',
        item.employee.bankAccount?.name ?? item.employee.transferMethod ?? 'تحويل بنكي',
        30,
        item.basicSalary,
        item.housingAllow,
        item.transportAllow,
        item.overtimeAmount ?? 0,
        item.otherAllow ?? 0,
        total,
        item.assetCharges ?? 0,
        totalLoan || 0,
        item.loanDeduction ?? 0,
        item.deductions ?? 0,
        remaining || 0,
        net,
      ]);
    }

    const lastRow = sheet.lastRow?.number ?? 1;
    sheet.addRow([
      'الإجمالي',
      '',
      '',
      '',
      '',
      '',
      { formula: `SUM(G2:G${lastRow})` },
      { formula: `SUM(H2:H${lastRow})` },
      { formula: `SUM(I2:I${lastRow})` },
      { formula: `SUM(J2:J${lastRow})` },
      { formula: `SUM(K2:K${lastRow})` },
      { formula: `SUM(L2:L${lastRow})` },
      { formula: `SUM(M2:M${lastRow})` },
      { formula: `SUM(N2:N${lastRow})` },
      { formula: `SUM(O2:O${lastRow})` },
      { formula: `SUM(P2:P${lastRow})` },
      { formula: `SUM(R2:R${lastRow})` },
    ]);

    // تنسيق الأعمدة
    sheet.columns.forEach((col) => {
      col.width = 16;
      col.alignment = { vertical: 'middle', horizontal: 'center' };
      col.numFmt = '#,##0.00';
    });
    sheet.getRow(1).font = { bold: true };

    // ألوان الهيدر
    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: themePrimary.replace('#', 'FF') },
    };
    sheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // تلوين صفوف متناوبة
    const alt1 = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeAlt.replace('#', 'FF') } };
    const alt2 = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    for (let r = 2; r <= lastRow; r++) {
      const row = sheet.getRow(r);
      const fill = r % 2 === 0 ? alt1 : alt2;
      row.eachCell((cell) => {
        cell.fill = fill;
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}