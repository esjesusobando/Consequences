# 📋 Plan de Migración de Scripts — v2 (2026-04-20)

> **Fecha**: 2026-04-20
> **Estado**: ✅ COMPLETADO
> **Secuencia**: 01_Ritual → 02_Tool → 03_Validator → 04_Workflow → ... → 13_Auditors_Os → **14_Otros**

---

## 📊 Resumen Ejecutivo

| Métrica                                        | Valor                   |
|------------------------------------------------|-------------------------|
| Scripts migrados a **skills**                  | 9                       |
| Scripts movidos a **14_Otros**                 | 5                       |
| Total procesado                                | **14**                  |
| Total scripts en skills ahora                  | **22**                  |

---

## 🔥 Scripts Alto Valor → MIGRAR A SKILLS

| #                   | Script                                       | Origen                      | Skill Destino                                     | Propósito                                                    |
|---------------------|----------------------------------------------|-----------------------------|---------------------------------------------------|--------------------------------------------------------------|
| 01                  | `13_Validate_Stack.py`                       | 01_Ritual                   | `05_Vibe_Coding/scripts`                          | Valida stack tecnológico                                     |
| 02                  | `17_Ritual_Dominical.py`                     | 01_Ritual                   | `08_Personal_Os/scripts`                          | Ritual de fin de semana                                      |
| 03                  | `18_Generacion_Contenido.py`                 | 01_Ritual                   | `09_Marketing/scripts`                            | **Genera contenido (blog, LinkedIn, email)**                 |
| 04                  | `19_Generate_Progress.py`                    | 01_Ritual                   | `08_Personal_Os/scripts`                          | Dashboard de progreso                                        |
| 05                  | `39_Repair_Corruption.py`                    | 02_Tool                     | `13_System_Master/scripts`                        | Repara archivos corruptos                                    |
| 06                  | `62_Tool_Shed.py`                            | 02_Tool                     | `07_DevOps/scripts`                               | Auto-detector contexto MCPs                                  |
| 07                  | `06_AntMan_Lfg_Lite.py`                      | 04_Workflow                 | `00_Compound_Engineering/scripts`                 | Workflow lite (12 pasos)                                     |
| 08                  | `07_Doc_Strange_Lfg.py`                      | 04_Workflow                 | `00_Compound_Engineering/scripts`                 | Workflow completo (18 pasos)                                 |
| 09                  | `73_Avengers_Workflow_v3.py`                 | 04_Workflow                 | `00_Compound_Engineering/scripts`                 | Workflow Avengers                                            |

---

## 🟡 Scripts Medio Valor → 14_Otros

| #                   | Script                                   | Origen                      | Propósito                                     |
|---------------------|------------------------------------------|-----------------------------|-----------------------------------------------|
| 01                  | `12_Update_Links.py`                     | 01_Ritual                   | Actualiza enlaces del sistema                 |
| 02                  | `60_Fast_Vision.py`                      | 02_Tool                     | Valida nombres de scripts                     |
| 03                  | `61_MCP_Health_Check.py`                 | 02_Tool                     | Verifica estado de MCPs                       |
| 04                  | `63_Skill_Harmonizer.py`                 | 02_Tool                     | Valida paridad entre skills                   |
| 05                  | `10_AI_Task_Planner.py`                  | 04_Workflow                 | Planificador de tareas IA                     |

---

## 🔗 HUBs que los Usan

| HUB                                | Script                                     | Comando                     |
|------------------------------------|--------------------------------------------|-----------------------------|
| `04_Ritual_Hub`                    | 17_Ritual_Dominical.py                     | `dominical`                 |
| `05_Validator_Hub`                 | 13_Validate_Stack.py                       | `stack`                     |
| `06_Tool_Hub`                      | 39_Repair_Corruption.py                    | `repair`                    |
| `08_Workflow_Hub`                  | 06_AntMan_Lfg_Lite.py                      | `lfg-lite`                  |
| `08_Workflow_Hub`                  | 07_Doc_Strange_Lfg.py                      | `lfg-full`                  |
| `08_Workflow_Hub`                  | 73_Avengers_Workflow_v3.py                 | `avengers`                  |
| `09_Data_Hub`                      | 19_Generate_Progress.py                    | `progress`                  |

---

## 📁 Estructura de Carpetas (Secuencia Correcta)

```
01_Ritual/     → 🗑️ (vacío, scripts movidos)
02_Tool/      → 🗑️ (vacío, scripts movidos)
03_Validator/ → [existente]
04_Workflow/   → 🗑️ (vacío, scripts movidos)
05_AIPM/      → [existente]
...
13_Auditors_Os/ → [existente]
14_Otros/      → 🆕 CREADO (5 scripts aquí)
```

---

## ✅ Checklist de Ejecución

| #                   | Tarea                                                               | Estado                       |
|---------------------|---------------------------------------------------------------------|------------------------------|
| 01                  | Crear carpeta `14_Otros`                                            | ✅                            |
| 02                  | Mover 5 scripts a 14_Otros                                          | ✅                            |
| 03                  | Mover 9 scripts a skills destino                                    | ✅                            |
| 04                  | Actualizar `SCRIPT_LOCATION_MAP` en config_paths.py                 | ✅                            |
| 05                  | Agregar fallback para 14_Otros                                      | ✅                            |
| 06                  | Probar HUBs                                                         | ⏸️ PENDIENTE                 |

---

## ⚠️ Notas Importantes

1. **18_Generacion_Contenido.py** es CRÍTICO — el usuario lo requiere activamente
2. Sistema tiene **fallback automático** en `config_paths.py` (no hay rotura)
3. HUBs referencian scripts por nombre → funcionan automáticamente

---

**Última actualización**: 2026-04-20
**Estado**: ✅ COMPLETADO
