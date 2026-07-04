---
name: genesis
description: Workflow de inicio de sesión — carga reglas, memoria, notas de proceso y estado del PersonalOS v5.0.1.
argument-hint: "[opcional: tarea específica del día o contexto a priorizar]"
---

# 🧬 Workflow: Génesis (Iron Man Boot) — v5.0.1

> **Versión del sistema:** v5.0.1 — Path audit: 04_Tasks → 04_Tasks
> **Fecha:** 2026-07-03
> **Estado:** 🟢 PURE GREEN

Ejecutar al inicio de CADA sesión. Sin contexto completo NO hay respuesta.

---

## 📋 PRERREQUISITOS — Lectura Obligatoria

Antes de responder, leer en este orden:

### 1. Reglas de Sesión
   - Leer `01_Personal_Os/00_Core/01_Rules/` — cualquier regla con `alwaysApply: true`
   - Especial atención a: `00_Core_Protocol.mdc`, `06_Contexto_Gestion.mdc`, `09_Agent_Teams_Protocol.mdc`

### 2. Memoria Persistente (Engram)
   - Ejecutar: `engram_mem_context(project="Think_Different", limit=10)`
   - Si hay `session_summary` previo, cargarlo
   - Buscar session activa: `mem_search(query: "sdd-init/{project}")`

### 3. Estado Estratégico
   - Leer `00_Winter_is_Coming/GOALS.md` — Metas y prioridades
   - Leer `00_Winter_is_Coming/BACKLOG.md` — Bandeja de entrada
   - Leer `01_Personal_Os/01_Memory/00_Context_LLM/01_Process_Notes/` — notas de proceso recientes
   - Leer `OS_DIRECTORY.md` (raíz) — Mapa JARVIS del sistema

### 4. Estado de Tareas
   - Leer `01_Personal_Os/04_Tasks/` — identificar tareas `status: s` (en progreso) y `status: b` (bloqueadas)
   - Buscar SDDs activos en `.atl/openspec/`

### 5. Archivos Raíz de Config
   - `CLAUDE.md` — Config de IA
   - `AGENTS.md` — GGA Pre-Commit entry (root)

---

## 🚀 MAPA DEL SISTEMA (v5.0.1)

```
Think_Different/
├── 00_Winter_is_Coming/          # ESTRATÉGICO: Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/               # SISTEMA OPERATIVO (FUENTE DE VERDAD)
│   ├── 00_Core/                  # MOTOR DEL OS
│   │   ├── 00_Workflows/     # 29 workflows (7 categorías)
│   │   ├── 01_Rules/            # 14 reglas .mdc (00-13)
│   │   └── 02_Tools/
│   │       ├── 00_SDD/          # SDD Registry
│   │       ├── 01_Agents/       # 63 agentes (9 categorías)
│   │       ├── 02_Skills/       # 396 skills (15 áreas)
│   │       ├── 03_Mcp/          # Backup MCPs
│   │       ├── 04_Integrations/ # Fireflies, Granola
│   │       ├── 05_Hooks/        # Hooks del sistema
│   │       ├── 06_Plugins/      # Plugins OS
│   │       ├── 07_Server/       # MCP Server
│   │       ├── 08_Evals/        # Evaluadores
│   │       └── 09_Templates/    # Templates
│   ├── 01_Memory/               # Memoria LLM (Context_Memory, Process_Notes)
│   ├── 02_Knowledge/            # Base de conocimiento
│   ├── 03_Learning/             # Conocimiento activo
│   ├── 04_Tasks/                # Tareas activas (18+ tareas P0-P3)
│   ├── 05_Scripts/              # Scripts operativos
│   │   ├── 00_HUBs/03_Scripts_Os/ # 36 HUBs — 168 scripts
│   │   └── 01_Installer/        # Scripts de instalación
│   ├── 06_Projects/             # Proyectos activos
│   └── 07_Archive/              # Backups, snapshots, históricos
├── 02_Playground/               # Zona de pruebas
├── 03_Resultado/                # Outputs de proyectos
├── .agent/                      # Backup estratégico (sync con 00_Core/)
├── .atl/                        # SDD Registry + openspec/
├── .claude/                     # Config Claude Code + rules
├── .mcp.json                    # 11 MCPs activos
├── AGENTS.md                    # GGA Pre-Commit entry
├── CLAUDE.md                    # Config IAs (FUENTE)
└── README.md                    # Documentación principal
```

---

## ⚡ RECURSOS DEL ORQUESTADOR

| Recurso                        | Ubicación                                                                 | Para qué usarlo                           |
|-------------------------------|--------------------------------------------------------------------------|------------------------------------------|
| **Skills** (396, 15 áreas)     | `01_Personal_Os/00_Core/02_Tools/02_Skills/`                              | Descubrir capabilities antes de delegar   |
| **Reglas** (14 .mdc)           | `01_Personal_Os/00_Core/01_Rules/`                                        | Governance y comportamiento del sistema   |
| **Agentes** (63 source)        | `01_Personal_Os/00_Core/02_Tools/01_Agents/`                              | Delegar tareas a especialistas            |
| **HUBs** (36)                  | `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/`                        | Operaciones de sistema                    |
| **MCPs** (11)                  | `.mcp.json` (raíz)                                                        | Herramientas externas                     |
| **Hooks** (10)                 | `01_Personal_Os/00_Core/02_Tools/05_Hooks/`                               | Automatizaciones pre/post tool            |
| **Memory**                     | Engram MCP + `01_Personal_Os/01_Memory/`                                  | Contexto persistente entre sesiones       |
| **GGA Code Review**            | `.agent/05_GGA/`                                                          | Code review automático                    |
| **SDD Registry**               | `.atl/skill-registry.md`                                                  | Compact rules para sub-agentes            |

