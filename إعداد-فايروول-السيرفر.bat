@echo off
chcp 65001 >nul

echo ========================================
echo إعداد Firewall للسيرفر
echo ========================================
echo.
echo هذا الملف سيسمح للأجهزة الأخرى بالاتصال بالسيرفر
echo يجب تشغيله كمسؤول (Run as Administrator)
echo.
pause

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo خطأ: يجب تشغيل هذا الملف كمسؤول!
    echo.
    echo اضغط بزر الماوس الأيمن على الملف واختر:
    echo "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo جاري إعداد Firewall...
echo.

REM Delete old rules if exist
netsh advfirewall firewall delete rule name="HR System - API" >nul 2>&1
netsh advfirewall firewall delete rule name="HR System - Frontend" >nul 2>&1
netsh advfirewall firewall delete rule name="HR System - Python Server" >nul 2>&1

REM Add new rules
echo [1/3] إضافة قاعدة للـ API (المنفذ 3000)...
netsh advfirewall firewall add rule name="HR System - API" dir=in action=allow protocol=TCP localport=3000
if %errorLevel% equ 0 (
    echo [OK] تمت إضافة قاعدة API بنجاح
) else (
    echo [خطأ] فشل في إضافة قاعدة API
)

echo.
echo [2/3] إضافة قاعدة للـ Frontend (المنفذ 8080)...
netsh advfirewall firewall add rule name="HR System - Frontend" dir=in action=allow protocol=TCP localport=8080
if %errorLevel% equ 0 (
    echo [OK] تمت إضافة قاعدة Frontend بنجاح
) else (
    echo [خطأ] فشل في إضافة قاعدة Frontend
)

echo.
echo [3/3] إضافة قاعدة لـ Python Server (المنفذ 8080)...
netsh advfirewall firewall add rule name="HR System - Python Server" dir=in action=allow program="C:\Users\ahmed\AppData\Local\Programs\Python\Python312\python.exe" dir=in action=allow
if %errorLevel% equ 0 (
    echo [OK] تمت إضافة قاعدة Python Server بنجاح
) else (
    echo [تحذير] فشل في إضافة قاعدة Python Server
    echo سيتم المحاولة مع مسار Python الافتراضي
    netsh advfirewall firewall add rule name="HR System - Python Server" program="python.exe" dir=in action=allow >nul 2>&1
)

echo.
echo ========================================
echo تم الإعداد!
echo ========================================
echo.
echo تم السماح للمنافذ التالية:
echo   - المنفذ 3000 (API Server)
echo   - المنفذ 8080 (Frontend Server)
echo.
echo الآن يمكن للأجهزة الأخرى الاتصال بالسيرفر
echo.
echo الخطوة التالية:
echo   1. قم بتشغيل "تشغيل-السيرفر.bat"
echo   2. احصل على IP السيرفر
echo   3. وزع "تثبيت-على-جهاز-العميل.bat" على أجهزة العملاء
echo.
echo ========================================
pause
