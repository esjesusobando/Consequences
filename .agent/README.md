# 🤖 Folder .agent - PersonalOS v4.7 Consequences

## ⚙️ Configuración del Sistema de Agentes

Este directorio contiene la configuración de agentes, skills y hooks de PersonalOS.

> **NOTE:** `.agent/` es **BACKUP ESTRATÉGICO** sincronizado con `01_Personal_Os/01_Core/`. La fuente de verdad es `01_Personal_Os/01_Core/`.

---

## 📂 Estructura .agent/ (v3.1 — Backup)

| Directorio           | Contenido                                | Fuente de verdad                               |
|----------------------|------------------------------------------|------------------------------------------------|
| **00_Rules/**        | 11 reglas activas (.mdc)                 | `01_Personal_Os/01_Core/01_Rules/`             |
| **01_Agents/**       | Agentes configurados (52+)               | `01_Personal_Os/01_Core/02_Tools/01_Agents/`   |
| **02_Skills/**       | Skills organizadas (backup)              | `01_Personal_Os/01_Core/02_Tools/02_Skills/`   |
| **03_Workflows/**    | Workflows del sistema                    | `01_Personal_Os/01_Core/00_Workflows_Os/`      |
| **04_Extensions/**   | Hooks system (Pre/Post/Lifecycle/Sound)  | Local                                          |
| **05_GGA/**          | Gentleman Guardian Angel (Code Review)   | `.agent/05_GGA/`                               |

---

## 📂 Estructura Principal (v3.1 Consequences — 4 carpetas raíz)

| Carpeta                             | Contenido                                                |
|-------------------------------------|----------------------------------------------------------|
| **00_Winter_is_Coming/**            | Goals, Backlog, AGENTS.md (ESTRATÉGICO)                  |
| **01_Personal_Os/**                 | El sistema operativo completo                            |
| **01_Personal_Os/01_Core/**         | Motor: Skills (11 áreas, 299), Rules (11), MCPs (35), Tools |
| **01_Personal_Os/02_Knowledge/**    | Documentación, Research, Notas                           |
| **01_Personal_Os/03_Task/**         | Tareas activas                                           |
| **01_Personal_Os/04_Operations/**   | Operativo: Scripts (23), Auto-Mejora, Projects, Context LLM |
| **01_Personal_Os/05_Archive/**      | Legacy archivado                                         |
| **02_Playground/**                  | Zona de pruebas (no contamina el OS)                     |
| **03_Resultado/**                   | Outputs de proyectos                                     |

---

## 🔌 Claude Code Plugins

| Plugin              | Versión     | Componentes            |
|---------------------|-------------|------------------------|
| pr-review-toolkit   | 1.0.0       | 6 agents + 1 command   |
| security-guidance   | 1.0.0       | hooks                  |
| agent-sdk-dev       | 1.0.0       | agents + commands      |
| claude-code-setup   | 1.0.0       | skills                 |

**Ubicación:** `C:\Users\sebas\.claude\plugins\cache\claude-plugins-official\`

---

## 🎯 Skills Disponibles (12 áreas activas — 394 skills)

### Por Categoría (`01_Personal_Os/01_Core/02_Tools/02_Skills/`)

| Categoría                 | Contenido                              | Estado     |
|---------------------------|----------------------------------------|------------|
| 00_Compound_Engineering   | Core CE — SDD + Reviews                | ✅          |
| 00_Personal_Os_Stack      | Stack base OS + Gcierr                 | ✅          |
| 00_Skill_Auditor          | Auditoría y validación de skills       | ✅          |
| 01_Creacion_Contenidos    | Brand, YouTube, SEO, Carruseles        | ✅          |
| 02_Diseno_Ui_Ux           | Product Design, UI/UX, Taste, Minimal  | ✅          |
| 03_Video_Media            | Video Intel, James Cameron, Remotion   | ✅          |
| 04_Automatizacion         | N8N, Firecrawl                         | ✅          |
| 05_Workflows              | Agent Teams, PM, Orchestrator          | ✅          |
| 06_Tools                  | Skill Creator, Testing, DevOps, Data   | ✅          |
| 07_Personal_Os            | Life OS, Hillary, Rituales             | ✅          |
| 08_Invictus_Web           | Playwright, Superpowers, Browser Auto  | ✅          |

### TASTE-SKILLS (PRIORIDAD ALTA PARA FRONTEND)

**Ubicación:** `01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/`

| Skill                  | Uso                               |
|------------------------|-----------------------------------|
| **taste-skill**        | Diseño desde cero - premium       |
| **soft-skill**         | Proyectos premium, invitaciones   |
| **minimalist-skill**   | Estilo Notion/Linear              |
| **redesign-skill**     | Mejorar proyectos existentes      |
| **output-skill**       | Evita código incompleto           |

---

## 📋 HUBs del Sistema (19 + 4 auxiliares = 23 scripts)

**Ubicación:** `01_Personal_Os/04_Operations/03_Scripts_Os/`

| Hub                     | Script                                             | Proposito                                                      |
|-------------------------|----------------------------------------------------|----------------------------------------------------------------|
| **Sound Engine**        | `00_Sound_Engine.py`                               | Motor de notificaciones sonoras del sistema                    |
| **Auditor**             | `01_Auditor_Hub.py`                                | System validation: structure, links, skills, health            |
| **Git**                 | `02_Git_Hub.py`                                    | Git operations + structure audits                              |
| **AIPM**                | `03_AIPM_Hub.py`                                   | AI Performance Monitoring                                      |
| **Ritual**              | `04_Ritual_Hub.py`                                 | Session rituals: open, close, recovery                         |
| **Validator**           | `05_Validator_Hub.py`                              | Code validation: rules, stack, patterns                        |
| **Tool**                | `06_Tool_Hub.py`                                   | Tool integration and management                                |
| **Integration**         | `07_Integration_Hub.py`                            | MCP and external integrations                                  |
| **Workflow**            | `08_Workflow_Hub.py`                               | Workflow automation                                            |
| **Data**                | `09_Data_Hub.py`                                   | Data processing and analytics                                  |
| **General**             | `10_General_Hub.py`                                | General utilities                                              |
| **Auto Learn**          | `11_Auto_Learn_Hub.py`                             | Motor de automejora y aprendizaje                              |
| **Context Bar**         | `13_Auditors_Os/scripts/12_Context_Usage_Bar.py`   | Barra de uso de contexto (sub-script de 13_Auditors_Os)        |
| **Beautify**            | `13_Auditors_Os/scripts/13_Beautify_Tables.py`     | Formateo de tablas markdown (sub-script de 13_Auditors_Os)     |
| **Health Metrics**      | `14_Health_Metrics_Hub.py`                         | Métricas de salud del OS                                       |
| **MCP Sync**            | `15_MCP_Sync_Hub.py`                               | Detecta y reporta drift entre Claude Code y OpenCode           |
| **Agent Mirror**        | `16_Agent_Mirror_Hub.py`                           | Sincroniza agentes source → backup                             |
| **Watchdog**            | `17_Watchdog_Hub.py`                               | Health watchdog — valida integridad del manifest               |
| **Telemetry**           | `18_Telemetry_Hub.py`                              | Dashboard ASCII de métricas de uso por HUB                     |
| **Agent Sync**          | `19_Agent_Sync_Hub.py`                             | Sincroniza .agent/01_Agents/ con 01_Core/02_Tools/01_Agents/   |
| **System Mapper**       | `20_System_Mapper_Hub.py`                          | Genera 7 manifests del OS via os.walk                          |
| **Legacy Cleanup**      | `21_Legacy_Path_Cleanup.py`                        | Escanea y limpia paths legacy de Consequences 2.x              |
| **Skill Frontmatter**   | `22_Validate_Skill_Frontmatter.py`                 | Detecta skills sin frontmatter YAML                            |
| **Preview Gen**         | `23_Preview_Generator.js`                          | Generador de previews                                          |

> ★ = HUB canónico JARVIS 3.1

---

## 🔗 Related

- **Rules:** See `01_Personal_Os/01_Core/01_Rules/` for active rules (11 .mdc)
- **Skills:** See `01_Personal_Os/01_Core/02_Tools/02_Skills/` for all skills (299)
- **CLAUDE.md:** See `./CLAUDE.md` for agent instructions
- **Scripts:** See `01_Personal_Os/04_Operations/03_Scripts_Os/` for 23 scripts (19 HUBs + 4 auxiliares)
- **Manifests:** See `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/` for JARVIS 3.1

---

## 🛡️ GGA (Gentleman Guardian Angel)

Code Review con IA integrado.

```bash
.agent/05_GGA/bin/gga run      # Revisar archivos staged
.agent/05_GGA/bin/gga install  # Instalar pre-commit hook
```

---

## ⚡ Comandos Rápidos

```bash
# HUBs JARVIS 3.1
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan     # regenerar 7 manifests
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py                 # health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard    # stats ASCII
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report        # MCP drift

# System Guardian
gr              # System Auditor (Dry-run)
gr --apply      # Apply fixes
```

---

*Última actualización: 2026-05-22 | PersonalOS v4.7 Consequences | 12 áreas activas | 394 skills | 19 HUBs + 284 scripts Python ✅*
