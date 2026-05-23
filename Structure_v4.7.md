# 📁 ESTRUCTURA COMPLETA — Think Different PersonalOS v4.7 Consequences

> **Versión:** 4.7 Consequences
> **Fecha:** 2026-05-23
> **Estado:** Production Ready
> **Audit:** 2026-05-23 — Audit v2: 23 duplicates removed, 3 folders synced, docs pixel-perfect

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
| **00_Winter_is_Coming** | Dirección estratégica. Goals, Backlog, AGENTS.md (GGA), CHANGELOG. |
| **01_Personal_Os** | EL SISTEMA OPERATIVO. Skills, agentes, HUBs, workflows, memoria. |
| **02_Playground** | Zona de pruebas. Skills nuevas, flujos experimentales. |
| **03_Resultado** | Outputs de proyectos. Entregables, reportes, contenido generado. |

---

## 📂 01_Personal_Os — Sistema Operativo (FUENTE DE VERDAD)

```
01_Personal_Os/
├── 01_Core/                       # MOTOR DEL OS
│   ├── 00_Workflows_Os/          # 30 workflows (7 categorías)
│   ├── 01_Rules/                 # 12 reglas .mdc
│   └── 02_Tools/                 # Herramientas del OS
│       ├── 01_Agents/            # 46 agentes
│       ├── 02_Skills/           # 394 skills (12 áreas)
│       ├── 03_Mcp/              # Backup MCP configs
│       ├── 04_Integrations/     # Fireflies, Granola
│       ├── 05_Hooks/            # 10 hooks (6 fases)
│       ├── 06_Plugins/          # Plugins OS
│       ├── 07_Server/           # Engram server
│       ├── 08_Evals/            # Evaluadores
│       └── 09_Templates/        # Templates
├── 02_Knowledge/                 # Base de conocimiento
├── 03_Task/                      # Tareas activas (18 tareas P0-P3)
├── 04_Operations/                 # MOTOR OPERATIVO
│   ├── 00_Context_LLM/          # Memoria LLM
│   ├── 01_Auto_Improvement/     # Motor auto-mejora
│   ├── 02_Agent_Teams_Lite/     # SDD + 7 JARVIS manifests
│   ├── 03_Scripts_Os/          # 19 HUBs + 284 scripts (recursivo)
│   ├── 04_Installer/           # Scripts de instalación
│   ├── 05_Projects/             # Proyectos activos
│   │   └── 01_Projects_Lab/    # Lab de proyectos (9 proyectos)
│   ├── 06_SOTA_Features/        # Features SOTA
│   └── 07_Reports/              # Reports (OFICIAL, 10_Reports eliminado)
└── 05_Archive/                   # LEGADO
```

---

## 📂 01_Core — Motor del OS

### 00_Workflows_Os — Workflows (30 workflows, 7 categorías)

| Categoría | Workflows | Propósito |
|----------|-----------|----------|
| **00_Learning_Always** | Continuo | Learning permanente |
| **01_Personal_Os** | 4 principales | Morning, Backlog, Content, Weekly |
| **02_Marvel** | Iron Man (Genesis), Spider, Thor, Hulk | Identidades temáticas |
| **03_Gentleman** | Frontend, Docs | Diseño premium y redacción |
| **04_Hillary** | Life OS | Gestión inbox |
| **05_Compound_Engineering** | CE | Ingeniería avanzada |
| **06_Youtube_Full_Video** | Video | Pipeline producción video |

### 01_Rules — Reglas (12 .mdc)

| Regla | Propósito |
|-------|----------|
| **00_Core_Protocol.mdc** | Protocolo core |
| **01_Pilares_Sistema.mdc** | Pilares fundamentales |
| **02_Motor_Agent.mdc** | Motor de agentes |
| **03_Protocolos_Ejecucion.mdc** | Protocolos de ejecución |
| **04_Observabilidad.mdc** | Sistema de observación |
| **05_Reporting.mdc** | Reportes y métricas |
| **06_Contexto_Gestion.mdc** | Gestión de contexto |
| **07_Docs_Guias.mdc** | Convenciones |
| **08_Token_Economy.mdc** | Economía de tokens |
| **09_Agent_Teams_Protocol.mdc** | Protocolo de equipos |
| **10_Git_Directions.mdc** | Direcciones Git |
| **11_Minimax.mdc** | Configuración Minimax |

### 02_Tools — Herramientas del OS

| Herramienta | Cantidad | Propósito |
|-------------|----------|-----------|
| **01_Agents** | 58 .md (16 root + 42 subcarpetas) | Orquestación multi-agente |
| **02_Skills** | 394 | 12 áreas funcionales |
| **03_Mcp** | - | Backup configs MCP |
| **04_Integrations** | - | Fireflies, Granola |
| **05_Hooks** | 10 | Ganchos 6 fases |
| **06_Plugins** | - | Plugins OS |
| **07_Server** | - | Engram server |
| **08_Evals** | - | Evaluadores |
| **09_Templates** | - | Templates |

