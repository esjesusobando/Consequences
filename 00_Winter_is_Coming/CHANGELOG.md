# Changelog

## 3.2.0 - 2026-04-27

### Fixed — Bug Fix Session (desviaciones CHANGELOG v1.9.0)

- **SubagentStop wired**: Agregado hook `SubagentStop` a `.claude/settings.json` apuntando a `subagent_stop.py` — estaba documentado pero no configurado desde v1.9.0
- **Numeración HUBs deduplicada**: Scripts 15/16/17/18 tenían duplicados de numeración tras integración JARVIS 3.0. Renumerados:
  - `15_Agent_Sync_Hub.py` → `19_Agent_Sync_Hub.py`
  - `16_System_Mapper_Hub.py` → `20_System_Mapper_Hub.py`
  - `17_Legacy_Path_Cleanup.py` → `21_Legacy_Path_Cleanup.py`
  - `18_Validate_Skill_Frontmatter.py` → `22_Validate_Skill_Frontmatter.py`
  - `17_Preview_Generator.js` → `23_Preview_Generator.js`
- **CLAUDE.md inventario actualizado**: Tabla de HUBs expandida a 15-23 con todos los scripts reales
- **Skills frontmatter**: Verificado — 298 skills con frontmatter, 0 sin frontmatter (ya resuelto)
- **GGA pre-commit**: Verificado instalado y activo en `.git/hooks/pre-commit` con secret scanner
- **Secret scanner**: Verificado en `01_Core/02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py` (P2 BACKLOG resuelto)

### Verified OK (no action needed)

- 7 manifests JARVIS en `02_Agent_Teams_Lite/00_Manifest/` — todos presentes
- 10 reglas `.mdc` en `01_Core/01_Rules/` — completas (+ 1 .md extra)
- 49 agentes en `01_Core/02_Tools/01_Agents/`
- Hooks `04_Sound/notification.py` y `task-complete-sound.ps1` — existen

### Ground Truth (2026-04-27)

| Componente | Valor verificado |
|-----------|-----------------|
| HUBs scripts | 19 numerados (00-18) + 5 aux (19-23) |
| SubagentStop | ✅ Wired |
| Skills frontmatter | 298 válidas / 0 inválidas |
| GGA pre-commit | ✅ Activo |
| Secret scanner | ✅ Activo |

---

## 2.0.0 - 2026-04-25

### Added — Consequences 3.0 JARVIS Integration

- **`OS_DIRECTORY.md`** (raíz): Directorio JARVIS maestro <2KB — entry point para todos los agentes
- **`16_System_Mapper_Hub.py`**: Genera 7 manifests del OS en 9s via `os.walk` + poda agresiva
- **`15_MCP_Sync_Hub.py`**: Detecta y reporta drift entre Claude Code (33) y OpenCode (18)
- **`17_Watchdog_Hub.py`**: Health watchdog — valida integridad del manifest, drift MCP, frontmatter
- **`18_Telemetry_Hub.py`**: Dashboard ASCII de métricas de uso por HUB
- **`18_Validate_Skill_Frontmatter.py`**: Detecta 32 skills sin frontmatter YAML
- **`02_Agent_Teams_Lite/00_Manifest/`**: 7 manifests generados — OS_Inventory, MCP_Registry, Agent_Catalog, Skill_Index, HUB_Catalog, Workflow_Graph, Hook_Registry
- **`.atl/agent-skill-matrix.yaml`**: Matrix de 52 agentes × skills × HUBs × MCPs
- **`01_Core/01_Rules/09_Agent_Teams_Protocol.mdc`**: Protocolo Forked Subagents documentado

### Changed

- **`detector.py`**: Refactor `rglob("*")` → `os.walk` con poda. Performance: 1m51s → **1.5s** (100x)
- **`CLAUDE.md`**: Sección JARVIS 3.0 + tabla de estado actualizada a Pure Green v3.0
- **`README.md`**: Skills 165+ → 297, MCPs 36 → 33/18, HUBs 14 → 18, agentes 35+ → 52
- **`README.md`** (Dream Team, Specialists, Compound): READMEs de ecosistemas creados

