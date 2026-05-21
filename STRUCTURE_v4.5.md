# 📁 ESTRUCTURA COMPLETA — Think Different PersonalOS v4.5 Consequences

> **Versión:** 4.5 Consequences
> **Fecha:** 2026-05-20
> **Estado:** Production Ready

---

## 🏠 RAÍZ — 4 Carpetas Principales

```
Think_Different/                    # RAÍZ
├── 00_Winter_is_Coming/           # Goals, Backlog, Memoria estratégica
├── 01_Personal_Os/                # SISTEMA OPERATIVO (FUENTE DE VERDAD)
├── 02_Playground/                  # Zona de pruebas y experimentos
└── 03_Resultado/                   # Outputs de proyectos
```

### 📝 Notas de la Raíz

| Carpeta | Propósito |
|---------|----------|
| **00_Winter_is_Coming** | Dirección estratégica. Aquí van Goals, Backlog, AGENTS.md (GGA), CHANGELOG. Es el "cerebro" que define qué hacer y por qué. |
| **01_Personal_Os** | EL SISTEMA OPERATIVO. Todo el motor del OS vivo aquí. Reglas, skills, agentes, HUBs, workflows. NO se toca directamente — todo pasa por los workflows. |
| **02_Playground** | Zona de pruebas. Skills nuevas, flujos experimentales, tests. Lo validado aquí se migra al OS. NO contaminar el OS con experimentos. |
| **03_Resultado** | Outputs de proyectos. Entregables, reportes, contenido generado. Es el "almacén" de resultados, no el lugar de trabajo. |

---

## 📂 01_Personal_Os — Sistema Operativo (FUENTE DE VERDAD)

### 📝 Propósito
El corazón del PersonalOS. Aquí vive todo lo que hace funcionar el sistema: reglas, skills, agentes, HUBs, workflows, memoria, conocimiento.

```
01_Personal_Os/
├── 01_Core/                       # MOTOR DEL OS
│   ├── 00_Workflows_Os/          # 29 workflows (7 categorías)
│   ├── 01_Rules/                 # 12 reglas .mdc
│   └── 02_Tools/                 # Herramientas del OS
│       ├── 01_Agents/            # 82 agentes
│       ├── 02_Skills/           # 356 skills (12 áreas)
│       ├── 03_Mcp/              # Backup MCP configs
│       ├── 04_Integrations/     # Fireflies, Granola
│       ├── 05_Hooks/            # 10 hooks (6 fases)
│       ├── 06_Plugins/          # Plugins OS
│       ├── 07_Server/           # Engram server
│       ├── 08_Evals/            # Evaluadores
│       └── 09_Templates/        # Templates
│
├── 02_Knowledge/                 # Base de conocimiento
├── 03_Task/                      # Tareas activas
├── 04_Operations/                 # MOTOR OPERATIVO
└── 05_Archive/                   # LEGADO
```

### 📝 Notas de 01_Personal_Os

| Subcarpeta | Propósito | Contenido |
|------------|-----------|------------|
| **01_Core** | El motor. Reglas que gobiernan, herramientas que ejecutan. | workflows, rules, agents, skills, hooks, plugins |
| **02_Knowledge** | Base de conocimiento. Documentación, research, templates. | Docs, ejemplos, research, templates |
| **03_Task** | Tareas activas. Backlog, inbox, tareas completadas. | Pendientes, en progreso, done |
| **04_Operations** | El operativo. HUBs que ejecutan, memoria LLM, auto-mejora. | Scripts, métricas, sync, mejoras |
| **05_Archive** | Legado. Lo que ya no está activo pero se preserva. | Backups, auditorías, contenido legacy |

---

### 📂 01_Core — Motor del OS

#### 📝 00_Workflows_Os — Workflows (29 workflows, 7 categorías)

| Categoría | Workflows | Propósito |
|----------|-----------|----------|
| **00_Learning_Always** | Continuo | Learning permanente del sistema |
| **01_Personal_Os** | 4 principales | Morning, Backlog, Content, Weekly |
| **02_Marvel** | Iron Man, Spider, Thor, Hulk | Identidades temáticas para ejecución experta |
| **03_Gentleman** | Frontend, Docs | Diseño premium y redacción técnica |
| **04_Hillary** | Life OS | Gestión integral del inbox |
| **05_Compound_Engineering** | CE | Metodología de ingeniería avanzada |
| **06_Youtube_Full_Video** | Video | Pipeline de producción de video |

> **Regla:** Todo trabajo pasa por un workflow. No se trabaja directo en carpetas.

#### 📝 01_Rules — Reglas del Sistema (12 .mdc)

