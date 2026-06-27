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
*Integrado con Core: 01_Core/02_Tools/01_Agents/*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
