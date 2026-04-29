# INVENTARIO INTEGRADO — PersonalOS v2.0 Consequences

> **Fecha:** 2026-04-24
> **Estado:** ✅ OPERATIVO — Todas las metodologías integradas

---

## VISIÓN GENERAL — 6 METODOLOGÍAS INTEGRADAS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PERSONAL OS v2.0 Consequences                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐               │
│   │   PERSONAL   │────▶│   GENTLEMAN  │────▶│  COMPOUND    │               │
│   │      OS      │     │              │     │  ENGINEERING │               │
│   └──────────────┘     └──────────────┘     └──────────────┘               │
│         │                    │                    │                          │
│         ▼                    ▼                    ▼                          │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐               │
│   │   HILLARY    │◀────│   LEARNING   │◀────│   SISTEMA    │               │
│   │              │     │   ALWAYS     │     │   RECURSIVO  │               │
│   └──────────────┘     └──────────────┘     └──────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. PERSONAL OS — Sistema Principal

### Definición
Framework operativo personal que integra agents, skills, workflows, y automatización en un OS adaptativo.

### Base (Origen)
```
01_Personal_Os/05_Archive/07_Repos_Gentleman/personal-os-main/
```

### Arquitectura Actual
```
01_Personal_Os/
├── 01_Core/
│   ├── 00_Workflows_Os/     ← Workflows Marvel + Personal
│   ├── 01_Rules/            ← 10 archivos .mdc
│   └── 02_Tools/
│       ├── 01_Agents/        ← 35+ agents
│       ├── 02_Skills/        ← 100+ skills
│       ├── 03_Mcp/           ← MCP servers
│       ├── 05_Hooks/         ← Hooks de calidad
│       └── 07_Server/        ← Engram server
├── 02_Knowledge/
│   └── 01_Research/          ← SOTA 2026, MCP Catalog
├── 03_Task/                  ← Hillary system
├── 04_Operations/
│   ├── 01_Auto_Improvement/  ← Sistema recursivo
│   ├── 02_Agent_Teams_Lite/  ← SDD workflow
│   └── 03_Scripts_Os/       ← 14 HUBs
└── 05_Archive/               ← Legacy + backups
```

### Skills Propias
| Skill                   | Path                                            | Propósito            |
|-------------------------|-------------------------------------------------|----------------------|
| Agent Teams Lite        | `02_Skills/05_Workflows/01_Agent_Teams_Lite/`   | SDD orchestration    |
| PM Agent Orchestrator   | `02_Skills/05_Workflows/04_PM_Orchestrator/`    | Project management   |
| Personal Life OS        | `02_Skills/07_Personal_Os/01_Life_OS/`          | Life optimization    |
| Hillary Integration     | `03_Task/02_Hillary_Inbox/`                     | Task capture         |

### Workflows
| Workflow              | File                                     | Invoca                  |
|-----------------------|------------------------------------------|-------------------------|
| Morning Standup       | `01_Personal_Os/01_Morning_Standup.md`   | Hillary, Auto-Improve   |
| Backlog Processing    | `02_Backlog_Processing.md`               | Hillary, Classify       |
| Content Generation    | `03_Content_Generation.md`               | Compound, Marketing     |
| Weekly Review         | `04_Weekly_Review.md`                    | Learning, Compound      |
| System Health Audit   | `07_System_Health_Audit.md`              | Auto-Improve, All       |

### Conexiones
- **Usa** → Compound Engineering para reviews
- **Usa** → Hillary para task management
- **Usa** → Sistema Recursivo para auto-mejora
- **Usa** → Learning Always para persistencia

---

## 2. GENTLEMAN — Installer + TUI + E2E

### Definición
Sistema de instalación y configuración automatizada con TUI interactiva (Bubbletea) y tests E2E con Docker.

### Base (Origen)
```
01_Personal_Os/05_Archive/07_Repos_Gentleman/Gentleman.Dots/
├── installer/              ← Go TUI (Bubbletea)
├── skills/                 ← 6 skills Gentleman
├── homebrew-tap/          ← Homebrew formulas
└── GentlemanZsh/         ← Zsh config
```

