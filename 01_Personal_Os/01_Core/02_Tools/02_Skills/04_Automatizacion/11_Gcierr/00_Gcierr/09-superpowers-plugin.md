# 14 superpoderes para dev con Claude

> Un pack completo de meta-skills que convierten a Claude de "asistente que genera codigo" a "ingeniero disciplinado que planea, ejecuta, revisa y verifica".

---

## Que es el Superpowers Plugin

Superpowers NO es una skill. Es un **plugin con 14+ sub-skills interconectadas** que cubren todo el ciclo de desarrollo profesional con Claude. Cada sub-skill tiene un SKILL.md con checklist riguroso, process flow (digraph), red flags y principios clave.

La filosofia: **"Si hay 1% de chance de que una skill aplique, INVOCALA."** No es negociable.

---

## Tabla visual: las 14 sub-skills por categoria

| Categoria             | Sub-skill                                | Proposito                                                       | Cuando usarla                                           |
|-----------------------|------------------------------------------|-----------------------------------------------------------------|---------------------------------------------------------|
| **Planning**          | `brainstorming`                          | Explora intent, requirements y design antes de codear           | Toda feature nueva, refactor no trivial                 |
| **Planning**          | `writing-plans`                          | Convierte spec en plan de implementacion con fases              | Despues de brainstorming, antes de tocar codigo         |
| **Execution**         | `executing-plans`                        | Ejecuta un plan escrito, fase por fase, con checkpoints         | Cuando ya hay plan aprobado                             |
| **Execution**         | `test-driven-development`                | Red-Green-Refactor riguroso                                     | Nuevo codigo con logica testable                        |
| **Execution**         | `demo_tdd`                               | Demo interactiva del loop TDD                                   | Aprender/mostrar TDD                                    |
| **Execution**         | `subagent-driven-development`            | Delega subtareas a subagents paralelos                          | Features con componentes independientes                 |
| **Execution**         | `dispatching-parallel-agents`            | Lanza N agents en paralelo sobre el mismo codebase              | Exploracion, migraciones masivas                        |
| **Review**            | `requesting-code-review`                 | Pide review estructurado a otro agent/humano                    | Antes de merge                                          |
| **Review**            | `receiving-code-review`                  | Procesa feedback, prioriza fixes, responde comments             | Cuando llegan comentarios                               |
| **Review**            | `finishing-a-development-branch`         | Checklist final: tests, docs, changelog, merge                  | Antes de cerrar branch                                  |
| **Tooling**           | `using-git-worktrees`                    | Trabajar en multiples branches aislados a la vez                | Contexto paralelo sin stash hell                        |
| **Tooling**           | `systematic-debugging`                   | Debugging disciplinado (hipotesis -> verificar -> fix)          | Bug reproducible no trivial                             |
| **Tooling**           | `verification-before-completion`         | Valida que todo funciona antes de decir "listo"                 | Siempre, al final de cada task                          |
| **Meta**              | `writing-skills`                         | Como escribir nuevas skills siguiendo el formato                | Expandir el sistema                                     |
| **Meta**              | `using-superpowers`                      | Meta-skill: como detectar y invocar skills                      | Arranque de toda conversacion                           |

**Total: 15 sub-skills** (14 de dev + 1 meta para descubrirlas).

---

## Principios transversales: superpower vs prompt regular

| Dimension                 | Prompt regular                     | Superpower                                                                     |
|---------------------------|------------------------------------|--------------------------------------------------------------------------------|
| **Trigger**               | Claude decide improvisando         | Checklist explicito + red flags                                                |
| **Proceso**               | Linear, sin gates                  | Process flow con diamantes de decision                                         |
| **Validacion**            | "Creo que funciona"                | `verification-before-completion` obligatoria                                   |
| **Documentacion**         | Opcional                           | Spec en `docs/superpowers/specs/` commiteada                                   |
| **Reintentos**            | Improvisados                       | Back-to-loop definido en el flow                                               |
| **Anti-patterns**         | Implicitos                         | "Red flags" explicitas ("This is too simple...")                               |
| **Composicion**           | Standalone                         | Skills encadenadas (brainstorming -> writing-plans -> executing-plans)         |

**La clave:** un superpower es un **contrato de disciplina**. Claude no puede racionalizar saltarselo.

---

## Flow 1: Feature nueva (brainstorming -> writing-plans -> executing-plans)

Caso: "Quiero agregar notificaciones push a mi app."

### Diagrama

