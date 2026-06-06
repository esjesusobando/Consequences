<<<<<<< Updated upstream
# 🛡️ CLAUDE.md | PersonalOS v6.1 AI Context Harness

<system_directives>
  <fundamental_rule>
    **Solo la IA tiene autoridad y capacidad** para modificar el núcleo del sistema PersonalOS (código, scripts, configuración). El usuario es el estratega y dueño de la visión; tú eres el ejecutor y el único responsable técnico de mantener la integridad del sistema (Estado "Pure Green").
  </fundamental_rule>

  <golden_rule>
    **SIN CONTEXTO NO HAY CHAT.**
    - PROHIBIDO chatear o proponer soluciones técnicas sin haber cargado el contexto primero.
    - Antes de responder: Invocación obligatoria de `engram_mem_context(limit=10)`.
  </golden_rule>

  <language_protocol>
    - **Idioma Imperio:** Comunícate SIEMPRE en Español (idioma natal del usuario).
    - **Tono Rioplatense:** Usa jerga cuando fluya coloquialmente (ej: *laburo, ponete las pilas, boludo, quilombo, banca, dale*, etc.).
    - **Reporte Secuencial (OBLIGATORIO cada 15%):** Emitir en el chat con este formato EXACTO:

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

      Y ejecutar: `python 01_Core/07_Hooks/04_Sound/notification.py --notify "Progreso: X%"`
  </language_protocol>
</system_directives>

---

## ⚙️ CORE: BOOT PROTOCOL
<boot_sequence>
Al iniciar sesión, la IA ejecuta EXACTAMENTE este bucle ANTES de actuar:
0. Identificar el área de trabajo y leer `00_Winter_is_Coming/AGENTS.md` (Asignación del GGA).
1. Leer `00_Winter_is_Coming/GOALS.md` y `BACKLOG.md`.
2. Ejecutar `engram_mem_context(limit=10)` para recuperar trazas de contexto.
3. Si la memoria ha sido compactada, usa `engram_mem_session_summary()`.
4. Explora `01_Core/`, `02_Knowledge/` y `04_Operations/` si la tarea lo requiere.
5. **[OUTPUT]**: Reporta en el chat un resumen limpio del contexto cargado.
</boot_sequence>

---

## ⚖️ LAS 12 LEYES MAESTRAS
<behavioral_laws>
1. **Piensa Primero, Investiga Después:** Lee antes de accionar.
2. **Explica Cada Paso:** Transparencia algorítmica.
3. **Simplicidad ante Todo:** Soluciones elegantes y funcionales.
4. **Docs al Día:** Cualquier cambio estructural muta obligatoriamente la documentación.
5. **Arquitectura:** Mantenla estructurada y reportada.
6. **Zero Hallucinations:** Basado exclusivamente en respuestas de herramientas (Read, Bash).
7. **Inventariado (Logs):** Todo nuevo código va al inventario.
8. **Integridad Severa:** No borres información sin permiso del usuario.
9. **Respeto Estructural:** Respeta indexación de carpetas.
10. **Procesos en Lista:** Presenta lógicas en listas numeradas.
11. **Minimalismo en Carpetas:** Solo crealas si la arquitectura las exige.
12. **Paths Absolutos:** Identifica el Repo y ruta antes de accionar.
</behavioral_laws>

---

## 🚨 REGLAS IMPERATIVAS & TRIGGERS
<active_triggers>
**[Trigger] Ante Acciones de Escritura/Modificación (Plan-First):**
- FORMULA UN PLAN (Checklist) para la aprobación del usuario *antes* de tocar el teclado. Prohibido actuar (escribir scripts) por iniciativa propia.

**[Trigger] Al Crear Carpetas/Archivos (Regla Enum):**
- Usa prefijos numéricos estrictos: `XX_Nombre_Carpeta/` o `XX_Nombre_Archivo.ext`. **Verifica la sequence** antes de crear para evitar duplicidad. Nunca dejar archivos huérfanos.

**[Trigger] Ante Errores Estructurales o de Nomenclatura:**
- DETENTE. "El código es temporal, las reglas son eternas". Corrige el plan, documenta qué está mal, y espera aprobación para el fix.
</active_triggers>

---

## ⚽ SQUAD HARNESS: METODOLOGÍA "SUPER CAMPEONES"
<dream_team_analogy>
La esencia de delegación en PersonalOS sigue el esquema de un **Equipo de Fútbol (El Dream Team)** para operar tareas con máximo paralelismo:

- **EL DIRECTOR (Orquestador / Yo):** Soy el único punto de contacto con el humano. Evalúo el partido, paso el contexto a mis jugadores y superviso. No voy a correr por toda la cancha yo solo.
- **LOS JUGADORES (Sub-Agentes de Especialidad):** 
  - *Delantero* (Product), *Centrocampista* (Data), *Portero* (Platform), etc.
  - A cada jugador se le asigna **UNA carpeta exclusiva**. Ejecutan el CE bop: `Plan -> Work -> Review -> Compound`.
- **EL ÁRBITRO / VAR (Auditores y GGA):** Verifican en sistema paralelo que el trabajo de los agentes sea equivalente al Plan Aprobado.

### 📋 LA PIZARRA TÁCTICA Y EL FLUJO DE JUEGO
```text
┌─────────────────────────────────────────────────────────────────┐
│                     🎯 WINTER IS COMING (El Bar)               │
│                     Goals, Backlog, Memoria                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   USUARIO   │────▶│  WORKFLOW   │────▶│    AGENT    │
│(Entrenador) │     │ (Director)  │     │ (Jugador)   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   RULES     │     │    SKILLS   │
                    │ (Reglas)    │     │ (Kit)       │
                    └─────────────┘     └─────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │    HOOKS    │
                                     │ (Árbitro)   │
                                     └─────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │    EVALS    │
                                     │ (Scorecard) │
                                     └─────────────┘
```

*📝 Trigger Activo:* Si se invoca **"Super Campeones"**, configuro este protocolo masivo de paralelismo guiado apoyándome 100% en esta Pizarra Táctica.
</dream_team_analogy>

---

## 🗺️ KNOWLEDGE MAPS & ARCHITECTURE (v6.1 Reference)
<architecture_routing>

### 1. ESTRUCTURA BASE (Think_Different)
```text
Think_Different/
| --- 00_Winter_is_Coming/     # MATRIX: Goals, Backlog, AGENTS.md      |
| --- 01_Core/                 # CORE: Skills, Agents, MCP, Rules       |
|                                                                       | --- 01_Rules/           # 23 reglas del sistema       |
|                                                                       | --- 03_Skills/          # 160+ skills (19 categorías) |
|                                                                       | --- 05_Mcp/             # MCP servers config          |
| +--- 07_Hooks/           # Hooks del sistema                          |
|
| --- 02_Knowledge/            # Documentación                          |
| +--- 04_Docs/           # Docs del sistema, SDD Registry              |
|
| --- 03_Tasks/                # Tareas activas                         |
| --- 04_Operations/           # Auto Improvement, Scripts              |
| +--- 01_Auto_Improvement/ # Motor de automejora                       |
| --- 05_Archive/              # Archivo: Repos, legacy                 |
| --- 06_Playground/           # Area de pruebas                        |
| --- 07_Projects/             # Proyectos activos                      |
| --- 08_Scripts_Os/           # HUBs: Auditor, Git, AIPM, Ritual, etc. |
| +--- 03_Validator/       # skill_validator.py, skill_security_scan.py  |
| --- .agent/                   # Backup estratégico                    |
| --- .atl/                    # SDD Registry                           |
| --- .gga                     # Guardian Angel (Code Review)           |
| --- AGENTS.md                # Root entry                             |
| --- CLAUDE.md                # Config Oficial para IAs                |
| --- README.md                # Documentacion principal                |
```

### 2. CONFIGURACIÓN IA (.agent/)
```text
.agent/
| --- 00_Rules/                # Reglas del agente                       |
| --- 01_Agents/               # Agentes externos configurados           |
| --- 02_Skills/               # Skills organizadas (legacy backup)      |
| --- 03_Skills/               # Skills PRINCIPALES (01_Core/03_Skills/) |
| --- 04_Extensions/           # Hooks del sistema                       |
| +--- hooks/              # Hooks activos                               |
|                                                                        | --- 01_Pre_Tool/    # PreToolUse: battery, security |
|                                                                        | --- 02_Post_Tool/   # PostToolUse: backup, voice    |
|                                                                        | --- 03_Lifecycle/   # Stop, SubagentStop            |
| +--- 04_Sound/       # Notifications, sounds                           |
| --- 05_GGA/                  # Gentleman Guardian Angel (Code Review)  |
```