### Skills Integradas en PersonalOS
| Skill                   | Status        | Propósito             |
|-------------------------|---------------|-----------------------|
| `gentleman-bubbletea`   | ✅ Integrada   | TUI patterns          |
| `gentleman-e2e`         | ✅ Integrada   | Docker E2E            |
| `gentleman-installer`   | ✅ Integrada   | Install flow          |
| `gentleman-system`      | ✅ Integrada   | System detection      |
| `gentleman-trainer`     | ✅ Integrada   | Vim training RPG      |
| `go-testing`            | ✅ Integrada   | Go testing patterns   |

### Skills Base (Gentleman.Skills repo)
```
01_Personal_Os/05_Archive/07_Repos_Gentleman/gentleman-skills/
├── curated/
│   ├── skill-creator/       ← Skill creation
│   ├── playwright/          ← E2E testing
│   ├── github-pr/          ← PR workflow
│   ├── jira-task/          ← Jira integration
│   ├── jira-epic/          ← Epic creation
│   ├── nextjs-15/          ← Next.js patterns
│   ├── react-19/           ← React 19 patterns
│   ├── angular*/           ← Angular patterns
│   ├── tailwind-4/        ← Tailwind CSS 4
│   ├── typescript/         ← TypeScript strict
│   ├── zod-4/             ← Zod validation
│   ├── zustand-5/          ← Zustand state
│   └── pytest/            ← Python testing
└── community/
    └── [25+ frameworks]    ← Extended coverage
```

### Componentes Go (Installer)
| Componente     | Path                                 | Propósito      |
|----------------|--------------------------------------|----------------|
| Model          | `installer/internal/tui/model.go`    | TUI state      |
| View           | `installer/internal/tui/view.go`     | Render         |
| Update         | `installer/internal/tui/update.go`   | Events         |
| Trainer        | `installer/internal/tui/trainer/`    | Vim RPG        |
| System         | `installer/internal/system/`         | OS detection   |

### Workflows que lo usan
| Workflow                 | Invoca                |
|--------------------------|-----------------------|
| 10_Frontend_Premium.md   | Gentleman-bubbletea   |
| System Health Audit      | gentleman-e2e         |
| Installer validation     | gentleman-installer   |

### Conexiones
- **Usa** → Personal OS Rules para calidad
- **Usa** → go-testing para tests
- **Invocado por** → Personal OS para instalaciones
- **Expande** → Gentleman Skills para nuevos frameworks

---

## 3. COMPOUND ENGINEERING — Reviews + SDD

### Definición
Sistema de ingeniería compuesta con agents especializados para reviews, architecture, y spec-driven development.

### Base (Origen)
```
01_Personal_Os/05_Archive/07_Repos_Gentleman/gentle-ai/
01_Personal_Os/05_Archive/07_Repos_Gentleman/compound-engineering-plugin/
```

### Arquitectura en PersonalOS
```
01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/
├── SKILL.md                          ← Main entry
├── 01_Agents_Review/                 ← 23 agents code review
├── 02_Agents_DocReview/              ← 6 agents doc review
├── 03_Agents_Design/                ← 3 agents design
├── 04_Agents_Research/              ← 5 agents research
├── 05_Agents_Workflow/              ← 4 agents workflow
├── 06_Agents_Docs/                  ← Documentation
├── 08_Mcp/                          ← MCP config
└── 09_Scripts/                      ← Workflows
```

### Agents (35+ total)

#### Code Review Agents (23)
| Agent                            | Specialty                  |
|----------------------------------|----------------------------|
| correctness-reviewer             | Logic errors, edge cases   |
| security-reviewer                | Vulnerabilities, auth      |
| performance-reviewer             | Bottlenecks, scaling       |
| code-simplicity-reviewer         | YAGNI, cleverness          |
| maintainability-reviewer         | Coupling, dead code        |
| pattern-recognition-specialist   | Design patterns            |
| architecture-strategist          | System design              |
| kieran-typescript-reviewer       | TypeScript strict          |
| kieran-python-reviewer           | Pythonic clarity           |
| kieran-rails-reviewer            | Rails conventions          |
| dhh-rails-reviewer               | 37signals style            |
| julik-frontend-races-reviewer    | Async races                |
| security-sentinel                | OWASP compliance           |
| data-integrity-guardian          | DB safety                  |
| data-migrations-reviewer         | Migration safety           |
| deployment-verification-agent    | Deploy checklists          |
| reliability-reviewer             | Error handling             |
| testing-reviewer                 | Test coverage              |
| api-contract-reviewer            | API breaking changes       |
| performance-oracle               | Performance metrics        |
| schema-drift-detector            | Schema changes             |
| agent-native-reviewer            | AI parity                  |
| best-practices-researcher        | Industry standards         |

