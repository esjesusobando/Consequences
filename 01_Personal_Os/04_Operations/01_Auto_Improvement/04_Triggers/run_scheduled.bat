@echo off
REM ============================================================
REM run_scheduled.bat — Llamado por Windows Task Scheduler cada 8h
REM No requiere ventana ni interacción.
REM ============================================================
set PYTHONIOENCODING=utf-8
set "ROOT_DIR=%~dp0..\..\..\.."
pushd "%ROOT_DIR%"
python -X utf8 "%~dp0cron_trigger.py" --once --apply --path "%CD%"
popd
