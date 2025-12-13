@echo off
echo ========================================
echo نظام ادارة الموارد البشرية والرواتب
echo ========================================
echo.
echo جاري تشغيل النظام...
echo.

REM Start API
start "HR API" cmd /k "cd apps\api && npm install && npm run start:prod"

REM Wait for API to start
timeout /t 10 /nobreak >nul

REM Start Frontend
start "HR Frontend" cmd /k "cd frontend && python -m http.server 8080"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:8080/login.html

echo.
echo ========================================
echo تم تشغيل النظام بنجاح!
echo ========================================
echo.
echo الموقع: http://localhost:8080/login.html
echo API: http://localhost:3000
echo.
echo بيانات الدخول:
echo مدير: admin / admin123
echo موظف: employee1 / emp123
echo.
echo لاغلاق البرنامج، اغلق النوافذ السوداء
echo ========================================
pause
