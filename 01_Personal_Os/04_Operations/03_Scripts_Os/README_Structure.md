# 📜 HUB Scripts — Structure Document

> **Última actualización:** 2026-05-20
> **Versión:** v4.1

---

## 📊 OVERVIEW

| Category               | Count| Description                                  |
|-----------------------|-----|---------------------------------------------|
| **HUBs principales**   | 28   | Scripts activos en raíz de `03_Scripts_Os/`  |
| **AIPM scripts**       | 9    | Scripts de AI Performance Monitoring (backup)|
| **Validator scripts**  | 5    | Scripts de validación (backup)               |
| **Data scripts**       | 4    | Scripts de procesamiento de datos            |
| **Integration scripts**| 3    | Scripts de integración MCP                   |
| **General scripts**    | 4    | Utilidades generales                         |
| **Legacy scripts**     | 80+  | Histórico de versiones anteriores            |

**Total reportado por HUB_Catalog.yaml: 152**

---

## 🎯 STRUCTURE

```
03_Scripts_Os/
├── 00_Sound_Engine.py          # Notificaciones sonoras
├── 01_Auditor_Hub.py           # Auditoría de sistema
├── 02_Git_Hub.py               # Operaciones Git
├── 03_AIPM_Hub.py              # AI Performance Monitoring
├── 04_Ritual_Hub.py            # Rituales de sesión
├── 05_Validator_Hub.py         # Validación de código
├── 06_Tool_Hub.py              # Integración de herramientas
├── 07_Integration_Hub.py       # Integraciones MCP
├── 08_Workflow_Hub.py          # Automatización de workflows
├── 09_Data_Hub.py             # Procesamiento de datos
├── 10_General_Hub.py           # Utilidades generales
├── 11_Auto_Learn_Hub.py       # Motor de automejora
├── 14_Health_Metrics_Hub.py    # Métricas de salud
├── 15_MCP_Sync_Hub.py          # Sync Claude ↔ OpenCode
├── 16_Agent_Mirror_Hub.py      # Mirror agents source → backup
├── 17_Watchdog_Hub.py          # Health watchdog
├── 18_Telemetry_Hub.py         # Dashboard de métricas
├── 19_Agent_Sync_Hub.py       # Sync agents source ↔ backup
├── 20_System_Mapper_Hub.py    # Genera 7 JARVIS manifests
├── 21_Legacy_Path_Cleanup.py  # Limpia paths legacy v2.x
├── 22_Validate_Skill_Frontmatter.py  # Detecta skills sin frontmatter
├── 23_path_replacement.py     # Utilidad de paths
├── 24_mass_path_migration.py  # Utilidad de migración
├── 25_Minimax_Optimizer_Hub.py  # Optimizador
├── 33_Parallel_Audit_Pro.py  # Auditoría paralela
├── 34_Skill_Auditor.py        # Auditoría de skills
├── 50_System_Health_Monitor.py  # Monitor de salud
├── 57_Repo_Sync_Auditor.py    # Auditor de repos
│
├── 03_AIPM/                    # 📦 BACKUP — AIPM scripts (v3.x heritage)
│   ├── 22_AIPM_Trace_Logger.py
│   ├── 23_AIPM_Evaluator.py
│   ├── 24_AIPM_Interview_Sim.py
│   ├── 25_Token_Budget_Guard.py
│   ├── 26_RAG_Optimizer_Pro.py
│   ├── 27_Probabilistic_Risk_Audit.py
│   ├── 28_AIPM_Control_Center.py
│   ├── 29_Guardrails_Service.py
│   └── 30_AIPM_Consolidated_Report.py
│
├── 03_Validator/               # 📦 BACKUP — Validator scripts
│   ├── 33_Parallel_Audit_Pro.py
│   ├── 34_Skill_Auditor.py
│   ├── 37_Linter_Autofix.py
│   ├── 40_Validate_Rules.py
│   └── 80_Edge_Case_Validator.py
│
├── 05_AIPM/                     # 📦 BACKUP — AIPM scripts
├── 05_Validator/               # 📦 BACKUP — Validator scripts
├── 07_Data/                    # 📦 Scripts de datos activos
├── 09_AIPM/                     # 📦 BACKUP — AIPM scripts
├── 09_Validator/               # 📦 BACKUP — Validator scripts
├── 09_Integration/              # 📦 Scripts de integración activos
├── 10_Legacy/                  # 📦 LEGACY — +80 scripts de versiones anteriores
│   ├── 01_Spider_Brainstorm.py
│   ├── 02_Professor_X_Plan.py
│   ├── 03_Thor_Work.py
│   ├── 04_Vision_Review.py
│   ├── 05_Hulk_Compound.py
│   └── ... (80+ más)
│
├── 10_General/                  # 📦 BACKUP — General scripts
├── 11_Anthropic_Harness/       # 📦 Scripts del harness de Anthropic
└── 14_Otros/                    # 📦 Scripts misceláneos
```

