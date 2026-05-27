---
name: remotion-browser-search
description: Build a BrowserSearch Remotion sequence (90 frames) that simulates a browser typing a URL with camera zoom, typing animation, cursor tracking and fade-to-white transition. Triggers on: browser search animation, remotion browser sequence, URL typing animation, browser chrome animation, BrowserSearch component, remotion sequence step 1.
---

# Remotion — BrowserSearch Sequence

> **Level**: Elite — Remotion Video Production
> **Frames**: 90 | **FPS**: 30

## Esencia Original

> **Propósito:** Animar un browser escribiendo una URL con zoom de cámara, tracking del cursor y fade-to-white
> **Flujo:** Setup timing constants → Layout → Camera zoom → Typing animation → Hand pointer → Fade out

---

## Timing Constants

```tsx
const URL_TEXT     = "yourdomain.com";
const CHARS        = URL_TEXT.length;
const FPC          = 3;                          // frames per character
const T_FOCUS      = 18;
const T_TYPE_START = 26;
const T_TYPE_END   = T_TYPE_START + CHARS * FPC;
const T_MOVE_END   = T_TYPE_END + 14;
const T_FADE_START = T_MOVE_END;
const T_FADE_END   = T_FADE_START + 10;
```

---

## Layout

- Background: `#f5f5f7`
- Browser window centrado con chrome realista
- Address bar con **lock icon (🔒)** a la izquierda (NO lupa)
- Search/go button a la derecha

---

## Animaciones

### Camera zoom + pan mientras se tipea
```tsx
// Zoom to 2.2x siguiendo la posición del cursor
// transformOrigin dinámico al X del cursor
<div style={{ transform: `scale(${finalZoom})`, transformOrigin: `${cursorX}px center` }}>
```

### Hand pointer click
- Aparece cerca del search button en `T_MOVE_END`
- Scale: `interpolate(frame, [T_MOVE_END, T_MOVE_END+5, T_MOVE_END+10], [1, 1.35, 1.2])`

### Fade-to-white (fin de secuencia)
```tsx
const pushZoom     = interpolate(frame, [T_FADE_START, T_FADE_END], [1, 1.18], { clamp, easing: Easing.in(Easing.cubic) });
const whiteOverlay = interpolate(frame, [T_FADE_START, T_FADE_END], [0, 1],   { clamp, easing: Easing.in(Easing.cubic) });
```

---

## Visual Polish

- Vignette overlay: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)`
- Subtle radial gradient detrás del browser para enfocar la atención

---

## ⚠️ Gotchas

### GOTCHA 1: transformOrigin estático rompe el tracking
**Por qué:** El zoom se ve abrupto si el origen es fijo mientras el cursor se mueve.
**Solución:** Recalcular `transformOrigin` cada frame basado en la posición X del cursor.

### GOTCHA 2: Usar lupa en lugar de lock icon
**Por qué:** El brief especifica que la address bar usa 🔒, no una lupa — cambia la autenticidad visual.
**Solución:** Siempre usar lock icon a la izquierda del URL text.

### GOTCHA 3: whiteOverlay sin clamp causa flash
**Por qué:** Sin `clamp: true`, interpolate puede extender el rango y el overlay parpadea.
**Solución:** Agregar `{ clamp: true }` a todos los interpolates de fade.

### GOTCHA 4: FPC incorrecto desincroniza el audio
**Por qué:** Si `FPC` no coincide con el timing del sonido de teclado, el audio y el video quedan desfasados.
**Solución:** Calcular `T_TYPE_END - T_TYPE_START` para cortar el audio exactamente.
