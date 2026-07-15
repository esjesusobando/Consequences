# Context Memory — Think Different PersonalOS v5.0.2 (SOTA)

**Última actualización:** 2026-07-13
**Estado:** ✅ Production Ready

---

## Métricas del Sistema (2026-07-13 — verificado contra disco)

| Métrica               | Valor    | Notas                                      |
| --------------------- | -------- | ------------------------------------------ |
| Skills (SKILL.md)     | 397      | 35 áreas funcionales en .agent/02_Skills   |
| Agentes (source)      | 67       | 36 OS + 30 Claude + 1 OpenCode             |
| Reglas (.mdc)         | 16       | 00_Core/01_Rules/                          |
| HUBs funcionales      | 22       | *_Hub.py en 03_Scripts_Os/                 |
| Workflows (.md)       | 7        | Directorios en 00_Workflows/               |
| Hooks                 | 6        | Fases en 05_Hooks/                         |
| Scripts Python        | 241      | Total en 05_Scripts/                       |
| MCP Claude (root)     | 11       | .claude/.mcp.json                          |
| MCP OpenCode          | 45       | opencode.json                              |

---

## Arquitectura de Carpetas (Ground Truth v5.0)

```
Think_Different/
├── 00_Winter_is_Coming/    # Dirección estratégica
├── 01_Personal_Os/         # FUENTE DE VERDAD del OS
│   ├── 00_Core/            # Motor: Workflows (7), Rules (16), Tools (Agents, Skills, SDD, MCP)
│   ├── 01_Memory/          # Memoria: Context_Memory.md, Notas_de_Proceso.md
│   ├── 02_Knowledge/       # Base de conocimiento estática
│   ├── 03_Learning/        # Auto-improvement, Shared_Org, Content, Telemetry
│   ├── 04_Tasks/           # Tareas activas (YAML 100%)
│   ├── 05_Scripts/         # HUBs (22) + Installer
│   ├── 06_Projects/        # Proyectos activos
│   └── 07_Archive/         # Backups, snapshots, históricos
├── 02_Playground/          # Zona de experimentos
│   ├── 03_Reports/         # Reportes, sesiones, walkthroughs
│   ├── 07_Zero_Consequences/ # Web app Zero Consequences
│   ├── 08_Plans_and_Docs/  # Planes estratégicos
│   ├── 09_Skills_Drafts/   # Borradores de skills
│   └── 10_Scripts_and_Logs/ # Scripts y logs
└── 03_Resultado/           # Outputs de proyectos
```

---

## Convenciones del Sistema

- **Idioma:** Español para comunicación, inglés para código/entidades técnicas
- **Naming:** `NN_Descripcion.ext` (numeración prefijada)
- **Skills:** Todos llevan bloque CoT (Chain of Thought) al final
- **Scripts:** Todos llevan `import logging, typing` + `logging.basicConfig`
- **Commits:** `--no-verify` cuando GGA hook falla por OpenCode CLI ausente
- **Shebangs:** Siempre línea 1 en scripts Python ejecutables
- **Regla 3 Sitios:** Documentar en Notas_de_Proceso + Context_Memory + Engram

---

## Scripts Clave

| Script                            | Ubicación                                     | Propósito                               |
| --------------------------------- | --------------------------------------------- | --------------------------------------- |
| `config_paths.py`                 | `05_Scripts/00_HUBs/03_Scripts_Os/`           | Validación de 82 paths del sistema      |
| `20_System_Mapper_Hub.py`         | `05_Scripts/00_HUBs/03_Scripts_Os/`           | Genera manifests JARVIS                 |
| `batch_replace_paths.py`          | `05_Scripts/00_HUBs/03_Scripts_Os/`           | Reemplazo masivo de paths (idempotente) |
| `58_Batch_Beautify_README.py`     | `05_Scripts/00_HUBs/03_Scripts_Os/13_Legacy/` | Formatear tablas en READMEs             |
| `recursive_improvement_engine.py` | `03_Learning/01_Auto_Improvement/`            | Motor de auto-mejora (cada 8h)          |
| `installer.py`                    | `05_Scripts/01_Installer/04_Installer/`       | Instalador del OS                       |

