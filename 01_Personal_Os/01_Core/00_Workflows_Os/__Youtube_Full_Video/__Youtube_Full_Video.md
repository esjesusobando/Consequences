---
name: youtube-full-video
description: Workflow completo para generar un video de YouTube desde cero. Orquestación de 4 agentes: Content Transformer → Script Writer → Title Generator → Thumbnail Prompter.
argument-hint: "[idea/tema del video - ej: cómo usar AI para marketing]"
---

# 27_Youtube_Full_Video

> Workflow completo para generar un video de YouTube optimizado.

## Propósito

Orquesta los 4 Marketing Agents para generar un paquete completo de video:
- Guion estructurado
- Títulos optimizados
- Prompts para thumbnail

## Cuándo Usar

- Cuando tienes una idea de video y quieres todo el paquete listo
- Para escalar producción de contenido YouTube
- Para mantener consistencia entre guion, título y miniatura

## Input Requerido

- **Idea/Tema del video**: Qué quieres tratar
- **Duración objetivo**: 5/10/15/20 min
- **Tipo de contenido**: Tutorial, review, opinión, etc.

## Workflow Steps

### Step 1: Content Transformer (Agent 13)

**Objetivo:** Transformar la idea inicial en un brief estructurado.

```
Input: [Idea del video]
Output: Brief con:
  - Tema principal
  - Subtemas/Hooks
  - Audiencia target
  - Objetivo del video
```

### Step 2: YouTube Script Writer (Agent 14)

**Objetivo:** Crear el guion completo con estructura.

```
Input: Brief del Step 1
Output: Guion con:
  - Título tentativo
  - Timestamps
  - Hooks por sección
  - CTAs
  - Notas de producción
```

### Step 3: YouTube Title Generator (Agent 16)

**Objetivo:** Generar múltiples títulos optimizados.

```
Input: Guion del Step 2
Output: 10+ títulos con:
  - Scores de CTR
  - Recomendación Top 3
  - Variantes para A/B testing
```

### Step 4: YouTube Thumbnail Prompter (Agent 15)

**Objetivo:** Generar prompts para crear la miniatura.

```
Input: 
  - Título seleccionado (Step 3)
  - Guion completo (Step 2)
Output: 
  - Prompt principal
  - 2 variaciones
  - Notas de composición
```

---

## Output Final

```
📹 YOUTUBE VIDEO PACKAGE
========================

🎬 GUION
--------
[Archivo con guion completo]

📝 TÍTULOS
----------
🥇 [Título principal recomendado]
🥈 [Título alternativa 1]
🥉 [Título alternativa 2]
[+7 variantes más]

🖼️ THUMBNAIL
------------
Prompt: [prompt para AI]
Variaciones: [2 opciones]
Notas: [composición, texto, colors]

---

📊 METADATA
-----------
- Duración: [X] minutos
- Hooks: [lista de hooks]
- CTAs: [suscribirse, like, comentario]
```

## Ejemplo de Uso

**User:** "Quiero hacer un video sobre cómo usar Claude Code para crear proyectos"

**Workflow:**
1. **Agent 13:** Idea → Brief estructurado
2. **Agent 14:** Brief → Guion de 15 min con timestamps
3. **Agent 16:** Guion → 12 títulos con scores
4. **Agent 15:** Título + Guion → Prompts para thumbnail

**Output:** Paquete listo para producir video + thumbnail

---

## Integración con MCPs

Para generación real de thumbnail, agregar step opcional:

### Step 5 (Opcional): AI Image Generation

```bash
/usar MCP de imagen (Nanobanana/Flux/Leonardo/Midjourney)
/generar imagen con [prompt del Step 4]
/guardar en: 05_Plantillas/04_Video/thumbnails/
```

---

## Agentes Involucrados

| #         | Agent                            | Función                        | Input                | Output                       |
|-----------|----------------------------------|--------------------------------|----------------------|------------------------------|
| 13        | Content Transformer              | Idea → Brief                   | Idea                 | Brief estructurado           |
| 14        | Youtube Script Writer            | Brief → Guion                  | Brief                | Guion con timestamps         |
| 16        | Youtube Title Generator          | Guion → Títulos                | Guion                | 10+ títulos con scores       |
| 15        | Youtube Thumbnail Prompter       | Título + Guion → Prompts       | Título + Guion       | Prompts para imagen          |

---

## Success Criteria

- [ ] Brief claro y estructurado
- [ ] Guion con timestamps y hooks
- [ ] 10+ títulos con análisis de CTR
- [ ] Prompts de thumbnail optimizados para AI
- [ ] Consistencia entre todos los elementos

---

*Workflow 27 - Marketing Team v1.0*
*Anterior: 26_Learning_Always*
