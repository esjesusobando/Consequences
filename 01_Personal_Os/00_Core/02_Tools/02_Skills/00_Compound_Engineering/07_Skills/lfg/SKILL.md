---
name: lfg
description: Full autonomous engineering workflow
argument-hint: "[feature description]"
disable-model-invocation: true
sota_upgraded: true
---

CRITICAL: You MUST execute every step below IN ORDER. Do NOT skip any required step. Do NOT jump ahead to coding or implementation. The plan phase (step 2, and step 3 when warranted) MUST be completed and verified BEFORE any work begins. Violating this order produces bad output.

1. **Optional:** If the `ralph-loop` skill is available, run `/ralph-loop:ralph-loop "finish all slash commands" --completion-promise "DONE"`. If not available or it fails, skip and continue to step 2 immediately.

2. `/ce:plan $ARGUMENTS`

   GATE: STOP. Verify that the `ce:plan` workflow produced a plan file in `05_Scripts/05_Plans/`. If no plan file was created, run `/ce:plan $ARGUMENTS` again. Do NOT proceed to step 3 until a written plan exists.

3. **Conditionally** run `/compound-engineering:deepen-plan`

   Run the `deepen-plan` workflow only if the plan is `Standard` or `Deep`, touches a high-risk area (auth, security, payments, migrations, external APIs, significant rollout concerns), or still has obvious confidence gaps in decisions, sequencing, system-wide impact, risks, or verification.

   GATE: STOP. If you ran the `deepen-plan` workflow, confirm the plan was deepened or explicitly judged sufficiently grounded. If you skipped it, briefly note why and proceed to step 4.

4. `/ce:work`

   GATE: STOP. Verify that implementation work was performed - files were created or modified beyond the plan. Do NOT proceed to step 5 if no code changes were made.

5. `/ce:review mode:autofix`

6. `/compound-engineering:todo-resolve`

7. `/compound-engineering:test-browser`

8. `/compound-engineering:feature-video`

9. Output `<promise>DONE</promise>` when video is in PR

Start with step 2 now (or step 1 if ralph-loop is available). Remember: plan FIRST, then work. Never skip the plan.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
