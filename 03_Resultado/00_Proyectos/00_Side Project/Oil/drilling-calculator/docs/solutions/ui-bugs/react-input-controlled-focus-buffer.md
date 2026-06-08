---
title: "React Controlled Input con Buffer Local sin useEffect"
slug: react-input-controlled-focus-buffer
date: 2026-02-18
category: ui-bugs
tags: [react, hooks, controlled-input, linting, useEffect]
severity: medium
status: solved
project: drilling-calculator
component: InputField.tsx
---

# React Controlled Input con Buffer Local sin useEffect

## Síntoma

El componente `InputField` necesitaba permitir edición libre (incluyendo strings vacíos y negativos intermedios como `"-"`) mientras el usuario escribe, pero también reflejar cambios del estado global cuando el campo no está enfocado.

La implementación original usaba `useEffect` para sincronizar el prop `value` con el estado local `localValue`:

```tsx
// ❌ PROBLEMA: Dispara el lint error react-hooks/set-state-in-effect
useEffect(() => {
  if (!focused) {
    setLocalValue(value.toString());
  }
}, [value, focused]);
```

**Error de ESLint:**

```
react-hooks/set-state-in-effect: Avoid calling setState() directly within an effect.
Calling setState synchronously within an effect body causes cascading renders.
```

## Causa Raíz

El linter `react-hooks/set-state-in-effect` prohíbe llamar `setState` directamente dentro de un `useEffect` porque puede causar renders en cascada. Aunque en este caso específico era seguro (la condición `!focused` lo protegía), el linter no puede inferir esa seguridad.

## Solución

Eliminar el `useEffect` completamente usando un **patrón de buffer de foco**:

- El buffer local (`localValue`) **solo existe mientras el campo está enfocado**.
- Al hacer `onFocus`, se inicializa el buffer con el valor actual del prop.
- Al hacer `onBlur`, se limpia el buffer.
- El valor mostrado (`displayValue`) se deriva: prop cuando no enfocado, buffer cuando enfocado.

```tsx
// ✅ SOLUCIÓN: Sin useEffect, sin renders en cascada
export function InputField({ value, onChange, ... }) {
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState<string>("");

  // Derivado: no hay sincronización, no hay useEffect
  const displayValue = focused ? localValue : value.toString();

  const handleFocus = useCallback(() => {
    setLocalValue(value.toString()); // Inicializar buffer al enfocar
    setFocused(true);
  }, [value]);

  const handleChange = useCallback((e) => {
    const raw = e.target.value;
    setLocalValue(raw); // Solo actualiza el buffer local
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange(num); // Propaga al store si es válido
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (localValue === "" || isNaN(parseFloat(localValue))) {
      onChange(value); // Revertir si inválido
    }
    setLocalValue(""); // Limpiar buffer
  }, [localValue, value, onChange]);

  return <input value={displayValue} onFocus={handleFocus} onChange={handleChange} onBlur={handleBlur} />;
}
```

## Por Qué Funciona

| Situación     | `displayValue`    | Fuente                              |
|--------------|------------------|------------------------------------|
| Campo sin foco| `value.toString()`| Prop del store (siempre actualizado)|
| Campo con foco| `localValue`      | Buffer local (permite edición libre)|
| Al perder foco| Se limpia buffer  | Vuelve a mostrar prop               |

No hay sincronización bidireccional → no hay renders en cascada → no hay lint error.

## Prevención

- **Regla**: Nunca usar `useEffect` para sincronizar estado local con props en inputs controlados.
- **Patrón**: Usar `onFocus` para inicializar buffers locales, `onBlur` para limpiarlos.
- **Derivar**: Preferir valores derivados (`const x = condition ? a : b`) sobre sincronización con efectos.

## Referencias

- [You Might Not Need an Effect — React Docs](https://react.dev/learn/you-might-not-need-an-effect)
- Commit: `9822287` — `feat(drilling-calc): UI density optimization + PURE GREEN validation`
