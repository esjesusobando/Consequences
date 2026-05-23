---
name: tools
description: >
  Área de TOOLS — Skill Creator, Testing, DevOps, Development.
  Skills para creación de skills, testing, DevOps y desarrollo.
---

# 🛠️ TOOLS — Skill Creator, Testing, DevOps, Development

**Área Funcional:** 06_Tools
**Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Sub-áreas y Contenido

| Sub-área | Descripción |
|----------|-------------|
| `01_Skill_Creator/` | Creación de skills |
| `02_Skill_Template/` | Templates para skills |
| `03_Anthropic_Harness/` | Harness para Claude Code |
| `04_DevOps/` | Operaciones DevOps |
| `05_Vibe_Coding/` | Coding por vibes |
| `06_Testing/` | Testing y QA |
| `07_Skill_Creator_Invictus/` | Skill creator para Invictus |
| `08_Octopus/` | **Octopus** — Ejecución paralela |

## Octopus — Quick Reference

```
06_Tools/10_Octopus/
├── README.md           ✅
└── 00_Octopus_Skill/
    └── SKILL.md        ✅
```

## Skills Principales

| Skill | Ubicación | Descripción |
|-------|-----------|-------------|
| **Octopus** | `10_Octopus/00_Octopus_Skill/` | Multi-brazos paralelo |
| **Skill Creator** | `01_Skill_Creator/` | Crear nuevas skills |
| **Testing** | `06_Testing/` | Test suites |

## Runbook: Crear Nueva Skill

```bash
1. Copiar template de 02_Skill_Template/
2. Crear SKILL.md con frontmatter
3. Definir triggers y description
4. Agregar a skill-registry
```

## Testing

```bash
# Ejecutar tests
pytest tests/

# Coverage
pytest --cov
```

---

*Área Tools v1.0 — 2026-05-19*
