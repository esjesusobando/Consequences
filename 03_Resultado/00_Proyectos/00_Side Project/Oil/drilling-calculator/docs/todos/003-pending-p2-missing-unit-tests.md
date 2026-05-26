---
status: pending
priority: p2
issue_id: 003
tags: [code-review, testing, metrics]
dependencies: []
---

# Problem Statement

Ausencia de tests unitarios para la lógica de ingeniería y cálculos de perforación.

# Findings

El proyecto maneja fórmulas de ingeniería complejas (Volumétricos, Reología, Hidráulica) sin ninguna suite de pruebas automatizadas. Cualquier cambio en el motor podría introducir errores catastróficos difíciles de detectar visualmente.

# Proposed Solutions

## Option 1: Implementar Vitest

Configurar Vitest para ejecutar pruebas unitarias de las funciones en `src/engine/`.

- **Pros**: Validación rápida y segura de las fórmulas matemáticas.
- **Cons**: Requiere configurar el entorno de tests.
- **Effort**: Medium
- **Risk**: Low

# Recommended Action

Configurar Vitest y crear tests para `volumetrics.ts` y `rheology.ts` como punto de partida.

# Technical Details

- Archivos afectados: `package.json`, `src/engine/*.test.ts`.

# Acceptance Criteria

- [ ] `npm run test` disponible.
- [ ] Al menos el 80% de las fórmulas de volumetría están testeadas con valores de referencia reales.

# Work Log

- 2026-02-11: Propuesto tras la revisión de arquitectura Phase 3.
