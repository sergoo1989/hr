# خطوات سريعة لحل مشكلة Vercel

## المشكلة 🔴
```
خطأ في الاتصال بالخادم، تأكد من تشغيل ال API على المنفذ 3000
```

## السبب
Frontend على Vercel يبحث عن API على `localhost:3000` وهذا لا يعمل!

## الحل ✅

### 1. رفع API على Railway

```bash
# اذهب إلى
https://railway.app

# ثم:
1. New Project
2. Deploy from GitHub repo
3. اختر repository الخاص بك
```

**إعدادات Railway:**
- Root Directory: `apps/api`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start:prod`

**Variables (متغيرات البيئة):**
```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
```

### 2. احصل على رابط API من Railway

بعد النشر، ستحصل على رابط مثل:
```
https://hr-api-production-abc123.up.railway.app
```

### 3. حدّث ملف config.js

افتح: `frontend/config.js`

غيّر السطر:
```javascript
return window.PRODUCTION_API_URL || 'https://your-app-name.up.railway.app';
```

إلى:
```javascript
return window.PRODUCTION_API_URL || 'https://hr-api-production-abc123.up.railway.app';
```
(ضع رابط Railway الحقيقي الخاص بك)

### 4. ارفع على Vercel مرة أخرى

```bash
vercel --prod
```

أو من خلال GitHub (push التغييرات وسيتم deploy تلقائياً)

## ✅ انتهى!

جرب الآن تسجيل الدخول على:
- Username: `admin`
- Password: `admin123`

---

## المستندات الكاملة

للمزيد من التفاصيل، اقرأ: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## مشاكل؟

### CORS Error
إذا ظهر خطأ CORS، أضف رابط Vercel في Railway Variables:
```
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### API لا يعمل
تحقق من Logs في Railway:
```
Railway Dashboard → Deployments → View Logs
```
