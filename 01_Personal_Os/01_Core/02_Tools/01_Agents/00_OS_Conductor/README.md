# 🧠 OS Conductor — El Cerebro del PersonalOS

**Versión:** 1.0 (2026-05-28)
**Reemplaza a:** `00_Orchestrator.md` (v4.0)

---

## ¿Qué es esto?

El OS Conductor es el **punto de entrada único** al Think Different PersonalOS v4.8. En vez de tener que saber qué skill usar o qué agente invocar, le decís lo que necesitás y el Conductor se encarga de orquestar todo.

**No ejecuta tareas especializadas.** Orquesta a los que sí lo hacen.

---

## ¿Cómo se usa?

Simple: hablale al agente como le hablarías a un asistente.

**Ejemplos:**

| Decís... | El Conductor hace... |
|----------|---------------------|
| "Necesito un post para LinkedIn sobre AI Agents" | Busca la skill de Content Transformer + Carousel Master, orquesta el flujo |
| "Quiero lanzar un producto nuevo" | Arma el pipeline completo: brand voice → diseño → assets → video → ads |
| "Auditame el OS" | Invoca System Core + Skill Auditor, devuelve diagnóstico |
| "Automatizá la extracción de datos de X" | Rutear a Firecrawl + N8N Workflows |
| "Diseñame un prototipo de app" | Rutear a Huashu Design + Dumbledor Design |
| "Qué skills tengo para video" | Consulta el registry y devuelve las que matchean |

No necesitás acordarte de skills, agentes, ni paths. El Conductor conoce todo el mapa.

---

## ¿Qué puede hacer?

### ✅ Áreas que cubre

| Área | Lo que orquesta |
|------|----------------|
| Creación de Contenidos | Brand voice, blogs, carruseles, scripts YouTube, thumbnails, SEO, marketing |
| Diseño UI/UX | Prototipos HTML, diseño visual, design tokens, diagramas, identidad de marca |
| Video & Media | Remotion, análisis de video, prompts para generación |
| Automatización | N8N workflows, Firecrawl scraping, Google Workspace, pipelines ETL |
| Workflows | Gestión de proyectos, orquestación multi-agente, LFG autónomo |
| Tools & Dev | Creación de skills, testing, DevOps, performance, data analysis |
| Personal OS | Life OS, productividad diaria, captura rápida |
| Web | Superpowers de búsqueda, Playwright automation |
| Publicidad | Campañas de ads |
| Auditoría | Validación de calidad de skills y salud del OS |

### ✅ Flujos compuestos

Para tareas que cruzan múltiples áreas (lanzamientos, contenido integral, automatizaciones complejas), el Conductor tiene pipelines predefinidos que encadenan skills en el orden óptimo.

### ✅ Integración con 47+ agentes especializados

El Conductor conoce todos los agentes: desde el Dream Team (Product Builder, Data Engineer, etc.) hasta los Growth agents (Content Transformer, YouTube Script, etc.) y los 24 Specialists de Compound Engineering.

---

## ¿Qué NO puede hacer?

- **No ejecuta código** de implementación — eso lo hacen las skills especializadas
- **No reemplaza el juicio humano** — siempre verifica resultados con vos
- **No es un IDE** — no edita archivos directamente (salvo que la skill lo requiera)

---

## Filosofía de diseño

1. **UN entry point.** No importa si querés crear contenido, diseñar un prototipo, automatizar un workflow, o auditar el sistema — siempre empezás por el Conductor.

2. **Delegación, no ejecución.** El Conductor conoce el mapa completo del OS y sabe qué skill o agente es el mejor para cada tarea. No intenta hacerlo todo él mismo.

3. **Contexto completo.** Mientras que las skills individuales solo conocen su dominio, el Conductor sabe de TODO el OS. Puede rutear requests complejas que cruzan múltiples áreas.

4. **Flujo mínimo.** Usa la menor cantidad de skills necesarias. No sobreingeniería.

5. **Verificación siempre.** Después de cada orquestación, pregunta si el resultado cumple.

---

## Archivos en este directorio

| Archivo | Qué es |
|---------|--------|
| `SKILL.md` | Instrucciones para el agente (triggers, workflow, protocolo de ruteo) |
| `registry.md` | Mapa completo de todas las skills del OS (source of truth) |
| `README.md` | Esta documentación humana |

---

## Contexto de creación

El OS Conductor nace de la **Auditoría Completa v4.8** (2026-05-28), que identificó que el viejo Orchestrator v4.0 estaba desactualizado y no reflejaba la arquitectura actual del PersonalOS con sus 12 áreas de skills y 47+ agentes.

En vez de actualizar el viejo orchestrator, se diseñó desde cero un **Agente Integral del OS** con:
- Visibilidad completa de todas las áreas
- Protocolo de ruteo explícito
- Flujos compuestos predefinidos
- Integración con el ecosistema de agentes

---

*PersonalOS v4.8 Consequences — 2026-05-28*
