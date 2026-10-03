# Design: Integration Auto-Improvement ↔ Capital Token

## Architecture Overview

```
┌─────────────────────┐
│  Auto-Improvement   │
│     Engine          │
└──────────┬──────────┘
           │
           ├─► DETECT: Scan codebase + Capital Token
           │
           ├─► ANALYZE: Identify patterns + quality issues
           │
           ├─► EXECUTE: Apply fixes
           │
           ├─► LEARN: Aggregate patterns
           │         ↓
           │    If occurrences >= 3:
           │         ↓
           │    Generate playbook draft
           │         ↓
           │    Save to 10_Shared_Org/playbooks/auto-generated/
           │
           └─► EVOLVE: Update knowledge dashboard
```

## Key Design Decisions

### D1. Pattern aggregation in JSON
Store pattern occurrences in JSON because:
- Easy to update incrementally
- Can be parsed by other tools
- Version control friendly

### D2. Auto-playbook generation as draft
Generated playbooks are marked as DRAFT because:
- Human review is still required
- Prevents low-quality content from entering production
- Clear separation between auto and manual content

### D3. Capital Token monitoring as separate phase
Run monitoring after main detection phase because:
- Keeps concerns separated
- Can be disabled independently
- Doesn't slow down main detection

### D4. Unified dashboard as markdown
Generate dashboard as markdown because:
- Can be viewed in any editor
- Easy to version control
- Can be included in process notes

## Data Flow

```
1. DETECT: Scan codebase (existing)
   ↓
2. DETECT: Scan Capital Token (new)
   ↓
3. ANALYZE: Identify patterns (existing)
   ↓
4. ANALYZE: Identify quality issues (new)
   ↓
5. EXECUTE: Apply fixes (existing)
   ↓
6. LEARN: Aggregate patterns (modified)
   ↓
7. If pattern >= 3 occurrences:
   Generate playbook draft (new)
   ↓
8. EVOLVE: Update knowledge dashboard (new)
```

## Files

| File | Purpose |
|------|---------|
| `01_Engine/learner.py` | Modified to aggregate patterns and generate playbooks |
| `01_Engine/detector.py` | Modified to monitor Capital Token |
| `03_Metrics/pattern_aggregator.json` | Pattern occurrence tracking |
| `03_Metrics/capital_token_quality.json` | Capital Token quality metrics |
| `03_Metrics/knowledge_dashboard.md` | Unified knowledge dashboard |
| `03_Metrics/INTEGRATION_METHODOLOGY.md` | Integration documentation |
| `10_Shared_Org/playbooks/auto-generated/` | Auto-generated playbook drafts |

## Verification

1. Run Auto-Improvement cycle → verify patterns aggregated
2. Trigger pattern 3 times → verify playbook generated
3. Add placeholder to Shared Org file → verify quality issue detected
4. Check knowledge dashboard → verify metrics updated
5. Verify Auto-Improvement still works standalone
6. Verify Capital Token still works standalone
