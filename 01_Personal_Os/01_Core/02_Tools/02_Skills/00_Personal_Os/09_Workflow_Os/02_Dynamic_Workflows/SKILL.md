---
name: "dynamic-workflows"
description: >
  Dynamic Workflows — Pipeline completo de ejecución del orquestador.
  Cubre el ciclo completo: Investigar → Planificar → Diseñar → Especificar →
  Implementar → Testear → Revisar → Rollback → Ship → Monitorear → Compundear.
  Se activa cuando se necesita ejecutar un feature, fix o proyecto de principio a fin.
triggers:
  [
    "workflow",
    "pipeline",
    "full cycle",
    "implement feature",
    "build this",
    "execute plan",
    "dynamic workflow",
    "lifecycle",
    "deploy",
    "ship",
    "rollback",
    "implementar",
    "desarrollar",
    "construir",
    "ejecutar",
    " QA ",
    "testing",
  ]
version: 1.0.0
area: "00_Personal_Os > 09_Workflow_Os"
workflow: "01_Workflows/00_Dynamic_Master.md"
---

# ⚡ Dynamic Workflows — Pipeline Completo del Orquestador

> **Pipeline**: `Investigar → Planificar → Diseñar → Spec → Implementar → Test → Review → Rollback Plan → Ship → Monitor → Compound`
> **Frase clave**: *"Cada proyecto tiene un ciclo de vida — el orquestador lo ejecuta fase por fase."*

## 📋 Ciclo Completo (11 Fases)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DYNAMIC WORKFLOWS PIPELINE                       │
│                                                                     │
│  01. INVESTIGAR ──→ 02. PLANIFICAR ──→ 03. DISEÑAR ──→ 04. SPEC    │
│         │                                                            │
│         ▼                                                            │
│  05. IMPLEMENTAR ──→ 06. TESTEAR ──→ 07. REVISAR                    │
│                                              │                       │
│         ┌────────────────────────────────────┘                       │
│         ▼                                                            │
│  08. ROLLBACK PLAN ──→ 09. SHIP/DEPLOY ──→ 10. MONITOREAR           │
│                                                    │                 │
│         ┌──────────────────────────────────────────┘                 │
│         ▼                                                            │
│  11. COMPUNDEAR ──→ (vuelve a 01 con contexto mejorado)             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔬 Descripción de Fases

### Fase 01 — Investigar (Research)
**Propósito**: Entender el problema antes de tocarlo.
```
Input:  Feature request / Bug report / Idea
Acción:
  - Leer contexto existente (docs, código, tickets)
  - Investigar tecnologías, alternativas, trade-offs
  - Buscar patrones similares ya resueltos
  - Síntesis: "Esto es lo que sabemos y lo que no"
Output: Research Doc / Context Summary
```

### Fase 02 — Planificar (Plan)
**Propósito**: Descomponer el trabajo en tareas accionables.
```
Input: Research Doc
Acción:
  - Dividir en tareas atómicas (máximo 1 día cada una)
  - Estimar esfuerzo y secuenciar dependencias
  - Identificar riesgos y puntos de decisión
  - Asignar prioridad (P0-P3)
Output: Implementation Plan (checklist secuencial)
```

### Fase 03 — Diseñar (Design)
**Propósito**: Arquitectura técnica antes de escribir código.
```
Input: Implementation Plan
Acción:
  - Diseño de arquitectura (componentes, flujo de datos)
  - Decidir patrones y estructuras
  - Identificar interfaces y contracts
  - Validar diseño con el plan
Output: Technical Design Doc
```

### Fase 04 — Especificar (Spec)
**Propósito**: Definir qué hace y cómo se verifica.
```
Input: Technical Design
Acción:
  - Escribir especificaciones detalladas
  - Definir acceptance criteria
  - Definir casos de prueba (happy path + edge cases)
  - Alinear con SDD: spec → tasks
Output: Spec Doc (SDD-compatible)
```

