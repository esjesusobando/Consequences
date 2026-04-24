---
name: video-prompt-builder
description: Generate shot-by-shot video prompts for AI video generation with effects breakdown. Triggers on: video prompt generation, Seedance prompt, shot list, plan a video, video concept, brand film, ad concept, product video, camera moves, effects breakdown, storyboard, visual sequence generation.
---

# Video Prompt Builder for Seedance 2.0

> **Level**: Elite — Cinematic AI Video Production

## Esencia Original

> **Metaskill**: Traductor de briefs creativos a prompts de video técnicos listos para IA.

Esta skill convierte ideas visuales en especificaciones técnicas que Seedance 2.0 puede interpretar — frame rate, efectos apilados, transiciones y energy arc. Sin estructura clara, los videos generados pierden intención creativa.

---

## Cómo Funciona

1. Leer `references/effects-breakdown-reference.txt` para internalizar estructura y nivel de detalle.
2. El usuario entrega un **creative brief** — tan simple como "a runner in a stadium for a Nike ad" o tan detallado como un storyboard.
3. Si el brief es demasiado vago, hacer **una sola pregunta** de clarificación antes de proceder.
4. Generar el prompt completo en las 4 secciones obligatorias.

---

## Output: 4 Secciones Obligatorias

### Sección 1: SHOT-BY-SHOT EFFECTS TIMELINE

```
SHOT [N] ([timestamp]) — [Shot Name]
• EFFECT: [Primary effect] + [secondary effects if stacked]
• [Visual description]
• [Camera: angle, movement, lens]
• [Speed/timing — percentages for slow-mo]
• [Transition to next shot]
```

- Cada shot = 1–4s salvo brief contrario
- Nombrar efectos precisamente: "speed ramp (deceleration)" no "speed ramp"
- Listar todos los efectos apilados explícitamente
- Usar lenguaje de resultado visual, no de software
- Señalar el shot clave con: `"This is the SIGNATURE VISUAL EFFECT"`

### Sección 2: MASTER EFFECTS INVENTORY

Lista numerada: nombre, cuántas veces, en qué shots, rol en el edit. Agrupar por: speed manipulation, camera movement, digital effects, transitions, compositing, optical.

### Sección 3: EFFECTS DENSITY MAP

```
[timestamp range] = HIGH/MEDIUM/LOW DENSITY ([effects] — [count] effects in [duration])
```

### Sección 4: ENERGY ARC

Curva completa: Act 1 (gancho) → Act 2 (desarrollo + firma) → Act 3 (resolución). Cada acto con temperatura emocional definida.

---

## ⚠️ Gotchas

### GOTCHA 1: Efectos vagos arruinan la generación
**Por qué:** "Zoom" sin especificar tipo y rango deja a Seedance interpretando mal — produce resultados genéricos.
**Solución:** Siempre incluir rango, dirección y duración: "digital zoom (scale-in) from 1.0x to 2.2x over 12 frames"

### GOTCHA 2: No documentar transiciones como shots propios
**Por qué:** Las transiciones (whip pan, flash bloom, motion blur smear) son momentos creativos — si no se detallan, Seedance las corta o ignora.
**Solución:** Documentar cada transición como "SHOT [N] — TRANSITION" con duración, easing y efecto explícito.

### GOTCHA 3: Density map incorrecto aplana la energía
**Por qué:** Poner 4-5 efectos en cada segmento agota visualmente — el contraste HIGH/LOW es lo que crea impacto.
**Solución:** Contar efectos reales por segmento y verificar que hay alternancia real entre densidades.

### GOTCHA 4: Olvidar la Energy Arc
**Por qué:** Sin estructura narrativa el video se siente incompleto, sin importar cuán buenos sean los shots individuales.
**Solución:** Escribir Act 1/2/3 con temperatura emocional clara — dónde sube, dónde baja, dónde pega.

---

## 📁 Referencias

- [references/effects-breakdown-reference.txt](references/effects-breakdown-reference.txt) — Estructura completa y ejemplos de efectos cinematográficos para Seedance 2.0
