# PersonalOS v4.7 Consequences — Comandos y Workflows

> **Versión:** v4.7 Consequences | **Actualizado:** 2026-05-22 | **Estado:** ✅ OPERATIVO

---

## 🚀 HUBs PRINCIPALES (Punto de Entrada)

Los scripts individuales migraron a HUBs centralizados. Usar siempre los HUBs como punto de entrada.

**Ruta base:** `01_Personal_Os/04_Operations/03_Scripts_Os/`

| HUB                                      | Script                                                | Propósito                                                             |
|-----------------------------------------|------------------------------------------------------|----------------------------------------------------------------------|
| **Sound Engine**                         | `00_Sound_Engine.py`                                  | Notificaciones sonoras                                                |
| **Auditor**                              | `01_Auditor_Hub.py`                                   | Validación del sistema                                                |
| **Git**                                  | `02_Git_Hub.py`                                       | Operaciones Git                                                       |
| **AIPM**                                 | `03_AIPM_Hub.py`                                      | AI Performance Monitoring                                             |
| **Ritual**                               | `04_Ritual_Hub.py`                                    | Rituales (morning, cierre, weekly)                                    |
| **Validator**                            | `05_Validator_Hub.py`                                 | Validación de código                                                  |
| **Tool**                                 | `06_Tool_Hub.py`                                      | Integración de tools                                                  |
| **Integration**                          | `07_Integration_Hub.py`                               | MCP e integraciones externas                                          |
| **Workflow**                             | `08_Workflow_Hub.py`                                  | Automatización de workflows                                           |
| **Data**                                 | `09_Data_Hub.py`                                      | Procesamiento de datos                                                |
| **General**                              | `10_General_Hub.py`                                   | Utilidades generales                                                  |
| **Auto Learn**                           | `11_Auto_Learn_Hub.py`                                | Motor de auto-mejora                                                  |
| **Health Metrics**                       | `14_Health_Metrics_Hub.py`                            | Métricas de salud del OS                                              |
| **MCP Sync**                             | `15_MCP_Sync_Hub.py`                                  | Drift entre Claude Code y OpenCode                                    |
| **Agent Mirror**                         | `16_Agent_Mirror_Hub.py`                              | Sincroniza agents source → backup                                     |
| **Watchdog**                             | `17_Watchdog_Hub.py`                                  | Health watchdog — integridad del manifest                             |
| **Telemetry**                            | `18_Telemetry_Hub.py`                                 | Dashboard ASCII de métricas por HUB                                   |
| **Agent Sync**                           | `19_Agent_Sync_Hub.py`                                | Sincroniza .agent/ con 01_Core/02_Tools/01_Agents/                    |
| **System Mapper**                        | `20_System_Mapper_Hub.py`                             | Genera 7 manifests del OS                                             |
| **Legacy Cleanup**                       | `21_Legacy_Path_Cleanup.py`                           | Limpia paths legacy de Consequences 2.x                               |
| **Skill Frontmatter**                    | `22_Validate_Skill_Frontmatter.py`                    | Detecta skills sin frontmatter YAML                                   |

### Scripts Auxiliares (13_Auditors_Os/scripts/)

| Script                                          | Propósito                                       |
|------------------------------------------------|------------------------------------------------|
| `12_Context_Usage_Bar.py`                       | Barra de uso de contexto                        |
| `13_Beautify_Tables.py`                         | Formateo de tablas markdown                     |
| `15_SOTA_Integrity_Check.py`                    | Verificación integridad SOTA                    |
| `16_Carousel_Engine.py`                         | Motor de carruseles                             |

---

## 📋 Comandos por Workflow

### Morning Standup
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --morning
```

### Backlog Triage
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --backlog
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --backlog --execute
```

### Weekly Review
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --weekly
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --weekly --quick
```

### Ritual Cierre
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --cierre
```

### Auditoría del Sistema
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py --apply
```

### Git Operations
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py --audit
```

