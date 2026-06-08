---
title: "Corrección de Fórmulas Reológicas e Hidráulicas en Motor de Cálculo de Perforación"
slug: "motor-reologia-hidraulica-mu-eff-formula-correction"
category: logic-errors
date: "2026-02-20"
status: solved
severity: p1
tags: [rheology, hydraulics, power-law, bingham, mu-eff, API-RP-13D, drilling-calculator]
affected_files:
  - src/engine/rheology.ts
  - src/engine/hydraulics.ts
related_issues: []
---

# Corrección de Fórmulas Reológicas e Hidráulicas

## Síntoma

Los valores calculados de viscosidad efectiva (`mu_eff`) en el motor eran:
- **Bingham**: `mu_eff = PV + YP × 0.01` → resultado 100× demasiado pequeño
- **Power Law**: `Re` llegaba a ~67,000 (turbulento) cuando debería ser ~500 (laminar) para lodos típicos
- **velocityRatio**: siempre retornaba `1.0` (hardcodeado)

## Causa Raíz

**Bug B1 — `rheology.ts:70`:**
El coeficiente de la fórmula de viscosidad aparente Bingham usaba `5.11/511 = 0.01` en lugar de `300/511 = 0.587`.

```typescript
// ❌ INCORRECTO
const mu_eff = pv + (yp * 5.11) / 511;  // da PV + 0.01×YP

// ✅ CORRECTO (Bourgoyne / API RP 13D §4)
const mu_eff = pv + (yp * 300) / 511;   // da PV + 0.587×YP
```

**Bug B3 — `hydraulics.ts:98-103`:**
La viscosidad efectiva Power Law usaba `(100 × K × γ^(n-1)) / 511^n`, un factor sin base en ningún estándar documentado, produciendo Re erróneos en 2 órdenes de magnitud.

```typescript
// ❌ INCORRECTO (factor 100/511^n sin fundamento)
mu_eff = (100 * K * Math.pow(shearRate, n - 1)) / Math.pow(511, n);

// ✅ CORRECTO (API RP 13D §5, factor 478.8 = conversión lbf·s/100ft² → cP)
mu_eff = K * Math.pow(shearRate, n - 1) * 478.8;
```

**Bug B4 — `hydraulics.ts:182`:**
`velocityRatio` hardcodeado a `1.0`.

```typescript
// ❌ INCORRECTO
velocityRatio: 1.0,

// ✅ CORRECTO
velocityRatio: pipeVelocity > 0 ? annularVelocity / pipeVelocity : 0,
```

## Solución Aplicada

### 1. rheology.ts — B1 mu_eff Bingham

Cambio en línea 69-70 de `rheology.ts`:
- `5.11` → `300` (la fórmula correcta usa 300 RPM como referencia para 511 s⁻¹)
- **Referencia:** Bourgoyne et al. "Applied Drilling Engineering" SPE Vol.2, Cap.4

### 2. hydraulics.ts — B3 Power Law μ_eff

Los 3 modelos reológicos ya eran correctos para Bingham. Para Power Law y HB:
- Factor corregido: `× 478.8` (= conversión dimensional lbf·s/100ft² → cP)
- **Referencia:** API RP 13D §5 (Power Law), §6 (Herschel-Bulkley)

### 3. hydraulics.ts — B4 velocityRatio

Reemplaza hardcode con cálculo real `AV / PipeV`.

### 4. Cleanup — variable `ratio` sin usar

Eliminada de `rheology.ts:38` (causaba TS6133 pre-existente en el build).

## Verificación

### Prueba numérica (Ejercicio Maestro)
Entradas: `MW=12 ppg`, `θ600=60`, `θ300=40`

| Métrica          | Antes               | Después             |
|-----------------|--------------------|--------------------|
| `mu_eff` (cP)    | 20.2                | **31.74** ✅         |
| Re Power Law     | ~67,300 (Turbulento)| **~513** ✅ (Laminar)|
| Re Bourgoyne ref.| —                   | ~585 (diff 12%)     |

### Build
```
npm run build → Exit 0 | 1767 módulos | 0 errores TypeScript
```

### Validador
```
python 06_ENGINE/14_logic_validator.py
→ PURE GREEN 18/18 checks OK
```

## Estrategia de Prevención

1. **Nuevas fórmulas reológicas** deben ser verificadas contra la tabla de conversión `478.8 cP/(lbf·s/100ft²)`.
2. **El validador** `14_logic_validator.py` fue actualizado (v2.0.0) con 3 nuevos checks que verifican los patrones correctos de mu_eff.
3. **El salvavidas** `15_logic_restorer.py` tiene snapshot del estado PURE GREEN en `golden_state/`.
4. **Documentación de referencia:** `docs/knowledge_base/oil_brain_standards.md` actualizado con tabla de correcciones.

## Factor de Conversión 478.8 Explicado

```
1 lbf/ft² = 47.88 Pa
1 lbf/100ft² = 0.4788 Pa
μ_eff [Pa·s] = K [lbf·s^n/100ft²] × γ^(n-1) [s^-(n-1)]
μ_eff [cP] = μ_eff [Pa·s] × 1000
→ μ_eff [cP] = K × γ^(n-1) × 0.4788 × 1000 = K × γ^(n-1) × 478.8
```

## Referencias

- Bourgoyne et al. (1986), *Applied Drilling Engineering*, SPE Textbook Vol. 2
- API RP 13D: *Rheology and Hydraulics of Oil-well Drilling Fluids*
- API RP 13B-1: *Field Testing Water-based Drilling Fluids*
