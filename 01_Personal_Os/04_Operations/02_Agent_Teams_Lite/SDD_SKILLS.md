# SDD Workflow Skills — gentle-ai

> **Versión:** 3.0 (2026-05-23)
> **Framework:** Spec-Driven Development (SDD)
> **Motor:** gentle-ai (reemplaza Agent Teams Lite)

---

## Overview

El SDD Workflow ahora corre sobre **gentle-ai**, que reemplaza a Agent Teams Lite (archivado).  
El orquestador `gentle-orchestrator` maneja el ciclo completo con 10 sub-agentes especializados.

## Skills del SDD Workflow

| #  | Skill        | Trigger                 | Descripción                                        |
|---|-------------|------------------------|---------------------------------------------------|
| 1  | `sdd-init`   | `/sdd-init`             | Inicializa contexto SDD + detecta stack + testing  |
| 2  | `sdd-explore`| `/sdd-explore <topic>`  | Explora ideas, investiga código, compara approaches|
| 3  | `sdd-propose`| Delegado por orquestador| Crea propuesta con intent/scope/approach           |
| 4  | `sdd-spec`   | Delegado por orquestador| Requisitos y escenarios                            |
| 5  | `sdd-design` | Delegado por orquestador| Arquitectura y decisiones técnicas                 |
| 6  | `sdd-tasks`  | Delegado por orquestador| Task breakdown + review workload forecast          |
| 7  | `sdd-apply`  | `/sdd-apply [change]`   | Implementa código con TDD si aplica                |
| 8  | `sdd-verify` | `/sdd-verify [change]`  | Valida contra specs y tests                        |
| 9  | `sdd-archive`| `/sdd-archive [change]` | Archiva cambio y persiste estado                   |

## Pipeline SDD

```
proposal → specs → design → tasks → apply → verify → archive
                                ↓ (review guard)
                           delivery_strategy:
                           ask-on-risk | auto-chain | single-pr | exception-ok
```

## Meta-Comandos del Orquestador

| Comando                 | Efecto                                                 |
|------------------------|-------------------------------------------------------|
| `/sdd-new <change>`     | Pipeline completo: propuesta → specs → diseño → tareas |
| `/sdd-ff <name>`        | Fast-forward: proposal → specs → design → tasks directo|
| `/sdd-continue [change]`| Siguiente fase según dependencias                      |

## Integración con Agentes del Pipeline

| Agente OS                 | Fase SDD     | Rol                       |
|--------------------------|-------------|--------------------------|
| #01 Scope Rule Architect  | `sdd-design` | Define alcance y reglas   |
| #02 TDD Test First        | `sdd-apply`  | Escribe tests primero     |
| #03 React Test Implementer| `sdd-apply`  | Implementa features React |
| #04 React Mentor          | `sdd-verify` | Review de calidad         |
| #05 Security Auditor      | `sdd-verify` | Auditoría de seguridad    |
| #06 Git Workflow Manager  | `sdd-archive`| Prepara PR y documentación|
| #07 Accessibility Auditor | `sdd-verify` | Auditoría de accesibilidad|

## Dependencias

- **Orquestador:** gentle-ai (`gentle-orchestrator`)
- **Persistencia:** Engram (default) | OpenSpec (file-based)
- **Skill Registry:** Automático vía gentle-ai
- **Modelos:** Perfil multi-modelo por fase (configurable en opencode.json)

---

*gentle-ai v1.30+ | SDD v3.0 | PersonalOS v4.7*
