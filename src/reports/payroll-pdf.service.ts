import { Injectable } from '@nestjs/common';
import { PrismaClient, PayrollStatus } from '@prisma/client';
import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';
import { CompanyService } from '../company/company.service';

@Injectable()
export class PayrollPdfService {
  private prisma = new PrismaClient();
  constructor(private readonly companyService: CompanyService) {}

  async generateMonthlyPayrollPDF(runId?: string): Promise<Buffer> {
    const payrollRun = await this.prisma.payrollRun.findFirst({
      where: { status: PayrollStatus.APPROVED, ...(runId ? { id: runId } : {}) },
      orderBy: { periodEnd: 'desc' },
      include: {
        items: {
          include: { employee: { include: { bankAccount: true, loans: true } } },
        },
      },
    });
    if (!payrollRun) throw new Error('لا يوجد مسير رواتب بحالة APPROVED');

    const company = await this.companyService.getSettings();
    const companyName = company?.name ?? 'الشركة';
    const logoPath = company?.logoUrl ? path.join(process.cwd(), company.logoUrl) : '';
    const themePrimary = company?.themePrimary ?? '#006F45';
    const themeSecondary = company?.themeSecondary ?? '#F9F9F9';

    const fonts = {
      Cairo: {
        normal: path.join(process.cwd(), 'fonts', 'Cairo-Regular.ttf'),
        bold: path.join(process.cwd(), 'fonts', 'Cairo-Bold.ttf'),
      },
    };
    const printer = new PdfPrinter(fonts);

    const tableBody: any[] = [
      [
        '#',
        'اسم الموظف',
        'القسم',
        'الحساب/طريقة التحويل',
        'عدد الأيام',
        'الأساسي',
        'بدل السكن',
        'بدل النقل',
        'أوفر تايم + بدل إضافي',
        'المجموع',
        'خصومات',
        'سلف (قسط)',
        'عهد',
        'الصافي',
      ],
    ];

    for (const [idx, item] of payrollRun.items.entries()) {
      const activeLoans = (item.employee.loans || []).filter((l) => l.status === 'ACTIVE');
      const totalLoan = activeLoans.reduce((s, l) => s + l.amount, 0);
      const installmentsPaid = await this.prisma.payrollItem.aggregate({
        _sum: { loanDeduction: true },
        where: { employeeId: item.employeeId, payrollRun: { periodEnd: { lte: payrollRun.periodEnd } } },
      });
      const totalPaid = installmentsPaid._sum.loanDeduction ?? 0;
      const remaining = Math.max(0, totalLoan - totalPaid);

      const other = (item.otherAllow ?? 0) + (item.overtimeAmount ?? 0);
      const total =
        (item.basicSalary ?? 0) +
        (item.housingAllow ?? 0) +
        (item.transportAllow ?? 0) +
        other;
      const net =
        item.netPay ??
        total - (item.deductions ?? 0) - (item.loanDeduction ?? 0) - (item.assetCharges ?? 0);

      tableBody.push([
        idx + 1,
        item.employee.name,
        item.employee.department ?? '',
        item.employee.bankAccount?.name ?? item.employee.transferMethod ?? 'تحويل بنكي',
        30,
        item.basicSalary.toFixed(2),
        item.housingAllow.toFixed(2),
        item.transportAllow.toFixed(2),
        other.toFixed(2),
        total.toFixed(2),
        (item.deductions ?? 0).toFixed(2),
        (item.loanDeduction ?? 0).toFixed(2),
        (item.assetCharges ?? 0).toFixed(2),
        net.toFixed(2),
      ]);
    }

    // إجماليات نصية (احسبها هنا)
    const sumCol = (colIdx: number) =>
      tableBody.slice(1).reduce((s, row) => s + parseFloat(row[colIdx] || 0), 0);
    const totalBasic = sumCol(5);
    const totalHousing = sumCol(6);
    const totalTransport = sumCol(7);
    const totalOther = sumCol(8);
    const totalGross = sumCol(9);
    const totalDeductions = sumCol(10);
    const totalLoans = sumCol(11);
    const totalAssets = sumCol(12);
    const totalNet = sumCol(13);

    tableBody.push([
      { text: 'الإجمالي', colSpan: 4, alignment: 'right', bold: true }, '', '', '',
      '',
      totalBasic.toFixed(2),
      totalHousing.toFixed(2),
      totalTransport.toFixed(2),
      totalOther.toFixed(2),
      totalGross.toFixed(2),
      totalDeductions.toFixed(2),
      totalLoans.toFixed(2),
      totalAssets.toFixed(2),
      totalNet.toFixed(2),
    ]);

    const docDefinition: any = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      defaultStyle: { font: 'Cairo', fontSize: 9 },
      content: [
        {
          columns: [
            { image: this.tryLoadLogo(logoPath), width: 80, alignment: 'left', margin: [0, 0, 0, 10] },
            {
              stack: [
                { text: 'مسير رواتب شهري', style: 'title', color: themePrimary },
                { text: companyName, bold: true, color: themePrimary },
                { text: `الفترة: ${this.formatDate(payrollRun.periodStart)} - ${this.formatDate(payrollRun.periodEnd)}`, margin: [0, 2, 0, 0] },
                { text: `Run ID: ${payrollRun.id}`, color: 'gray', fontSize: 8 },
              ],
              alignment: 'center',
            },
            { text: '' },
          ],
        },
        {
          margin: [0, 10, 0, 10],
          table: {
            headerRows: 1,
            widths: [15, 70, 60, 80, 30, 50, 50, 50, 55, 55, 50, 50, 50, 55],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0
                ? '#e2e2e2'
                : rowIndex === tableBody.length - 1
                  ? '#f0f0f0'
                  : rowIndex % 2 === 0
                    ? themeSecondary
                    : null,
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
          },
        },
        {
          columns: [
            { text: `HR توقيع: ${company?.payrollSignerHR ?? ''}`, margin: [0, 20, 0, 0] },
            { text: `Finance توقيع: ${company?.payrollSignerFinance ?? ''}`, margin: [0, 20, 0, 0] },
            { text: `CEO توقيع: ${company?.payrollSignerCEO ?? ''}`, margin: [0, 20, 0, 0] },
          ],
        },
      ],
      styles: {
        title: { fontSize: 14, bold: true },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    return await new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('data', (c) => chunks.push(c));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }

  private formatDate(d: Date) {
    return new Date(d).toISOString().slice(0, 10);
  }

  private tryLoadLogo(p?: string): string | undefined {
    if (!p) return undefined;
    if (fs.existsSync(p)) {
      const img = fs.readFileSync(p).toString('base64');
      return `data:image/png;base64,${img}`;
    }
    return undefined;
  }
}