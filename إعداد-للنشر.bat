@echo off
chcp 65001 >nul
cls

echo.
echo ════════════════════════════════════════════════════════════
echo   🌐 إعداد النظام للنشر على الإنترنت
echo ════════════════════════════════════════════════════════════
echo.
echo سيساعدك هذا الملف في:
echo   1. تحديث config.js لرابط API الإنتاج
echo   2. التحقق من الملفات الجاهزة للنشر
echo.
pause

echo.
echo ════════════════════════════════════════════════════════════
echo   الخطوة 1: أدخل رابط API من Railway
echo ════════════════════════════════════════════════════════════
echo.
echo بعد رفع API على Railway، هتاخد رابط زي:
echo   https://your-app.railway.app
echo.

set /p API_URL="أدخل رابط API (بدون / في الآخر): "

if "%API_URL%"=="" (
    echo.
    echo ❌ خطأ: يجب إدخال رابط API
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo   الخطوة 2: تحديث config.js
echo ════════════════════════════════════════════════════════════
echo.

REM Create updated config.js
(
echo // ملف إعدادات API URL - محدّث للإنتاج
echo const Config = {
echo     getApiUrl: function^(^) {
echo         const hostname = window.location.hostname;
echo.        
echo         // للتطوير المحلي
echo         if ^(hostname === 'localhost' ^|^| hostname === '127.0.0.1'^) {
echo             return 'http://localhost:3000';
echo         }
echo.        
echo         // للشبكة المحلية
echo         if ^(hostname.match^(/^^192\\.168\\.|^^10\\.|^^172\\.^(1[6-9]^|2[0-9]^|3[0-1]^)\\./^)^) {
echo             return `http://${hostname}:3000`;
echo         }
echo.        
echo         // للإنتاج ^(الإنترنت^)
echo         return '%API_URL%';
echo     }
echo };
echo.
echo const API_URL = Config.getApiUrl^(^);
echo.
echo console.log^('🌐 API Configuration:'^);
echo console.log^('   Frontend:', window.location.origin^);
echo console.log^('   API URL:', API_URL^);
) > "frontend\config.js"

echo ✅ تم تحديث config.js
echo    API URL: %API_URL%

echo.
echo ════════════════════════════════════════════════════════════
echo   الخطوة 3: التحقق من الملفات
echo ════════════════════════════════════════════════════════════
echo.

if exist "apps\api\Procfile" (
    echo ✅ Procfile موجود ^(للنشر^)
) else (
    echo ⚠️  Procfile غير موجود
)

if exist "apps\api\package.json" (
    echo ✅ package.json موجود
) else (
    echo ❌ package.json غير موجود
)

if exist "frontend\index.html" (
    echo ✅ Frontend files موجودة
) else (
    echo ❌ Frontend files غير موجودة
)

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ الإعداد اكتمل!
echo ════════════════════════════════════════════════════════════
echo.
echo 📋 الخطوات التالية:
echo.
echo   Backend ^(API^):
echo   ────────────────────────────────────────────────────────
echo   1. روح على: https://railway.app
echo   2. سجل دخول بـ GitHub
echo   3. New Project → Deploy from GitHub
echo   4. Root Directory: apps/api
echo   5. Deploy!
echo.
echo   Frontend:
echo   ────────────────────────────────────────────────────────
echo   1. روح على: https://vercel.com
echo   2. سجل دخول بـ GitHub
echo   3. New Project → اختار المشروع
echo   4. Root Directory: frontend
echo   5. Deploy!
echo.
echo   🎉 بعد كده، أي حد يقدر يفتح النظام من الرابط!
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📖 للمزيد من التفاصيل، راجع:
echo    - دليل-النشر-على-النت.txt
echo    - DEPLOYMENT_GUIDE.md
echo.
pause
