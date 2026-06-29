# Workflow: Audio → 5 Piezas de Contenido

> **Objetivo:** Convertir 1 audio en contenido publicado en piloto automático.
> **Autor:** Sebas / Gentleman Programming
> **Versión:** 1.0 — 2026-06-09

---

## Trigger

```
"El usuario tiene un audio y quiere convertirlo en contenido para LinkedIn, Twitter y Newsletter"
```

---

## Contexto Previo

Antes de iniciar, cargar:
1. `brand-voice.md` — tono y estilo
2. `estrategia.md` — objetivos de marketing
3. `colores.md` — paleta visual
4. `tone-of-voice.md` — guía de voz específica

---

## Fase 0: Preparación

### 0.1 Recibir Audio
- Pegar path del audio o transcribir directamente
- Verificar que existe: `ls audio/`

### 0.2 Transcripción
```bash
python tools/transcribe.py "audio/mi_audio.m4a"
```

Output: `transcripts/YYYY-MM-DD_mi_audio.md`

### 0.3 Verificar Transcripción
- Revisar que no haya gaps grandes
- Identificar los 3 mejores momentos/insights del audio
- Marcar timestamps clave para referencia

---

## Fase 1: Generación de Texto

### 1.1 LinkedIn Post 1 — Hook + Insight

**Estructura:**
```
Línea 1 (hook): Pregunta provocadora o dato impactante
Líneas 2-4: Contexto rápido
Líneas 5-8: Insight principal del audio
Cierre: CTA suave ("guarda para después" / "¿y tú qué opinas?")
Hashtags: 3-5 relevantes
```

**Reglas:**
- 150-200 palabras máximo
- No emojis en posts largos (pierden seriedad)
- Ejemplo concreto siempre
- Formato archivo: `linkedin-01-YYYY-MM-DD.md`

### 1.2 LinkedIn Post 2 — Takeaway + CTA

**Estructura:**
```
Línea 1: Takeaway principal (frase memorable)
Líneas 2-5: Explicación / ejemplo
Cierre: CTA claro
Hashtags: 3-5
```

**Reglas:**
- Más accionable que el Post 1
- "¿Probaste X?" / "¿Cuál es tu experiencia con Y?"
- 150-200 palabras

### 1.3 LinkedIn Post 3 — Framework

**Estructura:**
```
Línea 1: "3 cosas que aprendí sobre [tema]"
---
Punto 1: Título + ejemplo
---
Punto 2: Título + ejemplo
---
Punto 3: Título + ejemplo
---
Cierre: Reflexión personal
Hashtags: 3-5
```

**Reglas:**
- 200-250 palabras
- Cada punto con ejemplo real
- Cierre emocional (no corporate)

### 1.4 Twitter/Thread

**Estructura:**
```
Tweet 1 (hook): Frase impactante del audio
Tweet 2: Contexto rápido
Tweet 3: Insight #1
Tweet 4: Insight #2
Tweet 5: Insight #3
Tweet 6: CTA final
```

**Reglas:**
- Max 280 caracteres por tweet
- 5-8 tweets totales
- Incluir números si hay stats
- No hashtags en thread (queda too busy)

### 1.5 Newsletter

**Estructura:**
```
Subject: "Lo que aprendí esta semana [tema]"

Hola [nombre],

[Parrafito personal - contexto de la semana]

[Sección 1: Insight principal]
[Sección 2: Segundo insight]
[Sección 3: Tercero insight]

[Link al contenido completo / video]

¡Nos vemos!,
[Tu nombre]

P.D. [Algo personal / gracioso]
```

**Reglas:**
- Tono epistolar, como email de amigo
- 3 secciones máximo
- Links a recursos mencionados
- P.D. obligatorio (humaniza)

---

## Fase 2: Visual

### 2.1 Imagen Principal (Higgsfield)

Generar 1 imagen para el post principal de LinkedIn:
- Estilo: Dark mode, minimal, profesional
- Concepto: Basado en el hook del audio
- Formato: 1200x628 (ratio 1.91:1)

```bash
/higgsfield generate --prompt "Professional dark mode illustration representing [concept]. Minimal, clean, brand colors: dark background with subtle blue accents. No text."
```