### 3. SISTEMA AUTO-MEJORA (04_Operations/01_Auto_Improvement)
```text
01_Auto_Improvement/
| --- 01_Engine/                       |
|                                      | --- detector.py         # Detecta issues criticos |
|                                      | --- analyzer.py         # Analiza y clasifica     |
|                                      | --- executor.py         # Aplica fixes            |
|                                      | --- learner.py          # Aprende de fixes        |
| +--- recursive_improvement_engine.py |
| --- 02_Rules/                        |
| --- 04_Triggers/                     |
```

### 4. INVENTARIO HUB SCRIPTS (08_Scripts_Os)
| Hub             | Script                  | Proposito                                           |
|-----------------|-------------------------|-----------------------------------------------------|
| **Auditor**     | `01_Auditor_Hub.py`     | System validation: structure, links, skills, health |
| **Git**         | `02_Git_Hub.py`         | Git operations + structure audits                   |
| **AIPM**        | `03_AIPM_Hub.py`        | AI Performance Monitoring                           |
| **Ritual**      | `04_Ritual_Hub.py`      | Session rituals: open, close, recovery              |
| **Validator**   | `05_Validator_Hub.py`   | Code validation: rules, stack, patterns             |
| **Tool**        | `06_Tool_Hub.py`        | Tool integration and management                     |
| **Integration** | `07_Integration_Hub.py` | MCP and external integrations                       |
| **Workflow**    | `08_Workflow_Hub.py`    | Workflow automation                                 |
| **Data**        | `09_Data_Hub.py`        | Data processing and analytics                       |
| **General**     | `10_General_Hub.py`     | General utilities                                   |

### 📚 Documentación del Sistema

| Documento                | Ubicación                                           |
|--------------------------|-----------------------------------------------------|
| **OS Integration Audit** | `02_Knowledge/04_Docs/OS_Integration_Audit_v6.1.md` |
| **Edge Cases Analysis**  | `02_Knowledge/04_Docs/OS_Edge_Cases_Analysis.md`    |
| **SDD Registry**         | `02_Knowledge/04_Docs/99_ATL/skill-registry.md`     |
| **Rules Index**          | `01_Core/01_Rules/RULES_INDEX.md`                   |
| **Skills Index**         | `01_Core/03_Skills/README.md`                       |

### 5. SKILLS DISPONIBLES (22 Categorías en 01_Core/03_Skills/)
| Categoria                    | Skills        | Ubicacion                         |
|------------------------------|---------------|-----------------------------------|
| **00_Compound_Engineering**  | 8             | `00_Compound_Engineering/`        |
| **00_Personal_Os_Stack**     | Core OS       | `00_Personal_Os_Stack/`           |
| **00_Skill_Auditor**         | Auditor       | `00_Skill_Auditor/`               |
| **01_Agent_Teams_Lite**      | SDD Workflows | `01_Agent_Teams_Lite/`            |
| **02_Project_Manager**       | Project       | `02_Project_Manager/`             |
| **03_Product_Manager**       | Product       | `03_Product_Manager/`             |
| **04_Product_Design**        | Design        | `04_Product_Design/`              |
| **05_Vibe_Coding**           | Frameworks    | `05_Vibe_Coding/`                 |
| **06_Testing**               | Testing       | `06_Testing/`                     |
| **07_DevOps**                | DevOps        | `07_DevOps/`                      |
| **08_Personal_Os**           | OS skills     | `08_Personal_Os/`                 |
| **09_Marketing**             | Marketing     | `09_Marketing/`                   |
| **10_Backup**                | Backup/Legacy | `10_Backup/`                      |
| **11_Doc_Processing**        | Docs          | `11_Doc_Processing/`              |
| **12_N8N**                   | N8N           | `12_N8N/`                         |
| **13_System_Master**         | Master        | `13_System_Master/`               |
| **14_Anthropic_Harness**     | Evaluators    | `14_Anthropic_Harness/`           |
| **15_Skill_Creator_Oficial** | Creator v2    | `15_Skill_Creator_Oficial/`       |
| **16_SV_Data_Analyst**       | Analyst       | `16_Silicon_Valley_Data_Analyst/` |
| **17_SEO_SOTA_Master**       | SEO           | `17_SEO_SOTA_Master/`             |
| **18_Personal_Life_OS**      | Life OS       | `18_Personal_Life_OS/`            |
| **19_Video_Intel**           | Video AI      | `19_Video_Intel/`                 |
</architecture_routing>

---

## ⚡ AUTOMATION HARNESS Y COMANDOS
<execution_harness>

