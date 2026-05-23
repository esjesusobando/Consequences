# SDD Workflow — gentle-ai (supersedes Agent Teams Lite)

> **Versión:** 3.0 (2026-05-23)
> **Framework:** Spec-Driven Development (SDD)
> **Motor:** gentle-ai — [https://github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai)
> 
> **⚠️ ATENCIÓN:** Agent Teams Lite fue deprecado en Mar 2026.  
> Todo el contenido de este directorio es **legacy**.  
> El SDD activo corre via **gentle-ai** con el orquestador `gentle-orchestrator`.

---

## Overview

Agent Teams Lite fue el framework original de SDD. Desde gentle-ai v1.0, todo el workflow SDD migró a un orquestador dedicado con 10 sub-agentes, memoria Engram, skill registry automático y perfiles multi-modelo.

## Skills del SDD Workflow (legacy — mantener como referencia)

| # | Skill | Trigger |
|---|-------|---------|
| 1 | sdd-init | "sdd init", "iniciar sdd" |
| 2 | sdd-explore | Explorar ideas, investigar |
| 3 | sdd-propose | Crear propuesta |
| 4 | sdd-spec | Especificar requisitos |
| 5 | sdd-design | Diseño técnico |
| 6 | sdd-tasks | Desglose de tareas |
| 7 | sdd-apply | Implementar código |
| 8 | sdd-verify | Verificar implementación |
| 9 | sdd-archive | Archivar cambio |
| 10 | skill-registry | Registro de skills |

## Comandos gentle-ai (activos)

| Comando | Efecto |
|---------|--------|
| `/sdd-init` | Inicializa contexto SDD |
| `/sdd-explore <topic>` | Explora ideas |
| `/sdd-new <change>` | Pipeline completo |
| `/sdd-ff <name>` | Fast-forward planning |
| `/sdd-continue [change]` | Siguiente fase |
| `/sdd-apply [change]` | Implementa tareas |
| `/sdd-verify [change]` | Valida contra specs |
| `/sdd-archive [change]` | Archiva cambio |
| `gentle-ai sync` | Sincroniza skills |
| `gentle-ai skill-registry refresh` | Refresca registry |

---  

*Legacy ATL v2.0 → gentle-ai v1.30+ | PersonalOS v4.7*
