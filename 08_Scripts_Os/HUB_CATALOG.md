# 🔧 HUB_CATALOG — PersonalOS v1.0

**Versión:** 1.0
**Última actualización:** 2026-04-18
**Ubicación:** `08_Scripts_Os/`
**PYTHONPATH:** Configurado vía `config_paths.py` en todos los HUBs

---

## Catálogo de HUBs (14 total)

| # | HUB | Script | Propósito | Comando rápido |
|---|-----|--------|-----------|----------------|
| 00 | **Sound Engine** | `00_Sound_Engine.py` | Motor de notificaciones sonoras del sistema | `python 08_Scripts_Os/00_Sound_Engine.py` |
| 01 | **Auditor** | `01_Auditor_Hub.py` | Validación completa: estructura, links, skills, health | `python 08_Scripts_Os/01_Auditor_Hub.py` |
| 02 | **Git** | `02_Git_Hub.py` | Operaciones Git + auditorías de estructura | `python 08_Scripts_Os/02_Git_Hub.py` |
| 03 | **AIPM** | `03_AIPM_Hub.py` | AI Performance Monitoring | `python 08_Scripts_Os/03_AIPM_Hub.py` |
| 04 | **Ritual** | `04_Ritual_Hub.py` | Rituales de sesión: open, close, recovery | `python 08_Scripts_Os/04_Ritual_Hub.py` |
| 05 | **Validator** | `05_Validator_Hub.py` | Validación de código: rules, stack, patterns | `python 08_Scripts_Os/05_Validator_Hub.py` |
| 06 | **Tool** | `06_Tool_Hub.py` | Integración y gestión de herramientas | `python 08_Scripts_Os/06_Tool_Hub.py` |
| 07 | **Integration** | `07_Integration_Hub.py` | Integraciones MCP y sistemas externos | `python 08_Scripts_Os/07_Integration_Hub.py` |
| 08 | **Workflow** | `08_Workflow_Hub.py` | Automatización de workflows | `python 08_Scripts_Os/08_Workflow_Hub.py` |
| 09 | **Data** | `09_Data_Hub.py` | Procesamiento y analytics de datos | `python 08_Scripts_Os/09_Data_Hub.py` |
| 10 | **General** | `10_General_Hub.py` | Utilidades generales del sistema | `python 08_Scripts_Os/10_General_Hub.py` |
| 11 | **Auto Learn** | `11_Auto_Learn_Hub.py` | Motor de automejora y aprendizaje | `python 08_Scripts_Os/11_Auto_Learn_Hub.py` |
| 12 | **Context Bar** | `12_Context_Usage_Bar.py` | Barra visual de uso de contexto | `python 08_Scripts_Os/12_Context_Usage_Bar.py` |
| 13 | **Beautify** | `13_Beautify_Tables.py` | Formateo de tablas markdown | `python 08_Scripts_Os/13_Beautify_Tables.py` |

---

## Detalle por HUB

### 00 — Sound Engine
Motor centralizado de notificaciones sonoras. Invocado por hooks y otros HUBs.

### 01 — Auditor
```bash
python 08_Scripts_Os/01_Auditor_Hub.py          # Dry-run
python 08_Scripts_Os/01_Auditor_Hub.py --apply  # Con auto-fix
python 08_Scripts_Os/01_Auditor_Hub.py --agents # Solo 3 agentes + Judge
```
Valida: estructura (00-08), naming convention, links rotos, archivos huérfanos, skills.

### 02 — Git
```bash
python 08_Scripts_Os/02_Git_Hub.py --status    # Estado del repo
python 08_Scripts_Os/02_Git_Hub.py --audit     # Auditoría de estructura git
```

### 03 — AIPM
AI Performance Monitoring. Métricas de uso de agentes, velocidad, calidad de outputs.

### 04 — Ritual
```bash
python 08_Scripts_Os/04_Ritual_Hub.py --open    # Ritual de apertura de sesión
python 08_Scripts_Os/04_Ritual_Hub.py --close   # Ritual de cierre
python 08_Scripts_Os/04_Ritual_Hub.py --recover # Recovery de sesión interrumpida
```

### 05 — Validator
```bash
python 08_Scripts_Os/05_Validator_Hub.py --rules   # Validar reglas
python 08_Scripts_Os/05_Validator_Hub.py --stack    # Validar stack técnico
python 08_Scripts_Os/05_Validator_Hub.py --patterns # Validar patrones
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

### 12 — Context Bar
```bash
python 08_Scripts_Os/12_Context_Usage_Bar.py
```
Muestra visualmente el porcentaje de contexto utilizado en la sesión actual.

### 13 — Beautify
```bash
python 08_Scripts_Os/13_Beautify_Tables.py --file archivo.md
```
Formatea y embellece tablas markdown.

---

## PYTHONPATH — Configuración

Todos los HUBs usan `config_paths.py` para resolución automática de paths:

```python
from config_paths import TASKS_DIR, EVALS_DIR, SERVER_DIR, MATRIX_DIR
```

Si un HUB falla con `ModuleNotFoundError`, ejecutar desde la raíz del repo:
```bash
cd Think_Different/
python 08_Scripts_Os/XX_Hub.py
```

---

## Alias Rápidos (bashrc/zshrc)

```bash
alias audit="python 08_Scripts_Os/01_Auditor_Hub.py"
alias audit-apply="python 08_Scripts_Os/01_Auditor_Hub.py --apply"
alias git-hub="python 08_Scripts_Os/02_Git_Hub.py"
alias aipm="python 08_Scripts_Os/03_AIPM_Hub.py"
alias ritual="python 08_Scripts_Os/04_Ritual_Hub.py"
alias validate="python 08_Scripts_Os/05_Validator_Hub.py"
```
