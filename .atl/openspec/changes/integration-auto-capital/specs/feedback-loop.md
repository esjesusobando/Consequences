# Spec: Integration Auto-Improvement ↔ Capital Token

## REQ-INT-01: Pattern Aggregation
The learner MUST track pattern occurrences across cycles:
- Store in `03_Metrics/pattern_aggregator.json`
- Track: pattern_hash, occurrences, first_seen, last_seen, severity
- Increment counter each time pattern is detected
- Reset counter only if pattern not seen for 30+ days

## REQ-INT-02: Threshold Detection
When a pattern reaches 3+ occurrences:
- Flag as "playbook candidate"
- Generate playbook draft in `10_Shared_Org/playbooks/auto-generated/`
- Mark playbook as "DRAFT — requires human review"
- Log generation event

## REQ-INT-03: Auto-Playbook Generator
Generated playbook MUST include:
- YAML frontmatter (title, version, owner: "auto-generated", tags)
- Pattern description (from analyzer)
- Root cause (from analyzer)
- Suggested fix (from executor)
- Quality gates (from auto_fix_rules)
- Metrics (occurrences, first_seen, last_seen)

## REQ-INT-04: Capital Token Monitoring
The detector MUST scan new Shared Org files for quality issues:
- Check YAML frontmatter validity
- Check for placeholder text (`{{...}}`)
- Check for broken links/references
- Check for incomplete sections
- Log issues to `03_Metrics/capital_token_quality.json`

## REQ-INT-05: Unified Knowledge Dashboard
`03_Metrics/knowledge_dashboard.md` MUST display:
- Total patterns detected (all time)
- Patterns by severity (HIGH/MEDIUM/LOW)
- Playbooks generated (auto + manual)
- Capital Token content quality score
- Trend indicators (↑↓→)

## REQ-INT-06: Feedback Loop Documentation
`03_Metrics/INTEGRATION_METHODOLOGY.md` MUST explain:
- How patterns become playbooks
- How Capital Token is monitored
- How to review auto-generated playbooks
- How to update quality thresholds

## REQ-INT-07: Backward Compatibility
Integration MUST NOT break existing functionality:
- Auto-Improvement must still work standalone
- Capital Token must still work standalone
- Integration is additive, not replacing
