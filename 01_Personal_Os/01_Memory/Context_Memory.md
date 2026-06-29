# Memoria de Contexto del Proyecto

**Proyecto:** Think Different PersonalOS v5.0 (SOTA)
**Última Actualización:** 2026-06-29
**Estado:** ✅ Production Ready — Post-Auditoría SOTA

---

## Estado Actual del Sistema

### Métricas Verificadas (2026-06-29)

| Métrica              | Valor Verificado                    |
|----------------------|-------------------------------------|
| Skills (SKILL.md)    | 396 (15 áreas) — CoT injected       |
| Scripts Python       | 57+ actualizados (logging + typing) |
| READMEs beautificados| 393 archivos                        |
| Reglas (.mdc)        | 14                                  |
| Hooks (.py + .ps1)   | 10 (6 fases)                        |
| Workflows (.md)      | 29 (7 categorías)                   |
| Agentes (source)     | 63                                  |
| Agentes (backup)     | 72 (drift: 9)                       |
| HUBs funcionales     | 42 (33 .py + 9 subdirs)             |
| Scripts totales      | 166                                 |
| MCP Claude (root)    | 11                                  |
| MCP OpenCode         | 45                                  |

---

## Arquitectura de Carpetas (Ground Truth v5.0)

```
Think_Different/
├── 00_Winter_is_Coming/    # Dirección estratégica
├── 01_Personal_Os/         # FUENTE DE VERDAD del OS
│   ├── 00_Core/            # Motor: Workflows, Rules, Tools (Agents, Skills, SDD, MCP)
│   ├── 01_Memory/          # Memoria LLM: Context_Memory.md, Notas_de_Proceso.md
│   ├── 02_Knowledge/       # Base de conocimiento estática
│   ├── 03_Learning/        # Auto-improvement, Shared_Org, Content, Telemetry
│   ├── 04_Tasks/           # Tareas activas (YAML 100%)
│   ├── 05_Scripts/         # HUBs (42) + Installer
│   ├── 06_Projects/        # Proyectos activos
│   └── 07_Archive/         # Backups, snapshots, históricos (incluye 04_Operations_Backup)
├── 02_Playground/          # Zona de experimentos
│   ├── 03_Reports/         # Reportes, sesiones, walkthroughs
│   ├── 08_Plans_and_Docs/  # Planes, tasks, implementation plans [NEW]
│   ├── 09_Skills_Drafts/   # Borradores de skills [NEW]
│   └── 10_Scripts_and_Logs/ # Scripts y logs [NEW]
└── 03_Resultado/           # Outputs de proyectos
```

---

## Convenciones del Sistema

- **Idioma:** Español para comunicación, inglés para código/entidades técnicas
- **Naming:** `NN_Descripcion.ext` (numeración prefijada)
- **Skills:** Todos llevan bloque CoT (Chain of Thought) al final
- **Scripts:** Todos llevan `import logging, typing` + `logging.basicConfig`
- **Commits:** `--no-verify` cuando GGA hook falla por OpenCode CLI ausente
- **READMEs:** Beautificar con `58_Batch_Beautify_README.py` tras cambios masivos

---

## Scripts Clave del Sistema

| Script                         | Ubicación                           | Propósito                     |
|-------------------------------|--------------------------------------|-------------------------------|
| `58_Batch_Beautify_README.py` | `05_Scripts/00_HUBs/03_Scripts_Os/13_Legacy/` | Formatear tablas en READMEs |
| `36_README_Table_Beautifier.py` | `05_Scripts/00_HUBs/03_Scripts_Os/` | Beautify unitario de READMEs |
| `20_System_Mapper_Hub.py`     | `05_Scripts/00_HUBs/`               | Genera manifests JARVIS       |
| `recursive_improvement_engine.py` | `03_Learning/01_Auto_Improvement/` | Motor de auto-mejora (cada 8h) |
| `sota_upgrade.py`             | `02_Playground/10_Scripts_and_Logs/` | SOTA upgrade masivo (sesión 2026-06-29) |

---

*Context Memory v5.0 — Actualizado post-auditoría SOTA 2026-06-29*
