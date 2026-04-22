---
name: morning-standup
description: "Ritual de Daily Standup para iniciar el día con claridad. Ejecuta el script 14_Morning_Standup.py. Triggers: morning standup, daily standup, standup, comenzar día, iniciar mañana, revisión diaria, planning daily."
version: 1.0.0
---

# ☀️ Morning Standup - Ritual Diario

## Propósito

Iniciar el día con claridad y enfoque, siguiendo el flujo de PersonalOS.

## Cuándo Usar Esta Skill

- "morning standup"
- "daily standup"
- "comenzar el día"
- "revisión diaria"
- "qué tengo que hacer hoy"
- Al inicio de la jornada laboral

## Flujo del Standup

### Paso 1: Revisar Contexto

1. Leer `00_Winter_is_Coming/GOALS.md` - Objetivos estratégicos
2. Leer `00_Winter_is_Coming/BACKLOG.md` - Tareas pendientes
3. Ejecutar `mem_context(limit=10)` - Contexto de sesiones previas

### Paso 2: Ejecutar Script

```bash
python 08_Scripts_Os/Ritual_Fixed/14_Morning_Standup.py
```

### Paso 3: Identificar TOP 3 Prioridades

Del backlog, seleccionar las 3 tareas más importantes para hoy:
- **P0**: Crítico - hacer hoy
- **P1**: Importante - hacer esta semana
- **P2**: Programable

### Paso 4: Definir Next Actions

Para cada prioridad, definir:
- Primera acción concreta
- Tiempo estimado
- Bloqueos o dependencias

## Reglas

| Regla                  | Descripción               |
|------------------------|---------------------------|
| Máximo 3 prioridades   | No overloaded el día      |
| Una acción por tarea   | siguiente paso concreto   |
| Tiempo realista        | Estimar honestamente      |

## Errores Comunes

1. ❌ No revisar contexto antes de empezar
2. ❌ Seleccionar más de 3 tareas
3. ❌ No definir next action concreta
4. ❌ No estimar tiempo

## Integración

- Usa: `backlog-processing` para procesar items del backlog
- Vincula con: `GOALS.md` para mantener estrategia

---

*Skill Version: 1.0.0*
*Script: 14_Morning_Standup.py*
