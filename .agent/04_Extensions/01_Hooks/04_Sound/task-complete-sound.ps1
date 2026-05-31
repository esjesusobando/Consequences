# Script para reproducir un sonido cuando se completa una tarea
# Uso: .\task-complete-sound.ps1
# Para integrar con Claude Code: agregar a hooks en CLAUDE.md

param(
    [string]$Sound = "Asterisk",  # Asterisk, Beep, Exclamation, Hand, Question
    [int]$Duration = 200            # Duración en ms para Beep
)

# Sonidos disponibles del sistema Windows
$systemSounds = @{
    "Asterisk"    = [System.Media.SystemSounds]::Asterisk
    "Beep"        = [System.Media.SystemSounds]::Beep
    "Exclamation" = [System.Media.SystemSounds]::Exclamation
    "Hand"        = [System.Media.SystemSounds]::Hand
    "Question"    = [System.Media.SystemSounds]::Question
}

try {
    if ($systemSounds.ContainsKey($Sound)) {
        $systemSounds[$Sound].Play()
        Write-Host "🔔 Sonido reproducido: $Sound"
    } else {
        [Console]::Beep(800, $Duration)
        Write-Host "🔔 Beep reproducido"
    }
} catch {
    try {
        [Console]::Beep(1000, 150)
    } catch {
        # Silenciosamente ignorar errores
    }
}

exit 0
