# Docs Ground Truth Sync — Specification

> **Change:** documentation-overhaul-ground-truth-sync  
> **Version reference:** v4.9.1 (production)  
> **Scope:** Documentation-only. Zero files renamed, moved, deleted, or created on disk.  
> **Verification date:** 2026-06-27

---

## Section 1: Stats & Interfaces

### Files in Scope (7 primary)

| # | File | Path | Role |
|---|------|------|------|
| F1 | Structure_v5.0.md | `./Structure_v5.0.md` | Source-of-truth structure reference |
| F2 | README.md | `./README.md` | Project entrypoint, metric dashboard |
| F3 | AGENTS.md (root) | `./AGENTS.md` | GGA pre-commit entrypoint, version header |
| F4 | AGENTS.md (Winter) | `00_Winter_is_Coming/AGENTS.md` | Full orchestrator manifest |
| F5 | GOALS.md | `00_Winter_is_Coming/GOALS.md` | Strategic goals, metric references |
| F6 | CLAUDE.md | `./CLAUDE.md` | AI context harness, system status |
| F7 | config.yaml | `.atl/openspec/config.yaml` | SDD config, version + stack description |

### Files Explicitly Out of Scope

- Any file under `01_Personal_Os/`, `02_Playground/`, `03_Resultado/` (operational content)
- `.agent/`, `.claude/`, `.opencode/` (config mirrors — out of sync by design)
- `BACKLOG.md`, `CHANGELOG.md`, `ARCHIVE_MANIFEST.md`, `COMPLETION_SUMMARY.md` (transient/auto-generated)
- All `openspec/changes/` and `openspec/specs/` content except F7 (config)
- All files in `05_Archive/` (historical, read-only)

### Interface Contract

No file exports any API, schema, or machine-readable interface. All changes are human-readable text. There SHALL be zero changes to:
- YAML frontmatter structure
- CLI command signatures
- MCP tool definitions
- Script entry points
- Rule file formats (.mdc schema)

---

## Section 2: Requirements

### F1 — Structure_v5.0.md

#### REQ-F1-01: Fix 04_Operations nested layout

**Requirement:** The directory tree for `04_Operations/` MUST show `01_Engine`, `02_Rules`, `03_Metrics`, and `04_Triggers` as children of `01_Auto_Improvement/`, NOT as flat siblings of `00_Context_LLM`.

- GIVEN the current tree shows `01_Engine/`, `02_Rules/`, `03_Metrics/`, `04_Triggers/` indented at the same level as `00_Context_LLM/` and `01_Auto_Improvement/`
- WHEN we fix the nesting
- THEN those four directories MUST appear indented under `01_Auto_Improvement/`
- AND `recursive_improvement_engine.py` and `learnings.json` MUST also be indented under `01_Auto_Improvement/`

#### REQ-F1-02: Fix 02_Knowledge numbering offset

**Requirement:** The `02_Knowledge/` directory listing MUST start at `00_Examples_Personal_Os` instead of `01_Research_Os`, fixing the +2 numbering offset.

- GIVEN the current listing starts with `01_Research_Os`, `04_Docs`, `08_Templates`, `10_Shared_Org` (gaps at 00, 02, 03, 05, 06, 07, 09)
- WHEN we apply the fix
- THEN the first entry MUST be `00_Examples_Personal_Os`
- AND all subsequent entries MUST renumber to match disk reality without gaps (00, 01, 02, ...)

#### REQ-F1-03: Fix 02_Playground numbering

**Requirement:** The `02_Playground/` directory listing numbering MUST match actual disk directories.

- GIVEN the current listing shows duplicate `07_` entries (`07_Obanlover` then `07_Zero_Consequences`) and ordering that doesn't match disk
- WHEN we apply the fix
- THEN each directory MUST use the correct numerical prefix as it exists on disk
- AND ordering MUST match `ls` output of `02_Playground/`

#### REQ-F1-04: Fix archive subdirectory counts

**Requirement:** Archive subdirectory file counts MUST reflect verified disk state.

- GIVEN `01_Plans_Completed` says 32 files (reality: 36), and `03_Backups_Refs` says 10,826 files (reality: 11,582)
- WHEN we update the counts
- THEN `01_Plans_Completed` SHALL show `36 archivos`
- AND `03_Backups_Refs` SHALL show `11,582 archivos`

#### REQ-F1-05: Fix Winter_is_Coming file listing

**Requirement:** The `00_Winter_is_Coming/` directory listing MUST only include files that actually exist on disk.

- GIVEN the current list shows 11 entries (AGENTS.md through README.md) but only 8 exist on disk
- WHEN we apply the fix
- THEN the listing MUST show only the 8 files that exist
- AND the comment line `(11 files)` or equivalent count SHALL be removed or corrected to 8

#### REQ-F1-06: Fix metric counts across the document

**Requirement:** All metric references in Structure_v5.0.md MUST match verified ground truth.

