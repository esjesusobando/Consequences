---
title: "fix: Auditoría y Corrección Segura de Cálculos de Perforación"
type: fix
date: 2026-02-20
---

# fix: Auditoría y Corrección de Cálculos del Motor (Drilling Calculator)

## Overview

Tras una auditoría exhaustiva de los 7 módulos del motor (rheology, hydraulics, pressures, pump, volumetrics, circulation, cuttings-transport) comparando contra API RP 13B-1, API RP 13D, IADC Drilling Manual y referencias SLB/Halliburton/Bourgoyne et al., se identificaron **4 bugs de lógica** que afectan la precisión de los resultados.

**Restricciones absolutas:**
- CERO cambios estéticos (CSS, layout, componentes UI)
- CERO cambios de firma en interfaces (`drilling-types.ts`)
- CERO cambios en `orchestrator.ts` (el flujo de datos es correcto)
- Solo correcciones de fórmulas internas en funciones puras

---

## Hallazgos de la Auditoría

### Fórmulas CORRECTAS (no tocar)
- `AV = (24.51 × Q) / (D₁² - D₂²)` — constante 24.51 verificada matemáticamente
- `Re = 928 × MW × v(ft/s) × D(in) / μ` — correcto
- `ECD = MW + ΔP_ann / (0.052 × TVD)` — conforme a OilBrain
- `ΔP_bit = (MW × Q²) / (10858 × Cd² × TFA²)` — conforme a OilBrain
- `nozzleVelocity = Q × 0.3208 / TFA` — correcto
- `shearRate = 1.6 × v(ft/min) / D(in)` — equivale a 96v/D en unidades SI, correcto
- Triplex/Duplex pump factors — conforme a IADC

### Bugs Confirmados

| #  | Archivo         | Línea  | Descripción                                       | Severidad  |
|---|----------------|-------|--------------------------------------------------|-----------|
| B1 | `rheology.ts`   | 70     | `mu_eff` usa coeficiente 5.11 en vez de 300       | P1         |
| B3 | `hydraulics.ts` | 96-104 | Power Law μ_eff: factor `100/511^n` no documentado| P2         |
| B4 | `hydraulics.ts` | 182    | `velocityRatio` hardcodeado a 1.0                 | P3         |
| B5 | `volumetrics.ts`| 56-58  | Tiempos de circulación hardcodeados a 0 (stubs)   | P2         |

---

## Cambios Propuestos

### B1 — rheology.ts línea 70 (CRÍTICO)

```typescript
// ANTES: da PV + YP×0.01 (100x demasiado pequeño)
const mu_eff = pv + (yp * 5.11) / 511;

// DESPUÉS: viscosidad aparente Bingham a 511 s⁻¹ (estándar Bourgoyne/SLB)
const mu_eff = pv + (yp * 300) / 511;
```

### B3 — hydraulics.ts líneas 98-100 (IMPORTANTE)

```typescript
// ANTES: factor 100/511^n no documentado en estándares
mu_eff = (100 * K * Math.pow(shearRate || 1, n - 1)) / Math.pow(511, n);

// DESPUÉS: μ_eff(cP equiv.) = K × γ^(n-1) × 478.8
// (478.8 = factor de conversión lbf/100ft² a cP, API RP 13D §5)
mu_eff = K * Math.pow(shearRate || 1, n - 1) * 478.8;
```

### B4 — hydraulics.ts línea 182 (MENOR)

```typescript
// ANTES: hardcodeado
velocityRatio: 1.0,

// DESPUÉS: ratio real AV/PipeV
velocityRatio: pipeVelocity > 0 ? annularVelocity / pipeVelocity : 0,
```

### B5 — volumetrics.ts líneas 56-58 (DOCUMENTAR)

Solo se actualizan los comentarios para aclarar que estos son stubs intencionados.
Los valores de circulación viven en `CirculationResult`, no en `VolumetricsResult`.

---

## Verificación

### Build Check
```bash
# Desde: drilling-calculator/
npm run build
# ESPERADO: Exit 0, cero errores TypeScript
```

### Valores Esperados (Ejercicio Maestro)
Datos: MW=12 ppg, θ600=60, θ300=40, θ3=3, θ6=5
- PV = 20 cP, YP = 20 lb/100ft²
- `mu_eff` ANTES: 20.2 cP (incorrecto)
- `mu_eff` DESPUÉS: **31.74 cP** (correcto conforme API RP 13D)

### Manual (Browser)
1. Abrir http://localhost:5176
2. Ingresar Ejercicio Maestro
3. Verificar Reología: mu_eff ≈ 31.7 cP
4. Probar todos los modelos (Bingham, Power Law, HB)
5. Confirmar que la app no crashea en ningún tab

---

## Referencias
- Bourgoyne et al. (1986), "Applied Drilling Engineering" — SPE Textbook Vol. 2
- API RP 13D: Rheology and Hydraulics of Oil-well Drilling Fluids
- API RP 13B-1: Field Testing Water-based Drilling Fluids
- Halliburton Drilling Engineering Handbook
