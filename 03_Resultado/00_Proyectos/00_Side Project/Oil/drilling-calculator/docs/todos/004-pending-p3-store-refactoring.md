---
status: pending
priority: p3
issue_id: 004
tags: [code-review, refactoring, store]
dependencies: []
---

# Problem Statement

Fragmentación de setters en el store de Zustand.

# Findings

El `drilling-store.ts` define múltiples funciones individuales (`setWellData`, `setMudData`, `setPumpData`, etc.) que repiten el patrón de spread operator. Esto se vuelve verboso a medida que el sistema escala.

# Proposed Solutions

## Option 1: Generic Update Action

Implementar una sola acción `updateSection` que acepte el nombre de la sección y el objeto parcial de datos.

- **Pros**: Código más limpio y modular.
- **Cons**: Requiere refactorizar todos los componentes de entrada.
- **Effort**: Medium
- **Risk**: Low

# Recommended Action

Mantener como está por ahora (estabilidad) pero planificar la refactorización para la Fase 4.

# Technical Details

- Archivos afectados: `src/store/drilling-store.ts`.

# Acceptance Criteria

- [ ] Una sola función maneja actualizaciones de múltiples interfaces de datos.

# Work Log

- 2026-02-11: Identificado durante la revisión de simplicidad.
