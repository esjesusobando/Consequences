---
title: "Optimización de Densidad UI en Dashboards React + CSS"
slug: ui-density-optimization-react-css
date: 2026-02-18
category: ui-bugs
tags: [css, react, ui-density, glassmorphism, iconography, rheology]
severity: low
status: solved
project: drilling-calculator
components: [App.css, SidebarNav.tsx, MudProperties.tsx, QuickNotes.css]
---

# Optimización de Densidad UI en Dashboards React + CSS

## Problema

El dashboard de la calculadora de perforación mostraba demasiado espacio en blanco, requiriendo scroll excesivo para ver toda la información. Los iconos del sidebar eran demasiado grandes comparados con los del dashboard, y la sección de Reología no diferenciaba visualmente entre los distintos métodos de medición.

## Solución: Sistema de Densidad Extrema

### 1. Reducción Global de Espaciado (App.css)

```css
/* ❌ ANTES */
.app-container {
  padding: 20px;
  font-size: 0.9em;
}
.work-flow {
  gap: 24px;
}
.work-block {
  gap: 32px;
}

/* ✅ DESPUÉS */
.app-container {
  padding: 15px;
  font-size: 0.8em;
}
.work-flow {
  gap: 16px;
}
.work-block {
  gap: 20px;
}
```

**Regla**: Reducir padding/gap en ~33% para pasar de "cómodo" a "denso profesional".

### 2. Iconografía Delicada (SidebarNav.tsx)

```tsx
// ❌ ANTES: Iconos pesados
<item.icon size={20} strokeWidth={2} />

// ✅ DESPUÉS: Iconos finos, Silicon Valley style
<item.icon
  size={15.5}
  strokeWidth={isActive ? 1.6 : 1.4}
/>
```

**Regla**: `size ≤ 16px` + `strokeWidth ≤ 1.6` para iconos de navegación secundaria.

### 3. Botones Icon-Only con Tema Cyber-Lime (QuickNotes.css)

```css
/* Botón icon-only con tema Pure Green */
.save-params-btn.icon-only {
  background: #cbff6a;
  border: 1px solid rgba(203, 255, 106, 0.5);
  border-radius: 10px;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(203, 255, 106, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
}
```

### 4. Grupos de Reología con Headers Visuales (MudProperties)

Cuando hay múltiples métodos de medición en un mismo formulario, agruparlos con headers:

```tsx
{/* Patrón: rheology-method-group */}
<div className="rheology-method-group">
  <div className="method-header">FANN 35</div>
  <div className="rheology-inputs-compact">
    <InputField label="L600" ... />
    <InputField label="L300" ... />
  </div>
</div>
```

```css
.rheology-method-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.method-header {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rheology-inputs-compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
```

## Métricas de Mejora

| Métrica             | Antes| Después       |
|--------------------|-----|--------------|
| Padding contenedor  | 20px | 15px (-25%)   |
| Font-size base      | 0.9em| 0.80em (-11%) |
| Gap work-flow       | 24px | 16px (-33%)   |
| Gap work-block      | 32px | 20px (-37%)   |
| Tamaño icono sidebar| 20px | 15.5px (-22%) |
| Stroke icono sidebar| 2.0  | 1.4-1.6 (-25%)|

## Prevención / Guía de Diseño

- **Densidad normal**: padding 20px, gap 24px, font 0.9em
- **Densidad alta**: padding 15px, gap 16px, font 0.80em ← **Este proyecto**
- **Densidad extrema**: padding 10px, gap 8px, font 0.75em (solo para tablas de datos)
- **Iconos navegación primaria**: 20-24px, stroke 1.5-2.0
- **Iconos navegación secundaria**: 14-16px, stroke 1.2-1.6
- **Iconos de acción inline**: 12-14px, stroke 1.0-1.5

## Referencias

- Commit: `9822287` — `feat(drilling-calc): UI density optimization + PURE GREEN validation`
- Design tokens: `src/index.css` (variables CSS del sistema)
- Glassmorphism: `rgba(255,255,255,0.03)` + `backdrop-filter: blur(12px)`