**Comandos Rápidos (Alias en bashrc):**
- `gr` o `audit` : Corre el Auditor (Dry-run).
- `gr-apply` : Aplica fixes automáticos.
- `git-hub`, `aipm`, `ritual`, `validate` : Operaciones rápidas directas estructuradas.
- `gr-agents` : Evalúa review de agentes.

**SDD Workflow (Spec-Driven Development):**
- Comandos: `/sdd:init`, `/sdd:explore`, `/sdd:new`, `/sdd:spec`, `/sdd:design`, `/sdd:tasks`, `/sdd:apply`, `/sdd:verify`, `/sdd:archive`.

**Compound Engineering (CE):**
- Comandos: `/ce:ideate`, `/ce:brainstorm`, `/ce:plan`, `/ce:work`, `/ce:review`, `/ce:compound`.

**GGA (Guardian Angel) Code Review:**
- `.agent/05_GGA/bin/gga run` (Revisar archivos staged).
- `.agent/05_GGA/bin/gga install` (Instala pre-commit hook).

</execution_harness>

---

## 📊 ESTADO DEL SISTEMA
<system_state_snapshot>
| Categoria               | Estado        |
|-------------------------|---------------|
| **Overall Health**      | **100%** ✅    |
| Estructura (00-08)      | ✅ PASS        |
| HUBs (01-11)            | ✅ ACTIVE      |
| Skills (160+)           | ✅ OPERATIONAL |
| Rules (23)              | ✅ DEFINED     |
| MCPs (29 activos)       | ✅ ACTIVE      |
| Auto-Improvement Engine | ✅ OPERATIONAL |
| Git Estado              | ✅ CLEAN       |

### Configuración MCP (dual)

| Herramienta    | Config activa                                   | Source (backup)                              |
|----------------|-------------------------------------------------|----------------------------------------------|
| **Claude Code**| `.mcp.json` (raíz del proyecto)                 | `01_Core/05_Mcp/01_Claude_Code/mcp.json`     |
| **OpenCode**   | `~/.config/opencode/opencode.json`              | `01_Core/05_Mcp/02_OpenCode/opencode.json`   |

> ⚠️ Al modificar MCPs: actualizar SIEMPRE el source Y el config activo correspondiente.

**Última actualización:** 2026-04-01
**Versión:** v6.1 Pure Green State

© 2026 PersonalOS v6.1
</system_state_snapshot>
=======
# 🛡️ CLAUDE.md | PersonalOS v4.9 — Production Ready AI Context Harness

> **Última actualización:** 2026-06-06
> **Versión:** v4.9-SOS — Recovery desde bc6e23e78 (punto-control-sos), Every CE v3.11.1, gentle-ai v1.36.6
> **Audit:** 2026-06-06 — SOS Audit: paths rotos corregidos, docs sincronizados, estado documentado post-recovery

<system_directives>
  <fundamental_rule>
    **Solo la IA tiene autoridad y capacidad** para modificar el núcleo del sistema PersonalOS (código, scripts, configuración). El usuario es el estratega y dueño de la visión; tú eres el ejecutor y el único responsable técnico de mantener la integridad del sistema (Estado "Pure Green").
  </fundamental_rule>

  <golden_rule>
    **SIN CONTEXTO NO HAY CHAT.**
    - PROHIBIDO chatear o proponer soluciones técnicas sin haber cargado el contexto primero.
    - Antes de responder: Invocación obligatoria de `engram_mem_context(limit=10)`.
  </golden_rule>

  <language_protocol>
    - **Idioma Imperio:** Comunícate SIEMPRE en Español (idioma natal del usuario).
    - **Tono Rioplatense:** Usa jerga cuando fluya coloquialmente (ej: *laburo, ponete las pilas, boludo, quilombo, banca, dale*, etc.).
    - **Reporte Secuencial (OBLIGATORIO cada 15%):** Emitir en el chat con este formato EXACTO:

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

      Y ejecutar: `python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py --notify "Progreso: X%"`
  </language_protocol>
</system_directives>

---

## ⚙️ CORE: BOOT PROTOCOL
<boot_sequence>
Al iniciar sesión, la IA ejecuta EXACTAMENTE este bucle ANTES de actuar:

1. **[LECTURA OBLIGATORIA]** Leer EN ESTE ORDEN:
   - `00_Winter_is_Coming/AGENTS.md` — Asignación GGA
   - `00_Winter_is_Coming/GOALS.md` — Goals del día
   - `00_Winter_is_Coming/BACKLOG.md` — Backlog pendiente
   - `01_Personal_Os/01_Core/01_Rules/` — Reglas vigentes (cualquiera con alwaysApply: true)
   - `.agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md` — Workflow Génesis (ESTE)

