---
title: "Capital Token — Option C Híbrido"
status: "accepted"
date: "2026-06-27"
deciders: ["Usuario (fundador)"]
tags: [capital-token, arquitectura, decision]
---

# ADR-001: Capital Token — Arquitectura Híbrida

## Context
El sistema Personal OS había crecido orgánicamente. Con la necesidad de compartir conocimiento organizacional con el equipo (admin, finanzas, RH, marketing), se necesitaba una estrategia de Capital Token que permitiera:
- Preservar el conocimiento institucional
- Hacerlo accesible a todo el equipo
- Mantenerlo LLM-agnóstico
- No duplicar infraestructura existente

## Decision
Se adopta la **Opción C: Híbrido** — mantener Think_Different como core del sistema, agregando una capa compartida (`10_Shared_Org/`) para conocimiento organizacional.

## Alternatives Considered

### Option A: Extender Personal OS
- **Pros:** Sin duplicación, aprovecha todo lo existente (392 skills, 63 agents, 30 HUBs, Engram)
- **Cons:** Mezcla lo personal con lo organizacional, difícil de compartir con no-técnicos

### Option B: LLM Wiki Independiente
- **Pros:** Separación clara, fácil de compartir
- **Cons:** Duplica esfuerzo, otro sistema que mantener, pierde integración con skills/agents

### Option C: Híbrido (Elegida)
- **Pros:** Mejor de ambos mundos, no duplica infraestructura, cada equipo usa su herramienta preferida, conocimiento se acumula en un solo lugar
- **Cons:** Complejidad de integración, requiere definir qué es compartido vs personal

## Rationale
El sistema existente ya tiene la infraestructura para ser el Capital Token de la organización (Engram para memoria persistente, markdown+YAML para portabilidad, 392 skills para capacidades). Agregar una capa compartida es más rápido y barato que construir un sistema separado. El riesgo de mezclar lo personal con lo organizacional se mitiga con la separación `10_Shared_Org/` dentro de Knowledge.

## Consequences
- **Positivas:** Implementación iniciada en 1 sesión (Quick Wins completados), templates listos, playbook ejemplo documentado, MCP bridge v0.1
- **Negativas:** Se necesita disciplinar la documentación organizacional, onboarding del equipo requiere acompañamiento

## Compliance
- [x] Arquitectura decidida (Option C)
- [x] Shared Org creado (`10_Shared_Org/`)
- [x] Templates listos (playbook, ADR, SOP, agents)
- [x] Primer playbook documentado
- [ ] Codex workspace compartido configurado
- [ ] Contexto organizacional completado
- [ ] MCP Bridge en producción
