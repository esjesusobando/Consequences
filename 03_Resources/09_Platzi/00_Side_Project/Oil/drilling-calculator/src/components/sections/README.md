# Sections — Drilling Calculator

## Overview

Sección de componentes para renderizado de secciones y vistas de pozo en la calculadora de perforación. Incluye vistas anti-colisión, perfiles de incertidumbre y visualización de riesgo.

## Componentes de Sección

| Componente       | Descripción                                                                |
|-----------------|---------------------------------------------------------------------------|
| `AntiCollision3D`| Visualización 3D anti-colisión con elipses de incertidumbre y conos forward|
| `Anticolision`   | Versión legacy/alternativa de anti-colisión                                |
| `PanelDetailView`| Vista detallada de panel con propiedades del pozo                          |
| `BitConfig`      | Configuración del bit de perforación                                       |
| `Formation`      | Sección de formaciones geológicas                                          |
| `WellControl`    | Control de bien y manejo de eventos de perforación                         |
| `WellGeometry`   | Geometría del pozo (MD, inc, azi)                                          |

## Recent Changes (2026-08-23)

- **AntiCollision3D.tsx**: Fix de typing strict (`any[]` → `UncertaintyStation[]`), guard conditions para prevenir crashes en el motor de incertidumbre. Mejoras en framing de cámara para sobreponer todas las wells visibles.
- **Anticolision.tsx**: Actualizado para compatibilidad con nuevos perfiles de incertidumbre.
- **PanelDetailView.tsx**: Pequeños ajustes de props y typing.

## LOD (Level of Detail)

- Detalle 0: 1-8 stations (mínimal)
- Detalle 1: 9-26 stations (medium)
- Detalle 2: 27+ stations (max)

## Development

```bash
# Run dev server

npm run dev -- --webpack

# Type check

npx tsc --noEmit

# Build

npm run build
```
