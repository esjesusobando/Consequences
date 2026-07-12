# Compound Knowledge - Technical Reference

## Knowledge Connection Types

### 1. related_to
**When**: Topics share similar concepts but different domains
**Example**: "Vim keybindings" relates_to "Emacs keybindings"

### 2. builds_on
**When**: New learning extends previous understanding
**Example**: "Basic regex" builds_on "String manipulation"

### 3. contradicts
**When**: New learning challenges previous assumptions
**Example**: "Monolith first" contradicts "Microservices first"

### 4. enables
**When**: New learning is prerequisite for another
**Example**: "Basic algebra" enables "Calculus"

### 5. similar_pattern
**When**: Same pattern appears in different contexts
**Example**: "PM sprint planning" has similar_pattern to "DevOps sprint"

---

## Connection Search Strategy

### Phase 1: Direct Topic Match
```
Search: mem_search({query: "{topic}"})
Find: exact or near-exact topic matches
```

### Phase 2: Keyword Expansion
```
Search: mem_search({query: "{tool} OR {concept} OR {pattern}"})
Find: related tools, concepts, patterns
```

### Phase 3: Cross-Discipline Search
```
Search: mem_search({query: "learning/*"})
Filter: by discipline tags
Find: patterns that cross disciplines
```

### Phase 4: Temporal Proximity
```
Find: recent learnings that might connect
Context: same week or project
```

---

## Engram Schema for Connections

```javascript
{
  title: "Connected: {A} → {B}",
  type: "architecture",  // or "pattern", "decision"
  scope: "project",
  topic_key: "connections/{primary-topic}",
  content: {
    what: "Description of connection",
    why: "Reason for connection",
    where: "Files involved",
    learned: "What this connection teaches",
    connection_type: "related_to|builds_on|contradicts|enables|similar_pattern",
    connected_to: "{topic-key-of-connection-target}",
    bidirectional: true  // if both sides should link
  }
}
```

---

## 06_Unicorn Integration

### File Naming Convention
```
06_Unicorn/{discipline}/patterns/{YYYY-MM-DD}_{Pattern_Name}.md
06_Unicorn/{discipline}/lessons/{YYYY-MM-DD}_{Lesson_Name}.md
06_Unicorn/{discipline}/connections/{YYYY-MM-DD}_{Connections_Name}.md
```

### Discipline Mapping
| Learning Type   | Primary Discipline | Secondary Connections |
|----------------|-------------------|----------------------|
| Agent/LLM topics| 05_Aipm            | 06_Engineering        |
| PM methodologies| 01_Pm              | 02_Pdm                |
| Design patterns | 03_Product_Design  | 04_Art_Director       |
| Code patterns   | 06_Engineering     | 05_Aipm               |
| Productivity    | 07_Personal_Os     | 01_Pm                 |

---

## Connection Maintenance

### When to Update Connections
1. After new Learning Always completes
2. When new skill is created
3. When pattern is discovered across multiple sources
4. During weekly review

### Connection Health Check
- No orphan topics (topics without any connections)
- No circular dependencies without purpose
- Cross-discipline connections at least quarterly review

---

## Tools for Connection Finding

1. **mem_search**: Primary search tool
2. **mem_context**: Session context check
3. **mem_get_observation**: Full content retrieval

---

*Last updated: 2026-05-15*
