# Auto-Improvement — Quick Start

Motor de auto-mejora recursiva que escanea el PersonalOS cada 8 horas, detecta issues estructurales, y aprende de ellos.

---

## Estado Actual

| Componente       | Estado                                               |
|-----------------|-----------------------------------------------------|
| Motor            | ✅ SOTA — Funcional                                   |
| Scheduler        | ✅ Activo — Cada 8h via Task Scheduler                |
| Proxima ejecucion| 28 may 2026 09:05                                    |
| Pipeline         | Detector ✅ → Analyzer ✅ → Executor (stub) → Learner ✅|
| Ultimo scan      | ✅ Completado sin errores                             |

---

## Modos de Uso

### 1. Automatico (ya configurado)

El sistema ya corre solo cada 8 horas via Windows Task Scheduler.
Tarea: `AutoImprovementPersonalOS`

- **Modo actual:** Dry-run (solo escanea, no modifica nada)
- **Para cambiar a LIVE:** Editar `04_Triggers/run_scheduled.bat` y agregar `--apply`

### 2. Manual — Escaneo rapido

```bash
# Desde Git Bash / PowerShell / CMD en la raiz del proyecto:

cd 01_Personal_Os/05_Scripts/01_Auto_Improvement

# Escaneo rapido (dry-run, no toca nada):
python -X utf8 04_Triggers/manual_trigger.py --scan --path "C:/Users/sebas/Desktop/Think_Different"

# Ciclo completo (dry-run):
python -X utf8 04_Triggers/manual_trigger.py --full --path "C:/Users/sebas/Desktop/Think_Different"

# Ciclo completo LIVE (aplica fixes):
python -X utf8 04_Triggers/manual_trigger.py --full --apply --path "C:/Users/sebas/Desktop/Think_Different"
```

### 3. Uso via run.bat (solo CMD)

```cmd
:: Desde CMD en la carpeta del motor:
run --scan
run --full
run --full --apply
```

### 4. Reporte de estado

```bash
python -X utf8 04_Triggers/manual_trigger.py --report --path "C:/Users/sebas/Desktop/Think_Different"
```

---

## Arquitectura

```
05_Scripts/01_Auto_Improvement/
  01_Engine/              # Motor: detector, analyzer, executor, learner
  02_Rules/               # Reglas de deteccion y auto-fix
  03_Metrics/             # Logs y metricas de ejecucion
  04_Triggers/            # Disparadores (manual + Task Scheduler)
  05_Backups/             # Scripts legacy preservados
  06_Utils/               # Utilidades de auditoria
  run.bat                 # Entry point (solo CMD)
  QUICK_START.md          # Este archivo
  README.md               # Documentacion completa
```

---

## Task Scheduler (Windows)

La tarea `AutoImprovementPersonalOS` esta configurada para:

| Propiedad  | Valor                 |
|-----------|----------------------|
| Frecuencia | Cada 8 horas (480 min)|
| Inicio     | 2026-05-28 09:05      |
| Script     | `run_scheduled.bat`   |
| Usuario    | sebas                 |
| Modo       | Dry-run (solo escanea)|

### Para desactivar temporalmente

```cmd
schtasks /change /tn "AutoImprovementPersonalOS" /disable
```

### Para reactivar

```cmd
schtasks /change /tn "AutoImprovementPersonalOS" /enable
```

### Para cambiar a LIVE (aplica fixes)

Editar `04_Triggers/run_scheduled.bat` y reemplazar:
```
python -X utf8 "%~dp0cron_trigger.py" --once --path "%CD%"
```
por:
```
python -X utf8 "%~dp0cron_trigger.py" --once --apply --path "%CD%"
```

---

## Output

Los resultados del scan se guardan en:
- `03_Metrics/improvement_log.json` — Log de mejoras
- `03_Metrics/execution.log` — Log de ejecuciones
- `03_Metrics/last_run.json` — Ultimo resultado

---

*Think Different PersonalOS — Auto-Improvement v2.0 SOTA*
