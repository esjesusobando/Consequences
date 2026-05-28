# Session Evals — Evaluacion de Sesiones y Sistema

Capture, review, and improve AI-assisted workflows through structured evaluation.

---

## Estructura

```
08_Evals/
  README.md                       # Este archivo
  01_Agente_Evals/                # Evaluaciones de sesiones de agente
    01_EV_Claude_Opus_03_26.md    # Eval: Claude Opus session
  02_System_Evals/                # Evaluaciones de componentes del sistema
    EV_System_Estructural_Optimization_Fase4.md
    EV_System_Auto_Improvement_State.md
  03_Templates/                   # Plantillas para crear nuevas evals
    EV_Template.md                # Template generico
```

---

## Judgement Values

- `success`: Task completed correctly
- `partial`: Mostly done, minor issues
- `failure`: Task failed or wrong result
- `pending`: Not yet reviewed

---

## Axial Codes

| Code | Meaning |
|------|---------|
| `good-context-gathering` | Read/explored before acting |
| `efficient-tool-use` | Minimal tool calls |
| `iterative-refinement` | Improved based on feedback |
| `task-tracking` | Used TodoWrite |
| `incomplete` | Stopped before done |

---

## Integracion con Auto_Improvement

Las evaluaciones de sistema (`02_System_Evals/`) sirven como input para el Learner del motor Auto_Improvement en `04_Operations/01_Auto_Improvement/`.

Ciclo de feedback:
1. Auto_Improvement ejecuta escaneo → detecta issues
2. Resultados se registran en Evals como System Evals
3. Evals alimentan al Learner para mejorar reglas
4. Reglas mejoradas → mejor deteccion en proximo escaneo

---

*Actualizado: 2026-05-28 (Fase 5 — Estructura expandida)*