### Health & Telemetry
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard
python 01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py
```

### MCP & Agent Sync
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_Agent_Mirror_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py
```

### System Manifest (JARVIS)
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```

---

## 🔧 Aliases (agregados a ~/.bashrc)

```bash
alias gr="python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py"
alias audit="python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py"
alias gr-apply="python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py --apply"
alias git-hub="python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py"
alias aipm="python 01_Personal_Os/04_Operations/03_Scripts_Os/03_AIPM_Hub.py"
alias ritual="python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py"
alias validate="python 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator_Hub.py"
```

---

## 📚 Skills PersonalOS (01_Personal_Os/01_Core/02_Tools/02_Skills/07_Personal_Os/)

| #                      | Skill                               | Propósito                                       |
|-----------------------|------------------------------------|------------------------------------------------|
| 10                     | Morning_Standup                     | Planificación diaria                            |
| 11                     | Weekly_Review                       | Revisión estratégica semanal                    |
| 12                     | Ritual_Cierre                       | Cierre de sesión de trabajo                     |
| 13                     | Sync_Notes                          | Sincronización de notas                         |
| 14                     | Validate_Stack                      | Validación del stack técnico                    |
| 15                     | Update_Links                        | Actualización de links                          |
| 16                     | Clean_System                        | Limpieza del sistema                            |
| 17                     | Ritual_Dominical                    | Revisión dominical                              |
| 18                     | Repo_Sync                           | Sincronización de repos                         |

---

## 📖 Scripts Legacy (solo referencia)

> ⚠️ **LEGACY** — Estos scripts están archivados en `03_Scripts_Os/10_Legacy/`. No usar directamente. Usar los HUBs.

| Script Legacy                               | HUB Equivalente                                   |
|--------------------------------------------|--------------------------------------------------|
| `09_Backlog_Triage.py`                      | `04_Ritual_Hub.py --backlog`                      |
| `14_Morning_Standup.py`                     | `04_Ritual_Hub.py --morning`                      |
| `15_Weekly_Review.py`                       | `04_Ritual_Hub.py --weekly`                       |
| `08_Ritual_Cierre.py`                       | `04_Ritual_Hub.py --cierre`                       |
| `17_Ritual_Dominical.py`                    | `04_Ritual_Hub.py --dominical`                    |

---

## 📖 Origen / Referencia

Basado en: `01_Personal_Os/05_Archive/07_Repos_Gentleman/personal-os-main/examples/workflows/`

| Workflow Original                        | Script v3.1                                       |
|-----------------------------------------|--------------------------------------------------|
| morning-standup.md                       | `04_Ritual_Hub.py --morning`                      |
| weekly-review.md                         | `04_Ritual_Hub.py --weekly`                       |
| backlog-processing.md                    | `04_Ritual_Hub.py --backlog`                      |
| content-generation.md                    | `08_Workflow_Hub.py --content`                    |

---

## ✅ Estado de Scripts

| Script                                     | Estado                           | Notas                                                       |
|-------------------------------------------|---------------------------------|------------------------------------------------------------|
| 04_Ritual_Hub.py                           | ✅ Activo                         | Punto de entrada para todos los rituales                    |
| 01_Auditor_Hub.py                          | ✅ Activo                         | Auditor principal                                           |
| 02_Git_Hub.py                              | ✅ Activo                         | Git operations                                              |
| 03_AIPM_Hub.py                             | ✅ Activo                         | Performance monitoring                                      |
| 17_Watchdog_Hub.py                         | ✅ Activo                         | Health watchdog                                             |
| 18_Telemetry_Hub.py                        | ✅ Activo                         | Dashboard de métricas                                       |
| 20_System_Mapper_Hub.py                    | ✅ Activo                         | Genera manifests JARVIS                                     |
| 10_Legacy/*.py                             | ⚠️ Archivados                    | Referencia histórica — usar HUBs                            |

---

*PersonalOS v4.7 Consequences — Actualizado 2026-05-22*
