---
title: Resolución de Errores NaN en Motor de Hidráulica y Sincronización de Reología
status: complete
category: logic-errors
problem_type: calculation_error
component: engine/orchestrator
severity: critical
tags: [drilling, hydraulics, rheology, typescript, nan]
---

# Resolución de Errores NaN en Motor de Hidráulica

## Problema
Se detectaron valores `NaN` (Not a Number) en los paneles de resultados de Hidráulica y Limpieza de Hoyo. Esto bloqueaba la visualización de métricas críticas como el ECD (Equivalent Circulating Density) y las alertas operativas.

### Síntomas
- Resultados de Hidráulica mostrando `0.00` o `NaN`.
- Alertas de limpieza de hoyo no generadas a pesar de valores fuera de rango.
- Errores de TypeScript al intentar acceder a propiedades de reología extendidas.

## Análisis de Causa Raíz
1. **Error de Firma**: En `orchestrator.ts`, la función `calculateHydraulics` se llamaba con un objeto `pumpData` incorrecto (no era el esperado por la función) y con argumentos en orden erróneo.
2. **Propiedades Faltantes**: La interfaz `RheologyResult` no incluía métricas modernas como `av` (Apparent Viscosity), `pvYpRatio` y `gelProgression`, las cuales eran requeridas por el motor de alertas (`alert-engine.ts`).
3. **Tipado de Reología**: Existía una discrepancia entre los nombres usados en los `guards` (`plasticViscosity`) y los usados en el objeto de resultados (`pv`).

## Solución Aplicada

### 1. Corrección del Orquestador
Se ajustó la llamada a los motores de cálculo asegurando que los objetos pasados coincidan exactamente con las interfaces definidas.

```typescript
// Antes
const hydraulics = calculateHydraulics(pumpData, mudData, wellData, formationData);

// Después
const hydraulics = calculateHydraulics(pump, mud, well);
```

### 2. Extensión del Modelo de Datos
Se actualizaron las interfaces en `drilling-types.ts` y se implementaron los cálculos faltantes en `rheology.ts`.

### 3. Blindaje (Armor Layer)
Se actualizaron los `output-guards.ts` para validar las nuevas métricas y asegurar rangos operativos realistas.

## Prevención
- **Pure Green**: Mantener el build de TypeScript libre de errores (`npm run build`).
- **Unit Testing**: Se recomienda implementar tests unitarios para `orchestrator.ts` que validen la cadena de cálculos ante cambios en los tipos.
- **Protocolo Sub-agente 8**: Realizar revisiones cruzadas de tipos antes de modificar motores de cálculo.

---
*Documentado en cumplimiento del flujo /workflows:compound.*
