# 📁 03_Scripts_Os — Scripts del Sistema

> **Versión**: v5.0 SOTA
> **Fecha**: 2026-06-27
> **Estado**: ✅ PRODUCCIÓN — 42 HUBs funcionales, 166 scripts (33 root NN_ + 133 subdirs)
> **Fuente**: `20_System_Mapper_Hub.py --scan` — 2026-06-27T13:19:17

---

## 📋 Estructura de Carpetas (Secuencia)

| #  | Carpeta                 | Scripts      | Estado             |
| --- | ----------------------- | ------------ | ------------------ |
| 01 | `01_Ritual/`            | 0            | ✅ Migrado a skills |
| 02 | `02_Tool/`              | 0            | ✅ Migrado a skills |
| 03 | `03_Validator/`         | 8            | ✅ Activo           |
| 04 | `04_Workflow/`          | 0            | ✅ Migrado a skills |
| 05 | `05_AIPM/`              | 10           | ✅ Activo           |
| 06 | `06_Auditor/`           | 0            | 🗑️ Vacío           |
| 07 | `07_Data/`              | 4            | ✅ Activo           |
| 08 | `08_General/`           | 4            | ✅ Activo           |
| 09 | `09_Integration/`       | 3            | ✅ Activo           |
| 10 | `10_Legacy/`            | 92           | 🗄️ Archivo         |
| 11 | `11_Anthropic_Harness/` | 12           | ✅ Activo           |
| 12 | `12_Audits/`            | 6            | ✅ Activo           |
| 12 | `12_Auditors_Os/`       | 1 + scripts/ | ✅ Activo           |
| 14 | `14_Otros/`             | 5            | ✅ Recién creado    |

---

## 📦 Scripts en Skills (22)

| #  | Script                        | Skill Destino              |
| --- | ----------------------------- | -------------------------- |
| 01 | `01_Spider_Brainstorm.py`     | 00_Compound_Engineering    |
| 02 | `02_Professor_X_Plan.py`      | 01_Agent_Teams_Lite        |
| 08 | `08_Ritual_Cierre.py`         | 08_Personal_Os             |
| 09 | `09_Backlog_Triage.py`        | 02_Project_Manager         |
| 11 | `11_Sync_Notes.py`            | 18_Personal_Life_OS        |
| 13 | `13_Validate_Stack.py`        | 05_Vibe_Coding             |
| 14 | `14_Morning_Standup.py`       | 08_Personal_Os             |
| 15 | `15_Weekly_Review.py`         | 08_Personal_Os             |
| 16 | `16_Clean_System.py`          | 13_System_Master           |
| 17 | `17_Ritual_Dominical.py`      | 08_Personal_Os             |
| 18 | `18_Generacion_Contenido.py`  | **09_Marketing** ← USUARIO |
| 19 | `19_Generate_Progress.py`     | 08_Personal_Os             |
| 26 | `26_Parallel_Audit_Pro.py`    | 05_Validator               |
| 27 | `27_Skill_Auditor.py`         | 05_Validator               |
| 39 | `39_Repair_Corruption.py`     | 13_System_Master           |
| 28 | `28_System_Health_Monitor.py` | 08_Personal_Os             |
| 29 | `29_Repo_Sync_Auditor.py`     | 07_DevOps                  |
| 30 | `30_path_replacement.py`      | 14_Auxiliary               |
| 62 | `62_Tool_Shed.py`             | 07_DevOps                  |
| 06 | `06_AntMan_Lfg_Lite.py`       | 00_Compound_Engineering    |
| 07 | `07_Doc_Strange_Lfg.py`       | 00_Compound_Engineering    |
| 73 | `73_Avengers_Workflow_v3.py`  | 00_Compound_Engineering    |

---

## 🔗 HUBs Principales

| HUB                | Scripts que usa |
| ------------------ | --------------- |
| `04_Ritual_Hub`    | 17, 08, 14      |
| `05_Validator_Hub` | 13, 34          |
| `06_Tool_Hub`      | 39, 12          |
| `08_Workflow_Hub`  | 06, 07, 73      |
| `09_Data_Hub`      | 19              |

---

## 📍 Ubicación

```
Think_Different/03_Scripts_Os/
```

---

## ⚠️ Notas

- **Total scripts en skills**: 22
- **14_Otros**: Scripts de valor medio
- **Fallback automático**:get_skill_script() busca en skills + legacy
- **v1.0 ALFA**: Listo para producción

---

**Última actualización**: 2026-04-20
**Estado**: ✅ PRODUCCIÓN — 100% VERIFICADO