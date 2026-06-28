# Spec: Adaptive Boot

## REQ-BOOT-01: Conditional Loading Syntax
BOOT.md MUST support conditional loading using this syntax:
```
IF agent_type == "admin" THEN
  LOAD 10_Shared_Org/agents/admin-config.yaml
  LOAD 10_Shared_Org/processes/01-proyecto-kickoff.md
  LOAD 10_Shared_Org/playbooks/01-onboarding-nuevo-cliente.md
END IF
```

## REQ-BOOT-02: Agent Type Detection
The boot system MUST detect agent type from:
1. Agent config file (if loaded)
2. Agent name (if contains "admin", "finance", "hr", "marketing", "content")
3. Task description (if mentions agent role)

Detection MUST happen before context loading.

## REQ-BOOT-03: Task Type Detection
The boot system MUST detect task type from:
1. Task description keywords
2. Loaded agent config
3. Explicit task tags (if provided)

Task types: "onboarding", "reporting", "content_creation", "analysis", "coordination"

## REQ-BOOT-04: Context Profiles
Each agent type MUST have a context profile defining:
- Required context files (always loaded)
- Optional context files (loaded if task matches)
- Excluded context files (never loaded for this agent)

Profiles MUST be stored in `01_Personal_Os/01_Core/01_Rules/context_profiles.yaml`

## REQ-BOOT-05: Lazy Loading
Optional context MUST be loaded lazily:
- Load on first access (when agent requests it)
- Cache loaded context for session duration
- Track lazy-loaded files in boot log

## REQ-BOOT-06: Token Measurement
The boot system MUST measure:
- Total tokens loaded (before and after optimization)
- Tokens loaded per context file
- Tokens saved by conditional loading
- Tokens loaded lazily

Metrics MUST be logged to `01_Personal_Os/04_Operations/00_Context_LLM/boot_metrics.json`

## REQ-BOOT-07: Backward Compatibility
BOOT.md MUST remain backward compatible:
- If no agent type detected, load all context (current behavior)
- If conditional logic fails, fall back to full load
- Existing agents MUST work without modification

## REQ-BOOT-08: Documentation
`01_Personal_Os/01_Core/01_Rules/context_profiles.yaml` MUST document:
- How to add new context profiles
- How to modify existing profiles
- How to test conditional loading
- Token savings achieved per agent type
