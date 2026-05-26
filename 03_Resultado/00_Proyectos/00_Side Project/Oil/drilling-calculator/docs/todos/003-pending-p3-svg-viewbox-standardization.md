---
status: pending
priority: p3
issue_id: 003
tags: [code-review, ui, svg, quality]
dependencies: []
---

# Problem Statement

Inconsistencia en los `viewBox` y proporciones de los SVGs utilizados en los visualizadores. Esto puede causar problemas de alineación visual cuando se escalan en diferentes tamaños de pantalla o densidades de píxeles.

# Findings

- `PressureWindow.tsx` usa `viewBox="0 0 100 60"`.
- `RheologyChart.tsx` usa `viewBox="0 0 300 150"`.
- `WellboreSchematic.tsx` usa `viewBox="0 0 40 120"`.
- La falta de una base común (ej: 100x100 o ratios consistentes) dificulta el mantenimiento de los estilos CSS compartidos.

# Proposed Solutions

1. **Estandarización**: Migrar todos los visualizadores a un sistema coordinado (ej: 100 base para el eje X) para facilitar el cálculo de coordenadas relativas.
2. **CSS Aspect-Ratio**: Utilizar la propiedad CSS `aspect-ratio` en los contenedores para asegurar que el SVG no se deforme.

# Recommended Action

(A la espera de revisión)

# Technical Details

- Archivos afectados: `PressureWindow.tsx`, `RheologyChart.tsx`, `WellboreSchematic.tsx`.

# Acceptance Criteria

- [ ] Los SVGs mantienen proporciones armoniosas entre sí.
- [ ] No hay distorsión en pantallas ultra-wide o móviles.

# Work Log

- 2026-02-11: Identificado durante `/workflows:review`.

# Resources

- [Visuals Directory](file:///c:/Users/sebas/Downloads/01 Revisar/07 Now/personal-os-main/personal-os-main/Side Project/Oil/drilling-calculator/src/components/visuals/)
