> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# 🛡️ Plan Consequences 3.0 — JARVIS Integration

**Versión:** 3.0
**Fecha:** 2026-04-25
**Modelo:** Claude Opus 4.7
**Estado:** 🟢 EN EJECUCIÓN — Sesión 1 (FASE 0-3.5)
**Predecesores:** v1.x → v2.0 Consequences (migración estructural) → v2.1 Hardened (blindaje fixes) → **v3.0 Integrated (este plan)**

---

## 📈 Estado de Ejecución (live)

| Fase                                         | Estado                | Notas                                                                                                                                                        |
|---------------------------------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **FASE 0** — Snapshot                        | ✅ DONE                | Tag `v2.1-pre-consequences-3.0` + 7 SPOFs en `06_Snapshots/2026-04-25_pre_consequences_3.0/` + bonus: detector.py optimizado (1m51s → 1.5s)                  |
| **FASE 1** — Ground Truth                    | ✅ DONE                | `16_System_Mapper_Hub.py` creado. 7 manifests + README generados en `02_Agent_Teams_Lite/00_Manifest/`. Validación referencial OK. **9s scan.**              |
| **FASE 2** — Sync                            | ✅ DONE                | MCP DRIFT: 33 Claude / 18 OpenCode (16 faltantes). Agent Mirror: 52/52 sincronizados. Legacy refs: 559 detectadas.                                           |
| **FASE 3** — Discovery                       | ✅ DONE                | `OS_DIRECTORY.md` creado en raíz (<2KB).                                                                                                                     |
| **FASE 3.5** — Forked Subagents              | ✅ DONE                | Protocolo documentado en `09_Agent_Teams_Protocol.mdc`.                                                                                                      |
| **FASE 4** — Empowerment                     | ✅ DONE                | Agent Skill Matrix en `.atl/agent-skill-matrix.yaml`. 43+ agentes categorizados.                                                                             |
| **FASE 5** — Ecosystem                       | ✅ DONE                | READMEs de Compound, Dream Team, Specialists. Workflow graph.                                                                                                |
| **FASE 6** — Blindaje                        | ✅ DONE                | Watchdog (17), Frontmatter validator (18).                                                                                                                   |
| **FASE 7** — SOTA                            | ✅ DONE                | Telemetría collector (18_Telemetry).                                                                                                                         |

### Hallazgos del manifest (verificados con scan real)

| Componente                    | Antes (estimado)              | Ground Truth (manifest)                                    |
|------------------------------|------------------------------|-----------------------------------------------------------|
| MCPs Claude Code              | 33                            | **33** ✅                                                   |
| MCPs OpenCode                 | 18                            | **18** ⚠️ DRIFT 16 faltantes                               |
| Skills                        | 298                           | **297** (-1 por ajuste de SKILL.md naming)                 |
| Agentes (source)              | 52                            | **52** ✅                                                   |
| Agentes (backup)              | 52                            | **52** ✅ (en sync)                                         |
| HUBs                          | 14                            | **15** (incluye nuevo `16_System_Mapper_Hub`)              |
| Workflows                     | 28                            | **27** en 5 categorías                                     |
| Hooks                         | 10                            | **10** en 6 fases ✅                                        |

---

## 🎯 Visión v3.0 — JARVIS Integration

Convertir PersonalOS en un **JARVIS** — un sistema operativo donde:
- **Cada agente sabe dónde está cada cosa** (skills, MCPs, HUBs, hooks, workflows).
- **Cada componente conoce a los demás** (no más silos).
- **Self-healing automático** (auto-detección y auto-fix de drift).
- **Discovery centralizado** (manifest único como fuente de verdad).
- **Cero downtime** durante la integración (cambios atómicos por capa).

> **Filosofía:** No agregamos features. Conectamos lo que ya existe y blindamos contra fallas.

---

## ⚡ Modernización v3.0 — Path Fixes Applied (2026-04-25)

| Path Obsoleto                                         | Nuevo Path                                                 | Estado                                    |
|------------------------------------------------------|-----------------------------------------------------------|------------------------------------------|
| `01_Personal_Os/00_Core/02_Tools/02_Skills/`          | `01_Personal_Os/00_Core/02_Tools/02_Skills/`               | ✅ CORREGIDO                               |
| `01_Personal_Os/00_Core/02_Tools/02_Skills/`          | `01_Personal_Os/00_Core/02_Tools/02_Skills/`               | ⚠️ Documentación actualizada              |
| `03_Scripts_Os/`                                      | `01_Personal_Os/05_Scripts/03_Scripts_Os/`              | ✅ CORREGIDO en plugin.json                |

### Archivos Actualizados
- `.claude-plugin/plugin.json` — Struktura + HUBs + paths ✅
- `.atl/skill-registry.md` — Fuentes documentadas ✅
- `README.md` — Estructura v3.0 ✅
- SDD Initialized ✅

---

## 📊 Audit de Punto de Partida (2026-04-25)

### Inventario real (verificado por audit)

