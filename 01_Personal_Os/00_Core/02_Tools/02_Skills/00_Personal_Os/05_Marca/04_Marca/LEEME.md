# 04_Marca

> Manual de marca y guía de estilo visual para los agentes de marketing.

## Contenido

Aquí se almacena la identidad visual y verbal de la marca:
- `colores.md` — Paleta de colores con códigos hex
- `tipografia.md` — Fuentes, jerarquía, tamaños
- `guia-visual.md` — Elementos visuales, logo, usos correctos

## Agentes que lo usan

| Agente                     | Cómo usa la marca                                  |
|---------------------------|---------------------------------------------------|
| `15_Marketing_Estratega.md`| Verifica que briefs usen tono y estilo correctos   |
| `16_Marketing_Creador.md`  | Aplica colores, tipografía y tono en cada pieza    |
| `17_Marketing_Analista.md` | Evalúa consistencia de marca en contenido publicado|

## Estructura recomendada

```
05_Marca/
├── LEEME.md
├── colores.md         ← Paleta hex, usos, prohibiciones
├── tipografia.md      ← Fuentes, jerarquía, tamaños
└── guia-visual.md     ← Logo, imagery, ejemplos correctos/incorrectos
```

---

*Marketing Agents v1.0 — PersonalOS v4.9 Consequences*
*Integrado con Core: 00_Core/02_Tools/01_Agents/*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
