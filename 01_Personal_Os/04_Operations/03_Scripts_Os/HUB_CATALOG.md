# 🔧 HUB_CATALOG — PersonalOS v4.0 Consequences

**Versión:** 4.0
**Última actualización:** 2026-05-27
**Ubicación:** `01_Personal_Os/04_Operations/03_Scripts_Os/`
**PYTHONPATH:** Configurado vía `config_paths.py` en todos los HUBs

---

## Catálogo de HUBs (31 scripts raíz + 12 subdirectorios con scripts internos — v4.8 Renumbered)

| #                          | HUB                                     | Script                                           | Propósito                                                                      | Comando rápido                                                                                                    |
|---------------------------|----------------------------------------|-------------------------------------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| 00                         | **Sound Engine**                        | `00_Sound_Engine.py`                             | Motor de notificaciones sonoras del sistema                                    | `python 01_Personal_Os/04_Operations/03_Scripts_Os/00_Sound_Engine.py`                                            |
| 01                         | **Auditor**                             | `01_Auditor_Hub.py`                              | Validación completa: estructura, links, skills, health                         | `python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py`                                             |
| 02                         | **Git**                                 | `02_Git_Hub.py`                                  | Operaciones Git + auditorías de estructura                                     | `python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py`                                                 |
| 03                         | **AIPM**                                | `03_AIPM_Hub.py`                                 | AI Performance Monitoring                                                      | `python 01_Personal_Os/04_Operations/03_Scripts_Os/03_AIPM_Hub.py`                                                |
| 04                         | **Ritual**                              | `04_Ritual_Hub.py`                               | Rituales de sesión: open, close, recovery                                      | `python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py`                                              |
| 05                         | **Validator**                           | `05_Validator_Hub.py`                            | Validación de código: rules, stack, patterns                                   | `python 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator_Hub.py`                                           |
| 06                         | **Tool**                                | `06_Tool_Hub.py`                                 | Integración y gestión de herramientas                                          | `python 01_Personal_Os/04_Operations/03_Scripts_Os/06_Tool_Hub.py`                                                |
| 07                         | **Integration**                         | `07_Integration_Hub.py`                          | Integraciones MCP y sistemas externos                                          | `python 01_Personal_Os/04_Operations/03_Scripts_Os/07_Integration_Hub.py`                                         |
| 08                         | **Workflow**                            | `08_Workflow_Hub.py`                             | Automatización de workflows                                                    | `python 01_Personal_Os/04_Operations/03_Scripts_Os/08_Workflow_Hub.py`                                            |
| 09                         | **Data**                                | `09_Data_Hub.py`                                 | Procesamiento y analytics de datos                                             | `python 01_Personal_Os/04_Operations/03_Scripts_Os/09_Data_Hub.py`                                                |
| 10                         | **General**                             | `10_General_Hub.py`                              | Utilidades generales del sistema                                               | `python 01_Personal_Os/04_Operations/03_Scripts_Os/10_General_Hub.py`                                             |
| 11                         | **Auto Learn**                          | `11_Auto_Learn_Hub.py`                           | Motor de automejora y aprendizaje                                              | `python 01_Personal_Os/04_Operations/03_Scripts_Os/11_Auto_Learn_Hub.py`                                          |
| 12                         | **Context Bar**                         | `00_Context_Usage_Bar.py`                        | Barra visual de uso de contexto (en `12_Auditors_Os/scripts/`)                 | `python 01_Personal_Os/04_Operations/03_Scripts_Os/12_Auditors_Os/scripts/00_Context_Usage_Bar.py`                |
| 13                         | **Beautify**                            | `01_Beautify_Tables.py`                          | Formateo de tablas markdown (en `12_Auditors_Os/scripts/`)                     | `python 01_Personal_Os/04_Operations/03_Scripts_Os/12_Auditors_Os/scripts/01_Beautify_Tables.py`                  |
| 14                         | **Health Metrics**                      | `14_Health_Metrics_Hub.py`                       | Métricas de salud del sistema OS                                               | `python 01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py`                                      |
| 15a                        | **MCP Sync** ★                          | `15_MCP_Sync_Hub.py`                             | Sincronización y drift report de MCPs (canónico JARVIS 3.0)                    | `python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report`                                   |
| 19                         | **Agent Sync**                          | `19_Agent_Sync_Hub.py`                           | Sincronización de agentes del sistema                                          | `python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py`                                          |
| 20                         | **System Mapper** ★                     | `20_System_Mapper_Hub.py`                        | Regenera el manifest JARVIS (canónico JARVIS 3.0)                              | `python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan`                                |
| 16b                        | **Agent Mirror**                        | `16_Agent_Mirror_Hub.py`                         | Mirror y sync de agentes (source → backup)                                     | `python 01_Personal_Os/04_Operations/03_Scripts_Os/16_Agent_Mirror_Hub.py`                                        |
| 17                         | **Watchdog** ★                          | `17_Watchdog_Hub.py`                             | Health check + monitoreo activo del OS (canónico JARVIS 3.0)                   | `python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py --check`                                    |
| 18                         | **Telemetry** ★                         | `18_Telemetry_Hub.py`                            | Dashboard de telemetría y uso del sistema (canónico JARVIS 3.0)                | `python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard`                               |

