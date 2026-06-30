# 🛠️ 02_Skills — Conocimiento del Sistema

**Versión:** v5.0 Live
**Última actualización:** 2026-06-28
**Source of Truth:** Manifest en `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/MANIFEST.md`

---

## 📂 Estructura Actual

```
.agent/02_Skills/
├── 00-21   Areas originales (v5 heredadas)
├── 22-31   Areas sincronizadas desde v4 (2026-06-28)
└── README.md
```

### Areas 00-21 (Originales)

| # | Área | Estado |
|---|------|--------|
| 00 | Compound_Engineering | ✅ |
| 00 | Personal_Os_Stack | ✅ |
| 00 | Skill_Auditor | ✅ |
| 01 | Agent_Teams_Lite | ✅ |
| 02 | Project_Manager | ✅ |
| 03 | Product_Manager | ✅ |
| 04 | Product_Design | ✅ |
| 05 | Vibe_Coding | ✅ |
| 06 | Testing | ✅ |
| 07 | DevOps | ✅ |
| 08 | Personal_Os | ✅ |
| 09 | Marketing | ✅ |
| 10 | Backup | 📦 Legacy |
| 11 | Doc_Processing | ✅ |
| 12 | N8N | ✅ |
| 13 | System_Master | ✅ |
| 14 | Anthropic_Harness | ✅ |
| 15 | Skill_Creator_Oficial | ✅ |
| 16 | Silicon_Valley_Data_Analyst | ✅ |
| 17 | SEO_SOTA_Master | ✅ |
| 18 | Personal_Life_OS | ✅ |
| 19 | Video_Intel | ✅ |
| 20 | James_Cameron | ✅ |
| 21 | Skill_Template | ✅ |

### Areas 22-31 (Sincronizadas desde v4 — 2026-06-28)

| # | Área | Archivos | Origen v4 |
|---|------|----------|-----------|
| 22 | Creacion_Contenidos | 234 | `01_Creacion_Contenidos` |
| 23 | Diseno_Ui_Ux | 711 | `02_Diseno_Ui_Ux` |
| 24 | Video_Media | 30 | `03_Video_Media` |
| 25 | Automatizacion | 128 | `04_Automatizacion` |
| 26 | Workflows (skill defs) | 127 | `05_Workflows` |
| 27 | Tools | 479 | `06_Tools` |
| 28 | Personal_Os (vida) | 140 | `07_Personal_Os` |
| 29 | Invictus_Web | 22 | `08_Invictus_Web` |
| 30 | Claude_Ads | 132 | `09_Claude_Ads` |
| 31 | Huashu_Design | 153 | `22_Huashu_Design` |

**Total: 34 áreas — ~3,606 archivos**

---

## 🔗 Integración con el Sistema

| Componente | Rol |
|------------|-----|
| **Manifest** | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/` — fuente de verdad |
| **OpenCode Skills** | `.config/opencode/skills/` — 200 skills en 81 áreas |
| **Agents** | `.agent/01_Agents/` — 69 agentes |
| **Workflows** | `.agent/03_Workflows/` — 28 workflows |
| **Hooks** | `.agent/04_Extensions/hooks/` — 9 hooks en 6 fases |
| **Rules** | `.agent/00_Rules/` — 24 reglas |

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Áreas de conocimiento | 34 |
| Archivos totales | ~3,606 |
| Skills OpenCode | 200 (81 áreas) |
| Agentes | 69 |
| Workflows | 28 |
| Reglas | 24 |

---

## 🚀 Comandos Rápidos

```bash
# Validar sistema completo
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --validate

# Ver manifest
cat 01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/README.md
# (config_paths.BACKLOG_FILE auto-detecta README.md o MANIFEST.md)
```

---

## 🧠 Notas

- Las áreas 22-31 fueron copiadas del backup v4 (`Downloads/.../personal-os/Think_Different/.agent/02_Skills/`)
- No se copió `00_Backup_Mirror_Divergence_2026-05-26` (snapshot redundante)
- Los scripts HUB se copiaron a `01_Personal_Os/04_Operations/03_Scripts_Os/` (27 scripts)
- Esta carpeta **NO** es la de skills OpenCode — esas están en `.config/opencode/skills/`

---

*Última actualización: 2026-06-28 | v5.0 Live*
