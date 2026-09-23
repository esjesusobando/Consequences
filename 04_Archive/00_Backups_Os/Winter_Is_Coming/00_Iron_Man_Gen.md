- --
name: genesis
description: Workflow de inicio de sesión — carga reglas, memoria, notas de proceso y estado del PersonalOS v1.0.0-consequences.
argument-hint: "[opcional: tarea específica del día o contexto a priorizar]"
- --

# 🧬 Workflow: Génesis (Iron Man Boot) — v1.0.0-consequences

> **Versión del sistema:** v1.0.0-consequences — Production Release
> **Fecha:** 2026-09-15
> **Estado:** 🟢 PURE GREEN — v1.0.0 Production Release
> **Mantenimiento:** 2026-09-15 — Auditoría de rutas y conteos contra manifests SSOT (00_Manifest/) — ver 44_NP_Revision_Iron_Man_Gen_2026-09-15 + CTX_2026_09_15_Revision_Iron_Man_Gen

Ejecutar al inicio de CADA sesión. Sin contexto completo NO hay respuesta.

> **📐 Conteos canónicos:** la única fuente de verdad de métricas son los manifests JARVIS
> (`01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/` — 8 archivos 01-08).
> Se regeneran con `python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan`.
> Los números de este archivo son informativos: ante discrepancia, manda el manifest.

- --

## 📋 PRERREQUISITOS — Lectura Obligatoria

Antes de responder, leer en este orden:

### 1. Reglas de Sesión

   - Leer `01_Personal_Os/01_Core/01_Rules/` — cualquier regla con `alwaysApply: true`
   - Especial atención a: `00_Core_Protocol.mdc`, `06_Contexto_Gestion.mdc`, `09_Agent_Teams_Protocol.mdc`, `15_Second_Brain_Bridge.mdc`
   - Índice: `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md`

### 2. Memoria Persistente (Engram)

   - Ejecutar: `engram_mem_context(project="Think_Different", limit=10)`
   - Si hay `session_summary` previo, cargarlo
   - Buscar session activa: `mem_search(query: "sdd-init/{project}")`
   - Proyecto Engram registrado: `Think_Different` (históricamente también `think_different`, `think_different_ai`)

### 3. Estado Estratégico

   - Leer `00_Winter_is_Coming/GOALS.md` — Metas y prioridades
   - Leer `00_Winter_is_Coming/BACKLOG.md` — Bandeja de entrada
   - Leer `00_Winter_is_Coming/CHANGELOG.md` — Historial de cambios
   - Leer `00_Winter_is_Coming/README.md` — Entry point del directorio estratégico
   - Leer `00_Winter_is_Coming/AGENTS.md` — Reglas del sistema (copy de root)
   - Leer `01_Personal_Os/04_Operations/00_Context_LLM/01_Process_Notes/` — notas de proceso recientes
     (formato `NN_NP_Descripcion.md`; índice en `README.md`; la última es `44_NP_Revision_Iron_Man_Gen_2026-09-15.md`)
   - Leer `01_Personal_Os/04_Operations/00_Context_LLM/00_Context_Memory/` — contexto de sesiones archivadas
     (formato `CTX_AAAAMM_DD_Descripcion.md`)
   - Leer `OS_DIRECTORY.md` (raíz) — Mapa JARVIS del sistema

### 4. 00_Complemento_Leer (OBLIGATORIO)

   - Leer `00_Winter_is_Coming/00_Complemento_Leer/` — copias release de solo lectura:
     - `CLAUDE.md` — Context harness completo
     - `OS_DIRECTORY.md` — Inventario del sistema
     - `01_Inventario_Total.md` — Conteos críticos verificados
     - `ARCHIVE_MANIFEST.md` — Qué hay en archive
     - `COMPLETION_SUMMARY.md` — Última sesión de completación
     - `ROLLBACK_CONTROL.md` — Puntos de control y rollback

### 5. Estado de Tareas

   - Leer `01_Personal_Os/03_Task/` — identificar tareas `status: s` (en progreso) y `status: b` (bloqueadas)
   - Buscar SDDs activos en `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/`
     (subcarpetas: `00_Manifest/` — SSOT de manifests, `01_Agent_Teams_Lite/`, `03_Pattern_Engine/`)

### 6. Archivos Raíz de Config

   - `CLAUDE.md` — Config de IA (puntero raíz; la versión completa está en `00_Winter_is_Coming/00_Complemento_Leer/CLAUDE.md`)
   - `AGENTS.md` — GGA Pre-Commit entry (root)
   - `.agent/CLAUDE.md` — copia backup del contexto IA (sync unidireccional source → backup)

