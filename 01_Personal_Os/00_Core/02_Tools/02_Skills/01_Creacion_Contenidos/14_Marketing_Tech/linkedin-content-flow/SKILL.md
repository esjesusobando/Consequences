---
name: linkedin-content-flow
description: Pipeline completo de contenido para LinkedIn — research, creación, revisión y publicación
trigger_keywords: [linkedin, post linkedin, linkedin post, contenido linkedin, linkedin content, crear post]
auto_loads_skills: true
version: 1.0
type: skill
pipeline:
  stages:
    - phase: research
      agent: 15_Marketing_Estratega.md
      input: topic, target_audience, angle, key_messages
      output: brief with objective, audience, tone, CTA, success_metric
      fallback: prompt-user
    - phase: create
      agent: 16_Marketing_Creador.md
      input: brief from stage 1
      output: complete LinkedIn post (hook → story → insight → CTA)
      fallback: retry
    - phase: review
      agent: 17_Marketing_Analista.md
      input: published piece + original brief KPIs
      output: validation report, quality gate pass/fail, revision instructions
      fallback: skip
    - phase: publish
      agent: null
      input: approved post
      output: formatted post with scheduling recommendations
      fallback: prompt-user
sota_upgraded: true
---

# LinkedIn Content Flow

Pipeline completo para producir contenido optimizado para LinkedIn, desde el brief hasta el post listo para publicar.

## Pipeline

| Stage | Agent | Input | Output |
|-------|-------|-------|--------|
| 1. Research | `15_Marketing_Estratega.md` | Topic + audiencia | Brief completo |
| 2. Create | `16_Marketing_Creador.md` | Brief | Post LinkedIn (hook → story → insight → CTA) |
| 3. Review | `17_Marketing_Analista.md` | Post + KPIs | Validación o revisiones |
| 4. Publish | — | Post aprobado | Formateado + recomendaciones |

## Quality Gates

- ✅ Hook in first 2 lines
- ✅ CTA presente
- ✅ Brand voice match
- ✅ Brief alignment (objective, audience, KPIs)

## Fallback Rules

| Stage | If fails |
|-------|----------|
| Research | Preguntar al usuario por clarificación |
| Create | Reintentar con brief corregido |
| Review | No publicar — devolver instrucciones de revisión |
| Publish | Preguntar al usuario por plataforma/horario |

## Output Format

```markdown
## Post: [Title]

{hook}

{story / insight}

{CTA}

---
**Scheduling recommendation:** {best time/day}
```


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
