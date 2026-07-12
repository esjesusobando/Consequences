# 📁 ESTRUCTURA COMPLETA — Think Different PersonalOS v5.0 (SOTA)

> **Versión:** 5.0 (SOTA)
> **Fecha:** 2026-07-05
> **Estado:** Production Ready — SOTA Upgraded + Full Path Audit (84/84 OK)
> **Audit v5.0 (Complete Audit):** 2026-06-29 — SOTA upgrade + Playground organizado + 393 READMEs beautificados.
> **Path Audit 2026-07-03:** 84/84 paths OK, dual-copy arch documented, opencode.json fix, Structure sync.
> **ZC Audit 2026-07-05:** 26 hallazgos → 20 corregidos (CRITICAL: empty scan-skills.py, HIGH: Gemini model, XSS, tsconfig alias)
> **Auto-Improvement:** ✅ Activo — Corre cada 8h (01:05, 09:05, 17:05)

---

## 🏠 RAÍZ — 4 Carpetas Principales

```
Think_Different/                    # RAÍZ
├── 00_Winter_is_Coming/           # Goals, Backlog, Memoria estratégica
├── 01_Personal_Os/                # SISTEMA OPERATIVO (FUENTE DE VERDAD)
├── 02_Playground/                  # Zona de pruebas y experimentos
│   └── Graphify_Out/              # Knowledge graph (god nodes, communities)
└── 03_Resultado/                   # Outputs de proyectos
```

### 📝 Notas de la Raíz

| Carpeta                 | Propósito                                                          |
|-------------------------|--------------------------------------------------------------------|
| **00_Winter_is_Coming** | Dirección estratégica. Goals, Backlog, AGENTS.md (GGA), CHANGELOG. |
| **01_Personal_Os**      | EL SISTEMA OPERATIVO. Skills, agentes, HUBs, workflows, memoria.   |
| **02_Playground**       | Zona de pruebas. Graphify_Out (knowledge graph), experimentos.     |
| **03_Resultado**        | Outputs de proyectos. Entregables, reportes, contenido generado.   |

---

## 📂 01_Personal_Os — Sistema Operativo (FUENTE DE VERDAD)

```
01_Personal_Os/
├── 00_Core/                       # MOTOR DEL OS
│   ├── 00_Workflows/          # 30 workflows (8 categorías)
│   ├── 01_Rules/                 # 14 reglas .mdc [FIXED]
│   ├── 02_Tools/                 # Herramientas del OS
│   │   ├── 00_SDD/               # SDD registry + JARVIS manifests
│   │   ├── 01_Agents/            # 63 agentes source (9 categorías) [FIXED]
│   │   ├── 02_Skills/            # 396 skills (15 áreas) [FIXED]
│   │   ├── 03_Mcp/               # Backup MCP configs (2 JSON + 3 subdirs)
│   │   ├── 04_Integrations/      # Fireflies, Granola
│   │   ├── 05_Hooks/             # 10 hooks (6 fases) [FIXED]
│   │   ├── 06_Plugins/           # Plugins OS
│   │   ├── 07_Server/            # Engram server
│   │   ├── 08_Evals/             # Evaluadores, dashboard y métricas
│   │   └── 09_Templates/         # Templates
│   ├── 03_Content/               # Contenido del sistema operativo
│   └── 04_Telemetry/             # Telemetría y monitoreo
├── 01_Memory/                    # Memoria LLM (CTX + Process Notes)
├── 02_Knowledge/                 # Base de conocimiento (estática)
│   ├── 00_Examples_Personal_Os/  # Ejemplos del OS
│   ├── 01_Research/              # Investigaciones (consolidado)
│   ├── 02_Docs/                  # Documentación técnica
│   ├── 03_Unicorn/               # Unicorn content
│   ├── 04_Invictus/              # Invictus project
│   └── 05_Anthropic/             # Anthropic references
├── 03_Learning/                  # Conocimiento activo
│   ├── 00_Shared_Org/            # 🌕 Capital Token — Conocimiento organizacional
│   │   ├── playbooks/            # Procesos repetitivos documentados
│   │   ├── decisions/            # ADRs — Architectural Decision Records
│   │   ├── processes/            # SOPs operativos
│   │   ├── agents/               # Templates de agentes por rol
│   │   ├── context/              # Contexto organizacional compartido
│   │   └── metrics/              # Dashboard y tracking del Capital Token
│   ├── 01_Auto_Improvement/      # 🔄 Motor auto-mejora recursiva (ACTIVO — cada 8h)
│   │   ├── 01_Engine/            # Pipeline: detector → analyzer → executor → learner
│   │   ├── 02_Rules/             # Reglas de detección y auto-fix
│   │   ├── 03_Metrics/           # Logs, métricas, last_run.json
│   │   ├── 04_Triggers/          # Task Scheduler (setup + cron)
│   │   ├── recursive_improvement_engine.py  # Orquestador del pipeline
│   │   └── learnings.json        # 130+ fixes aplicados históricamente
│   ├── 02_Learning_Always/       # Aprendizaje continuo
│   ├── 03_Content/               # Creación de contenido (ex Writing_Content)
│   └── 04_Telemetry/             # Telemetría y monitoreo (ex Aipm)
├── 04_Tasks/                     # Tareas activas (YAML frontmatter 100%)
├── 05_Scripts/                   # Scripts operativos
│   ├── 00_HUBs/                  # HUBs funcionales + sync_copies.py
│   ├── 01_Installer/             # Scripts de instalación
│   └── 02_Agent_Teams_Lite/      # Manifests y config de agentes lite
├── 06_Projects/                  # Proyectos activos
└── 07_Archive/                   # Backups, snapshots, históricos
    ├── 01_Plans_Completed/       # Planes, docs, session summaries
    ├── 02_Skills_Legacy/         # Skills legacy [FIXED]
    └── 03_Backups_Refs/          # Backups, repos, audits
```

