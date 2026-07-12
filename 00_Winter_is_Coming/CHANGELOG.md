# Changelog

## 5.0.0 — 2026-07-07

### Fixed — OS Edge Cases SOTA Fix + Judgment Day

- **StopIteration eliminado de 51 scripts**: Reemplazado `next(p for p in ...parents if p.name == ...)` → `resolve_os_root(Path(__file__).resolve().parent)` via `tools/batch_fix_next_pattern.py` — 0 residuales
- **Error Taxonomy creada**: `os_errors.py` con `PersonalOSError` base + 5 subclases tipadas (`OSPathError`, `OSConfigError`, `OSSyncError`, `OSSecurityError`, `OSStateError`) + helpers `safe_find()` y `ensure_path()`
- **Path Guardian centralizado**: `path_guardian.py` con `resolve_os_root()`, `resolve_project_root()`, `detect_copy_type()`, `resolve_core_path()`, `resolve_engine_path()`. Sin dependencia circular con `config_paths`
- **Asserts eliminados en producción**: `sync_copies.py:95` assert reemplazado por `OSSyncError`; `resolve_roots()` refactored a `resolve_os_root()`
- **`except: pass` silencioso eliminado**: `config_paths.py` `except OSError: pass` → `print(f"[WARN] ...")`
- **Shebangs corregidos**: 12 archivos con shebang movido a línea 1 via `tools/fix_shebangs.py` (11 batch + Sound Engine manual)
- **Secret Scanner v2**: Patrones reales (`napi_`, `lin_api_`, `sb_`, `fir_`, `exa_`, `xapp-`); modos `--diff`, `--fix`, `--full-scan`, `--json`, `--yes`; `.gitignore`-aware; OpenAI `sk-proj-` support
- **Pre-Tool Hook**: WMI→CIM migration (`Get-CimInstance` + `Get-WmiObject` fallback); multi-agent soporte (`CLAUDE_TOOL_INPUT`, `OPENCODE_TOOL_INPUT`, `CODEX_TOOL_INPUT`)
- **Sound Engine cross-platform**: Windows `winsound.Beep()`, Linux terminal bell, macOS `say` con fallback silencioso
- **Hook Pipeline documentado**: `00_Core/02_Tools/05_Hooks/README.md` con tabla de estado activo/manual
- **Path roto corregido**: `adaptive_boot.py` `AGENTS_CONFIG_DIR` actualizado a `00_Core/02_Tools/01_Agents`
- **Judgment Day completado**: 2 rondas, 9 CRITICAL/WARNING fijados, re-juzgamiento APROBADO ✅
- **Temp cleanup**: `/tmp/` liberado ~3.1 GB (VS Code stale builds, `.tmp` files, OpenCode installers)

### Tools creadas
- `tools/batch_fix_next_pattern.py` — Batch fix next() + shebang detection
- `tools/fix_shebangs.py` — Batch shebang repositioning

### Archivos creados
- `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/os_errors.py` — Error Taxonomy
- `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/path_guardian.py` — Path resolution

### Commits
| Commit | Descripción |
|--------|-------------|
| (pending) | fix(os): 51 StopIteration fixes + Error Taxonomy + Path Guardian + Secret Scanner v2 |
| (pending) | fix(os): Judgment Day — 9 fixes applied, re-judgment APPROVED |

---

## 4.9.1 - 2026-06-25

### Added — Marketing Agents SOTA Upgrade + Graphify Move

- **Marketing Agents SOTA Upgrade**: SDD pipeline completo (init→explore→propose→spec→design→tasks→apply→verify→archive)
  - Agent 15 (Marketing Estratega): YAML frontmatter, brief→insights pipeline, 3 strategic MCPs
  - Agent 16 (Marketing Creador): YAML frontmatter, content brief→copy pipeline, skills refs fixed
  - Agent 17 (Marketing Analista): YAML frontmatter, KPI-driven review, feedback loop
  - Dream Team 06 (Marketing Orchestrator): Slot 06, coordina pipeline Estratega→Creador→Analista
  - CLAUDE.marketing.md: Template para sesiones de marketing
  - linkedin-content-flow skill: 4-stage pipeline (Estratega→Creador→Analista→Orchestrator)
  - MARKETING_PIPELINE.md: Comprehensive workflow guide
  - READMEs updated: 01_Agents/ (agents 14-22), Dream Team (5→6 jugadores)
