# NP-21: Ecosystem Installation Guide — gentle-ai + gentle-pi + Compound Engineering

**Fecha:** 2026-05-23
**Contexto:** Sesión de auditoría v4.7, reemplazo de Agent Teams Lite por gentle-ai
**Estado:** COMPLETED

---

## Resumen

Documentación completa de instalación y configuración del ecosistema Gentleman Programming + EveryInc para el PersonalOS.

---

## 1. gentle-ai (SDD Orchestrator + Ecosystem)

**Repo:** https://github.com/Gentleman-Programming/gentle-ai
**Latest:** v1.30.8 (May 22, 2026)
**Stars:** 3.2k | **Forks:** 387 | **Commits:** 544 | **Releases:** 184
**Stack:** Go (92.7%) + Shell + TypeScript + PowerShell
**Reemplaza:** Agent Teams Lite (archivado)

### Instalación

| OS | Comando |
|----|---------|
| **macOS/Linux (brew)** | `brew tap Gentleman-Programming/homebrew-tap && brew install gentle-ai` |
| **Windows (scoop)** | `scoop bucket add gentleman https://github.com/Gentleman-Programming/scoop-bucket && scoop install gentle-ai` |
| **Go install** | `go install github.com/gentleman-programming/gentle-ai/cmd/gentle-ai@latest` |
| **Windows (script)** | `irm https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/scripts/install.ps1 \| iex` |

### Post-install

```bash
gentle-ai sync              # Sincronizar skills y configs
gentle-ai skill-registry refresh   # Refrescar registry
gentle-ai update            # Verificar actualizaciones
```

### SDD Commands (vía gentle-orchestrator)

| Comando | Función |
|---------|---------|
| `/sdd-init` | Inicializa contexto SDD + detecta stack + testing |
| `/sdd-explore <topic>` | Explora ideas, investiga código |
| `/sdd-new <change>` | Pipeline completo: propuesta → specs → diseño → tareas |
| `/sdd-ff <name>` | Fast-forward: proposal → specs → design → tasks |
| `/sdd-continue [change]` | Siguiente fase según dependencias |
| `/sdd-apply [change]` | Implementa tareas en batches |
| `/sdd-verify [change]` | Valida contra specs y tests |
| `/sdd-archive [change]` | Archiva cambio y persiste estado |

### Perfiles Multi-Modelo (OpenCode)

```bash
gentle-ai sync --profile cheap:openrouter/qwen/qwen3-30b-a3b:free
gentle-ai sync --profile-phase cheap:sdd-design:anthropic/claude-sonnet-4-20250514
```

### Model Assignments (opencode.json)

```json
{
  "agent": {
    "gentle-orchestrator": { "model": "anthropic/claude-sonnet-4-20250514" },
    "sdd-design": { "model": "anthropic/claude-sonnet-4-20250514" },
    "sdd-apply-cheap": { "model": "openrouter/qwen/qwen3-30b-a3b:free" }
  }
}
```

### 13 Supported Agents

Claude Code, OpenCode, Kilo Code, Gemini CLI, Cursor, VS Code Copilot, Codex, Windsurf, Antigravity, Kimi Code, Kiro IDE, Qwen Code, OpenClaw, Pi

---

## 2. gentle-pi (Pi Agent Harness)

**Repo:** https://github.com/Gentleman-Programming/gentle-pi
**Stack:** Go binary + package-managed subagents
**Requiere:** oh-my-pi (pi CLI)

### Instalación

```bash
# 1. Instalar oh-my-pi
brew install oh-my-pi        # macOS
scoop install oh-my-pi       # Windows
go install github.com/oh-my-pi/pi/cmd/pi@latest

# 2. Verificar
pi --version

# 3. Conectar gentle-pi
gentle-ai sync               # gentle-ai configura Pi automáticamente
# O manual:
pi install gentle-pi
```

### Comandos Pi

```bash
pi                          # Iniciar sesión interactiva
pi -ns                      # Iniciar sin startup hooks (más rápido)
/pi-model                   # Cambiar modelo
/pi-persona                 # Cambiar persona
```

### Prerequisitos

Pi necesita subagentes para habilidades delegadas:
```bash
pi install npm:pi-subagents    # Requerido — tool `subagent`
pi install npm:pi-ask-user     # Recomendado — tool `ask_user`
```

---

## 3. Compound Engineering Plugin (EveryInc)

**Repo:** https://github.com/EveryInc/compound-engineering-plugin
**Latest:** v3.8.4 (May 21, 2026)
**Stars:** 17.1k | **Forks:** 1.3k | **Commits:** 815 | **Releases:** 153
**Stack:** TypeScript (80.4%) + Bun runtime
**Skills:** 37 | **Agents:** 51
**Autor:** Every Inc. (Dan Shipper, etc.)

### Instalación por Agente