---

## 🔧 HUBs CANÓNICOS — Comandos Rápidos

```bash
# Regenerar 7 manifests JARVIS
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# Health check del sistema
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/17_Watchdog_Hub.py

# Dashboard de métricas ASCII
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/18_Telemetry_Hub.py --dashboard

# Detectar drift MCP Claude ↔ OpenCode
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/15_MCP_Sync_Hub.py --report

# Sync .agent ↔ 01_Core
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/19_Agent_Sync_Hub.py
```

---

## 💾 PROTOCOLO DE MEMORIA (Engram)

- **Buscar memoria** al inicio: `engram_mem_context(project="Think_Different")`
- **Guardar** decisiones, bugs, discoveries: `mem_save` con `project: "Think_Different"`
- **Cierre de sesión**: `mem_session_summary()` con formato Goal/Instructions/Discoveries/Accomplished/Files

---

## 🎯 WORKFLOWS DISPONIBLES (7 categorías)

| Categoría               | Path                             | Workflows principales                                                     |
|------------------------|---------------------------------|--------------------------------------------------------------------------|
| **Learning Always**     | `00_Learning_Always/`            | Continuous learning module                                                |
| **Personal OS**         | `01_Personal_Os/`                | Morning, Backlog, Content, Weekly, Rituales                               |
| **Marvel**              | `02_Marvel/`                     | Iron Man Gen, Spider, Professor X, Vision, Thor, Hulk, AntMan, Doc Strange|
| **Gentleman**           | `03_Gentleman/`                  | Frontend Premium, Redacción de Docs                                       |
| **Hillary**             | `04_Hillary/`                    | Captura Rápida, Hillary Life OS                                           |
| **Compound Engineering**| `05_Compound_Engineering/`       | Deep Work, Ship It, Harness, Multi-Agent                                  |
| **YouTube Full Video**  | `06_Youtube_Full_Video/`         | Pipeline de producción de video                                           |

---

## 🔔 NOTIFICACIONES DE SONIDO

```bash
# Al completar cada tarea en TodoWrite
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/00_Sound_Engine.py --task-complete

# Logro importante
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/00_Sound_Engine.py --success

# Error
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/00_Sound_Engine.py --error
```

---

## 📊 REPORTE OBLIGATORIO CADA 15% DE AVANCE

```
📊 **Progreso: X%**
✅ **Qué hice:** [tarea completada]
🔄 **Qué estoy haciendo:** [tarea actual en curso]
➡️ **Próximo paso:** [siguiente tarea]
📋 **Pendientes:**
  - [ ] Tarea A
  - [ ] Tarea B
⏱️ **Tiempo estimado para terminar:** ~X minutos
```

---

## 🧠 SDD (Spec-Driven Development) — Comandos

| Comando        | Fase                                                       | Propósito                         |
|---------------|-----------------------------------------------------------|----------------------------------|
| `/sdd-new`     | proposal → spec → design → tasks → apply → verify → archive| Cambio completo                   |
| `/sdd-explore` | Investigación                                              | Explorar código/ideas             |
| `/sdd-apply`   | Implementación                                             | Codificar según specs             |
| `/sdd-verify`  | Validación                                                 | Tests vs specs                    |

---

## 🔄 COMPOUND ENGINEERING — Comandos

| Comando         | Propósito                           |
|----------------|------------------------------------|
| `/ce:ideate`    | Descubrir mejoras de alto impacto   |
| `/ce:brainstorm`| Explorar requisitos                 |
| `/ce:plan`      | Plan de implementación detallado    |
| `/ce:work`      | Ejecutar con calidad                |
| `/ce:review`    | Code review multi-agente            |
| `/ce:compound`  | Documentar aprendizajes             |

---

## ✅ CHECKLIST DE INICIO DE SESIÓN

- [ ] `engram_mem_context()` — memoria reciente
- [ ] `00_Winter_is_Coming/GOALS.md` — metas activas
- [ ] `00_Winter_is_Coming/BACKLOG.md` — items pendientes
- [ ] `01_Personal_Os/00_Core/01_Rules/` — reglas activas
- [ ] `01_Personal_Os/04_Tasks/` — tareas en progreso/bloqueadas
- [ ] `.atl/skill-registry.md` — compact rules (si hay SDD)
- [ ] Reportar resumen al chat antes de actuar

---

*Think Different PersonalOS v4.9.1 — Marketing SOTA + Archive Consolidation*
*Actualizado: 2026-06-27 | 396 skills | 71 agents | 11 MCPs | 30 HUBs | 14 rules*
