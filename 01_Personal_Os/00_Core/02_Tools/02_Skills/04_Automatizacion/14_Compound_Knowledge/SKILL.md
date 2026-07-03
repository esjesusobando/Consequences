---
name: compound-knowledge
description: Take newly generated knowledge and connect it to existing knowledge in the OS. Uses Engram to find connections, integrates with 03_Unicorn structure, and builds compounding knowledge network. Trigger: /compound-knowledge [topic]
sota_upgraded: true
---

# Compound Knowledge

Connect newly generated knowledge to existing knowledge in the OS. Builds a compounding knowledge network where each new piece reinforces and connects to previous learnings.

---

## Esencia Original

Takes newly generated knowledge (from learning-url-to-knowledge or manual input) and connects it to existing knowledge in the OS using Engram. Builds a compounding network where each new piece reinforces and connects to previous learnings across disciplines defined in `03_Unicorn/`.

---

## Quick Start

```
/compound-knowledge [topic]
```

The skill will:
1. Search Engram for related existing knowledge
2. Identify connection points between new and old
3. Update existing knowledge with new connections
4. Create cross-links between related topics

---

## How It Works

### Knowledge Graph Concept

```
New Knowledge
      │
      ├──► Found existing: Topic A ──► Connected: Topic B
      │                                  │
      └──► Found existing: Topic C ──► Connected: Topic D
                                          │
                              (Compounds over time)
```

### Connection Types

| Type             | Description                  | Example                    |
|-----------------|-----------------------------|---------------------------|
| `related_to`     | Similar topic                | AI tools → Claude          |
| `builds_on`      | Previous learning            | Basic → Advanced           |
| `contradicts`    | Opposite finding             | Old approach → New approach|
| `enables`        | Prerequisite for             | Syntax → Architecture      |
| `similar_pattern`| Same pattern different domain| PM framework → Dev workflow|

---

## Integration with 03_Unicorn

Knowledge connects to disciplines:

| Discipline     | Location                       | Topic Key Prefix  |
|---------------|-------------------------------|------------------|
| Project Manager| `03_Unicorn/01_Pm/`            | `learning/01_Pm/` |
| Product Manager| `03_Unicorn/02_Pdm/`           | `learning/02_Pdm/`|
| Product Design | `03_Unicorn/03_Product_Design/`| `learning/03_Pd/` |
| AI/PM          | `03_Unicorn/05_Aipm/`          | `learning/ai_pm/` |
| Engineering    | `03_Unicorn/06_Engineering/`   | `learning/eng/`   |

---

## Process Steps

### Step 1: Search Existing Knowledge
```javascript
mem_search({
  query: "[topic keywords]",
  project: "Think_Different"
})
```

### Step 2: Analyze Connections
- Find topics with `learning/{topic}` keys
- Identify patterns across disciplines
- Map relationships

### Step 3: Update Engram
```javascript
mem_save({
  title: "Connected: {new} → {existing}",
  type: "architecture",
  scope: "project",
  topic_key: "learning/{topic}",
  content: {
    what: "Connected new learning to existing knowledge",
    why: "Build compounding knowledge network",
    where: "03_Unicorn/{discipline}/patterns/",
    learned: "How topics relate across the OS"
  }
});
```

### Step 4: Document Connections
Create a connections doc:
```markdown
# Knowledge Connections - [Topic]

## Existing Related
- [Topic A] → [How it connects]
- [Topic B] → [How it connects]

## New Connections Made
- [Connection 1]
- [Connection 2]

## Cross-Discipline Links
- [PM] connects to [Engineering] via [pattern]
```

---

## Topic Keys Structure

| Key Pattern            | Content                     |
|-----------------------|----------------------------|
| `learning/{topic}`     | Main topic learning         |
| `learning/{tool}`      | Tool-specific knowledge     |
| `learning/{pattern}`   | Cross-cutting patterns      |
| `learning/{discipline}`| Discipline-specific insights|
| `connections/{topic}`  | Connection map for topic    |

---

## Example Flow

**Input**: New learning about "Claude Computer Use"

**Step 1**: Search Engram for "Claude", "computer use", "AI agents"
**Step 2**: Find existing: `learning/claude` in 03_Unicorn/05_Aipm
**Step 3**: Connect:
- New: Computer Use patterns
- Existing: Claude agent patterns
- Build: Agent orchestration understanding
**Step 4**: Save connection with cross-links

---

## Compound Effect

```
URL_1 → K1 + Connection to existing
URL_2 → K2 + Connection to K1 + Connection to existing
URL_3 → K3 + Connection to K1-2 + Connection to existing
...
URL_N → Knowledge Network with N×N connections
```

---

## ⚠️ Gotchas

### Gotcha 1: Topic key collisions overwrite existing knowledge
- **Por qué**: Using the same `topic_key` for different pieces of knowledge can silently overwrite previous observations in Engram. This destroys the compounding effect because older connections are lost.
- **Solución**: Always suffix topic keys with a unique discriminator (e.g., `learning/claude/v2`, `learning/claude/computer-use`). Use `mem_suggest_topic_key` before saving if unsure. Review existing topic keys periodically to avoid collisions.

### Gotcha 2: Cross-discipline connections require discipline-specific context
- **Por qué**: A pattern from Engineering (e.g., event sourcing) might apply to Product Management (e.g., event-driven roadmaps), but without translating the concept into each discipline's vocabulary, the connection is unusable.
- **Solución**: When creating cross-discipline links, include a brief "translation" section explaining how the concept applies to the target discipline. Don't just link — explain the mapping.

### Gotcha 3: Knowledge graph becomes noisy without pruning
- **Por qué**: Over time, connections accumulate. Old connections to outdated knowledge create noise, making it hard to find the most relevant current information.
- **Solución**: Periodically (monthly) review existing topic keys and archive connections older than 6 months. Use `mem_update` to mark outdated observations with a flag. Prioritize quality over quantity in connections.

### Gotcha 4: Enabling relationships are directional but the OS treats connections as bidirectional
- **Por qué**: "Basic → Advanced" is a directional relationship (Advanced builds on Basic), but Engram connections are inherently bidirectional. This can cause confusion when navigating the knowledge graph.
- **Solución**: Explicitly document direction in the connection content (e.g., "This enables: [X]" and "Requires: [Y]"). Use clear naming conventions like `builds_on` vs `enables` to preserve direction semantics.

---

## 💾 State Persistence

State is managed exclusively through Engram observations. The skill creates and updates:
- **Topic observations**: Each knowledge topic gets an Engram observation with `topic_key: learning/{topic}`
- **Connection maps**: Cross-links are implicit in the graph structure — connections exist as relationships between observations
- **No local files**: All state lives in Engram's persistent store

For recovery, use `mem_search({query: "[topic]", project: "Think_Different"})` to find all connected knowledge.

---

## Related Skills

- **learning-url-to-knowledge**: Generates the raw knowledge
- **os-self-improvement**: Uses connections to find OS improvements
- **reverse-engineering**: Analyzes connection patterns

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
