# 🐙 Octopus — Ejecución Paralela Multi-Brazos

> **Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Concepto

Metodología de ejecución paralela donde múltiples "brazos" trabajan simultáneamente con coordinación central mínima, maximizando throughput.

## Skill

`00_Octopus_Skill/SKILL.md` — Skill completa con runbook y estándares

## Principios

1. **Cada brazo es independiente** — No comparte estado con otros brazos
2. **Coordinación central mínima** — Solo el Director sabe qué hacen todos
3. **Sin interdependencias** — Si una tarea falla, las demás continúan
4. **Agregación al final** — El Director junta los resultados

## Cuándo Usar

| Scenario                        | Ejemplo                       |
| ------------------------------- | ----------------------------- |
| Múltiples tareas independientes | "Procesa estos 10 PDFs"       |
| Trabajo paralelo                | "Descarga estos archivos"     |
| Análisis paralelo               | "Audita estas 5 carpetas"     |
| Generación batch                | "Crea versiones para 3 temas" |

## Runbook

### Trigger
```
"Ejecuta esto en paralelo"
"Múltiples brazos"
"Paralelo"
```

### Implementación
```python
# Ejecutar múltiples tareas en paralelo
tasks = [
    {"prompt": "Procesa archivo 1", "agent": "general"},
    {"prompt": "Procesa archivo 2", "agent": "general"},
    ...
]
results = await task(tasks, mode="parallel")
```

### Reglas
1. Timeout por brazo
2. Retry logic
3. Documentar qué ejecutó cada brazo

## Comparación con otras Formaciones

| Formación       | Complejidad   | Verificación   | Docs    | Memoria   |
| --------------- | ------------- | -------------- | ------- | --------- |
| **Octopus**     | Baja          | ❌              | ❌       | ❌         |
| **4 Fantásticos** | Media         | ✅              | ✅       | ✅         |
| **Super Campeones** | Alta          | ✅              | ✅       | ✅         |

## Integración

- **Super Campeones**: Octopus es más simple, sin reviewers
- **4 Fantásticos**: 4F tiene verificación + docs + Engram
- **SDD**: Octopus puede ejecutar tasks SDD en paralelo

---

*Octopus v1.0 — 2026-05-19*