---
title: "Fallo de Carga: Error de Exportación DrillingResults"
date: 2026-02-20
category: build-errors
severity: critical
status: resolved
components:
  - drilling-store.ts
  - App.tsx
tags:
  - typescript
  - exports
  - runtime-error
  - debugging
---

# Fallo de Carga: Error de Exportación DrillingResults

## Síntoma

La aplicación fallaba al cargar, mostrando una pantalla blanca y un error en la consola:
`Uncaught SyntaxError: The requested module does not provide an export named 'DrillingResults'`

## Contexto

Ocurrió tras una refactorización de gran escala en el `drilling-store.ts` donde se intentaron unificar los tipos de resultados con el estado global del calculador.

## Investigación

1. **Verificación de Tipos**: Se comprobó que `DrillingResults` estaba definido como interfaz en `drilling-types.ts`.
2. **Inspección de Store**: En `drilling-store.ts`, se encontró que se estaba intentando importar `DrillingResults` como un valor (para inicializar el estado) cuando era solo un tipo, y no se estaba exportando correctamente desde el archivo de orquestación.
3. **Colisión de Nombres**: Había una variable interna llamada igual que el tipo, causando que TypeScript/Vite se confundiera sobre qué exportar.

## Causa Raíz

Falta de uso de `export type` para interfaces y una colisión de nombres entre la interfaz `DrillingResults` y una constante de inicialización en el mismo scope.

## Solución

1. **Diferenciación de Nombres**: Se renombró la constante de inicialización a `INITIAL_RESULTS` para evitar colisiones.
2. **Exportación Explícita**: Se aseguró el uso de `export type` en el orquestador de tipos.

```typescript
// drilling-store.ts
import type { DrillingResults } from "./drilling-types";

const INITIAL_RESULTS: DrillingResults = {
  // ... default values
};

export const useDrillingStore = create<DrillingState>((set) => ({
  results: INITIAL_RESULTS,
  // ...
}));
```

## Prevención

1. **Usar `import type`**: Siempre usar la sintaxis de tipos de TS 4.5+ para evitar que Vite intente importar tipos como valores en tiempo de ejecución.
2. **Naming Conventions**: Usar prefijos como `DEFAULT_` o `INITIAL_` para constantes de estado inicial.
3. **Check de Build**: Correr el build localmente antes de commits de refactorización pesada.

## Referencias

- [Pilar 1: El Motor](file:///c:/Users/sebas/Downloads/01%20Revisar/07%20Now/personal-os-main/personal-os-main/01_BRAIN/rules/Pilar_1.md)
