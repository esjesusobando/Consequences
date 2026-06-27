# References - Content from URL

## Extraction Tools

| Tool         | Best For                        | Limit          |
|-------------|--------------------------------|---------------|
| Firecrawl    | Complex pages, proper extraction| Rate limited   |
| WebFetch     | Quick simple retrieval          | Limited parsing|
| WebSearch Exa| Finding related content         | Query based    |
| WebFetch Exa | Deep content extraction         | Batch capable  |

## URL Types and Best Approaches

| URL Type     | Recommended Tool          | Notes                     |
|-------------|--------------------------|--------------------------|
| YouTube      | Transcript API            | Use yt-dlp or similar     |
| Documentation| Firecrawl                 | Best structured extraction|
| Blog/Article | WebFetch                  | Simple text extraction    |
| GitHub       | GitHub API + content fetch| Raw content works best    |
| Twitter/X    | API or scrape             | Rate limited              |

## Content Quality Checklist

- [ ] Remove navigation elements
- [ ] Remove ads and sidebars
- [ ] Preserve main content structure
- [ ] Keep code blocks intact
- [ ] Remove tracking scripts
- [ ] Preserve links and references

---

*Last updated: 2026-05-22*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
