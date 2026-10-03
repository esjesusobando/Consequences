# Proposal: Integration Auto-Improvement ↔ Capital Token

## Intent

Connect the Auto-Improvement engine with Capital Token so the system learns from itself. When Auto-Improvement detects recurring patterns, they should be saved as playbooks/processes in Capital Token. When Capital Token has new content, Auto-Improvement should monitor it for quality. This creates a self-improving organizational knowledge base.

## Scope

### In Scope
- Connect `learner.py` to Shared Org (write patterns as playbooks/processes)
- Add pattern detection for recurring issues (3+ occurrences = candidate playbook)
- Create auto-playbook generator (convert pattern to playbook template)
- Add Capital Token monitoring to Auto-Improvement (check new content quality)
- Create unified dashboard showing "organizational knowledge accumulated"
- Document integration methodology

### Out of Scope
- Real-time pattern detection (batch processing is sufficient)
- Automatic playbook refinement (human review still required)
- Multi-agent learning coordination

## Capabilities

### New Capabilities
- **Auto-Playbook Generation**: When pattern detected 3+ times, generate playbook draft in `10_Shared_Org/playbooks/`
- **Capital Token Monitoring**: Auto-Improvement checks new Shared Org content for quality issues
- **Unified Knowledge Dashboard**: Single view of organizational knowledge accumulation

### Modified Capabilities
- **learner.py**: Now writes patterns to Shared Org (not just learnings.json)
- **Auto-Improvement engine**: Now monitors Capital Token content quality

## Approach

1. **Add pattern aggregation**: Track pattern occurrences across cycles
2. **Implement threshold detection**: When pattern occurs 3+ times, flag as playbook candidate
3. **Build auto-playbook generator**: Convert pattern to playbook template with YAML frontmatter
4. **Add Capital Token monitor**: Scan new Shared Org files for quality issues
5. **Create unified dashboard**: Show patterns detected, playbooks generated, content quality
6. **Document integration**: Explain how the feedback loop works

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `01_Engine/learner.py` | Modified | Add Shared Org writing |
| `01_Engine/detector.py` | Modified | Add Capital Token monitoring |
| `10_Shared_Org/playbooks/auto-generated/` | Created | Auto-generated playbook drafts |
| `03_Metrics/knowledge_dashboard.md` | Created | Unified knowledge dashboard |
| `03_Metrics/pattern_aggregator.json` | Created | Pattern occurrence tracking |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Auto-generated playbooks are low quality | High | Mark as "DRAFT — requires human review" |
| Pattern detection is too aggressive | Medium | Require 3+ occurrences before generating playbook |
| Capital Token monitoring slows engine | Low | Run monitoring in separate phase, cache results |
| Feedback loop creates noise | Medium | Only generate playbooks for HIGH severity patterns |

## Rollback Plan

Revert `learner.py` and `detector.py` to previous versions. Delete auto-generated playbooks.

## Dependencies

- Auto-Improvement engine (already functional)
- Capital Token Shared Org (already populated)
- Python 3.x (already available)

## Completion Record

| Event | Date |
|-------|------|
| Proposed | 2026-06-27 |
| Implemented | |
| Verified | |
| Archived | |