```
        [ Usuario: "agregar push notifications" ]
                          |
                          v
          +-------------------------------+
          |   1. brainstorming skill      |
          |   - explora context           |
          |   - preguntas 1-a-la-vez      |
          |   - propone 2-3 approaches    |
          |   - design approved by user   |
          +---------------+---------------+
                          |
                          v  spec.md commiteado
          +-------------------------------+
          |   2. writing-plans skill      |
          |   - plan por fases            |
          |   - checkpoints verificables  |
          |   - rollback strategy         |
          +---------------+---------------+
                          |
                          v  plan.md aprobado
          +-------------------------------+
          |   3. executing-plans skill    |
          |   - fase 1: setup FCM         |
          |   - fase 2: backend endpoint  |
          |   - fase 3: UI toggle         |
          |   - verify despues de cada    |
          +---------------+---------------+
                          |
                          v
                   [ feature shipped ]
```

### Snippet

```
Usuario: quiero agregar push notifications a la app

Claude [invocando brainstorming]:
  - Explorando contexto... detecto React Native + Node backend
  - Pregunta 1/5: Push solo a usuarios logueados o tambien invitados?
  - Pregunta 2/5: iOS + Android o solo una plataforma primero?
  ...
  - 3 approaches propuestos:
    A) Firebase FCM (recomendado, multiplataforma)
    B) OneSignal (mas features, vendor lock)
    C) APNs + FCM directo (control total, mas codigo)
  - Design aprobado
  - Spec escrito: docs/superpowers/specs/2026-04-17-push-notifications-design.md

Claude [invocando writing-plans]:
  - Plan: 4 fases, 12 pasos
  - Checkpoints: FCM token flow working, endpoint manda test push, UI toggle persistent, e2e en dispositivo real
  - Archivo: docs/superpowers/plans/2026-04-17-push-plan.md

Claude [invocando executing-plans]:
  - Fase 1/4: Setup FCM
    [verifica: token se obtiene en dispositivo fisico] OK
  - Fase 2/4: Backend /api/push/send
    [verifica: curl manda notificacion] OK
  ...
```

---

## Flow 2: TDD + paralelismo + verification

Caso: "Implementar 3 endpoints nuevos con tests, rapido."

### Diagrama

```
                [ Plan con 3 endpoints independientes ]
                                |
                                v
            +--------------------------------------+
            |   dispatching-parallel-agents        |
            |   - agent A: endpoint /users         |
            |   - agent B: endpoint /orders        |
            |   - agent C: endpoint /payments      |
            +----+----------+----------+-----------+
                 |          |          |
                 v          v          v
              [TDD A]    [TDD B]    [TDD C]
              RED        RED        RED
              GREEN      GREEN      GREEN
              REFACTOR   REFACTOR   REFACTOR
                 |          |          |
                 +----------+----------+
                            |
                            v
            +--------------------------------------+
            |   verification-before-completion     |
            |   - todos los tests pasan?           |
            |   - lint clean?                      |
            |   - integracion e2e OK?              |
            |   - docs actualizadas?               |
            +------------------+-------------------+
                               |
                               v
                        [ READY TO MERGE ]
```

### Snippet

```
Claude [dispatching-parallel-agents]:
  Lanzando 3 subagents en paralelo...
  - Subagent A (task: TDD endpoint /users)
  - Subagent B (task: TDD endpoint /orders)
  - Subagent C (task: TDD endpoint /payments)

[en paralelo cada uno]
Subagent A [test-driven-development]:
  RED: test users.create falla
  GREEN: implemento minimo
  REFACTOR: extraigo validator
  48 tests pasan

Subagent B: [igual flow]
Subagent C: [igual flow]

[agents terminan]

Claude [verification-before-completion]:
  Checklist final:
  [x] npm test: 142/142 pass
  [x] npm run lint: 0 errors
  [x] npm run typecheck: OK
  [x] e2e suite: 18/18 pass
  [x] CHANGELOG.md actualizado
  [x] coverage > 85%

  Listo. Puede mergear con confianza.
```

---

## Flow 3: Trabajo aislado (git-worktrees + subagent-driven-development)

Caso: "Quiero explorar 2 approaches simultaneamente sin romper mi branch actual."

### Diagrama

```
         main branch (usuario trabajando aqui)
                         |
                         |
       +-----------------+-----------------+
       |                                   |
       v                                   v
   [worktree A]                        [worktree B]
   ../repo-approach-a                  ../repo-approach-b
   branch: exp/approach-a              branch: exp/approach-b
       |                                   |
       v                                   v
  [subagent 1]                        [subagent 2]
  implementa A                        implementa B
  usa TDD                             usa TDD
       |                                   |
       +-----------------+-----------------+
                         |
                         v
               [usuario compara outputs]
                         |
                         v
             decide -> merge ganador
             elimina worktree perdedor
```

