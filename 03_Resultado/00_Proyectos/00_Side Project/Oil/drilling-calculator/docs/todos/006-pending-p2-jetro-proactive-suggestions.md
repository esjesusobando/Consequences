---
status: pending
priority: p2
issue_id: 006
tags: [ai, ux, interactivity]
dependencies: []
---

# Problem Statement

Las sugerencias de Jetro AI son mayormente estáticas o están definidas solo al inicio del ciclo de vida del componente, limitando su "consciencia de contexto".

# Findings

En `src/components/sections/JetroChat.tsx`, el array `suggestions` se define de forma inicial. Aunque Jetro conoce el store, las sugerencias clicables no cambian dinámicamente según el estado crítico del pozo (ej. si hay un riesgo de Kick detectado).

# Proposed Solutions

## Option 1: Dynamic Suggestion Hook

Implementar un `useEffect` que genere sugerencias basadas en el estado actual de `wellData` y `results`.

- **Pros**: Sensación de IA "viva" y proactiva.
- **Cons**: Mayor carga cognitiva en el re-render.
- **Effort**: Medium
- **Risk**: Low

# Technical Details

- Archivos afectados: `src/components/sections/JetroChat.tsx`

# Acceptance Criteria

- [ ] El chat ofrece sugerencias relacionadas con alertas activas (ej. "Cómo mejorar el TFA?" si el TFA es bajo).
