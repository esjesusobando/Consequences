# 18_Personal_Life_OS

> **Categoría:** Personal Life OS — Hillary Integration  
> **Versión:** 1.0.0 — 2026-04-02  
> **Origen:** `06_Playground/Hillary_Life_OS/` (integrado a producción)

---

## 5 Skills del Sistema

| #                              | Skill                                          | Trigger                                                                       | Propósito                                                                              |
|-------------------------------|-----------------------------------------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| 01                             | **Quick Capture**                              | "capture", "quick add", "captura"                                             | Capturar ideas/tareas a markdown con frontmatter automático                            |
| 02                             | **Plan My Day**                                | "plan my day", "plan día", "organizar día"                                    | Transformar inbox en schedule por bloques de energía                                   |
| 03                             | **Daily Notes**                                | "daily notes", "log this", "registro diario"                                  | Observación activa — Yapper's API pattern                                              |
| 04                             | **Recording Mode**                             | "record", "transcribe", "recording mode"                                      | Transcripción + anonimización PII automática                                           |
| 05                             | **Returns Tracker**                            | "create skill from", "auto-skill", "track returns"                            | Detecta patrones → genera skills automáticos                                           |

---

## 🛠️ Documentación Operativa

- [SKILL.md](./SKILL.md) — Instrucciones detalladas para agentes (v6.1).

---

## Flujo de Integración

```
Quick Capture → 03_Task/02_Hillary_Inbox/   (inbox de capturas)
Plan My Day   → 03_Task/Daily_Routine.md    (schedule diario)
Daily Notes   → 03_Task/Daily_Activity_Log.md (observaciones)
Recording Mode → 03_Task/02_Hillary_Inbox/Transcripts/
Returns Tracker → 01_Personal_Os/01_Core/02_Tools/02_Skills/00_Personal_Os/01_Life_OS/99_Auto_Generated/ (auto-generated skills)
```

---

## Invocar el Orquestador

```
/hillary          # Activa workflow 04_Hillary/25_Hillary_Life_OS.md
"life os"         # Alias del orquestador
"personal productivity"
```

---

## RUNBOOK

Ver `01_Personal_Os/02_Knowledge/04_Docs/Hillary_Life_OS_RUNBOOK.md` para guía completa de uso.
