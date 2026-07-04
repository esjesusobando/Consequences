# Marketing Pipeline — Estratega → Creador → Analista

> **Versión:** 1.0 | **Fecha:** 2026-06-25 | **Estado:** ✅ PRODUCTION
> **Agentes involucrados:** 15, 16, 17, 06 Orchestrator
> **Skills asociados:** `13_Marketing_Strategy/`, `14_Marketing_Tech/`, `linkedin-content-flow`
> **CLAUDE.md template:** `CLAUDE.marketing.md` (raíz del proyecto)

---

## 📋 Tabla de Contenidos

1. [¿Qué es?](#qué-es)
2. [Arquitectura del Pipeline](#arquitectura-del-pipeline)
3. [Etapas del Pipeline](#etapas-del-pipeline)
4. [Cómo Usar](#cómo-usar)
5. [Referencia de Agentes](#referencia-de-agentes)
6. [Integración con MCPs](#integración-con-mcps)
7. [Validación del Pipeline](#validación-del-pipeline)
8. [Troubleshooting](#troubleshooting)
9. [Referencias](#referencias)

---

## ¿Qué es?

El Marketing Pipeline es un flujo de trabajo multi-agente para producir contenido de marketing profesional de principio a fin. Está compuesto por **3 agentes especializados** que se pasan el trabajo en serie, más un **Orchestrator** que coordina el flujo completo.

### Filosofía

```
Un agente hace una cosa y la hace bien.
Ningún agente produce todo el output solo.
El Orchestrator coordina, no ejecuta.
```

### ¿Por qué 3 agentes y no 1?

| Enfoque | Problema |
|---------|----------|
| 1 agente hace todo | Contexto saturado, calidad inconsistente, sin especialización |
| 3 agentes separados | Cada uno es experto en su fase, el handoff fuerza claridad |
| + Orchestrator | Decide el flujo según el intent del usuario, short-circuit cuando corresponde |

---

## Arquitectura del Pipeline

```
                      ┌─────────────────────────────────────┐
                      │     06 Marketing Orchestrator        │
                      │  "Coordina, no ejecuta"              │
                      │  Parse intent → Route → Feedback     │
                      └──────────┬──────────────────────────┘
                                 │
                    ┌────────────┼────────────────┐
                    ▼            ▼                ▼
            ┌────────────┐ ┌──────────┐ ┌──────────────┐
            │ 15 Estratega│ │16 Creador│ │17 Analista   │
            │ Planifica   │ │ Producce  │ │ Mide y mejora│
            │ Briefs      │ │ Contenido │ │ Feedback loop│
            └──────┬─────┘ └────┬─────┘ └──────┬───────┘
                   │            │               │
                   └────────────┼───────────────┘
                                ▼
                         Feedback Loop
                   (Analista → Estratega)
```

### Short-circuit Rules

| Input Type | Path | Tiempo estimado |
|------------|------|----------------|
| Estrategia / Research | 15 → Done | 5-10 min |
| Crear contenido | 15 → 16 → Done | 15-30 min |
| Campaña completa + análisis | 15 → 16 → 17 → Feedback | 30-60 min |

### Handoff Contract

Cada stage entrega un output estructurado que el siguiente stage consume:

```
Stage 1 (Estratega)
  Output: Brief → contiene objetivo, audiencia, tono, CTA, KPIs
  ↓
Stage 2 (Creador)
  Output: Contenido → texto/formato listo para publicar
  ↓
Stage 3 (Analista)
  Output: Reporte → métricas vs KPIs, insights, recomendaciones
  ↓
Feedback → Estratega ajusta próximo brief
```

---

## Etapas del Pipeline

### Stage 1: Estratega (Agente 15)

**Rol:** Define qué contenido crear, cuándo y por qué.

**Input:** Objetivos de marketing, buyer persona, calendario editorial
**Output:** Brief estructurado con objetivo, audiencia, formato, tono, key messages, CTA, KPI

**Skills que carga:**
| Skill | Propósito |
|-------|-----------|
| `content-strategy` | Definir plan de contenido |
| `marketing-ideas` | Generar concepts y ángulos |
| `marketing-psychology` | Definir ángulo psicológico |
| `launch-strategy` | Planificar lanzamiento |
| `pricing-strategy` | Definir precios |
| `competitor-alternatives` | Analizar competencia |
| `seo-audit` | Diagnosticar SEO |

**MCPs:** `google-workspace` — briefs en Google Docs, research en Sheets

**Blindaje:**
- ✅ Prohibido redactar contenido final (es trabajo del Creador)
- ✅ Prohibido hacer análisis de métricas (es trabajo del Analista)
- ✅ Obligatorio referenciar Contexto/ y Marca/ antes de generar briefs

---

### Stage 2: Creador (Agente 16)

**Rol:** Toma los briefs del Estratega y produce contenido pulido, listo para publicación.

**Input:** Brief del Estratega (con objetivo, audiencia, tono, CTA, KPIs)
**Output:** Contenido completo en el formato solicitado

**Skills que carga:**
| Skill | Propósito |
|-------|-----------|
| `17_Content_Generation` | Redactar contenido estratégico |
| `social-content` | Crear contenido para redes |
| `copy-editing` | Pulir y editar copy |
| `copywriting` | Escribir copy persuasivo |
| `email-sequence` | Redactar secuencia de emails |
| `paid-ads` | Crear creatives para ads |
| `free-tool-strategy` | Crear lead magnets |

**MCPs:** `higgsfield` (imágenes), `heygen` (video avatar), `google-workspace` (borradores)

**Canales soportados:**
| Canal | Formato | Plantilla |
|-------|---------|-----------|
| YouTube | Script (hook → desarrollo → CTA) + descripción + tags + thumbnail brief | `youtube-script.md` |
| LinkedIn | Post (hook → story → insight → CTA) | `linkedin-post.md` |
| Newsletter | Email con asunto, preview text, cuerpo, CTA | `newsletter.md` |

**Blindaje:**
- ✅ Prohibido cambiar tono/ángulo/CTA del brief
- ✅ Prohibido publicar sin revisión
- ✅ Obligatorio usar plantillas de `06_Plantillas/`

---

### Stage 3: Analista (Agente 17)

**Rol:** Mide el rendimiento, extrae insights accionables, cierra el feedback loop.

**Input:** Contenido publicado + KPIs del brief original
**Output:** Reporte de rendimiento + recomendaciones para Estratega y Creador

**Skills que carga:**
| Skill | Propósito |
|-------|-----------|
| `analytics-tracking` | Revisar tracking implementado |
| `ab-test-setup` | Analizar resultados de test |
| `seo-audit` | Medir impacto SEO |
| `referral-program` | Analizar rendimiento de referidos |
| `content-strategy` | Recomendar ajustes estratégicos |
| `marketing-ideas` | Sugerir nuevos ángulos basados en datos |

**MCPs:** `google-workspace` — métricas en Sheets, reportes en Docs

**Blindaje:**
- ✅ Prohibido recomendar cambios sin datos
- ✅ Prohibido crear contenido nuevo
- ✅ Obligatorio comparar contra KPIs del brief original

---

### Orchestrator (Dream Team 06)

**Rol:** Coordina el pipeline. No ejecuta contenido — rutea al agente correcto.

**Input:** User request en lenguaje natural
**Output:** Pipeline ejecutado end-to-end

**Comportamiento:**
- Si el request es solo estrategia → short-circuit a Estratega
- Si el request es crear contenido → Estratega → Creador
- Si el request es campaña completa → Estratega → Creador → Analista → feedback

**Cómo invocarlo:**
```bash
"06: quiero una campaña completa para [tema]"
"Marketing Orchestrator: necesito contenido para LinkedIn sobre [tema]"
"06: orquesta el pipeline completo para el lanzamiento de [producto]"
```

---

## Cómo Usar

### Modo 1: Orchestrator (recomendado)

El Orchestrator decide automáticamente qué ruta tomar según tu request:

```bash
# Campaña completa → 15 → 16 → 17 → feedback
"06: orquesta campaña completa para promocionar el nuevo curso de marketing"

# Solo contenido → 15 → 16
"06: necesito un post de LinkedIn sobre IA generativa"

# Solo estrategia → 15
"06: quiero una estrategia de contenido para el Q3"
```

### Modo 2: Agente directo

Si sabés exactamente qué necesitás, podés llamar al agente directamente:

```bash
# Brief directamente al Estratega
"15: generame un brief para un video de YouTube sobre [tema]"

# Contenido directamente al Creador (requiere brief)
"16: tomá este brief y producí un post de LinkedIn"

# Análisis directamente al Analista (requiere contenido + KPIs)
"17: analizá el rendimiento de esta pieza"
```

### Modo 3: Pipeline LinkedIn (skill dedicado)

El skill `linkedin-content-flow` orquesta los 3 agentes para LinkedIn específicamente:

```bash
# Activar pipeline LinkedIn
"Pipeline linkedin para [tema]"
"Skill linkedin-content-flow: quiero un post sobre [tema]"
```

El skill ejecuta: Research (15) → Create (16) → Review (17) → Publish (output formateado)

### Modo 4: Usando CLAUDE.marketing.md

Si trabajás en un proyecto de marketing, copiá `CLAUDE.marketing.md` a la raíz del proyecto y personalizalo. Los comandos disponibles:

```bash
# Generar brief
"brief: quiero un post sobre [tema]"

# Pipeline completo
"campaign: lanzamiento de [producto] en LinkedIn"

# Publicar (con quality gates)
"publish: revisá y prepará este post para publicación"
```

### Ejemplos Completos

**Ejemplo 1: Post de LinkedIn**
```bash
Usuario: "06: necesito un post para LinkedIn sobre cómo usar IA en marketing"
Orchestrator → 15 Estratega genera brief
15 → 16 Creador produce post
16 → output: post listo con hook, story, insight, CTA
```

**Ejemplo 2: Campaña multicanal**
```bash
Usuario: "06: orquesta campaña completa para el lanzamiento de mi ebook"
Orchestrator → 15 Estratega: brief para 3 canales (YT, LI, NL)
15 → 16 Creador: produce script YT, post LI, newsletter
16 → 17 Analista: revisa calidad y prepara KPIs
17 → feedback loop con recomendaciones
```

---

## Referencia de Agentes

| # | Agente | Archivo | Fase | Trigger Keywords |
|---|--------|---------|------|-----------------|
| 15 | Marketing Estratega | `15_Marketing_Estratega.md` | Planificación | estrategia, brief, plan de contenido, calendario editorial, kpi, audiencia |
| 16 | Marketing Creador | `16_Marketing_Creador.md` | Ejecución | crear, escribir, producir, post, linkedin, youtube, newsletter, copy, guion |
| 17 | Marketing Analista | `17_Marketing_Analista.md` | Medición | analizar, métricas, reporte, rendimiento, optimizar, kpi, insights |
| 06 | Marketing Orchestrator | `01_Dream_Team/06_Marketing_Orchestrator.md` | Coordinación | campaña, marketing, lanzamiento, pipeline, orquestar |

### Pipeline visual

```
# ───── Estratega (15) ─────
Input:  Objetivos de marketing, buyer persona
Output: Brief (objetivo, audiencia, tono, CTA, KPIs)
Skills: content-strategy, marketing-ideas, competitor-alternatives, seo-audit
MCP:    google-workspace
Blindaje: No redactar contenido, no analizar métricas

    │
    ▼

# ───── Creador (16) ─────
Input:  Brief del Estratega
Output: Contenido listo para publicar (YT script / LI post / NL)
Skills: 17_Content_Generation, social-content, copywriting, paid-ads
MCP:    higgsfield, heygen, google-workspace
Blindaje: No cambiar brief, no publicar sin revisión

    │
    ▼

# ───── Analista (17) ─────
Input:  Contenido publicado + KPIs del brief
Output: Reporte de rendimiento + recomendaciones
Skills: analytics-tracking, ab-test-setup, seo-audit, content-strategy
MCP:    google-workspace
Blindaje: No recomendar sin datos, no crear contenido

    │
    ▼

# ───── Feedback Loop ─────
Analista → Estratega: ajustar briefs para próxima iteración
Analista → Creador: ajustar formato para próxima pieza
```

---

## Integración con MCPs

| MCP | Agente | Pipeline Stage | Propósito |
|-----|--------|---------------|-----------|
| `google-workspace` | 15 Estratega | Research | Brief docs, competitive research en Sheets |
| `higgsfield` | 16 Creador | Content | Generar imágenes para acompañar contenido |
| `heygen` | 16 Creador | Content | Producir videos con avatar |
| `google-workspace` | 16 Creador | Content | Redactar borradores en Google Docs |
| `google-workspace` | 17 Analista | Analysis | Métricas en Sheets, reportes en Docs |

> **Regla:** Máximo 3 MCPs por proyecto. Los 3 estratégicos para marketing son:
> `google-workspace` (docs/sheets), `higgsfield` (imágenes), `heygen` (video).

### Configuración de MCPs

Los MCPs se configuran en `.mcp.json` en la raíz del proyecto:

```json
{
  "mcpServers": {
    "google-workspace": { ... },
    "higgsfield": { ... },
    "heygen": { ... }
  }
}
```

Para verificar que están activos:
```bash
claude mcp list
```

---

## Validación del Pipeline

### Checklist de validación

Cada agente verifica estos puntos antes de pasar al siguiente stage:

**Stage 1→2 (Estratega → Creador):**
- [ ] Brief contiene: objetivo, audiencia, tono, CTA, KPIs
- [ ] Formato de brief sigue la plantilla estándar
- [ ] Canales cubiertos según necesidad (YT / LI / NL)
- [ ] KPIs son medibles y específicos

**Stage 2→3 (Creador → Analista):**
- [ ] Hook presente en primeras 2 líneas (LinkedIn)
- [ ] CTA claro y alineado con el brief
- [ ] Tono coincide con guía de marca
- [ ] Contenido alineado con objetivo y KPIs del brief
- [ ] Plantilla correcta según canal

**Stage 3→feedback (Analista → Estratega):**
- [ ] Datos vs KPIs del brief original
- [ ] Insights: qué funcionó, qué no, por qué
- [ ] Recomendaciones accionables (no solo datos)
- [ ] Feedback loop cerrado: recomendaciones para próximo ciclo

### Validación técnica

```bash
# 1. Verificar que los YAMLs de los agents son válidos
grep -r "^---" 15_Marketing_Estratega.md 16_Marketing_Creador.md 17_Marketing_Analista.md 01_Dream_Team/06_Marketing_Orchestrator.md

# 2. Verificar cross-references entre agents
grep -n "15_Marketing" 16_Marketing_Creador.md 17_Marketing_Analista.md
grep -n "16_Marketing" 15_Marketing_Estratega.md 17_Marketing_Analista.md  
grep -n "17_Marketing" 15_Marketing_Estratega.md 16_Marketing_Creador.md

# 3. Verificar que los skills referenciados existen
grep -oP '`[^`]+`' 15_Marketing_Estratega.md | grep -v "^/" | while read skill; do
  # cada skill debería tener un directorio o SKILL.md
done

# 4. Verificar mirror sync
diff -rq 01_Personal_Os/00_Core/02_Tools/01_Agents/ .agent/01_Agents/ | grep -v "Only in"

# 5. Verificar MCPs configurados
grep -E "google-workspace|higgsfield|heygen" .mcp.json
```

---

## Troubleshooting

### Problema: El agente no se activa con el trigger keyword
**Causa:** El trigger keyword no está en el YAML frontmatter del agente
**Solución:** Verificar `trigger_keywords:` en el archivo del agente. Agregar keywords si es necesario.

### Problema: El Estratega produce contenido en lugar de brief
**Causa:** No respeta el Operational Guard
**Solución:** Reforzar en el prompt: "Sos Estratega, solo generá briefs. No redactes contenido final."

### Problema: El Creador ignora el brief
**Causa:** Brief ambiguo o Creador mal configurado
**Solución:** Verificar que el brief tenga todos los campos requeridos. Si el brief es ambiguo, el Creador debe pedir clarificación.

### Problema: El Analista no encuentra datos de rendimiento
**Causa:** No hay tracking configurado
**Solución:** Usar skill `analytics-tracking` para configurar tracking antes de la campaña.

### Problema: Handoff no funciona (output no se pasa al siguiente agente)
**Causa:** El agente actual no formatea el output correctamente
**Solución:** Cada agente debe seguir el formato de output estándar (Brief/Contenido/Reporte).

---

## Referencias

### Archivos del Pipeline

| Recurso | Ubicación |
|---------|-----------|
| Marketing Orchestrator | `01_Dream_Team/06_Marketing_Orchestrator.md` |
| Marketing Estratega | `15_Marketing_Estratega.md` |
| Marketing Creador | `16_Marketing_Creador.md` |
| Marketing Analista | `17_Marketing_Analista.md` |
| CLAUDE.marketing.md template | `CLAUDE.marketing.md` (raíz) |
| LinkedIn Content Flow skill | `02_Skills/01_Creacion_Contenidos/14_Marketing_Tech/linkedin-content-flow/SKILL.md` |
| Research (RE + Learning) | `02_Knowledge/01_Research_Os/2026-06-25_RE_vINrPqUxnho.md` |
| Plan SOTA asociado | `01_Memory/00_Context_LLM/04_Docs/plans/2026-06-25-001-strat-learning-always-sota-plan.md` |

### Skills de Marketing

| Directorio | Contenido |
|------------|-----------|
| `13_Marketing_Strategy/` | Estrategia, ideas, psicología, lanzamiento, pricing |
| `14_Marketing_Tech/` | SEO, analytics, A/B testing, social, ads, referral, LinkedIn flow |

### Agentes relacionados

- `18_Workflow_Youtube.md` — Pipeline YouTube específico
- `19_Workflow_LinkedIn.md` — Pipeline LinkedIn específico
- `20_Workflow_Newsletter.md` — Pipeline Newsletter específico
- `03_Marketing_Tech.md` (Dream Team) — Perfil generalista de marketing técnico

### MCPs

| MCP | Config |
|-----|--------|
| `google-workspace` | `.mcp.json` → google-workspace |
| `higgsfield` | `.mcp.json` → higgsfield |
| `heygen` | `.mcp.json` → heygen |

---

> **Próximos pasos:** Implementar `/loop` para tareas recurrentes (reportes semanales, revisión de métricas). Refactorizar flujos de Zero Consequences como skills YAML con steps de agents.
>
> *PersonalOS v4.9 Consequences — 2026-06-25*
