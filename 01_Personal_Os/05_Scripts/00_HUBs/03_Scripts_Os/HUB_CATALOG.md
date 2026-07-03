# 🔧 HUB_CATALOG — PersonalOS v5.0

**Versión:** 5.0
**Última actualización:** 2026-07-02
**Ubicación:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/`
**PYTHONPATH:** Configurado vía `config_paths.py` en todos los HUBs

---

## Catálogo de HUBs (24 HUBs raíz + 2 engines + 12 subdirectorios — v5.0)

| #                          | HUB                                     | Script                                           | Propósito                                                                      | Comando rápido                                                                                                    |
|---------------------------|----------------------------------------|-------------------------------------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| 00                         | **Sound Engine**                        | `00_Sound_Engine.py`                             | Motor de notificaciones sonoras del sistema                                    | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/00_Sound_Engine.py`                                            |
| 01                         | **Auditor**                             | `01_Auditor_Hub.py`                              | Validación completa: estructura, links, skills, health                         | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auditor_Hub.py`                                             |
| 02                         | **Git**                                 | `02_Git_Hub.py`                                  | Operaciones Git + auditorías de estructura                                     | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/02_Git_Hub.py`                                                 |
| 03                         | **AIPM**                                | `03_AIPM_Hub.py`                                 | AI Performance Monitoring                                                      | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/03_AIPM_Hub.py`                                                |
| 04                         | **Ritual**                              | `04_Ritual_Hub.py`                               | Rituales de sesión: open, close, recovery                                      | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/04_Ritual_Hub.py`                                              |
| 05                         | **Validator**                           | `05_Validator_Hub.py`                            | Validación de código: rules, stack, patterns                                   | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/05_Validator_Hub.py`                                           |
| 06                         | **Tool**                                | `06_Tool_Hub.py`                                 | Integración y gestión de herramientas                                          | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/06_Tool_Hub.py`                                                |
| 07                         | **Integration**                         | `07_Integration_Hub.py`                          | Integraciones MCP y sistemas externos                                          | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/07_Integration_Hub.py`                                         |
| 08                         | **Workflow**                            | `08_Workflow_Hub.py`                             | Automatización de workflows                                                    | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/08_Workflow_Hub.py`                                            |
| 09                         | **Data**                                | `09_Data_Hub.py`                                 | Procesamiento y analytics de datos                                             | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/09_Data_Hub.py`                                                |
| 10                         | **General**                             | `10_General_Hub.py`                              | Utilidades generales del sistema                                               | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/10_General_Hub.py`                                             |
| 11                         | **Auto Learn**                          | `11_Auto_Learn_Hub.py`                           | Motor de automejora y aprendizaje                                              | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/11_Auto_Learn_Hub.py`                                          |
| 12                         | **Context Bar**                         | `00_Context_Usage_Bar.py`                        | Barra visual de uso de contexto (en `12_Auditors_Os/scripts/`)                 | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/12_Auditors_Os/scripts/00_Context_Usage_Bar.py`                |
| 13                         | **Beautify**                            | `01_Beautify_Tables.py`                          | Formateo de tablas markdown (en `12_Auditors_Os/scripts/`)                     | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/12_Auditors_Os/scripts/01_Beautify_Tables.py`                  |
| 14                         | **Health Metrics**                      | `14_Health_Metrics_Hub.py`                       | Métricas de salud del sistema OS                                               | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/14_Health_Metrics_Hub.py`                                      |
| 15a                        | **MCP Sync** ★                          | `15_MCP_Sync_Hub.py`                             | Sincronización y drift report de MCPs (canónico JARVIS 3.0)                    | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/15_MCP_Sync_Hub.py --report`                                   |
| 19                         | **Agent Sync**                          | `19_Agent_Sync_Hub.py`                           | Sincronización de agentes del sistema                                          | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/19_Agent_Sync_Hub.py`                                          |
| 20                         | **System Mapper** ★                     | `20_System_Mapper_Hub.py`                        | Regenera el manifest JARVIS (canónico JARVIS 3.0)                              | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --scan`                                |
| 16b                        | **Agent Mirror**                        | `16_Agent_Mirror_Hub.py`                         | Mirror y sync de agentes (source → backup)                                     | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/16_Agent_Mirror_Hub.py`                                        |
| 17                         | **Watchdog** ★                          | `17_Watchdog_Hub.py`                             | Health check + monitoreo activo del OS (canónico JARVIS 3.0)                   | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/17_Watchdog_Hub.py --check`                                    |
| 18                         | **Telemetry** ★                         | `18_Telemetry_Hub.py`                            | Dashboard de telemetría y uso del sistema (canónico JARVIS 3.0)                | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/18_Telemetry_Hub.py --dashboard`                               |

