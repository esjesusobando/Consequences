# 🤖 Folder .agent - PersonalOS v2.0 Consequences

## ⚙️ Configuración del Sistema de Agentes

Este directorio contiene la configuración de agentes, skills y hooks de PersonalOS.

> **NOTE:** `.agent/` es **BACKUP ESTRATÉGICO** sincronizado con `01_Personal_Os/01_Core/`. La fuente de verdad es `01_Personal_Os/01_Core/`.

---

## 📂 Estructura .agent/ (v2.0 — Backup)

| Directorio           | Contenido                                | Fuente de verdad                               |
|----------------------|------------------------------------------|------------------------------------------------|
| **00_Rules/**        | 10 reglas activas (.mdc)                 | `01_Personal_Os/01_Core/01_Rules/`             |
| **01_Agents/**       | Agentes configurados                     | `01_Personal_Os/01_Core/02_Tools/01_Agents/`   |
| **02_Skills/**       | Skills organizadas (backup)              | `01_Personal_Os/01_Core/02_Tools/02_Skills/`   |
| **03_Workflows/**    | Workflows del sistema                    | `01_Personal_Os/01_Core/00_Workflows_Os/`      |
| **04_Extensions/**   | Hooks system (activos)                   | Local                                          |
| **05_GGA/**          | Gentleman Guardian Angel (Code Review)   | `.agent/05_GGA/`                               |

---

## 📂 Estructura Principal (v2.0 Consequences — 4 carpetas raíz)

| Carpeta                             | Contenido                                                |
|-------------------------------------|----------------------------------------------------------|
| **00_Winter_is_Coming/**            | Goals, Backlog, AGENTS.md (ESTRATÉGICO)                  |
| **01_Personal_Os/**                 | El sistema operativo completo                            |
| **01_Personal_Os/01_Core/**         | Motor: Skills (9 áreas), Rules (10), MCPs (33), Tools    |
| **01_Personal_Os/02_Knowledge/**    | Documentación, Research, Notas                           |
| **01_Personal_Os/03_Task/**         | Tareas activas                                           |
| **01_Personal_Os/04_Operations/**   | Operativo: Scripts, Auto-Mejora, Projects, Context LLM   |
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

## 🎯 Skills Disponibles (9 áreas funcionales)

### Por Categoría (`01_Personal_Os/01_Core/02_Tools/02_Skills/`)

| Categoría                 | Contenido                              | Estado     |
|---------------------------|----------------------------------------|------------|
| 00_Compound_Engineering   | Core CE                                | ✅          |
| 00_Personal_Os_Stack      | Stack base OS                          | ✅          |
| 00_Skill_Auditor          | Auditor                                | ✅          |
| 01_Creacion_Contenidos    | Contenido + SEO + Carousel             | ✅          |
| 02_Diseno_Ui_Ux           | Diseño UI/UX                           | ✅          |
| 03_Video_Media            | Video + James Cameron                  | ✅          |
| 04_Automatizacion         | Automatización                         | ✅          |
| 05_Workflows              | Workflows + Agent Teams Lite           | ✅          |
| 06_Tools                  | Tools + System Master + Data Analyst   | ✅          |
| 07_Personal_Os            | Skills OS personal                     | ✅          |
| 08_Invictus_Web           | Web development                        | ✅          |

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

## 🔗 Related

- **Rules:** See `01_Personal_Os/01_Core/01_Rules/` for active rules (10 .mdc)
- **Skills:** See `01_Personal_Os/01_Core/02_Tools/02_Skills/` for all skills
- **CLAUDE.md:** See `./CLAUDE.md` for agent instructions
- **Scripts:** See `01_Personal_Os/04_Operations/03_Scripts_Os/` for 14 HUBs

---

## 🛡️ GGA (Gentleman Guardian Angel)

Code Review con IA integrado.

```bash
.agent/05_GGA/bin/gga run      # Revisar archivos staged
.agent/05_GGA/bin/gga install  # Instalar pre-commit hook
```

---

*Última actualización: 2026-04-24 | PersonalOS v2.0 Consequences | 9 áreas funcionales ✅*
