# 📓 28_NP Hillary SSOT & Route Redirection

**Fecha**: 2026-04-14  
**Contexto**: Refactorización de Arquitectura  
**Decisión**: 03_Tasks como Fuente Única de Verdad (SSOT)

## 🔄 Lógica de Redirección SOTA

Se ha ejecutado una refactorización masiva de las instrucciones (`SKILL.md`) de los 5 módulos del Life OS para centralizar toda la persistencia de datos en la dimensión `03_Tasks`.

### 📂 Mapeo de Destinos Finales

| Módulo             | Ruta Original (Lab)         | Nueva Ruta (Producción)                  |
|--------------------|-----------------------------|------------------------------------------|
| 01 Quick Capture   | `01_Quick_Capture/inbox/`   | `03_Tasks/02_Hillary_Inbox/`             |
| 02 Plan My Day     | `02_Plan_My_Day/output/`    | `03_Tasks/Daily_Routine.md`              |
| 03 Daily Notes     | `03_Daily_Notes/logs/`      | `03_Tasks/Daily_Activity_Log.md`         |
| 04 Recording Mode  | `02_Knowledge/transcripts/` | `03_Tasks/02_Hillary_Inbox/Transcripts/` |
| 05 Returns Tracker | Analizaba localmente        | Analiza `03_Tasks/` (Cross-check)        |

## 🛡️ Política de Preservación "No-Delete"

Siguiendo el requerimiento del usuario ("no elimines nada de lo que ya está"), se han mantenido las carpetas locales antiguas en la Skill 18.
- **Estado**: Las carpetas internas (`inbox/`, `logs/`, etc.) permanecen como legado técnico.
- **Acción**: Los agentes tienen prohibido escribir en ellas; solo deben usar las rutas de `03_Tasks/`.

## ⚙️ Automatización de Rutinas
Se ha integrado el uso de la plantilla `06_Routine_Master.md` para asegurar que el output de Hillary sea consistente y estructurado bajo los estándares de PersonalOS v6.1.

---
*Documentación SOTA | Think Different PersonalOS*
