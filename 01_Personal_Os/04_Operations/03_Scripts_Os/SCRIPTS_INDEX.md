# Scripts Index — PersonalOS Think Different v2.0 Consequences

> **Total Scripts:** 98+ (HUBs + módulos + utilities)
> **Last Updated:** 2026-04-24
> **Validation:** Auditorías PASANDO - Sistema PURE GREEN + SCRIPT MIGRATION COMPLETE
> **Migration:** 12 scripts moved to skills using get_skill_script()
> **New:** 13_Auditors_Os folder created

---

## 📊 Estado del Sistema (Post-Migration 2026-04-20)

| Auditoría                     | Estado             | Notas                                                  |
|-------------------------------|--------------------|--------------------------------------------------------|
| **Estructura**                | ✅ PASS             | 10 carpetas (00-13) válidas                            |
| **Health**                    | ✅ PASS             | SALUDABLE                                              |
| **Skills**                    | ✅ FIXED            | 22 categorías — 100% con SKILL.md                      |
| **13_Auditors_Os**            | ✅ NEW              | Utilities + Beautify scripts                           |
| **Hub 07 rutas**              | ✅ FIXED            | `09_Integration/` (antes `Integration_Fixed`)          |
| **Hub 08 rutas**              | ✅ FIXED            | `04_Workflow/` (antes `Workflow_Fixed`)                |
| **PYTHONPATH**                | ✅ FIXED            | Todos los hubs pasan PYTHONPATH a sub-scripts          |
| **Scripts legacy**            | ✅ MOVED            | 9 scripts migrados de 10_Legacy a módulos              |
| **Hooks Windows**             | ✅ FIXED            | WinError 5 + emoji encoding resueltos                  |
| **Script Migration**          | ✅ DONE             | 12 scripts → skills using get_skill_script()           |
| **10_Legacy**                 | ✅ ARCHIVED         | `.backup/10_Legacy_backup_20260420/`                   |

---

## 🏗️ Orchestration HUBs (01_Personal_Os/04_Operations/03_Scripts_Os/)

| #             | Script                         | Purpose                             | Status             |
|---------------|--------------------------------|-------------------------------------|--------------------|
| 01            | `Auditor_Hub.py`               | Orquestador de Auditorías           | ✅ ACTIVO           |
| 02            | `Git_Hub.py`                   | Orquestador de Git/Repos            | ✅ ACTIVO           |
| 03            | `AIPM_Hub.py`                  | Métricas AIPM                       | ✅ ACTIVO           |
| 04            | `Ritual_Hub.py`                | Rituales (Start/End)                | ✅ ACTIVO           |
| 05            | `Validator_Hub.py`             | Validaciones                        | ✅ ACTIVO           |
| 06            | `Tool_Hub.py`                  | Herramientas                        | ✅ ACTIVO           |
| 07            | `Integration_Hub.py`           | Integraciones MCP                   | ✅ ACTIVO           |
| 08            | `Workflow_Hub.py`              | Workflows SOTA                      | ✅ ACTIVO           |
| 09            | `Data_Hub.py`                  | Datos/Sync                          | ✅ ACTIVO           |
| 10            | `General_Hub.py`               | Utilidades                          | ✅ ACTIVO           |
| 11            | `Auto_Learn_Hub.py`            | Motor de automejora                 | ✅ ACTIVO           |
| 12            | `Context_Usage_Bar.py`         | Barra de uso de contexto            | ✅ ACTIVO           |
| 13            | `Beautify_Tables.py`           | Formateo de tablas                  | ✅ ACTIVO           |
| 14            | `Beauty_Doc.py`                | Documentos embellecidos             | ✅ ACTIVO           |

### Usage

```bash
# Desde cualquier ubicación (aliases en .bashrc)
gr              # Auditor_Hub.py - Dry run
audit           # Auditor_Hub.py
git-hub         # Git_Hub.py
aipm            # AIPM_Hub.py
ritual          # Ritual_Hub.py
validate        # Validator_Hub.py

# O directamente
cd Think_Different
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py estructura
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py skills
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py health
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py profundo
```

