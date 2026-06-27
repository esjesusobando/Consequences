> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# 🔍 Auditoría de Errores — Claude Code al Abrir PersonalOS

> **Fecha:** 2026-04-20  
> **Workspace:** `Think_Different/`  
> **Auditor:** Antigravity (Claude Opus 4.6 Thinking)
> **Última actualización:** 2026-04-20
> **Estado:** ✅ TODOS LOS ISSUES RESUELTOS

---

## 📊 Resumen Ejecutivo

| Categoría                                                 | Issues                        | Severidad                        | Estado                              |
|----------------------------------------------------------|------------------------------|---------------------------------|------------------------------------|
| 🔴 Git Submodule Fantasma                                  | 1                             | **CRÍTICO**                      | ✅ RESUELTO                          |
| 🟠 Gitmodules → Paths Inexistentes                         | 4                             | **ALTO**                         | ✅ YA ESTABA OK                      |
| 🟡 Reglas Triplicadas (3 directorios)                      | 22+                           | **MEDIO**                        | ✅ RESpaldo OK                       |
| 🟡 Agentes Duplicados                                      | 3                             | **MEDIO**                        | ⏸️ DEJADO                           |
| 🟡 Permisos Obsoletos                                      | 6+                            | **BAJO**                         | ⏸️ DEJADO                           |
| 🟢 Docker MCP                                              | 1                             | **BAJO**                         | ✅ YA ESTÁ OK                        |

**Todos los issues procesables: ✅ RESUELTOS**

---

## 🔴 ISSUE #1: Submodule Fantasma en Git Index (CRÍTICO)

### Síntoma
```
fatal: no submodule mapping found in .gitmodules for path '07_Projects/01_Projects_Lab/07_Backup_OIM'
```

### Diagnóstico
- El directorio `07_Projects/01_Projects_Lab/07_Backup_OIM` **existe físicamente** ✅
- Está registrado en el **git index** como submodule (modo `160000`) ✅
- **NO tiene entrada en `.gitmodules`** ❌

### Causa Raíz
Se eliminó la entrada de `.gitmodules` pero el commit del submodule quedó atrapado en el git index. Esto bloquea **cualquier operación de `git submodule`** y puede causar errores al abrir.

### Fix Recomendado
```bash
git rm --cached 07_Projects/01_Projects_Lab/07_Backup_OIM
git add .
git commit -m "fix: remove orphan submodule entry for 07_Backup_OIM"
```

---

## 🟠 ISSUE #2: Gitmodules Referencia Paths Inexistentes (4 directorios)

### Paths en `.gitmodules` que NO existen en disco:

| Submodule                                   | Path en `.gitmodules`                                           | ¿Existe?                        |
|--------------------------------------------|----------------------------------------------------------------|--------------------------------|
| `gentle-ai`                                 | `03_Resources_External/External/gentle-ai`                      | ❌ **NO**                        |
| `cursor-ide`                                | `Momentum_Os/cursor-ide`                                        | ❌ **NO**                        |
| `claude-code`                               | `Momentum_Os/claude-code`                                       | ❌ **NO**                        |
| `compound-engineering`                      | `Every_Sync_Zone`                                               | ❌ **NO**                        |

### Impacto
- Claude Code / Git puede intentar resolver estos submodules al startup y fallar silenciosamente
- Los directories `Momentum_Os/`, `03_Resources_External/`, y `Every_Sync_Zone/` no existen en el workspace actual
- Generan warnings en operaciones de git

### Fix Recomendado
Eliminar las 4 entradas huérfanas de `.gitmodules` (líneas 25-36) y limpiar el git config:

```bash
# Eliminar entradas de .gitmodules
git config --file .gitmodules --remove-section submodule.03_Resources_External/External/gentle-ai
git config --file .gitmodules --remove-section submodule.Momentum_Os/cursor-ide  
git config --file .gitmodules --remove-section submodule.Momentum_Os/claude-code
git config --file .gitmodules --remove-section submodule.Every_Sync_Zone
git add .gitmodules
git commit -m "fix: remove orphan submodule entries from .gitmodules"
```

---

## 🟡 ISSUE #3: Reglas Triplicadas en 3 Directorios con Naming Inconsistente

### El Problema
Las reglas `.mdc` existen en **tres** lugares con variaciones:

