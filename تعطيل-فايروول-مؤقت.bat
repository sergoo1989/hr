@echo off
chcp 65001 >nul

echo ========================================
echo تعطيل Firewall مؤقتاً (للاختبار فقط)
echo ========================================
echo.
echo ⚠️  تحذير: هذا سيعطل الحماية مؤقتاً
echo استخدمه فقط للاختبار
echo.
pause

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ❌ خطأ: يجب تشغيل هذا الملف كمسؤول!
    echo.
    pause
    exit /b 1
)

echo.
echo جاري تعطيل Firewall...
netsh advfirewall set allprofiles state off

if %errorLevel% equ 0 (
    echo.
    echo ✅ تم تعطيل Firewall
    echo.
    echo جرّب الآن الاتصال من لابتوب الموظف
    echo.
    echo ⚠️  مهم: لا تنسى إعادة تشغيل Firewall بعد الاختبار
    echo شغّل ملف: تشغيل-فايروول.bat
) else (
    echo.
    echo ❌ فشل تعطيل Firewall
)

echo.
pause
