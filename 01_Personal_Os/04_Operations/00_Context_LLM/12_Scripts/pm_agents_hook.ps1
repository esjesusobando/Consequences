# Hook SOTA para Equipo de Agentes PM
# Automatiza el inicio del entorno de trabajo PM SOTA

Write-Host "🚀 Iniciando Equipo de Agentes SOTA en Claude Code..." -ForegroundColor Green

# 1. Abrir herramientas principales
Start-Process "https://claude.ai/code"
# Start-Process "cursor.exe" # Descomentar si se usa Cursor localmente

# 2. Sincronizar contexto Git (Single Source of Truth)
Write-Host "🔄 Sincronizando repositorio Git (SSOT)..." -ForegroundColor Cyan
git pull origin main

# 3. Solicitar entrada de usuario (Tarea o URL)
$inputData = Read-Host "Ingresa tarea o URL (YouTube/Podcast): "

# 4. Ejecutar orquestador Python
python "$PSScriptRoot\pm_agents_sota.py" $inputData

# 5. Notificar carga de Skill
Write-Host "✅ Skill SOTA cargada: /use_skill EquipoAgentesPM_SOTA_ClaudeCode" -ForegroundColor Yellow
Write-Host "⚠️  Recuerda aplicar Back Pressure en cada gate de decisión humana." -ForegroundColor Magenta
