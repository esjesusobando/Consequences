# Scripts Index — PersonalOS Think Different v4.0 Consequences

> **Total Scripts:** 98+ (HUBs + módulos + utilities)
> **Total HUBs:** 23 (v4.0 + JARVIS 3.1)
> **Last Updated:** 2026-05-10
> **Validation:** Production Ready — Sistema PURE GREEN v4.0 Consequences
> **Migration:** 12 scripts moved to skills using get_skill_script()
> **New:** 13_Auditors_Os folder + HUBs 14-23 (JARVIS 3.1)
> **Migration:** 12 scripts moved to skills using get_skill_script()
> **New:** 13_Auditors_Os folder + HUBs 14-18 (JARVIS 3.0)

---

## 📊 Estado del Sistema (Post-Migration 2026-04-20)

| Auditoría                           | Estado                   | Notas                                                                  |
|-------------------------------------|--------------------------|------------------------------------------------------------------------|
| **Estructura**                      | ✅ PASS                   | 10 carpetas (00-13) válidas                                            |
| **Health**                          | ✅ PASS                   | SALUDABLE                                                              |
| **Skills**                          | ✅ FIXED                  | 22 categorías — 100% con SKILL.md                                      |
| **13_Auditors_Os**                  | ✅ NEW                    | Utilities + Beautify scripts                                           |
| **Hub 07 rutas**                    | ✅ FIXED                  | `09_Integration/` (antes `Integration_Fixed`)                          |
| **Hub 08 rutas**                    | ✅ FIXED                  | `04_Workflow/` (antes `Workflow_Fixed`)                                |
| **PYTHONPATH**                      | ✅ FIXED                  | Todos los hubs pasan PYTHONPATH a sub-scripts                          |
| **Scripts legacy**                  | ✅ MOVED                  | 9 scripts migrados de 10_Legacy a módulos                              |
| **Hooks Windows**                   | ✅ FIXED                  | WinError 5 + emoji encoding resueltos                                  |
| **Script Migration**                | ✅ DONE                   | 12 scripts → skills using get_skill_script()                           |
| **10_Legacy**                       | ✅ ARCHIVED               | `.backup/10_Legacy_backup_20260420/`                                   |
| **HUBs 14-18**                      | ✅ JARVIS 3.0             | Health Metrics, MCP Sync, Agent Mirror/Mapper, Watchdog, Telemetry     |

---

## 🏗️ Orchestration HUBs (01_Personal_Os/04_Operations/03_Scripts_Os/)

> **Total HUBs:** 23 (v4.0 Consequences + JARVIS 3.1) — Ver detalle completo en `HUB_CATALOG.md`

| #                   | Script                               | Purpose                                                   | Status                   |
|---------------------|--------------------------------------|-----------------------------------------------------------|--------------------------|
| 00                  | `Sound_Engine.py`                    | Motor de notificaciones sonoras                           | ✅ ACTIVO                 |
| 01                  | `Auditor_Hub.py`                     | Orquestador de Auditorías                                 | ✅ ACTIVO                 |
| 02                  | `Git_Hub.py`                         | Orquestador de Git/Repos                                  | ✅ ACTIVO                 |
| 03                  | `AIPM_Hub.py`                        | Métricas AIPM                                             | ✅ ACTIVO                 |
| 04                  | `Ritual_Hub.py`                      | Rituales (Start/End)                                      | ✅ ACTIVO                 |
| 05                  | `Validator_Hub.py`                   | Validaciones                                              | ✅ ACTIVO                 |
| 06                  | `Tool_Hub.py`                        | Herramientas                                              | ✅ ACTIVO                 |
| 07                  | `Integration_Hub.py`                 | Integraciones MCP                                         | ✅ ACTIVO                 |
| 08                  | `Workflow_Hub.py`                    | Workflows SOTA                                            | ✅ ACTIVO                 |
| 09                  | `Data_Hub.py`                        | Datos/Sync                                                | ✅ ACTIVO                 |
| 10                  | `General_Hub.py`                     | Utilidades                                                | ✅ ACTIVO                 |
| 11                  | `Auto_Learn_Hub.py`                  | Motor de automejora                                       | ✅ ACTIVO                 |
| 12                  | `Context_Usage_Bar.py`               | Barra de uso de contexto (en 13_Auditors_Os/scripts/)     | ✅ ACTIVO                 |
| 13                  | `Beautify_Tables.py`                 | Formateo de tablas (en 13_Auditors_Os/scripts/)           | ✅ ACTIVO                 |
| 14                  | `Health_Metrics_Hub.py`              | Métricas de salud del sistema                             | ✅ ACTIVO (JARVIS)        |
| 15a ★               | `MCP_Sync_Hub.py`                    | Sync + drift report MCPs (canónico)                       | ✅ ACTIVO (JARVIS)        |
| 15b                 | `Agent_Sync_Hub.py`                  | Sincronización de agentes                                 | ✅ ACTIVO                 |
| 16a ★               | `System_Mapper_Hub.py`               | Regenera manifest JARVIS (canónico)                       | ✅ ACTIVO (JARVIS)        |
| 16b                 | `Agent_Mirror_Hub.py`                | Mirror agentes source → backup                            | ✅ ACTIVO                 |
| 17 ★                | `Watchdog_Hub.py`                    | Health check activo del OS (canónico)                     | ✅ ACTIVO (JARVIS)        |
| 18 ★                | `Telemetry_Hub.py`                   | Dashboard telemetría y stats (canónico)                   | ✅ ACTIVO (JARVIS)        |