### Snippet

```
Claude [using-git-worktrees]:
  git worktree add ../repo-approach-a exp/approach-a
  git worktree add ../repo-approach-b exp/approach-b
  Listo. 2 directorios aislados con mismo repo.

Claude [subagent-driven-development]:
  Dispatching subagent 1 to ../repo-approach-a:
    "Implementa cache con Redis. TDD riguroso."
  Dispatching subagent 2 to ../repo-approach-b:
    "Implementa cache con in-memory LRU. TDD riguroso."

[subagents trabajan en paralelo, sin interferencia]

Resultado:
  approach A: 230 LOC, 45ms p99, requiere Redis
  approach B: 180 LOC, 12ms p99, limite 10k keys

Usuario: me gusta B, mergear.

Claude:
  cd ../repo-approach-b
  git push origin exp/approach-b
  cd main-repo
  git merge exp/approach-b
  git worktree remove ../repo-approach-a
  git worktree remove ../repo-approach-b
  git branch -D exp/approach-a
```

---

## Flow 4: Bug en produccion (systematic-debugging)

Caso: "Usuarios reportan que el login falla intermitentemente en mobile."

### Diagrama

```
      [ Bug report: "login falla a veces en mobile" ]
                          |
                          v
        +---------------------------------+
        |  1. Reproducir                  |
        |  - que dispositivo?             |
        |  - que red?                     |
        |  - que pasos exactos?           |
        +----------------+----------------+
                         |
                         v
        +---------------------------------+
        |  2. Formular hipotesis          |
        |  H1: timeout red lento          |
        |  H2: token expirado mid-flow    |
        |  H3: race condition en refresh  |
        +----------------+----------------+
                         |
                         v
        +---------------------------------+
        |  3. Verificar c/ hipotesis      |
        |  H1 -> logs: no hay timeouts    |
        |  H2 -> descarto, token fresco   |
        |  H3 -> BINGO! race detectado    |
        +----------------+----------------+
                         |
                         v
        +---------------------------------+
        |  4. Fix + test regresion        |
        |  - mutex en refresh             |
        |  - test simula concurrent calls |
        +----------------+----------------+
                         |
                         v
        +---------------------------------+
        |  verification-before-completion |
        |  - bug no reproduce 100 runs    |
        |  - test regresion pasa          |
        |  - no rompe otros tests         |
        +----------------+----------------+
                         |
                         v
                   [ deploy fix ]
```

### Snippet

```
Usuario: el login falla intermitentemente en mobile

Claude [systematic-debugging]:
  FASE 1 - Reproducir
  Preguntas:
    - iOS o Android?
    - red wifi o 4G?
    - pasa con login reciente o tras horas de inactividad?
  Usuario: Android, 4G, tras inactividad

  FASE 2 - Hipotesis (ordenadas por probabilidad)
    H1: timeout de red (30%)
    H2: refresh token race (40%)
    H3: cache stale del token viejo (30%)

  FASE 3 - Verificar
  H1 test: mando 50 requests en 4G simulado
    -> 0 timeouts. DESCARTADA.
  H2 test: simulo 2 calls concurrentes a /auth/refresh
    -> el segundo usa token invalidado. CONFIRMADA.

  FASE 4 - Fix
  Implemento mutex en AuthInterceptor.refresh()
  Agrego test: concurrent_refresh_uses_single_token

  [verification-before-completion]
  [x] test nuevo pasa
  [x] suite completa: 340/340
  [x] repro manual: 50 logins consecutivos, 0 fallos
  [x] PR description con causa raiz

  Fix listo para deploy.
```

---

## Caso de uso estrella: feature compleja en 1 dia

**Contexto:** equipo de 2 devs + Claude. Feature: "Dashboard de analytics con filtros, exports a CSV/PDF y compartir via link firmado."

Sin superpowers: 3-5 dias, multiples iteraciones, bugs post-merge.
Con superpowers: **1 dia, 1 PR, 0 rework**.

### Timeline real

