---
name: fantasticos
description: >
  Metodología 4 FANTÁSTICOS — Formación 4-3-3: Swarm + Auditor + Engram + Docs. 
  Para tareas multi-carpeta con verificación continua. Activa cuando: "verificación completa", 
  "audita esto", "revisá todo", "múltiples carpetas", "4 fantásticaos".
---

# ✨ 4 FANTÁSTICOS — Swarm + Auditor + Engram + Docs

## Esencia Original

> **Metaskill**: Metodología completa de 4 fases: ejecución + verificación + persistencia + documentación.

Esta skill es el **full stack de calidad** del PersonalOS. Asegura que cada tarea se ejecute, verifique, guarde y documente.

## Principio Fundamental

**4 agentes trabajando en cadena: Swarm ejecuta → Auditor verifica → Engram persiste → Docs documenta.**
Calidad del trabajo de uno determina la calidad del siguiente.

## Cuándo Usar 4 FANTÁSTICOS

| Scenario                               | Ejemplo                                             |
|----------------------------------------|-----------------------------------------------------|
| Tareas multi-carpeta                   | "Migra todas las carpetas de X a Y"                 |
| Verificación continua                  | "Audita todo el sistema"                            |
| Revisión completa                      | "Revisá que todo esté bien"                         |
| Migración con rollback                 | "Mové esto pero mantene un backup"                  |

## Formación 4 FANTÁSTICOS

```
    ┌────────────────────────────────────────┐
    │  1️⃣ AGENTE TRABAJO (SWARM)            │ ← Jugadores en campo
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
    │  4️⃣ DREAM_TEAM (Docs)                 │ ← Reportero
    │  Documenta metodología                 │
    └────────────────────────────────────────┘
```

## Flujo de Trabajo

### Fase 1: Swarm (Ejecución)
```python
# Fase 1: Agentes de trabajo ejecutan la tarea
agentes_trabajo = [
    {"rol": "explorer", "tarea": "Explorar carpeta A"},
    {"rol": "builder", "tarea": "Transformar archivos"},
    {"rol": "validator", "tarea": "Verificar consistencia"},
]
# Ejecutar en paralelo
```

### Fase 2: Auditor (Verificación)
```python
# Fase 2: Auditor hace compare
auditor = {
    "check": "plan_vs_real",
    "detectar": "faltas",
    "reportar": "issues",
}
# Revisa que lo planificado == lo ejecutado
```

### Fase 3: Engram (Persistencia)
```python
# Fase 3: Guardar en memoria persistente
engram_mem_save({
    "title": "Migración [nombre] completada",
    "type": "discovery",
    "content": {
        "qué": "Qué se hizo",
        "dónde": "Archivos affected",
        "aprendido": "Gotchas"
    }
})
```

### Fase 4: Docs (Documentación)
```python
# Fase 4: Documentar la metodología usada
doc = {
    "ubicación": "02_Knowledge/04_Docs/",
    "formato": "[fecha]_[tarea]_report.md",
    "contenido": " steps taken + results + learnings"
}
```

## Ejemplo Real: Migración de Rutas

```
Usuario: "Migra todas las rutas de skills de la raíz a 01_Core/"

→ ORQUESTADOR despliega 4 FANTÁSTICOS
    │
    ├─ SWARM (6 agentes): Mueven archivos
    │   - 14 commits de migración
    │   - 0 rutas obsoletas en archivos activos
    │
    ├─ AUDITOR: Verifica que todo compiles
    │   - Detecta 3 issues
    │   - Fija los 3
    │
    ├─ ENGRAM: Guarda el progreso
    │   - "Migration tracks completed"
    │
    └─ DOCS: Documenta la metodología
        - Reporte en Knowledge/
```

## Integración con Otras Metodologías

| Metodología                         | Relación                                                         |
|-------------------------------------|------------------------------------------------------------------|
| **OCTOPUS**                         | 4F es más complejo, incluye verificación                         |
| **Super Campeones**                 | Similar pero 4F es específico para multi-carpeta                 |
| **SDD**                             | 4F puede ejecutar tasks del SDD                                  |

## Gotchas

- ❌ NO usar para tareas simples (overhead innecesario)
- ✅ USAR para tareas que requieren rollback
- ✅ SIEMPRE guardar en Engram ANTES de retornar
- ✅ SIEMPRE documentar en Docs antes de cerrar
- ✅ AUDITOR debe ser independiente del SWARM

## Diferencia con otras Formaciones

| Formación                           | Complejidad                   | Verificación                    | Docs                   | Memoria                    |
|-------------------------------------|-------------------------------|---------------------------------|------------------------|----------------------------|
| **OCTOPUS**                         | Baja                          | ❌                               | ❌                      | ❌                          |
| **Super Campeones**                 | Alta                          | ✅                               | ✅                      | ✅                          | ✅ |
| **4 FANTÁSTICOS**                   | Media                         | ✅                               | ✅                      | ✅                          |

---

*Metodología derivada de Dream Team patterns — Optimizado para Claude Code*
