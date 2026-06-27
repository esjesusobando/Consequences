---
title: "Estructura del Conocimiento Organizacional — 6 Categorías"
status: "accepted"
date: "2026-06-27"
deciders: ["Fundador"]
tags: [conocimiento, estructura, categorias, taxonomia]
---

# ADR-002: Estructura del Conocimiento Organizacional — 6 Categorías

## Context
Al crear la capa compartida del Capital Token (`10_Shared_Org/`), necesitábamos una taxonomía que permitiera:

- Organizar el conocimiento organizacional de forma intuitiva
- Que cualquier LLM pudiera navegarlo sin configuraciones especiales
- Separar claramente tipos de contenido (procesos operativos vs estratégicos vs configuraciones)
- Escalar de 1 documento a 100+ sin reestructurar
- Alinearse con cómo los humanos clasifican naturalmente la información

El riesgo era caer en una estructura sobreingenierizada (demasiadas categorías) o en un solo directorio plano que fuera imposible de navegar.

## Decision
Se adoptan **6 categorías fijas**, cada una con un propósito claramente diferenciado:

| Categoría | Propósito | Ejemplo |
|-----------|-----------|---------|
| `playbooks/` | Procesos estratégicos repetitivos — cómo se hacen las cosas | Onboarding de cliente, producción de contenido |
| `processes/` | SOPs operativos — tareas del día a día | Reporte semanal, kickoff de proyecto |
| `decisions/` | ADRs — por qué se tomaron las decisiones | Arquitectura híbrida, estructura de conocimiento |
| `agents/` | Templates de agentes por rol | Admin Agent, Finance Agent, HR Agent |
| `context/` | Contexto compartido que cargan todos los agentes | Organización, stack tecnológico, equipo |
| `metrics/` | Tracking de salud del Capital Token | Dashboard, cobertura, objetivos |

## Alternatives Considered

### Option 1: Directorio plano (sin categorías)
- **Pros:** Máxima simplicidad, sin decisión taxonómica que tomar
- **Cons:** Con 20+ archivos ya es difícil de navegar; los LLMs no tienen jerarquía para priorizar qué cargar; mezcla estratégico con operativo

### Option 2: Taxonomía jerárquica profunda (subcategorías anidadas)
- **Pros:** Máxima precisión semántica, cubre todos los bordes
- **Cons:** Complejidad innecesaria para el volumen actual (< 50 archivos); los humanos se pierden en subcategorías; los LLMs tienen context window limitado y necesitan encontrar rápido

### Option 3: 6 categorías fijas + archivos sueltos en cada una (Elegida)
- **Pros:** Suficientemente granular para 100+ archivos, lo suficientemente simple para empezar con 5. Cada categoría tiene un propósito único y no ambigüo. Los LLMs pueden cargar `index` de una categoría sabiendo qué esperar.
- **Cons:** Algún archivo podría pertenecer a dos categorías (ej. un proceso que también es decisión). Para esos casos, usar el criterio "dónde vive la mayor parte del contenido".

## Rationale
La estructura de 6 categorías surgió de observar los tipos de conocimiento que ya existían en el sistema. No se inventó una taxonomía teórica — se identificaron los 6 contenedores naturales que cubrían todo el conocimiento organizacional existente. Cada categoría tiene un tipo de archivo y formato asociado: los playbooks siguen un template con inputs/outputs y pasos; los SOPs son más operativos con checklist; los ADRs siguen el formato yaledecisiones con contexto y alternativas.

Se optó por nombres en inglés (playbooks, decisions, etc.) por consistencia con el sistema operativo base (Think_Different usa inglés para naming de directorios), pero el contenido interno está en español (Rioplatense).

## Consequences
- **Positivas:** Estructura clara y escalable; los LLMs pueden navegar por categoría; los humanos encuentran rápido lo que buscan; templates específicos por categoría.
- **Negativas:** Algún archivo híbrido puede caer en la categoría incorrecta; requiere disciplina al crear contenido nuevo; la decisión de ponerlo en inglés (nombres de directorio) vs español (contenido) puede confundir al principio.

## Compliance
- [x] Estructura de 6 categorías implementada en `10_Shared_Org/`
- [x] README por categoría con tabla de contenido
- [x] Templates por categoría (playbook, ADR, SOP)
- [ ] Guía de contribución que explique a qué categoría va cada tipo de contenido
- [ ] Revisión trimestral de la taxonomía para validar que sigue funcionando
