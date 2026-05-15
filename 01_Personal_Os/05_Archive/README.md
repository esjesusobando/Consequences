# 05_Archive — Legacy y Repositorios

**Versión:** 7.5
**Última actualización:** 2026-05-15
**Estado:** 📦 Legacy

---

> ⚠️ **AVISO DE CORRECCIÓN:** Secuencia de carpetas 06, 09, 10 tenía duplicados.
> - `06_Snapshots` → `11_Snapshots` ✅
> - `09_OpenSpec_Archive` → `12_OpenSpec_Archive` ✅
> - `10_Legacy_Scripts_Backup_20260420` → `13_Legacy_Scripts_Backup_20260420` ✅
> - `10_Tasks_Legacy` → `14_Tasks_Legacy` ✅
>
> 📂 **OIM Consolidated:** Los sitios OIM duplicados en `03_Resultado/` raíz fueron movidos a `09_World_OIM/` (consolidado oficial) y su backup en `15_OIM_Websites_Root/`.
>
> ⚠️ **DUPLICADOS PENDIENTES:** Los originales (`06_Snapshots`, `09_OpenSpec_Archive`, `10_Legacy_Scripts...`, `10_Tasks_Legacy`) siguen lockeados por apps. Los renombrados (11-14) son los activos. Cuando se desbloqueen, mover a backup legacy.

---

## 📂 Estructura (Workspace)

```
Think_Different/
├── 00_Winter_is_Coming/    # Estrategia, Backlog y ADN (ESTRATÉGICO)
├── 01_Personal_Os/         # OS completo (Core, Operations, Archive, etc.)
├── 02_Playground/           # Laboratorio de Pruebas y Experimentos
├── 03_Resultado/           # Resultados de proyectos
└── AGENTS.md              # Configuración de agentes
```

---

## 📂 Estructura 05_Archive (Secuencia corregida 01-15)

```
05_Archive/
├── 01_Raiz_Archive/                      # Archivos de raíz archivados
├── 02_Rules_Legacy/                      # Reglas y Pilares antiguos
├── 03_Docs_Legacy/                       # Documentación legacy
├── 04_Backups_AutoMejora/                # Backups del sistema de auto-mejora
├── 05_Planes_Legacy/                     # Planes de acción archivados
├── 06_Docs_All/                          # Documentos variados
├── 07_Repos_Gentleman/                   # Repositorios externos (25 repos)
├── 08_Planes_Estrategicos/               # Planes estratégicos legacy
├── 09_Legacy_Skills_Archive/             # Archive de skills legacy
├── 10_Legacy_Revisar/                    # Legacy para revisión
├── 11_Snapshots/                         # Snapshots del sistema (era 06_Snapshots) ✅
├── 12_OpenSpec_Archive/                  # Archivo de especificaciones OpenSpec (era 09_OpenSpec_Archive) ✅
├── 13_Legacy_Scripts_Backup_20260420/   # Scripts de backup legacy (era 10_Legacy_Scripts...) ✅
├── 14_Tasks_Legacy/                      # Tasks legacy archivadas (era 10_Tasks_Legacy) ✅
├── 15_OIM_Websites_Root/                 # Backup websites OIM desde 03_Resultado/ raíz
│   ├── OIM_Website/                      # Versión original
│   ├── OIM_Website_Backup/               # Backup versión original
│   ├── OIM_Website_One/                 # Otra versión
│   ├── Imagenes_Finales/                 # Imágenes del proyecto
│   └── OIM_Website_v2/                  # ⚠️ PENDIENTE — lockeado, mover manualmente
└── README.md                             # Este archivo
```

> ⚠️ **Nota de secuencia:** Originalmente había duplicados en 06, 09 y 10. La corrección lógica es:
> - `06_Snapshots` → `11_Snapshots`
> - `09_OpenSpec_Archive` → `12_OpenSpec_Archive`
> - `10_Legacy_Scripts_Backup_20260420` → `13_Legacy_Scripts_Backup_20260420`
> - `10_Tasks_Legacy` → `14_Tasks_Legacy`
> Algunos archivos aún tienen lock de sistema y requieren cierre de apps que los tengan abiertos.

