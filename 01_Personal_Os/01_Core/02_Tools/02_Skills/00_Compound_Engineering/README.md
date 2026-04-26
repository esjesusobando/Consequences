# Compound Engineering — Ecosistema Principal

**Version:** 3.0 | **Date:** 2026-04-25

---

## Que es?

Compound Engineering es el nucleo de habilidades especializadas del sistema. Agrupa agentes revisores especializados (Kieran, DHH, Julik, etc.) y workflows de calidad.

---

## Estructura

```
00_Compound_Engineering/
├── 01_Agents_Review/      # Agentes de code review
├── 02_Agents_DocReview/  # Agentes de document review
├── 03_Agents_Design/     # Agentes de diseño
├── 04_Agents_Research/    # Agentes de investigación
├── 05_Agents_Workflow/    # Workflows de agents
├── 06_Agents_Docs/        # Documentación de agents
├── 07_Skills/             # Skills especializadas
├── 08_Mcp/                # MCPs relacionados
└── 09_Scripts/            # Scripts de soporte
```

---

## Agentes Principales

| Agente | Rol | Especialidad |
|--------|-----|-------------|
| kieran-typescript-reviewer | TypeScript Expert | Type safety, patterns |
| kieran-python-reviewer | Python Expert | Pythonic clarity |
| kieran-rails-reviewer | Rails Expert | DHH style |
| dhh-rails-reviewer | Rails Architect | 37signals style |
| julik-frontend-races-reviewer | Frontend Races | Async/React timing |
| security-sentinel | Security Audit | OWASP compliance |
| performance-oracle | Performance | Bottlenecks, scalability |
| best-practices-researcher | Research | Patterns, examples |
| learnings-researcher | Learnings | Past solutions |
| design-iterator | Design Iteration | Visual refinement |

---

## Skills Disponibles (63 total)

- agent-native-architecture
- agent-native-audit
- architecture-guardrails
- best-practices-researcher
- ce:*
- design-taste-frontend
- figma-design-sync
- framework-docs-researcher
- git-history-analyzer
- integration-testing
- kieran-typescript-reviewer
- observability-skill
- pattern-recognition-specialist
- performance-review
- security-reviewer
- test-coverage-skill
- y muchos mas...

---

## Integración

- **HUBs:** 01_Auditor_Hub, 11_Auto_Learn_Hub
- **MCPs:** github, context7, engram, excalidraw
- **Workflows:** Pre-commit hooks, PR review automation

---

*Think Different PersonalOS v3.0 Consequences*
