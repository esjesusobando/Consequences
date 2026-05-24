# ✨ 4 Fantásticos — Swarm + Auditor + Engram + Docs

> **Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Concepto

Metodología completa de 4 fases: ejecución + verificación + persistencia + documentación. Asegura que cada tarea se ejecute, verifique, guarde y documente.

## Skill

`26_Fantasticos/SKILL.md` — Skill completa con runbook y estándares

## Formación 4 Fantásticos

```
┌────────────────────────────────────────┐
│  1️⃣ SWARM (Trabajo)                   │ ← Jugadores en campo
│  Múltiples agentes paralelos           │
└─────────────────┬──────────────────────┘
                  │
┌─────────────────┴──────────────────────┐
│  2️⃣ AUDITOR (Árbitro)                 │ ← Verifica jugadas
│  Plan vs Real - detecta faltas         │
└─────────────────┬──────────────────────┘
                  │
┌─────────────────┴──────────────────────┐
│  3️⃣ ENGRAM (Memoria)                  │ ← Persistencia
│  Guarda progreso y decisiones          │
└─────────────────┬──────────────────────┘
                  │
┌─────────────────┴──────────────────────┐
│  4️⃣ DOCS (Dream Team)                 │ ← Reportero
│  Documenta metodología                 │
└────────────────────────────────────────┘
```

## Cuándo Usar

| Scenario              | Ejemplo                            |
|----------------------|-----------------------------------|
| Tareas multi-carpeta  | "Migra todas las carpetas de X a Y"|
| Verificación continua | "Audita todo el sistema"           |
| Revisión completa     | "Revisá que todo esté bien"        |
| Migración con rollback| "Mové esto pero mantene backup"    |

## Runbook

### Fase 1: Swarm (Ejecución)
```python
agentes_trabajo = [
    {"rol": "explorer", "tarea": "Explorar carpeta A"},
    {"rol": "builder", "tarea": "Transformar archivos"},
    {"rol": "validator", "tarea": "Verificar consistencia"},
]
```

### Fase 2: Auditor (Verificación)
```python
auditor = {
    "check": "plan_vs_real",
    "detectar": "faltas",
    "reportar": "issues",
}
```

### Fase 3: Engram (Persistencia)
```python
engram_mem_save({
    "title": "Migración [nombre] completada",
    "type": "discovery",
    "content": {...}
})
```

### Fase 4: Docs (Documentación)
```python
doc = {
    "ubicación": "02_Knowledge/04_Docs/",
    "formato": "[fecha]_[tarea]_report.md"
}
```

## Comparación con otras Formaciones

| Formación          | Complejidad  | Verificación  | Docs   | Memoria  |
|-------------------|-------------|--------------|-------|---------|
| **Octopus**        | Baja         | ❌             | ❌      | ❌        |
| **4 Fantásticos**  | Media        | ✅             | ✅      | ✅        |
| **Super Campeones**| Alta         | ✅             | ✅      | ✅        |

## Gotchas

- ❌ NO usar para tareas simples (overhead innecesario)
- ✅ USAR para tareas que requieren rollback
- ✅ SIEMPRE guardar en Engram ANTES de retornar
- ✅ SIEMPRE documentar en Docs antes de cerrar
- ✅ AUDITOR debe ser independiente del SWARM

---

*4 Fantásticos v1.0 — 2026-05-19*
