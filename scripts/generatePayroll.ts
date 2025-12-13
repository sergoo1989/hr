/**
 * سكربت توليد مسير رواتب XLSX مشابه للصورة (Image 1).
 * يشحن بيانات الموظفين والبدلات والخصومات من قاعدة البيانات ويُنتج ملف payroll.xlsx.
 * شغّل: ts-node scripts/generatePayroll.ts  (بعد ضبط tsconfig وبيئة Prisma)
 */
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // 1) جلب بيانات الراتب من payroll_items المرتبطة بآخر PayrollRun APPROVED
  const payrollRun = await prisma.payrollRun.findFirst({
    where: { status: 'APPROVED' },
    orderBy: { periodEnd: 'desc' },
    include: {
      items: {
        include: { employee: true },
      },
    },
  });

  if (!payrollRun) {
    throw new Error('لا يوجد PayrollRun بحالة APPROVED');
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('مسير الرواتب');

  // 2) ترويسة الأعمدة
  const headers = [
    '#',
    'اسم الموظف',
    'القسم',
    'ملاحظات',
    'الحساب',
    'طريقة التحويل',
    'عدد الأيام',
    'الراتب الأساسي',
    'بدل السكن',
    'بدل النقل',
    'المجموع',
    'عهد',
    'مبلغ السلف',
    'استقطاعات السلف',
    'خصومات',
    'السلف بعد الخصم',
    'الراتب المستحق',
  ];
  sheet.addRow(headers);

  // 3) تعبئة البيانات
  payrollRun.items.forEach((item, idx) => {
    const total = item.basicSalary + item.housingAllow + item.transportAllow + item.otherAllow;
    const net = item.netPay; // مُحتسب مسبقاً في النظام
    sheet.addRow([
      idx + 1,
      item.employee.name,
      item.employee.department ?? '',
      item.notes ?? '',
      'عن بعد', // مثال؛ يمكن أن تُجلب من حقل إضافي في employee
      'تحويل بنكي ضفوة',
      30,
      item.basicSalary,
      item.housingAllow,
      item.transportAllow,
      total,
      item.assetCharges ?? 0,   // عهد (إن أردت فصلها)
      item.loanDeduction > 0 ? item.loanDeduction : 0, // مبلغ السلف/القسط
      item.loanDeduction ?? 0,  // الاستقطاع الشهري
      item.deductions ?? 0,
      Math.max(0, (item.loanDeduction ?? 0) /* يمكنك حساب المتبقي */),
      net,
    ]);
  });

  // 4) صف الإجماليات
  const lastRow = sheet.lastRow?.number ?? payrollRun.items.length + 1;
  sheet.addRow([
    'الإجمالي',
    '',
    '',
    '',
    '',
    '',
    '',
    { formula: `SUM(H2:H${lastRow})` },
    { formula: `SUM(I2:I${lastRow})` },
    { formula: `SUM(J2:J${lastRow})` },
    { formula: `SUM(K2:K${lastRow})` },
    { formula: `SUM(L2:L${lastRow})` },
    { formula: `SUM(M2:M${lastRow})` },
    { formula: `SUM(N2:N${lastRow})` },
    { formula: `SUM(O2:O${lastRow})` },
    '',
    { formula: `SUM(Q2:Q${lastRow})` },
  ]);

  // 5) تنسيقات أساسية (عرض الأعمدة + محاذاة)
  sheet.columns.forEach((col) => {
    col.width = 16;
    col.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  sheet.getRow(1).font = { bold: true };

  // 6) حفظ الملف
  const outputPath = path.join(process.cwd(), 'payroll.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log('تم إنشاء الملف:', outputPath);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });