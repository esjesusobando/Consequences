---
name: morning-standup
description: "Ritual de Daily Standup para iniciar el día con claridad. Ejecuta el script 14_Morning_Standup.py. Triggers: morning standup, daily standup, standup, comenzar día, iniciar mañana, revisión diaria, planning daily."
version: 1.0.0
sota_upgraded: true
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
python 01_Personal_Os/04_Operations/03_Scripts_Os/Ritual_Fixed/14_Morning_Standup.py
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

| Regla                                             | Descripción                                          |
|--------------------------------------------------|-----------------------------------------------------|
| Máximo 3 prioridades                              | No overloaded el día                                 |
| Una acción por tarea                              | siguiente paso concreto                              |
| Tiempo realista                                   | Estimar honestamente                                 |

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


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