| Regla | Propósito |
|-------|----------|
| **00_Core_Protocol.mdc** | Protocolo core del OS |
| **01_Pilares_Sistema.mdc** | Pilares fundamentales |
| **02_Motor_Agent.mdc** | Motor de agentes |
| **03_Protocolos_Ejecucion.mdc** | Protocolos de ejecución |
| **04_Observabilidad.mdc** | Sistema de observación |
| **05_Reporting.mdc** | Reportes y métricas |
| **06_Contexto_Gestion.mdc** | Gestión de contexto |
| **07_Docs_Guias.mdc** | Convenciones de nomenclatura |
| **08_Token_Economy.mdc** | Economía de tokens |
| **09_Agent_Teams_Protocol.mdc** | Protocolo de equipos de agentes |
| **10_Git_Directions.mdc** | Direcciones Git |
| **11_Minimax.mdc** | Configuración Minimax |

#### 📝 02_Tools — Herramientas del OS

| Herramienta | Cantidad | Propósito |
|-------------|----------|-----------|
| **01_Agents** | 82 | Orquestación multi-agente. Dream Team (5) + Specialists (24+) + Individuales |
| **02_Skills** | 356 | 12 áreas funcionales. Skills que el sistema sabe ejecutar |
| **03_Mcp** | - | Backup de configs MCP |
| **04_Integrations** | - | Fireflies, Granola (integraciones externas) |
| **05_Hooks** | 10 | Ganchos en 6 fases: Pre/Post Tool, Lifecycle, Sound, Harness, Post_Hulk |
| **06_Plugins** | - | Plugins extensible del OS |
| **07_Server** | - | Engram server (memoria persistente) |
| **08_Evals** | - | Evaluadores de código |
| **09_Templates** | - | Templates reutilizables |

**Skills por Área:**

| Área | Skills | Descripción |
|------|--------|-------------|
| 00_Compound_Engineering | 63 | Core CE — SDD + Compound Engineering |
| 00_Personal_Os_Stack | 1 | Stack base OS + Gcierr |
| 00_Skill_Auditor | 4 | Auditoría de skills |
| 01_Creacion_Contenidos | 38 | Brand, YouTube, SEO, Carruseles |
| 02_Diseno_Ui_Ux | 23 | Product Design, UI/UX, Taste, Minimal |
| 03_Video_Media | 6 | Video Intel, James Cameron |
| 04_Automatizacion | 21 | N8N, Firecrawl, GWS Client |
| 05_Workflows | 33 | Agent Teams, PM, Orchestrator |
| 06_Tools | 93 | Skill Creator, Testing, DevOps, Data |
| 07_Personal_Os | 29 | Life OS, Hillary, Rituales |
| 08_Invictus_Web | 14 | Playwright, Superpowers, Browser Auto |
| 09_Claude_Ads | 20 | Claude Ads integration |

---

### 📂 02_Knowledge — Base de Conocimiento

```
02_Knowledge/
├── 00_Examples_Personal_Os/
├── 01_Research_Os/
├── 02_Research/
├── 03_Writing_Content/
├── 04_Docs/
├── 05_Aipm/
├── 06_Unicorn/
├── 07_Invictus/
├── 08_Templates/
└── README.md
```

> **Propósito:** Documentación, research, plantillas. El conocimiento estructurado del OS.

---

### 📂 03_Task — Tareas Activas

```
03_Task/
├── 00_P0_Auditoria.md/          # Auditoría activa
├── 00_Templates/                # Templates de tareas
├── 01_P0_System_Guardian_Test.md
├── 01_Tasks_Done/               # Tareas completadas
├── 02_Hillary_Inbox/            # Inbox de Hillary
├── 02_P1_Consolidated_Tasks.md
├── 03_P1_Documentacion_Sistema.md
├── 04_P1_Estructura_Carpetas.md
├── 05_P1_Documentar_Sistema.md
├── 06_P2_Audience_Growth.md
├── 07_Test_Content_Draft.md
├── 08_P2_Deuda_Tecnica_Paths_Legacy.md
└── README.md
```

> **Propósito:** Tareas pendientes, en progreso, y completadas.Seguimiento de trabajo activo.

---

### 📂 04_Operations — Motor Operativo

```
04_Operations/
├── 00_Context_LLM/          # Memoria LLM (Engram)
├── 01_Auto_Improvement/     # Motor auto-mejora
├── 02_Agent_Teams_Lite/     # SDD + 7 JARVIS manifests
├── 03_Scripts_Os/          # 31 HUBs/scripts
├── 04_Installer/           # Scripts de instalación
├── 05_Projects/             # Proyectos activos
├── 06_SOTA_Features/        # Features SOTA
├── GOVERNANCE.md
├── README.md
└── RUNBOOK.md
```

