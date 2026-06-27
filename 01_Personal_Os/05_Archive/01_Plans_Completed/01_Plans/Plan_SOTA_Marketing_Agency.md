> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# Plan SOTA Marketing Agency — v3.0

> **From:** Think_Different Personal OS (v6.1 Consequences)
> **Date:** 2026-06-08
> **Based on:** Lorena Bordonaba's Marketing AI Agents + JAO Skills Priority + Learning Always
> **Skills Prioritarias:** Entrevistador de Procesos, Humanizador, Optimizador de Prompts, Presentaciones Visuales, Superpowers, Verificador de Datos

---

## 0. Principios Rectores (Learning Always)

### Learning Always — Mejora Continua Integrada

Cada iteración del sistema debe:
1. **Documentar qué funcionó y qué no** → Knowledge Files actualizados
2. **Refinar prompts y contextos** → Optimizador de Prompts aplicado
3. **Validar calidad antes de entregar** → Verificador de Datos + Humanizador
4. **Capturar insights de cada ejecución** → Compound Learning automático
5. **Entrevistar antes de construir** → Entrevistador de Procesos como gate

### Skills JAO — Prioridad en el Flujo

| Skill | Cuándo se activa | Fase del Plan |
|-------|------------------|---------------|
| **Entrevistador de Procesos** | Antes de crear cualquier workflow nuevo | Todas las fases (gate) |
| **Superpowers** | Antes de construir sistemas complejos | Fases 1, 2, 3 |
| **Optimizador de Prompts** | Al crear/refinar prompts de agentes | Fases 1, 2 |
| **Humanizador** | Antes de publicar cualquier contenido | Fases 1, 2, 3 |
| **Verificador de Datos** | Antes de entregar al cliente | Fases 2, 3, 4 |
| **Presentaciones Visuales** | Para reportes y pitches | Fases 2, 3 |

---

## 1. Rescate de Contexto

### ✅ Lo que ya existe (desde sesión 2026-05-29)

**3 Agentes de Marketing:**
| # | Agente | Rol | Archivo |
|---|--------|-----|---------|
| 15 | Marketing Estratega | Planifica, genera briefs, define KPIs | `01_Agents/15_Marketing_Estratega.md` |
| 16 | Marketing Creador | Produce contenido multicanal | `01_Agents/16_Marketing_Creador.md` |
| 17 | Marketing Analista | Mide, analiza, recomienda | `01_Agents/17_Marketing_Analista.md` |

**3 Workflows Encadenados:**
| # | Workflow | Canales | Archivo |
|---|----------|---------|---------|
| 18 | YouTube Workflow | Script → Descripción → Tags → Thumbnail | `01_Agents/18_Workflow_Youtube.md` |
| 19 | LinkedIn Workflow | Post → Publicación → Análisis | `01_Agents/19_Workflow_LinkedIn.md` |
| 20 | Newsletter Workflow | Curación → Redacción → Envío | `01_Agents/20_Workflow_Newsletter.md` |

**2 Knowledge Files (Lorena Bordonaba):**
- `02_Knowledge/01_Research_Os/2026-05-29_RE_Marketing_AI_Agents.md` — Reverse Engineering completo
- `02_Knowledge/01_Research_Os/2026-05-29_Learning_Marketing_AI_Agents_Claude_Code.md` — Learning entry

**Design System:**
- `03_Resultado/00_Consequences-Design-System.html` — DS V1.0 (cyberpunk, tokens, componentes)
- `03_Resultado/02_Lorena-Bordonaba-Brand.html` — Brand System con Light/Dark mode

### ❌ Gaps identificados

| Dimensión | Estado | Qué falta | Skill JAO que lo resuelve |
|-----------|--------|-----------|---------------------------|
| Contexto de Marca | ⚠️ Vacío | `04_Contexto/` y `05_Marca/` tienen LEEME.md pero sin contenido real | **Entrevistador de Procesos** |
| Plantillas de contenido | ⚠️ Vacío | `06_Plantillas/` sin templates reales para YouTube/LinkedIn/Newsletter | **Optimizador de Prompts** |
| MCPs de marketing | ❌ No existen | Make, YouTube Data API, LinkedIn API, Mailchimp, analytics | **Superpowers** (planificar antes) |
| Pruebas con contenido real | ❌ Nunca probado | Los flujos no se han ejecutado con contenido real | **Verificador de Datos** |
| Dashboard/Reporting | ❌ No existe | Sin reportes de rendimiento ni dashboards de cliente | **Presentaciones Visuales** |
| Multi-tenant Brand | ❌ No existe | Cada cliente necesita su propio sistema de marca | **Entrevistador de Procesos** |
| SLA / Quality Gates | ❌ No existen | Sin criterios de calidad por agente ni por deliverable | **Verificador de Datos** |
| Pricing / Packaging |  No existe | Sin servicios definidos ni precios | **Entrevistador de Procesos** |
| Lead Gen / Pipeline | ❌ No existe | Sin workflow de adquisición de clientes | **Superpowers** |
| Orquestador Consolidado | ❌ No existe | Los agentes son standalone, no hay un orquestador automático | **Superpowers** |
| Contenido humanizado | ❌ No existe | Sin proceso de humanización pre-publicación | **Humanizador** |

