import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    // إنشاء مستخدم أدمن
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedAdminPassword,
        role: 'ADMIN',
        employeeId: adminEmployee.id,
      },
    });

    // إنشاء مستخدم موظف
    const hashedEmployeePassword = await bcrypt.hash('emp123', 10);
    const employeeUser = await prisma.user.create({
      data: {
        username: 'employee1',
        password: hashedEmployeePassword,
        role: 'EMPLOYEE',
        employeeId: employee.id,
      },
    });

    console.log('✅ تم إنشاء المستخدمين بنجاح:');
    console.log('📌 مدير النظام:', adminUser.username, '/ password: admin123');
    console.log('📌 موظف:', employeeUser.username, '/ password: emp123');
    console.log('🎉 تمت العملية بنجاح!');
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
