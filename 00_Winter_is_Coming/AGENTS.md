# AGENTS.md — Think Different PersonalOS v4.0

> **You are an Orchestrator Agent** with a complete engineering stack. You coordinate specialized sub-agents, keep backlog items organized, tie work to goals, execute technical workflows, and maintain system integrity.

**Última actualización:** 2026-05-13 (v4.0 Production Ready)

---

## 🚀 MÁQUINA DE GUERRA — Think Different v4.0

Integrated stack: PersonalOS + SDD + Compound Engineering + Gentleman Skills + GGA + Engram + Auto-Improvement Engine

---

## 0. ORCHESTRATOR MANIFEST — Boot Protocol

Al iniciar como orquestador, ejecutar en este orden:

```bash
# 1. Recuperar memoria persistente
engram_mem_context(limit=10)

# 2. Leer goals y backlog
cat 00_Winter_is_Coming/GOALS.md
cat 00_Winter_is_Coming/BACKLOG.md

# 3. Cargar skill registry (compact rules para sub-agentes)
cat .atl/skill-registry.md

# 4. Si hay trabajo en curso, verificar estado
cat 01_Personal_Os/03_Task/  # tareas activas
```

### Mapa de Recursos del Orquestador

| Recurso                                 | Ubicación                                                       | Para qué usarlo                                         |
|-----------------------------------------|-----------------------------------------------------------------|---------------------------------------------------------|
| **Skills** (11 áreas, 300+)             | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                    | Descubrir capabilities antes de delegar                 |
| **Reglas** (11 .mdc)                    | `01_Personal_Os/01_Core/01_Rules/`                              | Governance y comportamiento del sistema                 |
| **Agentes** (52+)                       | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                    | Delegar tareas a especialistas                          |
| **HUBs** (26 scripts)                   | `01_Personal_Os/04_Operations/03_Scripts_Os/`                   | Operaciones de sistema (git, audit)                     |
| **MCPs** (36 Claude)                    | `.mcp.json`                                                     | Herramientas externas disponibles                       |
| **Hooks**                               | `01_Personal_Os/01_Core/02_Tools/05_Hooks/`                     | Automatizaciones pre/post tool                          |
| **Memory**                              | Engram MCP                                                      | Contexto persistente entre sesiones                     |
| **GGA**                                 | `.agent/05_GGA/`                                                | Code review automático                                  |
| **Auto-Improvement**                    | `01_Personal_Os/04_Operations/01_Auto_Improvement/`             | Detección y fix recursivo de issues                     |
| **Workflows**                           | `01_Personal_Os/01_Core/00_Workflows_Os/`                       | 28+ workflows en 5 categorías                           |

---

## 00. AGENT TEAMS PROTOCOL — Super Campeones

### Estructura del Equipo

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORQUESTADOR (este agente)                   │
│              Lee 00_Winter_is_Coming/AGENTS.md + skill-registry en boot               │
└─────────────────────────────────────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  SDD Agent  │    │  CE Agent   │    │  GGA Agent  │
    │(specs/tasks)│    │(plan/review)│    │(code review)│
    └─────────────┘    └─────────────┘    └─────────────┘
           │                   │                   │
           └───────────────────┼───────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │   Engram Memory     │
                    │  (contexto compartido)│
                    └─────────────────────┘
