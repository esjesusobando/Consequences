# Seedance 2.0 — Flujo de Trabajo Completo y Parámetros

> **Fecha:** 2026-04-14  
> **Fuente:** Compilación de documentación oficial y guías prácticas  
> **Etiquetas:** #Seedance2 #Parameters #Workflow #AIvideo

---

## 📊 Parámetros de Entrada (Input Specifications)

| Tipo       | Formato                    | Límites                             | Notas                                      |
|------------|----------------------------|-------------------------------------|--------------------------------------------|
| **Imagen** | JPEG/PNG/WebP/BMP/TIFF/GIF | Max 9 archivos, <30MB cada uno      | Composición, estilo, personaje             |
| **Video**  | MP4/MOV                    | Max 3 clips, 2-15 segundos, <50MB   | Movimiento y ritmo de cámara               |
| **Audio**  | MP3/WAV                    | Max 3 archivos, <15 segundos, <15MB | Ritmo, timing, mood                        |
| **Texto**  | Natural language prompts   | 60-100 palabras recomendadas        | Acciones, cámara, emoción                  |
| **Total**  | Todos los tipos            | Max 12 archivos combinados          | Priorizar lo que más afecta visuals/rhythm |

---

## ⚙️ Parámetros de Salida (Output Settings)

### Resolución

| Resolución   | Uso                                                    | Notas                           |
|--------------|--------------------------------------------------------|---------------------------------|
| **480p**     | Testing rápido, brainstorming                          | Solo para iteración early       |
| **720p**     | **PRODUCTION DEFAULT** — Social content, testing final | Mejor balance calidad/velocidad |
| **1080p**    | Final delivery, client deliverables                    | Más costo, mejor textura        |

> **Regla:** "480p for testing, 720p for production, 1080p only when you've validated the motion"

### Duración

| Duración     | Uso                                  | Notas                               |
|--------------|--------------------------------------|-------------------------------------|
| **4-6 seg**  | Simple actions, product rotation     | Evita drift                         |
| **8-12 seg** | **SWEET SPOT** — Producción estándar | Room para story sin quality drift   |
| **15 seg**   | Solo si el prompt lo justifica       | Mayor riesgo de drift en personajes |

> **Regla:** "6-8 seconds is the safe zone. Past 12 seconds, you start seeing costume changes mid-shot."

### Aspect Ratio

| Ratio    | Plataforma            | Notas                               |
|----------|-----------------------|-------------------------------------|
| **9:16** | TikTok, Reels, Shorts | Pulls faces/text forward            |
| **16:9** | YouTube, desktop, ads | Más contexto, detalles más frágiles |
| **1:1**  | Instagram posts       | Balanceado                          |
| **21:9** | Cinematic, trailers   | Widescreen                          |

> **Regla:** "Commit to aspect ratio FIRST, then prompt. If vertical, write for single strong subject."

---

## 🔄 Modos de Generación

### Mode 1: First/Last Frame
- Solo imagen start + prompt
- Ideal para transiciones simples
- Tiempo recomendado: 4-6s

### Mode 2: All Reference (Omni-Reference)
- Combina imágenes + videos + audio + texto
- **Más poderoso** — control total sobre motion, cámara, audio
- Usar cuando necesitas precisión

---

## 📝 Anatomía del Prompt (6-Step Formula)

```
[Subject], [Action], in [Environment], camera [Camera Movement], style [Style], avoid [Constraints]
```

### Los 7 elementos del prompt completo:

| Elemento           | Descripción          | Ejemplo                                |
|--------------------|----------------------|----------------------------------------|
| **1. Subject**     | El sujeto principal  | "A woman in her 30s"                   |
| **2. Action**      | Qué hace             | "gracefully hangs laundry"             |
| **3. Environment** | Dónde está           | "in a sunlit courtyard"                |
| **4. Camera**      | Movimiento de cámara | "tracking shot, slow dolly in"         |
| **5. Style**       | Estilo visual        | "cinematic, warm lighting, film grain" |
| **6. Duration**    | Extensión si aplica  | "extend @video1 by 5 seconds"          |
| **7. Constraints** | Negatives            | "- No text, no watermark, no logo"     |

### Negative Cue Estándar
```
"- No music, No logo, no text on screen, no watermark, no stock footage."
```

---

## 🎯 Workflow de Producción (Production Pipeline)

### Phase 1: Testing (Low-res)
```
1. Resolución: 480p
2. Duration: 5-8 seg
3. Aspect ratio: 9:16 o 16:9
4. References: mínimo (solo character)
5. Generar 10 variaciones de prompt
```

### Phase 2: Validation
```
1. Pick best prompt
2. Regenerate at 720p
3. Check: motion stability, character consistency, audio sync
4. Si falla → ajustar UNA variable y re-testear
```

### Phase 3: Final Render
```
1. Resolución: 720p (o 1080p si es cliente final)
2. Duration: 8-12 seg
3. All references cargados
4. Negative cue appended
5. Output: MP4
```