---

## 📂 02_Playground — Zona de Pruebas

```
02_Playground/
├── Graphify_Out/                  # Knowledge graph (god nodes, communities)
├── 00_Momentum/                   # Momentum experiments
├── 00_Testing_Youtube/            # YouTube testing
├── 01_Branders_Skills/            # Branding skills
├── 02_Workflow_N8N/               # N8N workflows
├── 03_Reports/                    # Reportes, sesiones, diagnósticos, walkthroughs
├── 04_Testing_Legacy/             # Legacy testing
├── 05_Obanlover/                  # Obanlover experiments
├── 06_JAO/                        # JAO experiments
├── 07_Zero_Consequences/          # [AUDITED 2026-07-05] Zero Consequences — 20 fixes applied ✅
├── 08_Plans_and_Docs/             # Planes estratégicos, tasks, implementation plans [NEW 2026-06-29]
├── 09_Skills_Drafts/              # Borradores de skills y kits de diseño [NEW 2026-06-29]
└── 10_Scripts_and_Logs/           # Scripts operativos y logs del Playground [NEW 2026-06-29]
```

---

## 📂 03_Resultado — Outputs de Proyectos

```
03_Resultado/
├── 00_Proyectos/                  # Planes, revisiones, side projects
├── 01_Aprendizaje/                # Skills output, fundamentos, referencias
├── 02_Experimentos/               # World OIM, ejercicios, sesiones
├── 03_Documentacion/              # Documentación general
├── 04_Reports/                    # Auditorías y reportes
├── 05_Testing_Skills/             # Pruebas controladas
├── 06_Testing_Travel/             # Testing de travel
└── 07_Test_MKT_Skills/            # Marketing skills testing
```

---

## 📂 00_Winter_is_Coming — Dirección Estratégica

```
00_Winter_is_Coming/
├── AGENTS.md                      # Core — Reglas del sistema (Matrix)
├── BACKLOG.md                     # Tareas pendientes
├── GOALS.md                       # Metas estratégicas
├── CHANGELOG.md                   # Historial de cambios (v5.0)
├── OS_DIRECTORY.md                # Directorio JARVIS
├── COMPLETION_SUMMARY.md          # Resumen de completados
├── 00_Iron_Man_Gen.md             # Workflow Génesis
└── README.md                      # Entry point
```

---

## 🔧 SKILLS POR ÁREA (15 áreas funcionales — 396 total)

| Área                    | Skills | Descripción                                 |
|-------------------------|--------|---------------------------------------------|
| 00_Agent_Teams_Lite     |     14 | SDD sub-agentes + JARVIS manifests          |
| 00_Compound_Engineering |     63 | Core CE — SDD + Compound Engineering        |
| 00_Personal_Os          |     24 | Life OS, Hillary, Rituales                  |
| 00_Skill_Auditor        |      1 | Auditoría de skills                         |
| 00_System_Core          |      1 | Stack base del OS                           |
| 00_Workflows            |     39 | Workflows OS                                |
| 01_Creacion_Contenidos  |     52 | Brand, YouTube, SEO, Marketing              |
| 02_Diseno_Ui_Ux         |     34 | Product Design, UI/UX, Taste                |
| 03_Video_Media          |     11 | Video Intel, James Cameron                  |
| 04_Automatizacion       |     27 | N8N, Firecrawl, GWS Client                  |
| 05_Claude_Ads           |     21 | Claude Ads & Promoted Content               |
| 06_Tools                |     83 | Skill Creator, Testing, DevOps              |
| 07_Invictus_Web         |     18 | Playwright, Superpowers                     |
| 08_JAO                  |      7 | Entrevistador, Humanizador, Superpowers     |
| 10_Laia_Learning        |      1 | Sistema de aprendizaje personal             |
| **TOTAL**               |**396** |                                             |

