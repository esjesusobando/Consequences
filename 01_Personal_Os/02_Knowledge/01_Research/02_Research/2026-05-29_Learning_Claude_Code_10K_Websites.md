---
title: "Build $10,000 Websites using Claude Code (Ultimate Guide)"
source: YouTube
url: https://youtu.be/VMvZuhcDdnw
author: Metics Media
date: 2026-05-29
type: learning
tags: [claude-code, web-design, ai-websites, ui-ux, prompting, skills]
status: active
---

# Learning Always: Build $10,000 Websites using Claude Code

## Metadata
- **Video**: Build $10,000 Websites using Claude Code (Ultimate Guide)
- **Channel**: Metics Media
- **URL**: https://youtu.be/VMvZuhcDdnw
- **Duration**: ~26 min
- **Extracted**: 2026-05-29

---

## 1. Resumen Ejecutivo

El video presenta un pipeline completo para construir websites de calidad "agencia" ($10K) usando Claude Code como herramienta principal, complementado con skills de diseño, generación de assets con IA, y deployment profesional.

**Stack completo:**
- Claude Code Desktop App ($20/mes)
- Front End Design skill (Anthropic, gratuita)
- UI/UX Pro Max skill (community, gratuita)
- 21st.dev (componentes pre-hechos gratuitos)
- ChatGPT / 11ElevenLabs / Veo 3.1 / Topaz (assets visuales)
- Hostinger hosting (~$43/año con dominio)
- **Total: ~$60 para un sitio profesional**

---

## 2. Breakdown del Proceso (8 Capítulos)

### Capítulo 1: Setup de Claude Code
- Descargar desktop app desde claude.com (sección Claude Code)
- Plan Pro: $20/mes
- Cambiar a **Code Mode** (Cmd/Ctrl + 3)
- Crear carpeta workspace dedicada
- Activar **Auto Mode** (Claude trabaja sin pedir permiso)

### Capítulo 2: Instalar Skills de Diseño
| Skill               | Fuente             | Propósito                                           | Instalación                                |
|--------------------|-------------------|----------------------------------------------------|-------------------------------------------|
| **Front End Design**| Anthropic (oficial)| Banear fonts overused, empujar bold design direction| Pegar URL + "Install this skill"           |
| **UI/UX Pro Max**   | Community          | 57 UI styles, 95 palettes, 56 font pairings         | Pegar URL + "Install this plugin using NPM"|

