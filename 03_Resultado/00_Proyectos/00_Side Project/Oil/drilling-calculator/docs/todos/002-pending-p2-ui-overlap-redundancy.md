---
status: pending
priority: p2
issue_id: 002
tags: [code-review, ui, ux, architecture]
dependencies: []
---

# Problem Statement

La columna de analíticas (`column--analytics`) presenta redundancia de datos al mostrar tanto los nuevos visualizadores secuenciales como la antigua `analytics-grid` con resultados numéricos (`VolumetricsResults`, `PressureResults`, etc.). Esto satura la interfaz y diluye el enfoque del "Superhuman Remix".

# Findings

- En `App.tsx:L87-104`, se renderizan los visualizadores (`WellboreSchematic`, `PressureWindow`, `RheologyChart`, `HydraulicsChart`).
- Inmediatamente después, en `App.tsx:L106-111`, se renderiza `analytics-grid` con componentes que muestran los mismos datos en formato de tabla o tarjeta simple.
- Esto causa un scroll excesivo y falta de jerarquía visual clara.

# Proposed Solutions

1. **Unificación (Recomendado)**: Integrar los resultados numéricos críticos dentro de los propios visualizadores (ej: mover `PressureResults` dentro o debajo de `PressureWindow`) y eliminar la `analytics-grid` redundante.
2. **Toggle de Vista**: Implementar un interruptor "Visual vs. Datos" para que el usuario elija el nivel de detalle.
3. **Sección Colapsable**: Envolver la `analytics-grid` en un componente `details/summary` o un acordeón premium.

# Recommended Action

(A la espera de feedback del usuario)

# Technical Details

- Archivo afectado: `src/App.tsx`
- Componentes a reubicar: `VolumetricsResults`, `PressureResults`, `CirculationResults`, `HydraulicsResults`.

# Acceptance Criteria

- [ ] No hay duplicidad de información crítica en la misma vista de scroll.
- [ ] La jerarquía visual prioriza los gráficos dinámicos.
- [ ] El diseño se mantiene en PURE GREEN y cumple con los estándares estéticos.

# Work Log

- 2026-02-11: Detectado durante la auditoría de código `/workflows:review`.

# Resources

- [App.tsx](file:///c:/Users/sebas/Downloads/01 Revisar/07 Now/personal-os-main/personal-os-main/Side Project/Oil/drilling-calculator/src/App.tsx)
