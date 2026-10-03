# Design: Fill Capital Token — Shared Org Content

## Content Architecture

```
10_Shared_Org/
├── context/
│   └── organizacion.md       ← Fill: replace {{placeholders}} with real org data
├── processes/
│   ├── README.md             ← (exists)
│   ├── 00-template.md        ← (exists)
│   └── 01-proyecto-kickoff.md    ← NEW: SOP for project kickoff
│   └── 02-reporte-semanal.md     ← NEW: SOP for weekly client reporting
├── decisions/
│   ├── README.md             ← (exists)
│   ├── 00-template.md        ← (exists)
│   └── 001-capital-token-hibrido.md ← (exists, ADR for architecture)
│   └── 002-estructura-conocimiento.md ← NEW: ADR for knowledge structure
├── playbooks/
│   ├── README.md             ← (exists)
│   ├── 00-template.md        ← (exists)
│   ├── 01-onboarding-nuevo-cliente.md ← (exists)
│   └── 02-produccion-contenido.md     ← NEW: Content production playbook
├── agents/
│   ├── README.md             ← (exists)
│   ├── 01-admin-agent.md     ← (template exists, keep as template)
│   └── admin-config.yaml     ← NEW: real agent config that loads Shared Org
├── metrics/
│   ├── README.md             ← (exists)
│   └── capital-token-dashboard.md ← Update: fill real numbers
├── capital-token-bridge.py   ← Verify: test all modes
└── README.md                 ← Update: add CLI usage guide
```

## Key Decisions

### D1. Templates remain as templates
The 3 agent templates stay as-is. They're reference material for creating real agents. A separate config file (`admin-config.yaml`) serves as the actual deployable agent config.

### D2. Content fills conservatively
Where exact org data is unknown, use `[TBD: description]` markers instead of fabricating. This makes gaps visible and fillable later.

### D3. Bridge tested, not modified
The bridge v0.1 is functional. No code changes needed — just verification that `--serve`, `--query`, `--index`, and `--sync` all work cleanly.

## Bridge Verification Scenarios

1. `python capital-token-bridge.py --index` → valid JSON
2. `python capital-token-bridge.py --query "onboarding"` → hits playbooks
3. `python capital-token-bridge.py --sync` → no errors
4. Interactive: `/index`, `/query`, `/get` commands all work
