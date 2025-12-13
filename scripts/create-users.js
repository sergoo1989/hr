const API_URL = 'http://localhost:4000';

async function createUsers() {
  console.log('🌱 بدء إنشاء المستخدمين التجريبيين...\n');

  try {
    // تسجيل مدير النظام
    const adminResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
        role: 'ADMIN'
      })
    });

    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('✅ تم إنشاء مدير النظام بنجاح');
      console.log('   Username: admin');
      console.log('   Password: admin123\n');
    } else {
      const error = await adminResponse.json();
      console.log('⚠️  مدير النظام:', error.message || 'موجود مسبقاً\n');
    }

    // تسجيل موظف
    const employeeResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'employee1',
        password: 'emp123',
        role: 'EMPLOYEE'
      })
    });

    if (employeeResponse.ok) {
      const employeeData = await employeeResponse.json();
      console.log('✅ تم إنشاء الموظف بنجاح');
      console.log('   Username: employee1');
      console.log('   Password: emp123\n');
    } else {
      const error = await employeeResponse.json();
      console.log('⚠️  الموظف:', error.message || 'موجود مسبقاً\n');
    }

    console.log('🎉 انتهى! يمكنك الآن تسجيل الدخول');
    console.log('🔗 افتح: file:///c:/Users/ahmed/vs code/hr/frontend/login.html\n');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.error('تأكد من تشغيل السيرفر على http://localhost:4000');
  }
}

createUsers();
