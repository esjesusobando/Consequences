# References - Reverse Engineering

## Targets Analyzed

| Target     | Type      | Key Learnings        |
|-----------|----------|---------------------|
| Claude Code| Agent/CLI | Tool use patterns    |
| n8n        | Automation| Workflow architecture|
| Firecrawl  | Scraping  | Extraction patterns  |

## Analysis Tools

- **GitHub API**: Repository structure analysis
- **Sourcegraph**: Code search across repos
- **WebFetch**: Documentation extraction
- **Code reading**: Direct source analysis

## Reverse Engineering Checklist

### Structure
- [ ] Directory organization
- [ ] Module/component boundaries
- [ ] Configuration management
- [ ] Build/deploy system

### Code
- [ ] Naming conventions
- [ ] Error handling approach
- [ ] Testing strategy
- [ ] Documentation style

### Architecture
- [ ] Design patterns used
- [ ] Scalability approach
- [ ] Integration points
- [ ] Data flow

### Decisions
- [ ] Technology choices and why
- [ ] Trade-offs made
- [ ] Future considerations

## Pattern Categories

| Category     | What to Look For            |
|-------------|----------------------------|
| Architectural| How components relate       |
| Coding       | Style and conventions       |
| Testing      | Test strategies and coverage|
| Deployment   | Build and release process   |
| Documentation| How knowledge is captured   |

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
