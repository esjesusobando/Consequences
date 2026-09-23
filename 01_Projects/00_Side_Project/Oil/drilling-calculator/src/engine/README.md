# Engine — Drilling Calculator

## Overview

Motor de cálculo engine para la calculadora de perforación. Proporciona las funciones core de incertidumbre, covariance computation, and collision avoidance mathematics.

## Funciones Principales

| Función                    | Descripción                                               |
|---------------------------|----------------------------------------------------------|
| `computeUncertaintyProfile`| Perfil de incertidumbre para una trayectoria de pozos dado|
| `uncertainty-engine`       | Motor principal de cálculo de incertidumbre               |
| `riskLevelColor`           | Mapeo de niveles de riesgo a colores                      |
| `getLodLevel`              | Nivel de detalle basado en cuenta de stations             |
| `computeStationLod`        | LOD por estación (distant stations = fewer segments)      |
| `computeForwardCone`       | Crecimiento lineal del cono forward para halo visual      |
| `visibleBounds`            | Bounds de cámara considerando wells ocultos               |

## Cambios Recientes (2026-08-23)

- **Fix crash guard 1**: Validación `adjacentTrajectory && adjCovCache && adjacentTrajectory.length > 0` antes de acceder `adjCovCache.get()` - previene crash cuando adjacentTrajectory está vacío.
- **Fix crash guard 2**: `Math.min(bestIdx, primary.length - 1)` para prevenir `primary[bestIdx]` out-of-bounds access.
- **New: getLodLevel()**: Nivel de detalle por cuenta de stations (0=minimal 1-8, 1=medium 9-26, 2=max 27+).
- **New: computeStationLod()**: LOD per-station que reduce segments para stations distantes.
- **New: computeForwardCone()**: Modelo de crecimiento lineal major-axis para cono forward visual.

## Constants

- `DEFAULT_ELLIPSE_K` — Factor k para elipse incertidumbre default
- `DEFAULT_SF_K` — Factor k para safety factor

## Development

```bash
# Run dev server

npm run dev -- --webpack

# Type check

npx tsc --noEmit

# Build

npm run build
```