---

## 🎯 Propósito

Almacena **archivos obsoletos, repositorios de referencia, y backups**. Es el "baúl" del sistema.

> ⚠️ **Nota:** Los repos en `07_Repos_Gentleman/` son **copias locales**, NO submodules (excepto 06, 09, 17).

---

## 📚 Repositorios Clonados (23 repos)

| Repo                                        | Fuente                                        | Propósito                                        | Estado              |
|---------------------------------------------|-----------------------------------------------|--------------------------------------------------|---------------------|
| **engram**                                  | Gentleman-Programming/engram                  | Memoria persistente (v2.10+)                     | ✅ Activo            |
| **gentle-ai**                               | Gentleman-Programming/gentle-ai               | AI Gentle Stack (v1.21.0)                        | ✅ Activo            |
| **Gentleman.Dots**                          | Gentleman-Programming/Gentleman.Dots          | Dotfiles + LazyVim config (v2.9.10)              | ✅ Activo            |
| **gentleman-guardian-angel**                | Gentleman-Programming/gga                     | Code review AI (v2.8+)                           | ✅ Activo            |
| **gentleman-skills**                        | Gentleman-Programming/gentleman-skills        | Skills curadas                                   | ✅ Activo            |
| **taste-skill**                             | Leonxlnx/taste-skill                          | Diseño premium UI/UX (3.9k stars)                | ✅ Activo            |
| **agent-teams-lite**                        | Gentleman-Programming/agent-teams             | SDD workflow (v4.0.0+)                           | ⚠️ Archive          |
| **personal-os-main**                        | Gentleman-Programming/personal-os             | Original del fork                                | ✅ Activo            |
| **n8n-skills-main**                         | N8N skills                                    | Skills n8n                                       | ✅ Activo            |
| **compound-engineering-plugin**             | EveryInc/compound-engineering                 | Compound Engineering                             | ✅ Activo            |
| **digitalgarden**                           | Obsidian Digital Garden                       | Publicación notas                                | ✅ Activo            |
| **docling**                                 | Docling                                       | Document processing                              | ✅ Activo            |
| **curso-ai-devs**                           | Curso AI Devs                                 | Curso desarrollo AI                              | ✅ Activo            |
| **google-workspace-mcp-server**             | Google Workspace MCP                          | GCP integrations                                 | ✅ Activo            |
| **pi-vs-claude-code**                       | PI vs Claude Code                             | Comparativa                                      | ✅ Activo            |
| **claude-ads**                              | AgriciDaniel/claude-ads                       | Claude Ads integration                           | ✅ Activo            |
| **claude-code-learn**                       | Gentleman-Programming/claude-code             | Learning resources                               | ✅ Activo            |
| **qmd**                                     | QMD project                                   | Quick notes terminal + MCP server                | ✅ Activo            |
| **frontend-slides**                         | zarazhangrui/frontend-slides                  | Presentaciones HTML (v2.0.0)                     | ✅ Submodule         |
| **Kit Profesional Alto Impacto 2026**       | Curso Premium                                 | Formación profesional                            | ✅ Activo            |
| **sub-agent-statusline**                    | Joaquinvesapa/sub-agent-statusline            | OpenCode sidebar agents                          | ✅ Activo            |
| **tubemaster**                              | Gentleman-Programming/tubemaster              | YouTube operations                               | ✅ Activo            |
| **design-system**                           | robonuggets/design-system                     | Design system components                         | ✅ Submodule         |
| **open-design**                             | nexu-io/open-design                           | Open design system                               | ✅ Submodule         |

---

## ⭐ Repos Principales

| Repositorio                             | Stars           | Versión           | Propósito                                        |
|-----------------------------------------|-----------------|-------------------|--------------------------------------------------|
| **engram**                              | 2.7k ⭐          | v2.10+            | Memoria persistente (backbone OS)                |
| **gentle-ai**                           | 2.2k ⭐          | v1.21.0           | AI Gentle Stack (reemplaza ATL)                  |
| **taste-skill**                         | 3.9k ⭐          | —                 | Diseño premium UI/UX de alto impacto             |
| **Gentleman.Dots**                      | 1.7k ⭐          | v2.9.10           | Configuración LazyVim premium                    |
| **gentleman-guardian-angel**            | 961 ⭐           | v2.8+             | GGA Code Review automático                       |
| **frontend-slides**                     | —               | v2.0.0            | Presentaciones HTML                              |
| **compound-engineering-plugin**         | —               | v2.55.0           | CE Philosophy — hacer cada tarea más fácil       |
| **tubemaster**                          | 9 ⭐             | v0.1.1            | YouTube Operations (Web+CLI+MCP+API)             |