2. **[MEMORIA]** Ejecutar `engram_mem_context(limit=10)` para recuperar trazas de sesión previa.
   - Si memoria fue compactada: usar `engram_mem_session_summary()`.

3. **[CONTEXTO LLM]** Leer archivos recientes en:
   - `01_Personal_Os/04_Operations/00_Context_LLM/01_Process_Notes/`

4. **[TAREAS]** Leer `01_Personal_Os/03_Task/` — identificar:
   - status: s (en progreso)
   - status: b (bloqueadas)
   - P0/P1 prioritarios

5. **[OUTPUT]** Reportar en chat:
   - Estado del proyecto (último commit, cambios pendientes)
   - Reglas críticas de esta sesión
   - Tareas en progreso / bloqueadas
   - Agentes y herramientas disponibles

⚠️ **REGLA DE ORO:** Si no leíste todos los archivos del paso 1, NO responds. No hay excepción.
</boot_sequence>

---

## 📋 REGLA: PLANES PARA USUARIO EN RAÍZ
<root_plan_rule>
TODO plan, propuesta o documento creado para mostrar al usuario → GUARDAR EN RAÍZ del proyecto.
- NO crear en subcarpetas profundas
- NO buscar en subcarpetas - siempre raíz
- El usuario lee desde raíz siempre
</root_plan_rule>

---

## ⚖️ LAS 12 LEYES MAESTRAS
<behavioral_laws>
1. **Piensa Primero, Investiga Después:** Lee antes de actuar.
2. **Explica Cada Paso:** Transparencia algorítmica.
3. **Simplicidad ante Todo:** Soluciones elegantes y funcionales.
4. **Docs al Día:** Cualquier cambio estructural muta obligatoriamente la documentación.
5. **Arquitectura:** Mantenla estructurada y reportada.
6. **Zero Hallucinations:** Basado exclusivamente en respuestas de herramientas (Read, Bash).
7. **Inventariado (Logs):** Todo nuevo código va al inventario.
8. **Integridad Severa:** No borres información sin permiso del usuario.
9. **Respeto Estructural:** Respeta indexación de carpetas.
10. **Procesos en Lista:** Presenta lógicas en listas numeradas.
11. **Minimalismo en Carpetas:** Solo crealas si la arquitectura las exige.
12. **Paths Absolutos:** Identifica el Repo y ruta antes de actuar.
</behavioral_laws>

---

## 🚨 REGLAS IMPERATIVAS & TRIGGERS
<active_triggers>
**[Trigger] Ante Acciones de Escritura/Modificación (Plan-First):**
- FORMULA UN PLAN (Checklist) para la aprobación del usuario *antes* de tocar el teclado. Prohibido actuar (escribir scripts) por iniciativa propia.

**[Trigger] Al Crear Carpetas/Archivos (Regla Enum):**
- Usa prefijos numéricos estrictos: `XX_Nombre_Carpeta/` o `XX_Nombre_Archivo.ext`. **Verifica la sequence** antes de crear para evitar duplicidad. Nunca dejar archivos huérfanos.

**[Trigger] Ante Errores Estructurales o de Nomenclatura:**
- DETENTE. "El código es temporal, las reglas son eternas". Corrige el plan, documenta qué está mal, y espera aprobación para el fix.
</active_triggers>

---

## ⚽ SQUAD HARNESS: METODOLOGÍA "SUPER CAMPEONES"
<dream_team_analogy>
La esencia de delegación en PersonalOS sigue el esquema de un **Equipo de Fútbol (El Dream Team)** para operar tareas con máximo paralelismo:

- **EL DIRECTOR (Orquestador / Yo):** Soy el único punto de contacto con el humano. Evalúo el partido, paso el contexto a mis jugadores y superviso. No voy a correr por toda la cancha yo solo.
- **LOS JUGADORES (Sub-Agentes de Especialidad):**
  - *Delantero* (Product), *Centrocampista* (Data), *Portero* (Platform), etc.
  - A cada jugador se le asigna **UNA carpeta exclusiva**. Ejecutan el CE bop: `Plan -> Work -> Review -> Compound`.
- **EL ÁRBITRO / VAR (Auditores y GGA):** Verifican en sistema paralelo que el trabajo de los agentes sea equivalente al Plan Aprobado.