---

## 2. Roadmap SOTA Marketing Agency

### Fase 1: Fundación (Semana 1) 🏗️
_El OS necesita contexto real para que los agentes produzcan contenido de calidad_

**Skills JAO activas:** Entrevistador de Procesos, Optimizador de Prompts, Humanizador

| # | Tarea | Archivos | Dependencia | Skill JAO |
|---|-------|----------|-------------|-----------|
| 1.1 | **Poblar Contexto de Marca** — Crear estrategia.md, buyer-persona.md, tono-de-voz.md | `04_Contexto/03_Contexto/` | — | **Entrevistador de Procesos** |
| 1.2 | **Poblar Marca** — Crear colores.md, tipografia.md, guia-visual.md | `05_Marca/04_Marca/` | — | **Entrevistador de Procesos** |
| 1.3 | **Crear Plantillas de Contenido** — youtube-script.md, linkedin-post.md, newsletter.md | `06_Plantillas/05_Plantillas/` | 1.1, 1.2 | **Optimizador de Prompts** |
| 1.4 | **Validar agentes** — Ejecutar flujo Estratega→Creador con contenido real (1 post LinkedIn, 1 newsletter) | Workflows 18-20 | 1.1, 1.2, 1.3 | **Humanizador** + **Verificador de Datos** |
| 1.5 | **Learning Entry** — Documentar qué funcionó, qué no, insights | `02_Knowledge/` | 1.4 | **Learning Always** |
| 1.6 | **Commit Fase 1** `feat: marketing agency foundation — brand context, templates, agent validation` | Todo lo anterior | 1.5 | — |

**Ubicación real:** `.agent/01_Agents/04_Contexto/` (no en raíz)

**Criterio de éxito:** Los 3 agentes pueden ejecutar un flujo completo sin errores y el output es publicable.

---

## 1b. Fase 1 — Detalle de Archivos (paths CORRECTOS)

```
.agent/01_Agents/04_Contexto/
├── 03_Contexto/
│   ├── 00_estrategia.md        ← Objetivos, KPIs, buyer persona
│   ├── 01_conocimiento.md       ← Conocimiento del negocio
│   └── 02_tono-de-voz.md        ← Guía de tono y estilo
│
.agent/01_Agents/05_Marca/
├── 04_Marca/
│   ├── 00_colores.md            ← Paleta (desde Consequences DS)
│   ├── 01_tipografia.md          ← Fonts stack
│   └── 02_guia-visual.md         ← Elementos visuales
│
.agent/01_Agents/06_Plantillas/
├── 05_Plantillas/
│   ├── youtube-script.md         ← Template VSL
│   ├── linkedin-post.md          ← Template post
│   └── newsletter.md             ← Template newsletter
```

> **NOTA:** Las carpetas `.agent/01_Agents/04_Contexto/`, `05_Marca/`, `06_Plantillas/` ya existen pero están VACÍAS (solo LEEME.md). Hay que popularlas.

---

### Fase 2: Operaciones (Semana 2) ⚙️
_Automatizar conexiones externas y agregar calidad_

**Skills JAO activas:** Verificador de Datos, Presentaciones Visuales, Humanizador, Superpowers

| # | Tarea | Archivos | Dependencia | Skill JAO |
|---|-------|----------|-------------|-----------|
| 2.1 | **Quality Gates por Agente** — Definir checklist de revisión para cada deliverable | `01_Agents/15-17` + `04_Contexto/` | Fase 1 | **Verificador de Datos** |
| 2.2 | **SLA Framework** — Tiempos de entrega por tipo de contenido + formato de brief mínimo | `04_Contexto/` | 2.1 | **Entrevistador de Procesos** |
| 2.3 | **MCPs Setup** — Investigar y configurar MCPs: Make, YouTube Data API, LinkedIn API | `03_MCPs/` | Fase 1 | **Superpowers** (planificar antes de construir) |
| 2.4 | **Dashboard de Métricas** — Template HTML para reportes de rendimiento (inspirado en Consequences DS) | `03_Resultado/` | Fase 1 | **Presentaciones Visuales** |
| 2.5 | **Automated Feedback Loop** — Analista → Estratega sin intervención humana | Workflow update | 2.3, 2.4 | **Learning Always** |
| 2.6 | **Learning Entry** — Documentar MCPs configurados, errores, soluciones | `02_Knowledge/` | 2.5 | **Learning Always** |
| 2.7 | **Commit Fase 2** `feat: marketing operations — MCPs, quality gates, feedback loop` | Todo lo anterior | 2.6 | — |

