@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   تثبيت نظام الموارد البشرية - Client
echo ========================================
echo.

REM Get server IP
set /p SERVER_IP="ادخل IP السيرفر (مثال: 192.168.1.100): "

if "%SERVER_IP%"=="" (
    echo.
    echo ❌ خطأ: يجب ادخال IP السيرفر
    pause
    exit /b 1
)

echo.
echo 🔍 جاري اختبار الاتصال بالسيرفر...
ping -n 1 %SERVER_IP% >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  تحذير: لا يمكن الوصول الى السيرفر %SERVER_IP%
    echo.
    echo تأكد من:
    echo   ✓ IP السيرفر صحيح
    echo   ✓ السيرفر يعمل (تشغيل-السيرفر.bat)
    echo   ✓ Firewall يسمح بالاتصال
    echo   ✓ الجهازان على نفس الشبكة
    echo.
    set /p CONTINUE="هل تريد المتابعة على أي حال؟ (Y/N): "
    if /i not "!CONTINUE!"=="Y" (
        exit /b 1
    )
) else (
    echo ✓ تم الاتصال بالسيرفر بنجاح
)

echo.
echo 📦 جاري التثبيت...
echo.

REM Create program directory
set INSTALL_DIR=%LOCALAPPDATA%\HR-System
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
echo ✓ تم انشاء مجلد البرنامج

REM Create startup script
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
echo ✓ تم انشاء ملف التشغيل

REM Create info file
(
echo ========================================
echo   معلومات الاتصال - نظام الموارد البشرية
echo ========================================
echo.
echo 🌐 IP السيرفر: %SERVER_IP%
echo 📍 رابط النظام: http://%SERVER_IP%:8080/login.html
echo 🔌 رابط API: http://%SERVER_IP%:3000
echo.
echo 📅 تاريخ التثبيت: %date% %time%
echo.
echo ========================================
echo   ملاحظات مهمة
echo ========================================
echo.
echo ⚠️  يجب ان يكون السيرفر يعمل قبل فتح النظام
echo ⚠️  في حالة تغيير IP السيرفر، استخدم ملف:
echo     تحديث-اعدادات-العميل.bat
echo.
echo 🔐 بيانات الدخول الافتراضية:
echo     المدير: admin / admin123
echo     الموظف: employee1 / emp123
echo.
echo ⚡ للدعم الفني، راجع ملف:
echo     دليل-تثبيت-العميل.md
echo.
echo ========================================
) > "%INSTALL_DIR%\معلومات-الاتصال.txt"
echo ✓ تم انشاء ملف المعلومات

REM Create desktop shortcut
set SCRIPT="%TEMP%\CreateShortcut.vbs"
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
echo ✓ تم انشاء اختصار على سطح المكتب

echo.
echo ========================================
echo   ✅ تم التثبيت بنجاح!
echo ========================================
echo.
echo 🎯 تم انشاء اختصار على سطح المكتب
echo    اسم الاختصار: "نظام الموارد البشرية"
echo.
echo 📊 معلومات السيرفر:
echo    IP: %SERVER_IP%
echo    رابط النظام: http://%SERVER_IP%:8080/login.html
echo.
echo 📝 موقع ملفات البرنامج:
echo    %INSTALL_DIR%
echo.
echo 💡 ملاحظة هامة:
echo    ✓ تأكد من تشغيل السيرفر قبل فتح النظام
echo    ✓ راجع ملف "معلومات-الاتصال.txt" للتفاصيل
echo.
echo ========================================
echo.
pause