### 📋 LA PIZARRA TÁCTICA Y EL FLUJO DE JUEGO
```text
┌─────────────────────────────────────────────────────────────────┐
│                     🎯 WINTER IS COMING (El Bar)               │
│                     Goals, Backlog, Memoria                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   USUARIO   │────▶│  WORKFLOW   │────▶│    AGENT    │
│(Entrenador) │     │ (Director)  │     │ (Jugador)   │
└─────────────┘     └─────────────┘     └─────────────┘
                            │                    │
                            ▼                    ▼
                     ┌─────────────┐     ┌─────────────┐
                     │   RULES     │     │    SKILLS   │
                     │ (Reglas)    │     │ (Kit)       │
                     └─────────────┘     └─────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │    HOOKS    │
                                      │ (Árbitro)   │
                                      └─────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │    EVALS    │
                                      │ (Scorecard) │
                                      └─────────────┘
```
</dream_team_analogy>

---

## 🗺️ KNOWLEDGE MAPS & ARCHITECTURE (v4.9)

### 1. ESTRUCTURA BASE (Think_Different — v4.9)

```
Think_Different/                           # RAÍZ
├── 00_Winter_is_Coming/          ✅ MATRIX: Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                  ✅ Motor del OS (FUENTE DE VERDAD 💾)
│   │   ├── 00_Workflows_Os/      ✅ 28 workflows (7 categorías)
│   │   ├── 01_Rules/             ✅ 14 reglas (.mdc) — fuente de verdad
│   │   └── 02_Tools/             ✅ Todas las herramientas
│   │       ├── 01_Agents/        ✅ 61 agentes (6 categorías)
│   │       ├── 02_Skills/        ✅ 392 skills (15 áreas funcionales)
│   │       ├── 03_Mcp/           ✅ Backup configs MCP
│   │       ├── 04_Integrations/  ✅ Fireflies, Granola
│   │       ├── 05_Hooks/         ✅ Pre/Post/Lifecycle/Sound/Harness
│   │       ├── 06_Plugins/       ✅ Plugins OS
│   │       ├── 07_Server/        ✅ MCP Server
│   │       ├── 08_Evals/         ✅ Evaluadores
│   │       └── 09_Templates/     ✅ Templates
│   ├── 02_Knowledge/             ✅ Base de conocimiento
│   ├── 03_Task/                  ✅ Tareas activas
│   ├── 04_Operations/            ✅ Todo lo operativo
│   │   ├── 00_Context_LLM/       ✅ Memoria, notas, knowledge brain
│   │   ├── 01_Auto_Improvement/  ✅ Motor auto-mejora
│   │   ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 JARVIS manifests
│   │   ├── 03_Scripts_Os/        ✅ HUBs: 30 — scripts: 163 totales (133 en subdirectorios)
│   │   ├── 04_Installer/         ✅ Instalador del OS
│   │   ├── 05_Projects/          ✅ Proyectos activos
│   │   ├── 06_SOTA_Features/     ✅ Features estado-del-arte
│   │   └── 07_Reports/           ✅ Reportes generados
│   └── 05_Archive/               ✅ Backups, snapshots, archivos históricos
├── 02_Playground/                ✅ Zona de pruebas (no contamina el OS)
├── 03_Resultado/                 ✅ Outputs de proyectos (OIM, Elite Portfolio, etc.)
├── .agent/                       ✅ Backup estratégico
├── .atl/                         ✅ SDD Registry + openspec
├── .claude/                      ✅ Config Claude Code + rules
├── .opencode/                    ✅ Config OpenCode + skills locales
├── .mcp.json                     ✅ MCPs activos (7 Claude + 38 backup)
├── OS_DIRECTORY.md               ✅ JARVIS discovery
├── AGENTS.md                     ✅ Root entry (GGA Pre-Commit)
├── CLAUDE.md                     ✅ Config Oficial para IAs (ESTE)
└── README.md                     ✅ Documentación principal
```

### 2. AGENTS (62 — 6 categorías funcionales — 2026-06-01)

> ⚠️ Source: 61 agentes total (25 root-level .md + 5 Dream Team + 23 Specialists + 5 Growth + 3 other). Ver `OS_DIRECTORY.md` para tree view completo. Backup .agent/ puede diferir en conteo.

### 3. SKILLS (392 — 15 áreas funcionales)

> **Ruta base:** `01_Personal_Os/01_Core/02_Tools/02_Skills/`

