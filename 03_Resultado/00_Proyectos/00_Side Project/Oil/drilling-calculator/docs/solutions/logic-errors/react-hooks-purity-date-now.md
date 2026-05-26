---
title: "react-hooks/purity: Date.now() en Handlers de React"
slug: react-hooks-purity-date-now
date: 2026-02-18
category: logic-errors
tags: [react, linting, hooks, purity, uuid, Date.now]
severity: low
status: solved
project: drilling-calculator
component: JetroChat.tsx
---

# react-hooks/purity: Date.now() en Handlers de React

## Síntoma

El linter reportaba el siguiente error en `JetroChat.tsx`:

```
react-hooks/purity: Cannot call impure function
```

En la línea:

```tsx
const userMsg: Message = {
  id: Date.now().toString(), // ❌ Impure function
  ...
};
```

## Causa Raíz

`Date.now()` es considerada una función **impura** por el linter `react-hooks/purity` porque:

1. Retorna un valor diferente en cada llamada (no determinista).
2. Depende de estado externo (el reloj del sistema).
3. Dentro de handlers de React, el linter espera funciones puras o efectos explícitos.

## Solución

Reemplazar `Date.now().toString()` con `crypto.randomUUID()`:

```tsx
// ❌ ANTES
const userMsg: Message = {
  id: Date.now().toString(),
  ...
};

// ✅ DESPUÉS
const userMsg: Message = {
  id: crypto.randomUUID(),
  ...
};
```

### ¿Por qué `crypto.randomUUID()` es aceptable?

- Está disponible en todos los navegadores modernos y Node.js 14.17+.
- Genera IDs únicos garantizados (UUID v4).
- El linter lo acepta porque es una API de plataforma estándar, no una función de tiempo.
- **Bonus**: Los UUIDs son más únicos que timestamps (evita colisiones en operaciones rápidas).

## Alternativas

Si `crypto.randomUUID()` no está disponible (entornos muy antiguos):

```tsx
// Alternativa con nanoid (si está instalado)
import { nanoid } from "nanoid";
id: nanoid();

// Alternativa manual (no recomendada para producción)
id: Math.random().toString(36).slice(2);
```

## Prevención

- **Regla**: Nunca usar `Date.now()`, `Math.random()`, o `new Date()` directamente dentro de handlers de React para generar IDs.
- **Patrón**: Usar `crypto.randomUUID()` para IDs únicos en el cliente.
- **Para timestamps**: Si necesitas el timestamp, guárdalo en una variable fuera del objeto o usa `useRef`.

## Referencias

- [MDN: crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- Commit: `9822287` — `feat(drilling-calc): UI density optimization + PURE GREEN validation`