- GIVEN the document says 71 agents, 30 HUBs with 163 scripts, 28 workflows, 10 hooks
- WHEN we apply the fix
- THEN agents SHALL read `~58` (with caveat: approximate, ~58 definition files)
- AND scripts SHALL read `~266` (258 .py + 1 .js + 7 .sh/.bat)
- AND HUBs SHALL read `22` (hub-named .py files)
- AND workflows SHALL read `29` (.md workflow files)
- AND hooks SHALL read `11` (hook scripts)
- AND MCP backup SHALL read `4` (JSON files in `03_Mcp/`)
- AND `Agentes` section totals MUST match `~58` (not 71)

### F2 — README.md

#### REQ-F2-01: Sync metric table to verified counts

**Requirement:** The `## 📊 Estado del Sistema` metric table MUST match verified ground truth.

- GIVEN the table shows 74 agents, 30 HUBs + 163 scripts, 28 workflows, 11+43 MCPs, 14,769 archive files
- WHEN we update the table
- THEN agents SHALL show `~58` or the correct approximate count
- AND HUBs+scripts SHALL show `22 HUBs` + `~266 scripts`
- AND MCP backup SHALL show `4` (not 43)
- AND workflows SHALL show `29`
- AND archive SHALL show `15,529 files`

#### REQ-F2-02: Fix OS_DIRECTORY.md path in tree

**Requirement:** The directory tree in `## 📂 Estructura del Sistema` MUST show `OS_DIRECTORY.md` inside `00_Winter_is_Coming/`, not at the root.

- GIVEN the tree shows `├── OS_DIRECTORY.md` at root level (not indented)
- WHEN we fix the path
- THEN `OS_DIRECTORY.md` SHALL appear inside the `00_Winter_is_Coming/` block
- AND the `## 📚 Documentación` table path for OS_DIRECTORY.md SHALL read `00_Winter_is_Coming/OS_DIRECTORY.md` (already correct — verify)

#### REQ-F2-03: Fix agent count in description

**Requirement:** The tagline and all agent references MUST use the corrected count.

- GIVEN the header says `71 agentes` (line 8) and the agent table says `74` (line 25)
- WHEN we fix
- THEN both SHALL read `~58` with appropriate caveat
- AND the agent breakdown table MUST sum to approximately 58

### F3 — Root AGENTS.md

#### REQ-F3-01: Fix version claim v5.0 → v4.9.1

**Requirement:** The version string in the root AGENTS.md footer MUST be corrected from v5.0 SOTA to v4.9.1.

- GIVEN the footer reads `*Generated by Think Different PersonalOS v5.0 SOTA — Production Ready (2026-06-25)*`
- WHEN we apply the fix
- THEN `v5.0 SOTA` SHALL be replaced with `v4.9.1`
- AND the date SHALL be reviewed for consistency (should be `2026-06-27` if updated, or `2026-06-25` if preserved)

### F4 — Winter AGENTS.md

#### REQ-F4-01: Fix SDD skill path

**Requirement:** The SDD skills local path under `### SDD Skills Location` MUST point to the correct directory on disk.

- GIVEN the current path reads `01_Personal_Os/01_Core/02_Tools/02_Skills/05_Workflows/` (which does not exist)
- WHEN we apply the fix
- THEN the path SHALL read `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Agent_Teams_Lite/`

#### REQ-F4-02: Fix MCP counts

**Requirement:** The MCP counts in the `Mapa de Recursos del Orquestador` table MUST match verified state.

- GIVEN the table says `MCPs (7 root + 38 backup)` and the MCP servers section (Section 6) says `Active (36 Servers)`
- WHEN we apply the fix
- THEN root MCPs SHALL read `11` (not 7)
- AND backup MCPs SHALL read `4` (not 38 or 36)
- AND the MCP section header SHALL be corrected to reflect the actual count

#### REQ-F4-03: Fix agent count

**Requirement:** Agent counts throughout Winter AGENTS.md MUST reflect ~58 verified definition files.

- GIVEN multiple sections say `71 agentes` (Mapa de Recursos, Workspace Shape)
- WHEN we apply the fix
- THEN all agent count references SHALL read `~58` with an explanatory note that this is the count of `.md` definition files in `01_Agents/`

#### REQ-F4-04: Fix HUB/script counts

**Requirement:** HUB and script counts MUST match verified ground truth.

- GIVEN the Workspace Shape tree says `30 HUBs — 163 scripts totales`
- WHEN we apply the fix
- THEN HUBs SHALL read `22` (hub-named .py files)
- AND scripts SHALL read `~266` (total .py + .js + .sh/.bat executables)

#### REQ-F4-05: Fix date consistency

**Requirement:** The document header date SHALL be reviewed. GIVEN it says `Última actualización: 2026-06-01` WHEN we apply the fix THEN the date SHALL be updated to `2026-06-27` (or the date of this overhaul).

### F5 — GOALS.md

#### REQ-F5-01: Sync metric references in achievements

**Requirement:** All metric references in the `## 📊 Q2 2026 PROGRESS` section and `Current Context` MUST match verified counts.

