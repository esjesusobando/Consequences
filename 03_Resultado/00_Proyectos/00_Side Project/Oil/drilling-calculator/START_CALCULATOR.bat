@echo off
echo 🔱 Iniciando Drilling Calculator (Radar Mode)...
cd /d "%~dp0"

REM Verificar que node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
)

REM Abrir navegador DESPUES de que el servidor este listo (con timeout)
echo 🌐 Abriendo navegador...
timeout /t 3 /nobreak >nul
start "" http://localhost:5173

npm run dev
pause