---

## 📁 Estructura v6.1 (Confirmed)

```
Think_Different/
├── 00_Winter_is_Coming/     ✅ Goals, Backlog, 01_Personal_Os/11_AGENTS.md
├── 01_Core/                 ✅ Skills (19 cats), Agents, MCP, Server
│   └── 03_Skills/          # Skills numeradas (00-17)
├── 02_Knowledge/            ✅ Base de conocimiento
├── 03_Tasks/                ✅ 17+ tareas activas
├── 04_Operations/           ✅ Memoria, Brain, Notas
├── 05_Archive/              ✅ Repos, Legacy (v6.1: 01-09)
├── 07_Projects/             ✅ Proyectos
├── 01_Personal_Os/04_Operations/03_Scripts_Os/           ✅ 11 HUBs + Utilities
│   ├── 13_Auditors_Os/     ✅ Utilities (Beautify, Carousel, etc)
│   └── .backup/            ✅ 10_Legacy_archive
└── 13_Auditors_Os/          ✅ Utilidades OS (scripts orphans)
```

---

## 🎯 Skills (01_Personal_Os/01_Core/02_Tools/02_Skills/)

| #             | Categoría                                  | Skills                       |
|---------------|--------------------------------------------|------------------------------|
| #             | Categoría                                  | Sub-Skills                   | SKILL.md           |
|---------------|--------------------------------------------|------------------------------|--------------------|
| 00            | `00_Compound_Engineering`                  | 8                            | ✅                  |
| 00            | `00_Personal_Os_Stack`                     | Core OS                      | ✅                  |
| 00            | `00_Skill_Auditor`                         | Auditor                      | ✅                  |
| 01            | `01_Agent_Teams_Lite`                      | 14                           | ✅                  |
| 02            | `02_Project_Manager`                       | 8                            | ✅                  |
| 03            | `03_Product_Manager`                       | 8                            | ✅                  |
| 04            | `04_Product_Design`                        | 12                           | ✅                  |
| 05            | `05_Vibe_Coding`                           | 20                           | ✅                  |
| 06            | `06_Testing`                               | 17                           | ✅                  |
| 07            | `07_DevOps`                                | 12                           | ✅                  |
| 08            | `08_Personal_Os`                           | 18                           | ✅                  |
| 09            | `09_Marketing`                             | 14                           | ✅                  |
| 10            | `10_Backup`                                | 5                            | ✅                  |
| 11            | `11_Doc_Processing`                        | 3                            | ✅                  |
| 12            | `12_N8N`                                   | 7                            | ✅                  |
| 13            | `13_System_Master`                         | Master                       | ✅                  |
| 14            | `14_Anthropic_Harness`                     | 8                            | ✅                  |
| 15            | `15_Skill_Creator_Oficial`                 | 1                            | ✅                  |
| 16            | `16_Silicon_Valley_Data_Analyst`           | 3                            | ✅                  |
| 17            | `17_SEO_SOTA_Master`                       | 3                            | ✅                  |
| 18            | `18_Personal_Life_OS`                      | 5                            | ✅                  |
| 19            | `19_Video_Intel`                           | 3                            | ✅                  |
| 20            | `20_James_Cameron`                         | 4                            | ✅                  |
| 21            | `21_Skill_Template`                        | 1                            | ✅                  |

**Total: 22 categorías de skills — 100% documentadas con SKILL.md**

---

## 🔧 Legacy Scripts (Legacy_Backup/)

Scripts legacy en `01_Personal_Os/04_Operations/03_Scripts_Os/Legacy_Backup/` — referensiados por números:

| #               | Script                | Purpose                                  |
|-----------------|-----------------------|------------------------------------------|
| 00-90           | +80 scripts           | Workflows, AIPM, Quality, etc.           |

> ⚠️ Algunos scripts legacy pueden tener rutas obsoletas (`.agent/02_Skills`). Auditoría en progreso.

