---
name: super-campeones
description: >
  Metodología SUPERCAMPEONES — Agent Teams Protocol basado en Dream Team analogy.
  Director (Orquestador) + Jugadores especializados + Árbitro (GGA).
  Activa cuando: "delegá esto", "coordiná el equipo", "usa el Dream Team", "multi-agente",
  "subagentes", "fork subagent".
---

# ⚽ SUPERCAMPEONES — Agent Teams Protocol

## Concepto

Metodología de coordinación multi-agente inspirada en un equipo de fútbol. El Director es el único punto de contacto con el usuario. Los jugadores ejecutan tareas especializadas en paralelo. El árbitro (GGA) verifica calidad.

## Estructura Dream Team

```
┌─────────────────────────────────────────────────────────────┐
│                    🎯 USUARIO (Entrenador)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🤖 DIRECTOR (Orquestador)                 │
│         Único punto de contacto • Evalúa • Coordina        │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │ DELANTERO   │     │ CENTROCAMPISTA│   │ PORTERO    │
   │ (Product)  │     │ (Data)       │   │ (Platform) │
   └─────────────┘     └─────────────┘     └─────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                     ┌─────────────┐
                     │   ÁRBITRO   │
                     │    (GGA)    │
                     └─────────────┘
```

## Roles

### Director (Orquestador)
- Único contacto con el usuario
- Evalúa el "partido" (estado actual)
- Pasa contexto a jugadores
- Supervisa sin ensuciarse las manos
- **NO corre por toda la cancha solo**

### Jugadores (Sub-Agentes)
Cada uno tiene carpeta exclusiva:
- **01_Dream_Team/Product** → Genera ideas, features
- **02_Dream_Team/Data** → Análisis, datos
- **03_Dream_Team/Marketing** → Contenido, outreach
- **04_Dream_Team/Design** → UI/UX, visual
- **05_Dream_Team/Platform** → Infrastructure, DevOps

### Árbitro (GGA)
- Verifica que trabajo de agentes = Plan aprobado
- Detecta faltas (bugs, drift)
- Scorecard de calidad

## Principios

1. **Contexto compartido via Fork** — 90% menos tokens
2. **Forked subagent** cuando continuación de contexto
3. **Subagent tipado** cuando tarea aislada
4. **Limpiar contexto** antes de fork si contaminado
5. **Summarize** si >50KB

## Runbook

### Setup Fork Subagent
```bash
# Opción A: env var (sesión actual)
export CLAUDE_CODE_FORK_SUBAGENT=1

# Opción B: settings.json (permanente)
{ "forkSubagent": true }
```

### Protocolo Pre-Fork
1. **Limpiar** contexto si está contaminado
2. **Summarize** si contexto >50KB
3. **Verificar** que sigue el mismo modelo

### Flujo Estándar
```
1. Usuario presenta requerimiento
2. Director evalúa → identifica Jugador(es)
3. Director pasa contexto completo
4. Jugador(es) ejecutan en paralelo (fork si apropiado)
5. Árbitro (GGA) revisa resultados
6. Director agrega → reporta al usuario
```

### Fork vs Subagent Tipeado

| Contexto | Usar Fork | Usar Subagent |
|----------|-----------|---------------|
| Continuación de contexto | ✅ | ❌ |
| Exploración paralela | ✅ | ❌ |
| Tarea aislada | ❌ | ✅ |
| Contexto contaminado | ❌ | ✅ |
| Modelo diferente necesario | ❌ | ✅ |

## Gotchas

- ⚠️ Bug #47350: `context: fork` puede usar modelo más lite
- ⚠️ Forks NO comparten output entre sí — son ramas paralelas
- ⚠️ Output puede ser >50KB — summarize before return
- ❌ NO usar fork si las tareas tienen interdependencias
- ❌ NO usar fork si se requiere validación entre brazos

## Integración SDD

| Fase SDD | Rol Supercampeones |
|----------|---------------------|
| Explore | Researcher/Delantero |
| Plan | Director coordina |
| Apply | Jugadores ejecutan |
| Verify | Árbitro revisa |

## Referencia

- Config: `09_Agent_Teams_Protocol.mdc`
- GGA: `.agent/05_GGA/`
- Dream Team: `01_Dream_Team/`

---

*Skill Supercampeones — v1.0 | Activated 2026-04-25*
