# CLAUDE.md

This file provides guidance to Claude Code / OpenCode agents when working with PersonalOS.

---

# Constitucion Think Different

## REGLA 00: Protocolo Genesis (OBLIGATORIO)

**REGLA ORO: SIN CONTEXTO NO HAY CHAT**

- **PROHIBIDO** chatear sin cargar contexto primero
- Antes de responder: llamar `mem_context` y/o `mem_search` con keywords relevantes
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

---

Al iniciar una nueva sesion, ejecutar esta secuencia antes de responder:

1. Leer `.agent/00_Rules/` — Reglas activas del sistema
2. Ejecutar `mem_context` — Ultimas sesiones de Engram
3. Ejecutar `mem_search` con keywords del proyecto si aplica
4. Leer `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/MANIFEST.md` — Estado actual del OS (config_paths.BACKLOG_FILE auto-detecta)
5. **Reportar en el chat** un resumen del contexto cargado antes de actuar

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

# Arquitectura del Sistema (Live OS v5.0)

```
C:\Users\sebas\                    # Project Root (LIVE OS)
|
|--- .agent/                       # Configuracion activa de agentes
|    |--- 00_Rules/                # Reglas del sistema (24 activas)
|    |--- 01_Agents/               # Agentes configurados (69 activos)
|    |--- 02_Skills/               # Skills operativas (34 areas, ~3606 archivos)
|    |--- 03_Workflows/            # Workflows (28 activos)
|    |--- 04_Extensions/           # Extensiones y hooks
|    |    +--- hooks/              # 9 archivos en 6 directorios
|    |        |--- 01_Pre_Tool/    # PreToolUse
|    |        |--- 02_Post_Tool/   # PostToolUse
|    |        |--- 03_Lifecycle/   # Stop, SubagentStop
|    |        |--- 04_Sound/       # Notifications
|    |        |--- 05_Harness/     # Anthropic Harness
|    |        +--- 05_Post_Hulk_Compound/  # Post-Hulk (duplicado 05_)
|    +--- README.md                # Documentación de .agent/
|
|--- .config/opencode/             # Configuracion OpenCode
|    |--- opencode.json            # MCP servers, sub-agents, permisos
|    |--- skills/                  # 200 skills en 81 areas (vía symlink/copy)
|    |--- nodes_modules/           # MCP tooling
|
|--- 01_Personal_Os/               # Organizador principal del OS
|    |--- 04_Operations/           # Operaciones activas
|         |--- 02_Agent_Teams_Lite/ # SDD Workflows + Manifest
|         |    +--- 00_Manifest/   # FUENTE DE VERDAD del sistema
|         |--- 03_Scripts_Os/      # Scripts operativos HUB
|
|--- Downloads/01 Revisar/         # Context Bunker y backups
|    |--- 09 Versiones/            # Respaldos del sistema
|    |--- 06 Context Bunker/       # Memoria externa
|
|--- Desktop/Think_Different/      # Backup v5 (desktop)
|--- C:\Users\sebas\.agent\        # Misma raiz que .agent/
```

---

# Estructura .agent/ (Configuracion AI) — LIVE

```
.agent/
|--- 00_Rules/                # 24 reglas del sistema (`.mdc`)
|--- 01_Agents/               # 69 agentes (`.md` con YAML frontmatter)
|--- 02_Skills/               # 34 areas de conocimiento (~3606 archivos)
|--- 03_Workflows/            # 28 workflows (`.md` con YAML frontmatter)
|--- 04_Extensions/           # Hooks del sistema
|    +--- hooks/              # 9 archivos en 6 directorios
|        |--- 01_Pre_Tool/    # PreToolUse
|        |--- 02_Post_Tool/   # PostToolUse
|        |--- 03_Lifecycle/   # Stop, SubagentStop
|        |--- 04_Sound/       # Notifications
|        |--- 05_Harness/     # Anthropic Harness
|        +--- 05_Post_Hulk_Compound/  # Post-Hulk (duplicado 05_)
+--- CLAUDE.md                # Este archivo
+--- README.md                # Documentacion de .agent/
```

---

# Manifest del Sistema

El manifest es la **FUENTE DE VERDAD** del estado del OS.

**Ubicacion:** `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`