### 7. Segundo Cerebro (Consequences vault) — No bloqueante

    - Leer `02_Process/02_Schema/CLAUDE.md` del vault (schema del wiki)
    - Leer `02_Process/01_LLM_Wiki/index.md` del wiki (catálogo de contenido)
    - **Si el vault no existe:** advertir y continuar — el OS funciona sin vault
    - **Fuente de verdad:** `C:\Users\sebas\Desktop\Now_Invictus\00_Consequences\Consequences`

### 8. Documentación Periódica — OBLIGATORIA CADA 30 MIN

> **REGLA DE ORO:** Cada 30 minutos de trabajo activo, documentar el avance en **4 ubicaciones** (3 sitios locales + 1 vault):

| #  | Ubicación                                                                                | Formato                              | Qué guardar                                                                  |
|---|-----------------------------------------------------------------------------------------|-------------------------------------|-----------------------------------------------------------------------------|
| 1  | `01_Personal_Os/04_Operations/00_Context_LLM/00_Context_Memory/CTX_YYYY_MM_DD_Session.md`| Resumen de contexto                  | Qué se hizo, decisiones, blockers, próximo paso                              |
| 2  | `01_Personal_Os/04_Operations/00_Context_LLM/01_Process_Notes/NN_NP_Title_YYYY_MM_DD.md` | Proceso detallado (número secuencial)| Análisis técnico, investigación, descubrimientos, learnings                  |
| 3  | **Engram**                                                                               | `mem_save` + `mem_session_summary`   | Memoria persistente cross-sesión (decisiones, bugs, patterns)                |
| 4  | **Obsidian Vault Consequences**                                                          | `04_Daily/{YYYY-MM}/{YYYY-MM-DD}.md` | Nota diaria observable para humano (formato template `05_Templates/daily.md`)|

**Protocolo Documentar 3 + Vault:**
1. Ejecutar `python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py --notify "Progreso: X%"` (cada 15%)
2. Crear/actualizar CTX + NP + Engram + Daily Note en paralelo
3. **NUNCA** escribir en archivos sueltos `Context_Memory.md` o `Notas_de_Proceso.md` de la raíz

- Sonido obligatorio cada 15%: `--task-complete` al completar tarea, `--notify "Progreso: X%"` en hitos

---

## 🚀 MAPA DEL SISTEMA (v1.0.0-consequences)