| Hora                | Accion                                         | Skill invocada                                                        |
|---------------------|------------------------------------------------|-----------------------------------------------------------------------|
| 09:00               | Dev describe feature a Claude                  | `using-superpowers` (auto)                                            |
| 09:05               | 12 preguntas clarificadoras                    | `brainstorming`                                                       |
| 09:30               | Design aprobado, spec commiteada               | `brainstorming`                                                       |
| 09:35               | Plan de 5 fases, 23 pasos                      | `writing-plans`                                                       |
| 09:50               | Plan aprobado, crea 3 worktrees                | `using-git-worktrees`                                                 |
| 10:00               | Dispatch 3 subagents paralelos                 | `dispatching-parallel-agents` + `subagent-driven-development`         |
| 10:00-13:00         | Subagent A: UI filtros (TDD)                   | `test-driven-development`                                             |
| 10:00-13:00         | Subagent B: export engine (TDD)                | `test-driven-development`                                             |
| 10:00-13:00         | Subagent C: link-share backend (TDD)           | `test-driven-development`                                             |
| 13:00               | Integracion en branch principal                | `executing-plans`                                                     |
| 13:30               | Bug: PDF export rompe con >1000 rows           | `systematic-debugging`                                                |
| 14:15               | Fix + regresion test                           | `systematic-debugging`                                                |
| 14:30               | Claude pide code review a otro agent           | `requesting-code-review`                                              |
| 14:50               | Review llega, 4 comentarios                    | `receiving-code-review`                                               |
| 15:30               | Fixes aplicados, responde cada comment         | `receiving-code-review`                                               |
| 15:45               | Checklist final                                | `verification-before-completion`                                      |
| 16:00               | Merge, cleanup worktrees, changelog            | `finishing-a-development-branch`                                      |

**Resultado:**
- 1 feature shipped
- 214 tests nuevos, 100% pass
- 0 bugs post-deploy en 2 semanas
- PR con spec + plan + decisiones documentadas

---

## Comparativa: mismo task con/sin superpowers

```
                                   SIN superpowers              CON superpowers
  Tiempo total                     3-5 dias                     1 dia
  Rounds de feedback usuario       8-12                         3-4
  Bugs post-merge                  2-3 tipico                   0
  Documentacion                    ninguna                      spec + plan + PR
  Reuso futuro del approach        bajo                         spec referenciable
  Onboarding de otro dev al code   1-2 horas                    10 min (lee spec)
  Confianza para refactor futuro   baja                         alta (tests + plan)
```

---

## Anti-patterns que los superpowers previenen

1. **"Esto es muy simple para brainstorming"** -> brainstorming tiene HARD-GATE, no se puede saltar.
2. **"Voy a empezar a codear mientras pienso"** -> writing-plans exige plan antes de ejecutar.
3. **"Los tests los escribo despues"** -> TDD es Red-Green-Refactor, no al reves.
4. **"Esto deberia funcionar, lo merged"** -> verification-before-completion bloquea si no hay evidencia.
5. **"Voy a stashear para probar otra cosa"** -> git-worktrees elimina stash hell.
6. **"El bug es raro, agrego try-catch"** -> systematic-debugging exige hipotesis verificada.
7. **"El reviewer va a encontrar cosas, mando y vemos"** -> requesting-code-review estructura el pedido.

---

## Como arrancar con Superpowers hoy

1. **Instalar el plugin** en tu Claude (es un directorio de skills en `~/.claude/plugins/` o equivalente).
2. **La meta-skill `using-superpowers` se carga siempre** al inicio de cada conversacion.
3. **Al pedir algo, Claude detecta que sub-skill aplica** y la invoca con anuncio ("Using brainstorming to explore the idea").
4. **No intervengas en el flow** — deja que complete el checklist. Si algo no aplica, el skill mismo tiene ramas "skip".
5. **Aprende escribiendo la proxima skill tuya** con `writing-skills`: formato estandar, checklist, process flow en dot, red flags.

---

## Cierre

Los 14 superpoderes no son 14 prompts mejores. Son **un sistema coherente** donde cada skill:
- Sabe cuando invocar a la siguiente (brainstorming -> writing-plans -> executing-plans).
- Tiene checklist que Claude no puede racionalizar a saltar.
- Documenta decisiones en `docs/superpowers/specs/` commiteadas.
- Hace que el proceso sea **reproducible por cualquier otro dev** (o agent).

La diferencia no es que Claude escriba mejor codigo. Es que **Claude trabaja como un senior ingeniero disciplinado**: brainstormea, planea, testa, revisa, verifica, documenta.

Tu trabajo pasa de "dictar tareas a un asistente" a **"aprobar gates en un pipeline de ingenieria con un copiloto experto"**.