---

## 🤖 AGENTES (63 source — 9 categorías)

| Categoría                          | Cantidad | Ubicación                                    |
|------------------------------------|----------|----------------------------------------------|
| Root (agent .md files)             |       25 | `01_Agents/` (root level)                    |
| Dream Team                         |        6 | `01_Dream_Team/`                             |
| Specialists Compound               |       23 | `02_Specialists_Compound/`                   |
| Growth                             |        5 | `03_Growth/`                                 |
| OS Conductor                       |        1 | `00_OS_Conductor/`                           |
| ATL Gen                            |        3 | `07_Agent_Teams_Lite_Gen/`                   |
| Agent Teams Lite                   |        0 | `00_Agent_Teams_Lite/`                       |
| Legacy/Other                       |        0 | `04_Contexto/, 05_Marca/, 06_Plantillas/`    |

> ⚠️ Conteo incluye todos los .md en subdirectorios hasta profundidad 2. Excluye README/LEEME/SKILL/AGENTS. Backup = 72. Drift = 9. Verificado 2026-06-27 por System Mapper.

---

## 🔧 HUBs (42 HUBs — 166 scripts totales)

| Hub               | Propósito                       |
|-------------------|---------------------------------|
| Sound Engine      | Notificaciones sonoras          |
| Auditor           | Auditorías del sistema          |
| Git               | Operaciones Git                 |
| AIPM              | AI Performance Monitoring       |
| Ritual            | Rituales de sesión              |
| Validator         | Validación de código            |
| Tool              | Gestión de herramientas         |
| Integration       | Integraciones MCP               |
| Workflow          | Automatización de workflows     |
| Data              | Procesamiento de datos          |
| General           | Utilidades generales            |
| Auto Learn        | Motor de automejora             |
| Health Metrics    | Métricas de salud               |
| MCP Sync          | Sync Claude ↔ OpenCode          |
| Agent Mirror      | Mirror source → backup          |
| Watchdog          | Health watchdog                 |
| Telemetry         | Dashboard de métricas           |
| Agent Sync        | Sync .agent ↔ 01_Core           |
| System Mapper     | Genera 7 manifests JARVIS       |
| SOTA HUB          | State of the Art upgrades       |
| SOTA Modernizer   | CoT injection en skills         |
| Doc Sync          | Sincronización de documentos    |
| + 11 auxiliares   | Legacy, Frontmatter, Paths, etc.|

---

## ✅ Ground Truth (verificado 2026-06-27 — System Mapper v5.0)

> Fuente: `python 01_Personal_Os/05_Scripts/00_HUBs/20_System_Mapper_Hub.py --scan` ejecutado en vivo el 2026-06-27T13:19:17

| Métrica               | Valor verificado               | Volatilidad  |
|-----------------------|--------------------------------|--------------|
| Skills (SKILL.md)     | 396 (15 áreas)                 | [FIXED]      |
| Reglas (.mdc)         | 14                             | [FIXED]      |
| Hooks (.py + .ps1)    | 10 (6 fases)                   | [FIXED]      |
| Workflows (.md)       | 30 (8 categorías)              | [FIXED]      |
| Agentes (source)      | 63                             | [FIXED]      |
| Agentes (backup)      | 72 (drift: 9)                  | [VERIFIED]   |
| HUBs funcionales      | 42 (33 .py + 9 subdirs)        | [FIXED]      |
| Scripts totales       | 166 (33 raiz + 133 subdirs)    | [FIXED]      |
| MCP Claude (root)     | 11                             | [FIXED]      |
| MCP OpenCode          | 45                             | [VERIFIED]   |
| Integraciones         | 2 (Fireflies, Granola)         | [VERIFIED]   |

> **Nota sobre agentes:** Conteo de archivos .md de definición de agentes (excluye README.md, LEEME.md, SKILL.md, registry.md, AGENTS.md). Categorías: Root 25, Dream Team 6, Specialists 23, Growth 5, OS Conductor 1, ATL Gen 3, ATL 0.