| Área                                             | Carpeta                     | Descripción                                                   |
|-------------------------------------------------|----------------------------|--------------------------------------------------------------|
| 00_Agent_Teams_Lite                              | 00_Agent_Teams_Lite/        | SDD sub-agentes + JARVIS manifests                            |
| 00_Compound_Engineering                          | 00_Compound_Engineering/    | Core CE — SDD + Compound Engineering                          |
| 00_Personal_Os                                   | 00_Personal_Os/             | Life OS, Hillary, Rituales                                    |
| 00_Skill_Auditor                                 | 00_Skill_Auditor/           | Auditoría de skills                                           |
| 00_System_Core                                   | 00_System_Core/             | Stack base del OS                                             |
| 00_Workflows                                     | 00_Workflows/               | Workflows OS                                                  |
| 01_Creacion_Contenidos                           | 01_Creacion_Contenidos/     | Brand, YouTube, SEO, Marketing — 16 sub-áreas                 |
| 02_Diseno_Ui_Ux                                  | 02_Diseno_Ui_Ux/            | Product Design, UI/UX, Taste, Minimal                         |
| 03_Video_Media                                   | 03_Video_Media/             | Video Intel, James Cameron                                    |
| 04_Automatizacion                                | 04_Automatizacion/          | N8N, Firecrawl, GWS Client                                    |
| 05_Claude_Ads                                    | 05_Claude_Ads/              | Claude Ads & Promoted Content                                 |
| 06_Tools                                         | 06_Tools/                   | Skill Creator, Testing, DevOps, Data                          |
| 07_Invictus_Web                              | 07_Invictus_Web/            | Playwright, Superpowers, Browser Auto                         |
| 08_JAO                                       | 08_JAO/                     | Entrevistador, Humanizador, Superpowers (6 skills)            |
| 10_Laia_Learning                             | 10_Laia_Learning/           | Sistema de aprendizaje personal (1 skill)                     |

> ⚠️ Audit 2026-06-01: 15 áreas activas, 392 skills (SKILL.md) verificados contra disco

### 4. JARVIS 4.9 — MANIFEST SYSTEM

```text
01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/
├── 01_OS_Inventory.json      # Inventario OS (updated 2026-05-22)
├── 02_MCP_Registry.yaml     # 36 MCPs (+1 Higgfield remote)
├── 03_Agent_Catalog.yaml    # 61 agentes source (referencia al manifest)
├── 04_Skill_Index.json      # 392 skills en 15 áreas (updated 2026-06-01)
├── 05_HUB_Catalog.yaml     # HUBs: 30 — scripts: 163 totales (133 en subdirectorios)
├── 06_Workflow_Graph.yaml   # 28 workflows
└── 07_Hook_Registry.yaml    # 10 hooks (6 categorías)
```

---

## ⚡ AUTOMATION HARNESS Y COMANDOS

**Comandos Rápidos (Alias en bashrc):**
- `gr` o `audit` : Corre el Auditor (Dry-run).
- `gr --apply` : Aplica fixes automáticos.
- `git-hub`, `aipm`, `ritual`, `validate` : Operaciones rápidas directas estructuradas.
- `gr --agents` : Evalúa review de agentes.

**SDD Workflow (Spec-Driven Development):**
- Comandos: `/sdd:init`, `/sdd:explore`, `/sdd:new`, `/sdd:spec`, `/sdd:design`, `/sdd:tasks`, `/sdd:apply`, `/sdd:verify`, `/sdd:archive`.

**Compound Engineering (CE):**
- Comandos: `/ce:ideate`, `/ce:brainstorm`, `/ce:plan`, `/ce:work`, `/ce:review`, `/ce:compound`.

**GGA (Guardian Angel) Code Review:**
- `.agent/05_GGA/bin/gga run` (Revisar archivos staged).
- `.agent/05_GGA/bin/gga install` (Instala pre-commit hook).