- **Judgment Day v4**: 1 CRITICAL fix (Chinese char `对` → `comparar`), 1 WARNING fix (broken skill path)
  - Re-judge verified: flying-aqua-primate — ambos fixes OK
- **git rebase**: Dropped commit d438b6cac (API keys xAI + OpenAI), push exitoso a master
- **Graphify_Out/ moved**: Root `Graphify_Out/` → `02_Playground/Graphify_Out/`
  - Duplicate `02_Playground/graphify-out/` removed
  - References updated in: AGENTS.md, CLAUDE.md, graphify.js, graphify.js.bak, graphify.mdc, settings.json, config_paths.py
  - 00_Winter_is_Coming/AGENTS.md: no references — no update needed
- **Learning Always**: RE + Learning from video vINrPqUxnho (7 setup pieces)
- **Settings Drawer SDD archived**: `04_Docs/SDD/settings-drawer-improvements/` → `05_Legacy_SDDAudits/`
- **Agent Sync Hub restoration**: 9 files restored via git restore

### Commits sesión

| Commit              | Descripción                                                                              |
|--------------------|-----------------------------------------------------------------------------------------|
| `f1384eb28`         | feat(marketing): SOTA upgrade — 3 agents, orchestrator, pipeline, judgment day           |
| (pending)           | chore(graphify): move Graphify_Out to 02_Playground/ + update all references             |

---

## 4.9.0 - 2026-06-01

### Changed — v4.9 Consequences Final Alignment
- **Structure_v4.8.md** renombrado a **Structure_v4.9.md** y actualizado.
- **OS_DIRECTORY.md**: Actualizado a v4.9 y fechas corregidas.
- **CLAUDE.md**: Referencias de v4.0/v4.5/v4.7 actualizadas a v4.9.
- Todas las fechas maestras actualizadas a 2026-06-01.
- Documentación central alineada con el estado actual del OS.

---

## 4.1.0 - 2026-05-11

### Fixed — UltraThink Cleanup + System Sync

- **UltraThink FASE 1**: Eliminados duplicados `53_Structure_Auditor.py` (2 copies en 05_Scripts + 06_Scripts)
- **Path hardcoded corregido**: `57_Repo_Sync_Auditor.py` — `03_Knowledge/10_Repos_Gentleman` → `05_Archive/07_Repos_Gentleman`
- **34_Skill_Auditor.py**: Corregido path `00_Core/03_Skills` → `01_Personal_Os/00_Core/02_Tools/02_Skills`
- **Cache cleanup**: `~/.cache/` liberado ~1.9GB (codex-runtimes 766MB, opencode 416MB, qmd 385MB, chroma 167MB)
- **GOALS.md**: Beautified tables, versión v4.0对齐
- **BACKLOG.md**: Actualizado a v4.0 Consequences
- **README.md**: Fecha actualizada a 2026-05-11

### Added — System Audit & Updates (2026-05-11)

- **AGENTS.md**: Corregido `file:///` path hardcoded → path relativo (`00_Winter_is_Coming/AGENTS.md`)
- **CLAUDE.md**: Fecha actualizada 2026-05-10 → 2026-05-11, áreas 09+21 agregadas
- **HUB_CATALOG.md**: Versión 2.0 → 4.0, fecha actualizada
- **SCRIPTS_INDEX.md**: Removidas filas duplicadas en mapping table
- **skill-registry.md**: Fecha actualizada, áreas 10+11 agregadas, Frontend_Slides agregado
- **SCRIPTS_INDEX.md**: Filas duplicadas removidas, información redundante limpia

### Commits sesión