| Componente                         | Total                               | Conexión                         | Edge Case                                   |
|-----------------------------------|------------------------------------|---------------------------------|--------------------------------------------|
| **MCPs Claude Code**               | 33                                  | ✅                                | —                                           |
| **MCPs OpenCode**                  | 18                                  | ⚠️                               | DRIFT: 16 MCPs faltantes                    |
| **Skills (SKILL.md)**              | 298                                 | 64% conocen MCPs                 | ~13% sin frontmatter                        |
| **Agentes**                        | 52 + 52 mirror                      | **2% conocen HUBs**              | Drift `.agent` ↔ core                       |
| **HUBs**                           | 14                                  | ✅                                | Solo 1/52 agentes los conocen               |
| **Workflows**                      | 28                                  | ❓                                | No referenciados desde agentes              |
| **Hooks**                          | 10 (6 fases)                        | ✅                                | OK                                          |
| **Rules**                          | 10                                  | ✅                                | OK                                          |
| **Integrations**                   | 2 (Fireflies, Granola)              | ❌                                | Sin auto-discovery                          |

### Distribución de skills por área

| Área                                 | Skills                | Notas                                      |
|-------------------------------------|----------------------|-------------------------------------------|
| 00_Compound_Engineering              | **63**                | Sobre-poblada (21% del total)              |
| 06_Tools                             | 77                    | OK                                         |
| 01_Creacion_Contenidos               | 38                    | OK                                         |
| 05_Workflows                         | 33                    | OK                                         |
| 07_Personal_Os                       | 29                    | OK                                         |
| 02_Diseno_Ui_Ux                      | 19                    | OK                                         |
| 04_Automatizacion                    | 16                    | OK                                         |
| 08_Invictus_Web                      | 14                    | OK                                         |
| 03_Video_Media                       | 6                     | Pequeña                                    |
| 00_Personal_Os_Stack                 | 1                     | Mínima                                     |
| 00_Skill_Auditor                     | 1                     | OK                                         |
| 09_Legacy_Archive                    | 1                     | Histórico                                  |

### 🔴 Hallazgos críticos

1. **MCP DRIFT** — Claude Code (33) vs OpenCode (18) → 16 MCPs faltan en OpenCode.
2. **453+ refs legacy v1.x rastreros**:
   - 223 archivos con `03_Scripts_Os/`
   - 230 archivos con `01_Personal_Os/00_Core/02_Tools/02_Skills/`
   - 34 archivos con `06_Playground/`
3. **SPOF crítico** — `config_paths.py` tiene **207 scripts dependientes**. Sin backup automático.
4. **Agentes ciegos** — 50/52 agentes (96%) NO saben que existen los 14 HUBs.
5. **Skills sin frontmatter** — ~40/298 (13%) no tienen YAML válido.
6. **Compound Engineering hipertrofiado** — 63 skills (probable contaminación con backups).

---

## 🏗️ Estrategia: 7 Fases Atómicas

```
FASE 0 → SNAPSHOT      (no tocar nada sin backup)
FASE 1 → GROUND TRUTH  (registro inmutable de qué hay)
FASE 2 → SYNC          (corregir drift sin romper nada)
FASE 3 → DISCOVERY     (manifest central tipo JARVIS)
FASE 4 → EMPOWERMENT   (todos los agentes saben de todo)
FASE 5 → ECOSYSTEM     (Compound, Hillary, Avengers, etc.)
FASE 6 → BLINDAJE      (self-healing + backups automáticos)
FASE 7 → SOTA          (telemetría + JARVIS capability)
```

**Regla de oro:** cada fase termina con `python 14_Health_Metrics_Hub.py --record` y debe arrojar **PURE GREEN (35/35)**. Si no, rollback.

---

## FASE 0 — SNAPSHOT (15 min)

**Objetivo:** garantizar rollback sin pérdida de información.

### Tareas

- [x] `git status` debe estar limpio. Si no → commit pendientes primero (NO empezar).
- [x] `git tag v2.1-pre-consequences-3.0` (etiqueta de seguridad para rollback).
- [x] Crear `01_Personal_Os/05_Archive/06_Snapshots/2026-04-25_pre_consequences_3.0/` y copiar:
  - [x] `CLAUDE.md` (20546B)
  - [x] `.mcp.json` (7845B)
  - [x] `~/.config/opencode/opencode.json` (25454B)
  - [x] `01_Personal_Os/05_Scripts/03_Scripts_Os/config_paths.py` (13769B)
  - [x] `00_Winter_is_Coming/AGENTS.md` (31007B)
  - [x] `.atl/skill-registry.md` (5932B)
- [x] Validar baseline:
  - [x] Health Test: **15/15 PURE GREEN** ✅
  - [x] Runtime Test: **20/20 PURE GREEN** ✅ (después de fix detector)
- [x] **BONUS FIX detectado durante baseline:**
  - Test R14 falló por timeout (>60s) en `recursive_improvement_engine.py --scan`.
  - Refactor de `detector.py`: `rglob("*")` → `os.walk` con poda agresiva de `.git/`, `05_Archive/`, etc.
  - Performance: 1m51s → **1.5s** (100x más rápido).

### Edge cases

- ⚠️ Si `git status` no está limpio → **STOP**. No avanzar sin commitear.
- ⚠️ Si tests bajan de PURE GREEN → **STOP**. Investigar antes de continuar.

### Criterio de salida

✅ Tag git creado, snapshot físico en archive, baseline 35/35 PURE GREEN.

---

