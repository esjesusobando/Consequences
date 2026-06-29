---
title: Session Summary
date: 2026-05-28
type: session_summary
---

## Goal
- Review entire project, update dependencies, routes, folder structures, improve ugly tables, update all documentation, then run Judgment Day

## Constraints & Preferences
- Spanish rioplatense for all communication
- Do not delete historical information unless it is a confirmed bug
- Preserve active/docs files; update only what is necessary
- Maintain system integrity (Pure Green state)

## Progress
### Done
- Diagnosis completed: 13 issues found (submodules, duplicates, path mismatches)
- Fixed broken gitlink: removed  (no .gitmodules entry)
- Reinitialized submodule engram v1.15.15 — Persistent memory for AI coding agents

Usage:
  engram <command> [arguments]

Commands:
  serve [port]       Start HTTP API server (default: 7437)
  mcp [--tools=PROFILE]
                     Start MCP server (stdio transport, for any AI agent)
                       Profiles: agent (15 tools), admin (4 tools), all (default, 19)
                       Combine: --tools=agent,admin or pick individual tools
                       Example: engram mcp --tools=agent
  tui                Launch interactive terminal UI
  search <query>     Search memories [--type TYPE] [--project PROJECT] [--scope SCOPE] [--limit N]
  save <title> <msg> Save a memory  [--type TYPE] [--project PROJECT] [--scope SCOPE]
  timeline <obs_id>  Show chronological context around an observation [--before N] [--after N]
  conflicts <sub>   Inspect and manage memory conflict relations
                       list     [--project P]  [--status S]  [--since RFC3339]  [--limit N]
                       show     <relation_id>
                       stats    [--project P]
                       scan     [--project P]  [--since RFC3339]  [--dry-run]  [--apply]  [--max-insert N]
                                [--semantic]  [--concurrency N]  [--timeout-per-call SECONDS]
                                [--max-semantic N]  [--yes]
                       deferred [--status S]  [--limit N]  [--inspect SYNC_ID]  [--replay]
  doctor             Run read-only operational diagnostics [--json] [--project P] [--check CODE]
  context [project]  Show recent context from previous sessions
  stats              Show memory system statistics
  export [file]      Export all memories to JSON (default: engram-export.json)
  import <file>      Import memories from a JSON export file
  projects list      List all projects with observation, session, and prompt counts
  projects consolidate [--all] [--dry-run]
                     Merge similar project names into one canonical name
                       --all      Scan ALL projects for similar name groups
                       --dry-run  Preview what would be merged (no changes)
  setup [agent]      Install/setup agent integration (opencode, pi, claude-code, gemini-cli, codex)
  sync               Export new memories as compressed chunk to .engram/
                         --import   Import new chunks from .engram/ into local DB
                         --status   Show sync status
                         --project  Filter export to a specific project
                         --all      Export ALL projects (ignore directory-based filter)
		                 --cloud    Run sync against configured cloud endpoint (requires explicit --project)
	  cloud <subcommand> Cloud integration commands (opt-in)
	                        status     Show cloud config status
	                        enroll     Enroll a project for cloud sync
	                        config     Set cloud server URL
	                        serve      Run cloud backend + dashboard
  obsidian-export    Export memories to an Obsidian-compatible markdown vault
                       --vault         Path to Obsidian vault root (required)
                       --project       Filter export to a single project (optional)
                       --limit         Cap exported observations at N (optional)
                       --since         Export only observations after this date, e.g. 2026-01-01 (optional)
                       --force         Ignore incremental state, full re-export (optional)
                       --graph-config  Graph layout mode: preserve|force|skip (default: preserve)
                       --watch         Enable auto-sync mode (runs on interval until Ctrl+C)
                       --interval      Sync interval for --watch mode (default: 10m, minimum: 1m)

  version            Print version
  help               Show this help

Environment:
  ENGRAM_DATA_DIR    Override data directory (default: ~/.engram)
  ENGRAM_PORT        Override HTTP server port (default: 7437)
  ENGRAM_PROJECT     Default project hint for serve sync status fallback
  ENGRAM_DATABASE_URL
                     Postgres DSN for engram cloud serve
  ENGRAM_CLOUD_HOST  Bind host for engram cloud serve (default: 127.0.0.1)
  ENGRAM_CLOUD_MAX_PUSH_BYTES
                     Max cloud push payload bytes (default: 8388608)
  ENGRAM_CLOUD_TOKEN Bearer token required in authenticated cloud serve mode
  ENGRAM_CLOUD_INSECURE_NO_AUTH
                     Set to 1 ONLY for local insecure cloud serve mode (no auth)
                     Cannot be combined with ENGRAM_CLOUD_TOKEN
                     Cannot be combined with ENGRAM_CLOUD_ADMIN
  ENGRAM_CLOUD_ALLOWED_PROJECTS
	                     Comma-separated project allowlist enforced by cloud server
	                     Required for cloud serve in BOTH token auth and insecure no-auth mode
	ENGRAM_JWT_SECRET   Required in authenticated cloud serve mode (ENGRAM_CLOUD_TOKEN set);
	                     must be explicitly set to a non-default value
	ENGRAM_CLOUD_ADMIN  Optional admin-only dashboard token in authenticated mode
	                     Ignored/rejected in insecure mode (ENGRAM_CLOUD_INSECURE_NO_AUTH=1)

