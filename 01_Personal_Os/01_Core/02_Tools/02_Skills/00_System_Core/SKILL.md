---
name: "personal_os_stack"
description: "Core skills del Think Different PersonalOS - Goals, Backlog, Tasks, SDD, System Guardian"
triggers: ["personalos", "stack", "goals", "backlog", "tasks", "system guardian", "sdd init"]
version: 1.1.0
category: "00_System_Core"
complexity: "High"
---

# Personal OS Stack [SOTA UPGRADED]

Skills fundamentales del Think Different PersonalOS. 
*Versión 1.1.0: Actualizado con telemetría mejorada, integración a Agent Teams Lite (SDD) y estricto control de contexto.*

## Esencia Original
El núcleo del sistema, diseñado para una autonomía extrema mediante flujos definidos de trabajo, auditoría constante y un backlog siempre priorizado.

## Principios SOTA (Nuevos)
- **Zero-Context Loss:** El sistema no tolera pérdida de contexto. Utilizar `mem_save` de Engram para persistir cualquier decisión técnica.
- **Delegation by Default:** El OS orquesta sub-agentes en SDD (Explore, Propose, Design, Task, Apply, Verify). No inflar el contexto innecesariamente.
- **Fail-Fast Heuristics:** El System Guardian actúa de manera inmediata. Si falla un test de salud, se aborta la misión hasta corregirse.

## Skills Incluidas

| #  | Skill                    | Descripción                                                                 | Endpoint Lógico             |
|----|--------------------------|-----------------------------------------------------------------------------|-----------------------------|
| 01 | **SDD Workflow**         | Metodología de desarrollo estructurado (Spec-Driven Development v2)        | `sdd-init`, `sdd-explore`   |
| 02 | **System Guardian**      | Validación automática estricta (Watchdog, Auditor Profundo)               | `01_Auditor_Hub.py`         |
| 03 | **Backlog Processing**   | Flujo completo de backlog (Priorización Express)                            | `04_Backlog_Processing.md`  |
| 04 | **Personal OS**          | Sistema principal de productividad                                          | `01_Personal_Os.md`         |
| 05 | **Endpoint Logic**       | Lógica de endpoints y routing del OS                                        | `08_Workflow_Hub.py`        |

## ⚠️ Gotchas Históricos (DO NOT IGNORE)

### System Guardian ignorado
> No ignores las advertencias del System Guardian: el sistema de validación no es opcional.

- **Por qué**: Cada advertencia detecta una violación de contrato del OS — si la ignoras, el estado del sistema queda inconsistente y las skill futuras operan sobre datos corruptos.
- **Solución**: Tratar cada advertencia como un error bloqueante hasta resolverla. Si es falso positivo, documentar la excepción en el runbook de diagnóstico.

### Backlog estancado
> Mantén el backlog procesado constantemente; un backlog lleno es deuda técnica de diseño.

- **Por qué**: El backlog es el corazón del sistema de prioridades. Cuando se acumula, el agente pierde visibilidad de tareas importantes y termina priorizando por urgencia en lugar de impacto.
- **Solución**: Dedicar los primeros 5 minutos de cada sesión a procesar el backlog. Si hay más de 10 items, aplicar el flujo de "priorización express" del Backlog Processing.

### Flujo SDD incompleto
> Los flujos SDD deben cumplirse estrictamente para evitar pérdida de contexto en la persistencia.

- **Por qué**: Cada fase del SDD (explore → propose → spec → design → tasks → apply → verify) genera artifacts que la siguiente fase necesita. Saltarse una fase rompe la cadena de contexto.
- **Solución**: Si el contexto es limitado, ejecutar fases en modo express pero nunca saltarlas por completo. Usar `sdd-init --quick` para setups rápidos.

## Estructura de Integración

### Documentada (aspirational)
```
00_System_Core/
├── 01_Hooks/
├── 01_Personal_Os.md
├── 02_SDD_Workflow.md
├── 03_System_Guardian.md
├── 04_Backlog_Processing.md
├── references/
├── scripts/
└── SKILL.md
```

### Actual (on-disk)
```
00_System_Core/
├── 01_Gcierr/           # Hooks de validación GCIERR
├── 01_Personal_Os.md
├── 02_Hooks/            # Hooks operativos
├── 02_SDD_Workflow.md
├── 03_Gcierr/           # Hooks de diagnóstico GCIERR
├── 03_System_Guardian.md
├── 04_Backlog_Processing.md
├── 04_Hooks/            # Hooks de procesamiento
├── 05_Hooks/            # Hooks de sistema
└── SKILL.md
```

## Complementos y Directrices
- **01_Personal_Os.md**: Stack principal de productividad — goals, tasks, priorización.
- **02_SDD_Workflow.md**: Metodología SDD completa para desarrollo estructurado.
- **03_System_Guardian.md**: Validación automática de contratos del sistema.
- **04_Backlog_Processing.md**: Flujo completo de procesamiento de backlog.
- **Hooks/**: Scripts de validación pre/post operaciones del OS.
- **Gcierr/**: Utilidades de diagnóstico y validación de estado.

---
*Skill Version: 1.1.0 (SOTA)*

