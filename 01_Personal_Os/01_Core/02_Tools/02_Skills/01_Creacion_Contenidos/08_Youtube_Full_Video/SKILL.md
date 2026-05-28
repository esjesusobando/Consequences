---
name: youtube-full-video-epic
description: Workflow ÉPICO para YouTube que integra el ecosistema completo de skills: Brand Voice Guardian → Content Ideation → Content Transformer → Script Writer → Title Generator → Thumbnail Prompter → Nano Banana (imagen). Triggers on: full youtube workflow, video production pipeline, content ecosystem, integrated content creation, end-to-end video
argument-hint: "[idea/tema del video - ej: cómo usar AI para marketing]"
---

# Youtube Full Video EPIC 🎬

> Workflow completo integrado con TODO el ecosistema de skills de marketing.

## Esencia Original

- **Metaskill**: Orquestar el pipeline completo de creación de video YouTube — desde idea hasta thumbnail generado — integrando 8+ skills especializadas en un solo flujo coherente y repetible.
- **Propósito original**: Unificar todos los micro-servicios de contenido en un meta-workflow que garantice consistencia entre idea, guion, título, miniatura y marca. Es el "comando de un solo botón" para producción profesional de video sin depender de equipos grandes.

## Por Qué es ÉPICO

```
📥 IDEA
  ↓
┌─────────────────────────────────────────────┐
│ 🎯 CONTENT IDEATION                         │
│    "Genera 10 ideas basadas en trending"   │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🛡️ BRAND VOICE GUARDIAN                    │
│    "Verifica que el contenido ajuste con    │
│     la voz de marca"                        │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 📝 CONTENT TRANSFORMER                       │
│    "Idea → Brief estructurado"              │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🎬 YOUTUBE SCRIPT WRITER                   │
│    "Brief → Guion con timestamps + hooks"   │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 📊 YOUTUBE TITLE GENERATOR                  │
│    "Guion → 10+ títulos con scores"        │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🖼️ YOUTUBE THUMBNAIL PROMPTER              │
│    "Título → Prompts optimizados"           │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🎨 NANO BANANA / PREMIUM IMAGE STUDIO      │
│    "Prompt → Imagen real"                  │
└─────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────┐
│ 🎥 JAMES CAMERON (Opcional)                 │
│    "Script → Video completo"                │
└─────────────────────────────────────────────┘
  ↓
📤 OUTPUT: PAQUETE COMPLETO YOUTUBE
```

## Skills Integradas

| #                                | Skill                                                           | Función                                       | Input                                       | Output                                              |
|---------------------------------|----------------------------------------------------------------|----------------------------------------------|--------------------------------------------|----------------------------------------------------|
| 1                                | Content Ideation                                                | Generar ideas                                 | Tema                                        | 10 ideas con trending                               |
| 2                                | Brand Voice Guardian                                            | Verificar brand                               | Idea                                        | Aprobación de marca                                 |
| 3                                | Content Transformer                                             | Idea → Brief                                  | Idea aprobada                               | Brief estructurado                                  |
| 4                                | Youtube Script Writer                                           | Brief → Guion                                 | Brief                                       | Guion + timestamps                                  |
| 5                                | Youtube Title Generator                                         | Guion → Títulos                               | Guion                                       | 10+ títulos con scores                              |
| 6                                | Youtube Thumbnail Prompter                                      | Título → Prompts                              | Título + Guion                              | Prompts para AI                                     |
| 7                                | Nano Banana / Premium Image Studio                              | Generar imagen                                | Prompt                                      | Imagen real                                         |
| 8                                | James Cameron (opcional)                                        | Video production                              | Guion                                       | Video completo                                      |

## Input Requerido

- **Tema/Nicho**: Qué quieres tratar
- **Audiencia target**: Quién lo va a ver
- **Duración objetivo**: 5/10/15/20 min
- **Estilo de marca**: Colores, tipografía, mood
- **Plataforma**: YouTube (shorts/long-form)

## Workflow Steps Detallados

### Step 1: 🎯 Content Ideation

**Cargar skill:** `12_Content_Ideation`

```
Input: [Tema/Nicho del video]
Output: 10 ideas con:
  - Titulares potenciales
  - Hooks por idea
  - Score de trending
  - Keywords objetivo
```

### Step 2: 🛡️ Brand Voice Guardian

**Cargar skill:** `11_Brand_Voice_Guardian`

```
Input: [Ideas del Step 1]
Output:
  - [APROBADO/RECHAZADO] por idea
  - Ajustes recomendados
  - Tono de voz verificado
  - Palabras a usar / evitar
```

### Step 3: 📝 Content Transformer

**Cargar skill:** `10_Content_Transformer` (en Área 01)

```
Input: [Idea aprobada del Step 2]
Output: Brief con:
  - Tema principal
  - Subtemas/Hooks
  - Audiencia target
  - Objetivo del video
  - Keywords SEO
```

### Step 4: 🎬 YouTube Script Writer

**Cargar skill:** `11_Youtube_Script_Writer` (en Área 01)

```
Input: Brief del Step 3
Output: Guion con:
  - Título tentativo
  - Timestamps por sección
  - Hooks de retención
  - CTAs estratégicos
  - Notas de producción
```

### Step 5: 📊 YouTube Title Generator

**Cargar skill:** `13_Title_Generator` (en Área 01)

```
Input: Guion del Step 4
Output: 10+ títulos con:
  - Score CTR (1-10)
  - Score Searchability (1-10)
  - Score Brand Fit (1-10)
  - Top 3 recomendados
  - Variantes para A/B testing
```

