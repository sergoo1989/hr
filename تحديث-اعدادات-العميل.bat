@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   تحديث اعدادات النظام - Client
echo ========================================
echo.
echo استخدم هذا الملف اذا تغير IP السيرفر
echo.

REM Get server IP
set /p SERVER_IP="ادخل IP السيرفر الجديد (مثال: 192.168.1.100): "

if "%SERVER_IP%"=="" (
    echo.
    echo ❌ خطأ: يجب ادخال IP السيرفر
    pause
    exit /b 1
)

echo.
echo 🔍 جاري اختبار الاتصال...
ping -n 1 %SERVER_IP% >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  تحذير: لا يمكن الوصول الى السيرفر %SERVER_IP%
    echo تأكد من IP السيرفر والاتصال
    echo.
    set /p CONTINUE="هل تريد المتابعة؟ (Y/N): "
    if /i not "!CONTINUE!"=="Y" (
        exit /b 1
    )
) else (
    echo ✓ تم الاتصال بالسيرفر بنجاح
)

set INSTALL_DIR=%LOCALAPPDATA%\HR-System

if not exist "%INSTALL_DIR%" (
    echo.
    echo ❌ خطأ: البرنامج غير مثبت
    echo.
    echo قم بتشغيل "تثبيت-على-جهاز-العميل.bat" أولاً
    echo.
    pause
    exit /b 1
)

echo.
echo 🔄 جاري التحديث...
echo.

REM Update startup script
(
echo @echo off
echo chcp 65001 ^>nul
echo cls
echo.
echo ========================================
echo   نظام الموارد البشرية
echo ========================================
echo.
echo 🚀 جاري فتح النظام...
echo 🌐 السيرفر: %SERVER_IP%
echo.
echo 📌 الرابط: http://%SERVER_IP%:8080/login.html
echo.
echo ⏳ الرجاء الانتظار...
echo ========================================
echo.
echo start http://%SERVER_IP%:8080/login.html
echo timeout /t 2 /nobreak ^>nul
) > "%INSTALL_DIR%\تشغيل-النظام.bat"
echo ✓ تم تحديث ملف التشغيل

REM Update info file
(
echo ========================================
echo   معلومات الاتصال - نظام الموارد البشرية
echo ========================================
echo.
echo 🌐 IP السيرفر: %SERVER_IP%
echo 📍 رابط النظام: http://%SERVER_IP%:8080/login.html
echo 🔌 رابط API: http://%SERVER_IP%:3000
echo.
echo 📅 تاريخ آخر تحديث: %date% %time%
echo.
echo ========================================
echo   ملاحظات مهمة
echo ========================================
echo.
echo ⚠️  يجب ان يكون السيرفر يعمل قبل فتح النظام
echo ⚠️  في حالة تغيير IP السيرفر مرة اخرى، استخدم:
echo     تحديث-اعدادات-العميل.bat
echo.
echo 🔐 بيانات الدخول الافتراضية:
echo     المدير: admin / admin123
echo     الموظف: employee1 / emp123
echo.
echo ========================================
) > "%INSTALL_DIR%\معلومات-الاتصال.txt"
echo ✓ تم تحديث ملف المعلومات

REM Update desktop shortcut
set SCRIPT="%TEMP%\UpdateShortcut.vbs"
(
echo Set oWS = WScript.CreateObject("WScript.Shell"^)
echo sLinkFile = "%USERPROFILE%\Desktop\نظام الموارد البشرية.lnk"
echo Set oLink = oWS.CreateShortcut(sLinkFile^)
echo oLink.TargetPath = "%INSTALL_DIR%\تشغيل-النظام.bat"
echo oLink.WorkingDirectory = "%INSTALL_DIR%"
echo oLink.Description = "نظام ادارة الموارد البشرية - Server: %SERVER_IP%"
echo oLink.IconLocation = "shell32.dll,21"
echo oLink.Save
) > %SCRIPT%
cscript /nologo %SCRIPT% >nul 2>&1
del %SCRIPT%
echo ✓ تم تحديث الاختصار

echo.
echo ========================================
echo   ✅ تم التحديث بنجاح!
echo ========================================
echo.
echo 🌐 IP السيرفر الجديد: %SERVER_IP%
echo 📍 رابط النظام: http://%SERVER_IP%:8080/login.html
echo.
echo 💡 يمكنك الآن فتح النظام من الاختصار
echo.
echo ========================================
echo.
pause
