@echo off
REM ============================================================
REM run.bat — Punto de entrada rapido para Auto-Improvement
REM Uso:  run --scan     (solo escanear)
REM       run --full     (ciclo completo dry-run)
REM       run --full --apply  (ciclo completo LIVE)
REM       run --learn    (solo aprendizaje)
REM       run --report   (reporte de estado)
REM ============================================================
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0"
set "PYTHON_CMD=python -X utf8"
set "MANUAL_TRIGGER=%ROOT_DIR%04_Triggers\manual_trigger.py"

REM Pasar todos los argumentos al trigger
%PYTHON_CMD% "%MANUAL_TRIGGER%" --path "%ROOT_DIR%..\..\.." %*

if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Auto-Improvement fallo con codigo: !errorlevel!
    pause
)
