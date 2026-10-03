# Tasks: Audit & Fix — Think Different PersonalOS v3.0 Consequences

## Phase 1: Configuration Fixes

- [x] 1.1 Backup `.mcp.json` → `git diff .mcp.json > .backup/mcp-backup.diff`
- [x] 1.2 Remove duplicate `rules:` section from `.atl/openspec/config.yaml`
- [x] 1.3 Remove duplicate `testing:` section from `.atl/openspec/config.yaml`
- [x] 1.4 Add `known_issues:` section to `.atl/openspec/config.yaml`

## Phase 2: MCP Path Sanitization

- [x] 2.1 Document hardcoded paths in `.mcp.json` lines 49, 82, 192, 228 as known issues
- [x] 2.2 Add comments to indicate these require manual configuration per machine
- [x] 2.3 Verify JSON syntax still valid → `jq . .mcp.json`

## Phase 3: Version Updates

- [x] 3.1 Update `.atl/skill-registry.md` version from v2.0 → v3.0 Consequences
- [x] 3.2 Update last_updated date to 2026-04-26
- [x] 3.3 Verify skills count (297) matches actual scan result
- [x] 3.4 Update HUBs count to 18 in skill-registry.md

## Phase 4: Documentation

- [x] 4.1 Update `.opencode/opencode.jsonc` with skill registry path
- [x] 4.2 Verify AGENTS.md references point to correct sources
- [x] 4.3 Run validation: `git status` to see modified files

## Phase 5: Verification

- [x] 5.1 Validate `.atl/openspec/config.yaml` YAML syntax
- [x] 5.2 Validate `.mcp.json` JSON syntax
- [x] 5.3 Verify no paths hardcoded that should be env variables
- [x] 5.4 Check git status for expected changes only