---

## 📋 COMANDOS PRINCIPALES

| Comando                        | Descripción                       |
|--------------------------------|-----------------------------------|
| `gr`                           | System Guardian — dry-run         |
| `gr --apply`                   | Aplicar fixes automáticos         |
| `/sdd-*`                       | SDD Workflow (init→archive)       |
| `/ce:*`                        | Compound Engineering              |
| `/claude-seo-ai:*`             | SEO + AI-search audit & fix       |
| `Process my backlog`           | Backlog processing (4 workflows)  |
| `What should I work on today?` | Morning standup                   |
| `Write a blog post`            | Content generation                |
| `Weekly review`                | Weekly reflection                 |

---

## 🌕 CAPITAL TOKEN — Shared Organization Knowledge

> **Ubicación:** `01_Personal_Os/03_Learning/00_Shared_Org/`
> **Opción C — Híbrido**: Personal OS como core + capa compartida para el equipo.
> *Implementado: 2026-06-27 | Fase 1 Foundation*

```
00_Shared_Org/ (en 03_Learning/)
├── playbooks/          # Procesos repetitivos documentados (1 listo)
├── decisions/          # ADRs — Architectural Decision Records (1 registrado)
├── processes/          # SOPs — Standard Operating Procedures (template listo)
├── agents/             # Templates de agentes por rol (3: Admin, Finance, HR)
├── context/            # Contexto organizacional compartido (stub)
├── metrics/            # Dashboard de estado del Capital Token
└── capital-token-bridge.py  # MCP Bridge v0.1 (servidor JSON + sync Engram)
```

**Principios:** LLM-agnóstico (markdown+YAML), donde se trabaja (Slack/Notion/WhatsApp), compound learning, human+token.

**Próximo:** Codex workspace compartido (pendiente), MCP Bridge a producción (Fase 2), Slack Bot + Notion.

## 🔄 AUTO-IMPROVEMENT — Motor Recursivo

> **Estado:** ✅ ACTIVO — Corre cada 8 horas desde el 28 de mayo de 2026
> **Pipeline:** Detectar → Analizar → Fix → Aprender

```
Ubicación: 01_Personal_Os/03_Learning/01_Auto_Improvement/
Windows Task Scheduler: "AutoImprovementPersonalOS"
Schedule: Cada 8h (01:05, 09:05, 17:05)
Runner: run_scheduled.bat → cron_trigger.py --once --apply (LIVE)
Última ejecución: 2026-06-28 ✅
```

| Fixer                      | Categoría | Qué hace                            |
|----------------------------|-----------|-------------------------------------|
| `_create_missing_dir`      | structure | Crea directorios faltantes          |
| `_fix_version_mismatch`    | docs      | Unifica versiones entre docs        |
| `_fix_docstring`           | docs      | Actualiza fechas/versiones viejas   |
| `_fix_naming_convention`   | code      | Renombra a NN_Descripcion.ext       |
| `_fix_duplicate_scripts`   | structure | Archiva scripts duplicados          |
| `_fix_requirements_txt`    | deps      | Estandariza constraints             |

---

*Structure v5.0 — 2026-07-05 — Think Different PersonalOS (SOTA) — Restructured + Path Audit (84/84 OK) + ZC Audit (20 fixes)*

---

## 📌 DUAL COPY — Advertencia Importante

Este proyecto tiene **dos copias** del directorio `01_Personal_Os/`:

| Copia | Ubicación | Scripts | Contenido |
|-------|-----------|---------|-----------|
| **A** | `C:\Users\sebas\01_Personal_Os\` | Planos en `05_Scripts/` | Mínimo — solo estructura |
| **B** (CANÓNICA) | `Desktop\Think_Different\01_Personal_Os\` | En `05_Scripts/00_HUBs/03_Scripts_Os/` | Rico — estructura v5 completa |

- **Regla:** Copy B es la fuente de verdad. Copy A es un mirror plano para scripts.
- **Env var:** `PERSONAL_OS_ROOT=C:/Users/sebas/Desktop/Think_Different` → apunta a Copy B
- **Path audit:** 84/84 paths OK en ambas copias (2026-07-03)
- **⚠️ `04_Operations/`** no existe en ninguna copia — todas las rutas legacy que lo referencian están obsoletas
- **05_HUB_Catalog.yaml** corregido: todos los paths `04_Operations/→05_Scripts/00_HUBs/` (2026-07-03)
- **config_paths.py --validate**: 82/82 paths OK, salida JSON disponible
- **sync_copies.py**: sync B→A con SHA256, backup y dry-run