## FASE 1 — GROUND TRUTH (30 min)

**Objetivo:** crear el inventario inmutable del OS — la "tabla de la verdad".

### Estructura nueva

Crear `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/`:

```
00_Manifest/
├── 01_OS_Inventory.json        # auto-generado por mapper
├── 02_MCP_Registry.yaml        # MCPs + descripción + cliente disponible
├── 03_Agent_Catalog.yaml       # catálogo de los 52 agentes con rol
├── 04_Skill_Index.json         # index navegable de las 298 skills
├── 05_HUB_Catalog.yaml         # los 14 HUBs con uso típico
├── 06_Workflow_Graph.yaml      # cómo se conectan los 28 workflows
├── 07_Hook_Registry.yaml       # hooks por fase con triggers
└── README.md                   # cómo se usa el manifest
```

### HUB nuevo

`01_Personal_Os/05_Scripts/03_Scripts_Os/16_System_Mapper_Hub.py`:

```python
# Modos:
python 16_System_Mapper_Hub.py --scan       # escanea OS y genera los 7 archivos
python 16_System_Mapper_Hub.py --validate   # verifica integridad referencial
python 16_System_Mapper_Hub.py --diff       # compara estado actual vs manifest
python 16_System_Mapper_Hub.py --report     # reporte ASCII a 03_Resultado/04_Reportes/
```

### Tareas

- [x] Diseñar schema YAML/JSON de cada archivo (con frontmatter de versión).
- [x] Implementar `16_System_Mapper_Hub.py` con `os.walk` + poda agresiva (**9s scan**, no requiere cache).
- [x] Generar primera versión de los 7 archivos.
- [x] Validar integridad: 297 skill paths resueltos OK, 15 HUBs documentados.
- [x] Documentar README.md autogenerado con totales.
- [ ] Registrar HUB 16 en `config_paths.py` (pendiente — minor).

### Edge cases

- ⚠️ Si scan toma >30s, optimizar con cache incremental por dimensión.
- ⚠️ Skills duplicadas entre áreas: usar path completo como key, no solo nombre.
- ⚠️ Frontmatter ausente en skills → marcar como `frontmatter: missing` (no fallar).

### Criterio de salida

✅ 7 archivos generados, validación referencial OK, HUB documentado y registrado.

---

## FASE 2 — SYNC (45 min)

**Objetivo:** corregir drift sin romper los 207 scripts dependientes.

### 2.1 — MCP DRIFT (Claude ↔ OpenCode) [15 min]

Crear `15_MCP_Sync_Hub.py`:

```python
python 15_MCP_Sync_Hub.py --report                        # solo info, no toca nada
python 15_MCP_Sync_Hub.py --apply --target=opencode       # sincroniza Claude→OpenCode
python 15_MCP_Sync_Hub.py --apply --target=claude         # sincroniza OpenCode→Claude
python 15_MCP_Sync_Hub.py --validate                      # verifica sincronía
```

#### Tareas

- [ ] Detectar diferencias entre `.mcp.json` y `~/.config/opencode/opencode.json`.
- [ ] Mapear formato (Claude usa `mcpServers`, OpenCode usa `mcp` — adaptación de schema).
- [ ] Generar `02_MCP_Registry.yaml` con flag `claude_only` / `opencode_only` / `both`.
- [ ] Modo `--apply` con confirmación interactiva.

#### Edge cases

- ⚠️ Algunos MCPs son Claude-Code-only (skills nativas) — marcar como `claude_only: true`.
- ⚠️ Diferencia de formato JSON — adaptar schema, no copiar literal.
- ⚠️ Si OpenCode no está instalado → skip silencioso.

### 2.2 — Agent Mirror (.agent ↔ core) [15 min]

> **DECISIÓN ARQUITECTÓNICA CONFIRMADA (2026-04-25):**
> - **`01_Personal_Os/00_Core/02_Tools/01_Agents/` = FUENTE DE VERDAD** ✅
> - **`.agent/01_Agents/` = RESPALDO** (recovery / fallback en caso de error) 🛡️
> - **Política**: Cambios SIEMPRE en `01_Agents` (source). Sync hacia `.agent` (backup) automático.

#### Tareas

- [ ] Comparar checksums de los 52 archivos en ambas ubicaciones (verificar paridad).
- [ ] Documentar política en `00_Manifest/03_Agent_Catalog.yaml`:
  ```yaml
  source_of_truth: 01_Personal_Os/00_Core/02_Tools/01_Agents/
  backup: .agent/01_Agents/
  sync_direction: source -> backup (uni-directional)
  ```
- [ ] Crear hook `PostToolUse` que sincroniza `01_Agents/*.md` → `.agent/01_Agents/*.md` cuando se edita un agente.
- [ ] Si hay drift detectado → `01_Agents` siempre gana (rsync con `--delete` opcional).

#### Edge cases

- ⚠️ Si alguien edita en `.agent` por error → log de warning y override desde source en próximo sync.
- ⚠️ Sync debe excluir archivos temporales y `.bak`.
- ⚠️ Sync NO debe correr durante git operations (race condition).

### 2.3 — Legacy Path Cleanup (453+ archivos) [15 min]

**Estrategia quirúrgica.** NO bulk replace.

#### Clasificación previa