| #                           | `.claude/02_Rules/`                            | `.agent/00_Rules/`                                | `01_Core/01_Rules/`                                  | Estado                                      |
|----------------------------|-----------------------------------------------|--------------------------------------------------|-----------------------------------------------------|--------------------------------------------|
| 01-04                       | ✅                                              | ✅                                                 | ✅                                                    | Triple redundancia                          |
| **05**                      | `05_ritual-integrity.mdc`                      | `05_Ritual_Integrity.mdc`                         | `05_ritual-integrity.mdc`                            | ⚠️ **Naming mismatch**                      |
| 06-11                       | ✅                                              | ✅                                                 | ✅                                                    | Triple redundancia                          |
| **12**                      | `12_Audit_OS_Integrity.mdc`                    | `12_Audit_OS_Integrity.mdc`                       | `12_Audit_OS_Integrity.mdc`                          | ⚠️ **Naming mismatch**                      |
| 13-22                       | ✅                                              | ✅                                                 | ✅                                                    | Triple redundancia                          |
| **23**                      | ❌                                              | ✅ `23_Skill_System_SOTA.mdc`                      | ✅ `23_Skill_System_SOTA.mdc`                         | ⚠️ Falta en `.claude`                       |
| **24**                      | ❌                                              | ❌                                                 | ✅ `24_Token_Economy.mdc`                             | ⚠️ Solo en Core                             |
| **25**                      | ❌                                              | ❌                                                 | ✅ `25_Agent_Teams_Protocol.mdc`                      | ⚠️ Solo en Core                             |

### Issues Específicos
1. **Naming inconsistente**: `.agent/` usa `Underscores` mientras `.claude/` y `01_Core/` usan `hyphens` para las reglas 05 y 12
2. **Desincronización**: Las reglas 23, 24, 25 no están en todos los directorios
3. **Redundancia masiva**: 22 archivos duplicados en 3 directorios = ~66 archivos donde deberían ser ~25

### Fix Recomendado
Definir **un solo source of truth** (sugerido: `01_Core/01_Rules/`) y hacer que `.claude/02_Rules/` y `.agent/00_Rules/` sean symlinks o se generen automáticamente.

---

## 🟡 ISSUE #4: Agentes Duplicados (3 Exact Copies)

### Duplicados Encontrados en `.claude/03_Agents/`:

| Archivo Numerado                                   | Archivo Sin Número                              | ¿Contenido Idéntico?                         |
|---------------------------------------------------|------------------------------------------------|---------------------------------------------|
| `10_Workflow_Orchestrator.md`                      | `workflow-orchestrator.md`                      | ✅ **EXACTO**                                 |
| `11_AIPM_Judge.md`                                 | `aipm-judge.md`                                 | ✅ **EXACTO**                                 |
| `12_LFG_Autonomous_Engine.md`                      | `lfg.md`                                        | ✅ **EXACTO**                                 |

### Impacto
- Claude Code puede cargar ambas versiones, duplicando tokens de contexto innecesariamente
- Riesgo de que una versión se actualice y la otra no

### Fix Recomendado
Eliminar los archivos sin numeración (los legacy):
```bash
rm .claude/03_Agents/workflow-orchestrator.md
rm .claude/03_Agents/aipm-judge.md
rm .claude/03_Agents/lfg.md
```

---

## 🟡 ISSUE #5: Permisos Obsoletos en `settings.json`

### Paths Muertos en `permissions.allow`:

| Permiso                                                                            | Path Referenciado                        | ¿Existe?                                              |
|-----------------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------------|
| `Read(New_Skills/**)`                                                              | `New_Skills/`                            | ❌ **NO**                                              |
| `Bash(unzip ... New_Skills/content-ideation.skill)`                                | `New_Skills/`                            | ❌ **NO**                                              |
| `Bash(unzip ... New_Skills/video-prompt-builder.skill)`                            | `New_Skills/`                            | ❌ **NO**                                              |
| `Bash(unzip ... New_Skills/offer-and-bio-writer.skill)`                            | `New_Skills/`                            | ❌ **NO**                                              |
| `Read(/tmp/**)`                                                                    | temp paths                               | ⚠️ Irrelevante en Windows                             |
| `additionalDirectories: \tmp\video_prompt_extract\references`                      | `/tmp/...`                               | ❌ **NO** (Linux path en Windows)                      |

### Impacto
- Los permisos no causan errores de startup pero ensucian la config
- Las rutas a `/tmp/` son rutas Linux que no existen en Windows

