@echo off
cd /d "%~dp0"
echo ========================================
echo INSTALLING DEPENDENCIES...
echo ========================================
npm install
echo.
echo ========================================
echo STARTING DEV SERVER...
echo ========================================
npm run dev
pause