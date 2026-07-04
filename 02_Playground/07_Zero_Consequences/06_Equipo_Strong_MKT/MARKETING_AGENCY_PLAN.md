# Marketing Agency — Plan de Construcción

> Sistema completo de agencia de marketing. 8 pipelines modulares.
> Tu pipeline Zero Consequences (audio→publicar) es el Pipeline 02 — intacto, referenciado.

---

## Arquitectura

```
.config/opencode/skills/gentleman/04_Compound/00_Marketing_Agency/
├── SKILL.md                         ← Orquestador central (entry point, routing, system map)
├── 01_Brand_Voice/
│   └── SKILL.md                     ← Setup: brand_voice.md + brand_design.md + voice audit
├── 02_Content_Creation/
│   └── SKILL.md                     ← REFERENCIA a Zero Consequences + Humanizador + Verificador
├── 03_Content_Strategy/
│   └── SKILL.md                     ← Research → pilares → calendario 30 días → repurpose
├── 04_SEO_AI_Visibility/
│   └── SKILL.md                     ← claude-seo-ai wrapper (21 módulos, doble score SEO+GEO)
├── 05_Paid_Ads/
│   └── SKILL.md                     ← market-ads wrapper (Google, Meta, LinkedIn, TikTok)
├── 06_Email_Marketing/
│   └── SKILL.md                     ← market-emails wrapper (6 tipos de secuencia)
├── 07_Analytics_Conversion/
│   └── SKILL.md                     ← GA4 + funnel + CRO + A/B testing + landing pages
└── 08_Competitive_Ops/
    └── SKILL.md                     ← Competidores + propuestas + reportes
```

---

## Los 8 Dominios de Agencia

| # | Dominio | Pipeline | Skills externos que referencia |
|---|---------|----------|-------------------------------|
| 01 | **Brand & Voice** | Setup → análisis → brand_voice.md + brand_design.md | `brand-voice-generator`, `market-brand`, `Design System AI` (07_JAO) |
| 02 | **Content Creation** | Audio→transcribe→redactar→**humanizar**→revisar→**verificar**→publicar→carrusel | **Zero Consequences pipeline** + `JAO Humanizador` + `JAO Verificador` |
| 03 | **Content Strategy** | Research→pilares→calendario→repurpose→distribución | `market-social` |
| 04 | **SEO & AI Visibility** | URL→auditar→diagnosticar→corregir→monitorear | `claude-seo-ai` (⭐⭐⭐⭐⭐, 21 módulos, SEO + GEO) |
| 05 | **Paid Ads** | Objetivo→research→copy→creative→lanzar→optimizar | `market-ads` (⭐⭐⭐⭐⭐, 5 plataformas + retargeting) |
| 06 | **Email Marketing** | Secuencia→copy→timing→enviar→medir | `market-emails` (⭐⭐⭐⭐⭐, 6 tipos + benchmarks) |
| 07 | **Analytics & Conversion** | Setup→track→reportar→optimizar→testear | `analytics-tracking`, `ab-test-setup`, `market-funnel`, `market-landing` |
| 08 | **Competitive & Ops** | Investigación→propuestas→reportes | `market-competitors`, `market-proposal`, `market-report` |

---

## Skills externos por módulo (overlaps resueltos)

| Competencia | Ganador | Razón |
|-------------|---------|-------|
| market-ads vs paid-ads | **market-ads** | Más completo: 5 plataformas, retargeting, budgets, benchmarks |
| claude-seo-ai vs seo-audit vs programmatic-seo | **claude-seo-ai** | 21 módulos, doble score SEO+GEO, offline-first, sin SEO myths |
| market-social vs social-content | **market-social** | Calendario 30 días, 8 fases, hooks, repurposing framework |
| market-brand vs brand-voice-generator | **Ambos** | brand-voice-generator para SETUP inicial, market-brand para AUDIT externo |
| brand-identity vs Design System AI | **Design System AI** | Más sofisticado: tokens YAML, meta.ts por componente, Mobbin MCP |
| content-creation (gentleman) | **Se omite** | Too genérico. Tu pipeline + market-copy lo superan |

---

## Pipeline 02 (Content Creation) — tu sistema actual, intacto

```
Pipeline actual:
  audio → transcribe.py → redactor → revisor → publicador → carrusel-designer

Con complementos (no tocan archivos existentes):
  redactor → [JAO Humanizador] → revisor → [JAO Verificador] → publicador
```

El módulo 02 no modifica nada de Zero Consequences. Solo referencia y añade calidad.

---

## Orden de construcción

| Paso | Módulo | Depende de | Tiempo est. | Estado |
|------|--------|-----------|-------------|--------|
| 1 | **01 Brand_Voice** | Nada (setup inicial) | ~30 min | ✅ Completo |
| 2 | **02 Content_Creation** | 01 (brand files) | ~20 min | ✅ Completo |
| 3 | **07 Analytics_Conversion** | Nada | ~30 min | ✅ Completo |
| 4 | **04 SEO_AI_Visibility** | Nada | ~30 min | ✅ Completo |
| 5 | **05 Paid_Ads** | Nada | ~30 min | ✅ Completo |
| 6 | **06 Email_Marketing** | Nada | ~30 min | ✅ Completo |
| 7 | **03 Content_Strategy** | 01, 02 (brand + content) | ~20 min | ✅ Completo |
| 8 | **08 Competitive_Ops** | Nada | ~20 min | ✅ Completo |
| 9 | **SKILL.md (Orquestador)** | Todos los anteriores | ~30 min | ✅ Completo |

Cada módulo se probó y validó con Judgment Day. 8/8 pipelines operativos.
- **18 archivos**: 9 SKILL.md (8 módulos + 1 orquestador), 8 SDD-DESIGN.md, 1 plan
- **Judgment Day**: Round 1 → ESCALATED (2 CRITICAL + WARNINGs). Round 2 → FIXED. Round 3 → APPROVED.
- **Path audit**: 43 referencias `01_Brand_Voice/brands/` verificadas con `../` correcto en pipelines 02-08

---

## Lo que NO cubre (para futuras iteraciones)

Estos servicios de agencia se añadirán como pipelines 09+ cuando toque:
- PR & Communications
- Influencer Marketing
- Video Production & YouTube Strategy
- Community Management
- Marketing Automation (workflows + CRM)
- Events & Webinars

---

*Plan v1.0 — 2026-07-04*