**Agentes por Categoría (numeración secuencial 00-19):**

| # | Categoría | Tipo | Cantidad |
|---|-----------|------|----------|
| 00 | Orchestrator / Agent_Template | Root | 2 archivos |
| 01 | Dream Team | Subdirectorio | 5 agentes + README |
| 02 | Specialists Compound | Subdirectorio | 23 agentes + README |
| 03 | Growth | Subdirectorio | 5 agentes + README |
| 04 | Contexto | Subdirectorio | 1 agente + README |
| 05 | Marca | Subdirectorio | 1 agente + README |
| 06 | Plantillas | Subdirectorio | 1 agente + README |
| 07-13 | Individuales (Accessibility → Hillary) | Root | 7 archivos |
| 14-19 | Specialist Individuales (Git → TDD) | Root | 6 archivos |
| | **TOTAL** | | **58 .md agent files** |

**Skills por Área:**

| Área | Skills | Descripción |
|------|--------|-------------|
| 00_Compound_Engineering | 63 | Core CE — SDD + CE workflow skills |
| 00_Personal_Os_Stack | 1 | Stack base OS |
| 00_Skill_Auditor | 1 | Auditoría de skills |
| 01_Creacion_Contenidos | 40 | Brand, YouTube, SEO, Carruseles |
| 02_Diseno_Ui_Ux | 29 | Product Design, UI/UX, Taste, Minimal |
| 03_Video_Media | 7 | Video Intel, James Cameron |
| 04_Automatizacion | 37 | N8N, Firecrawl, GWS Client |
| 05_Workflows | 37 | Agent Teams, PM, Orchestrator |
| 06_Tools | 112 | Skill Creator, Testing, DevOps, Data Analyst |
| 07_Personal_Os | 32 | Life OS, Hillary, Rituales |
| 08_Invictus_Web | 15 | Playwright, Superpowers, Browser Auto |
| 09_Claude_Ads | 20 | Claude Ads & Promoted Content |

---

## 📂 02_Knowledge — Base de Conocimiento

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

---

## 📂 03_Task — Tareas Activas

```
03_Task/
├── 00_P0_Auditoria.md/
├── 00_Templates/
├── 01_Tasks_Done/
├── 02_Hillary_Inbox/
├── 10_Task_Elite_Portfolio_P1.md     # P1
├── 11_Task_OIM_Website_P1.md          # P1
├── 12_Task_PreCommit_API_Keys_P2.md   # P2
├── 13_Task_Onboarding_New_Machine_P2.md # P2
├── 14_Task_Automate_Reports_P3.md     # P3 ✅ RESUELTO
├── 15_Task_Revisar_Marvel_Workflows_P3.md # P3
├── 16_Task_Revisar_Ritual_Cierre_P3.md # P3
├── 17_Task_Evaluar_Avengers_Plan_P3.md # P3
└── README.md
```

---

## 📂 04_Operations — Motor Operativo

### 05_Projects / 01_Projects_Lab — Proyectos

```
05_Projects/01_Projects_Lab/
├── 01_Efrain_World/
├── 02_Cassette/
├── 03_Side_Project_Backup/
├── 04_Macano_Rest/
│   └── APP/frontend/
├── 05_OBAND/               # ✅ Deps actualizadas
├── 06_OIM_Original/       # ✅ Deps actualizadas
├── 07_Backup_OIM/
├── 08_Elite_Portfolio/    # ✅ DEPS OK (framer-motion 12.40.0)
└── 09_Valeria/
```

### 07_Reports — Reports (OFICIAL)

```
07_Reports/
├── README.md               # ✅ Actualizado a 07_Reports
├── 00_Templates/
└── 01_Generated/
```

---

## 📂 05_Archive — Legado

```
05_Archive/
├── 00_Backup_Os/             # Backup completo OS
├── 01_Repos_Reference/     # Repos upstream
│   ├── 23_Tubemaster/
│   ├── engram/
│   └── gentle-pi/          # ✅ Actualizado a 848a1fd62
├── 02_Legacy_Content/      # Contenido legacy
├── 03_Backups_Audits/     # Backups y auditorías
└── README.md
```

---

## 🎮 02_Playground — Zona de Pruebas

