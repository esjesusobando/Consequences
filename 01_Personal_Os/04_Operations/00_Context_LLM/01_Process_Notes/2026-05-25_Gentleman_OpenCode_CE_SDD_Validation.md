# Gentleman / OpenCode / Compound Engineering Validation — 2026-05-25

## Resultado

Estado validado y corregido para el ecosistema Gentleman, OpenCode SDD y EveryInc Compound Engineering.

## Git / Cursor

- Repo principal: `master...origin/master` limpio.
- Se inicializaron submódulos que aparecían con `-` en `git submodule status`, probable causa de flechas hacia abajo en Cursor:
  - `01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/23_Tubemaster`
  - `01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/engram`
  - `01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/gentle-pi`
  - `03_Resultado/09b_World_OIM/01_OIM_Website_v2`

## OpenCode SDD

- `~/.config/opencode/opencode.json` valida como JSON correcto.
- `sdd-*` sigue configurado con `hidden=false`.
- Se crearon archivos visibles en `~/.config/opencode/agents` para que OpenCode UI liste los agentes:
  - `gentle-orchestrator.md`
  - `sdd-init.md`
  - `sdd-explore.md`
  - `sdd-propose.md`
  - `sdd-spec.md`
  - `sdd-design.md`
  - `sdd-tasks.md`
  - `sdd-apply.md`
  - `sdd-verify.md`
  - `sdd-archive.md`
  - `sdd-onboard.md`

> Nota: reiniciar OpenCode para recargar el listado de agentes.

## EveryInc Compound Engineering

- Upstream validado: `compound-engineering-v3.8.4`.
- Claude Code:
  - `compound-engineering@every-marketplace` actualizado a `3.8.4` y habilitado.
  - Inventario nativo: 38 skills / 43 agents.
- OpenCode:
  - 43 agents CE.
  - 36 skill dirs CE + `lfg` = 37 skills convertidas.
  - `ce-update` excluida correctamente porque es Claude-only.
- Codex:
  - 43 agents CE.
  - 36 skill dirs CE + `lfg` = 37 skills convertidas.
- Pi:
  - 43 agents CE.
  - 36 skill dirs CE + `lfg` = 37 skills convertidas.

## Gentleman Tooling

- Gentle-AI: `1.30.10`.
- Engram: `1.15.15`.
- GGA: `2.8.1`.
- gentle-pi: `0.3.10` instalado como extensión de Pi.

## Backups relevantes

- Backup manual antes de CE: `C:\Users\sebas\Desktop\ce-backup-20260525201716`.
- Backups automáticos generados por instaladores en:
  - `~/.config/opencode/opencode.json.bak.*`
  - `~/.codex/config.toml.bak.*`
  - legacy backups dentro de `compound-engineering/legacy-backup`.

## Próximo paso operativo

Reiniciar OpenCode, Claude Code y Codex para que todos recarguen configuración/plugins/agentes.

