---
title: Blindaje del Motor de Cálculo (Armor Layer) - Prevención de NaN y Divisiones por Cero
category: logic-errors
component: drilling-engine
symptoms: Los gráficos mostraban NaN, Infinity o desaparecían cuando se ingresaban valores de 0 en diámetros o profundidades.
tags: [validation, engineering, robustness, typescript]
---

# Solución: Capa de Blindaje (Armor Layer) para Motores de Ingeniería

## Síntomas y Problema

En aplicaciones de ingeniería con cálculos en tiempo real, los inputs del usuario (como diámetros de hoyo o tubería) suelen usarse como denominadores en fórmulas hidráulicas y volumétricas.

- **Error**: Divisiones por cero al ingresar `0` en campos de texto.
- **Resultado**: Propagación de `NaN` en el estado global (Zustand) y crasheo silencioso de componentes visuales (SVG/Charts).

## Investigación y Causa Raíz

Los cálculos en `volumetrics.ts`, `pressures.ts` e `hydraulics.ts` carecían de una etapa de sanitización previa. Al depender de un orquestador reactivo, cualquier cambio parcial en un input gatillaba un recálculo con datos incompletos.

## Solución Implementada: Armor Layer

### 1. Utilidad de Validación Centralizada

Se creó `src/engine/utils/validation.ts` para encapsular la lógica de seguridad:

```typescript
export const safeDivide = (
  numerator: number,
  denominator: number,
  fallback: number = 0,
): number => {
  if (denominator === 0 || isNaN(denominator)) return fallback;
  return numerator / denominator;
};

export const sanitizeEngineInput = {
  diameter: (val: number) => Math.max(0.0001, val), // Evita 0 absoluto
  fluidDensity: (val: number) => Math.max(0.1, val),
  depth: (val: number) => Math.max(0, val),
};
```

### 2. Blindaje de Funciones de Cálculo

Se refactorizaron los motores para usar estas utilidades:

```typescript
// Antes
const capacity = (id * id) / 1029.4;

// Después (Blindado)
const idSafe = sanitizeEngineInput.diameter(id);
const capacity = safeDivide(Math.pow(idSafe, 2), 1029.4);
```

### 3. Estados de Error Visuales (Glassmorphism)

Se integró un overlay estético en los componentes visuales para manejar valores inválidos sin romper el layout:

```tsx
const isInvalid = isNaN(value) || !isFinite(value);
return (
  <div className="gauge-container">
    {isInvalid && (
      <div className="visual-error-overlay">
        <AlertCircle />
        <p>Esperando datos válidos...</p>
      </div>
    )}
    {/* Gráfico con opacidad reducida si es inválido */}
  </div>
);
```

## Prevención Futura

- **Principio Pure Green**: Nunca realizar un cálculo de ingeniería sin antes pasar los inputs por una función de sanitización.
- **Validación en el Store**: Implementar validadores en los setters de Zustand para rechazar valores físicamente imposibles.
- **Placeholder UI**: Siempre prever un estado "Pending/Invalid" para componentes que dependen de cálculos complejos.

---

_Documentado con /workflows:compound - Conocimiento capitalizado._