```
02_Playground/
├── 00_Momentum/              # Agenda momentum (7 subcarpetas)
├── 01_Branders_Skills/       # Skills de branding (10 archivos)
├── 02_Workflow_N8N/          # ⚠️ A renombrar a 04_Workflow_N8N (locked)
├── 03_Reports/               # Reportes generados
├── 04_Side Project/          # Oil Brain (repo propio, ignorado)
├── 05_OS_Health_Test.py      # Test de salud
├── 06_OS_Deep_Audit.py       # Auditoría profunda v2
├── 07_OS_Runtime_Test.py     # Test runtime v3
├── 08_OS_Runtime_Test.py     # Test runtime v2 (ex-02_ renombrado)
├── Kit_Diseño_Top.md         # Guía diseño legacy
└── README.md
```

---

## 📤 03_Resultado — Outputs de Proyectos

```
03_Resultado/
├── .opencode/                   # ✅ Deps actualizadas
├── 00_Output_Skills/
├── 00_Recursos_Varios/
├── 01_Planes/
├── 02_Revisar_Now/
├── 03_Revisar_Planes/
├── 04_Reportes/
├── 05_Frontend_Slides_Exercise/
├── 06_Huashu_Design_Exercise/
├── 07_Referencias_Pre/
├── 08_Fundamentos_AI/
├── 09_World_OIM/               # 4 variantes OIM
│   ├── 01_OIM_Website_v2/
│   ├── 02_OIM_Website/
│   ├── 03_OIM_Website_One/
│   ├── 04_OIM_Website_Backup/
│   └── Imagenes_Finales/
├── 10_Contenido_Learning/
├── 11_Pruebas_Ads/
├── 12_Clinica_Infantil/
├── 13_Sessions/
├── 14_Imagenes_Finales/
├── 15_AI_News_Weekly_20260522/  # ✅ Reporte ejecutado
├── 16_Side Project/             # Oil/Brain (repo propio, ignorado)
├── Design.md
├── Pattern_Intelligence_Results.md
└── README.md
```

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
| **CLAUDE.md** | Config IAs (FUENTE) — Boot Protocol强化 |
| **OS_DIRECTORY.md** | JARVIS discovery |
| **STRUCTURE_v4.7.md** | Este archivo — estructura completa |

---

## 📊 ESTADO DEL SISTEMA v4.7

| Componente | Total | Estado |
|-----------|-------|--------|
| Skills | 394 (12 áreas) | ✅ |
| Agentes | 59 files (75 .md + SDD/CE → 82 total) | ✅ |
| Rules | 12 (.mdc 00-11) | ✅ |
| MCPs | 36 | ✅ |
| HUBs | 19 _Hub.py + 12 auxiliares = 31 py | ✅ |
| Scripts | 284 (recursivo en 03_Scripts_Os/) | ✅ |
| Workflows | 30 (7 categorías) | ✅ |
| CE Skills in opencode.json | 36+8 = 44 | ✅ |
| Projects (Lab) | 9 | ✅ |

---

## 🔥 BOOT PROTOCOL — IRON MAN GENESIS (v4.7)

Al iniciar sesión, ejecutar EN ORDEN:

1. Leer `00_Winter_is_Coming/AGENTS.md`
2. Leer `00_Winter_is_Coming/GOALS.md`
3. Leer `00_Winter_is_Coming/BACKLOG.md`
4. Leer rules con `alwaysApply: true`
5. Leer `.agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md`
6. `engram_mem_context(limit=10)`
7. Process notes recientes
8. Tasks status s/b
9. Reportar contexto

⚠️ **REGLA DE ORO:** Sin lectura completa, NO hay respuesta.

---

## 📋 CONVENCIONES DE NOMENCLATURA

| Tipo | Estándar | Ejemplo |
|------|----------|---------|
| Archivos de código | snake_case.py | `os_health_test.py` |
| Archivos de datos | Pascal_Case + guion_bajo | `OS_Health_2026-05-22.txt` |
| Carpetas principales | XX_Nombre | `00_Winter_is_Coming` |
| SKILL.md | SKILL.md (fijo) | `Skills/.../SKILL.md` |
| Scripts HUBs | NN_Nombre_Hub.py | `20_System_Mapper_Hub.py` |
| Archivos 00_ | 00_ prefix = NO TOCAR | `00_SALUD_REPORTS.md` |

**Reglas de Secuencia:**
1. **Enumeración limpia** — Sin huecos ni duplicados
2. **00_ = No tocar** — Archivos de referencia rápida
3. **Renombrados** — `09b_World_OIM` → `09_World_OIM` (audit v2)

---

## ✅ PURE GREEN STATE

**Think Different PersonalOS v4.7 Consequences — 2026-05-23**

*Audit v2 complete. Submodule OIM fixed. 21 CE skills registered. Docs pixel-perfect. Ready for production.*

---

*Versión: v4.7 Consequences*
*Audit: 2026-05-23*
*Skills: 394 | Agents: 46 | MCPs: 36 | HUBs: 19*