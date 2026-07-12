# 📜 HUB Scripts — Structure Document

> **Última actualización:** 2026-05-20
> **Versión:** v4.1

---

## 📊 OVERVIEW

| Category                | Count | Description                                   |
| ----------------------- | ----- | --------------------------------------------- |
| **HUBs principales**    | 28    | Scripts activos en raíz de `03_Scripts_Os/`   |
| **AIPM scripts**        | 9     | Scripts de AI Performance Monitoring (backup) |
| **Validator scripts**   | 5     | Scripts de validación (backup)                |
| **Data scripts**        | 4     | Scripts de procesamiento de datos             |
| **Integration scripts** | 3     | Scripts de integración MCP                    |
| **General scripts**     | 4     | Utilidades generales                          |
| **Legacy scripts**      | 80+   | Histórico de versiones anteriores             |

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
├── 23_Preview_Generator.js    # Generador de previews de skills
├── 24_mass_path_migration.py  # Utilidad de migración
├── 25_Minimax_Optimizer_Hub.py  # Optimizador
├── 26_Parallel_Audit_Pro.py  # Auditoría paralela
├── 27_Skill_Auditor.py        # Auditoría de skills
├── 28_System_Health_Monitor.py  # Monitor de salud
├── 29_Repo_Sync_Auditor.py    # Auditor de repos
├── 30_path_replacement.py     # Utilidad de paths
│
├── 03_AIPM/                    # AIPM scripts (00-08)
│   ├── 00_AIPM_Trace_Logger.py
│   ├── 01_AIPM_Evaluator.py
│   ├── 02_AIPM_Interview_Sim.py
│   ├── 03_Token_Budget_Guard.py
│   ├── 04_RAG_Optimizer_Pro.py
│   ├── 05_Probabilistic_Risk_Audit.py
│   ├── 06_AIPM_Control_Center.py
│   ├── 07_Guardrails_Service.py
│   └── 08_AIPM_Consolidated_Report.py
│
├── 04_LangGraph/               # LangGraph templates (README only)
│
├── 05_Validator/               # Validator scripts (00-05)
│   ├── 00_Parallel_Audit_Pro.py
│   ├── 01_Skill_Auditor.py
│   ├── 02_Linter_Autofix.py
│   ├── 03_Validate_Rules.py
│   ├── 04_Edge_Case_Validator.py
│   └── 05_test_skill_lifecycle.py
│
├── 06_Tool/                    # Tool scripts (README only)
│
├── 07_Integration/             # Integration scripts (00-02)
│   ├── 00_Sync_MCP_OpenCode.py
│   ├── 01_Update_QMD_Index.py
│   └── 02_Obsidian_Exporter.py
│
├── 08_Data/                    # Data scripts (00-03)
│   ├── 00_Master_Analytics_Factory.py
│   ├── 01_Batch_Parser.py
│   ├── 02_Resumen_Extractor.py
│   └── 03_Universal_Parser.py
│
├── 09_Auxiliary/               # Auxiliary scripts (00-04)
│   ├── 00_AI_Task_Planner.py
│   ├── 01_Update_Links.py
│   ├── 02_Fast_Vision.py
│   ├── 03_MCP_Health_Check.py
│   ├── 04_Skill_Harmonizer.py
│   └── skills_mapper.py
│
├── 10_Anthropic/               # Anthropic harness (00-09)
│   ├── 00_Safety_Wrapper.py → 09_Multi_Agent_Pipeline.py
│   └── test_features.json
│
├── 11_Audits/                  # Audit reports & scripts
│   ├── audit_skills_routes.py
│   ├── migrate_skills_routes.ps1
│   └── REPORTES (3)
│
├── 12_Auditors_Os/             # Auditors_Os scripts (00-04)
│   └── scripts/
│       ├── 00_Context_Usage_Bar.py → 04_Carousel_Engine.py
│
├── 13_Legacy/                  # Legacy scripts (80+)
│   ├── 01_Spider_Brainstorm.py
│   ├── 02_Professor_X_Plan.py
│   ├── 03_Thor_Work.py
│   └── ... (80+ más)
│
└── .backup/                    # Backup directory
    └── 10_Legacy_backup_20260420/
```

---

## 📝 NOTA SOBRE SCRIPTS TOTALES

Los scripts reportados en el HUB_Catalog incluyen:

1. **HUBs activos** en raíz (`00_` - `30_`)
2. **Scripts de módulo** en subdirectorios (`03_AIPM/`, `05_Validator/`, etc.)
3. **80+ scripts legacy** en `13_Legacy/` — historial de versiones anteriores

---

## 🔧 COMANDOS HUB

```bash
# HUBs principales
python 01_Personal_Os/05_Scripts/20_System_Mapper_Hub.py --scan
python 01_Personal_Os/05_Scripts/17_Watchdog_Hub.py
python 01_Personal_Os/05_Scripts/18_Telemetry_Hub.py --dashboard
python 01_Personal_Os/05_Scripts/15_MCP_Sync_Hub.py --report
python 01_Personal_Os/05_Scripts/19_Agent_Sync_Hub.py --apply
```

---

## 📊 HUB Catalog (28 activos)

| #   | HUB                        | Propósito                      |
| --- | -------------------------- | ------------------------------ |
| 00  | Sound Engine               | Notificaciones sonoras         |
| 01  | Auditor                    | Auditoría de sistema           |
| 02  | Git                        | Operaciones Git                |
| 03  | AIPM                       | AI Performance Monitoring      |
| 04  | Ritual                     | Rituales de sesión             |
| 05  | Validator                  | Validación de código           |
| 06  | Tool                       | Integración de herramientas    |
| 07  | Integration                | Integraciones MCP              |
| 08  | Workflow                   | Automatización de workflows    |
| 09  | Data                       | Procesamiento de datos         |
| 10  | General                    | Utilidades generales           |
| 11  | Auto Learn                 | Motor de automejora            |
| 14  | Health Metrics             | Health metrics                 |
| 15  | MCP Sync                   | Sync Claude ↔ OpenCode         |
| 16  | Agent Mirror               | Mirror agents                  |
| 17  | Watchdog                   | Health watchdog                |
| 18  | Telemetry                  | Dashboard ASCII                |
| 19  | Agent Sync                 | Sync agents                    |
| 20  | System Mapper              | Genera manifests               |
| 21  | Legacy Path Cleanup        | Limpia paths legacy            |
| 22  | Validate Skill Frontmatter | Detecta skills sin frontmatter |
| 23  | Path Replacement           | Utility                        |
| 24  | Mass Path Migration        | Utility                        |
| 25  | Minimax Optimizer          | Optimizador                    |
| 26  | Parallel Audit Pro         | Auditoría paralela             |
| 27  | Skill Auditor              | Auditoría de skills            |
| 28  | System Health Monitor      | Monitor de salud               |
| 29  | Repo Sync Auditor          | Auditor de repos               |
| 30  | Path Replacement           | Utilidad de paths              |

---

*Documentado: 2026-05-20 — Think Different v4.1*
