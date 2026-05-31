# 🧠 OS Conductor — El Cerebro del PersonalOS

**Versión Skill:** 2.0.0 (2026-05-28)
**Harness:** Anthropic 2.0 — Sprint Contract · Evaluator Pattern · Context Management
**Reemplaza a:** `00_Orchestrator.md` (v4.0, mantenido como referencia histórica)

---

## ¿Qué es el OS Conductor?

El **punto de entrada único** al Think Different PersonalOS v4.9. En vez de tener que saber qué skill usar o qué agente invocar, le decís lo que necesitás y el Conductor se encarga de orquestar todo.

**No ejecuta tareas especializadas.** Orquesta a los que sí lo hacen usando el patrón **Generator + Evaluator** de Anthropic 2.0: cada skill genera en su dominio, el Conductor evalúa que se cumpla el contrato.

---

## ¿Cómo se usa?

Simple: hablale al agente como le hablarías a un asistente. El Conductor:
1. Escucha tu request
2. Te propone un **Sprint Contract** (¿qué significa "done"?)
3. Acuerdan criterios
4. Orquesta las skills necesarias
5. Verifica resultados contra lo acordado

**Ejemplos:**

| Decís... | El Conductor hace... |
|----------|---------------------|
| "Necesito un post para LinkedIn sobre AI Agents" | Sprint Contract → Content Transformer + Carousel Master → verifica |
| "Quiero lanzar un producto nuevo" | Sprint Contract → pipeline completo: brand → diseño → assets → video → ads |
| "Auditame el OS" | Invoca System Core + Skill Auditor, devuelve diagnóstico |
| "Automatizá la extracción de datos de X" | Sprint Contract → Firecrawl + N8N Workflows → verifica |
| "Diseñame un prototipo de app" | Sprint Contract → Huashu Design + Dumbledor Design → verifica |

No necesitás acordarte de skills, agentes, ni paths. El Conductor conoce todo el mapa.

---

## ¿Qué lo hace diferente del Orchestrator v4.0?

| Aspecto | Orchestrator v4.0 (legacy) | OS Conductor v2.0 |
|---------|---------------------------|-------------------|
| **Entry point** | Múltiples entry points | **UN entry point** |
| **Delegación** | Sin mecanismo definido | Protocolo explícito via `skill()` + contexto |
| **Calidad** | Sin verificación | Sprint Contract + Evaluator Pattern |
| **Triggers** | Genéricos | Específicos + cubren todo el OS |
| **Flujos** | 4 fijos | Predefinidos + **Ad-Hoc Flow Construction** |
| **Contexto** | Sin gestión | Context Management proactivo |
| **Fallback** | Sin retry | Retry + escalado con diagnóstico |
| **Auto-referencia** | Posible loop | Regla de auto-exclusión |
| **Métrica** | Sin métricas | Pass@k: Routing Accuracy, Flow Completion |

---

## ¿Qué puede hacer?

### ✅ Áreas que orquesta

| Área | Lo que incluye |
|------|----------------|
| Creación de Contenidos | Brand voice, blogs, carruseles, scripts YouTube, thumbnails, SEO, marketing |
| Diseño UI/UX | Prototipos HTML, diseño visual, design tokens, diagramas, identidad de marca |
| Video & Media | Remotion, análisis de video, prompts para generación |
| Automatización | N8N workflows, Firecrawl scraping, Google Workspace, pipelines ETL |
| Workflows & PM | Gestión de proyectos, orquestación multi-agente, LFG autónomo |
| Tools & Dev | Creación de skills, testing, DevOps, performance, data analysis |
| Personal OS | Life OS, productividad diaria, captura rápida |
| Web | Superpowers de búsqueda, Playwright automation |
| Publicidad | Campañas de ads |
| Auditoría | Validación de calidad de skills y salud del OS |

### ✅ Flujos compuestos predefinidos (+ ad-hoc)
- Lanzamiento de producto/campaña
- Contenido integral (idea → multi-canal)
- Automatización (scraping → deploy)
- Desarrollo SDD completo (init → archive)
- **Ad-Hoc Flow Construction** para combinaciones no previstas

### ✅ 67 agentes especializados integrados
Core (23) + Dream Team (5) + Specialists (23) + Growth (5) + OpenCode (11)

---

## ¿Qué NO hace?

- **No ejecuta código** de implementación — eso lo hacen las skills
- **No reemplaza el juicio humano** — el Sprint Contract lo negocia con vos
- **No se auto-invoca** — regla de auto-exclusión para evitar loops
- **No edita archivos** fuera del ciclo de verificación

---

## Filosofía de diseño

1. **UN entry point** — siempre entrás por el Conductor
2. **Delegación, no ejecución** — el Conductor conoce el mapa, las skills ejecutan
3. **Contrato antes de ejecución** (Sprint Contract) — se acuerda "done" antes de arrancar
4. **Generator + Evaluator** — las skills generan, el Conductor evalúa
5. **Auto-exclusión** — el Conductor nunca se selecciona a sí mismo
6. **Flujo mínimo** — la menor cantidad de skills necesarias
7. **Verificación siempre** — cerrar el ciclo preguntando si el resultado sirve

---

## Archivos

| Archivo | Qué es |
|---------|--------|
| `SKILL.md` | Instrucciones para el agente (Anthropic 2.0 Harness) |
| `registry.md` | Mapa completo de skills (source of truth) |
| `README.md` | Esta documentación humana |
| `references/compound-flows.md` | Detalle de flujos compuestos |
| `references/sprint-contract.md` | Template de Sprint Contract |

---

## Contexto de creación

El OS Conductor nace de la **Auditoría Completa v4.9** (2026-05-28) y fue refinado mediante **Judgment Day** (revisión adversarial dual). Incorpora los patrones de **Anthropic 2.0 Harness**: Sprint Contract, Evaluator Pattern, Context Management y Pass@k Metrics.

Versión 1.0 → 2.0: upgrade completo basado en hallazgos de la revisión adversarial.

---

*PersonalOS v4.9 Consequences — Anthropic 2.0 Harness — 2026-05-28*