> ★ = HUBs canónicos JARVIS 3.0. `Beauty_Doc.py` está en `13_Auditors_Os/scripts/`.

### Usage

```bash
# Desde cualquier ubicación (aliases en .bashrc)
gr              # Auditor_Hub.py - Dry run
audit           # Auditor_Hub.py
git-hub         # Git_Hub.py
aipm            # AIPM_Hub.py
ritual          # Ritual_Hub.py
validate        # Validator_Hub.py

# O directamente
cd Think_Different
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py estructura
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py skills
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py health
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py profundo
```

---

## 📁 Estructura v4.0 Consequences (Activo — 2026-05-10)

```
Think_Different/                        ← Raíz del proyecto
├── 00_Winter_is_Coming/                ✅ Goals, Backlog, AGENTS.md, OS_DIRECTORY.md
├── 01_Personal_Os/                     ✅ Sistema Operativo completo
│   ├── 01_Core/                        ✅ Motor del OS
│   │   ├── 00_Workflows_Os/            ✅ 28 Workflows (Personal, Marvel, CE, Hillary)
│   │   ├── 01_Rules/                   ✅ 11 reglas .mdc
│   │   └── 02_Tools/                   ✅ Agentes, Skills, MCPs, Hooks, Evals
│   │       ├── 01_Agents/              ✅ 52+ agentes (Dream Team + Specialists)
│   │       ├── 02_Skills/               ✅ 300+ skills en 11 áreas funcionales
│   │       └── 03_Mcp/ … 09_Templates ✅ MCPs, Hooks, Plugins, Server, Evals
│   ├── 02_Knowledge/                   ✅ Base de conocimiento
│   ├── 03_Task/                        ✅ Tareas activas
│   ├── 04_Operations/                  ✅ Todo lo operativo
│   │   ├── 03_Scripts_Os/              ✅ 23 HUBs + utilities (JARVIS 3.1)
│   │   │   ├── 13_Auditors_Os/         ✅ Utilities: Beautify, Carousel, SOTA, etc.
│   │   │   └── .backup/               ✅ 10_Legacy_backup_20260420
│   │   └── 02_Agent_Teams_Lite/00_Manifest/ ✅ 7 archivos JARVIS manifest
│   └── 05_Archive/                     ✅ Legacy + repos de referencia
├── 02_Playground/                      ✅ Zona de pruebas
├── 03_Resultado/                       ✅ Outputs (OIM, Elite Portfolio, etc.)
├── .agent/ .atl/ .claude/ .mcp.json   ✅ Config IA + GGA + SDD + 35 MCPs
└── OS_DIRECTORY.md CLAUDE.md README.md ✅ Documentación raíz
```

---

## 🎯 Skills (01_Personal_Os/01_Core/02_Tools/02_Skills/) — v4.0 Consequences

> **Total:** 300+ skills — 11 áreas funcionales | Índice completo: `INDEX_AREA_FUNCTIONAL.md`

| Área                | Carpeta                           | Descripción                                                     | SKILL.md       |
|---------------------|-----------------------------------|-----------------------------------------------------------------|----------------|
| 00a                 | `00_Compound_Engineering`         | Core CE (Spider, Avengers, LFG)                                 | ✅              |
| 00b                 | `00_Personal_Os_Stack`            | Stack base OS + Gcierr                                          | ✅              |
| 00c                 | `00_Skill_Auditor`                | Auditoría de skills                                             | ✅              |
| 01                  | `01_Creacion_Contenidos`          | Brand, YouTube, SEO, Carruseles, Contenidos                     | ✅              |
| 02                  | `02_Diseno_Ui_Ux`                 | Product Design, UI/UX, Taste, Minimalismo                       | ✅              |
| 03                  | `03_Video_Media`                  | Video Intel, James Cameron (Remotion)                           | ✅              |
| 04                  | `04_Automatizacion`               | N8N, Firecrawl, automación                                      | ✅              |
| 05                  | `05_Workflows`                    | Agent Teams, PM, Orchestrator                                   | ✅              |
| 06                  | `06_Tools`                        | Skill Creator, Testing, DevOps, System Master, Data Analyst     | ✅              |
| 07                  | `07_Personal_Os`                  | Life OS, Hillary, Rituales                                      | ✅              |
| 08                  | `08_Invictus_Web`                 | Playwright, Superpowers, Web automation                         | ✅              |
| 09                  | `09_Legacy_Archive`               | Skills obsoletas (archivadas)                                   |----------------|
| 21                  | `21_Skill_Template`               | 1                                                               | ✅              |