### Capítulo 3: El Brief — La Clave de Todo
- **References > Description**: Mostrar screenshots de sitios que te gustan es más efectivo que describir con palabras
- Fuentes de inspiración: [Dribbble](https://dribbble.com), [Awwwards](https://www.awwwards.com), Pinterest
- Encontrar 3-5 sitios de referencia, sacar screenshots
- **Prompt estrella:**
  ```
  /ui-ux-pro-max [brief del sitio]
  Ask me clarifying questions.
  ```
- Esa última línea hace que Claude pregunte ANTES de construir

### Capítulo 4: El Build
- Claude responde con ~7 preguntas (nombre, estilo, secciones, tech stack, animaciones)
- Ofrece 3 direcciones de estilo para elegir
- **Tip crítico**: Cuanto más específico seas en las respuestas, menos revisions después
- Claude tarda ~3 min leyendo el brief + ~4-5 min construyendo

### Capítulo 5: El Checklist de $10K (8 Items)
```
GRUPO 1: TASTE
├── 1. Point of View — dirección clara, no genérico
├── 2. Typography — Fuentes con personalidad (evitar Inter)
└── 3. Color — Restraint > rainbow (5 hex max, bien elegidos)

GRUPO 2: SUBSTANCE
├── 4. Hierarchy — Tamaños que guían el ojo (qué leer 1ro, 2do, 3ro)
├── 5. Imagery — Assets custom (fotos/video real o AI generado)
└── 6. Motion — Micro-interacciones, scroll effects, cursor effects

GRUPO 3: FELT QUALITY
├── 7. Mobile — No es "responsive", es "designed for mobile"
└── 8. Invisible Stuff — Velocidad, sensación de solidez
```

### Capítulo 6: Assets Visuales
- **Claude escribe los prompts de imagen por vos** (sabe el contexto del proyecto)
- Pipeline de generación:
  1. ChatGPT para imagen base (photoreal)
  2. Veo 3.1 para convertir imagen en video
  3. Topaz para upscale
  4. **O todo en 11ElevenLabs** (agregator, 50% off con link)
- **21st.dev**: Librería de componentes animados pre-hechos
  - Browse para inspiración visual
  - Copy prompt para implementar en tu proyecto
  - Claude **protege la arquitectura** — si el componente es React y tu proyecto es static HTML, dice que no

### Capítulo 7: Polish & Motion Design (EL SECRETO)
- **Batch fixes > One-at-a-time**: Decir "necesito más micro-interacciones, las secciones de abajo se sienten genéricas" → Claude propone 5 cambios juntos
- **Pattern de oro**: 
  1. Revisar sección por sección
  2. Las que se sienten planas → pedir UNA interacción de cursor por sección
  3. Siempre pedir "make it more subtle, more refined"
- **Cursor effects** que marcan la diferencia:
  - Ember glow que sigue el cursor con parallax
  - Candlelight halo con trailing motion
  - Palabras que se revelan una por una al scrollear
- **Copywriting**: "Six dishes, one fire." — Restraint, no adjectives. Front End Design skill entrena a Claude para esto.
- **Inter font**: Si ves Inter en el output, pedí que lo cambie (grita "AI made this"). Claude lo cambió a Geist en el build.

### Capítulo 8: Deployment con Hostinger
- **Plan Premium**: Para sitios static (sin login, checkout, DB)
- **Plan Business**: Si Claude usó Node.js/backend
- **Trick del ZIP**: Seleccionar los ARCHIVOS dentro del folder (no el folder) → zip → arrastrar a Hostinger
- **Costo**: ~$43/año hosting + dominio + email gratis
- **Total proyecto**: ~$60 ($20 Claude Pro + $43 hosting)

---

## 3. Prompt Engineering — Lecciones Clave

| Principio                          | Ejemplo del video                                                                                              |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| **Lead with intent, not specifics**| "Necesito más micro-interacciones, las secciones de abajo se sienten genéricas" en vez de "agregá X componente"|
| **Batch by intent**                | Pedir 5 cambios juntos que comparten un objetivo de diseño                                                     |
| **Push back when broken**          | Claude rompió el scroll → "it isn't scrolling" → Claude debuggea solo                                          |
| **Claude protects architecture**   | Dijo que no a React component en proyecto static HTML                                                          |
| **Gradéate contra tu checklist**   | Pasar el checklist de $10K y preguntar "where does this site land?"                                            |

---

## 4. Conexiones con el OS

### Skills relacionadas en nuestro sistema:
- **ui-ux-pro-max**: Ya instalada localmente. El video la usa como skill de Claude Code (otro ecosistema) pero los principios son los mismos
- **ce-frontend-design**: Skill de Anthropic para diseño — concepto similar a nuestras skills de diseño
- **21st.dev**: No tenemos equivalente directo. Podríamos considerar integrar componentes similares

### Stack tecnológico del video vs nuestro OS:
- Claude Code Desktop: No es directamente aplicable (nosotros usamos OpenCode/Claude como agente)
- Skills de diseño: Los conceptos de "restraint", "batch fixes", "cursor interactions" son transferibles a cualquier build
- El $10K checklist es un framework reusable para evaluar calidad de cualquier website

---

## 5. Prompts Reutilizables

### Prompt de build inicial:
```
/ui-ux-pro-max
Build me a one-page website for [business type] located in [city].
Style: [direction]
Sections: [list sections]
Tech: [static HTML / React / etc]
Tone: [description]
Ask me clarifying questions.
```

### Prompt de batch fix:
```
We need more handcrafted micro interactions.
The lower sections feel a bit generic.
We don't need to make them busier, just more expensive.
Propose a batch of fixes.
```

### Prompt de evaluación:
```
Here's the $10K website checklist:
[checklist]
Where does this site land against each of these criteria? Be honest.
```

### Prompt de iteración por sección:
```
[Section name] is feeling very static.
Add some elegant micro movements and cursor interactions here.
Make it more subtle, more refined.
```

---

## 6. Asset Pipeline Workflow — Conectando skills del OS

El video muestra un pipeline de assets que cruza múltiples herramientas. Nuestro OS tiene skills equivalentes que podemos conectar:

```
FASE 1: CONCEPTO (Claude/Agente)
  └── Sabemos el contexto del proyecto → escribimos el prompt de asset
  └── Skill: Cualquier skill de diseño del OS (Design SOTA, UI/UX Pro Max)
  └── Output: Prompt de imagen/video listo para ejecutar

FASE 2: GENERACIÓN (Herramientas externas)
  ├── Imagen base → ChatGPT / Gemini / Nano Banana 2
  ├── Video → Veo 3.1 / Kling / 11ElevenLabs
  ├── Upscale → Topaz / Clipdrop
  └── Skills OS relacionadas:
      ├── 12_Premium_Image_Studio → Assets visuales
      ├── 14_Video_Visuals_Producer → Producción de video
      ├── 15_Youtube_Thumbnail_Prompter → Prompts de thumbnail
      └── 16_Video_Prompt_Builder → Prompts de video AI

FASE 3: INTEGRACIÓN (Claude/Agente)
  └── Asset se guarda en el proyecto → Claude lo integra
  └── Skill: Design SOTA / UI/UX Pro Max
  └── Output: Sitio completo con assets custom
```

**Principio clave**: Claude/el agente NO genera el asset — escribe el PROMPT para que otra AI lo genere. La división del trabajo:
1. Agente piensa qué asset se necesita (contexto del proyecto)
2. Herramienta externa genera el asset
3. Agente integra el asset al código

**Conexiones OS:**
- `12_Premium_Image_Studio` → Identidad visual, banners (Fase 2)
- `14_Video_Visuals_Producer` → Producción de assets visuales (Fase 2-3)
- `16_Video_Prompt_Builder` → Prompts detallados para video AI (Fase 1)
- `06_Design_Sota` → Principios de diseño para guiar la generación (Fase 1 y 3)

---

## 7. Action Items

### ✅ Completados en esta sesión
- [x] Design SOTA mejorado con $10K Checklist evaluativo + Iteration Workflow (v1.1.0 → v1.2.0)
- [x] Pipeline de assets documentado en este knowledge entry
- [x] Reverse engineering extractado como documento aparte
- [x] Prompts reutilizables extraídos y documentados

### 🔄 Pendientes para próximas sesiones
- [ ] Investigar 21st.dev como MCP o recurso para builds futuros
- [ ] Probar el workflow de "batch fixes by intent" en proyectos del Playground
- [ ] Evaluar si la Front End Design skill de Anthropic se puede integrar a nuestro stack
- [ ] Probar el asset pipeline completo con Premium Image Studio + herramientas externas

---

---

*Generado por Learning Always pipeline — 2026-05-29*
