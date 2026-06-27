---
name: super-campeones
description: >
  Metodología SUPERCAMPEONES — Agent Teams Protocol basado en Dream Team analogy.
  Director (Orquestador) + Jugadores especializados + Árbitro (GGA).
  Activa cuando: "delegá esto", "coordiná el equipo", "usa el Dream Team", "multi-agente",
  "subagentes", "fork subagent".
  Triggers on: delegá esto, coordiná el equipo, usa el Dream Team, multi-agente, subagentes, fork subagent, agent teams protocol
sota_upgraded: true
---

# ⚽ SUPERCAMPEONES — Agent Teams Protocol

## Esencia Original

Este skill implementa el protocolo de equipos multi-agente de Supercampeones,
inspirado en la analogía del Dream Team de fútbol. El Director (orquestador)
es el único punto de contacto con el usuario; los Jugadores ejecutan tareas
especializadas en paralelo mediante forks o subagentes tipados; y el Árbitro
(GGA) verifica calidad y consistencia contra el plan aprobado. Nació de la
necesidad de escalar la capacidad de un agente único sin perder calidad,
compartiendo contexto vía fork para ahorrar tokens, y manteniendo supervisión
centralizada.

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

| Contexto                  | Usar Fork  | Usar Subagent  |
|--------------------------|-----------|---------------|
| Continuación de contexto  | ✅          | ❌              |
| Exploración paralela      | ✅          | ❌              |
| Tarea aislada             | ❌          | ✅              |
| Contexto contaminado      | ❌          | ✅              |
| Modelo diferente necesario| ❌          | ✅              |

## Gotchas

- ⚠️ Bug #47350: `context: fork` puede usar modelo más lite
- ⚠️ Forks NO comparten output entre sí — son ramas paralelas
- ⚠️ Output puede ser >50KB — summarize before return
- ❌ NO usar fork si las tareas tienen interdependencias
- ❌ NO usar fork si se requiere validación entre brazos

## ⚠️ Gotchas (SOTA v5.1)

### 1. Fork con modelo lite inesperado
- **Por qué**: El flag `context: fork` puede resolver a un modelo más barato/lite que el orquestador, degradando calidad de salida.
- **Solución**: Especificar modelo explícitamente en el fork o verificar el modelo asignado antes de delegar tareas críticas.

### 2. Contexto compartido se desincroniza
- **Por qué**: Los forks son ramas paralelas independientes — no comparten output entre sí. Si un jugador necesita resultado de otro, hay que coordinar manualmente.
- **Solución**: Para tareas con interdependencias, usar subagente tipado secuencial en vez de fork paralelo. Documentar dependencias antes del fork.

### 3. Output de fork excede límite de contexto
- **Por qué**: Un fork puede generar >50KB de output, causando truncamiento o fallo al reincorporar al orquestador.
- **Solución**: Implementar summarize obligatorio post-fork si el output estimado excede 50KB. Usar `maxTokens` o límites por step.

### 4. Contaminación de contexto padre
- **Por qué**: Si el contexto del orquestador está contaminado (herramientas rotas, estado inconsistente) antes del fork, el jugador hereda el problema.
- **Solución**: Aplicar limpieza de contexto antes de cada fork. Verificar que el estado del orquestador sea limpio. Preferir subagente tipado si hay duda.

## Integración SDD

| Fase SDD  | Rol Supercampeones   |
|----------|---------------------|
| Explore   | Researcher/Delantero |
| Plan      | Director coordina    |
| Apply     | Jugadores ejecutan   |
| Verify    | Árbitro revisa       |

## Referencia

- Config: `09_Agent_Teams_Protocol.mdc`
- GGA: `.agent/05_GGA/`
- Dream Team: `01_Dream_Team/`

---

## 💾 State Persistence

| State               | Almacenamiento               | Persistencia      |
|--------------------|-----------------------------|------------------|
| Contexto de fork    | Memoria del subagente        | Sesión (volátil)  |
| Output de jugadores | Resumen incorporado al padre | Hasta resuelto    |
| Scorecard de calidad| GGA / reporte al usuario     | Por invoación     |
| Plan de partido     | Contexto del Director        | Sesión completa   |

El estado de los forks no persiste entre sesiones. Cada invocación del skill
reconstruye el equipo desde el plan actual.

---

*Skill Supercampeones — v1.0 | Activated 2026-04-25 | SOTA v5.1*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
