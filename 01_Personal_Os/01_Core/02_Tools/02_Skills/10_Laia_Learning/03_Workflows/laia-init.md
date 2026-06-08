# ⚙️ Workflow: Laia Init

> Pipeline completo de onboarding de proyecto: SOW → Canonical → Validación → Ejecución.

## Fase 1: Init — Crear estructura del proyecto

```bash
mkdir -p /ruta/proyecto/Context/Canonical
mkdir -p /ruta/proyecto/Context/Sessions
mkdir -p /ruta/proyecto/Workstreams
```

## Fase 2: Ingest — Poblar archivos canónicos

```
Input:  SOW / brief / archivo maestro
Agent:  Hermes (Extractor)
Output: project-context.md, project-brief.md, project-operating-data.md
        + Lista de ambigüedades
```

## Fase 3: Validate — Human-in-the-Loop

```
Input:  Archivos canónicos + ambigüedades
Agent:  Códex (Orchestrator)
Output: 
  - Si hay ambigüedades críticas → Cuestionario al usuario → BLOQUEO
  - Si no → Green light
Proceso:
  1. Códex revisa fechas, responsables, modo de organización
  2. Si falta algo → genera preguntas numeradas
  3. Usuario responde → archivo guardado en Context/Sessions/
  4. Códex re-evalúa → Green light o más preguntas
```

## Fase 4: Execute — Poblar task system

```
Input:  Archivos canónicos completos + respuestas del usuario
Agent:  Gauss (Executor)
Output: Base de datos poblada (Notion / tareas)
Proceso:
  1. Segmentar en bloques semanales (UI/Build/QA)
  2. Inferir bloques faltantes por dependencias técnicas
  3. Insertar tareas con propiedades mínimas
  4. Documentar inferencias en archivo de sesión
```

## Fase 5: Review — Verificación final

```bash
# Verificar que todos los archivos existen
ls /ruta/proyecto/Context/Canonical/

# Verificar que no hay [PENDIENTE] residual
grep -r "PENDIENTE" /ruta/proyecto/Context/Canonical/

# Verificar tareas en Notion / task system
```

## Integración con OS Conductor

Este workflow se invoca desde el OS Conductor cuando detecta un proyecto nuevo:

```
Trigger: user dice "nuevo proyecto", "onboarding", "setup project"
OS Conductor → Laia Init
  1. Pregunta ruta del SOW
  2. Invoca Hermes (ingest)
  3. Invoca Códex (validate)
  4. Si bloqueo → mostrar preguntas al usuario
  5. Invoca Gauss (execute)
  6. Reportar resultado
```
