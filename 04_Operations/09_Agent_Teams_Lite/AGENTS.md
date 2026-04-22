# Agent Teams Lite — SDD Workflow Skills

> **Versión:** 2.0 (2026-03-30)
> **Framework:** Spec-Driven Development (SDD)

## Overview

Agent Teams Lite implementa el workflow SDD como un sistema de sub-skills especializadas. Cada fase del SDD tiene su propia skill con ejemplos específicos del workflow.

## Skills del SDD Workflow

| #     | Skill            | Trigger                      | Descripción                 |
|-------|------------------|------------------------------|-----------------------------|
| 1     | sdd-init         | "sdd init", "iniciar sdd"    | Inicializar contexto SDD    |
| 2     | sdd-explore      | Explorar ideas, investigar   | Fase de exploración         |
| 3     | sdd-propose      | Crear propuesta              | Proposal con intent/scope   |
| 4     | sdd-spec         | Especificar requisitos       | Requisitos y escenarios     |
| 5     | sdd-design       | Diseño técnico               | Arquitectura y decisiones   |
| 6     | sdd-tasks        | Desglose de tareas           | Task breakdown              |
| 7     | sdd-apply        | Implementar código           | Ejecución de tareas         |
| 8     | sdd-verify       | Verificar implementación     | Validación contra specs     |
| 9     | sdd-archive      | Archivar cambio              | Sync a main specs           |
| 10    | skill-registry   | Registro de skills           | Mantener registry           |

## Estructura de Cada Skill

```
skills/
├── sdd-init/
│   ├── SKILL.md
│   └── examples/
│       ├── scenario_01.md
│       ├── scenario_02.md
│       └── anti_pattern.md
├── sdd-explore/
│   └── ...
```

## Uso

1. Detectar trigger del usuario
2. Cargar skill correspondiente
3. Seguir workflow definido
4. Mantener trazabilidad

## Dependencias

- **Persistence Backend:** Engram (default) u OpenSpec
- **Artifact Format:** YAML + Markdown

---

**Nota:** Cada skill incluye carpeta examples/ con escenarios específicos del workflow SDD.