### Tags

- `v2.1-pre-consequences-3.0` — snapshot pre-migración
- `v3.0-consequences-integrated` — cierre del plan

### Ground Truth (manifest scan 2026-04-25)

| Componente | Valor verificado |
|-----------|-----------------|
| MCPs Claude Code | 33 |
| MCPs OpenCode | 18 (drift: 16 faltantes) |
| Skills | 297 |
| Agentes | 52 source + 52 mirror |
| HUBs | 18 |
| Workflows | 27 |
| Hooks | 10 (6 fases) |

---

## 1.9.0 - 2026-04-21

### Fixed — Full System Audit & Documentation Update

- **`01_Core/03_Skills/README.md`**: Actualizado a v1.1
  - Agregadas carpetas 24-28 a estructura documentada: `24_PM_Agent_Orchestrator`, `25_Octopus`, `26_Fantasticos`, `27_Qmd`, `28_Carousel_Master`
  - Nota agregada: numeración no secuencial (22-23 no existen)
  - Total actualizado: 29 categorías (24 core + 5 extensiones)

### Audit Findings — Issues Identificados (pending fix)

| Área                | Issue                                                                                   | Estado              |
|---------------------|-----------------------------------------------------------------------------------------|---------------------|
| **Hooks**           | settings.json usa `.agent/04_Extensions/hooks/` vs docs `01_Core/07_Hooks/`             | 🔴 Pendiente         |
| **Hooks**           | SubagentStop documentado pero NO configurado                                            | 🔴 Pendiente         |
| **Hooks**           | 5/8 hooks documentados sin wirear (04_Sound, 05_Harness, 06_Post_Hulk_Compound)         | 🟠 Pendiente         |
| **Agentes**         | Contaje inconsistente: docs dicen 14/18/71, real son 48                                 | 🟡 Pendiente         |
| **MCPs**            | Docs dicen 27/29, real son 36 servidores                                                | 🟡 Pendiente         |
| **Naming**          | GGA/Gentleman/Guardian Angel sin estandarizar                                           | 🟡 Pendiente         |

### Notes
- Auditoría completa ejecutada: estructura, skills, hooks, agentes, MCPs, scripts
- 5 carpetas de skills nuevas descubiertas fuera de numeración secuencial
- Proyecto operativo pero desalineado documentación vs realidad

---

## 1.8.0 - 2026-04-10

### Added — Skills & Video Intelligence
- **`.agent/02_Skills/18_Personal_Life_OS/`**: 5 nuevos skills para productividad personal:
  - Quick_Capture: Captura rápida de ideas y tareas
  - Plan_My_Day: Planificación diaria
  - Daily_Notes: Notas diarias estructuradas
  - Recording_Mode: Modo de grabación/transcripción
  - Returns_Tracker: Seguimiento de devoluciones
- **`.agent/02_Skills/19_Video_Intel copy/`**: Sistema completo de análisis de video con IA
- **`.agent/02_Skills/20_Skill_Template/`**: Template reusable para crear nuevos skills
- **`05_Archive/03_Docs_Legacy/`**: Documentación legacy reorganizada

### Fixed — VPN & Network Investigation
- **Error 403 en Claude Code**: diagnosticado - IP de Perú bloqueada
- **Radmin VPN**: Split tunneling impedía tráfico del terminal
- **Routes forzadas** para rutear todo el tráfico por VPN
- **ProtonVPN**: servicio iniciado pero requiere conexión manual a servidor
- **Resultado**: Tráfico ahora pasa por VPN (IP Venezuela) pero requiere servidor de país soportado

### Notes
- 29 commits por ahead de origin/master
- Skills count: 165+
- Para usar Claude Code: conectarte a servidor VPN de EE.UU./Países Bajos/Japón

