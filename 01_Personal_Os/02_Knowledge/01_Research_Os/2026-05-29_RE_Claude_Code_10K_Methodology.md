---
title: "RE: Build $10K Websites — Pattern Extraction & Methodology"
source: YouTube Reverse Engineering
url: https://youtu.be/VMvZuhcDdnw
author: Metics Media / PersonalOS Analysis
date: 2026-05-29
type: reverse-engineering
tags: [pattern-extraction, methodology, claude-code, web-design, prompting, framework]
status: active
---

# Reverse Engineering: Build $10K Websites with Claude Code

## Core Thesis

El video no es un tutorial de Claude Code — es un **playbook de posicionamiento**. El verdadero producto no es el website, es la **percepción de valor**. Metics Media vende $10K websites que cuestan $60 construir, y la diferencia está toda en el proceso, no en la tecnología.

---

## Patrón #1: La Escalera de Percepción de Valor

```
Capa 1: Stack técnico (visible, commodity)
  Claude Code + Skills + Hostinger = cualquiera puede hacerlo
  ↓
Capa 2: Framework de calidad (semi-visible)
  8-item checklist en 3 grupos (Taste / Substance / Felt Quality)
  ↓
Capa 3: Metodología de iteración (invisible)
  Batch fixes → Cursor interactions → "Make it more subtle"
  ↓
Capa 4: Posicionamiento (el verdadero producto)
  "I sell them for $10K" → no es el código, es la confianza
```

**Insight**: Las capas 1 y 2 son gratuitas (las comparte en el video). Las capas 3 y 4 son las que justifican el precio. El negocio no es construir websites — es **vender la metodología que los hace ver de $10K**.

---

## Patrón #2: El Loop de Iteración Progresiva

```
BRIEF → BUILD → GRADE → BATCH FIX → MICRO-FIX → DEPLOY
  │         │        │          │           │
  │         │        │          │           └── 1 interacción por sección
  │         │        │          └── 5 cambios juntos por intent
  │         │        └── Checklist de 8 items → honesto
  │         └── 3 min brief + 4 min build
  └── References > Description
```

**Loop clave que hace la diferencia**:
1. **Grade yourself** contra el checklist (no asumir que está bien)
2. **Batch fixes** por intent, no uno por uno (cohesión + tokens)
3. **One micro-interaction per flat section** (cursor effects sutiles)
4. **"Make it more subtle"** como mantra (refinar, no añadir)

---

## Patrón #3: El Framework de los 8 Items ($10K Checklist)

```
GRUPO TASTE (primer impacto)
├── 1. Point of View — brief con dirección real
├── 2. Typography — Geist > Inter, serif editorial
└── 3. Color — 5 hex max, restraint > rainbow

GRUPO SUBSTANCE (contenido)
├── 4. Hierarchy — 3 tamaños que guían el ojo
├── 5. Imagery — Assets custom (foto real o AI generado)
└── 6. Motion — Micro-interacciones que se sienten vivas

GRUPO FELT QUALITY (la diferencia real)
├── 7. Mobile — designed for mobile, no shrunk
└── 8. Invisible Stuff — velocidad, solidez, cohesión
```

**Meta-patrón del checklist**: Los primeros 6 items son verificables objetivamente. Los items 7 y 8 son los que realmente separan un sitio de $10K de uno de $200, porque requieren **intención de diseño**, no solo ejecución técnica.

---

## Patrón #4: Prompt Engineering por Capas

```
Capa de Brief:    "/ui-ux-pro-max [brief] Ask me clarifying questions."
Capa de Build:    Claude construye con respuestas a sus 7 preguntas
Capa de Grade:    "Where does this site land against each criteria? Be honest."
Capa de Batch:    "We need more [intent]. Propose a batch of fixes."
Capa de Micro:    "[Section] is flat. Add elegant micro movements. Make it subtle."
```

