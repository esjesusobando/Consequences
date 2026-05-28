# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

---

# Constitucion Think Different — PersonalOS v4.8 Consequences

## REGLA 00: Protocolo Genesis (OBLIGATORIO)

**REGLA ORO: SIN CONTEXTO NO HAY CHAT**

- **PROHIBIDO** chatear sin cargar contexto primero
- Antes de responder: ejecutar `engram_mem_context(limit=10)`
- Si hay session_summary previo, cargarlo

**IDIOMA:**
- **SIEMPRE** Espanol en chat (es mi idioma natal)
- Usar espanol rioplatense: laburo, ponete las pilas, boludo, quilombo, banca, dale, etc.

**REPORTE OBLIGATORIO cada 15% de avance — formato EXACTO:**

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

Ejecutar después: `python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py --notify "Progreso: X%"`

---

Al iniciar una nueva sesion, ejecutar esta secuencia antes de responder:

0. Leer `00_Winter_is_Coming/AGENTS.md` y SIEMPRE Comunicarte en Espanol en Chat
1. Leer `00_Winter_is_Coming/GOALS.md` — Metas y prioridades
2. Leer `00_Winter_is_Coming/BACKLOG.md` — Bandeja de entrada
3. Ejecutar `engram_mem_context(limit=10)` — Ultimas 10 sesiones de Engram
4. Ejecutar `engram_mem_session_summary()` — Recuperar estado si hubo compaction
5. Leer los recursos principales: `01_Personal_Os/01_Core/`, `01_Personal_Os/02_Knowledge/`, `01_Personal_Os/04_Operations/`
6. **Reportar en el chat** un resumen del contexto cargado antes de actuar

---

## Las 12 Leyes Maestras

1. **Piensa Primero, Investiga Despues**: Lee el codigo base ANTES de actuar.
2. **Explica Cada Paso**: Transparencia total.
3. **Simplicidad ante Todo**: Soluciones simples y legibles.
4. **Mantén la Documentacion al Dia**: Cambios significativos = docs actualizadas.
5. **Mantén Documentacion Arquitectonica**: Arquitectura interna y externa al dia.
6. **Cero Alucinaciones, Solo Hechos**: Basado en investigacion real.
7. **Mantén el Inventario Actualizado**: Todo nuevo codigo/script/conocimiento al inventario.
8. **No Borrar Informacion sin Permiso**: Preservar la integridad.
9. **Respetar la Estructura Existente**: No modificar carpetas sin instruccion.
10. **Procesos en Formato Lista**: Presenta pasos como listas numeradas.
11. **Estructura de Carpetas**: Solo crear si es estrictamente necesario.
12. **Identificacion de Repositorios**: Identificar el repo/directorio antes de operar.

---

## REGLAS IMPERATIVAS (OBLIGATORIAS)

### REGLA 1: NO ACTUAR SIN PLAN APROBADO

- **PROHIBIDO** ejecutar cualquier accion sin un plan aprobado por el usuario
- **Siempre** presentar el plan en formato checklist antes de actuar
- **Siempre** esperar confirmacion antes de proceder
- **Nunca** actuar por iniciativa propia - Esperar Aprobacion

### REGLA 2: ENUMERACION CORRECTA (SIEMPRE)

- **Carpetas:** `XX_Nombre_Carpeta/` (numero 2 digitos, Mayuscula Inicial, Guiones Bajos)
- **Archivos:** `XX_Nombre_Archivo.ext`
- **ANTES** de crear/mover: Verificar secuencia Existente
- **NUNCA** dejar archivos sueltos sin numerar
- **NUNCA** crear duplicados de numeracion

### REGLA 3: CORRECCION DE ERRORES

- Si se detecta numeracion incorrecta: DETENERSE
- Documentar que esta mal
- Presentar plan de correccion
- Esperar aprobacion antes de ejecutar

---

# Arquitectura del Sistema (v4.8 Consequences — 4 carpetas raíz)