### Fase 05 — Implementar (Implement)
**Propósito**: Escribir código con scope preciso.
```
Input: Spec + Design + Tasks
Acción:
  - Una tarea a la vez
  - Scope: archivos mínimos necesarios
  - Escribir tests primero cuando sea posible (TDD)
  - Commits atómicos y descriptivos
Output: Código implementado + tests
```

### Fase 06 — Testear (Testing)
**Propósito**: Verificar que funciona y no rompe nada.
```
Input: Código + Tests
Acción:
  - Unit tests: cada función nueva
  - Integration tests: APIs, DB, servicios
  - E2E tests: flujos críticos completos
  - Edge cases: valores límite, errores, nulls
Output: Test results (pass/fail)
```

### Fase 07 — Revisar (Code Review)
**Propósito**: Dos pares de ojos antes de mergear.
```
Input: Código + Tests pasando
Acción:
  - Revisión humana: lógica, arquitectura, naming
  - Revisión AI: seguridad, performance, edge cases
  - Verificar contra spec: ¿cumple acceptance criteria?
  - Fixear issues encontrados
Output: PR aprobado / Código revisado
```

### Fase 08 — Rollback Plan
**Propósito**: Tener un safety net antes de ship.
```
Input: Código listo para deploy
Acción:
  - Identificar qué puede salir mal
  - Definir trigger de rollback (métrica o error)
  - Preparar script/procedimiento de rollback
  - Verificar que se puede revertir el commit
Output: Rollback Plan / Script
```

### Fase 09 — Ship / Deploy
**Propósito**: Poner el código en producción.
```
Input: Código + Tests + Rollback Plan
Acción:
  - Mergear PR / Deploy a producción
  - Verificar que el deploy fue exitoso
  - Etiquetar versión (tag)
Output: Deploy realizado + Tag creado
```

### Fase 10 — Monitorear (Monitor)
**Propósito**: Asegurar que el deploy no tiene issues.
```
Input: Deploy realizado
Acción:
  - Monitorear logs, errores, métricas (primeras 24h)
  - Verificar funcionalidad crítica manualmente
  - Configurar alertas si es necesario
  - Documentar cualquier anomalía
Output: Health Check OK / Incident Report
```

### Fase 11 — Compundear (Compound)
**Propósito**: Que el aprendizaje no se pierda.
```
Input: Todo el ciclo completado
Acción:
  - Guardar learnings en Engram Memory
  - Documentar patrones, gotchas, decisiones
  - Actualizar contexto de proyecto
  - Seed para próxima iteración
Output: Learning Doc + Engram save
```

## 🚦 Modos de Ejecución

| Modo | Cuándo usarlo | Qué fases ejecuta |
|------|---------------|-------------------|
| **Full Pipeline** | Features grandes, proyectos nuevos | 01→11 completo |
| **Quick Ship** | Bug fixes, cambios pequeños | 05→06→07→09 |
| **Research Only** | Exploración sin implementación | 01→02 |
| **Design Sprint** | Arquitectura compleja | 01→02→03→04 |
| **Hot Fix** | Bug crítico en producción | 05→06→09→10 |
| **Learning Mode** | Investigar y documentar | 01→11 (compound sin implementar) |

## 🔗 Integración con el OS

| Componente | Rol en Dynamic Workflows |
|------------|------------------------|
| **Orquestador** | Ejecuta el pipeline según el modo |
| **SDD (sdd-*)** | Fase 04 (Spec) + Fase 05 (Tasks) |
| **CE (ce:work)** | Fase 05 (Implement con code review) |
| **GGA** | Fase 07 (Code Review automático) |
| **LA (Learning Always)** | Fase 01 (Research) + Fase 11 (Compound) |
| **Hillary** | Captura tareas personales del pipeline |
| **Engram Memory** | Persiste learnings y contexto entre sesiones |
| **System Guardian (gr)** | Valida integridad post-cambio |
| **OpenCode / Claude Code / Warp** | Invocable via `skill("dynamic-workflows")` desde cualquier shell |

## 🎯 Delegación por Fase — Skill Mapping