#### Doc Review Agents (6)
| Agent                     | Specialty              |
|---------------------------|------------------------|
| coherence-reviewer        | Internal consistency   |
| design-lens-reviewer      | Missing decisions      |
| feasibility-reviewer      | Real-world viability   |
| product-lens-reviewer     | Strategic alignment    |
| scope-guardian-reviewer   | Scope creep            |
| security-lens-reviewer    | Security gaps          |

#### Design Agents (3)
| Agent                            | Specialty              |
|----------------------------------|------------------------|
| design-implementation-reviewer   | Figma parity           |
| design-iterator                  | Iterative refinement   |
| figma-design-sync                | Figma sync             |

#### Research Agents (5)
| Agent                        | Specialty            |
|------------------------------|----------------------|
| best-practices-researcher    | External standards   |
| framework-docs-researcher    | Official docs        |
| git-history-analyzer         | Code archaeology     |
| issue-intelligence-analyst   | Issue patterns       |
| learnings-researcher         | Past solutions       |

### Skills SDD (Spec-Driven Development)
| Skill         | Path                                    | Ciclo       |
|---------------|-----------------------------------------|-------------|
| sdd-explore   | `01_Agent_Teams_Lite/03_Sdd_Explore/`   | Explore     |
| sdd-propose   | `04_Sdd_Propose/`                       | Propose     |
| sdd-spec      | `05_Sdd_Spec/`                          | Spec        |
| sdd-design    | `06_Sdd_Design/`                        | Design      |
| sdd-tasks     | `07_Sdd_Tasks/`                         | Tasks       |
| sdd-apply     | `08_Sdd_Apply/`                         | Implement   |
| sdd-verify    | `09_Sdd_Verify/`                        | Verify      |
| sdd-archive   | `10_Sdd_Archive/`                       | Archive     |

### Workflows Compound
| Workflow            | File                           | Función              |
|---------------------|--------------------------------|----------------------|
| Iron Man Gen        | `01_Iron_Man_Gen.md`           | Project bootstrap    |
| Spider Brainstorm   | `02_Spider_Brainstorm.md`      | Ideation             |
| Professor X Plan    | `03_Professor_X_Plan.md`       | Planning             |
| Vision Review       | `04_Vision_Review.md`          | Strategy review      |
| Thor Work           | `05_Thor_Work.md`              | Implementation       |
| Hulk Compound       | `06_Hulk_Compound.md`          | Compounding          |
| Doc Strange LFG     | `08_Doc_Strange_Lfg.md`        | Autonomous           |
| AntMan LFG Lite     | `07_AntMan_Lfg_Lite.md`        | Lite autonomous      |
| Avengers Workflow   | `73_Avengers_Workflow_v3.py`   | Full orchestration   |
| Ship It             | `17_Ship_It.md`                | Shipping             |
| Deep Work Session   | `16_Deep_Work_Session.md`      | Focus                |
| Anthropic Harness   | `18_Anthropic_Harness.md`      | Eval harness         |

### Conexiones
- **Usa** → Personal OS Rules para estándares
- **Usa** → Gentleman go-testing para tests
- **Invoca** → Hillary para task capture
- **Alimentado por** → Sistema Recursivo para learnings
- **Expande** → gentle-ai base skills

---

## 4. HILLARY — Task Management + Life OS

### Definición
Sistema de captura, clasificación y procesamiento de tareas con inbox y templates.

### Base (Origen)
```
01_Personal_Os/05_Archive/07_Repos_Gentleman/gentle-ai/ (backlog-triage skill)
01_Personal_Os/05_Archive/10_Legacy_Revisar/03_Backup_Workflows/25_Hillary_Life_OS.md
```

