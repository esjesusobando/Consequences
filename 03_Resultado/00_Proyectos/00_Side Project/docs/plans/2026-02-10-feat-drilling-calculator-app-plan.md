---
title: Drilling Calculator App - Dieter Rams Edition
type: feat
date: 2026-02-10
---

# Drilling Calculator App: Dieter Rams Edition

## Overview

Creación de una aplicación web robusta ("Silicon Valley Grade") para cálculos de ingeniería de perforación. La aplicación transformará el boceto actual (`drilling_calculator_integrated.jsx`) en un sistema modular, escalable y estéticamente superior, siguiendo estrictamente los **10 Principios del Buen Diseño de Dieter Rams** y la metodología **Compound Engineering**.

> [!IMPORTANT]
> **Doble Validación**: Cada módulo de cálculo implementa **dos capas de validación independientes** para garantizar integridad operacional. Este es un requisito no negociable en ingeniería de pozos.

## Problem Statement

El "boceto" actual es un componente monolítico de ~1000 líneas que mezcla UI, lógica de negocio y estado. Esto viola principios de mantenibilidad, escalabilidad y testabilidad ("Robustez"). Además, la UI carece de la sofisticación estética ("Sleek Dark") requerida por los estándares de PersonalOS.

## Proposed Solution

Desarrollar una **Single Page Application (SPA)** moderna utilizando **Vite + React + TypeScript**.
La arquitectura separará claramente:

1.  **Logic Layer**: Motores de cálculo puros (Volumetría, Hidráulica, Reología).
2.  **State Layer**: Gestión de estado global (Zustand) para persistencia y reactividad.
3.  **UI Layer**: Componentes atómicos diseñados bajo el sistema "Sleek Dark" (Glassmorphism, HSL).

---

## 🛡️ Sistema de Doble Validación (Dual Guard)

Cada sección/módulo de cálculo implementa **dos capas de validación** antes de mostrar resultados al usuario:

| Capa  | Nombre      | Descripción                                                                    | Cuándo se ejecuta    |
|------|------------|-------------------------------------------------------------------------------|---------------------|
| **V1**| Input Guard | Validación de rango, tipo y coherencia de datos de entrada                     | Al escribir / on blur|
| **V2**| Output Guard| Validación cruzada de resultados contra límites físicos y fórmulas alternativas| Después del cálculo  |

### Detalle por Módulo

#### 1. Volumetría (Volumetrics)

| Validación           | Tipo        | Regla                                                       | Ejemplo                                 |
|---------------------|------------|------------------------------------------------------------|----------------------------------------|
| **V1** — Input Guard | Rango       | `holeSize > drillPipeOD > drillPipeID > 0`                  | Hole 12.25" > DP OD 5" > DP ID 4.276" ✅ |
| **V1** — Input Guard | Coherencia  | `drillPipeLength + hwdpLength + dcLength ≤ totalDepth`      | 7200 + 300 + 500 = 8000 ≤ 8000 ✅        |
| **V2** — Output Guard| Cross-check | `totalSystemVolume = totalInsideVolume + totalAnnularVolume`| Verificar suma ✅                        |
| **V2** — Output Guard| Rango físico| `holeCapacity ∈ [0.001, 0.5] bbl/ft`                        | Si sale 2.0 bbl/ft → ⚠️ Error           |

#### 2. Reología (Rheology)

| Validación           | Tipo               | Regla                                                                                | Ejemplo                      |
|---------------------|-------------------|-------------------------------------------------------------------------------------|-----------------------------|
| **V1** — Input Guard | Rango              | `theta600 > theta300 > theta200 > theta100 > theta6 > theta3 > 0`                    | Lecturas Fann monotónicas ✅  |
| **V1** — Input Guard | Coherencia         | `theta600 ≥ 2 × theta300` no es obligatorio, pero `theta600 < theta300` es inválido  | Alerta si se invierte ✅      |
| **V2** — Output Guard| Fórmula alternativa| `PV_check = apparentViscosity × 2 - theta300` comparar con `PV = theta600 - theta300`| Ambos deben coincidir ✅      |
| **V2** — Output Guard| Rango físico       | `n (Power Law index) ∈ [0.3, 1.0]`, `YP ∈ [0, 100] lb/100ft²`                        | Si n = 1.8 → ⚠️ Revisar datos|