---

## 🔁 Iteration Loop (One Variable at a Time)

**Regla de oro:** "Never change more than one variable per run"

### 4-Round Loop:
1. **Baseline** — Generar 2-3 opciones con prompt estándar
2. **Single Variable** — Cambiar UN elemento (cámara, motion, style)
3. **Quality Score** — Evaluar: continuity, instruction adherence, usability
4. **Final Selection** — Elegir la mejor versión

### Settings Sweep Test (5 runs):
| Run   | Variable      | Propósito                                         |
|-------|---------------|---------------------------------------------------|
| A     | 6s duration   | Check drift en faces/props/lighting               |
| B     | 10s duration  | Comparar con A                                    |
| C     | Target ratio  | Same as A pero en ratio objetivo                  |
| D     | High quality  | Si flaws se sharpening → no es calidad, es intent |
| E     | Guidance/seed | Ajustar strength si colors slip                   |

---

## 🔧 API Parameters (para automatización)

```python
payload = {
    "model": "seedance-2.0",
    "prompt": "Cinematic neon street at dusk, realistic motion, smooth tracking shot, stable subject consistency.",
    "image_urls": ["https://example.com/first-frame.png"],
    "duration": 8,
    "quality": "720p",  # 480p, 720p, 1080p
    "aspect_ratio": "9:16",  # 16:9, 9:16, 1:1, 21:9
    "camera_fixed": False,
    "generate_audio": True
}
```

### Resolution Options
```python
RESOLUTIONS = {
    "480p": "Fast testing",
    "720p": "Production default",
    "1080p": "Final delivery"
}
```

### Aspect Ratio Options
```python
ASPECT_RATIOS = {
    "16:9": "landscape",   # YouTube, desktop
    "9:16": "portrait",    # TikTok, Reels, Shorts
    "1:1": "square",       # Instagram posts
    "21:9": "cinema"       # Cinematic widescreen
}
```

---

## 📋 Checklist de Producción (60 segundos)

Antes de generar un clip production:

- [ ] **Resolución** = 720p (no default)
- [ ] **Aspect ratio** = Locked explícitamente (no auto)
- [ ] **Duration** = 8-12 segundos (matches prompt complexity)
- [ ] **Prompt** = Los 7 elementos presentes
- [ ] **Negative cue** = Appendeado al final
- [ ] **References** = Etiquetados con @syntax

---

## 🎬 Presets por Escenario

### Social Media Shorts
```
Resolution: 720p
Duration: 5-8s
Audio: Off (generar después)
Reference stack: Character → Face → Style
```

### Product Ads
```
Resolution: 1080p final
Duration: 8-12s
Audio: Optional
Reference stack: Product → Scene → Brand
```

### Cinematic/Trailer
```
Resolution: 1080p
Duration: 8-12s
Camera: Emphasis on path + lighting layers
Reference: Full multi-reference
```

### UGC (User Generated Content)
```
Resolution: 720p o 1080p
Duration: Short controlled shots
Audio: Usually added in editing
Reference: Character consistency priority
```

---

## 🔗 Errores Comunes y Fixes

| Error                                      | Causa                                  | Fix                                                          |
|--------------------------------------------|----------------------------------------|--------------------------------------------------------------|
| **Early instability** (primeros 2s wobble) | Duration muy largo para la acción      | Trim scope, shorter shots                                    |
| **Character drift**                        | Prompt conflicting con image reference | "If image 1 already shows X, don't describe X in prompt"     |
| **Colors shifting**                        | Guidance strength muy alto/bajo        | Ajustar guidance: up if colors slip, down if too rigid       |
| **Crowded frames**                         | Too many subjects, no anchor           | Pick ONE strong subject, simplify                            |
| **Texture brittleness**                    | Resolution upscale sin intent          | Draft at speed, lock with reference frame, THEN bump quality |

---

## 🧠 Reglas de Oro (Golden Rules)

1. **Shot stability = still clarity** — "If a single frame is confusing, the video will amplify that confusion"

2. **Same ratio across shots** — "Switching from 16:9 to 9:16 mid-sequence changes framing and can alter character appearance"

3. **Minimal character description** — "Don't write 'a girl wearing a red dress' if image 1 already shows that"

4. **Match duration to complexity** — Simple product rotation doesn't need 15s; multi-action sequence shouldn't be rushed

5. **Consistent quality across shots** — "Mixing 480p and 720p across shots can introduce subtle rendering differences"

---

## 📚 Recursos

- [Official Prompt Guide](https://help.apiyi.com/en/seedance-2-0-prompt-guide-video-generation-camera-style-tips-en.html)
- [Magic Hour Settings Guide](https://magichour.ai/blog/seedance-20-best-settings)
- [WaveSpeed AI Settings](https://wavespeed.ai/blog/posts/blog-seedance-2-0-best-settings/)
- [VideoAI.Me Production Guide](https://videoai.me/blog/seedance-2-0-best-settings)

---

*Compilado: 2026-04-14*