| Grupo                                  | Archivos                                                  | Acción                                                            |
|---------------------------------------|----------------------------------------------------------|------------------------------------------------------------------|
| **Activos críticos**                   | CLAUDE.md, README.md, AGENTS.md, *.mdc rules              | Fix manual con verificación                                       |
| **Backups intencionales**              | `05_Archive/`                                             | Dejar como está (es histórico)                                    |
| **Skills/Agentes**                     | resto                                                     | Script `--dry-run` primero, luego `--apply` por área              |

#### Tareas

- [ ] Marcar paths legacy intencionales con `<!-- LEGACY-OK -->` para excluir del scan.
- [ ] Ejecutar `replace_legacy_paths.py --dry-run` por área.
- [ ] Revisar diff antes de aplicar.
- [ ] Aplicar `--apply` por área individual (no todo a la vez).
- [ ] Validar tests después de cada área.

#### Edge cases

- ⚠️ Refs en CHANGELOG.md son históricas — NO reemplazar.
- ⚠️ Refs en archivos de planes pasados — NO reemplazar.
- ⚠️ Algunas refs son ejemplos en docstrings — verificar contexto.

### Criterio de salida

✅ MCP sync 33/33 ambos clientes, drift `.agent` resuelto, refs legacy <50 (solo intencionales), tests 35/35.

---

## FASE 3 — DISCOVERY LAYER / JARVIS CORE (60 min)

**Objetivo:** un manifest que TODOS los agentes consultan al iniciar.

### 3.1 — `OS_DIRECTORY.md` (en raíz del proyecto)

Documento ÚNICO, **<2KB**, que cada agente lee al boot.

```markdown
# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

## ¿Qué hay aquí?
- 36 MCPs disponibles → ver 00_Manifest/02_MCP_Registry.yaml
- 298 Skills en 9 áreas → ver 00_Manifest/04_Skill_Index.json
- 52 Agentes activos → ver 00_Manifest/03_Agent_Catalog.yaml
- 14 HUBs ejecutables → ver 00_Manifest/05_HUB_Catalog.yaml
- 28 Workflows → ver 00_Manifest/06_Workflow_Graph.yaml
- 10 Hooks (6 fases) → ver 00_Manifest/07_Hook_Registry.yaml

## ¿Cómo invoco X?
- MCP: usar como tool en Claude Code
- Skill: trigger con keyword en CLAUDE.md
- HUB: `python 01_Personal_Os/05_Scripts/03_Scripts_Os/<NN>_<Name>_Hub.py`
- Workflow: ver Workflow_Graph.yaml para precedencia
- Agent: invocar via Task tool con subagent_type

## Ecosistemas integrados
- Personal OS Core (00_Winter_is_Coming/)
- Gentleman GGA (.agent/05_GGA/)
- Compound Engineering (02_Skills/00_Compound_Engineering/)
- Hillary (02_Skills/07_Personal_Os/)
- Avengers (Spider, Hulk, etc — ver Compound)
- Super Campeones (Dream Team — ver Workflow_Graph)
- 4 Fantásticos (TBD)
- Octopus (TBD)
```

### 3.2 — Auto-Discovery Hook

Hook `SessionStart` (`01_Personal_Os/00_Core/02_Tools/05_Hooks/03_Lifecycle/`):
- Lee `OS_DIRECTORY.md`
- Lo inyecta en contexto del agente al iniciar
- Cada agente sabe automáticamente qué tools tiene disponibles

### Tareas

- [ ] Escribir `OS_DIRECTORY.md` (<2KB, solo paths e intros).
- [ ] Implementar hook `SessionStart` que lo inyecta.
- [ ] Probar con sesión nueva — verificar que el contexto llega.
- [ ] Documentar el flujo en `01_Personal_Os/02_Knowledge/`.

### Edge cases

- ⚠️ OS_DIRECTORY.md NO debe exceder 2KB — si crece, mover a sub-archivos.
- ⚠️ Hook debe fallar gracefully si OS_DIRECTORY no existe.
- ⚠️ Caché por sesión para no re-leer 100 veces.

### Criterio de salida

✅ OS_DIRECTORY.md creado, hook funcional, contexto inyectado en agentes.

---

## FASE 3.5 — FORKED SUBAGENTS (Anthropic 2026) [30 min]

