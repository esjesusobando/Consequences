@echo off
echo 🔱 Iniciando Drilling Calculator (Radar Mode)...
cd /d "%~dp0"
start "" http://localhost:5173
npm run dev
pause
