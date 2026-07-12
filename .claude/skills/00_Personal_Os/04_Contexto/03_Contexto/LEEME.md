# 03_Contexto

> Contexto del proyecto, marca y configuración del sistema de Marketing Agents.

## Contenido

Aquí se almacena todo el contexto del proyecto que alimenta a los agentes de marketing:
- `estrategia.md` — Objetivos, metas, KPIs, buyer persona
- `conocimiento.md` — Conocimiento del negocio, industria, competencia
- `tono-de-voz.md` — Guía de tono y estilo (si se separa de Marca)

## Agentes que lo usan

| Agente                     | Cómo usa el contexto                              |
|---------------------------|--------------------------------------------------|
| `15_Marketing_Estratega.md`| Lee objetivos y KPIs para generar briefs alineados|
| `16_Marketing_Creador.md`  | Lee tono y estilo para mantener consistencia      |
| `17_Marketing_Analista.md` | Lee KPIs para medir rendimiento contra objetivos  |

## Estructura recomendada

```
04_Contexto/
├── LEEME.md
├── estrategia.md       ← Objetivos, metas, buyer persona
├── conocimiento.md     ← Industria, competencia, expertise
└── tono-de-voz.md     ← Guía de tono y estilo
```

---

*Marketing Agents v1.0 — PersonalOS v4.9 Consequences*
*Integrado con Core: 00_Core/02_Tools/01_Agents/*