**Criterio de éxito:** El sistema puede producir, publicar y medir contenido de forma semi-autónoma.

---

### Fase 3: Escala (Semana 3-4) 🚀
_Multi-cliente, reporting, y adquisición_

**Skills JAO activas:** Entrevistador de Procesos, Superpowers, Presentaciones Visuales, Humanizador, Verificador de Datos

| # | Tarea | Archivos | Dependencia | Skill JAO |
|---|-------|----------|-------------|-----------|
| 3.1 | **Multi-tenant Brand System** — Estructura de carpetas por cliente con su propia marca/contexto | `Clientes/` estructura | Fase 2 | **Entrevistador de Procesos** |
| 3.2 | **Client Briefing Workflow** — Template de onboarding + kickoff | `Workflows/` | 3.1 | **Entrevistador de Procesos** |
| 3.3 | **Client Reporting** — Reporte automático semanal/mensual con métricas | Dashboard + Analista upgrade | 2.4, 2.5 | **Presentaciones Visuales** |
| 3.4 | **Pricing / Packaging** — 3 tiers definidos con deliverables, SLAs y precios | `04_Contexto/` | 2.2 | **Entrevistador de Procesos** |
| 3.5 | **Lead Gen Workflow** — Pipeline: detección → outreach → proposal → close | Workflow nuevo | 3.4 | **Superpowers** |
| 3.6 | **Orquestador Consolidado** — Un solo comando: `/agency [cliente] [tipo] [tema]` ejecuta el flujo completo | `01_Agents/21_Agency_Orchestrator.md` | 2.5, 3.1 | **Superpowers** |
| 3.7 | **Learning Entry** — Documentar multi-tenant patterns, errores de escala | `02_Knowledge/` | 3.6 | **Learning Always** |
| 3.8 | **Commit Fase 3** `feat: agency scale — multi-tenant, reporting, orchestrator, lead gen` | Todo lo anterior | 3.7 | — |

**Criterio de éxito:** La agencia puede gestionar 3+ clientes simultáneamente con reporting automatizado.

---

### Fase 4: SOTA (Semana 5+) 💎
_Excelencia operativa y diferenciación_

**Skills JAO activas:** Todas (especialmente Verificador de Datos + Learning Always)

| # | Tarea | Archivos | Dependencia | Skill JAO |
|---|-------|----------|-------------|-----------|
| 4.1 | **Agent Native Architecture** — Los agentes se auto-mejoran con cada iteración (compound learning) | Sistema completo | Fase 3 | **Learning Always** (automatizado) |
| 4.2 | **Design System Agency Edition** — Multi-brand DS con meta.ts contracts + feed triage | DS v2.0 | Fase 3 | **Presentaciones Visuales** |
| 4.3 | **A/B Testing Framework** — Tests automáticos de copies, hooks, CTAs | Workflow + Analista | 3.6 | **Verificador de Datos** |
| 4.4 | **Case Studies Engine** — Automatización de case studies desde resultados reales | Workflow nuevo | 3.3 | **Humanizador** |
| 4.5 | **AI Audit Layer** — Verificador de calidad antes de entregar al cliente | `03_Review/` | Fase 3 | **Verificador de Datos** |
| 4.6 | **Learning Entry** — Documentar patrones SOTA, architecture decisions | `02_Knowledge/` | 4.5 | **Learning Always** |
| 4.7 | **Commit Fase 4** `feat: sota marketing agency — ai audit, compound learning, design system v2` | Todo lo anterior | 4.6 | — |

**Criterio de éxito:** La agencia opera con mínima intervención humana y compoundea conocimiento.

---

## 3. Arquitectura Target

