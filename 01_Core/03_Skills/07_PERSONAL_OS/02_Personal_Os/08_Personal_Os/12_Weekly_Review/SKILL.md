---
name: weekly-review
description: "Ritual de Weekly Review para reflexionar sobre la semana y planificar la siguiente. Ejecuta el script 15_Weekly_Review.py. Triggers: weekly review, revisión semanal, retrospective, fin de semana, planning semanal, qué logré esta semana."
version: 1.0.0
---

# 📅 Weekly Review - Revisión Semanal

## Propósito

Reflexionar sobre la semana pasada, celebrar logros, y planificar la siguiente semana con claridad.

## Cuándo Usar Esta Skill

- "weekly review"
- "revisión semanal"
- "retrospective"
- "fin de semana"
- "planning semanal"
- "qué logré esta semana"

## Flujo del Weekly Review

### Paso 1: Celebrar wins

Revisar qué se logró esta semana:
- Tareas completadas en `03_Tasks/`
- Commits realizados
- Goals progresados

### Paso 2: Análisis

1. **Qué funcionó bien**: Identificar patrones exitosos
2. **Qué no funcionó**: Detectar blockers o distracciones
3. **Lessons learned**: Insights para mejorar

### Paso 3: Ejecutar Script

```bash
python 08_Scripts_Os/Ritual_Fixed/15_Weekly_Review.py
```

### Paso 4: Planificar Próxima Semana

1. Revisar BACKLOG.md y seleccionar prioridades
2. Definir 3 metas principales para la semana
3. Alinear con GOALS.md

### Paso 5: Limpiar

- Archivar tareas completadas
- Actualizar BACKLOG.md
- Guardar en Engram

## Reglas

| Regla                     | Descripción          |
|---------------------------|----------------------|
| Hacer viernes o domingo   | Fin de ciclo         |
| Sin interrupciones        | 30-60 min de focus   |
| Documentar insights       | Guardar en Engram    |

## Errores Comunes

1. ❌ No hacer review semanal
2. ❌ Solo listar tareas sin análisis
3. ❌ No vincular con objetivos (GOALS)
4. ❌ No guardar insights

## Integración

- Usa: `backlog-processing` para limpiar backlog
- Usa: `morning-standup` para planificar siguiente semana
- Vincula con: `GOALS.md` para estrategia

---

*Skill Version: 1.0.0*
*Script: 15_Weekly_Review.py*
