# Onboarding Workflow

## Detailed Phases

### Phase 1: Discovery (Pre-Onboarding)

**Before creating context, gather:**

1. **What problem does this agent solve?**
   - Write a one-sentence problem statement
   - Example: "This agent helps me research competitors and summarize findings"

2. **What decisions will this agent make?**
   - List decisions it can make autonomously
   - List decisions that require human approval

3. **What tools does this agent need?**
   - File access (which directories?)
   - Command execution (which commands?)
   - External services (APIs, databases?)

### Phase 2: Context Creation

**Structure the context folder:**

```
.agent-context/{agent-name}/
├── README.md              # Role overview (this becomes the agent's "memory")
├── docs/                  # Documentation it needs to reference
│   ├── company-values.md
│   └── style-guide.md
├── references/            # Background info
│   └── past-decisions.md
└── prompts/              # Recurring prompt templates
    └── weekly-report.md
```

**For each file, ask:**
- Would this agent need this information?
- Is this updated frequently?
- Does this change the agent's behavior?

### Phase 3: Testing

**After setup, test the agent:**

1. **Basic functionality**: Can it do its core task?
2. **Context usage**: Does it reference the provided context?
3. **Quality**: Does output meet quality standards?
4. **Communication**: Does it communicate appropriately?

**Iterate based on results**

### Phase 4: Regular Check-ins

**Schedule check-ins at:**
- Day 1: Initial setup and first task
- Day 3: Review performance, adjust context
- Week 1: Full review, document learnings
- Monthly: Retrospect and optimize

---

*Reference for Agent Onboarding skill — loaded when needed.*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