---

## ✅ Comandos del Sistema

| Comando                 | Función                             |
|-------------------------|-------------------------------------|
| `gr`                    | System Guardian (dry-run)           |
| `gr --apply`            | Aplicar fixes                       |
| `gr --agents`           | Agentes de revisión                 |
| `/sdd:*`                | SDD Workflow                        |
| `/ce:*`                 | Compound Engineering                |
| `engram`                | Memoria persistente                 |

---

## 📝 Notas Importantes

1. **Rutas v6.1**: Skills ahora en `01_Personal_Os/01_Core/02_Tools/02_Skills/` (antes `.agent/02_Skills/`)
2. **.bashrc**: Alias configurados con rutas absolutas
3. **34_Skill_Auditor.py**: Corregido para auto-detectar categorías

---

## 🔗 Scripts → Skills Mapping (2026-04-20)

Scripts migrados a skills usando `get_skill_script()`:

| Script                              | Skill Destino                         | Estado             |
|-------------------------------------|---------------------------------------|--------------------|
| `01_Spider_Brainstorm.py`           | 00_Compound_Engineering/scripts       | ✅                  |
| `02_Professor_X_Plan.py`            | 01_Agent_Teams_Lite/scripts           | ✅                  |
| `34_Skill_Auditor.py`               | 00_Skill_Auditor/scripts              | ✅                  |
| `53_Structure_Auditor.py`           | 00_Personal_Os_Stack/scripts          | ✅                  |
| `50_System_Health_Monitor.py`       | 08_Personal_Os/scripts                | ✅                  |
| `33_Parallel_Audit_Pro.py`          | 06_Testing/scripts                    | ✅                  |
| `57_Repo_Sync_Auditor.py`           | 07_DevOps/scripts                     | ✅                  |
| `08_Ritual_Cierre.py`               | 08_Personal_Os/scripts                | ✅                  |
| `14_Morning_Standup.py`             | 08_Personal_Os/scripts                | ✅                  |
| `09_Backlog_Triage.py`              | 02_Project_Manager/scripts            | ✅                  |
| `11_Sync_Notes.py`                  | 18_Personal_Life_OS/scripts           | ✅                  |
| `16_Clean_System.py`                | 13_System_Master/scripts              | ✅                  |

**Total: 12 scripts migrados — Todos resolviendo con get_skill_script()**
| `13_Validate_Stack.py`          | validate-stack       | ✅ Creado   |
| `12_Update_Links.py`            | update-links         | ✅ Creado   |
| `16_Clean_System.py`            | clean-system         | ✅ Creado   |
| `17_Ritual_Dominical.py`        | ritual-dominical     | ✅ Creado   |
| `57_Repo_Sync_Auditor.py`       | repo-sync            | ✅ Creado   |
| `50_System_Health_Monitor.py`   | system-guardian      | ✅ Existe   |

---

## 📁 Scripts por Carpeta (01_Ritual)

| Script                                  | Función                        |
|-----------------------------------------|--------------------------------|
| `08_Ritual_Cierre.py`                   | Cierre de sesión               |
| `09_Backlog_Triage.py`                  | Procesa backlog                |
| `11_Sync_Notes.py`                      | Sincroniza notas               |
| `12_Update_Links.py`                    | Actualiza enlaces              |
| `13_Validate_Stack.py`                  | Valida stack tech              |
| `14_Morning_Standup.py`                 | Daily standup                  |
| `15_Weekly_Review.py`                   | Weekly review                  |
| `16_Clean_System.py`                    | Limpia sistema                 |
| `17_Ritual_Dominical.py`                | Ritual dominical               |
| `18_Generacion_Contenido.py`            | Generación contenido           |
| `19_Generate_Progress.py`               | Dashboard progreso             |
| `50_System_Health_Monitor.py`           | Health monitor                 |
| `57_Repo_Sync_Auditor.py`               | Repo sync                      |

---

*Actualizado: 2026-04-01 — Estructura 05_Archive estandarizada (01-09)*