| Subcarpeta | Propósito |
|------------|-----------|
| **00_Context_LLM** | Memoria LLM. Engram, process notes, knowledge brain, plans, solutions |
| **01_Auto_Improvement** | Motor de auto-mejora recursiva |
| **02_Agent_Teams_Lite** | SDD registry + 7 JARVIS manifests |
| **03_Scripts_Os** | 31 HUBs/scripts operativos |
| **04_Installer** | Scripts de instalación del OS |
| **05_Projects** | Proyectos activos |
| **06_SOTA_Features** | Features de última generación |

#### 📝 HUBs JARVIS (31 scripts)

| HUB ★ | Script | Propósito |
|-------|--------|-----------|
| Sound Engine | 00_Sound_Engine.py | Notificaciones sonoras |
| Auditor | 01_Auditor_Hub.py | Auditorías del sistema |
| Git | 02_Git_Hub.py | Operaciones Git |
| AIPM | 03_AIPM_Hub.py | AI Performance Monitoring |
| Ritual | 04_Ritual_Hub.py | Rituales de sesión |
| Validator | 05_Validator_Hub.py | Validación de código |
| Tool | 06_Tool_Hub.py | Gestión de herramientas |
| Integration | 07_Integration_Hub.py | Integraciones MCP |
| Workflow | 08_Workflow_Hub.py | Automatización de workflows |
| Data | 09_Data_Hub.py | Procesamiento de datos |
| General | 10_General_Hub.py | Utilidades generales |
| Auto Learn | 11_Auto_Learn_Hub.py | Motor de automejora |
| Health Metrics ★ | 14_Health_Metrics_Hub.py | Métricas de salud del OS |
| MCP Sync ★ | 15_MCP_Sync_Hub.py | Sync Claude ↔ OpenCode |
| Watchdog ★ | 17_Watchdog_Hub.py | Health watchdog |
| Telemetry ★ | 18_Telemetry_Hub.py | Dashboard de métricas |
| Agent Sync | 19_Agent_Sync_Hub.py | Sync .agent ↔ 01_Core |
| System Mapper ★ | 20_System_Mapper_Hub.py | Genera 7 manifests JARVIS |

> ★ = HUB canónico JARVIS 4.5

---

### 📂 05_Archive — Legado

```
05_Archive/
├── 00_Backup_Os/             # Backup completo del OS
├── 01_Repos_Reference/     # Repos upstream y referencias
├── 02_Legacy_Content/      # Contenido legacy
├── 03_Backups_Audits/     # Backups y auditorías
└── README.md
```

| Subcarpeta | Propósito |
|------------|-----------|
| **00_Backup_Os** | Backup completo del OS antes de reorganizaciones |
| **01_Repos_Reference** | Repos clonados de upstream (engram, gentle-ai, etc.) |
| **02_Legacy_Content** | Contenido antiguo: planes, docs, skills legacy |
| **03_Backups_Audits** | Backups, snapshots, reportes de auditoría |

> **Regla:** Archive es solo lectura histórica. No modificar contenido archivado.

---

## 🎮 02_Playground — Zona de Pruebas

```
02_Playground/
├── 00_Momentum/                  # Workflows mirror
│   ├── 01_Personal_Os/          # Morning, Backlog, Content, Weekly
│   ├── 02_Marvel/               # Iron Man, Spider, Thor, Hulk
│   ├── 02_Mom_Projects/         # Proyectos en momentum
│   ├── 03_Gentleman/            # Frontend Premium, Docs
│   ├── 04_Hillary/              # Life OS
│   ├── 05_Compound_Engineering/ # CE workflows
│   └── 06_Testing_Youtube/      # Testing pipeline YouTube
│       ├── 01_Agents/
│       ├── 02_Outputs/
│       ├── 03_Sessions/
│       ├── 04_Tests/
│       └── 05_Skills_Test/
│
├── 01_OS_Health_Test.py         # Test de salud del OS
├── 02_OS_Deep_Audit.py          # Auditoría profunda
├── 03_OS_Runtime_Test.py        # Test runtime
├── 02_Reports/                  # Reportes generados
├── 02_Workflow_N8N/            # N8N workflows
├── 03_Branders_Skills/          # Skills de marca
└── README.md
```

> **Propósito:** Zona de pruebas y experimentos. Todo lo validado se integra al OS.

---

## 📤 03_Resultado — Outputs de Proyectos

