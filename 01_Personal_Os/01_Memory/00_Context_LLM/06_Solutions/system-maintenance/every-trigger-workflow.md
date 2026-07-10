---
project: PersonalOS
tags: [workflow, trigger, every, quality-gate, review, compound, judgment-day]
category: system-maintenance
---

# Every Trigger — Quality Gate Pipeline

## What

Se creó el trigger "Every" como pipeline de calidad post-cambio: al decir "Every" → `ce:review` → `ce:compound` → `judgment-day`.

## Why

Cada ciclo de trabajo debe compoundear el aprendizaje. Sin un quality gate automático, los cambios se acumulan sin revisión y las lecciones se pierden.

## Where

- `01_Personal_Os/00_Core/00_Workflows/05_Compound_Engineering/20_Every_Trigger.md` — workflow completo
- `CLAUDE.md` — trigger registrado en `active_triggers` (línea 122) + referencia en CE commands (línea 280)

## Learned

- Los cambios puramente aditivos (nuevos archivos + líneas agregadas) no dañan nada y son seguros de documentar como workflow.
- El pipeline Every funciona: ce:review encontró 4 hallazgos P3 cosméticos, nada bloqueante.
- Para documentación trivial, el pipeline recomienda saltar (regla en el mismo workflow), pero es útil para probar que el trigger funciona.
- Los nombres de archivo numerados en workflows deben seguir la secuencia existente (16-19 existentes → 20 para el nuevo).
