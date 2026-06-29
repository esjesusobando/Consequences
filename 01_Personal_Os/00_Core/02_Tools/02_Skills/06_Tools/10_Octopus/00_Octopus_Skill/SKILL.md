---
name: octopus
description: >
  Metodología OCTOPUS — Ejecución paralela multi-brazos. Formación 3-3-4 para tareas 
  que pueden paralelizarse. Activa cuando: múltiples tareas independientes, trabajo paralelo,
  coordinación mínima central, "ejecuta esto en paralelo", "múltiples brazos".
sota_upgraded: true
---

# 🐙 OCTOPUS — Ejecución Paralela Multi-Brazos

## Esencia Original

> **Metaskill**: Metodología de ejecución paralela donde múltiples "brazos" trabajan simultáneamente con coordinación central mínima, maximizando throughput.

Esta skill es el **multiplicador de fuerza** del PersonalOS. Permite ejecutar múltiples tareas independientes en paralelo.

## Principio Fundamental

**Múltiples brazos trabajando simultáneamente con coordinación central mínima.** 
Cada brazo es independiente y ejecuta su tarea sin depender de los otros.

## Cuándo Usar OCTOPUS

| Scenario                                                 | Ejemplo                                                                                      |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Múltiples tareas independientes                          | "Procesa estos 10 PDFs", "Genera imágenes para estas descripciones"                          |
| Trabajo paralelo                                         | "Descarga estos archivos", "Ejecuta estos tests"                                             |
| Análisis paralelo                                        | "Audita estas 5 carpetas"                                                                    |
| Generación batch                                         | "Crea versiones de este componente para 3 temas"                                             |

## Formación OCTOPUS

```
                    👤 USUARIO
                           │
                   ┌──────┴──────┐
                   │   DIRECTOR  │
                   └──────┬──────┘
                           │
   ┌───────┬───────┬───────┬───────┐
   │BRAZO 1│BRAZO 2│BRAZO 3│BRAZO 4│  (múltiples tareas)
   │  🦑   │  🦑   │  🦑   │  🦑   │   en paralelo
   └───────┴───────┴───────┴───────┘
```

## Implementación con Task Tool

```python
# Ejecutar múltiples tareas en paralelo usando Task tool
# del Task tool permite lanzar múltiples agentes

# Ejemplo: Procesar 5 archivos en paralelo
tasks = [
    {"prompt": "Procesa archivo 1", "agent": "general"},
    {"prompt": "Procesa archivo 2", "agent": "general"},
    {"prompt": "Procesa archivo 3", "agent": "general"},
    {"prompt": "Procesa archivo 4", "agent": "general"},
    {"prompt": "Procesa archivo 5", "agent": "general"},
]

# Ejecutar todas en paralelo
results = await task(tasks, mode="parallel")
```

## Reglas de Coordinación

1. **Cada brazo es independiente** — No comparte estado con otros brazos
2. **Coordinación central mínima** — Solo el director sabe qué hacen todos
3. **Sin interdependencias** — Si una tarea falla, las demás continúan
4. **Agregación al final** — El director junta los resultados

## Ejemplo de Uso

```
Usuario: "Genera thumbnails para todas las imágenes en esta carpeta"

→ Orquestador detecta: múltiples tareas independientes → OCTOPUS
→ Lanza 4 brazos paralelos (4 imágenes cada uno)
→ Cada brazo procesa su batch
→ Orquestador agrega resultados
→ Reporta al usuario
```

## Integración con Otras Metodologías

| Metodología                                  | Relación                                                                   |
|---------------------------------------------|---------------------------------------------------------------------------|
| **Super Campeones**                          | OCTOPUS es más simple, sin reviewers                                       |
| **4 FANTÁSTICOS**                            | 4F tiene verificación + docs + Engram                                      |
| **SDD**                                      | OCTOPUS puede ejecutar tareas del SDD en paralelo                          |

## Gotchas

- ❌ NO usar si las tareas tienen dependencias entre sí
- ❌ NO usar si se requiere validación entre brazos
- ✅ SIEMPRE agregar timeout por brazor
- ✅ SIEMPRE agregar retry logic
- ✅ DOCUMENTAR qué tareas ejecutó cada brazo

---

*Metodología derivada de Swarm patterns — Optimizado para Claude Code Task Tool*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
