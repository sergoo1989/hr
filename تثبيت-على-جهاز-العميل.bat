@echo off
setlocal enabledelayedexpansion

echo ========================================
echo تثبيت نظام الموارد البشرية - Client
echo ========================================
echo.

REM Get server IP
set /p SERVER_IP="ادخل IP السيرفر (مثال: 192.168.1.100): "

if "%SERVER_IP%"=="" (
    echo خطأ: يجب ادخال IP السيرفر
    pause
    exit /b 1
)

echo.
echo جاري التثبيت...
echo.

REM Create program directory
set INSTALL_DIR=%LOCALAPPDATA%\HR-System
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Create config file
echo const API_CONFIG = { > "%INSTALL_DIR%\config.js"
echo     getApiUrl: function() { >> "%INSTALL_DIR%\config.js"
echo         return 'http://%SERVER_IP%:3000'; >> "%INSTALL_DIR%\config.js"
echo     } >> "%INSTALL_DIR%\config.js"
echo }; >> "%INSTALL_DIR%\config.js"
echo const API_URL = API_CONFIG.getApiUrl(); >> "%INSTALL_DIR%\config.js"

REM Create startup script
echo @echo off > "%INSTALL_DIR%\تشغيل-النظام.bat"
echo start http://%SERVER_IP%:8080/login.html >> "%INSTALL_DIR%\تشغيل-النظام.bat"

REM Create desktop shortcut
set SCRIPT="%TEMP%\CreateShortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\نظام الموارد البشرية.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%INSTALL_DIR%\تشغيل-النظام.bat" >> %SCRIPT%
echo oLink.Description = "نظام ادارة الموارد البشرية" >> %SCRIPT%
echo oLink.IconLocation = "shell32.dll,21" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo ========================================
echo تم التثبيت بنجاح!
echo ========================================
echo.
echo تم انشاء اختصار على سطح المكتب
echo اسم الاختصار: "نظام الموارد البشرية"
echo.
echo السيرفر: http://%SERVER_IP%:3000
echo.
echo ========================================
pause