**JARVIS 4.0 HUBs Canónicos:**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan     # regenerar 7 manifests
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py               # health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard   # stats ASCII
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report      # MCP drift
```

---

## 📊 ESTADO DEL SISTEMA (v4.9 — 2026-06-01)

| Categoria                         | Estado                     | Notas                                                                    |
|----------------------------------|---------------------------|-------------------------------------------------------------------------|
| **Overall Health**                | **✅ PURE GREEN**           | v4.9 — 2026-06-01 — Docs audit DONE                                      |
| Estructura (4 raíz)               | ✅ PASS                     | Winter / Personal_Os / Playground / Resultado                            |
| HUBs (35 — scripts: 258)           | ✅ PASS                     | 35 HUBs (root) — 258 scripts totales (223 en subdirectorios)                    |
| Skills (392, 15 áreas)            | ✅ VERIFIED                 | 15 áreas funcionales — referencia al manifest                             |
| Agent Matrix                      | ✅ SYNCED                   | 61 agentes (25 root + 5 Dream + 23 Spec + 5 Growth + 3 other)            |
| Manifest (7 archivos)             | ✅ VALIDATED                | 00_Manifest/ en 02_Agent_Teams_Lite/                                     |
| MCPs (7+38 Claude / 36 OpenCode)  | ✅ SYNCED                   | drift: 0 (ambos configs alineados)                                       |
| Rules (14 .mdc)                   | ✅ DEFINED                  | 01_Rules/ (00-13 + 13_HTML_Visualization)                                |
| Workflows (28)                    | ✅ ACTIVE                   | 7 categorías en 00_Workflows_Os (1+10+8+2+2+4+1)                        |
| Hooks (10, 6 fases)               | ✅ ACTIVE                   | 05_Hooks/                                                                |
| Agent Teams Protocol              | ✅ ACTIVE                   | Super Campeones                                                          |

---

## 🤖 JARVIS — 4.9 (2026-06-01)

### Quick Access
```bash
# OS Directory (raíz)
cat OS_DIRECTORY.md

# HUBs principales JARVIS
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report
```

### Ecosistemas Integrados

| Ecosistema                                  | Ubicación                                                                                   |
|--------------------------------------------|--------------------------------------------------------------------------------------------|
| Personal OS Core                            | `00_Winter_is_Coming/AGENTS.md`                                                             |
| Compound Engineering                        | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/`                        |
| Dream Team                                  | `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/`                                  |
| Specialists                                 | `01_Personal_Os/01_Core/02_Tools/01_Agents/02_Specialists_Compound/`                        |
| Gentleman GGA                               | `.agent/05_GGA/`                                                                            |

### Configuración MCP (dual)

| Herramienta                                | Config activa                                                 | Source (backup)                                             |
|-------------------------------------------|--------------------------------------------------------------|------------------------------------------------------------|
| **Claude Code**                            | `.mcp.json` (raíz del proyecto)                               | `01_Personal_Os/01_Core/02_Tools/03_Mcp/`                   |
| **OpenCode**                               | `~/.config/opencode/opencode.json`                            | `01_Personal_Os/01_Core/02_Tools/03_Mcp/`                   |

> ⚠️ Al modificar MCPs: actualizar SIEMPRE el source Y el config activo correspondiente.

---

## 📍 PATHS CRÍTICOS (v4.9)

| Recurso                                   | Path CORRECTO                                                                  |
|------------------------------------------|-------------------------------------------------------------------------------|
| Skills                                    | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                                   |
| Agents                                    | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                                   |
| Rules                                     | `01_Personal_Os/01_Core/01_Rules/`                                             |
| HUBs                                      | `01_Personal_Os/04_Operations/03_Scripts_Os/`                                  |
| Workflows                                 | `01_Personal_Os/01_Core/00_Workflows_Os/`                                      |
| Tasks                                     | `01_Personal_Os/03_Task/`                                                      |
| Knowledge                                 | `01_Personal_Os/02_Knowledge/`                                                 |
| Context LLM                               | `01_Personal_Os/04_Operations/00_Context_LLM/`                                 |

> ⚠️ NO usar rutas legacy v1.x; usar únicamente las rutas canónicas listadas arriba.

---

**Última actualización:** 2026-06-01 (Audit Completo + Fixes)
**Versión:** v4.9 Consequences — Judgment Day v3 — Full Project Sync — Audit Completo

> ✅ **Migración v4.0 2026-05-13:** Production Ready. Pure Green State. Paths corregidos.
> ✅ **Judgment Day v3 2026-05-31:** Docs syncronizados. Counts corregidos. Full project scan.
> ✅ **Audit 2026-05-23:** Full project audit v2. Submodule OIM fixed. 21 CE skills registered. Docs pixel-perfect.
> ✅ **Audit 2026-06-01:** SSOT Unification v4.9. Counts actualizados: Rules 14, HUBs 30, Workflows 28, Skills 392 (15 áreas), Agents 62. Ver manifest en 00_Manifest/ para SSOT.

© 2026 PersonalOS v4.9 Consequences Production Ready

## graphify

This project has a knowledge graph at Graphify_Out/ with god nodes, community structure, and cross-file relationships.
- For codebase questions, first run `graphify query "<question>"` when Graphify_Out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If Graphify_Out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read Graphify_Out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
>>>>>>> Stashed changes
