# Plan de Upgrade — Equipo Strong MKT a Nivel Silicon Valley

**Fecha:** 2026-07-05
**Baseline:** 5.8/10 → **Target:** 7.5/10
**Perfiles prioritarios:** 12 de 19

---

## Prioridad CRÍTICA (Refactor inmediato)

### 1. Trásea Peto — SEO (Score 4 → Target 8)
**Problema:** SEO de 2019. Sin AI-search visibility, GEO/AEO, entity SEO, EEAT, Schema.org moderno.

**Upgrade requerido:**
- Añadir módulo **AI-Search / GEO** completo:
  - `llms.txt` generation + validation
  - AI crawler access control (GPTBot, PerplexityBot, ClaudeBot, etc.)
  - Entity SEO + Knowledge Graph (Wikidata, schema.org Person/Organization)
  - Answer Engine Optimization (AEO) — featured snippets, People Also Ask
  - GEO audit: citability, fact density, extractability
- Stack: `claude-seo-ai` (21 módulos), `schema-markup`, `seo-audit`, `programmatic-seo`
- Añadir: Core Web Vitals monitoring, Lighthouse CI
- Métricas: AI visibility score, SEO score, citability rate

**Entregable:** SKILL.md con 5 sub-skills + checklist de auditoría AI-search

---

### 2. Posidonio de Apamea — Analista Datos (Score 5 → Target 8)
**Problema:** Conceptual. No menciona SQL, Python, Looker, BigQuery, GA4, atribución.

**Upgrade requerido:**
- Stack obligatorio: **SQL** (PostgreSQL/BigQuery) + **Python** (pandas, polars, duckdb) + **Looker Studio** / **Metabase** / **Tableau**
- Añadir: dbt para transformaciones, Airflow/Prefect para orquestación
- GA4 + BigQuery export — modelos de atribución (data-driven, Markov)
- Cohort analysis, retention curves, LTV modeling
- A/B testing statistics (frequentist + Bayesian)
- Dashboards: North Star + leading/lagging indicators

**Entregable:** SKILL.md con stack técnico + plantillas de dashboards + queries SQL de referencia

---

### 3. Lucio Anneo Cornuto — Desarrollo Web & UX (Score 5 → Target 8)
**Problema:** Sin stack técnico. En 2026: Next.js 15, React 19, Tailwind v4, Framer Motion, shadcn/ui.

**Upgrade requerido:**
- Stack: **Next.js 15 App Router** + **React 19** + **Tailwind v4** + **TypeScript strict**
- Componentes: shadcn/ui + Radix UI + Framer Motion 12
- Performance: `next/image`, `@vercel/og`, ISR, streaming, RSC
- A11y: axe-core, jest-axe, WCAG 2.2 AA
- Testing: Vitest + Playwright + @testing-library/react
- Design tokens: Style Dictionary / Figma Tokens → CSS variables
- Storybook para component library

**Entregable:** SKILL.md con stack + plantillas de componentes + checklist performance

---

## Prioridad ALTA (Upgrade con stack)

### 4. Papirio Fabiano — Social Media (Score 5 → Target 7)
**Upgrade:** Meta Business Suite API, LinkedIn API, X/Twitter API v2, TikTok API
- Herramientas: Buffer/Hootsuite/Later + n8n para automatización
- Formatos: Reels, Shorts, Carousels, Threads, LinkedIn Articles
- Métricas: Engagement rate, reach, virality coefficient, UGC tracking
- Crisis management playbook

### 5. Junio Rústico — Customer Success (Score 5 → Target 7)
**Upgrade:** Intercom/HubSpot/Zendesk + Product Analytics (Mixpanel/Amplitude)
- Métricas: NPS, CSAT, CES, NRR, GRR, churn prediction
- Playbooks: Onboarding, adoption, expansion, renewal, win-back
- Health scoring: product usage + engagement + support tickets
- Community-led growth

### 6. Helvidio Prisco — PR & Alianzas (Score 5 → Target 7)
**Upgrade:** Cision/Meltwater/Muck Rack + HARO + LinkedIn Sales Navigator
- Framework: Newsjacking, data-driven stories, founder-led PR
- Alianzas: co-marketing, integrations, affiliate, channel partners
- Medición: Share of Voice, sentiment, tier-1 coverage, backlink quality

### 7. Marco Anneo Lucano — Multimedia (Score 5 → Target 7)
**Upgrade:** Premiere Pro / DaVinci Resolve + After Effects / Rive / Lottie
- Formatos: Short-form (Reels/TikTok/Shorts), Long-form (YouTube), Live streaming
- Pipeline: Shot list → Edit → Color → Sound → Subtitles → Export (multi-ratio)
- Motion: Rive/Lottie para web, Framer Motion handoff
- Asset management: Frame.io, Figma

