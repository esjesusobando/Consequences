# Design: Adaptive Boot

## Architecture Overview

```
┌─────────────────┐
│   BOOT.md       │
│  (Entry Point)  │
└────────┬────────┘
         │
         ├─► Detect agent type (from config or name)
         │
         ├─► Detect task type (from description)
         │
         ├─► Load context profile from context_profiles.yaml
         │
         ├─► Load required context files
         │
         ├─► Setup lazy loading for optional context
         │
         └─► Log token metrics to boot_metrics.json
```

## Key Design Decisions

### D1. YAML-based context profiles
Store context profiles in YAML because:
- Easy to read and edit
- Supports nested structures
- Can be validated programmatically

### D2. IF/THEN syntax in BOOT.md
Use simple IF/THEN syntax because:
- Easy to understand
- Can be parsed by any LLM
- Minimal complexity

### D3. Lazy loading via wrapper
Implement lazy loading as a wrapper around file reads:
- Intercept first access to optional context
- Load file on demand
- Cache for session duration

### D4. Fallback to full load
If conditional logic fails, load all context:
- Ensures backward compatibility
- Prevents broken agents
- Can be detected via boot log

## Data Flow

```
1. Parse agent config (if available)
   ↓
2. Detect agent type (admin/finance/hr/marketing/content)
   ↓
3. Detect task type (onboarding/reporting/content_creation/etc)
   ↓
4. Load context profile from context_profiles.yaml
   ↓
5. Load required context files
   ↓
6. Setup lazy loading for optional context
   ↓
7. Measure tokens loaded
   ↓
8. Log to boot_metrics.json
```

## Files

| File | Purpose |
|------|---------|
| `BOOT.md` | Entry point with conditional logic |
| `00_Winter_is_Coming/BOOT.md` | Agent-type detection logic |
| `01_Personal_Os/01_Core/01_Rules/context_profiles.yaml` | Context profiles per agent type |
| `01_Personal_Os/04_Operations/00_Context_LLM/boot_metrics.json` | Token usage metrics |

## Verification

1. Load Admin agent → should load only admin context
2. Load Finance agent → should load only finance context
3. Load agent without type → should load all context (fallback)
4. Check boot_metrics.json → should show token savings
5. Verify no agents break with new boot logic