```
CLIENTE/
├── [Cliente]/
│   ├── 00_Brand/
│   │   ├── colores.md
│   │   ├── tipografia.md
│   │   ├── tono-de-voz.md
│   │   └── guia-visual.md
│   ├── 01_Context/
│   │   ├── estrategia.md
│   │   ├── buyer-persona.md
│   │   └── objetivos.md
│   ├── 02_Content/
│   │   ├── youtube/
│   │   ├── linkedin/
│   │   └── newsletter/
│   └── 03_Reports/
│       ├── weekly/
│       └── monthly/

AGENCIA/
├── 00_Operations/
│   ├── SLA.md
│   ├── quality-gates.md
│   └── pricing.md
├── 01_Pipeline/
│   ├── lead-tracking.md
│   └── onboarding.md
└── 02_Case_Studies/
    └── [cliente]/index.md

ORCHESTRATOR → /agency [cliente] [tipo] [tema]
  │
  ├── [ESTRATEGA] → brief
  ├── [CREADOR] → contenido
  ├── [REVISOR] → quality gate
  ├── [ANALISTA] → métricas
  └── [COMPOUND] → feedback → mejora
```

---

## 4. Principios SOTA (de la RE de Lorena + JAO Skills)

| Principio | Aplicación en el OS | Skill JAO |
|-----------|---------------------|-----------|
| **Context-Driven Generation** | La calidad del output depende de la calidad del contexto — poblar 04/05/06 es PRIORIDAD #1 | **Entrevistador de Procesos** |
| **Separation of Concerns** | Cada agente hace UNA cosa — ya implementado en v1.0 ✅ | — |
| **Chain of Agents** | Flujos > Agente monolítico — ya implementado en workflows ✅ | — |
| **Infrastructure as Context** | La estructura de carpetas ES el código — multi-cliente necesita estructura clara | **Superpowers** |
| **MCPs as System Boundaries** | Sin MCPs los agentes son solo generadores de texto — Fase 2 crítica | **Superpowers** |
| **Compound Learning** | Cada iteración mejora el sistema — Fase 4 lo automatiza | **Learning Always** |
| **Human-First Content** | Todo contenido pasa por humanización antes de publicar | **Humanizador** |
| **Verify Before Deliver** | Nada sale sin verificación de datos y calidad | **Verificador de Datos** |
| **Prompt Engineering** | Prompts de agentes se optimizan continuamente | **Optimizador de Prompts** |
| **Visual Communication** | Reportes y pitches con calidad visual profesional | **Presentaciones Visuales** |

---

## 5. Anti-Patrones a Evitar

| Anti-patrón | Riesgo | Mitigación | Skill JAO |
|-------------|--------|------------|-----------|
| Un solo agente para todo | Output genérico | Ya separado ✅ | — |
| Sin contexto de marca | Contenido sin personalidad | Fase 1 lo resuelve | **Entrevistador de Procesos** |
| MCPs sin probar | Automatización silenciosa | Probar cada MCP individualmente antes de integrar | **Superpowers** |
| Clientes sin estructura | Caos multi-tenant | Fase 3: estructura estricta por cliente | **Entrevistador de Procesos** |
| Entregar sin quality gate | Reputación dañada | Fase 2: quality gates por deliverable | **Verificador de Datos** |
| Publicar sin humanizar | Contenido robótico detectable | Pipeline: Creador → Humanizador → Verificador | **Humanizador** |
| Prompts sin optimizar | Output subóptimo de agentes | Revisión continua de prompts | **Optimizador de Prompts** |
| Construir sin planificar | Trabajo que hay que rehacer | **Superpowers** antes de construir | **Superpowers** |
| Sin documentar learnings | Perder conocimiento valioso | Learning Entry al final de cada fase | **Learning Always** |

---

## 6. Próximo Paso Inmediato

**FASE 1: Arrancar con Poblar Contexto de Marca**

```bash
# Prioridad absoluta — sin contexto los agentes dan contenido genérico
# Skill JAO activa: Entrevistador de Procesos (antes de construir)

04_Contexto/03_Contexto/
├── 00_estrategia.md        ← Objetivos, KPIs, buyer persona
├── 01_conocimiento.md       ← Conocimiento del negocio
── 02_tono-de-voz.md        ← Guía de tono y estilo

05_Marca/04_Marca/
├── 00_colores.md            ← Paleta (desde Consequences DS)
├── 01_tipografia.md          ← Fonts stack
└── 02_guia-visual.md         ← Elementos visuales

06_Plantillas/05_Plantillas/
├── youtube-script.md         ← Template VSL
├── linkedin-post.md          ← Template post
└── newsletter.md             ← Template newsletter
```

**Después de Fase 1:** Los agentes pueden producir contenido real.
**Después de Fase 2:** Pueden operar de forma semi-autónoma.
**Después de Fase 3:** Escala a multi-cliente.
**Después de Fase 4:** Alcanza SOTA con Learning Always automatizado.

---

*Plan v3.0 — Generated 2026-06-08 | Think Different PersonalOS v6.1 Consequences | JAO Skills Priority + Learning Always*