---

## Prioridad MEDIA (Profundizar metodología)

### 8. Catón el Joven — Project Manager (Score 6 → Target 8)
**Upgrade:** Metodologías: Scrum/Kanban/Shape Up + Linear/Jira/Notion
- Artefactos: PRD, RFC, sprint planning, retro, release notes
- Métricas: Cycle time, lead time, throughput, WIP limits
- Stakeholder management: RACI, decision logs, risk register

### 9. Quinto Sextio — CRM & Automatización (Score 6 → Target 8)
**Upgrade:** HubSpot/Salesforce/Pipedrive + n8n/Make/Zapier + Custom webhooks
- Lead scoring: demographic + behavioral + firmographic
- Flujos: MQL → SQL → Opportunity → Customer → Advocate
- Data hygiene: deduplication, enrichment (Clearbit/Apollo), GDPR

### 10. Musonio Rufo — Consultor BMS (Score 6 → Target 8)
**Upgrade:** BPMN 2.0 + Camunda/Zeebe + Process Mining (Celonis/ProcessGold)
- Metodología: Discover → Design → Simulate → Deploy → Monitor → Optimize
- KPIs: Cycle time, throughput, error rate, automation rate
- Change management: ADKAR, stakeholder maps

### 11. Panecio de Rodas — Research Analyst (Score 6 → Target 8)
**Upgrade:** Fuentes: Gartner/Forrester/IDC + Crunchbase/PitchBook + Similarweb/Semrush + Reddit/Twitter API
- Metodología: Jobs-to-be-Done, Conjoint analysis, MaxDiff, Van Westendorp
- Síntesis: Affinity mapping, KJ method, Opportunity solution tree
- Entregables: Battlecards, TAM/SAM/SOM, Competitive landscape

### 12. Eufrates de Tiro — Growth / Experimentación (Score 6 → Target 8)
**Upgrade:** Stats: Frequentist + Bayesian + Sequential testing
- Stack: PostHog/Amplitude + Statsig/GrowthBook + SQL
- Framework: ICE/RICE + Hypothesis backlog + Experiment log
- Guardrails: Sample ratio mismatch, peeking, multiple comparisons

---

## Plan de Acción — Cronograma

| Semana | Foco | Entregable |
|--------|------|------------|
| **1** | Trásea Peto (SEO) + Posidonio (Data) | 2 SKILL.md refactorizados |
| **2** | Lucio Anneo Cornuto (Web/UX) + Papirio Fabiano (Social) | 2 SKILL.md refactorizados |
| **3** | Junio Rústico (CS) + Helvidio Prisco (PR) + Marco Anneo Lucano (Multimedia) | 3 SKILL.md refactorizados |
| **4** | Catón + Quinto Sextio + Musonio + Panecio + Eufrates | 5 SKILL.md profundizados |
| **5** | Testing + Integración + Judgment Day | Validación completa |

**Total: ~5 semanas, 12 SKILL.md actualizados**

---

## Verificación de Calidad — Judgment Day por Perfil

Cada SKILL.md actualizado debe pasar:
1. **Profundidad técnica:** Herramientas + versiones + comandos concretos
2. **Metodología:** Procesos paso a paso, no solo conceptos
3. **Diferenciación:** Al menos 1 "secret sauce" único
4. **Benchmarks:** Métricas de éxito con rangos SV
5. **Límites claros:** Qué NO hace (anti-overlap con otros roles)

---

## Métricas de Éxito Post-Upgrade

| KPI | Baseline | Target |
|-----|----------|--------|
| Overall team score | 5.8 | **7.5** |
| % SOTA ready | 37% | **74%** |
| Perfiles con stack técnico | 7/19 | **19/19** |
| Cobertura segmentos core | 8/10 | **10/10** |
| Judgment Day pass rate | 0/19 | **19/19** |

---

## Roles Faltantes (Para iteración futura)

| Rol | Por qué |
|-----|---------|
| **Email Marketing Specialist** | Secuencias, ESPs, deliverability, lifecycle |
| **Marketing Analytics Engineer** | Data warehouse, modeling, BI — dedicado |
| **Video/YouTube Strategist** | Long-form, SEO de video, monetización |
| **Influencer/Creator Partnerships** | Economy de creadores, UGC, affiliate |
| **Events/Webinars** | Demand gen, pipeline acceleration |

---

*Generado: 2026-07-05 — Diagnóstico basado en análisis de 19 SKILL.md*