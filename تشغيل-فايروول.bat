@echo off
chcp 65001 >nul

echo ========================================
echo إعادة تشغيل Firewall
echo ========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ❌ خطأ: يجب تشغيل هذا الملف كمسؤول!
    echo.
    pause
    exit /b 1
)

echo جاري تشغيل Firewall...
netsh advfirewall set allprofiles state on

if %errorLevel% equ 0 (
    echo.
    echo ✅ تم تشغيل Firewall
    echo.
    echo الحماية نشطة الآن
) else (
    echo.
    echo ❌ فشل تشغيل Firewall
)

echo.
pause