**Principio rector**: Siempre liderar con **intención**, no con especificaciones. Claude traduce mejor "hacé que se sienta más caro" que "cambiar el margin de la card a 24px".

---

## Patrón #5: El Pipeline de Assets

```
Claude Code escribe el prompt de imagen
→ ChatGPT genera imagen base (photoreal)
→ Veo 3.1 convierte imagen en video (o 11ElevenLabs)
→ Topaz hace upscale
→ Claude Code integra el asset al proyecto
```

**Insight**: Claude no puede generar imágenes/video bien, pero **sabe exactamente qué prompt escribir** porque conoce el contexto del proyecto. La división del trabajo es: Claude piensa el asset, otra AI lo ejecuta, Claude lo integra.

---

## Patrón #6: Arquitectura Defensiva

Cuando el usuario pidió un componente de 21st.dev que era React, Claude dijo **que no** porque el proyecto era static HTML. Este es un patrón crítico:

```
Claude protege la arquitectura que eligió
→ Si el componente no es compatible, no lo fuerza
→ Encuentra una alternativa que funcione en tu stack
→ Si se rompe, debuggea solo (abre el browser, inspecciona)
```

**Contraste con otras AI tools**: La mayoría de asistentes AI te dejan romper tu arquitectura. Claude Code la protege activamente.

---

## Patrón #7: Copywriting Restrained

El video muestra una línea de menú que es un masterclass de copy:

> "Six dishes, one fire."

vs el default AI:
> "Our carefully curated selection of six artisanal dishes, all expertly prepared over our signature open flame."

**Reglas de oro del copy**:
1. Verbos concretos (nunca "elevate", "empower", "unleash")
2. Números específicos (nunca "muchos", "varios", "excelente")
3. Restraint: menos adjetivos = más calidad percibida
4. Front End Design skill de Anthropic entrena para esto

---

## Patrón #8: El Negocio Real

```
Costos/mes:          $20 Claude Pro + $0-$20 herramientas AI = $20-40
Precio/cliente:      $3,000 - $10,000 por sitio
Tiempo/sitio:        ~2-3 horas (build + polish + deploy)
Clientes/mes:        1-5
Revenue potencial:   $36K - $300K/año

Estrategia de venta:
1. Mockup gratis + Loom de 30s → testimonial
2. Warm outreach en Instagram (side-by-side)
3. Cold email personalizado (foto vs foto)
4. Precio basado en percepción, no en costo
```

**El verdadero producto no es el website — es la confianza de que el website va a generar resultados.**

---

## Conexiones con PersonalOS

| Patrón del Video | Skill/Concepto en nuestro OS | Gap |
|-----------------|------------------------------|-----|
| $10K Checklist | Design SOTA (tiene principios similares) | No está codificado como checklist evaluable |
| Batch fixes | No tenemos equivalente | Prompting pattern que podríamos adoptar |
| Front End Design skill | 02_Taste_Skills + 06_Design_Sota | Concepto similar pero no idéntico |
| Pipeline de assets | 12_Premium_Image_Studio + 03_Video_Media | No están conectados en pipeline |
| Cursor interactions | Motion design skills | Patrón específico no documentado |
| Claude protects architecture | No tenemos equivalente | Es un comportamiento del agente, no una skill |

---

## Recomendaciones para el OS

1. **Codificar el $10K Checklist como workflow reusable** — un prompt que evalúe cualquier sitio contra los 8 items
2. **Adoptar "batch fixes by intent" como patrón de prompting** — documentar en skills existentes
3. **Conectar Premium Image Studio + Video skills en pipeline** — el workflow del video (prompt AI → generar → integrar)
4. **Documentar cursor interactions pattern** — como técnica específica de micro-interacciones sutiles
5. **Evaluar si Front End Design skill de Anthropic** se puede instalar o emular en nuestro stack

---

*RE generado por Learning Always pipeline — 2026-05-29*