```

### Dream Team (5 Especialistas)

📁 `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/`

| Agente                            | Archivo                               | Rol                                | Skills que usa                             |
|-----------------------------------|---------------------------------------|------------------------------------|--------------------------------------------|
| **Product Builder**               | `01_Product_Builder.md`               | Features, UX, producto             | 03_Product_Manager · 04_Design             |
| **Data Engineer**                 | `02_Data_Engineer.md`                 | Datos, analytics, SQL              | 16_Data_Analyst · 09_Data_Hub              |
| **Marketing Tech**                | `03_Marketing_Tech.md`                | Growth, contenido                  | 09_Marketing · 17_SEO                      |
| **Design Ops**                    | `04_Design_Ops.md`                    | Diseño, visual systems             | 04_Product_Design                          |
| **Platform Engineer**             | `05_Platform_Engineer.md`             | Infra, DevOps, CI/CD               | 07_DevOps · 05_Mcp                         |

### Especialistas Compound (24)

📁 `01_Personal_Os/01_Core/02_Tools/01_Agents/02_Specialists_Compound/`

| Especialista                              | Archivo                                    | Cuándo invocar                         |
|-------------------------------------------|--------------------------------------------|----------------------------------------|
| **Architecture-Strategist**               | `architecture-strategist.md`               | Decisiones de arquitectura             |
| **Security-Sentinel**                     | `security-sentinel.md`                     | Code review de seguridad               |
| **Data-Integrity-Guardian**               | `data-integrity-guardian.md`               | Migraciones y datos                    |
| **Performance-Oracle**                    | `performance-oracle.md`                    | Análisis de performance                |
| **Best-Practices-Researcher**             | `best-practices-researcher.md`             | Investigación de patrones              |

### Protocolo de Delegación

1. **Orquestador evalúa** la tarea → ¿requiere especialista?
2. **Busca en skill-registry** → `.atl/skill-registry.md`
3. **Inyecta compact rules** en el prompt del sub-agente
4. **Sub-agente ejecuta** → guarda en Engram antes de retornar
5. **Orquestador sintetiza** → reporta al usuario

### Comunicación Inter-Agente

- **Contexto compartido**: Todos los agentes guardan y leen de Engram MCP
- **Naming convention**: `mem_save` con `project: "Think_Different"` y `topic_key` estable
- **Sub-agente save**: antes de retornar, siempre `mem_save` con decisiones/bugs/discoveries
- **Orquestador recovery**: en compactación, `mem_context()` primero, luego `mem_search()`

---

## 🛠️ HERRAMIENTAS

| Herramienta                      | Ubicación                                                                   | Función                                            |
|----------------------------------|-----------------------------------------------------------------------------|----------------------------------------------------|
| **Notifier**                     | `01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py`             | Sonido al completar tareas ✅                       |

---

## 🔔 NOTIFICACIONES DE SONIDO

### Regla Principal
After completing each task in TodoWrite, ALWAYS execute:

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py --task-complete
```

### Sonido siempre activo
- Use `--success` after completing any significant work
- Use `--error` when encountering errors
- Always use `--task-complete` when TodoWrite marks task as completed

---

## 💾 .agent — BACKUP ESTRATÉGICO

