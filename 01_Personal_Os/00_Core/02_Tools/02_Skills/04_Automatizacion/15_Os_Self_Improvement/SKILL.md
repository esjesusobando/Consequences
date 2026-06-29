---
name: os-self-improvement
description: Detect OS improvement opportunities based on new learnings. Compare existing skills vs new discoveries, propose updates to skills or new skill creation. Trigger: /os-self-improvement [learning]
sota_upgraded: true
---

# OS Self-Improvement

Detect opportunities to improve the OS based on new learnings. Compares existing skills, workflows, and patterns against newly discovered approaches.

---

## Esencia Original

Detects OS improvement opportunities by comparing newly acquired knowledge (from learning-url-to-knowledge) against existing skills, workflows, tools, and patterns. Generates prioritized recommendations for skill updates, new skills, workflow optimizations, tool integrations, and cross-discipline pattern adoption.

---

## Quick Start

```
/os-self-improvement [learning]
```

The skill will:
1. Analyze new learning against existing OS components
2. Identify gaps or improvement opportunities
3. Propose specific updates to skills or new skills
4. Document the improvement recommendation

---

## Improvement Categories

### 1. Skill Enhancement
**When**: New technique discovered that improves existing skill
**Action**: Update SKILL.md with new approach

### 2. New Skill Creation
**When**: Learning doesn't map to existing skills
**Action**: Create new skill based on methodology

### 3. Workflow Optimization
**When**: New process is more efficient than current
**Action**: Update workflow documentation

### 4. Tool Integration
**When**: New tool discovered that should be in the OS
**Action**: Document tool and create integration skill

### 5. Pattern Adoption
**When**: Pattern from one discipline applies to another
**Action**: Document cross-pollination opportunity

---

## Analysis Process

### Step 1: Map New Learning
```
New Learning: [What was learned]
├── Tools mentioned
├── Techniques used
├── Patterns observed
└── Integration points
```

### Step 2: Compare to Existing
```
Existing OS:
├── Skills: [List relevant skills]
├── Workflows: [List relevant workflows]
├── Tools: [List relevant tools]
└── Knowledge: [List relevant knowledge]
```

### Step 3: Identify Gaps
```
Gap Analysis:
├── Missing: Things the OS doesn't have
├── Partial: Things that could be improved
├── Outdated: Things that need updating
└── Redundant: Things that overlap
```

### Step 4: Generate Recommendations
```
Recommendations:
├── [Priority] [Type] [Description]
├── [Priority] [Type] [Description]
└── [Priority] [Type] [Description]
```

---

## Priority Levels

| Priority  | Description            | Action Timeline          |
|----------|-----------------------|-------------------------|
| **ALTA**  | Critical OS improvement| Implement immediately    |
| **MEDIA** | Valuable enhancement   | Implement within week    |
| **BAJA**  | Nice to have           | Implement when convenient|

---

## Improvement Types

| Type        | Symbol        | Description              |
|------------|--------------|-------------------------|
| Skill Update| `skill:update`| Modify existing skill    |
| Skill Create| `skill:new`   | Create new skill         |
| Workflow    | `workflow`    | Update workflow          |
| Tool Add    | `tool:add`    | Add new tool             |
| Tool Update | `tool:update` | Update tool documentation|
| Pattern     | `pattern`     | Document new pattern     |
| Integration | `integration` | Connect components       |

---

## Output Format

```markdown
# OS Self-Improvement - [Source Learning]

## Source
- URL: [source URL]
- Topic: [main topic]
- Date: [date]

## Analysis

### New Learning Components
- Tools: [list]
- Techniques: [list]
- Patterns: [list]

### Existing OS Comparison
- Skills: [status]
- Workflows: [status]
- Tools: [status]

### Gap Analysis
- Missing: [list]
- Partial: [list]
- Outdated: [list]

## Recommendations

| Priority  | Type        | Description  | Effort  |
|----------|------------|-------------|--------|
| ALTA      | skill:new   | [description]| [hours] |
| MEDIA     | skill:update| [description]| [hours] |
| BAJA      | workflow    | [description]| [hours] |

## Implementation Plan

### Immediate (Today)
- [Action 1]
- [Action 2]

### This Week
- [Action 3]
- [Action 4]

### Future Consideration
- [Action 5]
```

---

## Integration with Engram

Save improvement insights:
```javascript
mem_save({
  title: "OS Improvement: {specific recommendation}",
  type: "decision",
  scope: "project",
  topic_key: "os-improvement/{area}",
  content: {
    what: "What was improved",
    why: "Source of the improvement opportunity",
    where: "Files to update",
    learned: "Lesson for future improvements"
  }
});
```

---

## ⚠️ Gotchas

### Gotcha 1: Oversized recommendation lists create noise
- **Por qué**: Every new learning can generate 5-10 recommendations. After processing 20 articles, the recommendation backlog becomes overwhelming and nothing gets implemented.
- **Solución**: Hard-cap at 3 recommendations per run. Use the priority system aggressively: only ALTA and MEDIA items make it to the output. BAJA items are logged to Engram for batch review. Implement a weekly consolidation pass.

### Gotcha 2: Skill update recommendations conflict with existing skill structure
- **Por qué**: The skill suggests updating a skill, but the proposed change may conflict with the skill's existing architecture, triggers, or contracts. Blindly updating can break the skill's contract with other OS components.
- **Solución**: Before recommending a skill update, analyze the existing skill's contract (triggers, prerequisites, output structure). If the change would break the contract, recommend a new skill or extension instead of an update.

### Gotcha 3: Immediacy bias inflates priority
- **Por qué**: A newly learned technique feels urgent and important (recency effect), but may not actually provide long-term value. The skill tends to rate new discoveries as ALTA priority by default.
- **Solución**: Apply a "wait one day" rule: save the recommendation and let it sit for 24 hours before assigning final priority. Use the Impact/Effort matrix: ALTA = high impact AND low effort. If effort is high, downgrade to MEDIA.

### Gotcha 4: Cross-discipline pattern recommendations lack implementation details
- **Por qué**: The skill identifies that a PM pattern applies to Engineering, but doesn't provide concrete implementation steps. The recommendation stays at the abstract level and never gets actioned.
- **Solución**: Every recommendation must include at least one concrete implementation step. For cross-discipline patterns, include a "How to Apply" section with specific files to modify, workflows to update, or skills to create.

---

## 💾 State Persistence

State is managed through Engram observations and the recommendation output. The skill:
- **Saves recommendations** to Engram with `topic_key: os-improvement/{area}`
- **Generates output files** in the `03_Resultado/` structure (if triggered via /os-self-improvement)
- **No persistent local state** between runs — each execution is stateless
- **Relies on the current OS snapshot** (skills, workflows, tools as they exist at execution time)

For historical review, search `mem_search({query: "OS Improvement", project: "Think_Different"})`.

---

## Related Skills

- **learning-url-to-knowledge**: Source of new learnings
- **compound-knowledge**: Helps identify cross-connections
- **skill-creator**: Use to create new skills identified

---

## Changelog

| Version  | Date      | Changes      |
|---------|----------|-------------|
| v1.0     | 2026-05-22| Initial skill|

---

**Status**: Ready to use

*Generated by Think Different PersonalOS v6.1 | Pure Green State*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