### Step 6: 🖼️ YouTube Thumbnail Prompter

**Cargar skill:** `12_Thumbnail_Prompter` (en Área 01)

```
Input:
  - Título seleccionado (Step 5)
  - Guion completo (Step 4)
Output:
  - Prompt principal para AI
  - 2 variaciones
  - Notas de composición
  - Elementos de marca
```

### Step 7: 🎨 Nano Banana / Premium Image Studio

**Cargar MCP:** `nanobanana` o skill `04_Premium_Image_Studio`

```
Input: Prompt del Step 6
Output:
  - Imagen en alta resolución
  - Variations si aplica
  - Listo para overlay de texto
```

### Step 8: 🎥 James Cameron (Opcional)

**Cargar skill:** `20_James_Cameron`

```
Input: Guion del Step 4 + Video refs
Output:
  - Remotion project
  - Timeline con transiciones
  - Assets sincronizados
  - Video final renderizado
```

---

## Output Final

```
📹 YOUTUBE VIDEO PACKAGE 🎬
==========================

🎯 IDEA GENERADA
----------------
[Idea seleccionada con aprobación de brand]

📝 GUION
--------
[Título: X]
[Duración: X minutos]
[Timestamps: lista]
[Hooks: X puntos de retención]
[CTAs: suscribirse, like, comentario]

📊 TÍTULOS OPTIMIZADOS
-----------------------
🥇 [Título principal] (Score: X/10)
   CTR: X/10 | Search: X/10 | Brand: X/10

🥈 [Título alternativa 1]
🥉 [Título alternativa 2]
[+7 variantes más]

🖼️ THUMBNAIL
------------
Prompt para AI:
[prompt optimizado]

Variaciones: [2 opciones]

🎨 IMAGEN GENERADA
------------------
[Imagen real lista para usar]

📦 METADATA
-----------
- Duración: X minutos
- Hooks: [lista]
- Keywords SEO: [lista]
- CTAs: [lista]
- Brand check: ✅ APROBADO

---

📁 ARCHIVOS GENERADOS
---------------------
- /guion-[video].md
- /thumbnails/[nombre].png
- /brief-[video].json
```

## Ejemplo de Uso

**User:** "Quiero hacer un video de YouTube sobre 'cómo usar AI para crear contenido'"

**Workflow:**
1. **Content Ideation:** 10 ideas basadas en trending
2. **Brand Voice:** Verificar que ajuste con marca
3. **Content Transformer:** Brief estructurado
4. **Script Writer:** Guion de 15 min con timestamps
5. **Title Generator:** 12 títulos con scores CTR
6. **Thumbnail Prompter:** Prompts optimizados
7. **Nano Banana:** Imagen real generada

**Output:** Paquete listo para publicar en YouTube

---

## Success Criteria

- [ ] 10 ideas generadas con análisis de trending
- [ ] Aprobación de Brand Voice para cada idea
- [ ] Brief claro y estructurado
- [ ] Guion con timestamps y hooks de retención
- [ ] 10+ títulos con análisis de CTR
- [ ] Prompts de thumbnail optimizados para AI
- [ ] Imagen generada lista para usar
- [ ] Consistencia entre todos los elementos

---

## Integración con Otras Skills

### Para LinkedIn (repurposing)
```
↓ Después del video
→ Usar Content Transformer
→ Adaptar a post de LinkedIn
→ Usar Carousel Master si es serie
```

### Para Newsletter
```
↓ Después del video
→ Usar Content Transformer
→ Resumen para newsletter
→ Offer & Bio Writer para CTA
```

---

## ⚠️ Gotchas

1. **Skills referenciadas por números/names desactualizados**
   - **Por qué**: Este workflow referencia skills por números (ej: "10_Content_Transformer", "11_Youtube_Script_Writer") que pueden cambiar cuando se añaden o reordenan skills en el ecosistema.
   - **Solución**: Verificar que las rutas y nombres de skills referenciados en los Steps 1-8 coincidan con el estado actual del directorio `01_Creacion_Contenidos/` antes de ejecutar el workflow.

2. **Workflow asume ejecución lineal pero se necesita iteración**
   - **Por qué**: El flujo presentado es secuencial (Step 1 → Step 8), pero en la práctica los pasos 4-6 requieren iteración: el título puede cambiar el guion, la miniatura puede sugerir cambios en el título, etc.
   - **Solución**: Después del Step 6, incluir un bucle de retroalimentación donde el usuario pueda ajustar cualquiera de los outputs anteriores antes de pasar a generación de imagen.

3. **Sin manejo de errores para generación de imagen fallida**
   - **Por qué**: Nano Banana / Premium Image Studio pueden fallar (rate limits, prompts rechazados, timeout) y el workflow no contempla reintentos ni alternativas.
   - **Solución**: El Step 7 debe incluir un plan de contingencia: 3 reintentos con prompts simplificados y un fallback a descripción textual de la miniatura para diseño manual.

## 💾 State Persistence

Este workflow orquesta múltiples skills stateless. El estado del pipeline (idea aprobada, brief, guion, título seleccionado, prompt de thumbnail) debe ser gestionado por el orquestador entre cada step. Se recomienda usar un archivo temporal `youtube-pipeline-state.json` que acumule los outputs de cada etapa.

---

*Workflow 17 ÉPICO - Marketing Team v2.0*
*El workflow más completo del ecosistema*
