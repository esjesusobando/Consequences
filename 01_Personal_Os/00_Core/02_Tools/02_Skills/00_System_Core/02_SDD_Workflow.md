---
name: "sdd-workflow"
description: "Spec-Driven Development - Metodología completa para desarrollo estructurado con specs, diseño y tareas"
sota_upgraded: true
---

# SDD Workflow

Spec-Driven Development (SDD) es la metodología principal del PersonalOS.

## Fases del SDD

| Fase                                     | Comando                                         | Propósito                                                  |
|-----------------------------------------|------------------------------------------------|-----------------------------------------------------------|
| Explore                                  | `/sdd:explore`                                  | Investigar código/ideas                                    |
| Propose                                  | `/sdd:propose`                                  | Crear propuesta                                            |
| Spec                                     | `/sdd:spec`                                     | Escribir specs detalladas                                  |
| Design                                   | `/sdd:design`                                   | Diseño técnico                                             |
| Tasks                                    | `/sdd:tasks`                                    | Descomponer en tareas                                      |
| Apply                                    | `/sdd:apply`                                    | Implementar código                                         |
| Verify                                   | `/sdd:verify`                                   | Verificar contra specs                                     |
| Archive                                  | `/sdd:archive`                                  | Archivar y documentar                                      |

## Cuándo Usar SDD

- Features sustanciales que requieren specs
- Cambios arquitectónicos
- Nuevas integraciones
- Cualquier trabajo que necesite planificación

## Artefactos

Cada fase genera artefactos que se guardan en:
- **Engram** (memoria persistente)
- **.atl/openspec/** (archivos locales)

## Reglas

1. NO implementar sin specs aprobadas
2. Cada tarea debe ser atómica
3. Verificar contra specs antes de marcar como done
4. Documentar decisiones en el proceso


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
