# 🛠️ 02_Skills — Conocimiento del Sistema

**Versión:** v5.0 Live
**Última actualización:** 2026-07-01
**Source of Truth:** Manifest en `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/README.md`

---

## 📂 Estructura Actual

```
.agent/02_Skills/
├── 00_Agent_Teams_Lite/        — SDD sub-agents
├── 00_Compound_Engineering/    — Compound Engineering
├── 00_Personal_Os/             — Personal OS system
├── 00_Skill_Auditor/           — Skill auditing
├── 00_System_Core/             — System core
├── 00_Workflows/               — Workflow automation
├── 01_Creacion_Contenidos/     — Content creation
├── 02_Diseno_Ui_Ux/            — UI/UX design
├── 03_Video_Media/             — Video/media
├── 04_Automatizacion/          — Automation
├── 05_Claude_Ads/              — Claude Ads
├── 06_Tools/                   — Development tools
├── 07_Invictus_Web/            — Invictus web
├── 08_JAO/                     — JAO agents
├── 10_Laia_Learning/           — Laia learning
└── README.md
```

### Áreas Activas

| # | Área | SKILL.md | Propósito |
|---|------|----------|-----------|
| 00 | Agent_Teams_Lite | 14 | SDD sub-agents |
| 00 | Compound_Engineering | 63 | Compound Engineering |
| 00 | Personal_Os | 24 | Personal OS system |
| 00 | Skill_Auditor | 1 | Skill auditing |
| 00 | System_Core | 1 | System core |
| 00 | Workflows | 43 | Workflow automation |
| 01 | Creacion_Contenidos | 49 | Content creation |
| 02 | Diseno_Ui_Ux | 34 | UI/UX design |
| 03 | Video_Media | 11 | Video/media |
| 04 | Automatizacion | 27 | Automation |
| 05 | Claude_Ads | 21 | Claude Ads |
| 06 | Tools | 83 | Development tools |
| 07 | Invictus_Web | 18 | Invictus web |
| 08 | JAO | 6 | JAO agents |
| 10 | Laia_Learning | 1 | Laia learning |

**Total: 15 áreas — 396 SKILL.md (~1,624 archivos)**

---

## 🔗 Integración con el Sistema

| Componente | Rol |
|------------|-----|
| **Manifest** | `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` — fuente de verdad |
| **OpenCode Skills** | `.config/opencode/skills/` — 215 skills en 96 áreas |
| **Agents** | `.agent/01_Agents/` — 57 agent definitions |
| **Workflows** | `.agent/03_Workflows/` — 31 workflows |
| **Hooks** | `.agent/04_Extensions/01_Hooks/` — 11 hooks en 7 fases |
| **Rules** | `.agent/00_Rules/` — 13 reglas |

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Áreas de conocimiento | 15 |
| Archivos totales | ~1,624 |
| Skills OpenCode | 215 (96 áreas) |
| Agentes | 57 |
| Workflows | 31 |
| Reglas | 13 |

---

## 🚀 Comandos Rápidos

```bash
# Validar sistema completo
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --validate

# Ver manifest
cat 01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/README.md
# (config_paths.BACKLOG_FILE auto-detecta README.md o MANIFEST.md)
```

---

## 🧠 Notas

- Las áreas reflejan la estructura actual en disco (15 áreas activas)
- Los scripts HUB están en `01_Personal_Os/04_Operations/03_Scripts_Os/`
- Esta carpeta **NO** es la de skills OpenCode — esas están en `.config/opencode/skills/`

---

*Última actualización: 2026-07-01 | v5.0 Live*