| Commit              | Descripción                                                                              |
|--------------------|-----------------------------------------------------------------------------------------|
| `808576f2`          | fix(audit): cleanup duplicate Structure_Auditor scripts + update hardcoded path          |

---

## 4.2.0 - 2026-05-28

### Fixed — Massive Structural Audit + Count Corrections

- **CLAUDE.md**: Corregidos workflows 30→28, hooks 12→13, sync counts con disco
- **GOALS.md**: Eliminada sección 13 duplicada (What are your top 3 priorities)
- **AGENTS.md**: Corregido typo "EVERY/COMPOUND ENGINEERING" → "COMPOUND ENGINEERING"
- **MAPA_MIGRACION.md**: Marcado como documento histórico (plan v3.1 no ejecutado)
- **00_System_Core/SKILL.md**: Actualizado listing de skills incluidas
- **03_Video_Media/SKILL.md**: Agregadas sub-areas faltantes (James Cameron, Production)
- **CHANGELOG.md**: Esta entrada

---

## 4.0.0 - 2026-05-10

### Added — Production Ready v4.0

- **Every CE v3.7.3**: compound-engineering-plugin actualizado a latest (from v2.68.1)
- **gentle-ai v1.26.6**: Disponible en GitHub (verificado 2026-05-10)
- **19 CE skills registradas**: opencode.json actualizado con todas las ce-* skills
- **Naming conventions**: Corregidos 5 archivos (OS_DIRECTORY.md → 00_OS_DIRECTORY.md, etc.)
- **Reports consolidados**: 58 archivos de auditoría → 3 summary files
  - `03_Resultado/04_Reportes/00_RESUMEN_AUDITORIAS.md`
  - `02_Playground/06_Reports/00_SALUD_REPORTS.md`
  - `02_Playground/04_Maerks/00_AUDIT_SUMMARY.md`
- **OIM_Website_Backup copies**: Archivadas copias duplicadas en `01_Personal_Os/07_Archive/10_Legacy_Revisar/`
- **Git state**: Limpio, push a origin/master exitoso
- **CLAUDE.md, README.md, OS_DIRECTORY.md**: Actualizados a v4.0

### Commits sesión

| Commit                      | Descripción                                                                              |
|----------------------------|-----------------------------------------------------------------------------------------|
| `484dc2ca`                  | feat(os): Think_Different v4.0 preparation — audit, cleanup, ecosystem sync              |
| `8750740b`                  | feat: Think_Different v4.0 — reports archive + gentle-ai v1.26.6                         |

---

## 3.4.0 - 2026-05-05

### Fixed — Beautify Tables + Metrics Update + v3.1 Sync

- **BEAUTIFY TABLES**: Aplicado `13_Beautify_Tables.py` a 2,880 archivos markdown — todas las tablas pixel-perfect
- **Kit_Diseño_Top_11.md**: Fecha actualizada 2026-05-04, TOP 12→TOP 13, estado Open Design
- **README.md**: Corregido 9→11 áreas funcionales, 297→300 skills, 18→28 HUBs
- **OS_DIRECTORY.md**: Skills 299→300, TOP 11→TOP 13, fecha actualizada
- **AGENTS.md (00_Winter)**: v3.0→v3.1, métricas actualizadas
- **OS_DIRECTORY.md (00_Winter)**: v3.0→v3.1, métricas actualizadas
- **JARVIS manifests**: Regenerados 8 archivos (7 + README)
- **Archivos restaurados**: 8 archivos SDD de OIM Website eliminados accidentalmente
- **RULES_INDEX.md**: Beautified tables

### Commits sesión

| Commit                      | Descripción                                                                         |
|----------------------------|------------------------------------------------------------------------------------|
| `b2e100e5`                  | docs: apply Beautify Tables to 2880 files — pixel perfect alignment                 |
| `e095e10a`                  | docs: update metrics + dates + JARVIS manifests regeneration                        |

---

## 3.3.0 - 2026-04-29

### Fixed — Git Cleanup & Disk Space Session

