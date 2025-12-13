@echo off
echo ========================================
echo تشغيل السيرفر - نظام الموارد البشرية
echo ========================================
echo.

REM Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo جاري تشغيل السيرفر...
echo.

REM Start API Server
start "HR API Server" cmd /k "cd apps\api && npm install && npm run start:prod"

REM Wait for API to start
echo انتظار تشغيل API...
timeout /t 15 /nobreak >nul

REM Start Frontend Server
start "HR Frontend Server" cmd /k "cd frontend && python -m http.server 8080"

REM Wait
timeout /t 3 /nobreak >nul

REM Open browser locally
start http://localhost:8080/login.html

echo.
echo ========================================
echo السيرفر يعمل الآن!
echo ========================================
echo.
echo IP السيرفر: %IP%
echo.
echo للدخول من الاجهزة الاخرى:
echo http://%IP%:8080/login.html
echo.
echo API Server: http://%IP%:3000
echo Frontend Server: http://%IP%:8080
echo.
echo ========================================
echo.
echo شارك هذا الـ IP مع الموظفين لتثبيت البرنامج على اجهزتهم
echo.
echo لتثبيت على جهاز موظف:
echo 1. انسخ ملف "تثبيت-على-جهاز-العميل.bat" على جهاز الموظف
echo 2. شغّله وادخل IP: %IP%
echo.
echo ========================================
pause
