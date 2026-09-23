# Visuals — Drilling Calculator

## Overview

Conjunto de componentes visuales para la calculadora de perforación, incluyendo renderizado 3D de trayectorias de pozos, incertidumbre y características anti-colisión.

## Componentes Principales

| Componente         | Descripción                                                                 |
|-------------------|----------------------------------------------------------------------------|
| `WellborePath`     | Representación de la trayectoria del pozo en 3D                             |
| `UncertaintyCone`  | Conos de incertidumbre forward-projecting (visualización de riesgo continuo)|
| `UncertaintyTube`  | Tubes de incertidumbre a lo largo del wellbore                              |
| `OperatingWindow`  | Ventana de operación con límites de presión/temperatura                     |
| `PressureWindow`   | Visualización de ventanas de presión                                        |
| `WellboreSchematic`| esquema simplificado del pozo                                               |

## Recent Changes (2026-08-23)

- **UncertaintyCone.tsx**: Agregado componente de cono de incertidumbre con soporte para startIndex clamping y growth model linear. Fix de bug donde startIndex >= stations.length impedía el renderizado.
- **UncertaintyTube.tsx**: Componente de tube de incertidumbre para visualización continua del perfil de riesgo.

## Dependencies

- `three` / `@react-three/fiber` — Renderizado 3D
- `@react-three/drei` — Helper components y utilities
- `../../engine/uncertainty-engine` — Lógica de perfiles de incertidumbre
- `../../engine/scene` — Colores y bounds de cámara

## Development

```bash
# Run dev server

npm run dev -- --webpack

# Type check

npx tsc --noEmit

# Build

npm run build
```
