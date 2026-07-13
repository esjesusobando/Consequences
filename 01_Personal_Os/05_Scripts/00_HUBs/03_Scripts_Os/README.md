# 📁 03_Scripts_Os — Scripts del Sistema

> **Versión**: v5.0.2
> **Fecha**: 2026-07-12
> **Estado**: ✅ PRODUCCIÓN — 44 root scripts, 19 subdirectorios (202 total files)
> **Fuente**: Verificación manual 2026-07-12

---

## 📋 Estructura de Directorios

| #  | Directorio                | Archivos | Relación con HUB                  | Estado     |
| --- | ------------------------- | -------- | --------------------------------- | ---------- |
| 00 | `00_Context_LLM/`         | 1        | Contexto LLM compartido           | ✅ Activo   |
| 01 | `01_Ritual/`              | 4        | Scripts de rituales de sesión     | 🗄️ Legacy  |
| 02 | `02_Git/`                 | 1        | Scripts auxiliares de git         | 🗄️ Legacy  |
| 03 | `03_AIPM/`                | 11       | Motor de `03_AIPM_Hub.py`         | ✅ Activo   |
| 03 | `03_Validator/`           | 2        | Validación de reglas              | ✅ Activo   |
| 04 | `04_LangGraph/`           | 1        | Grafos de lenguaje                | ✅ Activo   |
| 05 | `05_Validator/`           | 8        | Motor de `05_Validator_Hub.py`    | ✅ Activo   |
| 06 | `06_Tool/`                | 1        | Scripts de herramientas           | 🗄️ Legacy  |
| 07 | `07_Integration/`         | 4        | Motor de `07_Integration_Hub.py`  | ✅ Activo   |
| 08 | `08_Data/`                | 5        | Motor de `09_Data_Hub.py`         | ✅ Activo   |
| 09 | `09_Auxiliary/`           | 7        | Scripts auxiliares                | ✅ Activo   |
| 09 | `09_Utils/`               | 1        | Utilidades                        | ✅ Activo   |
| 10 | `10_Anthropic/`           | 12       | Scripts Anthropic/Harness         | ✅ Activo   |
| 11 | `11_Audits/`              | 8        | Reportes de auditoría pasada      | 🗄️ Legacy  |
| 12 | `12_Auditors_Os/`         | 2        | Auditores del OS                  | ✅ Activo   |
| 13 | `13_Legacy/`              | 73       | Scripts legacy v2.x/3.x           | 🗄️ Archivo |
| 26 | `26_Model_Eval_Engine/`   | 11       | Motor de `26_Model_Eval_Hub.py`   | ✅ Activo   |
| 28 | `28_Model_Router_Engine/` | 5        | Motor de `28_Model_Router_Hub.py` | ✅ Activo   |
| 30 | `30_RealEstate/`          | 1        | Scripts del proyecto RealEstate   | ✅ Activo   |

**Total subdirectorios**: 19 (excluyendo `__pycache__/` y `.backup/`)
**Total archivos en subdirectorios**: 158
**Total root scripts**: 45 (44 .py + 1 .js)
**Total general**: 202

---

## 🔧 HUBs Principales (Root .py)

| #  | Script                             | Propósito                                     |
| --- | ---------------------------------- | --------------------------------------------- |
| 00 | `00_Sound_Engine.py`               | Notificaciones sonoras del sistema            |
| 01 | `01_Auditor_Hub.py`                | Validación: estructura, links, skills, health |
| 02 | `02_Git_Hub.py`                    | Operaciones Git + auditorías de estructura    |
| 03 | `03_AIPM_Hub.py`                   | AI Performance Monitoring                     |
| 04 | `04_Ritual_Hub.py`                 | Rituales de sesión: open, close, recovery     |
| 05 | `05_Validator_Hub.py`              | Validación de código: rules, stack, patterns  |
| 06 | `06_Tool_Hub.py`                   | Integración y gestión de herramientas         |
| 07 | `07_Integration_Hub.py`            | Integraciones MCP y sistemas externos         |
| 08 | `08_Workflow_Hub.py`               | Automatización de workflows                   |
| 09 | `09_Data_Hub.py`                   | Procesamiento y analytics de datos            |
| 10 | `10_General_Hub.py`                | Utilidades generales del sistema              |
| 11 | `11_Auto_Learn_Hub.py`             | Motor de automejora y aprendizaje             |
| 14 | `14_Health_Metrics_Hub.py`         | Métricas de salud del OS                      |
| 15 | `15_MCP_Sync_Hub.py`               | ★ Sincronización MCPs + drift report          |
| 16 | `16_Agent_Mirror_Hub.py`           | Mirror agentes source → backup                |
| 17 | `17_Watchdog_Hub.py`               | ★ Health check + monitoreo activo             |
| 18 | `18_Telemetry_Hub.py`              | ★ Dashboard de telemetría y uso               |
| 19 | `19_Agent_Sync_Hub.py`             | Sincronización de agentes                     |
| 20 | `20_System_Mapper_Hub.py`          | ★ Regenera manifest JARVIS                    |
| 21 | `21_Legacy_Path_Cleanup.py`        | Limpieza de paths legacy v2.x                 |
| 22 | `22_Validate_Skill_Frontmatter.py` | Detecta skills sin frontmatter YAML           |
| 23 | `23_Preview_Generator.js`          | Generador de previews (JavaScript)            |
| 24 | `24_mass_path_migration.py`        | Migración masiva de paths legacy              |
| 25 | `25_Minimax_Optimizer_Hub.py`      | Optimización Minimax de recursos              |
| 26 | `26_Model_Eval_Hub.py`             | ★ Evaluación de modelos (G-Eval, Pareto...)   |
| 26 | `26_Parallel_Audit_Pro.py`         | Auditoría paralela avanzada                   |
| 27 | `27_Skill_Auditor.py`              | Auditoría específica de skills                |
| 28 | `28_Model_Router_Hub.py`           | ★ Router de modelos (semántico→cascada)       |
| 28 | `28_System_Health_Monitor.py`      | Monitor de salud del sistema                  |
| 29 | `29_Beautify_Tables.py`            | Embellecedor de tablas markdown               |
| 29 | `29_Repo_Sync_Auditor.py`          | Auditor de sincronización de repos            |
| 30 | `30_path_replacement.py`           | Reemplazo de paths legacy                     |
| 31 | `31_Graphify_Hub.py`               | Indexación y consulta del grafo conocimiento  |
| 32 | `32_Graphify_Update.py`            | Actualización incremental del grafo           |
| 33 | `33_Doc_Sync.py`                   | Sincronización de documentos                  |
| 34 | `34_HUB_SOTA.py`                   | State of the Art upgrades                     |
| 35 | `35_SOTA_Skill_Modernizer.py`      | Inyección CoT en skills para SOTA             |
| 36 | `36_README_Table_Beautifier.py`    | Formateo de tablas README                     |

> ★ = HUBs canónicos JARVIS 3.0 / nueva generación v5.0

### Scripts Auxiliares en Raíz

| Script (no-HUB)          | Propósito                                      |
| ------------------------ | ---------------------------------------------- |
| `config_paths.py`        | Resolución centralizada de paths del sistema   |
| `batch_replace_paths.py` | Reemplazo batch de paths en múltiples archivos |
| `sync_copies.py`         | Sincronización Copy A ↔ Copy B                 |
| `path_guardian.py`       | Guardián de integridad de paths                |
| `os_errors.py`           | Manejo de errores del sistema                  |
| `refactor_revert_id.py`  | Utilidad one-off para revertir IDs             |
| `test_slow_legacy.py`    | Test de scripts legacy lentos                  |
| `track_leads.py`         | Pipeline de monetización — leads, propuestas   |
| `qmd.sh`                 | Quick Make script                              |
| `testsprite_failover.sh` | Failover TestSprite                            |
| `tarea_lista.bat`        | Notificación tarea completada (Windows)        |

---

## 📦 Scripts en Skills (22 migrados)

| #  | Script                        | Skill Destino           |
| --- | ----------------------------- | ----------------------- |
| 01 | `01_Spider_Brainstorm.py`     | 00_Compound_Engineering |
| 02 | `02_Professor_X_Plan.py`      | 01_Agent_Teams_Lite     |
| 08 | `08_Ritual_Cierre.py`         | 08_Personal_Os          |
| 09 | `09_Backlog_Triage.py`        | 02_Project_Manager      |
| 11 | `11_Sync_Notes.py`            | 18_Personal_Life_OS     |
| 13 | `13_Validate_Stack.py`        | 05_Vibe_Coding          |
| 14 | `14_Morning_Standup.py`       | 08_Personal_Os          |
| 15 | `15_Weekly_Review.py`         | 08_Personal_Os          |
| 16 | `16_Clean_System.py`          | 13_System_Master        |
| 17 | `17_Ritual_Dominical.py`      | 08_Personal_Os          |
| 18 | `18_Generacion_Contenido.py`  | 09_Marketing            |
| 19 | `19_Generate_Progress.py`     | 08_Personal_Os          |
| 26 | `26_Parallel_Audit_Pro.py`    | 05_Validator            |
| 27 | `27_Skill_Auditor.py`         | 05_Validator            |
| 39 | `39_Repair_Corruption.py`     | 13_System_Master        |
| 28 | `28_System_Health_Monitor.py` | 08_Personal_Os          |
| 29 | `29_Repo_Sync_Auditor.py`     | 07_DevOps               |
| 30 | `30_path_replacement.py`      | 14_Auxiliary            |
| 62 | `62_Tool_Shed.py`             | 07_DevOps               |
| 06 | `06_AntMan_Lfg_Lite.py`       | 00_Compound_Engineering |
| 07 | `07_Doc_Strange_Lfg.py`       | 00_Compound_Engineering |
| 73 | `73_Avengers_Workflow_v3.py`  | 00_Compound_Engineering |

---

## 📍 Ubicación

```
Think_Different/01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
```

PYTHONPATH configurado vía `config_paths.py` — todos los HUBs lo importan.

---

## 📋 Historial

| Fecha      | Acción                                                     |
| ---------- | ---------------------------------------------------------- |
| 2026-07-12 | v5.0.2 — README reescrito con estructura real verificada   |
| 2026-07-12 | +track_leads.py — Pipeline de monetización (Gap #1 SOTA)   |
| 2026-06-27 | v5.0 — 22 HUBs funcionales, primer mapeo con System Mapper |
| 2026-05-23 | v4.9 — README inicial con estructura legacy                |

---

## ⚠️ Notas

- **HUB_CATALOG.md** tiene el detalle completo de cada HUB con comandos de ejemplo
- `__pycache__/` y `.backup/` son cachés del sistema — ignorar en conteos
- 42 scripts migrados a skills (22 en tabla + 20 legacy en subdirectorios)
- `13_Legacy/` contiene 73 scripts de v2.x/3.x mantenidos por compatibilidad

---

*Think Different PersonalOS v5.0.2 — 03_Scripts_Os — 2026-07-12*