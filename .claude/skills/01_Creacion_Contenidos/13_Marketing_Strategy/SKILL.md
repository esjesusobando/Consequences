---
name: marketing-strategy
description: >
  Estrategias de marketing — copywriting, CRO, pricing, lanzamientos,
  psicología de marketing. 15+ skills tácticas para ejecución. Triggers on:
  marketing strategy, copywriting, CRO optimization, pricing strategy, launch planning
---

# Marketing Strategy

> **Level**: Tactical — Execution

## Esencia Original

- **Metaskill**: Agrupar 15+ skills tácticas de marketing (copywriting, CRO, pricing, lanzamientos) en un solo punto de acceso, cubriendo todas las capas de ejecución estratégica.
- **Propósito original**: Centralizar el conocimiento disperso de marketing táctico para que cualquier estrategia pueda ejecutarse sin saltar entre herramientas — desde redactar copy hasta optimizar un pricing page, todo desde un mismo ecosistema.

## Sub-áreas

| Sub-área                    | Descripción                                     |
|----------------------------|------------------------------------------------|
| `content-strategy/`         | Estrategia de contenido                         |
| `copy-editing/`             | Edición y corrección de copy                    |
| `copywriting/`              | Redacción persuasiva                            |
| `email-sequence/`           | Secuencias de email marketing                   |
| `form-cro/`                 | Optimización de formularios                     |
| `launch-strategy/`          | Estrategias de lanzamiento                      |
| `marketing-ideas/`          | Generación de ideas de marketing                |
| `marketing-psychology/`     | Psicología aplicada al marketing                |
| `onboarding-cro/`           | Optimización de onboarding                      |
| `page-cro/`                 | Optimización de páginas                         |
| `paywall-upgrade-cro/`      | Optimización de paywalls                        |
| `popup-cro/`                | Optimización de popups                          |
| `pricing-strategy/`         | Estrategia de precios                           |
| `product-marketing-context/`| Contexto de marketing de producto               |
| `signup-flow-cro/`          | Optimización de flujos de registro              |

## Integración

Estas skills se usan junto con `19_Marketing_Tech/` para campañas completas: la estrategia define el QUÉ, la tecnología ejecuta el CÓMO.

---

## ⚠️ Gotchas

1. **Estrategia sin data de respaldo = adivinación**
   - **Por qué**: Las skills de copywriting y pricing pueden producir contenido persuasivo pero sin datos de mercado, competencia o audiencia, la estrategia carece de fundamento real.
   - **Solución**: Antes de ejecutar cualquier skill táctica, exigir un mínimo de research input (benchmark de competencia, datos de audiencia, métricas actuales). Si no hay data, la skill debe advertirlo y operar con defaults conservadores.

2. **Copywriting que convence pero no convierte**
   - **Por qué**: Las skills de copywriting optimizan para persuasión y storytelling, pero pueden descuidar elementos críticos de conversión (urgencia, escasez, prueba social, riesgo reverso).
   - **Solución**: Cada pieza de copy debe incluir al menos 2 de los 6 principios de Cialdini (reciprocidad, escasez, autoridad, consistencia, afinidad, consenso) validados explícitamente en el output.

3. **Pricing strategy desalineada con la percepción de valor**
   - **Por qué**: Las estrategias de pricing generadas pueden ser óptimas en teoría (cost-plus, competitor-based) pero ignorar la percepción de valor real del mercado objetivo.
   - **Solución**: Incluir siempre en el input de pricing strategy una sección de "Value Perception" que describa qué valora más la audiencia. La skill debe ajustar el pricing no solo al costo/competencia sino al valor percibido.

## 💾 State Persistence

Esta skill es un directorio de sub-skills tácticas — no mantiene estado propio. Cada sub-skill (copywriting, pricing, CRO, etc.) es stateless e independiente. El orquestador debe gestionar el contexto de la campaña (brief, datos de mercado, outputs previos) entre invocaciones de distintas sub-skills.
