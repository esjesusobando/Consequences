# Telemetry Collector — PersonalOS v3.0

**Version:** 1.0 | **Date:** 2026-04-25

---

## Que es?

Sistema de telemetría que registra cada ejecución de HUB para análisis posterior.

---

## Ubicación

```
01_Personal_Os/04_Operations/00_Context_LLM/12_Telemetry/
├── events.jsonl           # Una línea por evento
├── hourly_summary.json   # Resumen por hora
└── daily_summary.json  # Resumen por día
```

---

## Formato de Evento

```jsonl
{"timestamp": "2026-04-25T16:42:00", "hub": "15_MCP_Sync_Hub", "duration_ms": 4500, "success": true, "exit_code": 0}
{"timestamp": "2026-04-25T16:43:00", "hub": "16_System_Mapper", "duration_ms": 9000, "success": true, "exit_code": 0}
{"timestamp": "2026-04-25T16:44:00", "hub": "17_Watchdog", "duration_ms": 62000, "success": false, "exit_code": 1, "error": "timeout"}
```

---

## Métricas Capturadas

| Campo           | Tipo      | Descripción        |
|-----------------|-----------|--------------------|
| `timestamp`     | ISO8601   | Cuándo             |
| `hub`           | string    | Qué HUB            |
| `duration_ms`   | int       | Cuánto tiempo      |
| `success`       | bool      | Status             |
| `exit_code`     | int       | Código de salida   |
| `error`         | string?   | Error si falló     |
| `who_called`    | string?   | Quién lo invocó    |

---

## Dashboard

Ejecutar:
```bash
python 18_Telemetry_Hub.py --dashboard
```

Muestra:
- HUBs más usados
- Tiempos promedio
- Tasa de éxito
- Últimos errores

---

*Think Different PersonalOS v3.0 Consequences*
