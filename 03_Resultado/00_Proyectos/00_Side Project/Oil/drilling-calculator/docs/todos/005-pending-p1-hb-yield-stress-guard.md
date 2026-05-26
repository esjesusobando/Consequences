---
status: resolved
priority: p1
issue_id: 005
tags: [logic, engineering, rheology, safety]
dependencies: []
---

# Problem Statement

El cálculo actual del Yield Stress (τ₀) para el modelo Herschel-Bulkley no tiene una salvaguarda contra resultados negativos.

# Findings

En `src/engine/rheology.ts`:

```typescript
const tau0 = 2 * mudData.theta3 - mudData.theta6;
```

Si `2 * theta3 < theta6`, `tau0` será negativo, lo cual es físicamente imposible y corrompe los cálculos de caída de presión hidráulica.

# Proposed Solutions

## Option 1: Clamping (Recommended)

Aplicar `Math.max(0, ...)` al resultado.

- **Pros**: Rápido, seguro, evita errores de ejecución.
- **Cons**: Solo oculta datos de entrada potencialmente erróneos.
- **Effort**: Small
- **Risk**: Low

## Option 2: Component-Level Validation

Añadir validación en `MudConfig` para asegurar que `2 * theta3 >= theta6`.

- **Pros**: Feedback inmediato al usuario.
- **Cons**: Más complejo de implementar en la UI.
- **Effort**: Medium
- **Risk**: Low

# Technical Details

- Archivos afectados: `src/engine/rheology.ts`
- Impacto: Estabilidad del motor hidráulico.

# Acceptance Criteria

- [ ] `tau0` nunca es menor que 0.
- [ ] Pruebas unitarias verificando valores límite.