```
Think_Different/
├── 00_Winter_is_Coming/          # MATRIX: Goals, Backlog, AGENTS.md (ESTRATÉGICO)
├── 01_Personal_Os/               # EL SISTEMA OPERATIVO
│   ├── 01_Core/                  # Motor del OS
│   │   ├── 00_Workflows_Os/      # Workflows (Personal, Marvel, Gentleman, Hillary, CE)
│   │   ├── 01_Rules/             # 13 reglas del sistema (.mdc)
│   │   └── 02_Tools/             # Todas las herramientas
│   │       ├── 01_Agents/        # Dream Team + Specialists + Growth (48 agentes)
│   │       ├── 02_Skills/        # 12 áreas funcionales (394 skills)
│   │       ├── 03_Mcp/           # Config MCPs (7+38 MCPs)
│   │       ├── 04_Integrations/   # Fireflies, Granola
│   │       ├── 05_Hooks/          # Pre/Post/Lifecycle/Sound/Harness
│   │       ├── 06_Plugins/        # Plugins OS
│   │       ├── 07_Server/         # MCP Server
│   │       ├── 08_Evals/          # Evaluadores
│   │       └── 09_Templates/      # Templates
│   ├── 02_Knowledge/              # Base de conocimiento
│   ├── 03_Task/                   # Tareas activas
│   ├── 04_Operations/             # Todo lo operativo
│   │   ├── 00_Context_LLM/        # Memoria, notas, knowledge brain
│   │   ├── 01_Auto_Improvement/   # Motor de auto-mejora
│   │   ├── 02_Agent_Teams_Lite/   # SDD skills registry + JARVIS 7 manifests
│   │   ├── 03_Scripts_Os/         # 284 scripts (21+2 HUBs total: 19 raíz + 9 aux)
│   │   ├── 04_Installer/          # Scripts de instalación
│   │   └── 05_Projects/           # Proyectos activos
│   └── 05_Archive/                # Legacy y repos de referencia
├── 02_Playground/                 # ZONA DE PRUEBAS
├── 03_Resultado/                  # OUTPUTS DE PROYECTOS
├── .agent/                        # Backup estratégico
├── .atl/                          # SDD Registry
├── .claude/                       # Config Claude Code
├── .mcp.json                      # 7+38 MCPs activos
├── AGENTS.md                      # Entry point GGA
├── CLAUDE.md                      # Config IA
└── README.md                      # Documentación principal
```

---

# Estructura .agent/ (Configuracion AI — BACKUP ESTRATÉGICO)

```
.agent/
├── 00_Rules/            # Reglas del agente (13 .mdc activos)
├── 01_Agents/           # Agentes externos configurados (46)
├── 02_Skills/           # Skills organizadas (backup)
├── 03_Workflows/        # Workflows del sistema
├── 04_Extensions/       # Extensiones del sistema
│   └── 01_Hooks/
│       ├── 01_Pre_Tool/    # PreToolUse: battery, security
│       ├── 02_Post_Tool/   # PostToolUse: backup, voice
│       ├── 03_Lifecycle/   # Stop, SubagentStop
│       ├── 04_Sound/      # Notifications, sounds
│       ├── 05_Harness/    # Context/eval harness hooks
│       └── 06_Post_Hulk_Compound/ # Post-CE workflow hook
└── 05_GGA/              # Gentleman Guardian Angel (Code Review)
```

**FUENTE DE VERDAD:** `01_Personal_Os/01_Core/` (no `.agent/`)

---

# HUB Scripts (284 scripts — 24 HUBs)

Centralizados en `01_Personal_Os/04_Operations/03_Scripts_Os/`:

