# 🗺️ MAPA DE MIGRACIÓN v2.0 — Think Different PersonalOS

> **Fecha:** 2026-04-24
> **Estado:** 🚀 EN PROGRESO
> **Versión:** v2.0 Consequences

---

## 📁 ESTRUCTURA NUEVA (v2.0)

```
Think_Different/ (RAÍZ)
├── 00_Winter_is_Coming/          # ⚠️ SIN CAMBIOS - Reglas de Oro
├── 01_Personal_Os/               # 🆕 EL SISTEMA OPERATIVO
│   ├── 01_Core/
│   │   ├── 00_Workflows_Os/
│   │   ├── 01_Rules/
│   │   └── 02_Tools/
│   │       ├── 01_Agents/        # 🆕 (antes 04_Agents)
│   │       ├── 02_Skills/        # 🆕 (antes 03_Skills)
│   │       ├── 03_Mcp/           # 🆕 (antes 05_Mcp)
│   │       ├── 04_Integrations/  # 🆕 (antes 06_Integrations)
│   │       ├── 05_Hooks/         # 🆕 (antes 07_Hooks)
│   │       ├── 06_Plugins/       # 🆕 (antes 08_Plugins)
│   │       ├── 07_Server/        # 🆕 (antes 09_Server)
│   │       ├── 08_Evals/         # 🆕 (antes 02_Evals)
│   │       └── 09_Templates/     # 🆕 (antes 10_Templates)
│   ├── 02_Knowledge/
│   ├── 03_Task/                  # 🆕 (antes 03_Tasks - singular)
│   ├── 04_Operations/
│   │   ├── 00_Context_LLM/       # 🆕 (antes 04_Operations subcarpetas)
│   │   ├── 01_Auto_Improvement/
│   │   ├── 02_Agent_Teams_Lite/
│   │   ├── 03_Scripts_Os/        # 🆕 (antes 03_Scripts_Os)
│   │   ├── 04_Installer/
│   │   └── 05_Projects/          # 🆕 (antes 07_Projects)
│   └── 05_Archive/
├── 02_Playground/                # 🆕 (antes 06_Playground)
├── 03_Resultado/                 # 🆕 (antes Now/)
├── .agent/                       # ⚠️ ACTUALIZAR RUTAS
├── .atl/
├── AGENTS.md                     # ⚠️ ACTUALIZAR
├── CLAUDE.md                     # ⚠️ ACTUALIZAR
└── README.md                     # ⚠️ ACTUALIZAR
```

---

## 🔄 MAPA DE RUTAS ANTIGUAS → NUEVAS

| ANTIGUO (v1.x)                | NUEVO (v2.0)                                               |
|------------------------------|-----------------------------------------------------------|
| `01_Core/`                    | `01_Personal_Os/01_Core/`                                  |
| `02_Knowledge/`               | `01_Personal_Os/02_Knowledge/`                             |
| `03_Tasks/`                   | `01_Personal_Os/03_Task/`                                  |
| `04_Operations/`              | `01_Personal_Os/04_Operations/`                            |
| `05_Archive/`                 | `01_Personal_Os/05_Archive/`                               |
| `06_Playground/`              | `02_Playground/`                                           |
| `07_Projects/`                | `01_Personal_Os/04_Operations/05_Projects/`                |
| `03_Scripts_Os/`              | `01_Personal_Os/04_Operations/03_Scripts_Os/`              |
| `Now/`                        | `03_Resultado/`                                            |

### Subdirectorios Core

| ANTIGUO                                               | NUEVO                                                           |
|------------------------------------------------------|----------------------------------------------------------------|
| `01_Core/00_Workflows/`                               | `01_Personal_Os/01_Core/00_Workflows_Os/`                       |
| `01_Core/01_Rules/`                                   | `01_Personal_Os/01_Core/01_Rules/`                              |
| `01_Core/02_Evals/`                                   | `01_Personal_Os/01_Core/02_Tools/08_Evals/`                     |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/`          | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                    |
| `01_Core/04_Agents/`                                  | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                    |
| `01_Core/05_Mcp/`                                     | `01_Personal_Os/01_Core/02_Tools/03_Mcp/`                       |
| `01_Core/06_Integrations/`                            | `01_Personal_Os/01_Core/02_Tools/04_Integrations/`              |
| `01_Core/07_Hooks/`                                   | `01_Personal_Os/01_Core/02_Tools/05_Hooks/`                     |
| `01_Core/08_Plugins/`                                 | `01_Personal_Os/01_Core/02_Tools/06_Plugins/`                   |
| `01_Core/09_Server/`                                  | `01_Personal_Os/01_Core/02_Tools/07_Server/`                    |
| `01_Core/10_Templates/`                               | `01_Personal_Os/01_Core/02_Tools/09_Templates/`                 |

---

## 📋 ARCHIVOS CRÍTICOS A ACTUALIZAR

### Raíz
- [ ] `AGENTS.md` - Estructura completa
- [ ] `CLAUDE.md` - Rutas en todo el documento
- [ ] `README.md` - Diagrama de estructura

### .agent
- [ ] `.agent/CLAUDE.md` - Rutas de configuración
- [ ] `.agent/WORKSPACE.md` - Estructura

### 01_Personal_Os
- [ ] `01_Core/README.md` - Múltiples referencias
- [ ] `01_Core/01_Rules/RULES_INDEX.md` - Paths
- [ ] `02_Knowledge/README.md` - Estructura
- [ ] `03_Task/README.md` - Estructura
- [ ] `04_Operations/README.md` - Múltiples refs
- [ ] `04_Operations/03_Scripts_Os/README.md` - Paths

### 02_Playground
- [ ] `02_Playground/README.md` - Título y estructura

---

## 🐛 SCRIPTS CON PATHS HARDCODED

| Script                                        | Path a Buscar                                                             | Acción                 |
|----------------------------------------------|--------------------------------------------------------------------------|-----------------------|
| `config_paths.py`                             | ✅ YA ACTUALIZADO                                                          | Listo                  |
| Buscar en docs: `01_Core/`                    | Reemplazar por `01_Personal_Os/01_Core/`                                  | Pendiente              |
| Buscar en docs: `02_Knowledge/`               | Reemplazar por `01_Personal_Os/02_Knowledge/`                             | Pendiente              |
| Buscar en docs: `04_Operations/`              | Reemplazar por `01_Personal_Os/04_Operations/`                            | Pendiente              |
| Buscar en docs: `06_Playground/`              | Reemplazar por `02_Playground/`                                           | Pendiente              |
| Buscar en docs: `03_Scripts_Os/`              | Reemplazar por `01_Personal_Os/04_Operations/03_Scripts_Os/`              | Pendiente              |

---

## 🔍 BÚSQUEDA MASIVA DE RUTAS

```bash
# Buscar rutas antiguas en todos los .md
grep -r "01_Core/" --include="*.md" .
grep -r "02_Knowledge/" --include="*.md" .
grep -r "04_Operations/" --include="*.md" .
grep -r "06_Playground/" --include="*.md" .
grep -r "03_Scripts_Os/" --include="*.md" .
```

---

*Mapa generado: 2026-04-24 — Think Different PersonalOS v2.0*
