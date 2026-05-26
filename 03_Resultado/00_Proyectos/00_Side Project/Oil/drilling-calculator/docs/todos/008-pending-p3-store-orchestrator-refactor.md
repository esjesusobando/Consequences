---
status: pending
priority: p3
issue_id: 008
tags: [refactor, store, architecture]
dependencies: []
---

# Problem Statement

El `drilling-store.ts` está acumulando demasiada lógica de orquestación de cálculos, lo que dificulta el mantenimiento a medida que añadimos modelos como Herschel-Bulkley.

# Findings

La acción `calculateResults` dentro del store maneja múltiples dominios (hidráulica, reología, ventanas de presión).

# Proposed Solutions

## Option 1: Orchestrator Pattern

Extraer la lógica de cálculo a un archivo `src/engine/orchestrator.ts` que reciba el estado y devuelva los resultados.

- **Pros**: Store más limpio, lógica pura fácil de testear.
- **Effort**: Medium

# Acceptance Criteria

- [ ] `calculateResults` no vive directamente en la definición del store.