- **Submodules removidos**: 5 entradas huérfanas eliminadas del índice git (`.agent/05_GGA`, `sub-agent-statusline`, `tubemaster`, `OIM_Website`, `OIM_Website_Backup`)
- **`.gitmodules` vaciado**: repo sin dependencias externas — 0 submodules activos
- **`.gitignore` hardened**: excluida `01_Original_Source_Backups/` (firecrawl + marketingskills ~1000 archivos) y 5 ex-submodule folders
- **OS update masivo**: 1100+ archivos actualizados — workflows, skills, agents, rules, docs (v3.1 Consequences sync)
- **Disco C: liberado ~40 GB**: npm cache 21GB, uv cache 12GB, Temp 10GB, Playwright browsers 1.9GB, Brave cache 1.1GB

### Commits sesión

| Commit                      | Descripción                                                                         |
|----------------------------|------------------------------------------------------------------------------------|
| `92983546`                  | feat(os): v3.1 Consequences — OS update, skills, agents, workflows                  |
| `750151c3`                  | chore(git): remove all submodules                                                   |
| `0426f884`                  | chore(gitignore): ignore ex-submodule folders                                       |

### Ground Truth (2026-04-29)

| Componente                       | Valor verificado                                            |
|---------------------------------|------------------------------------------------------------|
| Submodules                       | ✅ 0 activos                                                 |
| Working tree                     | ✅ Clean (nothing to commit)                                 |
| Disco C libre                    | ~28 GB (liberados ~40 GB)                                   |
| .git size                        | ~392 MB ⚠️ (pendiente git filter-repo)                      |

---

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
- **Secret scanner**: Verificado en `00_Core/02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py` (P2 BACKLOG resuelto)

### Verified OK (no action needed)

- 7 manifests JARVIS en `02_Agent_Teams_Lite/00_Manifest/` — todos presentes
- 10 reglas `.mdc` en `00_Core/01_Rules/` — completas (+ 1 .md extra)
- 49 agentes en `00_Core/02_Tools/01_Agents/`
- Hooks `04_Sound/notification.py` y `task-complete-sound.ps1` — existen

- **Git reparado**: 52 tags corruptas eliminadas (SHAs de otro repo copiados por backup) — git gc, fsck y reflog 100% limpios
- **gitignore corregido**: ruta `Side_Project_Backup` actualizada de `07_Projects/` → `01_Personal_Os/05_Scripts/05_Projects/` (ruta Consequences v3.0 real)
- **Repo embebido resuelto**: `03_Side_Project_Backup` (Obandrilling_calculator) removido del índice del OS — tiene su propio repo independiente, ahora correctamente ignorado

### Ground Truth (2026-04-27)

| Componente                            | Valor verificado                                     |
|--------------------------------------|-----------------------------------------------------|
| HUBs scripts                          | 22 scripts (00-22) sin duplicados                    |
| SubagentStop                          | ✅ Wired                                              |
| Skills frontmatter                    | 298 válidas / 0 inválidas                            |
| GGA pre-commit                        | ✅ Activo                                             |
| Secret scanner                        | ✅ Activo                                             |
| git fsck                              | ✅ Limpio                                             |
| git reflog                            | ✅ Limpio                                             |
| Working tree                          | ✅ Clean (nothing to commit)                          |

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
- **`00_Core/01_Rules/09_Agent_Teams_Protocol.mdc`**: Protocolo Forked Subagents documentado

### Changed

- **`detector.py`**: Refactor `rglob("*")` → `os.walk` con poda. Performance: 1m51s → **1.5s** (100x)
- **`CLAUDE.md`**: Sección JARVIS 3.0 + tabla de estado actualizada a Pure Green v3.0
- **`README.md`**: Skills 165+ → 297, MCPs 36 → 33/18, HUBs 14 → 18, agentes 35+ → 52
- **`README.md`** (Dream Team, Specialists, Compound): READMEs de ecosistemas creados

### Tags

- `v2.1-pre-consequences-3.0` — snapshot pre-migración
- `v3.0-consequences-integrated` — cierre del plan

