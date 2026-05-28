# 🤖 01_Agents — Sistema de Agentes Especializados

**Versión:** v4.8 | **Fecha:** 2026-05-28 | **Estado:** Pure Green Production

> 🧠 **[OS Conductor](00_OS_Conductor/README.md) (v2.0) — El punto de entrada único al PersonalOS.**
> Implementa Anthropic 2.0 Harness: Sprint Contract, Evaluator Pattern, Context Management.
> Reemplaza a `00_Orchestrator.md` (v4.0, mantenido como referencia histórica).

Este directorio contiene todos los agentes especializados del PersonalOS. Cada agente tiene un dominio específico y se invoca desde el **OS Conductor**, desde workflows, o directamente desde Claude Code.

---

## 📂 Estructura del Directorio

```
01_Personal_Os/01_Core/02_Tools/01_Agents/
├── 00_OS_Conductor/                # 🧠 OS Conductor v2.0 — Anthropic 2.0 Harness (Sprint Contract + Evaluator + Context)
├── 00_Orchestrator.md              # [LEGACY v4.0] Reemplazado por OS Conductor
├── 01_Scope_Rule_Architect.md      # Arquitectura — Scope Rule
├── 02_TDD_Test_First.md            # Tests RED phase
├── 03_React_Test_Implementer.md    # Código GREEN phase
├── 04_React_Mentor.md              # Refactor + optimización
├── 05_Security_Auditor.md          # OWASP — seguridad
├── 06_Git_Workflow_Manager.md      # PR + Git workflow
├── 07_Accessibility_Auditor.md     # WCAG 2.1 AA
├── 08_PRD_Dashboard_Template.md    # Product Requirements
├── 09_Design_SOP_Document.md       # Layout + diseño
├── 10_Workflow_Orchestrator.md     # TDD Engine orquestador
├── 11_AIPM_Judge.md                # Evaluación + calidad
├── 12_LFG_Autonomous_Engine.md     # Autonomía — LFG
├── 13_Hillary.md                   # Life OS Specialist
├── 01_Dream_Team/                  # 5 agentes: Product, Data, Marketing, Design, Platform
│   ├── 01_Product_Builder.md
│   ├── 02_Data_Engineer.md
│   ├── 03_Marketing_Tech.md
│   ├── 04_Design_Ops.md
│   └── 05_Platform_Engineer.md
├── 02_Specialists_Compound/        # 23 agentes revisores especializados
│   ├── Agent-Native-Reviewer.md
│   ├── Architecture-Strategist.md
│   ├── Best-Practices-Researcher.md
│   ├── Code-Simplicity-Reviewer.md
│   ├── Deployment-Verification-Agent.md
│   ├── Dhh-Rails-Reviewer.md
│   ├── Learnings-Researcher.md
│   ├── Security-Sentinel.md
│   └── ... (24 total — ver README interno)
├── 03_Growth/                      # 5 agentes de contenido + YouTube
│   ├── 01_Content_Transformer.md
│   ├── 02_Youtube_Script_Writer.md
│   ├── 03_Youtube_Thumbnail_Prompter.md
│   ├── 04_Youtube_Title_Generator.md
│   └── 05_Carousel_Strategist.md
├── 04_Contexto/                    # Contexto de proyecto para Marketing Agents
├── 05_Marca/                       # Brand assets y voz de marca
├── 06_Plantillas/                  # Templates generales reutilizables
├── __Agent_Template.md             # Template base para nuevos agentes
└── README.md                       # Este archivo
```

---

## 🏆 Catálogo de Agentes (13 principales + 5 Dream Team + 24 Specialists + 5 Growth = 47+)

### Agentes Principales