#### Claude Code (nativo)
```bash
# Desde el chat de Claude:
/plugin marketplace add EveryInc/compound-engineering-plugin
/plugin install compound-engineering
```

#### Cursor (nativo)
```
# En Cursor Agent chat:
/add-plugin compound-engineering
# O buscar "compound engineering" en el marketplace
```

#### Codex (nativo + Bun)
```bash
# 1. Registrar marketplace
codex plugin marketplace add EveryInc/compound-engineering-plugin

# 2. Instalar agentes (Bun — necesario hasta que Codex soporte agentes nativos)
bunx @every-env/compound-plugin install compound-engineering --to codex

# 3. Instalar plugin via TUI
#   - Abrir codex
#   - `/plugins`
#   - Seleccionar Compound Engineering
#   - Instalar compound-engineering
#   - Reiniciar Codex
```

#### OpenCode, Pi, Gemini, Kiro (Bun converter)
```bash
bunx @every-env/compound-plugin install compound-engineering --to opencode
bunx @every-env/compound-plugin install compound-engineering --to pi
bunx @every-env/compound-plugin install compound-engineering --to gemini
bunx @every-env/compound-plugin install compound-engineering --to kiro

# O instalar a todos:
bunx @every-env/compound-plugin install compound-engineering --to all
```

#### GitHub Copilot (VS Code)
```
# Command Palette → "Chat: Install Plugin from Source"
# Repo: EveryInc/compound-engineering-plugin
# Plugin: compound-engineering
```

#### GitHub Copilot CLI
```bash
# Dentro de Copilot CLI:
/plugin marketplace add EveryInc/compound-engineering-plugin
/plugin install compound-engineering@compound-engineering-plugin

# O desde shell:
copilot plugin marketplace add EveryInc/compound-engineering-plugin
copilot plugin install compound-engineering@compound-engineering-plugin
```

#### Factory Droid
```bash
droid plugin marketplace add https://github.com/EveryInc/compound-engineering-plugin
droid plugin install compound-engineering@compound-engineering-plugin
```

#### Qwen Code
```bash
qwen extensions install EveryInc/compound-engineering-plugin:compound-engineering
```

### CE Workflow

```
/ce-strategy       → Estrategia de producto (STRATEGY.md)
/ce-ideate         → Generar ideas y criticarlas
/ce-brainstorm     → Requirements doc interactivo
/ce-plan           → Plan de implementación detallado
/ce-work           → Ejecutar plan con worktrees
/ce-debug          → Debug sistemático
/ce-code-review    → Code review multi-agente
/ce-compound       → Documentar learnings
/ce-product-pulse  → Reporte de uso/performance
/ce-setup          → Check + bootstrap inicial
```

### CE Skills (37) + Agents (51) locales

El OS ya tiene CE instalado en:
```
01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/
├── 01_Agents_Review/
├── 02_Agents_DocReview/
├── 03_Agents_Design/
├── 04_Agents_Research/
├── 05_Agents_Workflow/
├── 06_Agents_Docs/
├── 07_Skills/
├── 08_Mcp/
├── 09_Scripts/
└── SKILL.md
```

### Limpieza de instalaciones legacy Bun

```bash
bunx @every-env/compound-plugin cleanup --target codex
bunx @every-env/compound-plugin cleanup --target opencode
bunx @every-env/compound-plugin cleanup --target pi
bunx @every-env/compound-plugin cleanup --target copilot
bunx @every-env/compound-plugin cleanup --target droid
bunx @every-env/compound-plugin cleanup --target qwen
```

---

## 4. Estado Actual en el PersonalOS

| Componente | Versión | Estado | Notas |
|------------|---------|--------|-------|
| **gentle-ai** | v1.30.8 | ✅ ACTUALIZADO | Go bin en `~/go/bin/gentle-ai.exe` + AppData |
| **gentle-pi** | — | ❌ NO INSTALADO | oh-my-pi no está instalado |
| **CE Plugin** | v3.8.3 (bun) | ✅ DISPONIBLE | Instalación Bun disponible, no nativa |
| **CE Skills** | v3.x | ✅ ACTIVO | En `01_Core/02_Tools/02_Skills/00_Compound_Engineering/` |
| **Agent Teams Lite** | v2.0 (legacy) | 🗄️ LEGACY | Archivo → reemplazado por gentle-ai |
| **Engram** | v1.15.15 | ✅ ACTIVO | Memoria persistente |
| **GGA** | v2.8.1 | ✅ ACTIVO | Code Review pre-commit |

### Próximos pasos recomendados

1. Instalar oh-my-pi + gentle-pi
2. Instalar CE plugin vía `bunx @every-env/compound-plugin install compound-engineering --to opencode`
3. Configurar perfiles multi-modelo en opencode.json

---

*Think Different PersonalOS v4.7 — Ecosystem Install Guide v1.0*
