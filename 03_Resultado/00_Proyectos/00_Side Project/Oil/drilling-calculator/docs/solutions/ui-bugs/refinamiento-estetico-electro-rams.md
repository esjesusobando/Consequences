---
title: "Refinamiento Estético: Vibrant Electro & Dieter Rams Hybrid"
timestamp: 2026-02-11T02:00:00
category: ui-bugs
tags: [css, react, dieter-rams, electro-aesthetic, precision-ui]
---

# Refinamiento Estético: Vibrant Electro & Dieter Rams

## Síntomas y Problema

La interfaz del **Drilling Calculator** presentaba inconsistencias visuales tras la transición al modo "Vibrant Light":

1. **Inconsistencia Cromática**: El gráfico de volúmenes tenía los colores invertidos (Sarta en Azul, Anular en Lima), lo que resultaba contraintuitivo para operadores acostumbrados a que la sarta sea el elemento de máximo resalte.
2. **Ruido Visual**: La ventana de presión utilizaba líneas de 5px con resplandor (`glow`), dificultando la lectura precisa de valores hidrostáticos en contextos técnicos.
3. **Truncamiento de Contenido**: Elementos críticos de la UI se cortaban debido a restricciones de `overflow: hidden` en componentes `Section`.

## Investigación y Análisis

- **Análisis de Colores**: El color Lima (#BFF333) tiene un peso visual superior al Azul (#2563EB) sobre fondo blanco. Al asignar el Azul a la sarta (el componente central), este se perdía frente al gran volumen del anular en Lima.
- **Análisis de Estilo**: Se detectó que el estilo "Neon/Vibrant" puro sacrificaba la legibilidad técnica ("instrumental") en favor de la estética. Se requería la aplicación de principios de **Dieter Rams** (Diseño Inobstrusivo).

## Solución Aplicada

### 1. Inversión de Jerarquía Cromática

Se modificó `VolumeChart.tsx` para asignar el **Lima** a la sarta y el **Azul** al anular, equilibrando el peso visual.

```tsx
// VolumeChart.tsx
<circle stroke="var(--sh-lima)" /> // Sarta
<circle stroke="var(--sh-azul)" /> // Anular
```

### 2. Capa "Dieter Rams" de Precisión

Se redujo el grosor de la línea de Hidrostática en `PressureWindow.tsx` a **1.2px** y se añadió un punto de enfoque central, eliminando decoraciones innecesarias.

```tsx
// PressureWindow.tsx
<line strokeWidth="1.2" stroke="var(--sh-azul)" />
<circle r="1.5" fill="var(--sh-azul)" />
```

### 3. Saneamiento de Layout

Se eliminó el `overflow: hidden` de `.section` en `Section.css` para permitir que las sombras y expansiones naturales de los componentes no se truncaran.

## Estrategias de Prevención

- **Referencia ADN**: Todas las modificaciones visuales futuras DEBEN consultarse con el documento `TRIVI_STYLE_DNA.md`.
- **Pure Green Aesthetics**: Prohibido el uso de bordes sólidos > 1px en elementos que no sean interactivos; priorizar sombras multicapa sutiles.
- **Validación de Contraste**: Testear siempre la legibilidad de etiquetas Lima sobre fondo blanco (priorizar pesos de fuente > 600).

---

_Compounded Knowledge by PersonalOS. Knowledge is power, but documented knowledge is evolution._
