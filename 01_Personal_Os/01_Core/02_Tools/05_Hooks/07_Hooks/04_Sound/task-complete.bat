@echo off
REM Script para reproducir sonido de tarea completada
REM Uso: task-complete.bat

python "%~dp0notification.py" --task-complete