Cada fase del pipeline NO se ejecuta inline — **delega a una skill específica del OS**.
El Dynamic Workflows es un meta-orquestador: cada fase invoca su skill correspondiente y consolida el resultado.

| Fase | Skill Encargada | Path | Tags para invocar |
|------|----------------|------|-------------------|
| **01 — Research** | `learning-always` | `09_Workflow_Os/01_Learning_Always/` | `research`, `investigar`, `aprender` |
| **02 — Plan** | `sdd-propose` + `ce:plan` | `00_Compound_Engineering/` | `plan`, `estrategia`, `descomponer` |
| **03 — Design** | `sdd-design` | `00_Compound_Engineering/` | `arquitectura`, `diseño técnico` |
| **04 — Spec** | `sdd-spec` + `sdd-tasks` | `00_Compound_Engineering/` | `spec`, `requisitos`, `tasks` |
| **05 — Implement** | `sdd-apply` / `ce:work` | `00_Compound_Engineering/` | `implementar`, `codificar` |
| **06 — Test** | `testing` (pytest/playwright) | `06_Tools/06_Testing/` | `test`, `pytest`, `playwright` |
| **07 — Review** | `ce:review` / `gga` | `00_Compound_Engineering/` | `code review`, `auditar código` |
| **08 — Rollback** | `devops` | `06_Tools/04_DevOps/` | `rollback`, `deploy`, `safety` |
| **09 — Ship** | `git workflow` + `devops` | `06_Tools/04_DevOps/` | `deploy`, `ship`, `release` |
| **10 — Monitor** | `observability` | `06_Tools/` | `monitorear`, `logs`, `alertas` |
| **11 — Compound** | `learning-always` + `engram` | `09_Workflow_Os/01_Learning_Always/` | `compound`, `documentar`, `engram` |

### Cómo se ejecuta la delegación

```
Para cada fase del pipeline activo:
  1. Dynamic Workflows identifica la skill encargada (tabla arriba)
  2. Invoca skill(nombre) con:
     - Contexto de la fase anterior
     - Criterios de éxito de la fase actual
     - Output esperado
  3. Recibe el resultado de la skill
  4. Verifica contra acceptance criteria
  5. Si OK → pasa contexto a la siguiente fase
  6. Si FAIL → re-intenta (máx 2) o escala al orquestador
```

### Modos de Ejecución + Skills involucradas

| Modo | Fases | Skills que invoca |
|------|-------|-------------------|
| **Full Pipeline** | 01→11 | LA → SDD(propose+design+spec+tasks) → SDD apply → Testing → ce:review → DevOps → LA |
| **Quick Ship** | 05→06→07→09 | SDD apply → Testing → ce:review → DevOps |
| **Research Only** | 01→02 | LA → SDD propose |
| **Design Sprint** | 01→02→03→04 | LA → SDD propose → SDD design → SDD spec |
| **Hot Fix** | 05→06→09→10 | SDD apply → Testing → DevOps → Observability |
| **Learning Mode** | 01→11 (saltando implementación) | LA → SDD propose → LA → (compound) |

## 📁 Workflows por Fase

| Fase | Archivo |
|------|---------|
| Master Pipeline | `01_Workflows/00_Dynamic_Master.md` |
| 01 - Research | `01_Workflows/01_Research.md` |
| 02 - Plan | `01_Workflows/02_Plan.md` |
| 03 - Design | `01_Workflows/03_Design.md` |
| 04 - Spec | `01_Workflows/04_Spec.md` |
| 05 - Implement | `01_Workflows/05_Implement.md` |
| 06 - Test | `01_Workflows/06_Test.md` |
| 07 - Review | `01_Workflows/07_Review.md` |
| 08 - Rollback | `01_Workflows/08_Rollback.md` |
| 09 - Ship | `01_Workflows/09_Ship.md` |
| 10 - Monitor | `01_Workflows/10_Monitor.md` |
| 11 - Compound | `01_Workflows/11_Compound.md` |

---
*Dynamic Workflows v1.0 — 2026-05-30 — Pipeline completo del orquestador*