```
Think_Different/
├── 00_Winter_is_Coming/          # ESTRATÉGICO: Goals, Backlog, AGENTS.md, CHANGELOG, boot Genesis, release copies

│   └── 00_Complemento_Leer/      # Copias release SOLO LECTURA (CLAUDE.md completo, OS_DIRECTORY, Inventario, Rollback)

├── 01_Personal_Os/               # SISTEMA OPERATIVO (FUENTE DE VERDAD)

│   ├── 01_Core/                  # MOTOR DEL OS

│   │   ├── 00_Workflows_Os/     # 30 Workflows (Personal, Marvel, Gentleman, Hillary, CE)

│   │   ├── 01_Rules/            # 44 reglas (.mdc) — fuente de verdad

│   │   └── 02_Tools/
│   │       ├── 01_Agents/       # 99 agentes (34 Root + 6 Dream + 24 Specialists + 6 Growth + 6 Other + 9 Conductor + 14 Teams_Lite)

│   │       ├── 02_Skills/       # 425 SKILL.md (17 áreas funcionales)

│   │       ├── 03_Mcp/          # Backup MCPs (8 root + 38 backup; config por runtime)

│   │       ├── 04_Integrations/ # Fireflies, Granola

│   │       ├── 05_Hooks/        # 13 hooks (6 fases)

│   │       ├── 06_Plugins/      # Plugins OS

│   │       ├── 07_Server/       # Engram server + mcp + AIPM

│   │       ├── 08_Evals/        # Evaluadores

│   │       └── 09_Templates/    # Templates

│   ├── 02_Knowledge/            # Base de conocimiento

│   ├── 02_Playground/           # Zona de pruebas interna (OS)

│   ├── 03_Task/                 # Tareas activas

│   ├── 04_Operations/           # MOTOR OPERATIVO

│   │       ├── 00_Context_LLM/  # Memoria LLM (Context_Memory CTX_*, Process_Notes NP_*, Knowledge/Memory Brain)

│   │       ├── 01_Auto_Improvement/ # Motor de auto-mejora recursiva

│   │       ├── 02_Agent_Teams_Lite/ # SDD + 8 Manifests JARVIS (00_Manifest/) + 03_Pattern_Engine

│   │       ├── 03_Scripts_Os/   # 178 scripts total

│   │       ├── 04_Installer/    # Scripts de instalación

│   │       ├── 05_Projects/     # Proyectos activos

│   │       ├── 06_SOTA_Features/ # Features SOTA

│   │       └── 07_Reports/      # Reportes consolidados

│   ├── 05_Archive/              # Archivo consolidado (incl. 08_Skills_Legacy_Consolidado)

│   └── 06_Projects/             # Projects Lab (side projects)

├── 02_Playground/               # Zona de pruebas raíz

├── 03_Resultado/                # Outputs de proyectos

├── 05_Archive/                  # Archivo raíz consolidado (fusionado desde 07_Archive)

├── .agent/                      # Backup estratégico (sync con 01_Core/)

├── .atl/                        # SDD Registry (skill-registry.md) + openspec/

├── .claude/                     # Config Claude Code + rules

├── .gga/                        # Config GGA Pre-Commit

├── .opencode/                   # Config OpenCode

├── .mcp.json                    # 31 MCPs activos

├── openspec/                    # Specs SDD root (changes/, specs/)

├── AGENTS.md                    # GGA Pre-Commit entry

├── CLAUDE.md                    # Config IAs (puntero raíz → 00_Complemento_Leer/CLAUDE.md)

├── OS_DIRECTORY.md              # Directorio JARVIS (raíz)

├── PLAN_CenturionS.md           # Plan CenturionS (9 divisiones)

├── README.md                    # Documentación principal

└── Structure_v1.0.0.md          # Estructura v1.0.0

Consequences vault (SEGUNDO CEREBRO — externo):
└── C:\Users\sebas\Desktop\Now_Invictus\00_Consequences\Consequences
    ├── 01_Capture/              # Lo que entra (raw, inbox, attachments)

    ├── 02_Process/              # Lo que el LLM organiza (02_Schema/CLAUDE.md + 01_LLM_Wiki/)

    ├── 03_Reference/            # Lo ya organizado (knowledge, research, archive)

    ├── 04_Daily/                # Notas diarias + hub

    ├── 05_Templates/            # Plantillas (daily.md, index.md)

    ├── 06_Excalidraw/           # Diagramas Excalidraw

    ├── 07_Platzi/               # Notas Platzi

    └── (adicionales: Daily/, Sistemas/, Skills/, Notes.md, Oband_Os.base, README.md)
```

- --

## ⚡ RECURSOS DEL ORQUESTADOR

| Recurso                           | Ubicación                                                                                                  | Para qué usarlo                                                        |
|----------------------------------|-----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| **Skills** (17 áreas, 425)        | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                                                               | Descubrir capabilities antes de delegar                                |
| **Reglas** (44)                   | `01_Personal_Os/01_Core/01_Rules/`                                                                         | Governance y comportamiento del sistema                                |
| **Agentes** (79)                  | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                                                               | Delegar tareas a especialistas                                         |
| **HUBs** (178 scripts)            | `01_Personal_Os/04_Operations/03_Scripts_Os/`                                                              | Operaciones de sistema                                                 |
| **MCPs** (31)                     | `.mcp.json` (raíz) + `01_Personal_Os/01_Core/02_Tools/03_Mcp/` (backup)                                    | Herramientas externas (detalle en `02_MCP_Registry.yaml`)              |
| **Hooks** (13)                    | `01_Personal_Os/01_Core/02_Tools/05_Hooks/`                                                                | Automatizaciones pre/post tool                                         |
| **Memory**                        | Engram MCP                                                                                                 | Contexto persistente entre sesiones                                    |
| **GGA Code Review**               | `.agent/05_GGA/`                                                                                           | Code review automático (Pre-Commit)                                    |
| **SDD Registry**                  | `.atl/skill-registry.md`                                                                                   | Compact rules para sub-agentes                                         |
| **Manifests SSOT (8)**            | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`                                            | Conteos canónicos (01-08; regenerar con 20_System_Mapper_Hub.py --scan)|
| **Second Brain**                  | consequences vault + mcp-obsidian                                                                          | Conocimiento durable (wiki, research, daily notes)                     |
| **CenturionS**                    | 9 divisiones operacionales (Design, Marketing, Sales, Finance, Engineering, Product, Recruiting, HR, Legal)| Equipo agente divisional                                               |

- --

## 🔧 HUBs CANÓNICOS — Comandos Rápidos

```bash
# Regenerar 8 manifests JARVIS (SSOT de conteos)

