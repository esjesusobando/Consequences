---
name: marketing-tech
description: >
  Tecnología de marketing — SEO, analytics, A/B testing, ads, esquemas
  estructurados. 10+ skills para el stack técnico de marketing. Triggers on:
  marketing technology, SEO tools, analytics setup, A/B testing, paid ads infrastructure
---

# Marketing Tech

> **Level**: Technical — Infrastructure

## Esencia Original

- **Metaskill**: Orquestar el stack técnico de marketing — SEO, analytics, A/B testing, ads, schema markup — como una infraestructura integrada y no como herramientas aisladas.
- **Propósito original**: Separar la capa tecnológica (el CÓMO) de la capa estratégica (el QUÉ), permitiendo que especialistas técnicos implementen tracking, auditorías SEO y ads sin mezclarlo con la estrategia de contenido o copy.

## Sub-áreas

| Sub-área                  | Descripción                                      |
|--------------------------|--------------------------------------------------|
| `ab-test-setup/`          | Configuración de A/B tests                        |
| `analytics-tracking/`     | Implementación de tracking y analytics            |
| `competitor-alternatives/`| Páginas de comparación con competidores           |
| `free-tool-strategy/`     | Estrategia de herramientas gratuitas              |
| `paid-ads/`              | Anuncios pagos (Google, Meta, LinkedIn)           |
| `programmatic-seo/`       | SEO programático a escala                         |
| `referral-program/`       | Programas de referidos                            |
| `schema-markup/`          | Marcado schema.org y datos estructurados          |
| `seo-audit/`             | Auditorías técnicas de SEO                        |
| `social-content/`         | Contenido para redes sociales                     |

## Integración

Usar con `18_Marketing_Strategy/` para campañas completas: la tecnología ejecuta lo que la estrategia define.

---

## ⚠️ Gotchas

1. **Analytics tracking sin QA previo genera datos basura**
   - **Por qué**: Implementar tracking (GA4, GTM) sin verificar que los eventos se disparen correctamente produce dashboards llenos de datos incorrectos que llevan a decisiones erróneas.
   - **Solución**: Después de implementar cualquier tracking, ejecutar una validación con GA4 DebugView o GTM Preview mode. Documentar los eventos esperados y comparar con los eventos reales recibidos.

2. **Schema markup con errores que matan rich snippets**
   - **Por qué**: Un error en schema markup (propiedad requerida faltante, valor inválido, tipo incorrecto) puede hacer que Google ignore completamente el marcado, perdiendo rich snippets sin aviso.
   - **Solución**: Siempre validar el schema generado con la herramienta Rich Results Test de Google antes de desplegar. Incluir un checklist de propiedades requeridas por tipo de schema.

3. **A/B tests que se detienen demasiado pronto**
   - **Por qué**: Las skills de A/B testing pueden recomendar un ganador basado en pocas conversiones (sesgo de muestra pequeña), llevando a decisiones estadísticamente inválidas que empeoran el rendimiento.
   - **Solución**: Exigir un tamaño muestral mínimo calculado (basado en baseline conversion rate y efecto mínimo detectable) antes de declarar un ganador. Incluir el cálculo en el output del test.

## 💾 State Persistence

Esta skill es un directorio de sub-skills técnicas — no mantiene estado propio. Cada sub-skill (analytics, schema, A/B testing, SEO) es stateless e independiente. El orquestador debe gestionar el estado de las implementaciones (tracking IDs, schemas desplegados, tests activos) entre invocaciones.
