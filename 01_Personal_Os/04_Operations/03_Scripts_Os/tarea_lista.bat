@echo off
REM Tarea completada - sonido de notificacion
REM Fallback si python no esta disponible: usa beep nativo de Windows

python -c "import winsound; winsound.Beep(523,100); winsound.Beep(659,100); winsound.Beep(784,150)" 2>nul
if %ERRORLEVEL% NEQ 0 (
    REM Fallback: beep nativo de Windows (cmd)
    echo 
)
