# Proposal: Fix Graphify Integration v1

## Intent

Graphify integration is broken in 3 ways: mismatched paths (`graphify-out/` vs `Graphify_Out/`), wrong Python package installed (`graphifyy` instead of `graphify`), and missing/inconsistent agent platform hooks. Agents can't use the knowledge graph reliably.

## Scope

### In Scope
1. Unify all path references to canonical `Graphify_Out/`
2. Install correct `graphify` package from official repo
3. Fix `.claude/settings.json` hook path
4. Fix `.opencode/plugins/graphify.js` path
5. Add `.codex/rules/graphify.mdc` for Codex integration
6. Fix `config_paths.py` — remove phantom `graphify-out/` subdir
7. Rebuild graph with correct package + paths
8. Verify docs (AGENTS.md, CLAUDE.md) already match

### Out of Scope
- Semantic/LLM-based graph clustering (stays AST-only)
- Graphify MCP server setup
- New query capabilities beyond existing ones

## Capabilities

### New Capabilities
None — pure config/package fix, no spec-level behavior change.

### Modified Capabilities
None — no existing capabilities change behavior.

## Approach

### 1. Uninstall wrong package, install correct one
`pip uninstall -y graphifyy && pip install graphify`

### 2. Canonical path
`Graphify_Out/` is correct on disk. Single source of truth.

### 3. Fix agent integrations
| File | Change |
|------|--------|
| `.claude/settings.json` | `graphify-out/` → `Graphify_Out/` |
| `.opencode/plugins/graphify.js` | `"graphify-out"` → `"Graphify_Out"` |
| `.codex/rules/graphify.mdc` | New — mirror `.cursor/rules/graphify.mdc` |

### 4. Fix config_paths.py
`GRAPHIFY_DIR = GRAPHIFY_BASE / "graphify-out"` → `GRAPHIFY_DIR = GRAPHIFY_BASE`

### 5. Rebuild graph
`graphify update . --no-cluster` — works from root, no `--graph` flag needed.

## Affected Areas

| Area | Impact |
|------|--------|
| `.claude/settings.json` | Modified — fix Bash hook path |
| `.opencode/plugins/graphify.js` | Modified — fix path constant |
| `.codex/rules/graphify.mdc` | New — Codex integration |
| `config_paths.py` | Modified — remove phantom subdir |
| `31_Graphify_Hub.py` | None — uses config_paths, auto-fixes |
| AGENTS.md / CLAUDE.md | Verify only — already correct |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `graphify` fails on Windows | Medium | Test after install; GH issue fallback |
| .claude JSON syntax error | Low | Validate with `json.loads` before write |
| Graph rebuild fails | Low | Old graph at `Graphify_Out/` is valid fallback |

## Rollback Plan

1. `git checkout -- .claude/settings.json .opencode/plugins/graphify.js 01_Personal_Os/04_Operations/03_Scripts_Os/config_paths.py`
2. `rm .codex/rules/graphify.mdc`
3. `pip install graphifyy==0.8.27`
4. `python 31_Graphify_Hub.py --build`

## Dependencies

- `graphify` package via pip supports `--no-cluster`

## Success Criteria

- [ ] `graphify update . --no-cluster` exits 0 from project root, no `--graph` flag needed
- [ ] `Graphify_Out/graph.json` is non-empty valid JSON
- [ ] All 4 agent configs reference `Graphify_Out/`
- [ ] `config_paths.GRAPHIFY_DIR` resolves to `<root>/Graphify_Out`
- [ ] `graphify query "test"` returns results without `--graph` flag