> ★ = HUBs canónicos JARVIS 3.0 (Consequences 3.0 — 2026-04-25). Usar estos en scripts de automatización.
>
| 25                         | **Minimax Optimizer**                  | `25_Minimax_Optimizer_Hub.py`                    | Optimización Minimax de recursos del sistema                                   | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/25_Minimax_Optimizer_Hub.py`                                  |
| 26a                        | **Model Eval Hub** ★                   | `26_Model_Eval_Hub.py`                           | Evaluación de modelos: G-Eval, benchmarks, drift, Pareto, calibración           | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --status`                                |
| 26b                        | **Parallel Audit Pro**                 | `26_Parallel_Audit_Pro.py`                       | Auditoría paralela avanzada (SOTA Audit)                                        | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Parallel_Audit_Pro.py`                                     |
| 27                         | **Skill Auditor**                      | `27_Skill_Auditor.py`                            | Auditoría específica de skills                                                  | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/27_Skill_Auditor.py`                                          |
| 28a                        | **Model Router Hub** ★                 | `28_Model_Router_Hub.py`                         | Routing de modelos: semántico → cascada → bandido contextual                    | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/28_Model_Router_Hub.py --route "query"`                        |
| 28b                        | **System Health Monitor**              | `28_System_Health_Monitor.py`                    | Monitor de salud del sistema                                                    | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/28_System_Health_Monitor.py`                                  |
| 29                         | **Repo Sync Auditor**                  | `29_Repo_Sync_Auditor.py`                        | Auditor de sincronización de repos                                              | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/29_Repo_Sync_Auditor.py`                                      |
| 31                         | **Graphify Hub**                       | `31_Graphify_Hub.py`                             | Indexación y consulta del grafo de conocimiento                                  | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/31_Graphify_Hub.py --scan`                                     |
| 32                         | **Graphify Update**                    | `32_Graphify_Update.py`                          | Actualización incremental del grafo de conocimiento                             | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/32_Graphify_Update.py`                                        |
| 33                         | **Doc Sync**                           | `33_Doc_Sync.py`                                 | Sincronización de documentos                                                    | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/33_Doc_Sync.py`                                               |
| 34                         | **HUB_SOTA**                           | `34_HUB_SOTA.py`                                 | State of the Art upgrades — registro y ejecución de features                    | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/34_HUB_SOTA.py --status`                                      |
| 35                         | **SOTA Skill Modernizer**              | `35_SOTA_Skill_Modernizer.py`                    | Inyección de CoT en skills para SOTA alignment                                  | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/35_SOTA_Skill_Modernizer.py`                                   |
| 36                         | **README Table Beautifier**            | `36_README_Table_Beautifier.py`                  | Embellecedor de tablas README (alineación pixel-perfect)                       | `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/36_README_Table_Beautifier.py`                                 |

> ★ = HUBs canónicos de nueva generación (v5.0). Usar estos en scripts de automatización.
>
> **Notas de numeración:** HUBs 00-11 numerados con subdirectorios emparejados. 12-13 son scripts en `12_Auditors_Os/scripts/`. 14-20 son JARVIS standalone. 21-30 utilidades/migración. 26a/b comparten #26 (Model Eval + Parallel Audit). 28a/b comparten #28 (Router + Health Monitor). 31-36 son herramientas de graph, doc sync, SOTA.

---

## Detalle por HUB

### 00 — Sound Engine
Motor centralizado de notificaciones sonoras. Invocado por hooks y otros HUBs.

### 01 — Auditor
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auditor_Hub.py          # Dry-run
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auditor_Hub.py --apply  # Con auto-fix
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auditor_Hub.py --agents # Solo 3 agentes + Judge
```
Valida: estructura `00-08`, naming convention, links rotos, archivos huérfanos, skills.

### 02 — Git
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/02_Git_Hub.py --status    # Estado del repo
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/02_Git_Hub.py --audit     # Auditoría de estructura git
```

### 03 — AIPM
AI Performance Monitoring. Métricas de uso de agentes, velocidad, calidad de outputs.

### 04 — Ritual
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/04_Ritual_Hub.py --open    # Ritual de apertura de sesión
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/04_Ritual_Hub.py --close   # Ritual de cierre
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/04_Ritual_Hub.py --recover # Recovery de sesión interrumpida
```

### 05 — Validator
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/05_Validator_Hub.py --rules   # Validar reglas
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/05_Validator_Hub.py --stack    # Validar stack técnico
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/05_Validator_Hub.py --patterns # Validar patrones
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
Motor de automejora. Coordina con `03_Learning/01_Auto_Improvement/` para análisis y corrección recursiva.

### 12 — Context Bar (en 12_Auditors_Os/scripts/)
```bash
python ...15_MCP_Sync_Hub.py --report  # Drift report
python ...15_MCP_Sync_Hub.py --sync    # Sincronizar MCPs
```
Muestra visualmente el porcentaje de contexto utilizado en la sesión actual.

### 13 — Beautify
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/12_Auditors_Os/scripts/01_Beautify_Tables.py --file archivo.md
```
Formatea y embellece tablas markdown.

