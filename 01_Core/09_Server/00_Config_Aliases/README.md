# 00_Config_Aliases

## Descripción

Aliases de shell para Think Different PersonalOS.

## Contenido

| Archivo        | Descripción                               |
|----------------|-------------------------------------------|
| `aliases.sh`   | Aliases para bash (source este archivo)   |
| `README.md`    | Este archivo                              |

## Instalación

Agregar al final de `~/.bashrc`:

```bash
# Think Different PersonalOS aliases
source ~/Think_Different/01_Core/09_Server/00_Config_Aliases/aliases.sh
```

## Aliases Disponibles

### HUB Scripts

```bash
gr, audit      # System Auditor
git-hub        # Git operations
aipm           # AI Performance Monitoring
ritual         # Session rituals
validate       # Code validation
tools          # Tool management
integration    # MCP integrations
workflows      # Workflow automation
data           # Data processing
general        # General utilities
```

### System Guardian

```bash
gr             # Dry run
gr-apply       # Apply fixes
gr-agents      # Agent review
```

### PR Commands

```bash
ce-pr          # Create PR
ce-pr-check    # List open PRs
```

## Notas

- Los aliases asumen que `PERSONAL_OS_ROOT=~/Think_Different`
- Para recargar después de cambios: `source ~/.bashrc`

---
*Actualizado: 2026-03-27*
