# Organización de Archivos y Backups (v6.1) - Final

Este plan detalla la estructura final de los respaldos históricos y la organización de la actual sesión de reestructuración, siguiendo estrictamente las preferencias de nomenclatura del usuario.

## User Review Required

> [!IMPORTANT]
> **Preservación de Nombres**: Los archivos `AGENTS.md`, `README.md` y `classify_task.md` mantendrán su nombre original sin prefijos numéricos en las carpetas de backup, tal como se solicitó.

> [!IMPORTANT]
> **Carpeta de Sesión**: La actual sesión de rebalanceo se consolidará en la ruta `05_Archive/plans_completed/01_Reorg_Workflow_Agent/`.

## Proposed Changes

### [Componente] 01_Core/04_Agents/ (Auditoría Final)

#### [VERIFY] 14_React_Test_Implementer.md
* Confirmación final de estado "Pure Green" en el directorio raíz.

---

### [Componente] 05_Archive/backup_agents_renumber/

#### [REORG] Jerarquización Temática
* Crear y mover a subcarpetas:
    - `01_Dream_Team/` (Agentes 01-05 del Dream Team)
    - `02_Specialists/` (Especialistas del Squad)
    - `03_Growth/` (Marketing & Carousel)

---

### [Componente] 05_Archive/backup_workflows_flat/

#### [ENUM] Normalización Selectiva
* Mantener nombres originales para: `AGENTS.md`, `README.md`, `classify_task.md`.
* Los flujos del 01 al 25 se mantienen con su numeración actual para referencia histórica rápida.

---

### [Componente] 05_Archive/plans_completed/

#### [ENUM] Consolidación de Sesión
* **[NEW] [01_Reorg_Workflow_Agent/](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/05_Archive/plans_completed/01_Reorg_Workflow_Agent/)**
* Mover todos los archivos `.md` de la sesión actual de la raíz de `plans_completed` a esta subcarpeta:
    - `implementation_plan.md`
    - `task.md`
    - `walkthrough.md`
    - Planes anteriores (`Avengers_Plan.md`, etc.) que correspondan a esta fase de reorg.

## Open Questions

> [!NOTE]
> ¿Deseas que movamos también los planes más antiguos (ej. de marzo) a carpetas similares `02_...`, `03_...` o solo nos enfocamos en el actual `01_`?

## Verification Plan

### Automated Tests
- `python 03_Scripts_Os/01_Auditor_Hub.py estructura`: Validar el árbol final de archivo.
- `dir 05_Archive\plans_completed\01_Reorg_Workflow_Agent`: Validar la correcta migración de archivos.

### Manual Verification
- Confirmar que los nombres de los archivos en backup de workflows siguen siendo legibles y no interfieren con el sistema de rastreo.
