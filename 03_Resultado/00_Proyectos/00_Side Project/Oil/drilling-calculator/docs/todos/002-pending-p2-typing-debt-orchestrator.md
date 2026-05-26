---
status: pending
priority: p2
issue_id: 002
tags: [code-review, technical-debt, typescript]
dependencies: []
---

# Problem Statement

Uso excesivo de tipos `any` en las interfaces de resultados del orquestador.

# Findings

En `src/engine/orchestrator.ts`, las interfaces `DrillingResults` y `ValidationResults` se han declarado localmente con propiedades de tipo `any`. Aunque esto resolvió el bloqueo inmediato del build, degrada la seguridad de tipos del proyecto y dificulta el mantenimiento a largo plazo.

# Proposed Solutions

## Option 1: Refactorización de Tipos Centrales

Mapear correctamente las interfaces de `types.ts` hacia el orquestador y eliminar las definiciones locales de `any`.

- **Pros**: Recupera la integridad de TypeScript, autocompletado funcional.
- **Cons**: Puede requerir pequeñas correcciones en los guards de salida si los tipos no coinciden 100%.
- **Effort**: Medium
- **Risk**: Medium (puede revelar errores de tipado latentes)

# Recommended Action

Realizar la refactorización completa de los tipos en `orchestrator.ts`.

# Technical Details

- Archivos afectados: `src/engine/orchestrator.ts`, `src/store/types.ts`.

# Acceptance Criteria

- [ ] No existen declaraciones de tipo `any` en `orchestrator.ts`.
- [ ] `tsc` compila sin errores tras las correcciones.

# Work Log

- 2026-02-11: Identificado durante la reconstrucción de emergencia de la Fase 3.