### Arquitectura en PersonalOS
```
01_Personal_Os/03_Task/
├── README.md                    ← Sistema Hillary
├── 00_Templates/                 ← 6 templates
│   ├── 00_Task_Template_Skeleton.md
│   ├── 01_ai_task_template.md
│   ├── 02_Process_Note_Template.md
│   ├── 03_Task_Template_SOTA.md
│   ├── 04_Task_Template_Medio.md
│   ├── 05_Task_Template_Corto.md
│   └── 06_Routine_Master.md
├── 01_Tasks_Done/               ← Completadas
├── 02_Hillary_Inbox/            ← Inbox activo
│   └── 00_TEST_Captura_Hillary.md
└── [P0-P2 task files]           ← Prioridad
```

### Templates Disponibles
| Template     | Uso                  | Cuándo                        |
|--------------|----------------------|-------------------------------|
| SOTA         | Problema complejo    | +3 días, múltiples técnicas   |
| Medio        | Feature normal       | 1-3 días                      |
| Corto        | Quick fix            | <1 día                        |
| Routine      | Proceso repetitivo   | Daily/weekly                  |
| Skeleton     | Blank start          | Cualquiera                    |

### Skills Hillary
| Skill                | Path                                                                                                                 | Función              |
|----------------------|----------------------------------------------------------------------------------------------------------------------|----------------------|
| Task Classifier      | `01_Personal_Os/01_Core/02_Tools/02_Skills/05_Workflows/01_Agent_Teams_Lite/01_Agent_Teams_Lite/10_Classify_Task/`   | Clasifica incoming   |
| Backlog Processing   | `01_Personal_Os/01_Core/00_Workflows_Os/01_Personal_Os/02_Backlog_Processing.md`                                     | Process inbox        |

### Workflows Hillary
| Workflow             | File                         | Función            |
|----------------------|------------------------------|--------------------|
| Morning Standup      | `01_Morning_Standup.md`      | Daily review       |
| Backlog Processing   | `02_Backlog_Processing.md`   | Inbox → Done       |
| Hillary Life OS      | `25_Hillary_Life_OS.md`      | Life integration   |
| Captura Rapida       | `15_Captura_Rapida.md`       | Quick capture      |
| Classify Task        | `10_Classify_Task.md`        | Auto-classify      |

### Conexiones
- **Usa** → Personal OS Rules para context
- **Alimenta** → Sistema Recursivo (issues detectados)
- **Invocado por** → Compound Engineering (tasks)
- **Resuelve** → Task templates para workflow

---

## 5. SISTEMA RECURSIVO DE AUTO-MEJORAMIENTO

### Definición
Motor de mejora recursiva que ejecuta ciclos Detect → Analyze → Execute → Learn para auto-mejorar el OS.

### Base (Origen)
```
01_Personal_Os/04_Operations/01_Auto_Improvement/
```

### Arquitectura Completa
```
01_Personal_Os/04_Operations/01_Auto_Improvement/01_Auto_Improvement/
├── 01_Engine/
│   ├── detector.py         ← Detecta issues
│   ├── analyzer.py         ← Prioriza
│   ├── executor.py         ← Aplica fixes
│   ├── learner.py          ← Aprende
│   └── recursive_improvement_engine.py  ← Orchestrator
├── 02_Rules/
│   └── rules_engine.py     ← Reglas de validación
├── 03_Metrics/
│   └── metrics_tracker.py  ← Tracking
├── 04_Triggers/
│   ├── manual_trigger.py    ← On-demand
│   └── cron_trigger.py      ← Scheduled
└── 99_Utils/                ← Helpers
    ├── fix_all_paths.py
    ├── fix_broken_imports.py
    └── [12+ utilities]
```

### Ciclo Recursivo
```
    ┌─────────────────────────────────────────┐
    │                                         │
    ▼                                         │
┌─────────┐    ┌─────────┐    ┌─────────┐    │
│ DETECT  │───▶│ ANALYZE │───▶│ EXECUTE │    │
└─────────┘    └─────────┘    └─────────┘    │
     │              │              │        │
     │              │              ▼        │
     │              │         ┌─────────┐    │
     │              │         │  LEARN  │────┘
     │              │         └─────────┘
     │              │              │
     └──────────────┴──────────────┘
           (hasta max_iterations)
```

### Componentes

#### Detector
- Detecta imports rotos
- Detecta paths incorrectos
- Detecta archivos faltantes
- Detecta skills sin usar