> ★ = HUBs canónicos JARVIS 3.0 (Consequences 3.0 — 2026-04-25). Usar estos en scripts de automatización.
>
> **Notas de numeración:** HUBs 00-11 numerados con subdirectorios emparejados. HUBs 12-13 son scripts en `12_Auditors_Os/scripts/`. HUBs 14-20 son JARVIS standalone. Scripts de utilidad 21-30 son herramientas de migración/auditoría.

---

## Detalle por HUB

### 00 — Sound Engine
Motor centralizado de notificaciones sonoras. Invocado por hooks y otros HUBs.

### 01 — Auditor
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py          # Dry-run
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py --apply  # Con auto-fix
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py --agents # Solo 3 agentes + Judge
```
Valida: estructura (00-08), naming convention, links rotos, archivos huérfanos, skills.

### 02 — Git
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py --status    # Estado del repo
python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py --audit     # Auditoría de estructura git
```

### 03 — AIPM
AI Performance Monitoring. Métricas de uso de agentes, velocidad, calidad de outputs.

### 04 — Ritual
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --open    # Ritual de apertura de sesión
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --close   # Ritual de cierre
python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py --recover # Recovery de sesión interrumpida
```

### 05 — Validator
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator_Hub.py --rules   # Validar reglas
python 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator_Hub.py --stack    # Validar stack técnico
python 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator_Hub.py --patterns # Validar patrones
```

### 06 — Tool
Gestión de herramientas: Tool Shed (auto-detecta contexto → sugiere MCPs), Skill Harmonizer (valida paridad).

### 07 — Integration
Integraciones con MCPs externos. Wrapper para operaciones cross-sistema.

### 08 — Workflow
Automatización de workflows. Ejecuta secuencias de pasos predefinidos.

### 09 — Data
Procesamiento de datos, analytics, reportes estructurados.

### 10 — General
Utilidades comunes: formateo, parsing, helpers compartidos entre HUBs.

### 11 — Auto Learn
Motor de automejora. Coordina con `04_Operations/01_Auto_Improvement/` para análisis y corrección recursiva.

### 12 — Context Bar (en 12_Auditors_Os/scripts/)
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/12_Auditors_Os/scripts/00_Context_Usage_Bar.py
```
Muestra visualmente el porcentaje de contexto utilizado en la sesión actual.

### 13 — Beautify
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/12_Auditors_Os/scripts/01_Beautify_Tables.py --file archivo.md
```
Formatea y embellece tablas markdown.

### 14 — Health Metrics
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py
```
Métricas de salud del sistema: verifica estado de componentes críticos del OS.

### 15a — MCP Sync (canónico)
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report    # Drift report MCPs
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --sync      # Sincronizar MCPs
```
Detecta drift entre MCPs de Claude Code y OpenCode. HUB canónico JARVIS 3.0.

### 19 — Agent Sync
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py
```
Sincronización de agentes del sistema.

### 20 — System Mapper (canónico)
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan     # Regenerar manifest
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --report   # Ver estado
```
Regenera el manifest JARVIS en `02_Agent_Teams_Lite/00_Manifest/`. HUB canónico JARVIS 3.0.

### 16b — Agent Mirror
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_Agent_Mirror_Hub.py
```
Mirror y sincronización de agentes (source → backup). Mantiene 54/54 agentes sincronizados.

### 17 — Watchdog (canónico)
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py --check      # Health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py --monitor    # Monitoreo continuo
```
Health check activo del OS. HUB canónico JARVIS 3.0. Monitorea integridad de todos los componentes.

### 18 — Telemetry (canónico)
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard  # Dashboard completo
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --stats      # Stats rápidos
```
Dashboard de telemetría: uso del sistema, métricas de sesiones, rendimiento de agentes. HUB canónico JARVIS 3.0.

---

## PYTHONPATH — Configuración

Todos los HUBs usan `config_paths.py` para resolución automática de paths:

```python
from config_paths import TASKS_DIR, EVALS_DIR, SERVER_DIR, MATRIX_DIR
```

Si un HUB falla con `ModuleNotFoundError`, ejecutar desde la raíz del repo:
```bash
cd Think_Different/
python 01_Personal_Os/04_Operations/03_Scripts_Os/XX_Hub.py
```

---

## Alias Rápidos (bashrc/zshrc)

```bash
alias audit="python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py"
alias audit-apply="python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py --apply"
alias git-hub="python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py"
alias aipm="python 01_Personal_Os/04_Operations/03_Scripts_Os/03_AIPM_Hub.py"
alias ritual="python 01_Personal_Os/04_Operations/03_Scripts_Os/04_Ritual_Hub.py"
alias validate="python 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator_Hub.py"
```
