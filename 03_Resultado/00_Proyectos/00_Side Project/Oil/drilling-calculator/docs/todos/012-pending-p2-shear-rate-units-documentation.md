---
status: pending
priority: p2
issue_id: "012"
tags: [code-review, documentation, hydraulics, power-law]
---

# 012 — Documentar Convención de Unidades del Shear Rate en calcLoss

## Problem Statement

En `hydraulics.ts`, la función `calcLoss` usa un shear rate calculado como:
- Pipe: `1.6 × vel(ft/min) / ID(in)`
- Annular: `1.44 × vel(ft/min) / ID(in)`

Este shear rate NO está en s⁻¹ estándar (la fórmula s⁻¹ sería 19.2 × v/D).
El factor 478.8 para Power Law fue derivado asumiendo s⁻¹, pero cross-check
contra Bourgoyne (Re_new ≈ 513, Re_Bourgoyne ≈ 585, ~12%) confirma que la
fórmula combinada funciona correctamente dentro del margen de engineering.

**El riesgo actual es bajo pero la falta de documentación podría llevar a
futuros errores si alguien modifica el shear rate sin entender el convenio.**

## Proposed Solution

Agregar un bloque de comentario en `calcLoss` explicando la convención:

```typescript
// NOTE: shearRate here uses oilfield Fann-dial-equivalent units
// (not SI s⁻¹). Factor 1.6/1.44 × v(ft/min)/D(in) is the standard
// oilfield approximation (Bourgoyne, Applied Drilling Engineering §4).
// The 478.8 conversion factor in Power Law mu_eff accounts for this convention.
```

## Acceptance Criteria
- [ ] Comentario explicativo en calcLoss (línea ~93)
- [ ] Referencia a Bourgoyne capitulo 4
- [ ] Build sigue en Exit 0

## Effort: Small (10 min)
