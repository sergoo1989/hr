@echo off
echo ====================================
echo   تشغيل خادم نظام الموارد البشرية
echo ====================================
echo.
cd /d "c:\Users\ahmed\vs code\hr\apps\api"
echo تشغيل الخادم على http://localhost:4000
echo.
echo بيانات الدخول:
echo   مدير: admin / admin123
echo   موظف: employee1 / emp123
echo.
echo لإيقاف الخادم اضغط Ctrl+C
echo ====================================
echo.
npm run start:dev
pause