### Ground Truth (manifest scan 2026-04-25)

| Componente                          | Valor verificado                            |
|------------------------------------|--------------------------------------------|
| MCPs Claude Code                    | 33                                          |
| MCPs OpenCode                       | 18 (drift: 16 faltantes)                    |
| Skills                              | 297                                         |
| Agentes                             | 52 source + 52 mirror                       |
| HUBs                                | 18                                          |
| Workflows                           | 27                                          |
| Hooks                               | 10 (6 fases)                                |

---

## 1.9.0 - 2026-04-21

### Fixed — Full System Audit & Documentation Update

- **`01_Personal_Os/00_Core/02_Tools/02_Skills/README.md`**: Actualizado a v1.1
  - Agregadas carpetas 24-28 a estructura documentada: `24_PM_Agent_Orchestrator`, `25_Octopus`, `26_Fantasticos`, `27_Qmd`, `28_Carousel_Master`
  - Nota agregada: numeración no secuencial (22-23 no existen)
  - Total actualizado: 29 categorías (24 core + 5 extensiones)

### Audit Findings — Issues Identificados (pending fix)

| Área                                     | Issue                                                                                                        | Estado                                   |
|-----------------------------------------|-------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| **Hooks**                                | settings.json usa `.agent/04_Extensions/hooks/` vs docs `00_Core/07_Hooks/`                                  | 🔴 Pendiente                              |
| **Hooks**                                | SubagentStop documentado pero NO configurado                                                                 | 🔴 Pendiente                              |
| **Hooks**                                | 5/8 hooks documentados sin wirear (04_Sound, 05_Harness, 06_Post_Hulk_Compound)                              | 🟠 Pendiente                              |
| **Agentes**                              | Contaje inconsistente: docs dicen 14/18/71, real son 71                                                      | ✅ CORREGIDO (2026-06-27)                |
| **MCPs**                                 | Docs dicen 27/29, real son 36 servidores                                                                     | 🟡 Pendiente                              |
| **Naming**                               | GGA/Gentleman/Guardian Angel sin estandarizar                                                                | 🟡 Pendiente                              |

### Notes
- Auditoría completa ejecutada: estructura, skills, hooks, agentes, MCPs, scripts
- 5 carpetas de skills nuevas descubiertas fuera de numeración secuencial
- Proyecto operativo pero desalineado documentación vs realidad

---

## 1.8.0 - 2026-04-10

### Added — Skills & Video Intelligence
- **`01_Personal_Os/00_Core/02_Tools/02_Skills/18_Personal_Life_OS/`**: 5 nuevos skills para productividad personal:
  - Quick_Capture: Captura rápida de ideas y tareas
  - Plan_My_Day: Planificación diaria
  - Daily_Notes: Notas diarias estructuradas
  - Recording_Mode: Modo de grabación/transcripción
  - Returns_Tracker: Seguimiento de devoluciones
- **`01_Personal_Os/00_Core/02_Tools/02_Skills/19_Video_Intel copy/`**: Sistema completo de análisis de video con IA
- **`01_Personal_Os/00_Core/02_Tools/02_Skills/20_Skill_Template/`**: Template reusable para crear nuevos skills
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
- **`00_Core/05_Mcp/02_OpenCode/opencode.json`**: Mismo fix aplicado para mantener sync con el config activo.

**Root cause:** Ruptura de schema en OpenCode v1.3.13 — `additionalProperties: false` en `McpLocalConfig` rechaza el campo `env` que era válido en versiones anteriores.

---

## 1.7.0 - 2026-04-01

### Fixed — MCP Integration & Documentation Audit