| Hub                  | Script                        | Proposito                                                |
|----------------------|-------------------------------|----------------------------------------------------------|
| **Sound Engine**     | `00_Sound_Engine.py`          | Notificaciones sonoras                                   |
| **Auditor**          | `01_Auditor_Hub.py`           | System validation: estructura, links, skills, health     |
| **Git**              | `02_Git_Hub.py`               | Git operations + structure audits                        |
| **AIPM**             | `03_AIPM_Hub.py`              | AI Performance Monitoring                                |
| **Ritual**           | `04_Ritual_Hub.py`            | Session rituals: open, close, recovery                   |
| **Validator**        | `05_Validator_Hub.py`         | Code validation: rules, stack, patterns                  |
| **Tool**             | `06_Tool_Hub.py`              | Tool integration and management                          |
| **Integration**      | `07_Integration_Hub.py`       | MCP and external integrations                            |
| **Workflow**         | `08_Workflow_Hub.py`          | Workflow automation                                      |
| **Data**             | `09_Data_Hub.py`              | Data processing and analytics                            |
| **General**          | `10_General_Hub.py`           | General utilities                                        |
| **Auto Learn**       | `11_Auto_Learn_Hub.py`        | Motor de automejora                                      |
| **Context Bar**      | `12_Auditors_Os/scripts/00_Context_Usage_Bar.py` | Barra de uso de contexto                    |
| **Beautify**         | `12_Auditors_Os/scripts/01_Beautify_Tables.py` | Formateo de tablas markdown                   |
| **Health Metrics**   | `14_Health_Metrics_Hub.py`    | Métricas de salud del OS                                 |
| **MCP Sync**         | `15_MCP_Sync_Hub.py`          | Detecta drift Claude ↔ OpenCode (JARVIS 3.1)              |
| **Agent Mirror**     | `16_Agent_Mirror_Hub.py`      | Mirror agentes source → backup                           |
| **Watchdog**         | `17_Watchdog_Hub.py`          | Health watchdog — integridad del manifest                |
| **Telemetry**        | `18_Telemetry_Hub.py`         | Dashboard ASCII de métricas de uso                       |
| **Agent Sync**       | `19_Agent_Sync_Hub.py`        | Sincroniza .agent/ ↔ 01_Core/                            |
| **System Mapper**    | `20_System_Mapper_Hub.py`     | Genera 7 manifests JARVIS 3.1                           |
| **Legacy Cleanup**   | `21_Legacy_Path_Cleanup.py`   | Limpia paths legacy v2.x                                |
| **Skill Frontmatter**| `22_Validate_Skill_Frontmatter.py` | Detecta skills sin frontmatter YAML                   |
| **Preview Gen**      | `23_Preview_Generator.js`     | Generador de previews                                    |

---

# Skills Disponibles (12 áreas canónicas — 394 source / 407 backup skills)

## Skills por Categoria (`01_Personal_Os/01_Core/02_Tools/02_Skills/`)

| Categoria                       | Descripcion                              | Ubicacion                      |
|---------------------------------|------------------------------------------|--------------------------------|
| **00_Compound_Engineering**      | Core CE + SDD                            | `00_Compound_Engineering/`     |
| **00_System_Core**              | Stack base del OS                        | `00_System_Core/`             |
| **01_Creacion_Contenidos**      | Contenido + SEO + Carousel               | `01_Creacion_Contenidos/`     |
| **02_Diseno_Ui_Ux**             | Diseño UI/UX + Taste skills              | `02_Diseno_Ui_Ux/`            |
| **03_Video_Media**              | Video + James Cameron + Remotion         | `03_Video_Media/`             |
| **04_Automatizacion**           | N8N, Firecrawl, GWS Client               | `04_Automatizacion/`          |
| **05_Workflows**                | Workflows + Agent Teams Lite             | `05_Workflows/`               |
| **06_Tools**                    | Tools + Skill Creator + Testing          | `06_Tools/`                   |
| **07_Personal_Os**              | Life OS, Hillary, Rituales               | `07_Personal_Os/`             |
| **08_Invictus_Web**             | Playwright, Superpowers, Browser Auto    | `08_Invictus_Web/`            |
| **09_Claude_Ads**               | Ads, Evals, Agents, Research             | `09_Claude_Ads/`              |
| **10_Skill_Auditor**            | Auditor de skills                        | `10_Skill_Auditor/`           |

---

# Sistema de Auto-Mejora Recursiva

