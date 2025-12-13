import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 بدء إضافة البيانات التجريبية...');

  try {
    // إنشاء موظف للأدمن
    const adminEmployee = await prisma.employee.create({
      data: {
        employeeCode: 'EMP001',
        name: 'مدير النظام',
        nameEn: 'System Admin',
        nationalId: '1234567890',
        email: 'admin@company.com',
        phone: '+966501234567',
        nationality: 'SAUDI',
        joinDate: new Date('2020-01-01'),
      },
    });

    // إنشاء موظف عادي
    const employee = await prisma.employee.create({
      data: {
        employeeCode: 'EMP002',
        name: 'أحمد محمد',
        nameEn: 'Ahmed Mohammed',
        nationalId: '1234567891',
        email: 'ahmed@company.com',
        phone: '+966501234568',
        nationality: 'SAUDI',
        joinDate: new Date('2021-06-15'),
      },
    });

    console.log('✅ تم إنشاء الموظفين بنجاح');
    console.log('📌 مدير النظام ID:', adminEmployee.id);
    console.log('📌 موظف ID:', employee.id);
    console.log('');
    console.log('الآن قم بإنشاء المستخدمين عن طريق:');
    console.log('POST http://localhost:4000/auth/register');
    console.log('Body: {"username":"admin","password":"admin123","role":"ADMIN","employeeId":' + adminEmployee.id + '}');
    console.log('Body: {"username":"employee1","password":"emp123","role":"EMPLOYEE","employeeId":' + employee.id + '}');
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
