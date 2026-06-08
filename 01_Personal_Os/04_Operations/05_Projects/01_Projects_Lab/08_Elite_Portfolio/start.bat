@echo off
cd /d "%~dp0"

REM Solo instalar si no existe node_modules
if not exist "node_modules" (
    echo ========================================
    echo INSTALLING DEPENDENCIES...
    echo ========================================
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo ========================================
echo STARTING DEV SERVER...
echo ========================================
npm run dev
pause