#### 3. Presiones (Pressure Analysis)

| Validación           | Tipo             | Regla                                                                        | Ejemplo                             |
|---------------------|-----------------|-----------------------------------------------------------------------------|------------------------------------|
| **V1** — Input Guard | Rango            | `porePressureGradient ∈ [0.3, 1.0] psi/ft`                                   | 0.52 psi/ft ✅                       |
| **V1** — Input Guard | Coherencia       | `fractureGradient > porePressureGradient`                                    | 0.85 > 0.52 ✅                       |
| **V2** — Output Guard| Cross-check      | `hydrostaticPressure = mudWeight × 0.052 × TVD` recalcular independientemente| Comparar con resultado del motor ✅  |
| **V2** — Output Guard| Ventana operativa| `minMudWeight < mudWeight < maxMudWeight`                                    | Si MW fuera de ventana → 🔴 CRITICAL |

#### 4. Hidráulica (Hydraulics)

| Validación           | Tipo              | Regla                                                       | Ejemplo                        |
|---------------------|------------------|------------------------------------------------------------|-------------------------------|
| **V1** — Input Guard | Rango             | `bitNozzles[i] ∈ [6, 32]` (32avos de pulgada)               | Nozzle de 14/32 ✅              |
| **V1** — Input Guard | Coherencia        | `standpipePressure > 0` y `numberOfPumps ≥ 1`               | 2850 psi, 2 bombas ✅           |
| **V2** — Output Guard| Balance de presión| `SPP ≈ ΔP_dp + ΔP_hwdp + ΔP_dc + ΔP_bit + ΔP_annular (±15%)`| Si diff > 15% → ⚠️ Warning     |
| **V2** — Output Guard| ECD Check         | `ECD < fractureGradient / 0.052`                            | Si ECD > fractura → 🔴 CRITICAL |

#### 5. Bomba y Caudal (Pump & Flow)

| Validación           | Tipo        | Regla                                                                     | Ejemplo                                 |
|---------------------|------------|--------------------------------------------------------------------------|----------------------------------------|
| **V1** — Input Guard | Rango       | `linerDiameter ∈ [3, 8] in`, `SPM ∈ [20, 140]`, `efficiency ∈ [70, 100]%` | 6.5", 85 SPM, 90% ✅                     |
| **V1** — Input Guard | Tipo bomba  | Si Triplex → `rodDiameter` no aplica. Si Duplex → `rodDiameter` requerido.| Filtro condicional ✅                    |
| **V2** — Output Guard| Rango físico| `flowRate ∈ [100, 1200] GPM` para bombas estándar                         | Si sale 2000 GPM → ⚠️ Revisar eficiencia|
| **V2** — Output Guard| HHP Check   | `HHP = (SPP × Q) / 1714`, verificar contra cálculo independiente          | Ambos métodos deben coincidir ✅         |

#### 6. Tiempos de Circulación (Circulation Times)

| Validación           | Tipo               | Regla                                                | Ejemplo                                |
|---------------------|-------------------|-----------------------------------------------------|---------------------------------------|
| **V1** — Input Guard | División por cero  | `flowRateBBLmin > 0` antes de calcular               | Si Q = 0 → mostrar "—" en vez de NaN ✅ |
| **V1** — Input Guard | Dependencia        | Requiere Volumetría y Bomba completados              | Si falta data → deshabilitar sección ✅ |
| **V2** — Output Guard| Coherencia temporal| `fullCirculation = surfaceToBit + bitToSurface`      | Verificar suma exacta ✅                |
| **V2** — Output Guard| Rango razonable    | `fullCirculation ∈ [10, 300] min` para pozos estándar| Si sale 500 min → ⚠️ Revisar inputs    |

#### 7. Alertas y Sistema de Seguridad (Alerts)

