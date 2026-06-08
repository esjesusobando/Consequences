@echo off
REM Script para reproducir sonido de tarea completada
REM Uso: task-complete.bat
REM Uso con sonido personalizado: task-complete.bat --success

python "%~dp0notification.py" %*
if %ERRORLEVEL% NEQ 0 (
    REM Fallback: beep del sistema si notification.py falla
    echo python not found or notification.py error, using fallback beep...
    echo 
)