---

## 1.7.1 - 2026-04-02

### Fixed — OpenCode terminal launch errors

- **`~/.config/opencode/opencode.json`**: Renombrado campo `env` → `environment` en 7 MCPs (`exa`, `Notion`, `task-master-ai`, `supadata`, `zai-mcp-server`, `excalidraw-yctimlin`, `firecrawl-mcp`). OpenCode v1.3.13 cambió su schema: `env` ya no es un campo válido en `McpLocalConfig`, el correcto es `environment`. Error: `Configuration is invalid ↳ Invalid input mcp.exa` (x7).
- **`01_Core/05_Mcp/02_OpenCode/opencode.json`**: Mismo fix aplicado para mantener sync con el config activo.

**Root cause:** Ruptura de schema en OpenCode v1.3.13 — `additionalProperties: false` en `McpLocalConfig` rechaza el campo `env` que era válido en versiones anteriores.

---

## 1.7.0 - 2026-04-01

### Fixed — MCP Integration & Documentation Audit

- **`.mcp.json`** (raíz): Creado por primera vez. Claude Code no cargaba ningún MCP — el archivo fuente `01_Core/05_Mcp/01_Claude_Code/mcp.json` era solo backup documental. Ahora Claude Code tiene 29 MCPs activos.
- **`pencil` MCP**: Ruta rota `./05_System/09_Bin/.bin/openpencil-mcp.cmd` → corregida a `openpencil-mcp.cmd` (instalado globalmente en npm). Actualizado en: `.mcp.json`, `01_Core/05_Mcp/01_Claude_Code/mcp.json`, `01_Core/05_Mcp/02_OpenCode/opencode.json` y `~/.config/opencode/opencode.json`.
- **`00_Winter_is_Coming/01_Personal_Os/11_AGENTS.md`**: Secciones 9-12 duplicadas eliminadas (Slash Commands, Memory & Search, Rules, Git History).
- **`01_Core/05_Mcp/00_Config_Mcp/mcp-tools/README.md`**: Referencia incorrecta `.claude/mcp.json` → tabla con rutas reales (Claude Code + OpenCode).
- **`CLAUDE.md`**: Estado del sistema actualizado — tabla dual de config MCP, MCPs corregido a 29 activos.

### Notes

MCPs excluidos del `.mcp.json` activo por falta de credenciales (son templates en el source): `brave-search`, `postgres`, `slack`, `sentry`, `atlassian`, `jira-extended`.

---

## 1.6.0 - 2026-04-01

### Added
- **`05_Archive/`**: Estandarización numérica de 9 subdirectorios (01-09) para mejorar la integridad y navegabilidad del sistema.
- **`Maerks/15_Architecture_Map.md`**: Mapeo completo de la nueva jerarquía de Archive.

### Changed
- **`03_Knowledge/10_Repos_Gentleman`** $\rightarrow$ **`05_Archive/07_Repos_Gentleman`**: Migración estratégica de repositorios legacy para unificar la base de conocimiento activa.
- **`README.md`**: Embellecimiento de la estructura de directorios y actualización de badges de estado.

### Verified
- Auditor Hub: Dimensiones validadas v6.1 (Pure Green State).

---

## 1.5.0 - 2026-04-01

### Added
- **`00_Plan_Hillary_Integration.md`**: Plan de integración Hillary Life OS → PersonalOS v6.1 (5 skills: Quick Capture, Plan My Day, Daily Notes, Recording Mode, Returns Tracker)
- **`02_Plan_Restauracion_Opencode.md`**: Plan de restauración quirúrgica de `opencode.json` (Pure Green Recovery)
- **`03_Task_Restauracion_Opencode.md`**: Checklist de ejecución para restauración de OpenCode