**Total: 22 categorías de skills — 100% documentadas con SKILL.md**

---

## 🔧 Legacy Scripts (Legacy_Backup/)

Scripts legacy en `01_Personal_Os/04_Operations/03_Scripts_Os/Legacy_Backup/` — referensiados por números:

| #                     | Script                      | Purpose                                        |
|-----------------------|-----------------------------|------------------------------------------------|
| 00-90                 | +80 scripts                 | Workflows, AIPM, Quality, etc.                 |

> ⚠️ Algunos scripts legacy pueden tener rutas obsoletas (`.agent/02_Skills`). Auditoría en progreso.

---

## ✅ Comandos del Sistema

| Comando                       | Función                                   |
|-------------------------------|-------------------------------------------|
| `gr`                          | System Guardian (dry-run)                 |
| `gr --apply`                  | Aplicar fixes                             |
| `gr --agents`                 | Agentes de revisión                       |
| `/sdd:*`                      | SDD Workflow                              |
| `/ce:*`                       | Compound Engineering                      |
| `engram`                      | Memoria persistente                       |

---

## 📝 Notas Importantes

1. **Rutas v4.0**: Skills ahora en `01_Personal_Os/01_Core/02_Tools/02_Skills/` (estructura v4.0 Consequences)
2. **.bashrc**: Alias configurados con rutas absolutas
3. **34_Skill_Auditor.py**: Corregido para auto-detectar categorías

---

## 🔗 Scripts → Skills Mapping (2026-04-20)

Scripts migrados a skills usando `get_skill_script()`:

| Script                                    | Skill Destino                               | Estado                   |
|-------------------------------------------|---------------------------------------------|--------------------------|
| `01_Spider_Brainstorm.py`                 | 00_Compound_Engineering/scripts             | ✅                        |
| `02_Professor_X_Plan.py`                  | 01_Agent_Teams_Lite/scripts                 | ✅                        |
| `34_Skill_Auditor.py`                     | 00_Skill_Auditor/scripts                    | ✅                        |
| `53_Structure_Auditor.py`                 | 00_Personal_Os_Stack/scripts                | ✅                        |
| `50_System_Health_Monitor.py`             | 08_Personal_Os/scripts                      | ✅                        |
| `33_Parallel_Audit_Pro.py`                | 06_Testing/scripts                          | ✅                        |
| `57_Repo_Sync_Auditor.py`                 | 07_DevOps/scripts                           | ✅                        |
| `08_Ritual_Cierre.py`                     | 08_Personal_Os/scripts                      | ✅                        |
| `14_Morning_Standup.py`                   | 08_Personal_Os/scripts                      | ✅                        |
| `09_Backlog_Triage.py`                    | 02_Project_Manager/scripts                  | ✅                        |
| `11_Sync_Notes.py`                        | 18_Personal_Life_OS/scripts                 | ✅                        |
| `16_Clean_System.py`                      | 13_System_Master/scripts                    | ✅                        |

**Total: 12 scripts migrados — Todos resolviendo con get_skill_script()**
| `13_Validate_Stack.py`          | validate-stack       | ✅ Creado   |
| `12_Update_Links.py`            | update-links         | ✅ Creado   |
| `16_Clean_System.py`            | clean-system         | ✅ Creado   |
| `17_Ritual_Dominical.py`        | ritual-dominical     | ✅ Creado   |
| `57_Repo_Sync_Auditor.py`       | repo-sync            | ✅ Creado   |
| `50_System_Health_Monitor.py`   | system-guardian      | ✅ Existe   |

---

## 📁 Scripts por Carpeta (01_Ritual)

| Script                                        | Función                              |
|-----------------------------------------------|--------------------------------------|
| `08_Ritual_Cierre.py`                         | Cierre de sesión                     |
| `09_Backlog_Triage.py`                        | Procesa backlog                      |
| `11_Sync_Notes.py`                            | Sincroniza notas                     |
| `12_Update_Links.py`                          | Actualiza enlaces                    |
| `13_Validate_Stack.py`                        | Valida stack tech                    |
| `14_Morning_Standup.py`                       | Daily standup                        |
| `15_Weekly_Review.py`                         | Weekly review                        |
| `16_Clean_System.py`                          | Limpia sistema                       |
| `17_Ritual_Dominical.py`                      | Ritual dominical                     |
| `18_Generacion_Contenido.py`                  | Generación contenido                 |
| `19_Generate_Progress.py`                     | Dashboard progreso                   |
| `50_System_Health_Monitor.py`                 | Health monitor                       |
| `57_Repo_Sync_Auditor.py`                     | Repo sync                            |

---

*Actualizado: 2026-04-01 — Estructura 05_Archive estandarizada (01-09)*
