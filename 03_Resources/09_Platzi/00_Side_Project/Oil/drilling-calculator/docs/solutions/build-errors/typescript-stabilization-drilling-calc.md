---
title: Estabilización de Build TypeScript y Refinamiento de Contraste UI
category: build-errors
tags: [typescript, tsc, ui-contrast, optimization]
date: 2026-02-20
slug: typescript-stabilization-ui-refinement
---

# Estabilización de Build TypeScript y Refinamiento de Contraste UI

## Síntomas del Problema

1. **Fallo Crítico en el Build**: El comando `npm run build` fallaba debido a múltiples errores de TypeScript (TSC):
    - Variables declaradas pero no utilizadas (`_bhp` en `pressures.ts`, `pumpData` en `App.tsx`, etc.).
    - Importaciones no consumidas (`useState`, `DynamicTwinWindow`).
    - Violación de `verbatimModuleSyntax` por falta de `import type`.
2. **Deficiencia de Accesibilidad**: Contraste insuficiente en los gráficos de hidráulica, donde el texto amarillo (`--sh-lima`) resultaba ilegible sobre fondos claros.
3. **Inconsistencias de Formato**: Valores como GPM mostraban excesivos decimales en banners de recomendación, degradando la experiencia premium.

## Investigación y Análisis

### Pasos Realizados
- **Auditoría de Tipos**: Se identificó que el motor de presiones `calculatePressures` recibía un objeto `hydraulics` que no se utilizaba, generando un error en cascada en el `orchestrator.ts`.
- **Análisis de Dependencias**: Se detectó que `App.tsx` mantenía importaciones pesadas como `DynamicTwinWindow` que ya no formaban parte del flujo activo.
- **Auditoría UI/UX**: Se validó con el usuario que los colores brillantes (`lima`, `cyan`) funcionaban bien como acentos pero fallaban como contenedores de información textual.

### Causa Raíz
- **Acumulación de Deuda Técnica**: Refactorizaciones anteriores dejaron atrás variables y parámetros "zombie".
- **Configuración TSC Estricta**: El proyecto utiliza reglas estrictas de `noUnusedLocals` y `verbatimModuleSyntax` que requieren una limpieza constante de imports y el uso explícito de `import type`.

## Solución Aplicada

### 1. Limpieza de Motores (Green Build)
Se actualizaron las firmas de las funciones para eliminar parámetros no utilizados y se aplicó la regla de `import type`:

```typescript
// pressures.ts
export function calculatePressures(
  well: WellData,
  formation: FormationData,
  mud: MudData,
) {
  // Eliminado parámetro hydraulics: HydraulicsResult
}
```

### 2. Refinamiento de Accesibilidad (Premium UI)
Se introdujeron tokens de color de alto contraste en `tokens.css` y se aplicaron a los gráficos:

```css
/* tokens.css */
--sh-lima-dark: hsl(76, 100%, 35%); /* Antes 63% - Mayor legibilidad */
--sh-cyan-dark: hsl(190, 100%, 35%);
```

### 3. Formateo de Datos
Se aplicó `Math.round()` a los valores de flujo (GPM) en el banner de `BitConfig.tsx` para una visualización más limpia.

## Estrategias de Prevención

- **Verificación Continua**: Ejecutar `tsc --noEmit` frecuentemente durante el desarrollo, no solo al final.
- **Uso Obligatorio de `import type`**: Seguir la pauta de TypeScript 5.x para evitar la elisión de módulos incorrecta.
- **Pilar de Contraste**: Validar cada nuevo color de la paleta contra los estándares WCAG utilizando las nuevas variantes `-dark`.

## Referencias y Enlaces

- [task.md](file:///c:/Users/sebas/.gemini/antigravity/brain/cbcdfdfe-4e68-4631-9138-842213f36f4e/task.md)
- [implementation_plan.md](file:///c:/Users/sebas/.gemini/antigravity/brain/cbcdfdfe-4e68-4631-9138-842213f36f4e/implementation_plan.md)