---

## 📝 NOTA SOBRE "INFLATION"

Los **152 scripts** reportados en el HUB_Catalog incluyen:

1. **28 HUBs activos** en raíz (`00_` - `57_`)
2. **Backup scripts** en subdirectorios (`03_AIPM/`, `03_Validator/`, `05_AIPM/`, etc.) — estos son **copias de respaldo heredadas de v3.x**
3. **80+ scripts legacy** en `10_Legacy/` — historial de versiones anteriores

### ¿Por qué existe esta estructura?

- **History preservation:** Los subdirectorios AIPM/Validator contienen snapshots de cuando эти scripts se usaban en contextos específicos (AIPM mode, Validator mode).
- **Quick rollback:** Si un script se rompe, la copia en subdirectorio permite recovery instantáneo.
- **Audit trail:** Los scripts en `10_Legacy/` documentan la evolución del sistema a lo largo del tiempo.

### Esta NO es una anomalía — es intencional

El "inflated count" de 152 scripts es el resultado de mantener **máxima información** sin destruir nada. Es una característica de preservación, no un bug.

---

## 🔧 COMANDOS HUB

```bash
# HUBs principales
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py --apply
```

---

## 📊 HUB Catalog (28 activos)

| #  | HUB                       | Propósito                     |
|---|--------------------------|------------------------------|
| 00 | Sound Engine              | Notificaciones sonoras        |
| 01 | Auditor                   | Auditoría de sistema          |
| 02 | Git                       | Operaciones Git               |
| 03 | AIPM                      | AI Performance Monitoring     |
| 04 | Ritual                    | Rituales de sesión            |
| 05 | Validator                 | Validación de código          |
| 06 | Tool                      | Integración de herramientas   |
| 07 | Integration               | Integraciones MCP             |
| 08 | Workflow                  | Automatización de workflows   |
| 09 | Data                      | Procesamiento de datos        |
| 10 | General                   | Utilidades generales          |
| 11 | Auto Learn                | Motor de automejora           |
| 14 | Health Metrics            | Health metrics                |
| 15 | MCP Sync                  | Sync Claude ↔ OpenCode        |
| 16 | Agent Mirror              | Mirror agents                 |
| 17 | Watchdog                  | Health watchdog               |
| 18 | Telemetry                 | Dashboard ASCII               |
| 19 | Agent Sync                | Sync agents                   |
| 20 | System Mapper             | Genera manifests              |
| 21 | Legacy Path Cleanup       | Limpia paths legacy           |
| 22 | Validate Skill Frontmatter| Detecta skills sin frontmatter|
| 23 | Path Replacement          | Utility                       |
| 24 | Mass Path Migration       | Utility                       |
| 25 | Minimax Optimizer         | Optimizador                   |
| 33 | Parallel Audit Pro        | Auditoría paralela            |
| 34 | Skill Auditor             | Auditoría de skills           |
| 50 | System Health Monitor     | Monitor de salud              |
| 57 | Repo Sync Auditor         | Auditor de repos              |

---

*Documentado: 2026-05-20 — Think Different v4.1*