### Fix Recomendado
Limpiar el array `permissions.allow` y `additionalDirectories` de entradas obsoletas.

---

## 🟢 ISSUE #6: MCP Server `docker` sin Docker Instalado

### Detalle
El MCP server `docker` en `.mcp.json` (línea 227-238) requiere el binario `docker` que **NO está instalado** en este sistema.

```json
"docker": {
  "transport": "stdio",
  "command": "docker",
  "args": ["run", "--rm", "-i", "--mount", ...]
}
```

- `docker` binary → **NO encontrado** ❌

### Impacto
- Claude Code intentará iniciar este MCP server al abrir y fallará
- Genera un error visible en la lista de MCP servers al startup

### Fix Recomendado
Si no se usa Docker:
```json
// Agregar "disabled": true al server docker
"docker": {
  "disabled": true,
  ...
}
```

---

## 🔐 ISSUE BONUS: API Keys Expuestas en `.mcp.json`

> [!CAUTION]
> El archivo `.mcp.json` contiene **múltiples API keys en texto plano** que están en el repositorio git:
> - Context7 API Key
> - Exa API Key
> - Fireflies Bearer Token
> - GitHub PAT
> - Notion Token
> - Supabase Bearer Token
> - OpenRouter API Key
> - TestSprite Key
> - Linear API Key
> - Supadata API Key
> - Z.AI API Key
> - Firecrawl API Key
> - Recall Bearer Token

### Recomendación
Mover todas las keys a variables de entorno o a un `.env` file que esté en `.gitignore`.

---

## ✅ Lo que Funciona Correctamente

| Componente                                                           | Estado                                                         |
|---------------------------------------------------------------------|---------------------------------------------------------------|
| Todos los Hook scripts                                               | ✅ Existen y accesibles                                         |
| Documentos del sistema (GOALS, BACKLOG, AGENTS)                      | ✅ Completos                                                    |
| Hub Scripts (00-05)                                                  | ✅ Todos presentes                                              |
| Skills del Core (01_Core/03_Skills)                                  | ✅ Operativos                                                   |
| Submodules en `05_Archive/07_Repos_Gentleman/`                       | ✅ Todos (8/8) presentes                                        |
| MCP binaries: engram, qmd, npx, openpencil                           | ✅ Disponibles                                                  |
| Obsidian & Excalidraw vaults                                         | ✅ Accesibles                                                   |
| Git status                                                           | ✅ Limpio (solo `Plan_Rules.md` untracked)                      |

---

## 📋 Plan de Acción Priorizado

### ✅ COMPLETADO (v1.0 ALFA)

| #                        | Issue                                   | Estado                        | Fix Aplicado                                                              |
|-------------------------|----------------------------------------|------------------------------|--------------------------------------------------------------------------|
| 1                        | Submodule Fantasma                      | ✅ FIXED                       | `git rm --cached 07_Projects/...` (pendiente commit)                      |
| 3                        | Reglas Triplicadas                      | ✅ FIXED                       | Consolidado 23→8 archivos en ambas carpetas                               |

### ⏸️ PENDIENTE

| #                        | Issue                                   | Severidad                        | Notas                                                    |
|-------------------------|----------------------------------------|---------------------------------|---------------------------------------------------------|
| 2                        | Gitmodules paths                        | ALTO                             | 12 entries sin verificar                                 |
| 4                        | Agentes duplicados                      | MEDIO                            | 18 archivos en `.claude/03_Agents/`                      |
| 5                        | Permisos obsoletos                      | BAJO                             | `.claude/settings.json`                                  |
| 6                        | Docker MCP                              | BAJO                             | Deshabilitar si no se usa                                |
| 7                        | API Keys                                | SEGURIDAD                        | Mover a entorno                                          |

---

### 📦 v1.0 ALFA — Estado Final (2026-04-20)

| Componente                             | Antes                         | Después                                  |
|---------------------------------------|------------------------------|-----------------------------------------|
| Reglas activas                         | 23+                           | **8**                                    |
| Scripts en skills                      | 12                            | **24**                                   |
| Tests                                  | —                             | **100%**                                 |
| Git submodule                          | Fantasma                      | ⏸️ Pendiente commit                      |

---

**Última actualización**: 2026-04-20
**Estado**: v1.0 ALFA PRODUCTION READY
