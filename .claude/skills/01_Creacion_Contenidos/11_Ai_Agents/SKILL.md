---
name: ai-agents-marketing
description: >
  Agentes AI especializados para marketing y contenidos — onboarding,
  executive assistant, head of marketing, y más. Skills para delegar
  tareas de marketing a agentes especializados. Triggers on: marketing AI agents,
  agent delegation, marketing automation, AI onboarding, executive marketing assistant
---

# AI Agents para Marketing

> **Level**: Advanced — Agent Orchestration

## Esencia Original

- **Metaskill**: Proveer un directorio de agentes AI especializados en marketing, cada uno con contexto, reglas y output propio, listos para ser delegados desde un orquestador central.
- **Propósito original**: Permitir que tareas complejas de marketing (onboarding, estrategia, ejecución) se deleguen a agentes con expertise enfocado, evitando que un solo agente genérico tenga que saber de todo y diluya la calidad.

## Sub-áreas

| Sub-área                      | Descripción                                       |
|------------------------------|--------------------------------------------------|
| `01_Agent_Onboarding/`        | Onboarding de nuevos agentes de marketing         |
| `02_Executive_Assistant/`     | Asistente ejecutivo con frameworks de prioridad   |
| `03_Head_Of_Marketing/`       | Estrategias de marketing, GTM, competencia        |

## Propósito

Estos agentes son especialistas autónomos que ejecutan tareas específicas de marketing. Cada uno tiene su propio contexto, reglas y output esperado. Se invocan desde el orquestador cuando la tarea requiere experiencia de marketing especializada.

---

## ⚠️ Gotchas

1. **Agentes que alucinan capacidades que no tienen**
   - **Por qué**: Cuando un agente recibe una tarea ligeramente fuera de su dominio, intenta resolverla en lugar de rechazarla, produciendo outputs de baja calidad que contaminan el pipeline de marketing.
   - **Solución**: Cada agente debe incluir en su SKILL.md una sección explícita de "Fuera de alcance" que liste tareas que debe delegar o rechazar. El orquestador debe validar contra esta lista antes de delegar.

2. **Contaminación de contexto entre agentes**
   - **Por qué**: Al ejecutar múltiples agentes en secuencia, el contexto de uno puede filtrarse al siguiente si el orquestador no limpia el estado entre invocaciones.
   - **Solución**: El orquestador debe pasar solo el output relevante del agente anterior como input del siguiente, nunca el contexto completo de la sesión.

3. **Sin fallback cuando un agente falla**
   - **Por qué**: Si un agente especializado falla (timeout, error, output inválido), no hay un mecanismo de respaldo, deteniendo todo el pipeline de marketing.
   - **Solución**: Implementar un agente "genérico de respaldo" para cada categoría (conocimientos generales de marketing) que pueda producir un output aceptable si el especialista falla.

## 💾 State Persistence

Esta skill es un directorio — no mantiene estado propio. El estado de ejecución (qué agentes se invocaron, qué outputs produjeron) es responsabilidad del orquestador. Cada sub-agente en las sub-áreas es independiente y debe ser tratado como una skill stateless individual.