| Validación           | Tipo         | Regla                                                        | Ejemplo                                      |
|---------------------|-------------|-------------------------------------------------------------|---------------------------------------------|
| **V1** — Input Guard | Completitud  | Todas las secciones previas deben tener datos válidos        | No generar alertas sobre datos incompletos ✅ |
| **V1** — Input Guard | Prioridad    | Alertas Critical > Warning > Info (ordenamiento)             | Kick siempre primero ✅                       |
| **V2** — Output Guard| No duplicados| Una misma condición no genera dos alertas                    | Filtro de deduplicación ✅                    |
| **V2** — Output Guard| Coherencia   | Si `overbalance > 0` no puede haber alerta de "Underbalanced"| Validación lógica cruzada ✅                  |

---

## Design Philosophy: Dieter Rams Applied

1.  **Good design is innovative**: Uso de Web Workers para cálculos en tiempo real sin bloquear la UI.
2.  **Good design makes a product useful**: Prioridad absoluta a la precisión de los datos y claridad de los resultados.
3.  **Good design is aesthetic**: Interfaz "Sleek Dark" (`hsl(230, 100%, 67%)` accents, glassmorphism).
4.  **Good design makes a product understandable**: Flujo lógico de inputs (arriba) a outputs (abajo). Visualizaciones gráficas claras.
5.  **Good design is unobtrusive**: La herramienta es el protagonista, no la decoración.
6.  **Good design is honest**: Feedback visual inmediato de validaciones (Kicks, Fracturas). **Doble Validación activa**.
7.  **Good design is long-lasting**: Arquitectura modular agnóstica al framework UI.
8.  **Good design is thorough**: Manejo de todos los edge cases (división por cero, inputs inválidos). **Dual Guard en cada módulo**.
9.  **Good design is environmentally-friendly**: Código optimizado, lazy loading.
10. **Good design is as little design as possible**: Eliminación de ruido visual. Solo lo esencial.

## Technical Approach

### Architecture

- **Core**: React 19 (o última estable), TypeScript.
- **Build Tool**: Vite.
- **Styling**: Vanilla CSS Modules (con variables CSS para HSL tokens). _Nota: Se puede usar Tailwind v4 si se solicita explícitamente._
- **State**: Zustand (Store de Perforación).
- **Charts**: Recharts (modularizado).
- **Icons**: Lucide React.
- **Testing**: Vitest (Unit) + Playwright (E2E).
- **Validación**: Zod (schemas de input) + funciones de validación cruzada custom (output guards).

### Proposed File Structure