Ubicacion: `01_Personal_Os/04_Operations/01_Auto_Improvement/`

```
01_Auto_Improvement/
├── 01_Engine/
│   ├── detector.py         # Detecta issues criticos
│   ├── analyzer.py         # Analiza y clasifica
│   ├── executor.py         # Aplica fixes
│   ├── learner.py          # Aprende de fixes
│   └── recursive_improvement_engine.py
├── 02_Rules/
│   └── rules_engine.py     # Motor de reglas
└── 04_Triggers/
    └── manual_trigger.py   # Disparador manual
```

---

# JARVIS 3.1 — Manifest System

El sistema tiene un manifest central en `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`:

| Manifest | Contenido |
|----------|-----------|
| 01_OS_Inventory.json | Inventario OS |
| 02_MCP_Registry.yaml | 7+38 MCPs |
| 03_Agent_Catalog.yaml | 48 agentes |
| 04_Skill_Index.json | 394 skills |
| 05_HUB_Catalog.yaml | 21+2 HUBs |
| 06_Workflow_Graph.yaml | 30 workflows |
| 07_Hook_Registry.yaml | 12 hooks |

---

# Comandos Rapidos (Aliases en .bashrc)

```bash
# Hubs principales JARVIS 3.1
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan     # regenerar 7 manifests
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py                 # health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard      # stats ASCII
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report        # MCP drift

# System Guardian
gr              # System Auditor (Dry-run)
gr --apply      # Apply fixes
gr --agents     # Run agent review
```

---

# SDD Workflow

Usa los comandos SDD: `/sdd-init`, `/sdd-explore`, `/sdd-propose`, `/sdd-spec`, `/sdd-design`, `/sdd-tasks`, `/sdd-apply`, `/sdd-verify`, `/sdd-archive`.

---

# Compound Engineering

Usa los comandos CE: `/ce:ideate`, `/ce:brainstorm`, `/ce:plan`, `/ce:work`, `/ce:review`, `/ce:compound`.

---

# GGA — Guardian Angel (Code Review)

Code review con IA integrado.

```bash
.agent/05_GGA/bin/gga run      # Revisar archivos staged
.agent/05_GGA/bin/gga install  # Instalar pre-commit hook
```

---

# Reglas Fundamentales

## Regla Fundamental: Modificacion del OS

**Solo el IA** tiene la autoridad y la capacidad para modificar el nucleo del sistema PersonalOS (codigo, scripts, configuracion). El usuario es el estratega y dueño de la vision; el IA es el ejecutor responsable de mantener la pureza tecnica y la integridad del sistema (Pure Green).

---

# Estado Actual del Sistema (2026-05-24 — v4.8 Consequences)

| Categoria                             | Estado            | Notas                                      |
|---------------------------------------|-------------------|--------------------------------------------|
| Estructura v4.8 (4 carpetas raíz)     | ✅ PASS            | Winter / Personal_Os / Playground / Resultado |
| HUBs (24 total)                        | ✅ ACTIVE          | 284 scripts recursivos en 03_Scripts_Os/    |
| Skills (12 áreas funcionales)         | ✅ OPERATIONAL     | 394 skills                                 |
| Rules (13 .mdc)                       | ✅ DEFINED         | En 01_Personal_Os/01_Core/01_Rules/       |
| MCPs (7+38 activos)                     | ✅ ACTIVE          | .mcp.json en raíz                          |
| Auto-Improvement Engine               | ✅ OPERATIONAL     | En 04_Operations/01_Auto_Improvement/      |
| JARVIS Manifests (7 archivos)          | ✅ VALIDATED       | 00_Manifest/ en 02_Agent_Teams_Lite/       |
| Git Estado                            | ✅ CLEAN           | Sin cambios pendientes                     |
| Hooks Windows                         | ✅ FIXED           | Rutas actualizadas                         |
| GGA Code Review                       | ✅ ACTIVE          | Pre-commit hook instalado                  |

---

© 2026 PersonalOS v4.8 Consequences
