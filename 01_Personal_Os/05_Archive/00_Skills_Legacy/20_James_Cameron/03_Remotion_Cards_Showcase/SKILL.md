---
name: remotion-cards-showcase
description: Build a CardsShowcase Remotion sequence (183 frames) with 3 phases: headline word-by-word reveal, platform cards with crop system, and LogoBurst finale. Triggers on: cards showcase animation, remotion cards sequence, platform cards animation, logo burst remotion, cards converge animation, remotion sequence step 2, step 3, step 4.
---

# Remotion — CardsShowcase Sequence

> **Level**: Elite — Remotion Video Production
> **Frames**: 58–183 | **FPS**: 30

## Esencia Original

> **Propósito:** Animar una showcase de plataformas con headline, cards convergentes y logo burst
> **Fases:** Headline (0–58) → Cards (58–136) → LogoBurst (130–183)

---

## Phase 1: Headline (frames 0–58)

### Timing
```tsx
const WORDS       = ["¿Dónde", "quieres", "extraer", "tus", "leads?"];
const WORD_DUR    = 4;   // frames entre palabras
const ZOOM_END    = 45;
const SLIDE_START = 50;
const CARD_DELAY  = 58;
```

### White fade-from (frames 0–18)
```tsx
<div style={{
  position: "absolute", inset: 0, background: "#fff",
  opacity: interpolate(frame, [0, 18], [1, 0], { clamp: true, easing: Easing.out(Easing.cubic) }),
}} />
```

### Container zoom
```tsx
const containerScale = interpolate(frame, [0, ZOOM_END], [1.5, 1.0],
  { clamp: true, easing: Easing.out(Easing.cubic) });
```

---

## Phase 2: Cards (frames 58–136)

### Layout
```tsx
const VW = 310;   // card width
const VH = 468;   // card height
const K  = 1.55;  // crop scale
const GAP      = 28;
const ROW_W    = 4 * VW + 3 * GAP;
const ROW_LEFT = (1920 - ROW_W) / 2;
const CARD_TOP = (1080 - VH) / 2;
```

### Timing
```tsx
const STAGGER    = 8;
const POP_DUR    = 12;
const HOLD_END   = CARD_DELAY + 3 * STAGGER + POP_DUR;  // 94
const GATHER_END = HOLD_END + 18;    // 112
const CONV_END   = GATHER_END + 24;  // 136
```

### Card Cropping System
Cada card usa valores `cl/cr/ct/cb` (píxeles a recortar de cada lado) para fine-tune del área visible independientemente.

---

## Phase 3: LogoBurst (frames 130–183)

### Timing
```tsx
const LOGO_START   = CONV_END - 6;       // 130
const LOGO_SETTLE  = LOGO_START + 18;    // 148
const DOMAIN_START = LOGO_START + 15;    // 145
```

### Background flash
```tsx
const bgFlash = interpolate(f, [0, 8], [0.18, 0], { clamp: true });
```

### 3 Glow rings expansivos (staggered)
```tsx
const glow1Scale = interpolate(f, [0, 18],  [0, 4.5], { clamp: true, easing: Easing.out(Easing.cubic) });
const glow2Scale = interpolate(f, [3, 24],  [0, 6.5], { clamp: true, easing: Easing.out(Easing.cubic) });
const glow3Scale = interpolate(f, [7, 32],  [0, 9],   { clamp: true, easing: Easing.out(Easing.cubic) });
```

---

## ⚠️ Gotchas

### GOTCHA 1: LOGO_START antes de CONV_END causa overlap visual
**Por qué:** El LogoBurst empieza en frame 130 pero CONV_END es 136 — hay 6 frames de overlap intencional.
**Solución:** Mantener `LOGO_START = CONV_END - 6` para que el burst tape la convergencia suavemente.

### GOTCHA 2: Card cropping sin K factor distorsiona proporciones
**Por qué:** El crop scale `K = 1.55` está calibrado para VW/VH específicos — cambiar dimensiones requiere recalcular K.
**Solución:** Si se cambian VW o VH, recalcular `K` para mantener aspect ratio del contenido.

### GOTCHA 3: White fade-from sin easing produce corte abrupto
**Por qué:** La transición desde BrowserSearch debe ser suave — sin easing es un flash blanco duro.
**Solución:** Siempre usar `Easing.out(Easing.cubic)` en el fade-from de 0 a 18.

### GOTCHA 4: STAGGER incorrecto desincroniza las 4 cards
**Por qué:** Con STAGGER=8 las 4 cards entran en frames 58, 66, 74, 82 — cambiar STAGGER rompe el timing del gather.
**Solución:** Si se ajusta STAGGER, recalcular HOLD_END y todo el timing subsiguiente.
