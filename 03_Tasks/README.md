# 03_Tasks — Sistema de Tareas

**Versión:** 6.1
**Última actualización:** 2026-04-14
**Estado:** ✅ Activo

---

## 📂 Estructura (Workspace)

```
Think_Different/
├── 00_Winter_is_Coming/    # Estrategia, Backlog y ADN (ESTRATÉGICO)
├── 01_Core/               # Motor OS: Skills, Agents, MCPs (FUENTE DE VERDAD) 💾
├── 02_Knowledge/          # Base de Conocimiento, Research y Documentación
├── 03_Tasks/              # Gestión de Tareas Activas ✅
├── 04_Operations/         # Cerebro Operativo y Automatización
├── 05_Archive/            # Repositorio de Proyectos Finalizados
├── 06_Playground/         # Laboratorio de Pruebas y Experimentos
├── 07_Projects/           # Desarrollo de Proyectos Activos
├── 08_Scripts_Os/         # Scripts y HUBs Operativos del Sistema
└── Maerks/               # Entorno de Testing y Validación
```

---

## 📂 Estructura 03_Tasks

```
03_Tasks/
├── 00_Templates/                   # Plantillas oficiales (SOTA, Skeleton, AI)
├── 01_Tasks_Done/                 # Historial de hitos logrados
├── 02_Hillary_Inbox/               # Entrada de tareas sin procesar
├── 02-10_Consolidated_Tasks.md   # Logs consolidados v6.1
├── 00_P0_*.md                       # Tareas CRÍTICAS (System Guardian, Audience)
├── 03-10_P1_*.md                    # Tareas prioritarias (MCPs, Documentación)
└── *.md                             # Tareas activas (P2, etc.)
```

---

## 🎯 Sistema de Prioridades

| Prioridad    | Significado     | Límite     |
|--------------|-----------------|------------|
| **P0**       | Hacer hoy       | max 3      |
| **P1**       | Esta semana     | max 7      |
| **P2**       | Programado      |------------|
| **P3**       | Algún día       |------------|

### Estados de Tarea

| Estado     | Significado     |
|------------|-----------------|
| `n`        | not started     |
| `s`        | started         |
| `b`        | blocked         |
| `d`        | done            |

### Categorías

| Categoría     | Descripción                      |
|---------------|----------------------------------|
| `technical`   | build, fix, configure            |
| `outreach`    | communicate, meet                |
| `research`    | learn, analyze                   |
| `writing`     | draft, document                  |
| `admin`       | operations, finance, logistics   |
| `personal`    | health, routines                 |
| `other`       | everything else                  |

---

## 📝 Formato de Tarea

```yaml
---
title: [Nombre de tarea accionable]
category: [technical|outreach|research|writing|admin|personal|other]
priority: [P0|P1|P2|P3]
status: [n|s|b|d]

created_date: [YYYY-MM-DD]
due_date: [YYYY-MM-DD]  # opcional
estimated_time: [minutos]  # opcional

resource_refs:
  - 02_Knowledge/example.md
---

# [Nombre de tarea]

## Context

Vincular con goals y referenciar material.

## Next Actions

- [ ] Paso uno
- [ ] Paso dos

## Progress Log

- YYYY-MM-DD: Notas, bloqueos, decisiones.
```

---

## 🔄 Flujo de Trabajo

```
1. Agregar notas a BACKLOG.md (00_Winter_is_Coming/)
2. Decir "process my backlog" al AI
3. AI crea tareas en 03_Tasks/
4. Tareas se vinculan con GOALS.md
5. AI sugiere qué trabajar según prioridades
```

---

## 📚 Recursos

- [Templates](./00_Templates/README.md) — Plantillas disponibles
- [Ejemplos](./00_Templates/Examples/) — Ejemplos de tareas

---

> ⚠️ **Esta carpeta está gitignored** — Tus tareas bleiben privadas y locales.

---

*Think Different PersonalOS v6.1 — Tareas activas*
