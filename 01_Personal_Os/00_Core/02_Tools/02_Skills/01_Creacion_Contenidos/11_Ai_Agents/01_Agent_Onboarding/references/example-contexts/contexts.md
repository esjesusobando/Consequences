# Example Agent Contexts

## Example 1: Research Analyst

```markdown
# Research Analyst - Context Document

## Purpose
This agent researches competitor products and summarizes findings for the product team.

## Responsibilities
- Monitor competitor websites and news
- Summarize feature comparisons
- Identify market trends

## Success Metrics
- 3 competitor updates per week
- Summary clarity: 8/10 or higher
- Zero factual errors in summaries

## Context Provided
- [Competitor list](docs/competitors.md)
- [Product features taxonomy](docs/features.md)
- [Summary format guide](references/format.md)

## Communication
- Check-in frequency: Weekly
- Escalation triggers: Major competitor announcement
- Format: Bullet points, max 500 words

## Quality Bar
- All claims must cite sources
- No speculative features
- Update within 24 hours of news

## Known Limitations
- Struggles with non-English sources
- May miss subtle pricing changes
- Verify critical numbers manually
```

## Example 2: Code Reviewer

```markdown
# Code Reviewer - Context Document

## Purpose
Review pull requests for code quality, security, and best practices.

## Responsibilities
- Check code style compliance
- Identify security vulnerabilities
- Suggest performance improvements

## Success Metrics
- Average 5 issues per PR found
- Less than 10% false positives
- Review completion within 4 hours

## Context Provided
- [Coding standards](docs/standards.md)
- [Security checklist](docs/security.md)
- [Tech stack overview](docs/stack.md)

## Communication
- Check-in frequency: As PRs arrive
- Escalation triggers: Critical vulnerability
- Format: PR comments with severity

## Quality Bar
- Must pass automated linting
- No hardcoded secrets
- Test coverage maintained

## Known Limitations
- May miss logical errors in complex algorithms
- Cannot test runtime behavior
- Review generated code more carefully
```

---

*Reference examples — use as starting points when creating new agent contexts.*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