| Archivo | Contenido |
|---------|-----------|
| `README.md` (alias MANIFEST.md) | Conteos oficiales: 45 MCPs, 200 Skills (81 areas), 69 Agentes, 28 Workflows, 9 Hooks, 24 Rules, 24 Integrations, 1 HUB |
| `AGENTS.md` | Listado completo de agentes |
| `SKILLS.md` | Listado completo de skills por area |
| `WORKFLOWS.md` | Listado completo de workflows |
| `RULES.md` | Listado completo de reglas |
| `MCP.md` | Listado completo de MCPs |
| `INTEGRATIONS.md` | Listado completo de integraciones |
| `DASHBOARD.md` | Vista consolidada del sistema |

**Comando de validacion:** `python 03_Scripts_Os/20_System_Mapper_Hub.py --validate`

---

# HUB Scripts

Centralizados en `01_Personal_Os/04_Operations/03_Scripts_Os/` — **27 scripts activos**.

| Script | Proposito |
|--------|-----------|
| `00_System_Paths.py` | Path resolution and config |
| `01_Auditor_Hub.py` | System auditing |
| `02_Git_Hub.py` | Git operations |
| `03_AIPM_Hub.py` | AI Project Manager |
| `05_Ritual_Hub.py` | Closing ritual |
| `10_Validator_Hub.py` | System validation |
| `20_System_Mapper_Hub.py` | System validation + manifest generation |
| ... y 20 mas | Varios (monitoreo, cleanup, scripts tooling) |

Listado completo: `01_Personal_Os/04_Operations/03_Scripts_Os/`

> **Nota:** El manifest real en disco es `README.md` (no `MANIFEST.md`). config_paths.BACKLOG_FILE auto-detecta cuál leer.

---

# Skills Disponibles

## Skills por Area (.config/opencode/skills/)

**Total: 200 skills en 81 areas** — Ver listado completo en `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/README.md`

Las skills se organizan en las siguientes categorias principales:

| Categoria | Areas | Skills |
|-----------|-------|--------|
| **Gentleman** (config/opencode/skills/gentleman/) | 36 areas | Plan, Work, Review, Compound, Utilities |
| **Compound Engineering** (config/opencode/skills/ce-*) | ~20 | brainstorm, plan, work, review, debug, etc. |
| **Claude SEO AI** (config/opencode/skills/claude-seo-ai/) | 5 | audit, fix, geo, score, seo-orchestrator |
| **JAO** (config/opencode/skills/gentleman/07_JAO/) | 6 | Entrevistador, Humanizador, Prompts, Presentaciones, Superpowers, Verificador |
| **Otros** | ~14 | pdf, docx, xlsx, pptx, canvas, mcp, etc. |

---

# SDD Workflow

Usa los comandos SDD: `/sdd:init`, `/sdd:explore`, `/sdd:new`, `/sdd:spec`, `/sdd:design`, `/sdd:tasks`, `/sdd:apply`, `/sdd:verify`, `/sdd:archive`.

Los cambios SDD se almacenan en `.atl/openspec/changes/`.

---

# Compound Engineering

Usa los comandos CE: `/ce:ideate`, `/ce:brainstorm`, `/ce:plan`, `/ce:work`, `/ce:review`, `/ce:compound`.

---

# Reglas Fundamentales

## Regla Fundamental: Modificacion del OS

**Solo el IA** tiene la autoridad y la capacidad para modificar el nucleo del sistema PersonalOS (codigo, scripts, configuracion). El usuario es el estratega y dueño de la vision; el IA es el ejecutor responsable de mantener la pureza tecnica y la integridad del sistema (Pure Green).

---

# Estado Actual del Sistema (2026-06-28)

| Categoria | Estado |
|-----------|--------|
| Agentes (69) | ✅ OPERATIONAL |
| Skills (200 en 81 areas) | ✅ OPERATIONAL |
| MCPs (45 configurados, 35 activos) | ✅ ACTIVE |
| Workflows (28) | ✅ OPERATIONAL |
| Hooks (9) | ✅ ACTIVE |
| Rules (24) | ✅ ACTIVE |
| Manifest | ✅ VALIDATED (0 errores) |
| Scripts OS (20_System_Mapper_Hub) | ✅ OPERATIONAL |

---

> **Nota:** Este sistema ya NO usa la estructura `Think_Different/` ni `01_Core/` como fuente de verdad.
> La fuente de verdad es el **Manifest** en `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`.
> La estructura `.agent/` es el directorio operativo vivo, no un backup.

© 2026 PersonalOS v5.0 Live