- GIVEN the document states `163 scripts, 392 skills, 61 agents, 7+38 MCPs, 28 workflows`
- WHEN we apply the fix
- THEN scripts SHALL read `~266`
- AND skills SHALL read `396`
- AND agents SHALL read `~58`
- AND MCPs SHALL read `11 root + 4 backup`
- AND workflows SHALL read `29`

#### REQ-F5-02: Fix strategic context counts

**Requirement:** The strategic context in `## 5. Context & Priorities` repeated counts MUST also be corrected.

- GIVEN it says `30 HUBs + 163 scripts, 61 agents, 28 workflows, 392 skills, 7+38 MCPs`
- WHEN we apply the fix
- THEN all counts SHALL match the verified ground truth values

#### REQ-F5-03: Fix date

GIVEN the header reads `Last updated: June 25, 2026` WHEN we apply the fix THEN the date SHALL be updated to `June 27, 2026` (or the date of this overhaul).

### F6 — CLAUDE.md

#### REQ-F6-01: Sync system status table

**Requirement:** The `## 📊 ESTADO DEL SISTEMA` table MUST reflect current verified counts.

- GIVEN the table dates from `v4.9 — 2026-06-01` and contains stale counts (HUBs 30/163, MCPs 11/45, Workflows 28, Hooks 10)
- WHEN we apply the fix
- THEN the header SHALL reflect `v4.9.1` and current date
- AND HUBs SHALL be updated to `22 HUBs — ~266 scripts`
- AND MCPs SHALL read `11 root + 4 backup`
- AND Workflows SHALL read `29`
- AND Hooks SHALL read `11`
- AND Agent Matrix SHALL read `~58`

#### REQ-F6-02: Fix manifest references

**Requirement:** The JARVIS manifest section (section 4) must sync its counts.

- GIVEN the manifest table references `HUBs: 30 — scripts: 163` and `28 workflows` and `10 hooks`
- WHEN we apply the fix
- THEN all counts SHALL match verified ground truth

### F7 — .atl/openspec/config.yaml

#### REQ-F7-01: Bump version string

**Requirement:** The `Version:` field in `context:` MUST be updated to match the current production release.

- GIVEN the field reads `Version: v3.0 Consequences (2026-04-26)`
- WHEN we apply the fix
- THEN the field SHALL read `Version: v4.9.1 (2026-06-27)`

#### REQ-F7-02: Fix MCP server count in stack description

**Requirement:** The MCP server count in `context:` MUST match reality.

- GIVEN the config says `.mcp.json 33 servers`
- WHEN we apply the fix
- THEN the server count SHALL read `11 servers` (active root MCPs)

---

## Section 3: Differential Analysis

| File | Type | Added | Modified | Removed |
|------|------|-------|----------|---------|
| Structure_v5.0.md | Markdown | 0 lines | ~20 lines (counts, nesting, numbering, file listing) | 0 |
| README.md | Markdown | 0 | ~8 lines (metric table, tree) | 0 |
| Root AGENTS.md | Markdown | 0 | 1 line (version footer) | 0 |
| Winter AGENTS.md | Markdown | 0 | ~6 lines (SDD path, MCP counts, agent count, script count, date) | 0 |
| GOALS.md | Markdown | 0 | ~6 lines (metric references ×2 sections, date) | 0 |
| CLAUDE.md | Markdown | 0 | ~10 lines (status table, manifest table count cells) | 0 |
| config.yaml | YAML | 0 | 2 lines (version, MCP count) | 0 |

**Schema changes:** None. No YAML keys added/removed, no markdown headings restructured beyond count values.

---

## Section 4: Open Questions

1. **Agent count precision**: The verified count is "~58 definition files." Should we use a precise number (e.g., scan `01_Agents/` recursively and count `.md` files) or keep the approximate `~58`? **Recommendation**: Document as approximate with the scan command documented for future audits.

2. **Ground Truth table inclusion**: Should each doc get a "Verified Ground Truth" section/reference linking to the master table, or should we only fix the numbers inline? **Recommendation**: Add a brief inline note pointing to Structure_v5.0.md as source of truth.

3. **Winter_is_Coming file count ambiguity**: The 8 files that exist — should we verify exactly which 3 are missing and document that, or simply remove the non-existent entries from the listing? **Recommendation**: Remove non-existent entries silently; the archive has the full history.

4. **CLAUDE.md JARVIS section counts**: Section 4 lists HUB/script counts for the manifest. Should these reference the HUB directory's actual output of `20_System_Mapper_Hub.py --scan`, or should we hardcode verified counts? **Recommendation**: Hardcode verified counts with a note to run `--scan` for live audit.

5. **GOALS.md "Core Stack" references**: The `## 6. Technology Stack` section (lines 155-163) repeats counts that are part of an ongoing narrative. Should we update all of them, or only the explicitly metric-table references? **Recommendation**: Update all for consistency, but flag the strategic context section as "dynamic — may drift" if preferred.

6. **MCP backup count ambiguity**: The verified count says "4 JSON files" in `03_Mcp/`. Winter AGENTS.md Section 6 lists 36 MCP servers. Are those 36 the ACTIVE total (root + OpenCode combined) while the backup refers only to `03_Mcp/`? Clarify in the fix to avoid future confusion.
