# Restauración del Agente Primario SDD en OpenCode

> **Propósito**: Documentar cómo volver al esquema anterior donde SDD aparecía como agente primario separado en el selector de OpenCode (junto a Plan, Build, Gentleman).

---

## Estado Actual (Mayo 2026)

El config global `~/.config/opencode/opencode.json` tiene **un solo agente primario**:

| Agente               | Modo       | Descripción                                      |
|---------------------|-----------|-------------------------------------------------|
| `gentle-orchestrator`| **primary**| Gentle AI SDD Orchestrator — orquesta sub-agentes|
| `sdd-apply`          | subagent   | Implementa cambios                               |
| `sdd-archive`        | subagent   | Archiva cambios completados                      |
| `sdd-design`         | subagent   | Diseño técnico                                   |
| `sdd-explore`        | subagent   | Investigación                                    |
| `sdd-init`           | subagent   | Bootstrap SDD                                    |
| `sdd-onboard`        | subagent   | Onboarding SDD                                   |
| `sdd-propose`        | subagent   | Propuestas                                       |
| `sdd-spec`           | subagent   | Especificaciones                                 |
| `sdd-tasks`          | subagent   | Desglose en tareas                               |
| `sdd-verify`         | subagent   | Validación                                       |

Resultado en el selector de agentes de OpenCode: solo ves `gentle-orchestrator`.

---

## Estado Anterior (Backup Stale en Repo)

El backup en `01_Personal_Os/00_Core/02_Tools/03_Mcp/02_OpenCode/opencode.json` todavía muestra la configuración **vieja** con **dos agentes primarios**:

```jsonc
{
  "agent": {
    "gentleman": {
      "description": "Senior Architect mentor - helpful first, challenging when it matters",
      "mode": "primary",
      "prompt": "{file:./01_Personal_Os/11_AGENTS.md}",
      "tools": { "edit": true, "write": true }
    },
    "sdd-orchestrator": {
      "description": "Agent Teams Orchestrator - coordinates sub-agents, never does work inline",
      "mode": "primary",
      // ... prompt extenso con reglas de SDD
    },
    "sdd-apply": { "mode": "subagent", "hidden": true },
    "sdd-archive": { "mode": "subagent", "hidden": true },
    "sdd-design": { "mode": "subagent", "hidden": true },
    "sdd-explore": { "mode": "subagent", "hidden": true },
    "sdd-init": { "mode": "subagent", "hidden": true },
    "sdd-propose": { "mode": "subagent", "hidden": true },
    "sdd-spec": { "mode": "subagent", "hidden": true },
    "sdd-tasks": { "mode": "subagent", "hidden": true },
    "sdd-verify": { "mode": "subagent", "hidden": true }
  }
}
```

Resultado en el selector: veías **Plan, Build, Gentleman, y SDD** como opciones separadas.

> ⚠️ **El backup está stale.** Se actualizó el global directamente y nunca se sync de vuelta al repo.

---

## Cómo Restaurar

Tenés **dos opciones** dependiendo de lo que quieras:

### Opción A: Volver exactamente como antes

Agregar `sdd-orchestrator` como agente primario separado en `~/.config/opencode/opencode.json`, manteniendo `gentle-orchestrator` como está (o renombrándolo de vuelta a `gentleman`).

**Pasos:**

1. Editar `~/.config/opencode/opencode.json`
2. Agregar el agente `sdd-orchestrator` con `"mode": "primary"`
3. El prompt del orchestrator está en el backup del repo (`01_Personal_Os/00_Core/02_Tools/03_Mcp/02_OpenCode/opencode.json`) — buscar `sdd-orchestrator`
4. Los SDD sub-agentes (`sdd-apply`, `sdd-verify`, etc.) pueden quedar como están (ya existen en el config global)
5. Sincronizar el backup del repo con los cambios

**Resultado:** el selector de OpenCode muestra Plan, Build, Gentleman, y SDD (4 opciones).

### Opción B: Renombrar `gentle-orchestrator` a `sdd-orchestrator`

Si preferís tener un solo primario pero con el nombre SDD:

1. En `~/.config/opencode/opencode.json`, cambiar la key de `gentle-orchestrator` a `sdd-orchestrator`
2. Actualizar descripción si querés
3. Sincronizar backup en repo

**Resultado:** el selector muestra Plan, Build, y SDD (3 opciones).

---

## Diferencias Clave Entre las Versiones

| Aspecto          | Backup (Repo)               | Global Actual                  |
|-----------------|----------------------------|-------------------------------|
| Agente mentor    | `gentleman` (primary)       | ❌ eliminado                    |
| Orquestador      | `sdd-orchestrator` (primary)| `gentle-orchestrator` (primary)|
| SDD `sdd-onboard`| ❌ no existía                | ✅ agregado                     |
| Sub-agentes SDD  | `hidden: true`              | `hidden: false`                |

---

## Archivos Relevantes

- **Config global real**: `~/.config/opencode/opencode.json` (fuera del repo)
- **Backup stale en repo**: `01_Personal_Os/00_Core/02_Tools/03_Mcp/02_OpenCode/opencode.json`
- **Repo-level config**: `.opencode/opencode.jsonc` (solo define sub-agentes como `mode:subagent`)
- **Engram memory**: buscar `config/opencode-agent-setup` en `mem_search`

---

## Flujo de Trabajo Recomendado si Volvés

Si en el futuro querés restaurar el modo anterior, el flujo es:

1. Copiar el prompt de `sdd-orchestrator` desde el backup del repo
2. Agregarlo al config global como `"mode": "primary"`
3. Sincronizar backup del repo
4. Decidir si mantener `gentle-orchestrator`, renombrarlo a `gentleman`, o eliminarlo
5. Los sub-agentes SDD ya están configurados — no tocar
