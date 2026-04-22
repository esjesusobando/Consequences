# 🤖 Folder .agent - PersonalOS

## ⚙️ Configuración del Sistema de Agentes

Este directorio contiene la configuración de agentes, skills y hooks de PersonalOS.

> **NOTE:** `.agent/` es **BACKUP ESTRATÉGICO** sincronizado con `01_Core/`. La fuente de verdad es `01_Core/`.

---

## 📂 Estructura (v6.1 - Sincronizado con 01_Core/)

| Directorio | Contenido | Fuente |
|------------|-----------|--------|
| **00_Rules/** | Reglas del sistema | `01_Core/01_Rules/` |
| **01_Agents/** | Agentes configurados | `01_Core/04_Agents/` |
| **02_Skills/** | **160+ skills** | `01_Core/03_Skills/` |
| **03_Workflows/** | 26+ workflows | `01_Core/00_Workflows/` |
| **04_Extensions/** | Hooks system (7 active hooks) | Local |
| **05_GGA/** | Gentleman Guardian Angel (Code Review) | `.agent/05_GGA/` |

---

> ⚠️ **NOTA**: `.mcp.json` de referencia creado en raíz pointing to `01_Core/05_Mcp/mcp.json`

---

## 📂 Estructura Principal (FUENTE DE VERDAD)

| Carpeta | Contenido |
|---------|-----------|
| **00_Winter_is_Coming/** | Goals, Backlog, Memoria |
| **01_Core/** | Motor: Skills, Agents, MCPs, Workflows |
| **02_Knowledge/** | Documentación, Research, Notas |
| **02_Knowledge/04_Docs/** | Documentos del sistema, SDD Registry |
| **03_Tasks/** | Tareas activas |
| **04_Operations/** | Auto Improvement, Scripts |
| **05_Archive/** | Legacy archivado |
| **08_Scripts_Os/** | Scripts operativos |

---

## 🔌 Claude Code Plugins (v6.1)

| Plugin | Versión | Componentes |
|--------|---------|-------------|
| pr-review-toolkit | 1.0.0 | 6 agents + 1 command |
| security-guidance | 1.0.0 | hooks |
| agent-sdk-dev | 1.0.0 | agents + commands |
| claude-code-setup | 1.0.0 | skills |

* *Ubicación:** `C:\Users\sebas\.claude\plugins\cache\claude-plugins-official\`

---

## 🎯 Skills Disponibles (160+ auditadas)

### Por Categoría (16 carpetas)

| Categoría | Items | Estado |
|-----------|-------|--------|
| 00_Compound_Engineering | 8 | ✅ |
| 00_Skill_Auditor | 3 | ✅ |
| 01_Agent_Teams_Lite | 11 | ✅ |
| 02_Project_Manager | 9 | ✅ |
| 03_Product_Manager | 9 | ✅ |
| 04_Product_Design | 13 | ✅ |
| 05_Vibe_Coding | 18 | ✅ |
| 06_Testing | 18 | ✅ |
| 07_DevOps | 13 | ✅ |
| 08_Personal_Os | 9 | ✅ |
| 09_Marketing | 11 | ✅ |
| 10_Backup | 5 | 📦 Legacy |
| 11_Doc_Processing | 4 | ✅ |
| 12_N8N | 7 | ✅ |
| 13_System_Master | 5 | ✅ |
| 14_Anthropic_Harness | 9 | ✅ + Plugins |

### Gentleman Skills (ubicación: `.agent/02_Skills/05_Gentleman/`)

| Categoría | Count | Ubicación |
|-----------|-------|-----------|
| Plan | 8 | `01_Plan/` |
| Work | 6 | `02_Work/` |
| Review | 6 | `03_Review/` |
| Compound | 15 | `04_Compound/` |
| Utilities | 4 | `05_Utilities/` |

### TASTE-SKILLS (PRIORIDAD ALTA PARA FRONTEND)

**Ubicación:** `.cursor/02_Skills/11_Taste_Skills/` y `.agent/02_Skills/11_Taste_Skills/`

| Skill | Uso |
|-------|-----|
| **taste-skill** | Diseño desde cero - premium |
| **soft-skill** | Proyectos premium, invitaciones |
| **minimalist-skill** | Estilo Notion/Linear |
| **redesign-skill** | Mejorar proyectos existentes |
| **output-skill** | Evita código incompleto |

---

## 🔗 Related

- **Rules:** See `01_Core/01_Rules/` for active rules
- **Skills:** See `.cursor/02_Skills/05_Gentleman/` for Gentleman skills
- **Taste-Skills:** See `.cursor/02_Skills/11_Taste_Skills/`
- **CLAUDE.md:** See `./CLAUDE.md` for agent instructions
- **Session Summary:** See `04_Operations/04_Memory_Brain/SESION_SUMMARY_2026-03-24_HIPERDETALLADO.md`

---

## 🛡️ GGA (Gentleman Guardian Angel)

Code Review con IA integrado.

```bash
.agent/05_GGA/bin/gga run      # Revisar archivos staged
.agent/05_GGA/bin/gga install  # Instalar pre-commit hook
```

---

*Última actualización: 2026-03-24 | Audit: 128+ skills ✅*