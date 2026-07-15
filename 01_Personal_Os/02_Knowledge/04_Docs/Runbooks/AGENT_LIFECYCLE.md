# Agent Lifecycle Runbook — PersonalOS

> **Owner:** Sebastian  
> **Last Updated:** 2026-07-14  
> **Audience:** Anyone creating, modifying, or deprecating agents

---

## Lifecycle Stages

```
Define → Configure → Test → Deploy → Monitor → Deprecate
```

---

## Stage 1: Define

Before creating an agent, answer:
- What problem does this agent solve?
- What inputs does it receive?
- What outputs does it produce?
- What tools/MCP servers does it need?

---

## Stage 2: Configure

### Configuration Format

Agent configs live in `01_Personal_Os/02_Tools/01_Agents/`:

```yaml
# agent-name.yaml
name: agent-name
description: What this agent does
model: claude-sonnet-4-20250514
tools:
  - tool_name_1
  - tool_name_2
mcp_servers:
  - server_name
system_prompt: |
  You are a [role] that [responsibility].
  Rules:
  1. [Rule 1]
  2. [Rule 2]
triggers:
  - "keyword that activates this agent"
```

### Rules for Configuration

- Every agent needs a clear, single responsibility
- System prompts should be concise (< 500 words)
- Tools list should be minimal — only what's needed
- Triggers should be specific, not generic

---

## Stage 3: Test

```bash
# Test the agent manually
# (Use the agent in a conversation and verify behavior)

# Run system validators to check nothing broke
python session_init_test.py --verbose
python certify_10_10.py --verbose
```

### Test Checklist

- [ ] Agent responds to its triggers
- [ ] Agent produces correct output format
- [ ] Agent handles edge cases (empty input, malformed data)
- [ ] Agent doesn't interfere with other agents
- [ ] No regressions in other validators

---

## Stage 4: Deploy

1. Commit the agent config with conventional commit:
   ```bash
   git commit -m "feat: add agent-name for [purpose]"
   ```
2. Verify agent appears in the system:
   ```bash
   python 20_System_Mapper_Hub.py --scan
   ```
3. Test in a real session

---

## Stage 5: Monitor

- Review agent performance in telemetry data
- Check for errors in session logs
- Run `python 18_Telemetry_Hub.py --morning` for health status

---

## Stage 6: Deprecate

1. Add deprecation notice to config:
   ```yaml
   deprecated: true
   deprecated_date: 2026-07-14
   replaced_by: new-agent-name
   ```
2. Remove triggers so the agent stops activating
3. Keep config files for 30 days
4. Delete after grace period

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Agent not activating | Check trigger keywords in config |
| Agent uses wrong model | Verify `model` field in config |
| Agent conflicts with another | Narrow trigger specificity |
| Agent produces wrong output | Review system_prompt clarity |
