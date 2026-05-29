---
name: "laia-learning"
description: >
  Laia Learning — Context Engineering & Project Onboarding.
  Metodología de ingeniería inversa para inicializar proyectos con estructura de datos canónica,
  protocolo de sincronización Human-in-the-Loop, y prompts de activación para agentes.
  Triggers on: "laia init", "onboarding", "nuevo proyecto", "context engineering",
  "SOW", "project brief", "canonical context", "setup project", "inicializar proyecto"
triggers: ["laia", "onboarding", "project-setup", "context-engineering"]
version: 1.0.0
---

# 🧠 Laia Learning — Context Engineering & Project Onboarding

## Esencia Original

Cada proyecto nuevo arranca con una hoja en blanco — y cada agente pierde tiempo valioso reconstruyendo contexto desde cero. Laia Learning resuelve esto con un **protocolo de 3 capas** que transforma cualquier SOW, brief o archivo maestro en un scaffold de contexto canónico que los agentes pueden consumir de forma nativa:

1. **Estructura de Datos** — Archivos canónicos por proyecto (`project-context.md`, `project-operating-data.md`, `project-brief.md`)
2. **Protocolo de Sincronización** — Human-in-the-Loop con árbol de decisión que bloquea ejecución hasta resolver ambigüedades
3. **Prompts de Activación** — 3 agentes especializados (Hermes Extractor → Códex Orchestrator → Gauss Executor)

**Área Funcional:** 11_Laia_Learning
**Versión:** 1.0 | **Última actualización:** 2026-05-28

---

## Sub-áreas y Contenido

| Sub-área                | Descripción                                                  |
|------------------------|--------------------------------------------------------------|
| `01_Context_Canonical/` | Templates de los 3 archivos canónicos de contexto            |
| `02_Prompts/`           | System prompts para Hermes, Códex y Gauss                    |
| `03_Workflows/`         | Flujo completo iabrain-init (ingest → plan → execute)        |
| `references/`           | Documentación de referencia y ejemplos                       |

## Arquitectura del Flujo

```
[SOW / Brief / Archivo Maestro]
           │
           ▼
┌─────────────────────────────┐
│  HERMES (Extractor)         │
│  Ingiere → Extrae fases,    │
│  roles, entregables         │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  CÓDEX (Orchestrator)       │
│  Valida viabilidad          │
│  ¿Faltan definiciones?      │
└────────────┬────────────────┘
             │
     ┌───────┴───────┐
     ▼ SI            ▼ NO
┌──────────┐   ┌──────────┐
│ BLOQUEO  │   │  GAUSS   │
│ Preguntas│   │ Ejecución │
│ al user  │   │ directa   │
└──────────┘   └──────────┘
     │               │
     └───────┬───────┘
             ▼
    [Notion / Task System]
```

## Integración

- **OS Conductor**: Orquesta el flujo completo Laia Learning como pipeline de onboarding
- **Learning Always**: Complemento — Laia Learning prepara el contexto, Learning Always investiga y mejora
- **SDD Workflow**: Laia Learning puede alimentar la fase `explore` con contexto canónico
- **CLAUDE.md**: El `project-context.md` extiende las reglas base del proyecto

## ⚠️ Gotchas

### Contexto canónico no se actualiza solo
> Los archivos canónicos se crean al inicio del proyecto pero NO se sincronizan automáticamente con cambios posteriores.

- **Por qué**: Laia Learning es un protocolo de onboarding, no un sync engine. Los archivos reflejan el estado inicial acordado.
- **Solución**: Si el proyecto cambia significativamente, re-ejecutar `laia ingest` con el nuevo SOW o actualizar manualmente los archivos canónicos.

### Human-in-the-loop no es opcional
> El bloqueo por ambigüedad es molesto y tentador de skipear.

- **Por qué**: Sin las definiciones de negocio (fechas, responsables, criterios), Gauss ejecuta sobre supuestos y genera tareas incorrectas.
- **Solución**: Tratar cada bloqueo como una inversión — 5 minutos de preguntas ahora ahorran horas de corrección después.

### Prompts requieren contexto del proyecto
> Los prompts de Hermes/Códex/Gauss no funcionan sin los archivos canónicos poblados.

- **Por qué**: Están diseñados para operar sobre los datos del proyecto, no en vacío.
- **Solución**: Siempre ejecutar `laia init` antes de invocar cualquier prompt de agente.

## 💾 State Persistence

| Componente            | Persistencia | Mecanismo                                                             |
|----------------------|-------------|-----------------------------------------------------------------------|
| Archivos canónicos    | ✅ Archivo   | En `/Context/Canonical/` del proyecto                                 |
| Prompts de agente     | ✅ Archivo   | Definiciones estáticas en `02_Prompts/`                               |
| Workflow laia-init | ✅ Archivo   | En `03_Workflows/laia-init.md`                                    |
| Sesiones de proyecto  | ⚠️ Por proyecto | Historial de sesiones en `/Context/Sessions/` del proyecto           |

---

*Laia Learning v1.0 — Context Engineering & Project Onboarding — 2026-05-28*