```
03_Resultado/
├── 00_Output_Skills/            # Skills generadas
├── 00_Recursos_Varios/          # Recursos varios
├── 00_Think_Different.code-workspace
├── 01_Planes/                   # Planes de proyectos
├── 02_Revisar_Now/              # Material para revisar
├── 03_Revisar_Planes/           # Planes para revisar
├── 04_Reportes/                  # Reportes del sistema
├── 05_Frontend_Slides_Exercise/  # Ejercicios de frontend
├── 06_Huashu_Design_Exercise/   # Ejercicios de diseño Huashu
├── 07_Referencias_Pre/           # Referencias/preliminares
├── 08_Fundamentos_AI/           # Fundamentos de AI
├── 09b_World_OIM/              # Proyecto OIM
├── 10_Contenido_Learning/       # Contenido de learning
├── 11_Pruebas_Ads/              # Pruebas de ads
├── 12_Clinica_Infantil/          # Proyecto Clinica Infantil
├── 13_Sessions/                 # Sesiones de audit
├── 14_Imagenes_Finales/          # Imágenes finales
├── Design.md
├── Pattern_Intelligence_Results.md
└── README.md
```

> **Propósito:** Entregables de proyectos. NO es lugar de trabajo, es almacén de resultados.

---

## 🔧 .agent — Backup Estratégico

```
.agent/
├── 00_Rules/
├── 01_Agents/
├── 02_Skills/
├── 03_Workflows/
├── 04_Extensions/
├── 05_GGA/                     # Guardian Angel (code review)
├── CLAUDE.md
├── README.md
└── WORKSPACE.md
```

> **Propósito:** Backup estratégico. Sincronizado con 01_Personal_Os.

---

## ⚙️ Archivos de Configuración Raíz

| Archivo | Propósito |
|---------|----------|
| **.mcp.json** | 36 MCPs Claude Code |
| **.claude/** | Config Claude Code |
| **.opencode/** | Config OpenCode + skills locales |
| **.atl/** | SDD Registry + openspec/ |
| **.env** | Variables de entorno |
| **.gga** | Guardian Angel config |
| **AGENTS.md** | GGA Pre-Commit entry |
| **CLAUDE.md** | Config IAs (FUENTE) |
| **OS_DIRECTORY.md** | JARVIS discovery |
| **README.md** | Documentación principal |
| **STRUCTURE_v4.5.md** | Este archivo — estructura completa |

---

## 📊 ESTADO DEL SISTEMA v4.5

| Componente | Total | Estado |
|-----------|-------|--------|
| Skills | 356 | ✅ |
| Agentes | 82 | ✅ |
| Rules | 12 | ✅ |
| MCPs | 36 | ✅ |
| HUBs | 31 | ✅ |
| Workflows | 29 | ✅ |

---

## 📋 CONVENCIONES DE NOMENCLATURA

| Tipo | Estándar | Ejemplo |
|------|----------|---------|
| Archivos de código | snake_case.py | `os_health_test.py` |
| Archivos de datos | Pascal_Case + guion_bajo | `OS_Health_2026-05-20_12-24-20.txt` |
| Carpetas principales | XX_Nombre | `00_Winter_is_Coming` |
| SKILL.md | SKILL.md (fijo) | `Skills/.../SKILL.md` |
| Scripts HUBs | NN_Nombre_Hub.py | `20_System_Mapper_Hub.py` |
| Archivos 00_ | 00_ prefix = NO TOCAR | `00_SALUD_REPORTS.md` |

### Reglas de Secuencia
1. **Enumeración limpia** — Sin huecos ni duplicados
2. **00_ = No tocar** — Archivos de referencia rápida
3. **Duplicados** — Usar sufijo `b` (ej: `09b_World_OIM`)

---

## ⚠️ EXCEPCIONES / PERMISOS

| Ruta | Problema | Solución |
|------|----------|----------|
| `02_Playground/.../05_Skills_Test/12_Content_Ideation` | Permission denied | Carpeta anidada, no afecta enumeración |

---

## ✅ PURE GREEN STATE

**Think Different PersonalOS v4.5 Consequences — 2026-05-20**

*Sequencias corregidas, convenciones documentadas, estructura organizada.*
*Structure complete: ver `STRUCTURE_v4.5.md`*

---

## 📖 GUÍA RÁPIDA DE USO

### Para trabajar en el OS:
1. Leer `00_Winter_is_Coming/AGENTS.md` para contexto
2. Usar workflows en `01_Personal_Os/01_Core/00_Workflows_Os/`
3. Ejecutar HUBs desde `04_Operations/03_Scripts_Os/`

### Para probar algo nuevo:
1. Ir a `02_Playground/`
2. Crear en subcarpeta correspondiente
3. Validado → migrar a ubicación correcta en OS

### Para archivar algo:
1. Mover a `05_Archive/` en carpeta correspondiente
2. Crear/actualizar README si es nueva carpeta

### Para consultar estado del sistema:
1. `python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py`
2. `python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard`