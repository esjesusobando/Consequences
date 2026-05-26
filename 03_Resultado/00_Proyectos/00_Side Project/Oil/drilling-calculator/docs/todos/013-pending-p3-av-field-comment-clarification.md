---
status: pending
priority: p3
issue_id: "013"
tags: [code-review, documentation, rheology]
---

# 013 — Aclarar Significado del Campo `av` en RheologyResult

## Problem Statement

En `rheology.ts`, el campo `av` se calcula como `mud.theta600 / 2`.
El nombre "av" sugiere "apparent viscosity" pero:
- `θ600 / 2` = (2×PV + YP) / 2 = PV + YP/2

Esta no es una definición estándar. La viscosidad aparente de Bingham a 600 RPM
es `μ_app = θ600` (en cP equiv.), no θ600/2.
El valor `θ600/2` es la media del Fann reading a 600 RPM, no una viscosidad reconocida.

**Sin impacto en cálculos del motor.** El campo solo aparece en display.

## Proposed Solution

Opción A: Cambiar comentario para aclarar:
```typescript
// av: Medio del reading Fann a 600 RPM (display reference, not a standard viscosity)
const av = mud.theta600 / 2;
```

Opción B: Cambiar a la definición estándar de AV (aparente a 600 RPM):
```typescript
// av: Apparent Viscosity at 600 RPM (API RP 13B-1) = θ600 / 2 for Newtonian equiv.
const av = mud.theta600 / 2; // θ600 in Fann = 2×PV+YP; AV = θ600/2 is standard API
```

(En realidad API RP 13B-1 SÍ define AV = θ600/2 para fluidos tipo Bingham.
El cálculo es correcto; solo falta la referencia.)

## Acceptance Criteria
- [ ] Comentario aclara que AV = θ600/2 es definición API RP 13B-1
- [ ] No cambiar el valor del cálculo

## Effort: Tiny (5 min)
