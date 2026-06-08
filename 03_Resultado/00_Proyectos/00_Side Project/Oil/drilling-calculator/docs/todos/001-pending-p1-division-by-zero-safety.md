---
status: pending
priority: p1
issue_id: 001
tags: [code-review, security, safety]
dependencies: []
---

# Problem Statement

Riesgo de división por cero en cálculos críticos de seguridad operativa.

# Findings

En `App.tsx` (línea 75) y `orchestrator.ts`, el cálculo del "Safety Margin" y el "ECD Gauge" dependen de la profundidad vertical verdadera (`tvd`). Si el usuario ingresa un valor de 0 (o el campo queda vacío temporalmente), el sistema calcula valores de `Infinity` o `NaN`, lo cual es inaceptable para una herramienta de ingeniería.

Evidencia en [App.tsx](file:///c:/Users/sebas/Downloads/01%20Revisar/07%20Now/personal-os-main/personal-os-main/Side%20Project/Oil/drilling-calculator/src/App.tsx#L75):
`max={results.pressures.fracturePressure / (0.052 * wellData.tvd || 1)}`

# Proposed Solutions

## Option 1: Guards en el Orquestador (Recomendado)

Implementar una validación en `runDrillingCalculations` que asegure que `tvd` sea al menos 1 ft o devuelva un resultado de error controlado.

- **Pros**: Protege todos los componentes visuales de una sola vez.
- **Cons**: Requiere actualizar el motor de cálculo.
- **Effort**: Small
- **Risk**: Low

## Option 2: Fallbacks en Componentes Visuales

Asegurar que cada visualizador (`GaugeChart`, `PressureWindow`) maneje valores `Infinity` mostrando un estado de "Waiting for Input".

- **Pros**: UI más resiliente.
- **Cons**: Duplicación de lógica.
- **Effort**: Small
- **Risk**: Low

# Recommended Action

Implementar la Opción 1 + Opción 2 para máxima seguridad.

# Technical Details

- Archivos afectados: `src/App.tsx`, `src/engine/orchestrator.ts`, `src/components/visuals/GaugeChart.tsx`.
- Lógica: `const safeTVD = wellData.tvd > 0 ? wellData.tvd : 1;`

# Acceptance Criteria

- [ ] Ingresar TVD = 0 no causa que el "Safety Margin" muestre Infinity.
- [ ] El GaugeChart muestra 0 o "N/A" en lugar de fallar visualmente.

# Work Log

- 2026-02-11: Detectado durante revisión técnica exhaustiva.
