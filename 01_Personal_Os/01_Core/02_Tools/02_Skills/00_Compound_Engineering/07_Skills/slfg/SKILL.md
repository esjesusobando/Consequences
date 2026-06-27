---
name: slfg
description: Full autonomous engineering workflow using swarm mode for parallel execution
argument-hint: "[feature description]"
disable-model-invocation: true
sota_upgraded: true
---

Swarm-enabled LFG. Run these steps in order, parallelizing where indicated. Do not stop between steps — complete every step through to the end.

## Sequential Phase

1. **Optional:** If the `ralph-loop` skill is available, run `/ralph-loop:ralph-loop "finish all slash commands" --completion-promise "DONE"`. If not available or it fails, skip and continue to step 2 immediately.
2. `/ce:plan $ARGUMENTS`
3. **Conditionally** run `/compound-engineering:deepen-plan`
   - Run the `deepen-plan` workflow only if the plan is `Standard` or `Deep`, touches a high-risk area (auth, security, payments, migrations, external APIs, significant rollout concerns), or still has obvious confidence gaps in decisions, sequencing, system-wide impact, risks, or verification
   - If you run the `deepen-plan` workflow, confirm the plan was deepened or explicitly judged sufficiently grounded before moving on
   - If you skip it, note why and continue to step 4
4. `/ce:work` — **Use swarm mode**: Make a Task list and launch an army of agent swarm subagents to build the plan

## Parallel Phase

After work completes, launch steps 5 and 6 as **parallel swarm agents** (both only need code to be written):

5. `/ce:review mode:report-only` — spawn as background Task agent
6. `/compound-engineering:test-browser` — spawn as background Task agent

Wait for both to complete before continuing.

## Autofix Phase

7. `/ce:review mode:autofix` — run sequentially after the parallel phase so it can safely mutate the checkout, apply `safe_auto` fixes, and emit residual todos for step 8

## Finalize Phase

8. `/compound-engineering:todo-resolve` — resolve findings, compound on learnings, clean up completed todos
9. `/compound-engineering:feature-video` — record the final walkthrough and add to PR
10. Output `<promise>DONE</promise>` when video is in PR

Start with step 1 now.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
