# 📋 Data Peek: Salud Intelligence

**Standard v4.2** | **Registros:** 10 | **Intensidad Primaria:** `age`

## 🔍 Muestra de Datos

| patient_id                                  | age                                  | diagnosis                                   | visit_date                                  | treatment_cost                                  | recovery_days                                  |
|--------------------------------------------|-------------------------------------|--------------------------------------------|--------------------------------------------|------------------------------------------------|-----------------------------------------------|
| P001                                        | 45                                   | Diabetes                                    | 2024-01-15                                  | 1200                                            | 30                                             |
| P002                                        | 62                                   | Hypertension                                | 2024-01-18                                  | 800                                             | 20                                             |
| P003                                        | 34                                   | Asthma                                      | 2024-01-20                                  | 600                                             | 15                                             |
| P004                                        | 58                                   | Diabetes                                    | 2024-01-22                                  | 1500                                            | 35                                             |
| P005                                        | 41                                   | Hypertension                                | 2024-01-25                                  | 750                                             | 18                                             |
| P006                                        | 29                                   | Asthma                                      | 2024-01-28                                  | 550                                             | 12                                             |
| P007                                        | 67                                   | Diabetes                                    | 2024-02-01                                  | 1800                                            | 40                                             |
| P008                                        | 52                                   | Hypertension                                | 2024-02-05                                  | 900                                             | 22                                             |
| P009                                        | 38                                   | Asthma                                      | 2024-02-08                                  | 650                                             | 14                                             |
| P010                                        | 55                                   | Diabetes                                    | 2024-02-12                                  | 1400                                            | 32                                             |

## 🧠 Clasificación Heurística
- **Dominio:** Salud
- **Métrica de Intensidad:** `age`
- **Ratios Aplicados:** Ninguno
- **Segmentos:** patient_id, diagnosis, visit_date


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