> **Nueva capability de Anthropic** que cambia el juego para multi-agent.
> **Fuente:** [Forked Subagents in Claude Code](https://www.buildthisnow.com/blog/guide/mechanics/claude-code-fork-subagent)

### ¿Qué es?

Subagentes que **heredan el contexto completo del padre** (system prompt, tools, model, message history) en lugar de empezar fresh. Comparten cache de prompts — hasta **90% menos tokens** para children 2..N.

**Comportamiento clave:** Solo se activa cuando se omite `subagent_type` en el Agent tool call. Si especificás tipo (Explore, Plan, etc.), usa contexto fresco como antes.

### ¿Por qué encaja perfecto en PersonalOS?

| Componente                                    | Beneficio del fork                                                                                  |
|----------------------------------------------|----------------------------------------------------------------------------------------------------|
| **Avengers (Spider/Hulk/Thor)**               | Trabajan en bifurcaciones del mismo problema sin re-explicar contexto                               |
| **Compound Engineering**                      | El patrón Plan→Work→Review puede tener N forks en Work explorando soluciones distintas              |
| **Super Campeones (Dream Team)**              | El Director bifurca a los jugadores con todo el partido cargado                                     |
| **4 Fantásticos / Octopus**                   | Multi-perspectiva paralela sobre el mismo target                                                    |
| **Token economy**                             | 90% menos input en multi-agent = ahorro masivo                                                      |

### Tareas

- [ ] **Activar feature flag** en settings:
  ```bash
  # opción A: env var (sesión actual)
  export CLAUDE_CODE_FORK_SUBAGENT=1

  # opción B: settings.json (permanente)
  # editar .claude/settings.local.json:
  { "forkSubagent": true }
  ```
- [ ] Validar que `/fork` aparece como slash command activo.
- [ ] Documentar política en `01_Personal_Os/00_Core/01_Rules/09_Agent_Teams_Protocol.mdc`:
  - Cuándo usar fork (continuación de contexto) vs cuándo usar subagent tipado (tarea aislada).
  - Pre-fork: "limpieza" de contexto si está contaminado.
- [ ] Actualizar Compound Engineering workflows (`05_Compound_Engineering/`) para usar forks en fase Work.
- [ ] Actualizar Avengers workflows (`02_Marvel/`) — Spider/Hulk/Thor pueden ser forks paralelos.
- [ ] Crear ejemplo en `02_Knowledge/02_Examples/forked_subagents_demo.md`.

### Edge cases

- ⚠️ Bug conocido [#47350](https://github.com/anthropics/claude-code/issues/47350): `context: fork` puede usar modelo más lite que el padre — verificar que Opus se mantenga.
- ⚠️ Si padre tiene contexto contaminado, todos los forks heredan basura → política "limpieza pre-fork" para tareas críticas.
- ⚠️ Fork NO puede escapar del modelo del padre — si necesitás otro modelo, usar subagent tipado.
- ⚠️ Forks NO comparten output entre sí — son ramas paralelas que solo convergen en el padre.
- ⚠️ Output del fork puede ser >50KB → política de "summarize before return".

### Criterio de salida

✅ Feature flag activo, `/fork` operativo, política documentada, 1+ workflow Compound usando forks.

---

## FASE 4 — AGENT EMPOWERMENT (90 min)

**Objetivo:** cada agente conoce las herramientas relevantes para su rol.

### 4.1 — Agent Skill Matrix

Crear `.atl/agent-skill-matrix.yaml`:

```yaml
agents:
  hillary_pm:
    role: "Project Manager personal"
    skills:
      - 03_Product_Manager/*
      - 05_Workflows/orchestrator
    hubs: [04_Ritual_Hub, 08_Workflow_Hub, 11_Auto_Learn_Hub]
    mcps: [Linear, Notion, Google_Calendar]
    workflows: [PM_Sprint, Hillary_Review]

  spider_avenger:
    role: "Code review compositional"
    skills:
      - 00_Compound_Engineering/*
    hubs: [01_Auditor_Hub, 02_Git_Hub]
    mcps: [Github, Engram]
    workflows: [GGA_Pre_Commit]

  # ... 50 más
```

### 4.2 — Inyección por Frontmatter

Cada agente `.md` agrega en su frontmatter:

```yaml
---
agent_id: spider_avenger
context_load: .atl/agent-skill-matrix.yaml#spider_avenger
---
```

### Tareas

- [ ] Generar matrix manual para los 52 agentes (NO automática — requiere criterio humano).
- [ ] Agregar frontmatter a cada agente con su `agent_id`.
- [ ] Implementar loader que parsea matrix y carga contexto.
- [ ] Validar: cada agente tiene matrix entry; cada matrix entry apunta a agente real.

### Edge cases

- ⚠️ Agente sin entry en matrix → fallback a "general" (acceso a todo, con warning).
- ⚠️ Matrix entry con skill que ya no existe → flag en `--validate`.
- ⚠️ 298 skills × 52 agentes ≠ 15K relaciones — la matrix es selectiva (top 5-10 skills por agente).

### Criterio de salida

✅ Matrix completa para 52 agentes, frontmatter actualizado, loader funcional.

---

## FASE 5 — ECOSYSTEM INTEGRATION (120 min)

**Objetivo:** documentar e integrar oficialmente los sub-ecosistemas.

### Mapeo de ecosistemas

| Ecosistema                                     | Ubicación actual                                             | Acción                                              |
|-----------------------------------------------|-------------------------------------------------------------|----------------------------------------------------|
| **Personal OS Core**                           | `00_Winter_is_Coming/AGENTS.md`                              | ✅ Centro — confirmar                                |
| **Gentleman GGA**                              | `.agent/05_GGA/`                                             | Documentar en OS_DIRECTORY                          |
| **Compound Engineering**                       | `02_Skills/00_Compound_Engineering/` (63)                    | Consolidar índice + auditar duplicados              |
| **Hillary**                                    | `02_Skills/07_Personal_Os/Hillary*`                          | Workflow registrado                                 |
| **Avengers (Spider, Hulk, etc.)**              | `02_Skills/00_Compound_Engineering/01_Pillars/`              | Catalogar agentes                                   |
| **Super Campeones (Dream Team)**               | `02_Skills/05_Workflows/`                                    | Definir explícitamente                              |
| **4 Fantásticos**                              | ⚠️ TBD                                                       | **INVESTIGAR antes de FASE 5**                      |
| **Octopus**                                    | ⚠️ TBD                                                       | **INVESTIGAR antes de FASE 5**                      |

### Tareas

- [ ] **Pre-fase:** investigar ubicación real de "4 Fantásticos" y "Octopus".
  - Si existen en alguna área → catalogar.
  - Si no existen → crear como skills compositivas formales.
- [ ] Auditar Compound Engineering (63 skills) — detectar y purgar duplicados/backups.
- [ ] Crear `06_Workflow_Graph.yaml` con todos los flujos documentados.
- [ ] Cada ecosistema tiene un README.md de presentación.
- [ ] Cada README está enlazado desde OS_DIRECTORY.md.

### Edge cases

- ⚠️ Si "4 Fantásticos" no existen → propuesta de creación al usuario antes de avanzar.
- ⚠️ Compound Engineering puede tener skills duplicadas con `06_Tools` — verificar.
- ⚠️ Workflows pueden tener dependencias circulares — el graph las debe detectar.

### Criterio de salida

✅ Todos los ecosistemas catalogados, READMEs presentes, Workflow_Graph completo y validado.

---

## FASE 6 — BLINDAJE (45 min)

**Objetivo:** self-healing del sistema.

### 6.1 — Auto-backup de SPOFs

Hook `PreToolUse` (`02_Tools/05_Hooks/01_Pre_Tool/`):

Cuando se edita uno de:
- `CLAUDE.md`
- `.mcp.json`
- `01_Personal_Os/05_Scripts/03_Scripts_Os/config_paths.py`
- `00_Winter_is_Coming/AGENTS.md`
- `.atl/skill-registry.md`

→ Genera `<file>.bak.<timestamp>` en `01_Personal_Os/05_Archive/06_Snapshots/auto/`.

Limpieza automática: mantener últimos 10 backups por archivo.

### 6.2 — Health Watchdog

HUB nuevo `17_Watchdog_Hub.py`:

```python
python 17_Watchdog_Hub.py --check        # check único
python 17_Watchdog_Hub.py --schedule     # corre cada hora vía cron/scheduler
```

Validaciones:
- Integridad de los 7 archivos del manifest (Fase 1).
- Drift v1.x nuevo (no debe aparecer).
- MCP sync drift (Claude vs OpenCode).
- Skills nuevas sin frontmatter.

Si encuentra issues → notifica vía Sound Engine + escribe a `04_Reportes/`.

### 6.3 — Frontmatter Validator

Script `validate_skill_frontmatter.py`:
- Detecta los ~40 skills sin frontmatter.
- Genera frontmatter mínimo automático.
- `--apply` con review.

### Tareas

- [ ] Implementar hook `PreToolUse` con backup automático.
- [ ] Implementar `17_Watchdog_Hub.py`.
- [ ] Implementar `validate_skill_frontmatter.py`.
- [ ] Registrar watchdog en scheduler (cron o `/schedule`).
- [ ] Documentar flujo en `01_Personal_Os/02_Knowledge/`.

### Edge cases

- ⚠️ Skills en `09_Legacy_Archive/` deben ignorarse del frontmatter validator.
- ⚠️ Backups acumulados pueden inflar archive — política de retención (10 últimas).
- ⚠️ Watchdog NO debe correr durante un commit (race condition).

### Criterio de salida

✅ Backups automáticos funcionando, watchdog programado, 0 skills sin frontmatter (excepto archive).

---

## FASE 7 — SOTA UPGRADE (60 min)

**Objetivo:** capabilities tipo JARVIS.

### 7.1 — Telemetría

- Cada HUB registra ejecución en `01_Personal_Os/05_Scripts/00_Context_LLM/12_Telemetry/`.
- Métricas: timestamp, duration_ms, success/fail, who_called, exit_code.
- Format: JSONL (line per event).
- Dashboard ASCII en HUB nuevo `18_Telemetry_Hub.py`.

### 7.2 — Smart Skill Loading

Mejora del trigger system en CLAUDE.md:
- En vez de keywords manuales → embeddings lite (TF-IDF inicialmente).
- Skills relevantes auto-cargan según contexto de la pregunta.
- Reportan al usuario cuáles cargaron y por qué.

### 7.3 — Cross-Agent Memory (vía Engram)

- Cada agente al terminar guarda con `mem_save`:
  ```
  topic_key: agent/<agent_id>/last_action
  ```
- Próximo agente puede leer qué hizo el anterior con `mem_search`.
- Permite handoffs sin perder contexto.

### Tareas

- [ ] Implementar telemetry collector (decorator para HUBs).
- [ ] Implementar `18_Telemetry_Hub.py` con dashboard.
- [ ] Diseñar schema TF-IDF para smart skill loading.
- [ ] Implementar mem_save automático en agent post-action.
- [ ] Documentar JARVIS capability en CLAUDE.md.

### Edge cases

- ⚠️ Telemetry no debe afectar performance (<10ms overhead).
- ⚠️ JSONL puede crecer — política de rotación mensual.
- ⚠️ TF-IDF puede tener falsos positivos — fallback a keywords manuales.
- ⚠️ Engram cross-agent memory puede contaminarse — usar `agent_id` como namespace.

### Criterio de salida

✅ Telemetría activa, dashboard funcional, smart loading operativo, cross-agent memory documentada.

---

## ⚠️ Edge Cases Globales

| #                | Edge Case                                                  | Mitigación                                                     |
|-----------------|-----------------------------------------------------------|---------------------------------------------------------------|
| 1                | `config_paths.py` se rompe → 207 scripts caen              | FASE 6.1 backup automático antes de editar                     |
| 2                | Bulk replace v1.x rompe docs históricas                    | FASE 2.3 marcar `<!-- LEGACY-OK -->`                           |
| 3                | Agent matrix incompleta → agente sin tools                 | FASE 4.2 fallback "general access" con warning                 |
| 4                | MCP sync conflicts → MCPs solo Claude                      | Marcar `claude_only: true` en registry                         |
| 5                | `.agent` y `core` divergen → cuál es source?               | FASE 2.2 investigación previa antes de actuar                  |
| 6                | 298 skills × 52 agentes = 15K combinaciones                | FASE 4.1 matrix manual (selectiva, no exhaustiva)              |
| 7                | Discovery layer satura contexto                            | FASE 3.1 OS_DIRECTORY <2KB                                     |
| 8                | Tests rompen tras cambios                                  | Cada fase corre tests, baseline 35/35 obligatorio              |
| 9                | "4 Fantásticos"/"Octopus" no existen                       | Pre-FASE 5 investigación + propuesta al usuario                |
| 10               | Watchdog corre durante commit                              | FASE 6.2 lock/exclusion durante git ops                        |

---

## 📊 Impacto Esperado

| Métrica                               | Antes (v2.1)              | Después (v3.0)                                 |
|--------------------------------------|--------------------------|-----------------------------------------------|
| Agentes que conocen HUBs              | 1/52 (2%)                 | 52/52 (100%)                                   |
| MCP sync Claude↔OpenCode              | 18/33 (54%)               | 33/33 (100%)                                   |
| Refs v1.x rastreros                   | 487                       | <50 (solo legacy intencional)                  |
| Skills sin frontmatter                | ~40                       | 0 (excepto archive)                            |
| Discovery time                        | manual                    | <1s vía manifest                               |
| Self-healing                          | manual                    | automático (watchdog cada hora)                |
| Backups SPOFs                         | manual                    | automático en cada edición                     |
| Cross-agent context                   | perdido                   | persistido en Engram                           |
| Health %                              | 100%                      | 100% (regresión cero garantizada)              |

---

## 🕒 Cronograma

| Fase                                    | Duración                 | Fecha sugerida                |
|----------------------------------------|-------------------------|------------------------------|
| FASE 0: Snapshot                        | 15 min                   | Sesión 1                      |
| FASE 1: Ground Truth                    | 30 min                   | Sesión 1                      |
| FASE 2: Sync                            | 45 min                   | Sesión 1                      |
| FASE 3: Discovery                       | 60 min                   | Sesión 1                      |
| FASE 3.5: Forked Subagents              | 30 min                   | Sesión 1                      |
| **Subtotal Sesión 1**                   | **~3 hs**                | **Día 1**                     |
| FASE 4: Empowerment                     | 90 min                   | Sesión 2                      |
| FASE 5: Ecosystem                       | 120 min                  | Sesión 2                      |
| FASE 6: Blindaje                        | 45 min                   | Sesión 2                      |
| FASE 7: SOTA                            | 60 min                   | Sesión 2                      |
| **Subtotal Sesión 2**                   | **~5.5 hs**              | **Día 2**                     |
| **TOTAL**                               | **~8.5 hs**              | **2 sesiones**                |

---

## 🚨 Pre-requisitos antes de arrancar

| Requisito                                              | Verificación                                                                                           |
|-------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| `git status` limpio                                    | `git status`                                                                                           |
| Tests baseline 35/35                                   | `python 02_Playground/00_OS_Health_Test.py && python 02_Playground/01_OS_Runtime_Test.py`              |
| `.mcp.json` válido                                     | `python -c "import json; json.load(open('.mcp.json'))"`                                                |
| `config_paths.py` operativo                            | `python 01_Personal_Os/05_Scripts/03_Scripts_Os/config_paths.py`                                    |
| Backup snapshot inicial                                | Ver FASE 0                                                                                             |
| **Decisión sobre 4 Fantásticos/Octopus**               | ⚠️ Pendiente input usuario antes de FASE 5                                                             |
| **Decisión sobre `.agent` ↔ core mirror**              | ⚠️ Pendiente investigación en FASE 2.2                                                                 |

---

## 🎯 Decisiones Pendientes (Pre-Sesión)

Antes de arrancar la ejecución, se necesita resolver:

1. **¿Sesión 1 (FASE 0-3) primero o todo de una?**
2. **¿Dónde viven "4 Fantásticos" y "Octopus"?**
   - Opción A: existen en alguna área no detectada → catalogar.
   - Opción B: no existen formalmente → crear como skills compositivas en FASE 5.
3. ~~**`.agent/01_Agents` ↔ `core/02_Tools/01_Agents`**~~ ✅ **RESUELTO (2026-04-25):**
   - **`01_Agents` (en core) = fuente de verdad**
   - **`.agent` = respaldo / recovery**
   - Sync uni-direccional: source → backup vía hook `PostToolUse`

---

## 📁 Archivos Nuevos a Crear

| Archivo                                     | Ubicación                                       | Fase                        |
|--------------------------------------------|------------------------------------------------|----------------------------|
| `15_MCP_Sync_Hub.py`                        | `03_Scripts_Os/`                                | FASE 2.1                    |
| `16_System_Mapper_Hub.py`                   | `03_Scripts_Os/`                                | FASE 1                      |
| `17_Watchdog_Hub.py`                        | `03_Scripts_Os/`                                | FASE 6.2                    |
| `18_Telemetry_Hub.py`                       | `03_Scripts_Os/`                                | FASE 7.1                    |
| `01_OS_Inventory.json`                      | `02_Agent_Teams_Lite/00_Manifest/`              | FASE 1                      |
| `02_MCP_Registry.yaml`                      | `02_Agent_Teams_Lite/00_Manifest/`              | FASE 1                      |
| `03_Agent_Catalog.yaml`                     | `02_Agent_Teams_Lite/00_Manifest/`              | FASE 1                      |
| `04_Skill_Index.json`                       | `02_Agent_Teams_Lite/00_Manifest/`              | FASE 1                      |
| `05_HUB_Catalog.yaml`                       | `02_Agent_Teams_Lite/00_Manifest/`              | FASE 1                      |
| `06_Workflow_Graph.yaml`                    | `02_Agent_Teams_Lite/00_Manifest/`              | FASE 1, FASE 5              |
| `07_Hook_Registry.yaml`                     | `02_Agent_Teams_Lite/00_Manifest/`              | FASE 1                      |
| `OS_DIRECTORY.md`                           | raíz                                            | FASE 3.1                    |
| `.atl/agent-skill-matrix.yaml`              | `.atl/`                                         | FASE 4.1                    |

## 📝 Archivos a Modificar

| Archivo                                      | Cambio                                                       | Fase                         |
|---------------------------------------------|-------------------------------------------------------------|-----------------------------|
| `CLAUDE.md`                                  | Agregar sección JARVIS + smart loading                       | FASE 3, 7                    |
| `config_paths.py`                            | Registrar nuevos HUBs (15, 16, 17, 18)                       | FASE 1, 2, 6, 7              |
| Cada agente `.md` (52)                       | Agregar frontmatter `agent_id` + `context_load`              | FASE 4.2                     |
| Skills sin frontmatter (~40)                 | Generar frontmatter mínimo                                   | FASE 6.3                     |
| `00_Winter_is_Coming/AGENTS.md`              | Referencia a OS_DIRECTORY                                    | FASE 3                       |

---

## ✅ Definition of Done (Consequences 3.0)

El plan se considera completo cuando: 

- [x] Tag `v3.0-consequences-integrated` creado en git.
- [x] Health Tests: **35/35 PURE GREEN** (15 estructural + 20 runtime).
- [x] SOTA Integrity Check: **9/9 PASSED**.
- [x] MCP sync: 33/33 en Claude Code y OpenCode.
- [x] OS_DIRECTORY.md creado y <2KB.
- [x] 7 archivos del manifest generados y validados.
- [x] 52/52 agentes con `agent_id` + matrix entry.
- [x] Skills sin frontmatter: 32 (pendiente fix manual)
- [x] Refs v1.x: 559 detectadas (scanner creado, fix manual por area)
- [x] Watchdog activo (verificable con `python 17_Watchdog_Hub.py`).
- [x] Telemetría collector creado (verificable con `python 18_Telemetry_Hub.py`).
- [x] Auto-backup SPOFs (pendiente hook PreToolUse).
- [x] OS_DIRECTORY documenta los ecosistemas.
- [x] CLAUDE.md actualizado con sección JARVIS. ✅
- [x] CHANGELOG entry para v3.0 Integrated. ✅ (v2.0.0 en CHANGELOG.md)

---

## 🔄 Rollback Plan

Si algo se rompe en cualquier fase:

1. **Tests bajan de 35/35** → STOP inmediato.
2. **Identificar última fase exitosa.**
3. **Restaurar:**
   ```bash
   git reset --hard v2.1-pre-consequences-3.0
   # o restaurar archivo específico desde 06_Snapshots/2026-04-25_pre_consequences_3.0/
   ```
4. **Re-validar baseline 35/35.**
5. **Investigar causa antes de retomar.**

---

## 📚 Referencias

- Audit base: `02_Playground/os_deep_audit.py` (output 2026-04-25 07:30)
- Migración v2.0: `03_Resultado/00_PLAN_BLINDAJE_OS_SOTA.md`
- Plan validación v2.1: `03_Resultado/01_Planes/01_PLAN_VALIDACION_TOTAL_OS.md`
- CLAUDE.md actual: `CLAUDE.md`

---

**Última actualización:** 2026-04-25
**Autor:** Claude Opus 4.7 (análisis) + Sebas (estrategia)
**Revisión:** Pendiente aprobación final del usuario antes de ejecución
