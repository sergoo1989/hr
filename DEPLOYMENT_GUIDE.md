# دليل نشر التطبيق على Vercel و Railway

## المشكلة الحالية
عند رفع Frontend على Vercel، يظهر خطأ: "خطأ في الاتصال بالخادم، تأكد من تشغيل ال API على المنفذ 3000"

السبب: Frontend يبحث عن API على localhost:3000 والذي لا يعمل في بيئة الإنتاج.

## الحل: فصل Frontend و Backend

### الخطوة 1️⃣: رفع Backend (API) على Railway

#### أ. إنشاء حساب على Railway
1. اذهب إلى: https://railway.app
2. سجل دخول باستخدام GitHub

#### ب. رفع API
1. اضغط على **"New Project"**
2. اختر **"Deploy from GitHub repo"**
3. اختر repository الخاص بك
4. اضغط على **"Deploy Now"**

#### ج. تكوين إعدادات Railway
بعد إنشاء المشروع، اذهب إلى Settings:

**Root Directory:**
```
apps/api
```

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start:prod
```

**Port:**
Railway سيوفر منفذ تلقائياً عبر متغير `PORT`

#### د. متغيرات البيئة (Environment Variables)
أضف في قسم Variables:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# إعدادات البريد الإلكتروني (إذا كنت تستخدمها)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourcompany.com
```

#### ه. احصل على رابط API الخاص بك
بعد النشر بنجاح، ستحصل على رابط مثل:
```
https://your-app-name.up.railway.app
```

**احفظ هذا الرابط! ستحتاجه في الخطوة التالية.**

---

### الخطوة 2️⃣: تحديث Frontend وربطه بـ API

#### أ. تعديل ملف config.js
افتح الملف: `frontend/config.js`

غيّر السطر:
```javascript
return window.PRODUCTION_API_URL || 'https://your-app-name.up.railway.app';
```

إلى رابط Railway الحقيقي الخاص بك:
```javascript
return window.PRODUCTION_API_URL || 'https://hr-api-production-xyz.up.railway.app';
```

#### ب. تحديث vercel.json (اختياري)
يمكنك أيضاً إضافة الرابط كـ environment variable في Vercel:

```json
{
  "buildCommand": "echo 'No build required'",
  "outputDirectory": "frontend",
  "env": {
    "PRODUCTION_API_URL": "https://your-railway-app.up.railway.app"
  },
  "rewrites": [
    { "source": "/", "destination": "/login.html" }
  ]
}
```

---

### الخطوة 3️⃣: رفع Frontend على Vercel

#### أ. تأكد من وجود ملف vercel.json في المشروع
الملف موجود بالفعل في جذر المشروع.

#### ب. رفع على Vercel
هناك طريقتان:

**الطريقة 1: من خلال Vercel CLI**
```bash
# تثبيت Vercel CLI (إذا لم يكن مثبتاً)
npm install -g vercel

# الدخول
vercel login

# رفع المشروع
vercel

# للنشر في الإنتاج
vercel --prod
```

**الطريقة 2: من خلال موقع Vercel**
1. اذهب إلى: https://vercel.com
2. سجل دخول باستخدام GitHub
3. اضغط **"Import Project"**
4. اختر repository الخاص بك
5. Vercel سيكتشف تلقائياً ملف `vercel.json`
6. اضغط **"Deploy"**

---

### الخطوة 4️⃣: اختبار التطبيق

1. افتح رابط Vercel الخاص بك (مثل: `https://your-project.vercel.app`)
2. جرب تسجيل الدخول:
   - **مدير نظام:** username: `admin` | password: `admin123`
   - **موظف:** username: `employee1` | password: `emp123`

---

## ✅ التحقق من النجاح

### علامات النجاح:
- ✅ لا تظهر رسالة خطأ "خطأ في الاتصال بالخادم"
- ✅ يمكن تسجيل الدخول بنجاح
- ✅ البيانات تظهر في لوحة التحكم
- ✅ يمكن إضافة/تعديل الموظفين

### إذا استمرت المشاكل:

#### مشكلة CORS
إذا ظهرت أخطاء CORS، أضف في ملف `apps/api/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://your-vercel-app.vercel.app'  // رابط Vercel الخاص بك
  ],
  credentials: true,
});
```

#### التحقق من logs في Railway
1. اذهب إلى مشروعك في Railway
2. اضغط على **"Deployments"**
3. اضغط على آخر deployment
4. اضغط على **"View Logs"**
5. تحقق من أي أخطاء

---

## 📋 ملخص سريع

1. ✅ **Railway** → رفع API (Backend)
2. ✅ **تحديث config.js** → بإضافة رابط Railway
3. ✅ **Vercel** → رفع Frontend
4. ✅ **اختبار** → تسجيل دخول وتشغيل النظام

---

## 🆘 حل المشاكل الشائعة

### الخطأ: "Failed to fetch"
- تأكد أن API يعمل على Railway
- تحقق من رابط API في `config.js`
- تحقق من إعدادات CORS

### الخطأ: "401 Unauthorized"
- تأكد أن JWT_SECRET موجود في Railway Variables
- جرب إعادة تسجيل الدخول

### الخطأ: "Cannot find module"
- تأكد أن `npm install` يعمل في Railway
- تحقق من Build Logs في Railway

---

## 🔗 روابط مفيدة

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)

---

**ملاحظة مهمة:** بعد رفع API على Railway، لا تنس تحديث رابط API في ملف `frontend/config.js`!