python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# Health check del sistema

python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py

# Dashboard de métricas ASCII

python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard

# Detectar drift MCP Claude ↔ OpenCode

python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report

# Sync .agent ↔ 01_Core

python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py
```

- --

## 💾 PROTOCOLO DE MEMORIA (Engram)

- **Buscar memoria** al inicio: `engram_mem_context(project="Think_Different")`
- **Guardar** decisiones, bugs, discoveries: `mem_save` con `project: "Think_Different"`
- **Cierre de sesión**: `mem_session_summary()` con formato Goal/Instructions/Discoveries/Accomplished/Files
- **Documentación dual en disco**: Notas de Proceso (`01_Process_Notes/NN_NP_*.md`) + Contexto de Sesión (`00_Context_Memory/CTX_*.md`) — el workflow es **Documentar 3** (ambos + Engram)

- --

## 🎯 WORKFLOWS DISPONIBLES (8 categorías, 29 workflows)

| Categoría               | Path                             | Workflows principales                                                     |
|------------------------|---------------------------------|--------------------------------------------------------------------------|
| **Learning Always**     | `00_Learning_Always/`            | Continuous learning module                                                |
| **Personal OS**         | `01_Personal_Os/`                | Morning, Backlog, Content, Weekly, Rituales (+ 09_AI_Task_Template)       |
| **Marvel**              | `02_Marvel/`                     | Iron Man Gen, Spider, Professor X, Vision, Thor, Hulk, AntMan, Doc Strange|
| **Gentleman**           | `03_Gentleman/`                  | Frontend Premium, Redacción de Docs                                       |
| **Hillary**             | `04_Hillary/`                    | Captura Rápida, Hillary Life OS                                           |
| **Compound Engineering**| `05_Compound_Engineering/`       | Deep Work, Ship It, Harness, Multi-Agent                                  |
| **YouTube Full Video**  | `06_Youtube_Full_Video/`         | Pipeline de producción de video                                           |
| **Documentar 3**        | `07_Documentar_3/`               | Sesión completa: Context Memory + Process Notes + Engram                  |

- --

## 🔔 NOTIFICACIONES DE SONIDO

```bash
# Al completar cada tarea en TodoWrite

python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py --task-complete

# Logro importante

python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py --success

# Error

python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py --error
```

- --

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

- --

## 🧠 SDD (Spec-Driven Development) — Comandos

| Comando        | Fase                                                       | Propósito                         |
|---------------|-----------------------------------------------------------|----------------------------------|
| `/sdd-new`     | proposal → spec → design → tasks → apply → verify → archive| Cambio completo                   |
| `/sdd-explore` | Investigación                                              | Explorar código/ideas             |
| `/sdd-apply`   | Implementación                                             | Codificar según specs             |
| `/sdd-verify`  | Validación                                                 | Tests vs specs                    |

- --

## 🔄 COMPOUND ENGINEERING — Comandos

| Comando         | Propósito                           |
|----------------|------------------------------------|
| `/ce:ideate`    | Descubrir mejoras de alto impacto   |
| `/ce:brainstorm`| Explorar requisitos                 |
| `/ce:plan`      | Plan de implementación detallado    |
| `/ce:work`      | Ejecutar con calidad                |
| `/ce:review`    | Code review multi-agente            |
| `/ce:compound`  | Documentar aprendizajes             |

- --

## ✅ CHECKLIST DE INICIO DE SESIÓN

- [ ] `engram_mem_context()` — memoria reciente
- [ ] `00_Winter_is_Coming/GOALS.md` — metas activas
- [ ] `00_Winter_is_Coming/BACKLOG.md` — items pendientes
- [ ] `01_Personal_Os/01_Core/01_Rules/` — reglas activas
- [ ] `01_Personal_Os/03_Task/` — tareas en progreso/bloqueadas
- [ ] `.atl/skill-registry.md` — compact rules (si hay SDD)
- [ ] `00_Manifest/` — SSOT de conteos (solo si se detecta drift en métricas)
- [ ] Reportar resumen al chat antes de actuar

- --

* Think Different PersonalOS v1.0.0-consequences — Production Release*
* Actualizado: 2026-09-20 | 427 skills | 99 agents | 31 MCPs | 178 scripts | 44 rules | 30 workflows | 13 hooks | CenturionS: 9 divisiones*
* Versiones: gentle-ai v2.5.0-rc.1 | CE v3.24.0 | GGA v2.10.1 | subagent-statusline 1.3.0 | Second Brain: Consequences vault integrado (Regla 15)*