### Fixed
- **`01_Core/05_Mcp/01_Claude_Code/mcp.json`**: TestSprite migrado a path absoluto + env var `TESTSPRITE_PRIMARY`; notebooklm actualizado a `npx -y notebooklm-mcp@latest`
- **`01_Core/05_Mcp/02_OpenCode/opencode.json`**: Migración de `npx.cmd` → `npx` en todos los servidores MCP (cross-platform); eliminada clave inválida `plugins`; restaurados servidores exa, Notion, firecrawl, task-master-ai, supadata, zai-mcp-server, excalidraw
- **`README.md`**: Corregidos paths obsoletos `Validator_Fixed/` → `03_Validator/` y `Tool_Fixed/` → `02_Tool/`

### Removed
- **`PLAN_HILLARY_INTEGRATION.md`**: Renombrado a `00_Plan_Hillary_Integration.md` siguiendo convención de numeración canónica

---

## 1.4.0 - 2026-04-01

### Refactor — Nomenclatura canónica y saneamiento total
- **`03_Scripts_Os/`**: Renombradas 10 carpetas `*_Fixed` a nomenclatura `XX_Nombre`:
  - `Ritual_Fixed` → `01_Ritual`
  - `Tool_Fixed` → `02_Tool`
  - `Validator_Fixed` → `03_Validator`
  - `Workflow_Fixed` → `04_Workflow`
  - `AIPM_Fixed` → `05_AIPM`
  - `Auditor_Fixed` → `06_Auditor`
  - `Data_Fixed` → `07_Data`
  - `General_Fixed` → `08_General`
  - `Integration_Fixed` → `09_Integration`
  - `Legacy_Backup` → `10_Legacy`
- **`01_Core/07_Hooks/`**: `05_Post_Hulk_Compound` → `06_Post_Hulk_Compound` (prefijo duplicado resuelto)
- **`01_Core/09_Server/00_Env/config_paths.py`**: DIMENSIONS actualizadas a v6.1 (9 dimensiones correctas), ENGINE_DIR corregido a `03_Scripts_Os`
- **`01_Core/Requirements.txt`**: Unificado con versiones actuales (`mcp>=1.26.0`, `anthropic>=0.84.0`, `python-dotenv>=1.0.0`, `colorama>=0.4.6`)
- **`01_Core/09_Server/00_Env/Requirements.txt`**: Sincronizado con fuente de verdad (agregado `colorama>=0.4.6`)
- **`01_Core/09_Server/00_Config_Aliases/aliases.sh`**: Agregados aliases para hubs 11-14 (`auto-learn`, `context-bar`, `beautify`, `beauty-doc`), rutas absolutas via `$PERSONAL_OS_ROOT`, auto-detección de raíz
- **`.claude/01_Commands/genesis.md`**: Corregido script invocado (`04_Ritual_Hub.py --mode genesis` en vez de `08_Ritual_Cierre.py`)
- **`01_Core/07_Hooks/06_Post_Hulk_Compound/post_hulk_compound.py`**: Corregido `project_root` (era `_ext_root.parent.parent` → ahora `_ext_root.parent`) y ruta a `56_Organize_Solutions.py`
- **Documentación**: Actualizadas referencias en `CLAUDE.md`, `01_Personal_Os/11_AGENTS.md`, `03_Scripts_Os/README.md`, `03_Scripts_Os/SCRIPTS_INDEX.md`

---

## 1.3.0 - 2026-04-01

### Fixed
- **`.claude/settings.local.json`**: Eliminado sonido en `PostToolUse` (disparaba en cada tool call — ruidoso e inútil)
- **`.claude/settings.local.json`**: `UserPromptSubmit` usaba `--notify` sin argumento (error de runtime) → corregido a `--beep`
- **`CLAUDE.md`**: Git Estado actualizado de MODIFIED → CLEAN
- **`CLAUDE.md`**: Fecha de última actualización corregida a 2026-04-01

