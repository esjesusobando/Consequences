# 01_Auto_Improvement — Motor de Auto-Mejora Recursiva (SOTA)

> **Version:** 2.1 SOTA
> **Fecha:** 2026-05-28 (executor v2.0 con 6 fixers reales)
> **Estado:** [OK] FUNCIONAL — Pipeline Detect > Analyze > Execute > Learn operativo

---

## Estructura del Motor

```
01_Auto_Improvement/
  __init__.py                        # Package init
  recursive_improvement_engine.py    # [DEPRECATED] Redirect a 01_Engine/
  01_Engine/                         # Motor de mejora recursiva
    __init__.py                      # Package init con exports
    detector.py                      # [OK] Escanea issues (estructura, naming, docs, duplicados)
    analyzer.py                      # [OK] Clasifica severidad, impacto, prioriza
    executor.py                      # [OK] v2.0 — 6 fixers reales: missing dirs, version mismatch, docstrings, naming, duplicates, dependencies
    learner.py                       # [OK] Aprende de fixes, extrae patrones, sugiere
    recursive_improvement_engine.py  # [OK] Orchestrador SOTA del ciclo completo
  02_Rules/                          # Reglas de mejora
    auto_fix_rules.json
    detector_config.json
    rules_engine.py
  03_Metrics/                        # Metricas y logs
    improvement_log.json
    metrics_tracker.py
    execution.log                    # Log de ejecuciones automaticas
    last_run.json                    # Ultimo resultado exportado
  04_Triggers/                       # Disparadores
    manual_trigger.py                # [OK] Trigger manual: --scan, --full, --learn, --report
    cron_trigger.py                  # [OK] Trigger automatico: --once, --loop
    run_scheduled.bat                # Runner para Windows Task Scheduler
    setup_scheduler.bat              # Instalador de tarea programada (cada 8h)
  05_Backups/                        # Backups de scripts legacy
  06_Utils/                          # Utilidades de auditoria y fix
  run.bat                            # Entry point rapido
```

---

## Modos de Uso

### Manual (recomendado)

```bash
# Desde la raiz del proyecto:
cd 04_Operations/01_Auto_Improvement

# Solo escanear (dry-run, sin modificar nada)
python -X utf8 run --scan

# Ciclo completo (dry-run)
python -X utf8 run --full

# Ciclo completo LIVE (aplica fixes)
python -X utf8 run --full --apply

# Solo aprendizaje
python -X utf8 run --learn

# Reporte de estado
python -X utf8 run --report
```

### Via Trigger Directo

```bash
python -X utf8 04_Triggers/manual_trigger.py --scan
python -X utf8 04_Triggers/manual_trigger.py --full --apply
python -X utf8 04_Triggers/manual_trigger.py --report
```

### Automatico (cada 8 horas)

```powershell
# Ejecutar como ADMINISTRADOR:
04_Triggers\setup_scheduler.bat
```

Esto crea una tarea en Windows Task Scheduler que corre `cron_trigger.py --once` cada 480 minutos (8h).

### Daemon (loop en consola)

```bash
python -X utf8 04_Triggers/cron_trigger.py --loop --interval 8
```

---

## Pipeline del Engine

```
[FASE 1] Detector  ->  Escanea arbol, detecta issues (structure/docs/code/deps)
[FASE 2] Analyzer  ->  Clasifica severidad, impacto, prioriza
[FASE 3] Executor  ->  Aplica fixes auto-fixables (6 fixers, dry-run por defecto)
[FASE 4] Learner   ->  Registra aprendizajes, extrae patrones
       |
       v (loop hasta max_iterations o sin avance)
```

### Fixers del Executor v2.0

| Fixer                   | Categoria  | Que hace                                                                     |
|------------------------|-----------|-----------------------------------------------------------------------------|
| `_create_missing_dir`   | structure  | Crea directorios faltantes del arbol                                         |
| `_fix_version_mismatch` | docs       | Unifica version entre README.md y AGENTS.md (parseo seguro con tupla de ints)|
| `_fix_docstring`        | docs       | Actualiza fechas y versiones viejas en docstrings                            |
| `_fix_naming_convention`| code       | Renombra archivos a formato NN_Descripcion.ext (prefijo dinamico)            |
| `_fix_duplicate_scripts`| structure  | Archiva scripts duplicados en 05_Archive/00_Duplicates_Auto                  |
| `_fix_requirements_txt` | deps       | Estandariza constraints (>=→==) sin tocar != ni multi-constraint             |

### CLI Usage

```bash
python executor.py                     # dry-run en directorio actual
python executor.py --apply .           # LIVE en directorio actual
python executor.py --apply --dry-run . # Fuerza dry-run aunque se pase --apply
python executor.py /ruta               # dry-run en ruta especifica
```

---

## Metricas del Motor

- **Issues Detectados:** ~75 en el proyecto actual
- **Fixes Aplicados:** 6 fixers implementados (v2.0), dry-run por defecto
- **Tasa de Exito:** 100% en aprendizaje
- **Patrones Aprendidos:** 2 (structure/HIGH, structure/MEDIUM)
- **CLI:** argparse con flags -n/--dry-run, -a/--apply
- **Ultimo Run:** `03_Metrics/last_run.json`

---

## Integracion

- **HUB:** `03_Scripts_Os/11_Auto_Learn_Hub.py` (compatibilidad mantenida)
- **Task Scheduler:** Cada 8h via `setup_scheduler.bat`
- **Engram:** Aprendizajes exportables a JSON

---

## Notas Tecnicas

- Usar `-X utf8` flag en Windows para evitar errores de encoding con caracteres UNICODE
- Los .bat runners ya incluyen `-X utf8` automaticamente
- El engine esta disenado para dry-run por defecto (pasar `--apply` para LIVE)
- Los modulos son independientes y pueden usarse por separado via `from 01_Engine.detector import Detector`

---

_Actualizado: 2026-05-28 (Executor v2.0 + Judgment Day Ronda 2)_
