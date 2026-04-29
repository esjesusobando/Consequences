# Plan de Implementación: Mapeo y Cleanup Sistémico (Scripts ↔ Skills)

Este plan detalla la reubicación física de los scripts modulares dentro de sus carpetas de Habilidades (`01_Core/03_Skills/`), siguiendo el principio de **"Encapsulación SOTA"**.

## Objetivo
Reducir la carga cognitiva en `03_Scripts_Os`, centralizar la lógica operativa en las habilidades que la utilizan y asegurar que los HUBs orquestadores sigan funcionando sin fricción.

## Mapeo Detallado ("MAPEA BIEN")

A continuación, se detalla el destino de cada script. Cada carpeta de Skill destino recibirá un subdirectorio `scripts/`.

### 1. Sistema y Auditoría (Core)
| Script | Skill Destino | Justificación |
| :--- | :--- | :--- |
| `06_Auditor/34_Skill_Auditor.py` | `00_Skill_Auditor` | Auditoría de Habilidades. |
| `06_Auditor/53_Structure_Auditor.py` | `00_Personal_Os_Stack` | Validación de Estructura Base. |
| `06_Auditor/50_System_Health_Monitor.py` | `08_Personal_Os` | Monitor de Salud del Sistema. |
| `06_Auditor/33_Parallel_Audit_Pro.py` | `06_Testing` | Pruebas de Estrés y Auditoría Paralela. |
| `06_Auditor/57_Repo_Sync_Auditor.py` | `07_DevOps` | Auditoría de Repositorios. |

### 2. Rituales y Gestión (Business Process)
| Script | Skill Destino | Justificación |
| :--- | :--- | :--- |
| `01_Ritual/08_Ritual_Cierre.py` | `08_Personal_Os` | Protocolo de Cierre SOTA. |
| `01_Ritual/14_Morning_Standup.py` | `08_Personal_Os` | Reunión de Arranque. |
| `01_Ritual/09_Backlog_Triage.py` | `02_Project_Manager` | Clasificación de Tareas. |
| `01_Ritual/11_Sync_Notes.py` | `18_Personal_Life_OS` | Sincronización de Vida/Notas. |
| `01_Ritual/16_Clean_System.py` | `13_System_Master` | Mantenimiento Técnico. |

### 3. Workflow y Estrategia (Product/Growth)
| Script | Skill Destino | Justificación |
| :--- | :--- | :--- |
| `04_Workflow/01_Spider_Brainstorm.py` | `00_Compound_Engineering` | Ingeniería de Ideas. |
| `04_Workflow/02_Professor_X_Plan.py` | `01_Agent_Teams_Lite` | Orquestador de Planes. |
| `16_Carousel_Engine.py` | `28_Carousel_Master` | Generación de Contenido. |
| `17_Preview_Generator.js` | `28_Carousel_Master` | Visualización de Contenido. |

### 4. Herramientas y Documentos (Quality/Scaffolding)
| Script | Skill Destino | Justificación |
| :--- | :--- | :--- |
| `13_Beautify_Tables.py` | `11_Doc_Processing` | Formateo de Markdown. |
| `14_Beauty_Doc.py` | `11_Doc_Processing` | Estética Documental. |
| `02_Tool/00_Notifier.py` | `13_System_Master` | Sistema de Alertas. |

---

## Cambios Técnicos en el Core

> [!CAUTION]
> **Riesgo de Rotura de Flujo**: Mover scripts rompe las importaciones si no se actualiza el `sys.path` o `config_paths.py`.

### [MODIFY] [config_paths.py](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/03_Scripts_Os/config_paths.py)
Añadiremos una función `get_skill_script(skill_name, script_name)` que resuelva dinámicamente la ruta, permitiendo que los HUBs localicen sus módulos sin importar dónde se muevan.

### [MODIFY] Orquestadores (HUBs)
Se actualizarán los HUBs para usar el nuevo buscador de scripts. Esto "liberará" visualmente las carpetas de `03_Scripts_Os` eliminando los subdirectorios `01_Ritual`, `02_Tool`, etc., una vez vaciados.

---

## Plan de Ejecución

1. **Batch 1 (Auditoría)**: Mover módulos de `06_Auditor` -> Skills. Verificar con `Auditor_Hub.py`.
2. **Batch 2 (Rituales)**: Mover módulos de `01_Ritual` -> Skills. Verificar con `Ritual_Hub.py`.
3. **Batch 3 (Workflows)**: Mover módulos de `04_Workflow` -> Skills. Verificar con `Workflow_Hub.py`.
4. **Cleanup**: Eliminar carpetas vacías en `03_Scripts_Os` y actualizar `SCRIPTS_INDEX.md`.

## Verificación
- `/sdd:verify` sobre la nueva estructura.
- Ejecución de auditoría completa: `python 03_Scripts_Os/15_SOTA_Integrity_Check.py`.