### Sound System — Comportamiento final
- `TodoWrite` → `notification.py --task-complete` ✅ (suena cuando el agente actualiza tareas)
- `Stop` → `stop.py` ✅ (suena + System Guardian al cerrar sesión)
- `UserPromptSubmit` → `notification.py --beep` ✅ (beep simple al recibir mensaje)
- `PostToolUse` → solo `post_tool_use.py` (sin sonido — era demasiado ruidoso)

---

## 1.2.0 - 2026-03-31

### Fixed
- **config_paths.py**: 3 rutas rotas corregidas (`PLAYGROUND_DIR`, `KNOWLEDGE_RESOURCES_DIR`, `KNOWLEDGE_EXAMPLES_DIR`)
- **50_System_Health_Monitor.py**: `sys.path` apuntaba a ROOT en vez de `03_Scripts_Os/`; master files check 3 niveles → 2 niveles
- **53_Structure_Auditor.py**: `ENGINE_DIR` duplicado (`03_Scripts_Os/03_Scripts_Os`); DIMENSIONS actualizadas a v6.1 (9 dimensiones)
- **08_Ritual_Cierre.py**: `sys.path` apuntaba a PROJECT_ROOT en vez de `03_Scripts_Os/`
- **14_Morning_Standup.py**: `sys.path` apuntaba a `Legacy_Backup/` inexistente
- **02_Git_Hub.py**: ARMOR LAYER movido antes del import de `config_paths`
- **`.claude/rules/*.md`**: Todas las rutas apuntaban a `01_Core/04_Rules/` (inexistente) → corregido a `01_Core/01_Rules/` con nombres `.mdc` correctos
- **`.claude/settings.local.json`**: Hooks actualizados para usar `01_Core/07_Hooks/04_Sound/notification.py` (script correcto con sonido real)
- **post_tool_use.py**: Beep silenciado → ahora loguea éxito o error

### Added
- **Formato de reporte 15%**: CLAUDE.md y .agent/CLAUDE.md actualizados con 5 campos obligatorios (qué hice, qué estoy haciendo, próximo paso, pendientes, tiempo estimado)
- **OpenCode sound plugin**: `sound-on-complete.ts` corregido para Windows (PowerShell correcto)
- **~/.config/opencode/01_Personal_Os/11_AGENTS.md**: Reporte 15% configurado igual que Claude Code
- **`.atl/.atl/openspec/`**: Movido desde raíz del proyecto a `.atl/.atl/openspec/`

### Verified
- Auditor Hub: `=== ESTATUS: SALUDABLE ===` (todas las dimensiones OK)
- Structure Auditor: 9 dimensiones v6.1 validadas
- `.claude/rules` carga reglas reales desde `01_Core/01_Rules/`

---

## 1.1.0 - 2026-03-29

### Added
- **PersonalOS v6.1** - Workspace reorganization
- **Anthropic SOTA Practices** (2026): CLAUDE.md, Plan then Execute, Custom Tools, Git Workflows, Specific Prompting, Context Management, Headless Mode + Hooks
- **Anthropic 9 Skill Categories**: Library/API, Product Verification, Data Fetching, Business Process, Code Scaffolding, Code Quality, CI/CD, Runbooks, Infrastructure Ops
- **Sound Notifications**: OpenCode notify plugin (kdco/notify) + configured hooks for Claude Code (.claude/settings.local.json)
- **22 Rules Updated** with XML format from 02_Pilar_Base.mdc

### Fixed
- Obsolete paths: 01_Brain → 04_Operations, 00_Core → 00_Winter_is_Coming
- Workspace structure documentation (00-08 + Maerks)

### Verified
- Tool versions: Python 3.14.2, uv 0.10.4, Git 2.53.0, Node.js v24.12.0, npm 11.6.2, OpenCode 1.3.6, Engram 1.10.10

---

## 1.0.0 - 2026-03-27

- Initial release
- Skill: personal-os - Sistema completo de productividad
- Skill: sdd-workflow - Metodología Spec-Driven Development
- Skill: system-guardian - Validación automática de proyectos