#### Analyzer
- Prioriza por impacto
- Calcula esfuerzo
- Detecta dependecias

#### Executor
- Aplica fixes auto-fixables
- dry_run por defecto
- Log de cambios

#### Learner
- Aprende de errores
- Actualiza patterns
- Persiste learnings

### Workflows Auto-Improve
| Workflow              | File                                         | Función      |
|-----------------------|----------------------------------------------|--------------|
| System Health Audit   | `01_Personal_Os/07_System_Health_Audit.md`   | Full audit   |
| Manual Trigger        | `04_Triggers/manual_trigger.py`              | On-demand    |
| Cron Trigger          | `04_Triggers/cron_trigger.py`                | Scheduled    |

### Conexiones
- **Lee** → Todos los componentes del OS
- **Escribe** → Updates a skills/agents/workflows
- **Alimenta** → Learning Always
- **Invocado por** → Personal OS Health Audit
- **Detecta** → Issues para Hillary

---

## 6. LEARNING ALWAYS — Persistencia + Memorias

### Definición
Sistema de persistencia de aprendizajes y memoria que sobrevive entre sesiones.

### Base (Origen)
```
01_Personal_Os/05_Archive/07_Repos_Gentleman/gentle-ai/ (memory protocols)
01_Personal_Os/05_Archive/07_Repos_Gentleman/engram/ (memory skills)
```

### Skills Learning
| Skill                    | Path                                                                             | Función                   |
|--------------------------|----------------------------------------------------------------------------------|---------------------------|
| learnings-researcher     | `00_Compound_Engineering/04_Agents_Research/`                                    | Busca en docs/solutions   |
| engram-memory-protocol   | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/07_Skills/`   | Engram protocol           |
| Auto-Learn Hub           | `03_Scripts_Os/11_Auto_Learn_Hub.py`                                             | Orchestrator              |

### Componentes Engram (Integrados)
```
01_Personal_Os/01_Core/02_Tools/07_Server/Engram/
├── skills/                        ← Engram skills
│   ├── memory-protocol/          ← Save/Context/Search
│   ├── architecture-guardrails/
│   ├── business-rules/
│   ├── cultural-norms/
│   ├── dashboard-htmx/
│   ├── docs-alignment/
│   ├── plugin-thin/
│   ├── project-structure/
│   ├── pr-review-deep/
│   ├── server-api/
│   ├── testing-coverage/
│   ├── tui-quality/
│   └── visual-language/
└── [engram server files]
```

### Workflows Learning
| Workflow              | File                                   | Función           |
|-----------------------|----------------------------------------|-------------------|
| Weekly Review         | `01_Personal_Os/04_Weekly_Review.md`   | Learn from week   |
| System Health Audit   | `07_System_Health_Audit.md`            | Full learning     |
| Context Recovery      | `08_Context_Recovery.md`               | Recover context   |

### Protocolo Learning
1. **Save** → Cada decisión/fix se guarda en memory
2. **Context** → Al inicio de sesión, recupera context
3. **Search** → Busca learnings pasados para problemas similares
4. **Compound** → Los learnings se usan en próximos cycles

### Conexiones
- **Lee** → Sistema Recursivo (learnings)
- **Lee** → Compound Engineering (patterns)
- **Escribe** → docs/solutions/ (learned patterns)
- **Usa** → Hillary para persistir tareas
- **Alimenta** → Todos los agents

---

## CONEXIONES ENTRE METODOLOGÍAS

### Mapa de Dependencias

```
                    ┌───────────────────────────────────────┐
                    │           PERSONAL OS (Root)           │
                    │                                       │
                    │  • Orquestador principal              │
                    │  • Lee rules y hooks                  │
                    │  • Invoca todas las demás             │
                    └───────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
    ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
    │   GENTLEMAN   │         │   COMPOUND    │         │    HILLARY    │
    │               │         │  ENGINEERING  │         │               │
    │ • Installer   │◀────────│ • Agents      │────────▶│ • Task Mgmt   │
    │ • Bubbletea   │         │ • SDD         │         │ • Inbox       │
    │ • E2E         │         │ • Reviews     │         │ • Templates   │
    └───────────────┘         └───────────────┘         └───────────────┘
            │                         │                         │
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │    SISTEMA RECURSIVO       │
                        │                           │
                        │  • Detect → Analyze       │
                        │  • Execute → Learn        │
                        │  • Cycles until stable    │
                        └───────────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │     LEARNING ALWAYS        │
                        │                           │
                        │  • Persiste learnings     │
                        │  • Context recovery       │
                        │  • Pattern recognition    │
                        └───────────────────────────┘
