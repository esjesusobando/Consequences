---
description: 01_Agent_Teams_Lite
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# Agent Teams Lite — Skill Index

## Descripción
Workflows SDD (Spec-Driven Development) y metodologías de trabajo con agentes. Incluye el ciclo completo: init → explore → propose → spec → design → tasks → apply → verify → archive.

## Sub-Skills

| #                                | Skill                                            | Descripción                                                                           |
|---------------------------------|-------------------------------------------------|--------------------------------------------------------------------------------------|
| 01                               | `01_Shared`                                      | Recursos compartidos y convenciones SDD                                               |
| 02                               | `02_Sdd_Init`                                    | Inicializar contexto SDD en un proyecto                                               |
| 03                               | `03_Sdd_Explore`                                 | Explorar ideas y codebase antes de proponer                                           |
| 04                               | `04_Sdd_Propose`                                 | Crear propuesta de cambio con intención y alcance                                     |
| 05                               | `05_Sdd_Spec`                                    | Escribir especificaciones con escenarios Given/When/Then                              |
| 06                               | `06_Sdd_Design`                                  | Diseño técnico y decisiones de arquitectura                                           |
| 07                               | `07_Sdd_Tasks`                                   | Desglosar cambio en tareas ejecutables                                                |
| 08                               | `08_Sdd_Apply`                                   | Implementar tareas siguiendo specs y diseño                                           |
| 09                               | `09_Sdd_Verify`                                  | Validar implementación contra specs                                                   |
| 10                               | `10_Sdd_Archive`                                 | Cerrar cambio y archivar artefactos                                                   |
| 11                               | `11_Judgment_Day`                                | Review adversarial paralelo con jueces ciegos                                         |
| 12                               | `12_Go_Testing`                                  | Patrones de testing en Go y Bubbletea TUI                                             |
| 13                               | `13_Branch_Pr`                                   | Workflow de creación de PRs                                                           |
| 14                               | `14_Issue_Creation`                              | Workflow de creación de issues                                                        |

## Uso
Invocar sub-skills individualmente según la fase del workflow SDD activo.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
