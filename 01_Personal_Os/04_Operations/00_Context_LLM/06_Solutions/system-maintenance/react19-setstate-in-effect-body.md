---
title: "React 19 — setState en useEffect body causa re-render infinito o warning"
date: 2026-04-18
category: runtime-errors
tags: [react19, useEffect, useState, lazy-initializer, hydration]
severity: warning
project: oim-website
status: resolved
---

# React 19 — setState en useEffect body causa re-render / warning

## Síntoma

Warning en consola:
```
Warning: Cannot update a component (`X`) while rendering a different component
```
O re-renders innecesarios en el mount del componente.

## Causa Raíz

En React 19 (strict mode), llamar `setState` dentro del body de `useEffect` para inicializar state desde `sessionStorage`/`localStorage` genera un render extra y puede causar hydration mismatch en SSR.

```typescript
// ❌ PROBLEMÁTICO
const [lang, setLang] = useState<'en' | 'es'>('en');

useEffect(() => {
  const stored = sessionStorage.getItem('oim-lang');
  if (stored === 'en' || stored === 'es') setLang(stored); // ← render extra
}, []);
```

## Solución

Usar el **lazy initializer** de `useState` — la función se ejecuta solo en el cliente, una sola vez:

```typescript
// ✅ CORRECTO — lazy initializer
const [lang, setLang] = useState<'en' | 'es'>(() => {
  if (typeof window === 'undefined') return 'en'; // SSR guard
  const stored = sessionStorage.getItem('oim-lang');
  return stored === 'en' || stored === 'es' ? stored : 'en';
});

// useEffect solo para el event listener, SIN setLang en el body
useEffect(() => {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'oim-lang' && (e.newValue === 'en' || e.newValue === 'es')) {
      setLang(e.newValue);
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}, []);
```

## Patrón General

Siempre que necesités leer `localStorage`/`sessionStorage` para inicializar state:
1. Usá lazy initializer con guard `typeof window === 'undefined'`
2. El `useEffect` solo maneja side effects reales (listeners, subscriptions)
3. NUNCA llamar `setState` en el body directo del effect para inicialización

## Archivos Afectados

- `Now/oim-website/src/app/page.tsx`
