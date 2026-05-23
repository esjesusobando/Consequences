# 10_Skills_Legacy — Archivo de Skills Legacy

> Skills de versiones anteriores del PersonalOS que fueron reorganizadas en la estructura canónica de `01_Core/02_Tools/02_Skills/`.

## 📊 Resumen

| # | Directorio | SKILL.md | Archivos | Origen |
|---|-----------|----------|----------|--------|
| 1 | `00_Agent_Teams_Lite` | 13 | 35 | SDD Agent Teams (también activo en .agent) |
| 2 | `00_Engram` | 19 | 115 | Engram skills (también activo en .agent) |
| 3 | `00_Invictus_Backup` | 78 | 444 | Invictus backup (también activo en .agent) |
| 4 | `02_Project_Manager` | 8 | 43 | Project Management (v3) — reemplazado por source |
| 5 | `03_Product_Manager` | 8 | 31 | Product Management (v3) |
| 6 | `04_Product_Design` | 12 | 66 | Product Design (v3) |
| 7 | `05_Vibe_Coding` | 22 | 122 | Vibe Coding skills (v3) |
| 8 | `06_Testing` | 17 | 54 | Testing skills (v3) |
| 9 | `07_DevOps` | 12 | 97 | DevOps skills (v3) |
| 10 | `08_Personal_Os` | 20 | 109 | Personal OS (v3, numeración distinta) |
| 11 | `09_Marketing` | 38 | 190 | Marketing skills (v3) |
| 12 | `10_Backup` | 205 | 395 | Backup masivo multi-versión |
| 13 | `11_Doc_Processing` | 3 | 4 | Document Processing |
| 14 | `12_N8N` | 7 | 38 | N8N skills |
| 15 | `13_System_Master` | 4 | 15 | System Master |
| 16 | `14_Anthropic_Harness` | 7 | 18 | Anthropic Harness |
| 17 | `15_Skill_Creator_Oficial` | 2 | 21 | Skill Creator Official |
| 18 | `16_Silicon_Valley_Data_Analyst` | 1 | 5 | Silicon Valley Data Analyst |
| 19 | `17_SEO_SOTA_Master` | 1 | 5 | SEO SOTA Master |
| 20 | `18_Personal_Life_OS` | 6 | 7 | Personal Life OS |
| 21 | `19_Video_Intel` | 1 | 21 | Video Intelligence |
| 22 | `20_James_Cameron` | 4 | 6 | James Cameron skills |
| 23 | `21_Skill_Template` | 1 | 7 | Skill Template |
| 24 | `22_Huashu_Design` | 1 | 153 | Huashu Design (1 SKILL + 152 assets) |

**Total archive: ~490 SKILL.md en 24 directorios**

## 📋 Skills Únicos por Directorio (no existentes en source)

Los siguientes skills en este archivo NO existen en `01_Core/02_Tools/02_Skills/` y pueden contener contenido único:

### 08_Personal_Os (10 únicos)
fork-terminal, parallel-orchestration, 02_Agent_Orchestrator, 03_System_Guardian, 04_Premium_Git_Manager, 05_Subagent_Driven_Development, 06_Browser_Use, 07_Csv_Management, 09_Frictionless_Capture, 14_Validate_Stack

### 09_Marketing (10 únicos)
03_Compound_Engine, 04_Premium_Image_Studio, 05_Video_Visuals_Producer, marketing-ideas, marketing-psychology, product-marketing-context, 01_Agent_Onboarding, 02_Executive_Assistant, 03_Head_Of_Marketing, 11_Brand_Voice_Guardian

### 10_Backup (163 únicos)
Listado completo en `10_Backup/SKILLS_UNICAS.md`

### Otros directorios con skills únicos
- `05_Vibe_Coding`: 4 únicos
- `12_N8N`: 7 únicos
- `13_System_Master`: 1 único
- `15_Skill_Creator_Oficial`: 1 único
- `16_Silicon_Valley_Data_Analyst`: 1 único
- `17_SEO_SOTA_Master`: 1 único
- `21_Skill_Template`: 1 único
- `22_Huashu_Design`: 1 único

## 🔍 Cómo Buscar

1. Si querés un skill específico: `find 01_Personal_Os/05_Archive/10_Skills_Legacy/ -name "NOMBRE_SKILL" -type d`
2. Si querés explorar un área: revisá el directorio correspondiente
3. Para re-integro: copiar a `01_Core/02_Tools/02_Skills/<AREA>/` y hacer sync a `.agent/02_Skills/`

## 📅 Archivado

**Fecha:** 2026-05-23
**Motivo:** Migración de estructura legacy v3 a v4. Los skills duplicados con source se archivan; skills únicos preservados para posible integración.
**Checklist:**
- [x] Source verificada: `01_Core/02_Tools/02_Skills/` (364 skills en 12 áreas)
- [x] Backup `.agent/02_Skills/` sincronizado con source
- [x] Directorios 00_* preservados intactos
- [x] 21 directorios legacy archivados (no-00)
- [x] Index generado