```

### Flujo de Invocación Típico

```
1. USER INPUT
       │
       ▼
2. HILLARY (Captura)
       │ Clasifica y guarda en inbox
       ▼
3. PERSONAL OS (Clasifica)
       │ Usa rules para context
       ▼
4. COMPOUND ENGINEERING (Si feature/fix)
       │ SDD workflow → Agents → Reviews
       ▼
5. SISTEMA RECURSIVO (Post-implementación)
       │ Detecta issues → Analyze → Execute
       ▼
6. LEARNING ALWAYS (Persiste)
       │ Guarda decision → Pattern → Learn
       ▼
7. GENTLEMAN (Si installer/config)
       │ Bubbletea TUI → E2E tests
       ▼
8. PERSONAL OS (Cierre)
       │ Health check → Fin
```

---

## INVENTARIO COMPLETO DE SKILLS

### Por Área (01_Personal_Os/01_Core/02_Tools/02_Skills/)

| Área                      | Count     | Skills                         |
|---------------------------|-----------|--------------------------------|
| 00_Compound_Engineering   | 1         | Main skill                     |
| 01_Creacion_Contenidos    | 7         | SEO, Marketing, Video, Image   |
| 02_Diseno_Ui_Ux           | 3         | Taste, Design, Excalidraw      |
| 03_Video_Media            | 1         | James Cameron                  |
| 04_Automatizacion         | 4         | N8N, GWS                       |
| 05_Workflows              | 2         | Agent Teams, PM, Product       |
| 06_Tools                  | 1         | MCP Client                     |
| 07_Personal_Os            | 1         | Life OS                        |
| 08_Invictus_Web           | 1         | Superpowers                    |
| 09_Legacy_Archive         | 0         |--------------------------------|

### Por Metodología

| Metodología            | Skills     | Ubicación                                    |
|------------------------|------------|----------------------------------------------|
| Personal OS Core       | 6          | 01_Core/02_Tools/02_Skills/*                 |
| Compound Engineering   | 35+        | 00_Compound_Engineering/*_Agents_*           |
| SDD Workflow           | 14         | 05_Workflows/01_Agent_Teams_Lite/*           |
| Hillary                | 2          | 05_Workflows, 03_Task                        |
| Gentleman              | 6          | Archive + 02_Skills/*gentleman*              |
| Learning               | 2          | 00_Compound_Engineering/04_Agents_Research   |

---

## ESTADO DE INTEGRACIÓN

### ✅ OPERATIVO — 100%

| Componente             | Status     | Verificación               |
|------------------------|------------|----------------------------|
| Skills (100+)          | ✅          | Todas con SKILL.md         |
| Agents (35+)           | ✅          | Todos documentados         |
| Workflows (20+)        | ✅          | Todos en 00_Workflows_Os   |
| Compound Engineering   | ✅          | 6 sub-árboles activos      |
| Gentleman              | ✅          | 6 skills integradas        |
| Hillary                | ✅          | 6 templates + inbox        |
| Sistema Recursivo      | ✅          | 4 engines + triggers       |
| Learning Always        | ✅          | Engram + protocols         |

---

## ARCHIVOS CLAVE DE REFERENCIA

| Archivo                                                                              | Contenido                     |
|--------------------------------------------------------------------------------------|-------------------------------|
| `00_Winter_is_Coming/AGENTS.md`                                                      | Sistema operativo principal   |
| `01_Personal_Os/01_Core/01_Rules/*.mdc`                                              | 10 rules de calidad           |
| `01_Personal_Os/04_Operations/01_Auto_Improvement/recursive_improvement_engine.py`   | Motor recursivo               |
| `01_Personal_Os/03_Task/README.md`                                                   | Sistema Hillary               |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/SKILL.md`         | Compound main                 |
| `01_Personal_Os/05_Archive/07_Repos_Gentleman/`                                      | Bases originales              |

---

*Generated by PersonalOS v2.0 Consequences*
*Last updated: 2026-04-24*