MCP Configuration (add to your agent's config):
  {
    "mcp": {
      "engram": {
        "type": "stdio",
        "command": "engram",
        "args": ["mcp", "--tools=agent"]
      }
    }
  } (correct commit, now tracking upstream)
- Cleaned zombie submodules from  (OIM Website, Design System, etc.)
- Synced  with  (Rules, Agents, Skills, Workflows)
- Updated  version to v4.8 Consequences | 2026-05-25
- Updated  to May 25, 2026 (Q2 progress, completed objectives)
- Removed stale gitlinks for "03_Resultado/00_Proyectos/00_Side Project" and "03_Resultado/02_Experimentos/07_Clinica_Infantil"

### In Progress
- Cleaning duplicate scripts in  (03_Validator vs 05_Validator, 03_AIPM vs 05_AIPM, etc.)
- Improving tables in documentation (ugly markdown tables in README, CLAUDE.md, etc.)
- Updating remaining documentation: README.md, CLAUDE.md, Structure_v4.8.md, etc.
- Preparing for Judgment Day (dual adversarial review protocol)

### Blocked
- (none)

## Key Decisions
- Removed gitlink for  instead of fixing .gitmodules (directory is normal with plugin/)
- Chose to keep .agent/ in sync with core by copying (ensures consistency for sub-agent boot protocol)
- Deferred aggressive deduplication of scripts until after table improvements and doc updates (to avoid breaking changes during audit)
- Updated OS_DIRECTORY.md in-place rather than deleting old version (preserves history)

## Next Steps
- Finish deduplication of scripts in  (keep latest version, remove obsolete duplicates)
- Improve tables in all documentation files (README.md, CLAUDE.md, AGENTS.md, etc.)
- Update remaining docs: README.md (badges, metrics), CLAUDE.md (dates, rules), Structure_v4.8.md (if needed)
- Run Judgment Day (dual adversarial review) on entire project or targeted areas
- Commit all changes with descriptive message
- Verify submodule status and git health

## Critical Context
- Submodule engram v1.15.15 — Persistent memory for AI coding agents

Usage:
  engram <command> [arguments]

Commands:
  serve [port]       Start HTTP API server (default: 7437)
  mcp [--tools=PROFILE]
                     Start MCP server (stdio transport, for any AI agent)
                       Profiles: agent (15 tools), admin (4 tools), all (default, 19)
                       Combine: --tools=agent,admin or pick individual tools
                       Example: engram mcp --tools=agent
  tui                Launch interactive terminal UI
  search <query>     Search memories [--type TYPE] [--project PROJECT] [--scope SCOPE] [--limit N]
  save <title> <msg> Save a memory  [--type TYPE] [--project PROJECT] [--scope SCOPE]
  timeline <obs_id>  Show chronological context around an observation [--before N] [--after N]
  conflicts <sub>   Inspect and manage memory conflict relations
                       list     [--project P]  [--status S]  [--since RFC3339]  [--limit N]
                       show     <relation_id>
                       stats    [--project P]
                       scan     [--project P]  [--since RFC3339]  [--dry-run]  [--apply]  [--max-insert N]
                                [--semantic]  [--concurrency N]  [--timeout-per-call SECONDS]
                                [--max-semantic N]  [--yes]
                       deferred [--status S]  [--limit N]  [--inspect SYNC_ID]  [--replay]
  doctor             Run read-only operational diagnostics [--json] [--project P] [--check CODE]
  context [project]  Show recent context from previous sessions
  stats              Show memory system statistics
  export [file]      Export all memories to JSON (default: engram-export.json)
  import <file>      Import memories from a JSON export file
  projects list      List all projects with observation, session, and prompt counts
  projects consolidate [--all] [--dry-run]
                     Merge similar project names into one canonical name
                       --all      Scan ALL projects for similar name groups
                       --dry-run  Preview what would be merged (no changes)
  setup [agent]      Install/setup agent integration (opencode, pi, claude-code, gemini-cli, codex)
  sync               Export new memories as compressed chunk to .engram/
                         --import   Import new chunks from .engram/ into local DB
                         --status   Show sync status
                         --project  Filter export to a specific project
                         --all      Export ALL projects (ignore directory-based filter)
		                 --cloud    Run sync against configured cloud endpoint (requires explicit --project)
	  cloud <subcommand> Cloud integration commands (opt-in)
	                        status     Show cloud config status
	                        enroll     Enroll a project for cloud sync
	                        config     Set cloud server URL
	                        serve      Run cloud backend + dashboard
  obsidian-export    Export memories to an Obsidian-compatible markdown vault
                       --vault         Path to Obsidian vault root (required)
                       --project       Filter export to a single project (optional)
                       --limit         Cap exported observations at N (optional)
                       --since         Export only observations after this date, e.g. 2026-01-01 (optional)
                       --force         Ignore incremental state, full re-export (optional)
                       --graph-config  Graph layout mode: preserve|force|skip (default: preserve)
                       --watch         Enable auto-sync mode (runs on interval until Ctrl+C)
                       --interval      Sync interval for --watch mode (default: 10m, minimum: 1m)

  version            Print version
  help               Show this help

Environment:
  ENGRAM_DATA_DIR    Override data directory (default: ~/.engram)
  ENGRAM_PORT        Override HTTP server port (default: 7437)
  ENGRAM_PROJECT     Default project hint for serve sync status fallback
  ENGRAM_DATABASE_URL
                     Postgres DSN for engram cloud serve
  ENGRAM_CLOUD_HOST  Bind host for engram cloud serve (default: 127.0.0.1)
  ENGRAM_CLOUD_MAX_PUSH_BYTES
                     Max cloud push payload bytes (default: 8388608)
  ENGRAM_CLOUD_TOKEN Bearer token required in authenticated cloud serve mode
  ENGRAM_CLOUD_INSECURE_NO_AUTH
                     Set to 1 ONLY for local insecure cloud serve mode (no auth)
                     Cannot be combined with ENGRAM_CLOUD_TOKEN
                     Cannot be combined with ENGRAM_CLOUD_ADMIN
  ENGRAM_CLOUD_ALLOWED_PROJECTS
	                     Comma-separated project allowlist enforced by cloud server
	                     Required for cloud serve in BOTH token auth and insecure no-auth mode
	ENGRAM_JWT_SECRET   Required in authenticated cloud serve mode (ENGRAM_CLOUD_TOKEN set);
	                     must be explicitly set to a non-default value
	ENGRAM_CLOUD_ADMIN  Optional admin-only dashboard token in authenticated mode
	                     Ignored/rejected in insecure mode (ENGRAM_CLOUD_INSECURE_NO_AUTH=1)

MCP Configuration (add to your agent's config):
  {
    "mcp": {
      "engram": {
        "type": "stdio",
        "command": "engram",
        "args": ["mcp", "--tools=agent"]
      }
    }
  } was corrupted: missing .git directory, only contained , was reading parent repo's .git
-  was a gitlink (160000) without entry in , causing -05e6fd183e2af60bb3b40559d337b7e845991b84 01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/23_Tubemaster
 743f2d0f42e6f9d5512310541d3c62ca89d019c1 01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/engram (pi-v0.1.5-2-g743f2d0)
 848a1fd62b16bde1be54e4a797157f3287fde58b 01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/gentle-pi (v0.3.8) to fail
- Multiple zombie submodules in  (OIM Website Backup copies, Design System, etc.) referencing non-existent paths
-  in root and  were out of sync (v4.7 vs v4.8, different dates)
-  last updated April 20, 2026 (stale)
- Duplicate script directories ( vs ) contain differences: path references, REQUIRED_DIRS logic, README content, JSON outputs
- Many docs still reference  (should point to  or be updated)
- Current canonical counts: 284 scripts, 394 skills, 48 agents, 30 workflows, 7+38 MCPs

## Relevant Files
- : defines submodules (tubemaster, engram, gentle-pi, OIM Website v2)
- : was broken gitlink, now normal directory with 
- : reinitialized submodule (commit 743f2d0f4)
- : updated version and date (root copy)
- : updated version and date
- : updated to May 25, 2026 with Q2 progress
- : requires update (date, token economy, boot protocol)
- : requires update (badges, metrics, structure section)
-  vs : duplicate scripts with divergent logic
- : previously contained zombie submodule sections (now cleaned)