```
Side Project/Oil/drilling-calculator/
├── src/
│   ├── engine/                  # Logic Layer (funciones puras)
│   │   ├── volumetrics.ts       # Cálculos de volumetría
│   │   ├── rheology.ts          # Modelo Bingham + Power Law
│   │   ├── hydraulics.ts        # Hidráulica y velocidades
│   │   ├── pressures.ts         # Presiones y ventana de lodo
│   │   ├── pump.ts              # Caudal y HP
│   │   ├── circulation.ts       # Tiempos de circulación
│   │   └── __tests__/           # Tests unitarios por módulo
│   ├── guards/                  # Sistema Doble Validación
│   │   ├── input-guards.ts      # V1: Validaciones de entrada (Zod schemas)
│   │   ├── output-guards.ts     # V2: Validaciones de salida (cross-check)
│   │   ├── alert-engine.ts      # Motor de alertas con prioridad
│   │   └── __tests__/           # Tests de validación
│   ├── store/                   # State Layer
│   │   ├── drilling-store.ts    # Zustand store principal
│   │   └── types.ts             # Tipos TypeScript
│   ├── components/              # UI Layer
│   │   ├── ui/                  # Componentes atómicos (InputField, DataCard, Alert)
│   │   ├── sections/            # Secciones colapsables (WellGeometry, MudProps, etc.)
│   │   ├── charts/              # Gráficos (VolumeChart, PressureWindow, etc.)
│   │   └── layout/              # Header, Footer, MainLayout
│   ├── styles/                  # Design System
│   │   ├── tokens.css           # Variables HSL, spacing, typography
│   │   ├── glassmorphism.css    # Surface effects
│   │   └── global.css           # Reset y base
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Implementation Phases

#### Phase 1: Foundation (The Motor)

- Configuración de Vite + TS + ESLint.
- Implementación del Design System (Variables CSS, Tokens HSL).
- Migración de lógica de cálculo a funciones puras TypeScript en `src/engine/`.
- Implementación de **Input Guards** (V1) con Zod schemas en `src/guards/input-guards.ts`.
- Implementación de **Output Guards** (V2) con cross-checks en `src/guards/output-guards.ts`.
- Setup de Store (Zustand).
- **Tests unitarios para cada motor de cálculo Y cada guard**.

#### Phase 2: Core Implementation (The Body)

- Desarrollo de componentes de UI (Inputs, Paneles Colapsables, DataCards).
- Integración de módulos de cálculo con Doble Validación:
  - Volumetría + V1/V2
  - Reología + V1/V2
  - Hidráulica + V1/V2
  - Presiones + V1/V2
  - Tiempos de Circulación + V1/V2
- Implementación de Gráficos (Visualización de Pozo, Reología).
- **Motor de Alertas** integrado con Output Guards.

#### Phase 3: Polish & Optimization (The Soul)

- Aplicación de Glassmorphism y micro-interacciones.
- Sistema de Alertas Inteligentes (con animaciones de entrada/salida).
- Persistencia de datos (Local Storage).
- Indicadores visuales de estado de validación por sección (✅ válido / ⚠️ warning / 🔴 error).
- Validación final contra "Dieter Rams Principles".

## Acceptance Criteria

### Functional Requirements

- [ ] Cálculos coinciden exactamente con API/IADC standards (validado con tests).
- [ ] **Input Guard (V1)** activo en las 7 secciones, con feedback visual inmediato.
- [ ] **Output Guard (V2)** activo en las 7 secciones, con cross-check automático.
- [ ] Reactividad inmediata (<16ms) al cambiar inputs.
- [ ] Alertas críticas (Kick/Fractura) visibles claramente.

### Non-Functional Requirements

- [ ] Lighthouse Performance Score > 95.
- [ ] Arquitectura 100% TypeScript (Strict Mode).
- [ ] Diseño Responsive (Desktop First, pero usable en Tablet).
- [ ] **100% de cobertura de tests en `src/engine/` y `src/guards/`**.

### Quality Gates

- [ ] Zero `NaN` o `Infinity` en cualquier resultado renderizado.
- [ ] Ningún input inválido puede pasar V1 sin feedback visual.
- [ ] Ningún resultado fuera de rango físico puede pasar V2 sin alerta.

## Verification Plan

### Automated Tests (Vitest)

```bash
# Desde la raíz del proyecto drilling-calculator
npx vitest run --coverage
```

- **Engine tests**: Cada función pura (`volumetrics.ts`, `rheology.ts`, etc.) tiene tests con valores conocidos del boceto original.
- **Guard tests**: Cada Input Guard y Output Guard se prueba con valores válidos, límite y fuera de rango.
- **Integration**: Tests que verifican que V1 bloquea inputs inválidos antes de llegar al motor, y V2 detecta resultados anómalos.

### Manual Verification

1.  Abrir la app en el navegador (`npm run dev`).
2.  Ingresar los valores por defecto del boceto (Total Depth: 8000, MW: 10.5 ppg, etc.).
3.  Verificar que los resultados coinciden con los del boceto original.
4.  Modificar un input para que sea inválido (ej: `holeSize = 0`). Verificar que V1 muestra error visual.
5.  Verificar que al poner `mudWeight` por debajo de `minMudWeight`, se muestra alerta CRITICAL.

## Success Metrics

- Tiempo de carga < 1s.
- Cero errores de consola en flujo crítico.
- Aprobación visual "Wow Effect".
- **100% de las secciones con indicador de validación dual visible**.

## Dependencies & Prerequisites

- Node.js (LTS).
- Conocimiento de fórmulas de perforación (extraído del boceto).

## References

- Boceto original: `drilling_calculator_integrated.jsx`
- Oil & Gas Command Center: `Side Project/Oil/README.md`
- Dieter Rams: 10 Principles of Good Design
- API Standards: RP 13B, Spec 16A, Spec 10A