### 14 — Health Metrics
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/14_Health_Metrics_Hub.py
```
Métricas de salud del sistema: verifica estado de componentes críticos del OS.

### 15a — MCP Sync (canónico)
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/15_MCP_Sync_Hub.py --report    # Drift report MCPs
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/15_MCP_Sync_Hub.py --sync      # Sincronizar MCPs
```
Detecta drift entre MCPs de Claude Code y OpenCode. HUB canónico JARVIS 3.0.

### 19 — Agent Sync
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/19_Agent_Sync_Hub.py
```
Sincronización de agentes del sistema.

### 20 — System Mapper (canónico)
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --scan     # Regenerar manifest
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --report   # Ver estado
```
Regenera el manifest JARVIS en `02_Agent_Teams_Lite/00_Manifest/`. HUB canónico JARVIS 3.0.

### 25 — Minimax Optimizer Hub
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/25_Minimax_Optimizer_Hub.py
```
Optimización Minimax de recursos del sistema. Evalúa y balancea trade-offs entre velocidad, costo y calidad.

### 26a — Model Eval Hub ★ (v5.0)
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --status           # Estado general
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --benchmark quick  # Benchmark rápido
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --geval accuracy   # G-Eval
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --pareto reasoning # Frontera Pareto
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --drift            # Detección de drift
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --history          # Historial de runs
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Model_Eval_Hub.py --calibrate        # Calibración de jueces
```
Orquestador del Módulo de Evaluación de Modelos. Integra 9 motores: G-Eval, QualityRunner, SpeedProfiler, CostAnalyzer, TokenCounter, RunHistory, DriftDetector, ParetoFrontier, CalibrationLoop. Persiste resultados en `01_Memory/00_Context_LLM/08_Model_Evals/`.

**Subdirectorio:** `26_Model_Eval_Engine/` (10 módulos: run_history, drift_detector, pareto_frontier, calibration_loop, g_eval, quality_runner, speed_profiler, cost_analyzer, token_counter, __init__)

### 26b — Parallel Audit Pro
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/26_Parallel_Audit_Pro.py
```
Auditoría paralela avanzada. Ejecuta validaciones simultáneas sobre estructura, skills y health del sistema.

### 27 — Skill Auditor
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/27_Skill_Auditor.py
```
Auditoría específica de skills. Verifica frontmatter, cobertura, y consistencia de skill definitions.

### 28a — Model Router Hub ★ (v5.0)
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/28_Model_Router_Hub.py --route "question"  # Ruteo automático
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/28_Model_Router_Hub.py --policy            # Política actual
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/28_Model_Router_Hub.py --learn             # Aprendizaje contextual
```
Routing inteligente de 3 capas: SemanticRouter (clasificación semántica) → CascadeRouter (calidad vs velocidad) → ContextualBandit (exploración/ explotación con 10 arms). Usa RunHistory para retroalimentación.

**Subdirectorio:** `28_Model_Router_Engine/` (4 módulos: semantic_router, cascade_router, contextual_bandit, __init__)

### 28b — System Health Monitor
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/28_System_Health_Monitor.py
```
Monitor de salud del sistema. Checks periódicos de integridad de componentes.

### 29 — Repo Sync Auditor
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/29_Repo_Sync_Auditor.py
```
Auditor de sincronización de repos. Verifica consistencia entre repos locales y remotos.

### 31 — Graphify Hub
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/31_Graphify_Hub.py --scan     # Escanear y generar grafo
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/31_Graphify_Hub.py --query    # Consultar grafo
```
Indexación y consulta del grafo de conocimiento del proyecto. Genera `02_Playground/Graphify_Out/` con god nodes y estructura de comunidades.

### 32 — Graphify Update
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/32_Graphify_Update.py
```
Actualización incremental del grafo de conocimiento (solo AST, sin costo de API).

### 33 — Doc Sync
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/33_Doc_Sync.py
```
Sincronización de documentos entre directorios del OS.

### 34 — HUB_SOTA
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/34_HUB_SOTA.py --status       # Estado de features
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/34_HUB_SOTA.py --run all      # Ejecutar todos
```
State of the Art upgrades. Registro y orquestación de features SOTA. Integra 5 engines + 5 hub scripts (incluyendo Model Eval Hub y Model Router Hub).

### 35 — SOTA Skill Modernizer
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/35_SOTA_Skill_Modernizer.py
```
Inyección de CoT (Chain of Thought) en skills para alineación SOTA.

