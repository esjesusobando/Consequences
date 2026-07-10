# 🔁 Workflow: Every — Quality Gate Pipeline

> **Trigger:** Cuando el usuario diga "Every" o "every"
> **Pipeline:** `ce:review` → `ce:compound` → `judgment-day`

---

## Propósito

Cada ciclo debe compoundear el aprendizaje. "Every" es el **quality gate automático** después de cualquier trabajo sustancial:

1. **`ce:review`** — Revisa el código/escribe cambios con lentes de calidad
2. **`ce:compound`** — Documenta lecciones aprendidas en `06_Solutions/`
3. **`judgment-day`** — Auditoría adversarial dual para validar que no haya regresiones

> Sin este pipeline, el trabajo se acumula invisible y las lecciones se pierden.

---

## Cuándo usarlo

- Después de implementar un cambio no trivial (2+ files)
- Antes de hacer commit o PR
- Al cerrar una sesión de trabajo
- Explicitamente: cuando el usuario diga **"Every"**

---

## Pipeline

### FASE 1 — `ce:review`

```
skill("ce:review")
```

- Revisa el diff actual con `review-readability`, `review-reliability`, `review-resilience`, `review-risk`
- Reporta findings con confianza gateada
- Findings CRITICAL → detener pipeline hasta resolver

### FASE 2 — `ce:compound`

```
skill("ce:compound")
```

- Documenta lo aprendido en `01_Personal_Os/01_Memory/00_Context_LLM/06_Solutions/`
- Incluye: root cause, fix, patrones, gotchas
- Usar `mem_save` con `type: discovery | bugfix | pattern | decision`

### FASE 3 — `judgment-day`

```
skill("judgment-day")
```

- Blind dual review (Judge A + Judge B)
- Fix confirmed issues
- Re-judge after fixes
- Solo avanzar si ambos judges pasan en CRITICAL

---

## Diagrama

```text
Usuario dice "Every"
       │
       ▼
┌───────────────┐
│  ce:review    │─── CRITICAL? ──→ DETENER, arreglar
└───────┬───────┘
        ▼
┌───────────────┐
│  ce:compound  │─── guarda en 06_Solutions/
└───────┬───────┘
        ▼
┌───────────────┐
│ judgment-day  │─── Judge A + Judge B
└───────┬───────┘
        ▼
    ✅ DONE
```

---

## Reglas

- ❌ No saltarse `ce:compound` — si no se documenta, no pasó
- ❌ No ejecutar `judgment-day` sin `ce:review` primero
- ✅ Si el cambio es trivial (1 file, docs/text), saltar pipeline
- ✅ Si un paso falla, reportar y detener — no continuar automáticamente
- 🔄 Si `judgment-day` genera fixes → re-ejecutar `ce:compound` para actualizar lecciones post-fix

---

© 2026 PersonalOS | Every cycle compounds. Every lesson counts.