### 2.2 Carousel (8-10 slides)

**Estructura:**
```
Slide 1: Hook visual (título grande)
Slide 2: "De qué va este thread"
Slides 3-7: 5 insights principales (1 por slide)
Slide 8: "El punto clave"
Slide 9: CTA ("guarda para después")
Slide 10: Link / siguiente paso
```

**Generar cada slide:**
```bash
/higgsfield generate --prompt "Slide [N] of carousel about [topic]. Minimal dark design, [element]. Text: [text if any]. Professional."
```

### 2.3 Thumbnail YouTube

- Formato: 1280x720
- Texto grande y claro
- Expresión facial o ilustración impactante
- Branding Think Different visible

---

## Fase 3: Programación (Metricool)

### 3.1 Programar LinkedIn

```bash
/mcp metricool schedule \
  --content "linkedin-01-YYYY-MM-DD.md" \
  --platform linkedin \
  --time "09:00" \
  --date "2026-06-XX"

# Stagger: +2 días entre posts
/mcp metricool schedule \
  --content "linkedin-02-YYYY-MM-DD.md" \
  --platform linkedin \
  --time "09:00" \
  --date "2026-06-XX+2d"

/mcp metricool schedule \
  --content "linkedin-03-YYYY-MM-DD.md" \
  --platform linkedin \
  --time "09:00" \
  --date "2026-06-XX+4d"
```

### 3.2 Programar Twitter

```bash
/mcp metricool schedule \
  --content "thread-YYYY-MM-DD.md" \
  --platform twitter \
  --time "10:00" \
  --date "2026-06-XX+1d"
```

### 3.3 Programar Newsletter

```bash
/mcp metricool schedule \
  --content "newsletter-YYYY-MM-DD.md" \
  --platform email \
  --time "18:00" \
  --date "2026-06-XX+3d"
```

---

## Fase 4: Analytics

### 4.1 Revisión Semanal (cada viernes)

```bash
/mcp metricool analytics --period week --platform linkedin
/mcp metricool analytics --period week --platform twitter
/mcp metricool analytics --period week --platform email
```

### 4.2 Documentar Learnings

Crear `analytics/YYYY-MM-DD-weekly-review.md`:

```
## ¿Qué funcionó?
- Post 1: [métricas] → ¿por qué funcionó?
- Carousel: [métricas] → ¿qué patrón?

## ¿Qué no funcionó?
- Post 2: [métricas] → ¿por qué bajo?

## Ajustes para próxima semana
- [ ] Agregar más ejemplos reales
- [ ] Probar headlines más específicos
- [ ] Cambiar hora de posting

## Insights para brand-voice.md
- Nuevo patrón identificado: [...]
```

### 4.3 Actualizar Brand Voice

Si hay nuevos insights → actualizar `.agent/01_Agents/04_Contexto/03_Contexto/02_tono-de-voz.md`

---

## Checklist Final

```
[ ] Audio transcrito
[ ] 3 LinkedIn posts generados
[ ] 1 Twitter thread generado
[ ] 1 Newsletter generada
[ ] Imagen principal creada
[ ] Carousel creado (8-10 slides)
[ ] LinkedIn posts programados (staggered)
[ ] Twitter thread programado
[ ] Newsletter programada
[ ] Analytics programado para revisión semanal
```

---

## Tips

1. **Graba cuando estés inspirado** — no frente a la pantalla
2. **30 min audio = contenido para 1 semana** (3 LinkedIn + 1 Twitter + 1 Newsletter)
3. **No edites el audio** — la autenticidad es el diferenciador
4. **Revisa métricas** — el sistema mejora con feedback real
5. **Stagger los posts** — no publiques todo el mismo día

---

## Metadata

- **Versión:** 1.0
- **Creado:** 2026-06-09
- **Basado en:** Sistema de Lorena Bordonaba (YouTube: "Construí el equipo de agentes...")
- **Integración OS:** Skills `15_Audio_Pipeline`, Brand Voice, Estrategia Marketing
- **Owner:** Sebas / Gentleman Programming