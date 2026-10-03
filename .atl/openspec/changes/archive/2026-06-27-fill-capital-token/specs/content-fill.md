# Spec: Fill Shared Org with Real Content

## REQ-CONTENT-01: Organizational Context
`context/organizacion.md` MUST have all `{{placeholder}}` values replaced with real data. Values that cannot be determined MUST be marked as `[TBD: description]` — never left as `{{template}}`.

## REQ-CONTENT-02: Processes
At minimum 2 process SOPs MUST exist in `processes/` using the existing `00-template.md` format. Each MUST have:
- YAML frontmatter with title, version, owner, tags
- Clear numbered steps
- Quality gates checklist

## REQ-CONTENT-03: Decisions
At minimum 1 real ADR MUST exist in `decisions/` (beyond ADR-001) documenting a past architectural or process decision.

## REQ-CONTENT-04: Playbooks
At minimum 1 additional playbook MUST exist in `playbooks/` with the same level of detail as `01-onboarding-nuevo-cliente.md`.

---

# Spec: Deploy Bridge and Connect Agents

## REQ-BRIDGE-01: Bridge Verification
`capital-token-bridge.py` MUST pass these tests:
- `python capital-token-bridge.py --index` returns a valid JSON index with all content categories
- `python capital-token-bridge.py --query "onboarding"` returns results from playbooks
- `python capital-token-bridge.py --sync` executes without error

## REQ-BRIDGE-02: Agent Connection
At minimum 1 agent (Admin Agent) MUST have a working agent config that references Shared Org context. The agent config MUST be placed in the appropriate agent directory (not template-only).

## REQ-BRIDGE-03: Dashboard Update
`metrics/capital-token-dashboard.md` MUST reflect the current real state after all changes.

---

# Spec: CLI Quickstart

## REQ-CLI-01: Cheatsheet
A CLI usage guide MUST be added to the Shared Org README or as a separate `USAGE.md` showing:
- `--index` command
- `--query "text"` command  
- `--serve` mode
- How agents should connect
