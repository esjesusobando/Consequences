# Support

## Getting Help

| Need                           | Where to go                                                                                             |
|-------------------------------|--------------------------------------------------------------------------------------------------------|
| **Bug report**                 | [Open a GitHub Issue](https://github.com/AgriciDaniel/claude-ads/issues/new/choose)                     |
| **Feature request or question**| [GitHub Discussions](https://github.com/AgriciDaniel/claude-ads/discussions)                            |
| **Security vulnerability**     | [GitHub Security Advisory](https://github.com/AgriciDaniel/claude-ads/security/advisories/new) (private)|
| **Contributing**               | See [CONTRIBUTING.md](CONTRIBUTING.md)                                                                  |

## Before Opening an Issue

1. Check the [README](README.md); installation, usage, and FAQ cover the most common questions
2. Search [existing issues](https://github.com/AgriciDaniel/claude-ads/issues) to avoid duplicates
3. Include your OS, Python version, the command that failed, and the full error output

## Response Time

Issues and discussions are monitored regularly. Most questions receive a response
within a few days. Security reports are acknowledged within 48 hours; see
[SECURITY.md](SECURITY.md) for details.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
