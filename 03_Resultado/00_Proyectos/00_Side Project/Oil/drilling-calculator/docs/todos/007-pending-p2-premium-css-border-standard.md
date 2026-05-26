---
status: pending
priority: p2
issue_id: 007
tags: [ui, css, premium, personal-os]
dependencies: []
---

# Problem Statement

El componente JetroChat utiliza un borde con opacidad 0.2, ignorando el estándar de "Armor Layer / Premium UI" de PersonalOS.

# Findings

En `src/components/sections/JetroChat.css`:

```css
border: 1px solid rgba(255, 255, 255, 0.2);
```

El Pilar 1 especifica: "bordes sutiles (0.1 alpha)" para el look Premium/Glassmorphism.

# Proposed Solutions

## Option 1: CSS Refinement

Actualizar todos los bordes de glassmorphism a `0.1 alpha`.

- **Pros**: Consistencia visual con el resto del ecosistema PersonalOS.
- **Effort**: Small
- **Risk**: None

# Acceptance Criteria

- [ ] `JetroChat` usa bordes de `0.1 alpha`.
- [ ] Verificado en modo oscuro.
