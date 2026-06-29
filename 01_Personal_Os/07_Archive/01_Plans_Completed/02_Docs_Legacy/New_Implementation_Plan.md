> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# Plan de Acción — Auditoría Integral v4.7 y Actualización SOTA

Proporcionamos a continuación el plan exhaustivo basado en tu solicitud de revisar el proyecto, actualizar rutas, dependencias, estado del arte, y resolver posibles bugs sin eliminar información útil. Hemos tomado en cuenta la planificación previa detectada en el repositorio (`00_Plan_Auditoria_2026-05-24.md`).

## User Review Required

> [!CAUTION]
> **Seguridad (FASE 0):** Existen API keys expuestas en texto plano dentro del archivo `.env` o en otros lugares del proyecto según la auditoría previa. Necesito que confirmes si deseas que rote manualmente las llaves y configure el `.gitignore` apropiadamente para bloquear subir secretos al repositorio.
> 
> **Reescritura de Historial:** La purga de `.env` del historial de Git implica ejecutar `git filter-repo`. Por favor, aprueba si este paso es seguro dado tu flujo de trabajo con el repositorio remoto.

## Open Questions

> [!WARNING]
> ¿Deseas que proceda con la eliminación automática de los scripts detectados como duplicados (ej. `01_Personal_Os/04_Operations/03_Scripts_Os/10_Legacy/config_paths.py`, o los encontrados en Playground)?
> ¿Hay algún script o skill específico que quieres que refactorice o adapte a nuevas tecnologías (Estado del Arte) en esta sesión?

## Proposed Changes

### FASE 0: Seguridad (Prioridad Crítica)
- Modificaremos `.gitignore` para asegurar el bloqueo estricto del archivo `.env` y `.env.*`.
- Eliminaremos el tracking de `.env` en Git si aún se encuentra bajo seguimiento de versión.
- Evaluaremos el archivo `.env` y reportaremos qué claves necesitan ser rotadas (u ofuscaremos/eliminaremos las hardcodeadas en caso de no poder rotarlas, documentando todo).
- Revisaremos que el hook de pre-commit (`secret_scanner.py`) funcione para prevenir futuros leaks.

### FASE 1: Configuración y Resolución de Bugs (Runtime)
- **Sincronización:** Actualizaremos `.agent/CLAUDE.md` y `.agent/README.md` para que reflejen correctamente la versión v4.7 del OS y las cifras reales de skills/agentes.
- **Rutas de Scripts:** En `01_Personal_Os/04_Operations/03_Scripts_Os/config_paths.py`, eliminaremos dependencias muertas (ej. `pattern_engine`) que ocasionan errores.
- **Limpieza de duplicados:** Identificar y consolidar versiones duplicadas de `config_paths.py` en subdirectorios no-legacy, manteniendo siempre la información.
- **Dependencias:** Revisaremos `Requirements.txt` para asegurar que las versiones pinneadas estén vigentes o que los upper-bounds no bloqueen el estado del arte.

### FASE 2: Documentación y Unificación
- **Inventario:** Ejecutar conteos reales de Skills, Agentes, y Scripts.
- Actualizar y unificar las cifras de inventario en todos los documentos raíz: `README.md`, `OS_DIRECTORY.md`, `00_Winter_is_Coming/AGENTS.md`, `CLAUDE.md`, `Structure_v4.7.md`.
- Adecuar la estructura documentada en `README.md` a la estructura real del proyecto (como en `02_Playground/`).

### FASE 3: Limpieza y Reorganización de Carpetas
- **Rutas y Carpetas:** Renombraremos la carpeta `02_Playground/02_Workflow_N8N/` a `04_Workflow_N8N/` (verificando antes que no genere conflicto con `04_Side Project` e integrándolo al flujo correcto).
- Análisis de scripts de Testing (ej. `01_OS_Runtime_Test.py`, `05_OS_Health_Test.py`, `06_OS_Deep_Audit.py`) en Playground para consolidarlos o documentar sus propósitos sin perder datos.
- Eliminación de extractos obsoletos en `CLAUDE.md` pasándolos a una carpeta de archivo (`05_Archive/`) como dicta tu regla de no eliminar información valiosa.

### FASE 4: SOTA (State of the Art) y Polish Final
- Unificaremos de forma global el sello de la versión en "v4.7 Consequences" en toda la documentación.
- Verificaremos el funcionamiento de los `HUBs` (especialmente `19_Agent_Sync_Hub.py`) para confirmar la sincronía.
- Revisaremos la estructura general de código en Python/JS según aplique (Regla: no var, types estrictos en JS/TS, uso de convenciones establecidas) para alinear al estándar SOTA.
- Actualizar `Structure_v4.7.md` para plasmar el diseño actualizado al término del proceso.

## Verification Plan

### Automated Tests
- Validar salud del OS: Correremos `python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py`.
- Generar manifiestos y verificar que no hayan errores de parseo: `python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan`.

### Manual Verification
- Solicitaré tu revisión tras completar el cambio masivo de rutas/nomenclaturas para que asegures que los scripts no se rompen en tu entorno local.
- Confirmación visual de las cifras reportadas en `README.md`.