| #                                    | Agente                                                  | Dominio                                          | Prioridad                                  | Estado                                  |
|-------------------------------------|--------------------------------------------------------|-------------------------------------------------|-------------------------------------------|----------------------------------------|
| 00                                   | 🧠 **OS Conductor v2.0**                                 | **Entry point único — Anthropic 2.0 Harness**        | **CRÍTICA**                                | ✅ 🆕                                  |
| 01                                   | Scope Rule Architect                                    | Arquitectura                                     | CRÍTICA                                    | ✅                                       |
| 02                                   | TDD Test-First                                          | Tests (RED)                                      | ALTA                                       | ✅                                       |
| 03                                   | Growth (Marketing Tech)                                 | Growth/Marketing                                 | ALTA                                       | ✅                                       |
| 04                                   | React Mentor                                            | Refactor                                         | MEDIA                                      | ✅                                       |
| 05                                   | Security Auditor                                        | Seguridad                                        | CRÍTICA                                    | ✅                                       |
| 06                                   | Git Workflow Manager                                    | Pull Request                                     | ALTA                                       | ✅                                       |
| 07                                   | Accessibility Auditor                                   | Accesibilidad                                    | MEDIA                                      | ✅                                       |
| 08                                   | PRD Dashboard Template                                  | Producto                                         | BAJA                                       | ✅                                       |
| 09                                   | Design SOP Document                                     | Producto                                         | BAJA                                       | ✅                                       |
| 10                                   | Workflow Orchestrator                                   | Orquestación                                     | CRÍTICA                                    | ✅                                       |
| 11                                   | AIPM Judge                                              | Calidad/Auditoría                                | ALTA                                       | ✅                                       |
| 12                                   | LFG Autonomous Engine                                   | Autonomía                                        | ALTA                                       | ✅                                       |
| 13                                   | Hillary Specialist                                      | Life OS                                          | ALTA                                       | ✅ 🆕                                     |
| 14                                   | React Test Implementer                                  | Código (GREEN)                                   | ALTA                                       | ✅ 🆕                                     |

---

## 🔄 Flujo de Trabajo TDD (7 Fases)

```
FASE 1: ARQUITECTURA
    ↓ (Scope Rule definida)
FASE 2: TESTS (RED)
    ↓ (Tests fallando)
FASE 3: IMPLEMENTACIÓN (GREEN - Usar Agente #03)
    ↓ (Tests pasando)
FASE 4: REFACTORIZACIÓN (REFACTOR)
    ↓ (Código optimizado)
FASE 5: SEGURIDAD
    ↓ (OWASP auditado)
FASE 6: PULL REQUEST
    ↓ (Documentación completa)
FASE 7: ACCESIBILIDAD (opcional)
    ↓
✅ MERGE TO MAIN
```

### Duración Estimada por Fase

| Fase                                       | Duración                                        | Output                                                     |
|-------------------------------------------|------------------------------------------------|-----------------------------------------------------------|
| FASE 1                                     | 30-60 min                                       | Documento de arquitectura                                  |
| FASE 2                                     | 1-2 horas                                       | Suite de tests (RED)                                       |
| FASE 3                                     | 2-4 horas                                       | Código funcional (GREEN)                                   |
| FASE 4                                     | 1-2 horas                                       | Código refactorizado                                       |
| FASE 5                                     | 30-60 min                                       | Reporte de seguridad                                       |
| FASE 6                                     | 30 min                                          | PR completo                                                |
| FASE 7                                     | 30-60 min                                       | Reporte accesibilidad                                      |
| **Total**                                  | **6-11 horas**                                  | Feature completa                                           |

---

## 🚀 Cómo Usar los Agentes

### Opción A: OS Conductor — Entry Point Único ✅ RECOMENDADO

```bash
# El Conductor sabe a qué agente/skill rutear según lo que necesites
"Necesito implementar [funcionalidad]."
"Quiero crear contenido sobre [tema]."
"Auditame el sistema."

# El Conductor analiza el request, selecciona los agentes/skills correctos,
# y orquesta el flujo completo.
```

### Opción B: Orquestador Automático (Legacy)

```bash
# Usar el agente Workflow Orchestrator
"Necesito implementar [funcionalidad]. Orquesta las 7 fases del flujo TDD."
```

### Opción C: Manual (Fase por Fase)

```bash
# FASE 3: Implementación (GREEN)
Agente #03: "Implementa código para pasar los tests de [feature]"

# FASE 5: Seguridad
Agente #05: "Audita seguridad de [feature]"
```

---

## 📊 Métricas de Éxito

| Agente                                             | Métrica Clave                                                         | Target                                    |
|---------------------------------------------------|----------------------------------------------------------------------|------------------------------------------|
| #01 Architect                                      | Decisiones GLOBAL/LOCAL documentadas                                  | 100%                                      |
| #14 Implementer                                    | Tests pasando                                                         | 100%                                      |
| #05 Security                                       | Vulnerabilidades HIGH/CRITICAL                                        | 0                                         |

---

## 📋 Principios Fundamentales

1. **Arquitectura Antes de Código** (FASE 1)
2. **Tests Antes de Implementación** (FASE 2: RED)
3. **Código Mínimo Funcional** (FASE 3: GREEN - #14)

---

_PersonalOS v4.8 Consequences — Pure Green Production — 2026-05-26_
