@echo off
REM ============================================================
REM setup_scheduler.bat — Instala Auto-Improvement en Task Scheduler
REM Ejecutar como Administrador: boton derecho → Ejecutar como adm.
REM ============================================================
setlocal enabledelayedexpansion

title Auto-Improvement Scheduler Setup

REM Obtener ruta absoluta del proyecto
set "ROOT_DIR=%~dp0..\..\..\.."
pushd "%ROOT_DIR%"
set "ROOT_DIR=%CD%"
popd

set "TASK_NAME=AutoImprovementPersonalOS"
set "RUNNER_PATH=%ROOT_DIR%\01_Personal_Os\04_Operations\01_Auto_Improvement\04_Triggers\run_scheduled.bat"
set "WORK_DIR=%ROOT_DIR%"

echo ============================================================
echo  Auto-Improvement Scheduler Setup
echo ============================================================
echo.
echo  Instalando tarea programada cada 8 horas...
echo.
echo  Task Name:  %TASK_NAME%
echo  Script:     %RUNNER_PATH%
echo  WorkingDir: %WORK_DIR%
echo.

REM Eliminar tarea existente si la hay
schtasks /query /tn "%TASK_NAME%" >nul 2>&1
if !errorlevel! equ 0 (
    echo  [INFO] Eliminando tarea existente...
    schtasks /delete /tn "%TASK_NAME%" /f
)

REM Crear tarea programada
schtasks /create ^
    /tn "%TASK_NAME%" ^
    /tr "\"%RUNNER_PATH%\"" ^
    /sc daily ^
    /mo 1 ^
    /ri 480 ^
    /du 9999:00 ^
    /f

if !errorlevel! equ 0 (
    echo.
    echo  [OK] Tarea creada exitosamente.
    echo.
    echo  Schedule: Cada 8 horas (480 min), todos los dias
    echo  Modo:     Dry-run (solo escanea, no modifica)
    echo  Runner:   %RUNNER_PATH%
    echo.
    echo  Para cambiar a LIVE (aplica fixes):
    echo    Editar "%RUNNER_PATH%" y cambiar --once por --once --apply
    echo.
    echo  Para ver el log:
    echo    %ROOT_DIR%\01_Personal_Os\04_Operations\01_Auto_Improvement\03_Metrics\execution.log
) else (
    echo.
    echo  [ERROR] No se pudo crear la tarea.
    echo  Ejecuta este script como ADMINISTRADOR.
)

echo.
pause