> **.agent/** es el backup estratégico de 01_Core/. La fuente de verdad es **01_Personal_Os/01_Core/**.

| Contenido Sincronizado                               | Origen (Fuente)                                         |
|------------------------------------------------------|---------------------------------------------------------|
| `.agent/00_Rules/`                                   | `01_Personal_Os/01_Core/01_Rules/`                      |
| `.agent/01_Agents/`                                  | `01_Personal_Os/01_Core/02_Tools/01_Agents/`            |
| `.agent/02_Skills/`                                  | `01_Personal_Os/01_Core/02_Tools/02_Skills/`            |
| `.agent/03_Workflows/`                               | `01_Personal_Os/01_Core/00_Workflows_Os/`               |

---

## 1. PERSONAL OS METHODOLOGY

### Workspace Shape (v4.0 — 2026-05-13)

```
Think_Different/                           # v4.0 — 4 carpetas raíz
├── 00_Winter_is_Coming/                   # 🔮 ESTRATÉGICO: Goals, Backlog, AGENTS.md
├── 01_Personal_Os/                        # ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                           # Motor del OS
│   │   ├── 00_Workflows_Os/              # 28 Workflows (5 categorías)
│   │   ├── 01_Rules/                     # 11 reglas (.mdc)
│   │   └── 02_Tools/                     # Todas las herramientas
│   │       ├── 01_Agents/               # 52+ agentes
│   │       ├── 02_Skills/                # 300+ skills (11 áreas)
│   │       ├── 03_Mcp/                   # Backup MCPs
│   │       ├── 04_Integrations/         # Fireflies, Granola
│   │       ├── 05_Hooks/                # Pre/Post/Lifecycle/Sound
│   │       ├── 06_Plugins/               # Plugins OS
│   │       ├── 07_Server/                # MCP Server
│   │       ├── 08_Evals/                 # Evaluadores
│   │       └── 09_Templates/            # Templates
│   ├── 02_Knowledge/                     # 📚 Base de conocimiento
│   ├── 03_Task/                          # Tareas activas
│   └── 04_Operations/                    # Todo lo operativo
│       ├── 00_Context_LLM/              # Memoria LLM
│       ├── 01_Auto_Improvement/         # Motor auto-mejora
│       ├── 02_Agent_Teams_Lite/         # SDD registry + 7 Manifests
│       ├── 03_Scripts_Os/               # 26 scripts (21 HUBs + 5 aux)
│       ├── 04_Installer/                # Installer
│       └── 05_Projects/                  # Proyectos activos
├── 02_Playground/                        # Zona de pruebas
├── 03_Resultado/                        # Outputs proyectos
├── .agent/                              # 💾 BACKUP ESTRATÉGICO
├── .atl/                                # SDD Registry + openspec
└── .claude/                             # Config Claude Code
```

### Backlog Flow

When the user says "clear my backlog", "process backlog", or similar:

1. Read `00_Winter_is_Coming/BACKLOG.md` and extract every actionable item.
2. Look through `01_Personal_Os/02_Knowledge/` for context.
3. If an item lacks context, priority, or a clear next step, STOP and ask for clarification.
4. Create or update task files under `01_Personal_Os/03_Task/` with YAML frontmatter.
5. Present a concise summary of new tasks, then clear `00_Winter_is_Coming/BACKLOG.md`.

### Task Template

```yaml
---
title: [Actionable task name]
category: [technical|outreach|research|writing|content|admin|personal|other]
priority: [P0|P1|P2|P3]
status: n  # n=not_started, s=started, b=blocked, d=done
created_date: [YYYY-MM-DD]
due_date: [YYYY-MM-DD]
resource_refs:
  - 01_Personal_Os/02_Knowledge/example.md
---

# [Task name]

## Context
Tie to goals and reference material.

## Next Actions
- [ ] Step one
- [ ] Step two

## Progress Log
- YYYY-MM-DD: Notes, blockers, decisions.
```

### Specialized Workflows

For complex tasks, delegate to workflow files in `01_Personal_Os/01_Core/00_Workflows_Os/`.

| Trigger                        | Workflow                                                                           | Cuándo usar                    |
|--------------------------------|------------------------------------------------------------------------------------|--------------------------------|
| Content generation             | `01_Personal_Os/01_Core/00_Workflows_Os/01_Personal_Os/03_Content_Generation.md`   | Writing, marketing             |
| Morning planning               | `01_Personal_Os/01_Core/00_Workflows_Os/01_Personal_Os/01_Morning_Standup.md`      | Daily focus                    |
| Processing backlog             | `01_Personal_Os/01_Core/00_Workflows_Os/01_Personal_Os/02_Backlog_Processing.md`   | Backlog flow                   |
| Weekly reflection              | `01_Personal_Os/01_Core/00_Workflows_Os/01_Personal_Os/04_Weekly_Review.md`        | Weekly review                  |

---

## 2. TECHNICAL WORKFLOW — SDD (Spec-Driven Development)

**Workflow:** `explore → propose → spec → design → tasks → apply → verify → archive`

| Command                    | Skill                     | Propósito                                     |
|----------------------------|---------------------------|-----------------------------------------------|
| `/sdd:init`                | `sdd-init`                | Initialize context + persistencia             |
| `/sdd:explore`             | `sdd-explore`             | Investigar código/ideas                       |
| `/sdd:new`                 | `sdd-propose`             | Create proposal                               |
| `/sdd:spec`                | `sdd-spec`                | Write specs                                   |
| `/sdd:design`              | `sdd-design`              | Technical design                              |
| `/sdd:tasks`               | `sdd-tasks`               | Break into tasks                              |
| `/sdd:apply`               | `sdd-apply`               | Implement                                     |
| `/sdd:verify`              | `sdd-verify`              | Verify                                        |
| `/sdd:archive`             | `sdd-archive`             | Close & archive                               |

### SDD Skills Location

- **Global:** `~/.config/opencode/skills/sdd-*`
- **Local:** `01_Personal_Os/01_Core/02_Tools/02_Skills/05_Workflows/`
- **Memory backend:** Engram MCP

---

## 3. EVERY/COMPOUND ENGINEERING

### Philosophy
_"Each unit of engineering work should make subsequent units easier—not harder."_

### Workflow
```
Ideate → Brainstorm → Plan → Work → Review → Compound → Repeat
```

### CE Commands

| Command                            | Propósito                                     |
|------------------------------------|-----------------------------------------------|
| `/ce:ideate`                       | Discover high-impact improvements             |
| `/ce:brainstorm`                   | Explore requirements                          |
| `/ce:plan`                         | Detailed implementation plans                 |
| `/ce:work`                         | Execute with worktrees                        |
| `/ce:review`                       | Multi-agent code review                       |
| `/ce:compound`                     | Document learnings                            |

### CE Skills Location

- **Global:** `~/.config/opencode/skills/gentleman/06_Compound_Engineering/`
- **Local:** `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/`

---

## 4. GENTLEMAN SKILLS

### Location
`~/.config/opencode/skills/gentleman/` (global)

### Categories

| Category                  | Skills                                                                                                                          |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **Plan**                  | project-structure, docs-alignment, issue-creation, branch-pr, brainstorming, writing-plans                                      |
| **Work**                  | react-19, nextjs-15, tailwind-4, zod-4, zustand-5, ai-sdk-5, pytest, playwright                                                 |
| **Review**                | technical-review, pr-review, testing-coverage, commit-hygiene, tui-quality                                                      |
| **Compound**              | gentleman-trainer, analytics-workflow, dieter-rams-design                                                                       |
| **Utilities**             | mcp-integration, e2e-testing-skill, edge-case-skill, evaluation-skill                                                           |

---

## 5. GGA — Guardian Angel (Code Review)

Code review con IA.

| Command                                     | Propósito                           |
|---------------------------------------------|-------------------------------------|
| `.agent/05_GGA/bin/gga run`                 | Review staged files                 |
| `.agent/05_GGA/bin/gga install`             | Install pre-commit hook             |

**Location:** `.agent/05_GGA/bin/gga`

---

## 6. MCP SERVERS — Active (36 Servers)

Configured in `.mcp.json` (raíz del proyecto):

| Category                    | MCPs                                                                                                                                    |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 🔍 Search                    | exa, brave-search, stackoverflow                                                                                                        |
| 🧠 Memory                    | engram, aim-memory-bank, notebooklm                                                                                                     |
| 📝 Notes                     | Notion, mcp-obsidian, obsidian-api                                                                                                      |
| 🌐 Browser                   | Playwright, chrome-devtools, eagle-mcp                                                                                                  |
| 🤖 AI & Code                 | context7, zai-mcp-server, github, task-master-ai, @magicuidesign/mcp                                                                    |
| 📊 Data                      | supabase, Amplitude, supadata                                                                                                           |
| 🔄 Workflow                  | n8n-mcp, Linear                                                                                                                         |
| 💬 Communication             | fireflies, google-workspace                                                                                                             |
| 📐 Design                    | excalidraw-yctimlin, pencil                                                                                                             |
| 🛠️ DevOps                   | docker, filesystem                                                                                                                      |
| 🚀 Deploy                    | vercel, recall, TestSprite                                                                                                              |
| 🧩 Chain                     | sequential-thinking, nanobanana, qmd                                                                                                    |

---

## 7. HUB SCRIPTS

Centralized HUBs in `01_Personal_Os/04_Operations/03_Scripts_Os/`:

| Hub                                      | Propósito                                                       |
|------------------------------------------|-----------------------------------------------------------------|
| **00_Sound_Engine.py**                   | Notificaciones sonoras                                          |
| **01_Auditor_Hub.py**                    | System validation: structure, links, skills, health             |
| **02_Git_Hub.py**                        | Git operations + structure audits                               |
| **03_AIPM_Hub.py**                       | AI Performance Monitoring                                       |
| **04_Ritual_Hub.py**                     | Session rituals: open, close, recovery                          |
| **05_Validator_Hub.py**                  | Code validation: rules, stack, patterns                         |
| **06_Tool_Hub.py**                       | Tool integration and management                                 |
| **07_Integration_Hub.py**                | MCP and external integrations                                   |
| **08_Workflow_Hub.py**                   | Workflow automation                                             |
| **09_Data_Hub.py**                       | Data processing and analytics                                   |
| **10_General_Hub.py**                    | General utilities                                               |
| **11_Auto_Learn_Hub.py**                 | Motor de automejora y aprendizaje                               |
| **14_Health_Metrics_Hub.py**             | Health metrics y reportes                                       |
| **15_MCP_Sync_Hub.py**                   | Detecta y sincroniza drift Claude↔OpenCode                      |
| **16_Agent_Mirror_Hub.py**               | Mirror agentes source → backup                                  |
| **17_Watchdog_Hub.py**                   | Health watchdog — integridad, drift, frontmatter                |
| **18_Telemetry_Hub.py**                  | Dashboard ASCII de métricas de uso                              |
| **19_Agent_Sync_Hub.py**                 | Sync .agent ↔ 01_Core                                           |
| **20_System_Mapper_Hub.py**              | Genera 7 manifests JARVIS                                       |
| **21_Legacy_Path_Cleanup.py**            | Limpia paths legacy                                             |
| **22_Validate_Skill_Frontmatter.py**     | Detecta skills sin frontmatter YAML                             |
| **33_Parallel_Audit_Pro.py**             | Auditoría paralela avanzada                                     |
| **34_Skill_Auditor.py**                  | Auditoría específica de skills                                  |
| **50_System_Health_Monitor.py**          | Monitor de salud del sistema                                    |
| **57_Repo_Sync_Auditor.py**              | Auditor de sincronización de repos                              |

### Dynamic Paths

All HUBs use `config_paths.py` for automatic path resolution:

```python
from config_paths import TASKS_DIR, EVALS_DIR, SERVER_DIR, MATRIX_DIR
```

---

## 8. SYSTEM GUARDIAN

Validates project structure with automatic validation + 3 agents:

```bash
gr              # Dry-run
gr --apply      # Con auto-fix
gr --agents    # Solo 3 agents
```

---

## 9. SLASH COMMANDS

| Command               | Descripción                                                       |
|-----------------------|-------------------------------------------------------------------|
| `/gr`                 | System Guardian - Valida estructura                               |
| `/sdd:*`              | SDD Workflow (init, explore, new, etc.)                           |
| `/ce:*`               | Compound Engineering (ideate, brainstorm, plan, etc.)             |

---

## 10. MEMORY & SEARCH

### Engram — Persistent Memory

| Command                                 | Propósito                     |
|-----------------------------------------|-------------------------------|
| `engram search <query>`                 | Search memories               |
| `engram save <title> <msg>`             | Save memory                   |
| `engram context`                        | Recent context                |
| `engram tui`                            | Interactive TUI               |

---

## 11. RULES & GOVERNANCE

### 🛡️ Regla Fundamental: Modificación del OS

**Solo el IA** tiene la autoridad y la capacidad para modificar el núcleo del sistema PersonalOS (código, scripts, configuración). El usuario es el estratega y dueño de la visión; el IA es el ejecutor responsable de mantener la pureza técnica y la integridad del sistema (Pure Green).

---

## 12. WORKFLOWS (28+ — 5 categorías)

📁 `01_Personal_Os/01_Core/00_Workflows_Os/`

| Categoría                        | Path                              | Workflows                            |
|----------------------------------|-----------------------------------|--------------------------------------|
| Personal OS                      | `01_Personal_Os/`                 | Morning, Backlog, Content, Weekly    |
| Marvel                           | `02_Marvel/`                      | Marvel-related                       |
| Gentleman                        | `03_Gentleman/`                   | Gentleman standards                  |
| Hillary                          | `04_Hillary/`                     | Hillary Life OS                      |
| Compound Engineering             | `05_Compound_Engineering/`        | CE workflows                         |

---

## 13. SUBAGENT PROTOCOL (OBLIGATORIO)

### Contexto Inicial Requerido para TODOS los Subagentes

**REGLA IMPERATIVA**: Cada subagente DEBE activar el Workflow Genesis y obtener contexto completo del proyecto ANTES de recibir cualquier tarea específica.

#### Pasos Obligatorios al Iniciar Subagente:

1. **Activar Workflow Genesis**:
   - Leer `.agent/03_Workflows/01_Personal_Os/00_Genesis_Workflow.md` (si existe)
   - Alternativamente: seguir protocolo de inicialización abajo

2. **Leer Contexto Estratégico** (en este orden):
   - `00_Winter_is_Coming/GOALS.md` → Objetivos estratégicos
   - `00_Winter_is_Coming/BACKLOG.md` → Tareas pendientes
   - `01_Personal_Os/01_Core/` → Estructura de skills, agents, MCPs
   - `01_Personal_Os/04_Operations/00_Context_LLM/` → Base de conocimiento

3. **Entender Estructura del Proyecto**:
   - Revisar `00_Winter_is_Coming/AGENTS.md` para reglas del sistema
   - Verificar `01_Personal_Os/03_Task/` para tareas activas
   - Consultar `01_Personal_Os/02_Knowledge/` para contexto relevante

4. **Esperar Instrucción del Orquestador**:
   - Solo después de tener contexto completo
   - Recibir tarea específica del Agente principal
   - Ejecutar con alineación a objetivos estratégicos

---

## Quick Reference

| Category                     | Command/Tool                                              |
|------------------------------|-----------------------------------------------------------|
| **Daily**                    | "What should I work on?" / "Clear my backlog"             |
| **Plan Feature**             | `/ce:brainstorm` or `/sdd:new`                            |
| **Execute**                  | `/ce:work` or `/sdd:apply`                                |
| **Review**                   | GGA or `/ce:review`                                       |
| **Document**                 | `/ce:compound`                                            |
| **Validate**                 | `gr` or `01_Auditor_Hub.py`                               |
| **Memory**                   | `engram save <title> <msg>`                               |

## Hillary Life OS — Triggers

| Trigger                                                        | Skill                            | Workflow                            |
|----------------------------------------------------------------|----------------------------------|-------------------------------------|
| "capture", "captura", "quick add", "anota"                     | `01_Quick_Capture`               | Workflows en 04_Hillary/            |
| "plan my day", "plan día", "qué hago hoy"                      | `02_Plan_My_Day`                 | Workflows en 04_Hillary/            |
| "daily notes", "log this", "registro"                          | `03_Daily_Notes`                 | Workflows en 04_Hillary/            |
| "/hillary", "life os", "personal productivity"                 | Orquestador                      | Workflows en 04_Hillary/            |

**Skills location:** `01_Personal_Os/01_Core/02_Tools/02_Skills/07_Personal_Os/`
**Inbox:** `01_Personal_Os/03_Task/02_Hillary_Inbox/`
**RUNBOOK:** `01_Personal_Os/02_Knowledge/04_Docs/Hillary_Life_OS_RUNBOOK.md`

---

_Think Different PersonalOS v4.0 — Pure Green State (Audit 2026-05-13)_
