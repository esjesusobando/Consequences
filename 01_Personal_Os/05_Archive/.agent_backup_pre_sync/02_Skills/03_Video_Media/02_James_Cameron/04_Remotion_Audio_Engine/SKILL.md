---
name: remotion-audio-engine
description: Add sound effects and background music to Remotion compositions using Sequence-based timing. Triggers on: add audio remotion, sound effects remotion, background music remotion, audio timing remotion, keyboard sound remotion, silence offset ffmpeg, remotion audio sequence, step 5 audio.
---

# Remotion — Audio Engine

> **Level**: Elite — Remotion Video Production

## Esencia Original

> **Propósito:** Agregar audio sincronizado a composiciones Remotion usando `<Sequence>` para control preciso de timing
> **Regla crítica:** NUNCA usar `delay` prop en `<Audio>` — no existe en Remotion. Siempre usar `<Sequence from={frameNumber}>`

---

## Setup

```tsx
import { Audio, Sequence, staticFile } from "remotion";
// Colocar todos los .mp3 en /public/
```

---

## Encontrar silence offset con ffmpeg

Antes de agregar cualquier audio, encontrar dónde empieza el sonido real:

```bash
ffmpeg -i "your-file.mp3" -af "silencedetect=noise=-40dB:d=0.01" -f null - 2>&1
```

Buscar el primer valor `silence_end`. Convertir a frames: `seconds × 30 = startFrom`

---

## Patrones de Uso

### Keyboard sound (en BrowserSearch)
```tsx
<Sequence from={T_TYPE_START} durationInFrames={T_TYPE_END - T_TYPE_START}>
  <Audio src={staticFile("sonido-teclado.mp3")} startFrom={210} />
</Sequence>
```

### Click sound
```tsx
<Sequence from={T_MOVE_END} durationInFrames={15}>
  <Audio src={staticFile("click.mp3")} startFrom={0} />
</Sequence>
```

### Background music con fade-out
```tsx
const bgVolume = interpolate(
  frame,
  [0, 10, totalDuration - 20, totalDuration],
  [0, 1, 1, 0],
  { clamp: true }
);
<Audio src={staticFile("bg-music.mp3")} volume={bgVolume} />
```

---

## ⚠️ Gotchas

### GOTCHA 1: Usar `delay` prop en `<Audio>`
**Por qué:** La prop `delay` no existe en Remotion — la ignora silenciosamente y el audio se reproduce de inmediato.
**Solución:** Siempre envolver en `<Sequence from={frameNumber}>` para controlar el inicio.

### GOTCHA 2: Silencio inicial en archivos de audio
**Por qué:** Muchos MP3 tienen silencio al inicio que desincroniza el efecto con la imagen.
**Solución:** Usar ffmpeg `silencedetect` y ajustar `startFrom` para saltear el silencio inicial.

### GOTCHA 3: Audio sin `durationInFrames` en Sequence
**Por qué:** Sin duración, el audio se corta al final de la composición o sigue reproduciéndose fuera de la secuencia.
**Solución:** Siempre especificar `durationInFrames` en la `<Sequence>` que envuelve el audio.

### GOTCHA 4: Volume sin interpolation produce pops de audio
**Por qué:** Cambios abruptos de volumen crean clicks y pops audibles.
**Solución:** Siempre hacer fade-in y fade-out del volumen con interpolate de al menos 10 frames.
