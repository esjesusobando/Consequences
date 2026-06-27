# 05_Plantillas

> Plantillas reutilizables para generación de contenido por los agentes de marketing.

## Contenido

Plantillas estructuradas por canal que los agentes usan para producir contenido consistente:

| Carpeta         | Canal                       | Agente responsable       |
|----------------|----------------------------|-------------------------|
| `01_Posts/`     | LinkedIn, Twitter, Instagram| Marketing Creador (`16_`)|
| `02_Emails/`    | Newsletter, Outreach        | Marketing Creador (`16_`)|
| `03_Blog/`      | Artículos largos            | Marketing Creador (`16_`)|
| `04_Video/`     | YouTube, Shorts             | Marketing Creador (`16_`)|
| `05_Miniaturas/`| Thumbnail prompts           | Marketing Creador (`16_`)|

## Agentes que lo usan

| Agente                     | Cómo usa las plantillas                                 |
|---------------------------|--------------------------------------------------------|
| `15_Marketing_Estratega.md`| Referencia al generar briefs (sabe qué formatos existen)|
| `16_Marketing_Creador.md`  | Usa la plantilla exacta del formato solicitado          |
| `17_Marketing_Analista.md` | Evalúa si el formato se usó correctamente               |

## Estructura Recomendada

```
05_Plantillas/
├── LEEME.md
├── 01_Posts/
│   ├── linkedin.md
│   └── linkedin-carrusel.md
├── 02_Emails/
│   ├── newsletter.md
│   └── outreach.md
├── 04_Video/
│   ├── youtube-script.md
│   └── youtube-shorts.md
└── 05_Miniaturas/
    └── thumbnail-brief.md
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
