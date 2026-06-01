---
session_id: [uuid]
project: [project_name]
timestamp: [YYYY-MM-DDTHH:MM:SS]
model: [model_name]
git_branch: [branch]
message_count: [N]
tool_call_count: [N]
judgement: pending
annotation: ""
axial_codes: []
reviewed: false
---

# Session Eval: [session_id_short]

**Project:** [project_name]
**Date:** [YYYY-MM-DD HH:MM]
**Model:** [model_name]
**Duration:** [N] messages, [N] tool calls

---

## User Intent

```
[What did the user ask for?]
```

---

## Conversation Flow

### Turn 1: **User**
> [user message]

### Turn 2: **Assistant**
> [assistant response summary]

### Turn 3: **Assistant**
*Used tools:* [tool_names]

---

## Tool Usage Summary

| Tool       | Count  |
|-----------|-------|
| `tool_name`| N      |

---

## AI Analysis

### Suggested Judgement: **pending**

[AI analysis of session quality]

### Detected Patterns

**Positive:**
- [pattern]: [description]

**Needs Improvement:**
- [pattern]: [description]

### Suggested Improvements

- [improvement 1]
- [improvement 2]

---

## Manual Review Notes

> Override the AI analysis above if needed after review.

### Final Judgement
> [success/partial/failure/pending]

### What Went Well
-

### What Could Improve
-

### Action Items
- [ ]