- **`.mcp.json`** (raíz): Creado por primera vez. Claude Code no cargaba ningún MCP — el archivo fuente `00_Core/05_Mcp/01_Claude_Code/mcp.json` era solo backup documental. Ahora Claude Code tiene 29 MCPs activos.
- **`pencil` MCP**: Ruta rota `./05_System/09_Bin/.bin/openpencil-mcp.cmd` → corregida a `openpencil-mcp.cmd` (instalado globalmente en npm). Actualizado en: `.mcp.json`, `00_Core/05_Mcp/01_Claude_Code/mcp.json`, `00_Core/05_Mcp/02_OpenCode/opencode.json` y `~/.config/opencode/opencode.json`.
- **`00_Winter_is_Coming/01_Personal_Os/11_AGENTS.md`**: Secciones 9-12 duplicadas eliminadas (Slash Commands, Memory & Search, Rules, Git History).
- **`00_Core/05_Mcp/00_Config_Mcp/mcp-tools/README.md`**: Referencia incorrecta `.claude/mcp.json` → tabla con rutas reales (Claude Code + OpenCode).
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
- **`00_Core/05_Mcp/01_Claude_Code/mcp.json`**: TestSprite migrado a path absoluto + env var `TESTSPRITE_PRIMARY`; notebooklm actualizado a `npx -y notebooklm-mcp@latest`
- **`00_Core/05_Mcp/02_OpenCode/opencode.json`**: Migración de `npx.cmd` → `npx` en todos los servidores MCP (cross-platform); eliminada clave inválida `plugins`; restaurados servidores exa, Notion, firecrawl, task-master-ai, supadata, zai-mcp-server, excalidraw
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
- **`00_Core/07_Hooks/`**: `05_Post_Hulk_Compound` → `06_Post_Hulk_Compound` (prefijo duplicado resuelto)
- **`00_Core/09_Server/00_Env/config_paths.py`**: DIMENSIONS actualizadas a v6.1 (9 dimensiones correctas), ENGINE_DIR corregido a `03_Scripts_Os`
- **`00_Core/Requirements.txt`**: Unificado con versiones actuales (`mcp>=1.26.0`, `anthropic>=0.84.0`, `python-dotenv>=1.0.0`, `colorama>=0.4.6`)
- **`00_Core/09_Server/00_Env/Requirements.txt`**: Sincronizado con fuente de verdad (agregado `colorama>=0.4.6`)
- **`00_Core/09_Server/00_Config_Aliases/aliases.sh`**: Agregados aliases para hubs 11-14 (`auto-learn`, `context-bar`, `beautify`, `beauty-doc`), rutas absolutas via `$PERSONAL_OS_ROOT`, auto-detección de raíz
- **`.claude/01_Commands/genesis.md`**: Corregido script invocado (`04_Ritual_Hub.py --mode genesis` en vez de `08_Ritual_Cierre.py`)
- **`00_Core/07_Hooks/06_Post_Hulk_Compound/post_hulk_compound.py`**: Corregido `project_root` (era `_ext_root.parent.parent` → ahora `_ext_root.parent`) y ruta a `56_Organize_Solutions.py`
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
- **`.claude/rules/*.md`**: Todas las rutas apuntaban a `00_Core/04_Rules/` (inexistente) → corregido a `00_Core/01_Rules/` con nombres `.mdc` correctos
- **`.claude/settings.local.json`**: Hooks actualizados para usar `00_Core/07_Hooks/04_Sound/notification.py` (script correcto con sonido real)
- **post_tool_use.py**: Beep silenciado → ahora loguea éxito o error

### Added
- **Formato de reporte 15%**: CLAUDE.md y .agent/CLAUDE.md actualizados con 5 campos obligatorios (qué hice, qué estoy haciendo, próximo paso, pendientes, tiempo estimado)
- **OpenCode sound plugin**: `sound-on-complete.ts` corregido para Windows (PowerShell correcto)
- **~/.config/opencode/01_Personal_Os/11_AGENTS.md**: Reporte 15% configurado igual que Claude Code
- **`.atl/.atl/openspec/`**: Movido desde raíz del proyecto a `.atl/.atl/openspec/`

### Verified
- Auditor Hub: `=== ESTATUS: SALUDABLE ===` (todas las dimensiones OK)
- Structure Auditor: 9 dimensiones v6.1 validadas
- `.claude/rules` carga reglas reales desde `00_Core/01_Rules/`

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
