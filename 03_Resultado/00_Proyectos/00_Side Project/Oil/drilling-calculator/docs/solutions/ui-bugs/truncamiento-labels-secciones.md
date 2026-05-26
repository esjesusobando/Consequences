---
id: ui-truncamiento-labels
category: ui-bugs
title: Solución a Truncamiento de Labels y Títulos en Secciones
author: Antigravity
date: 2026-02-11
tags: [css, overflow, visibility, silicon-valley-premium]
---

# Problema: Truncamiento de Contenido en Secciones Flexibles

## Síntoma
Los títulos de las secciones, labels de inputs y bordes de tarjetas se veían cortados o incompletos al aplicar radios de curvatura grandes o efectos de escala.

## Causa Raíz
El uso de `overflow: hidden` en componentes base como `.section` y `.data-card`, junto con el uso de `max-height` restrictivos en columnas de layout lateral. Esto impedía que los elementos "respiraran", especialmente bajo efectos de `hover` o sombras complejas.

## Solución Aplicada
1. **Relajación de Bordes**: Se cambió `overflow: hidden` por `overflow: visible` en `Section.css` y `DataCard.css`.
2. **Layout Adaptativo**: En `App.css`, se eliminó el `max-height` de `.column--inputs` para permitir un scroll natural de página en lugar de un scroll interno frágil.
3. **Paddings de Seguridad**: Se aumentaron los paddings en `.results-panel` (de 24px a 32px) para dar espacio a los nuevos estilos tipográficos de alto contraste.

## Prevención
- **Pure Visibility Rule**: Nunca usar `overflow: hidden` en contenedores que utilicen efectos `hover: scale`, `box-shadow` dinámicos o que contengan títulos de tamaño variable.
- **Flex First**: Priorizar `height: auto` en columnas laterales sobre `max-height` con scroll interno para evitar desbordamientos inesperados.