---

## 📦 Estado de Clonación Detallado

| #        | Repositorio                         | Clonado         | Ubicación                                        | Submodule        |
|----------|-------------------------------------|-----------------|--------------------------------------------------|------------------|
| 01       | Claude_Ads                          | ✅               | `01_Claude_Ads/`                                 | —                |
| 02       | Agent_Teams_Lite                    | ✅               | `02_Agent_Teams_Lite/`                           | —                |
| 03       | Claude_Code_Learn                   | ✅               | `03_Claude_Code_Learn/`                          | —                |
| 04       | Compound_Engineering_Plugin         | ✅               | `04_Compound_Engineering_Plugin/`                | —                |
| 05       | Curso_Ai_Devs                       | ✅               | `05_Curso_Ai_Devs/`                              | —                |
| 06       | Design_System                       | ✅               | `06_Design_System/`                              | ✅                |
| 07       | Digital_Garden                      | ✅               | `07_Digital_Garden/`                             | —                |
| 08       | Engram                              | ✅               | `08_Engram/`                                     | —                |
| 09       | Frontend_Slides                     | ✅               | `09_Frontend_Slides/`                            | ✅                |
| 10       | Gentle_AI                           | ✅               | `10_Gentle_AI/`                                  | —                |
| 11       | Gentleman_Dots                      | ✅               | `11_Gentleman_Dots/`                             | —                |
| 12       | Gentleman_Guardian_Angel            | ✅               | `12_Gentleman_Guardian_Angel/`                   | —                |
| 13       | Gentleman_Skills                    | ✅               | `13_Gentleman_Skills/`                           | —                |
| 14       | Google_Workspace_Mcp_Server         | ✅               | `14_Google_Workspace_Mcp_Server/`                | —                |
| 15       | Kit_Profesional_Alto_Impacto        | ✅               | `15_Kit_Profesional_Alto_Impacto_2026/`          | —                |
| 16       | N8n_Skills                          | ✅               | `16_N8n_Skills/`                                 | —                |
| 17       | Open_Design                         | ✅               | `17_Open_Design/`                                | ✅                |
| 18       | Personal_Os_Main                    | ✅               | `18_Personal_Os_Main/`                           | —                |
| 19       | Pi_Vs_Claude_Code                   | ✅               | `19_Pi_Vs_Claude_Code/`                          | —                |
| 20       | Qmd                                 | ✅               | `20_Qmd/` + global `qmd` installed               | —                |
| 21       | Sub_Agent_Statusline                | ✅               | `21_Sub_Agent_Statusline/`                       | —                |
| 22       | Taste_Skill                         | ✅               | `22_Taste_Skill/`                                | —                |
| 23       | Tubemaster                          | ✅               | `23_Tubemaster/`                                 | —                |

---

## 🔗 Submodules Activos (3)

| Repositorio                  | Commit           | Propósito                       |
|------------------------------|------------------|---------------------------------|
| `06_Design_System`           | `74b456c`        | Design system components        |
| `09_Frontend_Slides`         | `8dca834`        | Presentaciones HTML             |
| `17_Open_Design`             | `7549883`        | Open design system              |

---

## 🔗 Recursos Adicionales

- [Repos README](./07_Repos_Gentleman/README.md) — Índice completo de repos
- `10_Legacy_Revisar/OIM_Website_Backup_copy/` — Backup web OIM
- `10_Legacy_Revisar/OIM_Website_Backup_copy_2/` — Backup web OIM #2
- `03_Resultado/OIM_Website_v2/` — Website OIM (submodule)

---

_Think Different PersonalOS v7.2 — Archivo activo_