---

## Ecosistemas Externos

| Integración   | Estado | Notas                                    |
| ------------- | ------ | ---------------------------------------- |
| Engram        | ✅     | v1.19.0, MCP `--tools=all`              |
| GGA           | ✅     | v2.10.1 en `/c/Users/sebas/bin/gga`     |
| Every CE      | ✅     | Plugin compound-engineering              |
| Gentle AI     | ✅     | Skills + orchestrator                    |
| OpenCode      | ✅     | Config en `~/.config/opencode/`          |
| Claude        | ✅     | Config en `.claude/`                     |

---

## Historial de Commits Recientes

| Commit      | Fecha       | Descripción                                        |
| ----------- | ----------- | -------------------------------------------------- |
| `105a50b81` | 2026-07-13  | docs: audit results in Notas_de_Proceso + Context_Memory |
| `60798a792` | 2026-07-13  | fix: project audit — paths, shebangs, stats, idempotency, orphans |
| `693e46562` | 2026-07-13  | feat: English Learning skill + metrics module      |
| `f1f24b431` | 2026-07-13  | docs: Consequences Tabs SDD artifacts              |
| `114b42db1` | 2026-07-13  | feat: Consequences Tabs module (9 files, ~2170 lines) |

---

## Pendientes Conocidos

- [ ] Auto-Improvement Engine: `learnings.json` crece con duplicados (1,364 aplicaciones en pattern 3)
- [ ] 12 scripts necesitan migración a path sentinel
- [ ] Consolidar `.agent/` backup con `archive/` (decisión del usuario)
- [ ] 4 SOTA engines stubs — funcionales pero sin lógica real

---

## 🧠 PersonalOS v5.1.0 — Estado Actual (2026-07-14)

### Qué es este OS
PersonalOS es un sistema operativo personal con IA que ejecuta tareas automáticamente, aprende de resultados y mejora solo. No es un chatbot — es un sistema cerrado.

### Componentes principales (construidos en esta sesión)
- **Skill Chain Engine** (`skill_chain.py`, 1029 líneas) — Ejecuta cadenas de skills automáticamente
- **Prototype Studio** (`prototype_studio.py`, 584 líneas) — Crea prototipos funcionales en minutos
- **Curation Filter** (`curation_filter.py`, 437 líneas) — Clasifica señales del mundo exterior
- **Signal Aggregator** (`signal_aggregator.py`, 487 líneas) — Agrega señales de múltiples fuentes
- **Output Evaluator** (`output_eval.py`, 505 líneas) — Evalúa calidad de outputs (score 0-100)
- **Disaster Recovery** (`engram_snapshot/restore/verify.py`) — Backup y restore de Engram
- **Benchmarks** (`benchmark_baseline.py`) — Baselines de performance
- **Session Init Test** (`session_init_test.py`) — Suite pre-sesión
- **Certification Suite** (`certify_10_10.py`) — Validador maestro
- **Onboarding** (`onboarding_checklist.py`, `no_se_por_donde_empezar.py`) — TUI + NL recommendation

### Loop AI Native (Modelo Theo Taba)
```
CAPTURE → CURATE → EXECUTE → EVAL → SHIP → SIGNAL → LEARN → REPEAT
```
El sistema se cierra solo. Cada ejecución alimenta la siguiente.

### Chains disponibles
- `proposal_chain` — market-proposal → humanizador → verificador → analytics
- `content_chain` — draft → humanizador → review → publish
- `audit_chain` — seo-audit → verificador → humanizador
- `prototype_chain` — hypothesis → build → test → labs

### Comandos clave
```bash
python skill_chain.py run <chain> --param value
python prototype_studio.py run --idea "X" --brand Y
python content_pipeline.py run --topic "X" --platform linkedin
python output_eval.py evaluate --input file.md --type content
python certify_10_10.py --verbose
python no_se_por_donde_empezar.py --question "X"
```

### Estado de planes
- PLAN_OS_10_10.md: Sprints 1-5 (Sprint 4.2 Dashboard pendiente)
- PLAN_AI_NATIVE.md: Fases 1-4 completas (2.4 Cron y 4.3 Dashboard pendientes)
