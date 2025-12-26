# 🚀 دليل التحويل إلى قاعدة بيانات PostgreSQL

## ✅ الملفات التي تم إنشاؤها

1. ✅ `prisma/schema.prisma` - تعريف جداول قاعدة البيانات
2. ✅ `src/prisma/prisma.service.ts` - خدمة الاتصال بقاعدة البيانات
3. ✅ `src/prisma/prisma.module.ts` - موديول Prisma
4. ✅ `docker-compose.yml` - ملف Docker لتشغيل PostgreSQL
5. ✅ `.env.example` - مثال لملف المتغيرات البيئية
6. ✅ `src/app.module.ts` - تم تحديثه لاستخدام Prisma و ConfigModule

---

## 📋 الخطوات المتبقية (يجب تنفيذها يدوياً)

### 1️⃣ إنشاء ملف `.env`
نسخ `.env.example` وإنشاء ملف `.env` في مجلد `apps/api`:

```bash
cp .env.example .env
```

أو يدوياً، إنشاء ملف `.env` بالمحتوى التالي:
```
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/hr_db?schema=public"
JWT_SECRET="hr-secret-key-2025-commercial"
NODE_ENV="development"
PORT="3000"
CORS_ORIGIN="*"
```

### 2️⃣ تثبيت المكتبات المطلوبة
```bash
cd apps/api
npm install prisma @prisma/client @nestjs/config --save
```

### 3️⃣ تشغيل قاعدة بيانات PostgreSQL
```bash
docker-compose up -d
```

### 4️⃣ إنشاء الجداول في قاعدة البيانات
```bash
cd apps/api
npx prisma migrate dev --name init
```

### 5️⃣ توليد Prisma Client
```bash
npx prisma generate
```

### 6️⃣ (اختياري) استيراد البيانات الموجودة
إذا كان لديك بيانات في ملف `data/hr-database.json`، ستحتاج لكتابة سكريبت لاستيرادها.

---

## 🔄 الخطوات التالية (بعد اكتمال التثبيت)

1. تعديل `AuthService` لاستخدام `PrismaService` بدلاً من `InMemoryDatabase`
2. تعديل باقي الخدمات (`EmployeeService`, `LeaveService`, إلخ)
3. اختبار النظام
4. حذف ملفات `InMemoryDatabase` القديمة

---

## ⚠️ ملاحظات مهمة

- **لم يتم** تعديل الخدمات بعد (AuthService, EmployeeService, etc.) - ما زالت تستخدم InMemoryDatabase
- النظام **لن يعمل** حتى:
  1. تثبيت المكتبات
  2. تشغيل Docker
  3. تشغيل migrate
  4. تعديل الخدمات

---

## 🛟 إذا واجهت مشاكل

- **Docker لا يعمل؟** تأكد من تثبيت Docker Desktop
- **خطأ في الاتصال؟** تحقق من أن PostgreSQL يعمل: `docker ps`
- **خطأ في Prisma؟** جرب: `npx prisma generate` مرة أخرى
