# Proposal: Adaptive Boot — Conditional Context Loading

## Intent

Implement conditional logic in BOOT.md to load only relevant context based on agent type and task. Currently all agents load the same context, wasting tokens and slowing boot time. Adaptive boot will reduce token usage by 30-50% and improve boot speed.

## Scope

### In Scope
- Refactor BOOT.md to support conditional loading
- Add agent-type detection logic
- Add task-type detection logic
- Create context profiles for each agent type (Admin, Finance, HR, Marketing, Content)
- Implement lazy loading for optional context
- Measure token savings vs current approach
- Document boot optimization methodology

### Out of Scope
- Dynamic context generation (future phase)
- Context caching across sessions (already handled by Engram)
- Multi-agent boot coordination

## Capabilities

### Modified Capabilities
- **BOOT.md**: Now supports conditional loading based on agent type and task
- **Boot time**: Reduced by loading only relevant context
- **Token usage**: Reduced by 30-50% per boot

## Approach

1. **Analyze current boot**: Measure tokens loaded by current BOOT.md
2. **Define context profiles**: Map each agent type to required context files
3. **Implement conditional logic**: Add IF/THEN blocks to BOOT.md
4. **Add agent-type detection**: Parse agent config to determine type
5. **Add task-type detection**: Parse task description to determine context needs
6. **Implement lazy loading**: Load optional context only when accessed
7. **Measure improvements**: Compare token usage before/after
8. **Document methodology**: Explain how to add new context profiles

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `BOOT.md` | Modified | Add conditional loading logic |
| `00_Winter_is_Coming/BOOT.md` | Modified | Add agent-type detection |
| `01_Personal_Os/01_Core/01_Rules/` | Modified | Add context profile rules |
| `01_Personal_Os/04_Operations/00_Context_LLM/` | Modified | Add lazy loading support |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Conditional logic breaks existing agents | Medium | Test each agent type individually before deploying |
| Context profiles are incomplete | Medium | Start with conservative profiles, expand based on feedback |
| Lazy loading adds complexity | Low | Keep lazy loading simple (load on first access) |
| Token savings are minimal | Low | Measure before/after, adjust profiles if needed |

## Rollback Plan

Revert BOOT.md to previous version. No dependencies changed.

## Dependencies

- Agent config files (already exist in `10_Shared_Org/agents/`)
- Context files (already exist in various locations)
- Engram MCP for context tracking (already configured)

## Completion Record

| Event | Date |
|-------|------|
| Proposed | 2026-06-27 |
| Implemented | |
| Verified | |
| Archived | |