### 36 — README Table Beautifier
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/36_README_Table_Beautifier.py --file README.md
```
Embellecedor de tablas README con alineación pixel-perfect. Detecta y corrige columnas desalineadas.

### 16b — Agent Mirror
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/16_Agent_Mirror_Hub.py
```
Mirror y sincronización de agentes (source → backup). Mantiene 54/54 agentes sincronizados.

### 17 — Watchdog (canónico)
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/17_Watchdog_Hub.py --check      # Health check
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/17_Watchdog_Hub.py --monitor    # Monitoreo continuo
```
Health check activo del OS. HUB canónico JARVIS 3.0. Monitorea integridad de todos los componentes.

### 18 — Telemetry (canónico)
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/18_Telemetry_Hub.py --dashboard  # Dashboard completo
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/18_Telemetry_Hub.py --stats      # Stats rápidos
```
Dashboard de telemetría: uso del sistema, métricas de sesiones, rendimiento de agentes. HUB canónico JARVIS 3.0.

---

## Scripts Auxiliares — 21-30 (Migración + Auditoría + Utilidades)

> Scripts de utilidad para mantenimiento del sistema. Existen en raíz de `03_Scripts_Os/` pero no son HUBs principales.

| #  | Script                            | Propósito                                  |
|---|----------------------------------|-------------------------------------------|
| 21 | `21_Legacy_Path_Cleanup.py`       | Limpieza de paths legacy v2.x              |
| 22 | `22_Validate_Skill_Frontmatter.py`| Detecta skills sin frontmatter YAML válido |
| 23 | `23_Preview_Generator.js`         | Generador de previews (JavaScript)         |
| 24 | `24_mass_path_migration.py`       | Migración masiva de paths (batch)          |
| 25 | `25_Minimax_Optimizer_Hub.py`     | Optimizador usando estrategia Minimax      |
| 26a| `26_Model_Eval_Hub.py`            | Evaluación de modelos + engines (v5.0)    |
| 26b| `26_Parallel_Audit_Pro.py`        | Auditoría paralela avanzada (ex 33_)       |
| 27 | `27_Skill_Auditor.py`             | Auditor específico de skills (ex 34_)      |
| 28a| `28_Model_Router_Hub.py`          | Router de modelos + engines (v5.0)        |
| 28b| `28_System_Health_Monitor.py`     | Monitor de salud del sistema (ex 50_)      |
| 29 | `29_Repo_Sync_Auditor.py`         | Auditor de sincronización de repos (ex 57_)|
| 30 | `30_path_replacement.py`          | Reemplazo de paths legacy (ex 23_)         |

### Scripts Adicionales en Raíz

| Script                  | Propósito                                      |
|------------------------|-----------------------------------------------|
| Script / Directorio                | Propósito                                              |
|----------------------------------|-------------------------------------------------------|
| `26_Model_Eval_Engine/`          | 10 módulos: evaluaciones, drift, Pareto, calibración  |
| `28_Model_Router_Engine/`        | 4 módulos: router semántico → cascada → bandido       |
| `HUB_SOTA.py`                    | HUB SOTA — features estado del arte                   |
| `config_paths.py`                | Resolución centralizada de paths                      |
| `batch_replace_paths.py`         | Reemplazo batch de paths en múltiples archivos        |
| `refactor_revert_id.py`          | Utilidad one-off para revertir IDs                    |
| `OPEN_DESIGN_INTEGRATION.md`     | Guía de diseño abierto para integración               |
| `README.md` + `README_Structure.md` | Documentación del directorio                       |
| `qmd.sh`                         | Quick Make script                                     |
| `testsprite_failover.sh`         | Failover TestSprite                                   |
| `tarea_lista.bat`                | Notificación tarea completada (Windows)               |
| `REPORTE_AUDITORIA_INTEGRAL*.md` | Reporte de auditoría integral (2026-04-21)            |

---

## PYTHONPATH — Configuración

Todos los HUBs usan `config_paths.py` para resolución automática de paths:

```python
from config_paths import TASKS_DIR, EVALS_DIR, SERVER_DIR, MATRIX_DIR
```

Si un HUB falla con `ModuleNotFoundError`, ejecutar desde la raíz del repo:
```bash
cd Think_Different/
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/XX_Hub.py
```

---

## Alias Rápidos (bashrc/zshrc)

```bash
alias audit="python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auditor_Hub.py"
alias audit-apply="python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auditor_Hub.py --apply"
alias git-hub="python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/02_Git_Hub.py"
alias aipm="python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/03_AIPM_Hub.py"
alias ritual="python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/04_Ritual_Hub.py"
alias validate="python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/05_Validator_Hub.py"
```
