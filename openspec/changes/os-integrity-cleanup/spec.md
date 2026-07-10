# Spec: OS Integrity Cleanup

**Change:** `os-integrity-cleanup`
**Phase:** Spec
**Previous phase:** Proposal (completed)
**Root:** `C:\Users\sebas\Desktop\Think_Different`

---

## 1. Requirements

### Item 1: Sync .agent audit rules

**R1.1** — `20_System_Mapper_Hub.py --validate` currently checks 3 rule files exist and validates their canonical numbers against the manifest (lines 852-899):
   - `01_Personal_Os/00_Core/01_Rules/12_Audit_OS_Integrity.mdc` (Core — full format, 83 lines)
   - `.claude/02_Rules/12_Audit_OS_Integrity.mdc`
   - `.agent/00_Rules/12_Audit_OS_Integrity.mdc`

**R1.2** — The `.agent` copy at `C:\Users\sebas\.agent\00_Rules\12_Audit_OS_Integrity.mdc` has only 26 lines — a stripped table missing:
   - The full YAML frontmatter with `globs` — already present ✅
   - 4 canonical metrics: `MCPs`, `Rules`, `Agentes source` → all present but only 6 of 8 source metrics
   - The "Archivos que Deben Estar Sync" section (source-of-truth files list + master docs)
   - The "Árboles de Directorios Duplicados" section
   - The "Hallazgos Conocidos (PRESERVADOS)" section (7 preserved findings)
   - The "Protocolo de Cambio" section (4-step change procedure)

**R1.3** — A `python 20_System_Mapper_Hub.py --sync-rules` command must:
   - Read the Core template at `01_Personal_Os/00_Core/01_Rules/12_Audit_OS_Integrity.mdc`
   - Read the current manifest at `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/01_OS_Inventory.json`
   - Substitute the 8 canonical metrics in the numbers table with current manifest counts
   - Write the full-format file to `.agent/00_Rules/12_Audit_OS_Integrity.mdc` 
   - Also regenerate `.claude/02_Rules/12_Audit_OS_Integrity.mdc` if that path exists
   - Exit 0 on success, non-zero on failure

**R1.4** — The `.agent` file is auto-generated. It must NEVER be hand-edited. Any hand-edits will be overwritten the next time `--sync-rules` runs.

**R1.5** — `--validate` must detect drift between Core and `.agent` and suggest running `--sync-rules` when drift exists, but NOT auto-sync (to maintain explicit control).

### Item 2: Consolidate manifests

**R2.1** — The stale manifest at `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` must be removed (contents archived, replaced with a redirect README stub).

**R2.2** — All files referencing the stale path `00_Core/02_Tools/00_SDD/00_Manifest/` must be updated to point to the fresh canonical path `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/`.

**R2.3** — Files to update (14 occurrences across 5 files in the project root):

| # | File | Lines | Context |
|---|------|-------|---------|
| 1 | `C:\Users\sebas\Desktop\Think_Different\.agent\CLAUDE.md` | 41, 162, 204, 257 | Boot protocol, system architecture, manifest location note |
| 2 | `C:\Users\sebas\Desktop\Think_Different\.agent\README.md` | 127 | Manifests reference |
| 3 | `C:\Users\sebas\Desktop\Think_Different\.agent\02_Skills\README.md` | 5, 59, 88 | Source of truth + manifest commands |
| 4 | `C:\Users\sebas\Desktop\Think_Different\CLAUDE.md` | 256 | Manifest system ASCII tree |
| 5 | `C:\Users\sebas\Desktop\Think_Different\00_Winter_is_Coming\OS_DIRECTORY.md` | 50, 251 | Directory tree table + commands |

**R2.4** — Additionally, `CLAUDE.md` (root) line 377 references `01_Personal_Os/00_Core/02_Tools/00_SDD/` (the parent SDD tools directory, not just the manifest). This is a separate path from the manifest and may need evaluation during design — it references the SDD registry tools location, which may or may not have moved.

**R2.5** — The stale manifest directory contains 7 files (01-07, same structure as the fresh one) generated 2026-06-27 with stale counts (396 skills vs 429 actual, 63 agents vs 68 actual, etc.). Archival must preserve these files for git history but prevent any tool from resolving to them.

**R2.6** — No Python scripts reference the stale path (confirmed via grep). Only markdown documentation files do. Risk of breaking tooling is low.

**R2.7** — The home `.agent/CLAUDE.md` at `C:\Users\sebas\.agent\CLAUDE.md` already references `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/` (a DIFFERENT intermediate path, not the stale `00_Core` path). This is out of scope for this change — it's not pointing to the stale path — but should be reviewed during design in case the `04_Operations/` path also needs redirection to `05_Scripts/`.

### Item 3: Refresh knowledge graph

**R3.1** — `graphify update .` must run from project root and exit 0.

**R3.2** — The graph at `02_Playground/Graphify_Out/` contains data from 2026-06-08 (graph.json) and 2026-06-30 (GRAPH_REPORT.md). It is stale and should be refreshed to reflect current project structure.

**R3.3** — No other graphify operation (query, path, explain) is required. This is purely `update`.

---

## 2. Item 1 Approach Analysis

Three options were evaluated for syncing the .agent audit rule:

### Option A: Extend `20_System_Mapper_Hub.py --sync-rules` ✅ **RECOMMENDED**

| Factor | Assessment |
|--------|------------|
| **Effort** | Medium — add ~80 lines to the existing script |
| **Maintainability** | High — single tool for all OS mapping operations |
| **Integration** | High — script already reads manifest JSON + parses rules in `--validate` (lines 852-899). Same parsing infrastructure can be reused in reverse. |
| **Risk** | Low — new `--sync-rules` flag is additive, doesn't touch `--scan` or `--validate` paths |
| **Auto-detect** | Natural — `--validate` can suggest `--sync-rules` when drift detected |

**How it works:**
1. `--sync-rules` reads the Core mdc as a template
2. Reads `01_OS_Inventory.json` for current canonical counts
3. The template has static marker comments like `<!-- SYNC:HUBs -->` that get replaced with current values
4. Writes the full-format file to `.agent/00_Rules/12_Audit_OS_Integrity.mdc`
5. Substitution approach: since the template IS the Core file, the script copies it verbatim but replaces only the number values in the canonical table — preserving all sections (Hallazgos, Protocolo, etc.)

### Option B: Standalone sync script

| Factor | Assessment |
|--------|------------|
| **Effort** | Medium — create new file (~100 lines) |
| **Maintainability** | Low — another file to maintain alongside the mapper |
| **Integration** | Low — duplicates manifest-reading logic |
| **Risk** | Low — isolated file |
| **Verdict** | Unnecessary delegation. The mapper already has all the infrastructure. |

### Option C: Manual copy + guard

| Factor | Assessment |
|--------|------------|
| **Effort** | Very low — single copy + add check to `--validate` |
| **Maintainability** | Very low — will drift on next OS update |
| **Integration** | N/A |
| **Risk** | High — human forgets to sync |
| **Verdict** | Not acceptable for an integrity system. The whole point is to prevent drift. |

**Decision: Option A.** `--sync-rules` extends the existing tool naturally. The `--validate` section already proves the mapper knows how to parse rules files and cross-reference with the manifest. The reverse operation (read Core template → substitute → write .agent copy) is the logical complement.

---

## 3. Scenarios (GWT)

### Scenario 1.1 — .agent sync rule generates correct format

```
Feature: .agent rule sync
  As an OS integrity system
  I want the --sync-rules flag to generate a full-format .agent rule file
  So that both the Core and .agent copies remain structurally identical

  Scenario: --sync-rules generates full-format file
    Given the Core rule at 01_Personal_Os/00_Core/01_Rules/12_Audit_OS_Integrity.mdc
      And the manifest at 01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/01_OS_Inventory.json has current counts
     When I run "python 20_System_Mapper_Hub.py --sync-rules"
     Then exit code is 0
      And the file at .agent/00_Rules/12_Audit_OS_Integrity.mdc exists
      And it has YAML frontmatter (--- delimiter)
      And it has a "Números Canónicos" table with the same 8 metrics as Core
      And each metric value matches the manifest count from 01_OS_Inventory.json
      And it has the "Archivos que Deben Estar Sync" section
      And it has the "Árboles de Directorios Duplicados" section
      And it has the "Hallazgos Conocidos" section
      And it has the "Protocolo de Cambio" section
      And its total line count is > 70 lines (full format, not the current 26-line stub)
```

### Scenario 1.2 — .agent file is not overwritten incorrectly

```
  Scenario: --sync-rules does not overwrite with wrong content
    Given the manifest has HUBs=46 in 01_OS_Inventory.json
     When I run "python 20_System_Mapper_Hub.py --sync-rules"
     Then the generated .agent file has "**HUBs** | **46**" in the numbers table
      And it does NOT contain stale values from the 2026-06-27 manifest (e.g. HUBs=43)

  Scenario: --validate suggests --sync-rules when drift detected
    Given the .agent file has different canonical numbers than the manifest
     When I run "python 20_System_Mapper_Hub.py --validate"
     Then output contains a message suggesting "run --sync-rules"
      And exit code is non-zero
```

### Scenario 2.1 — Stale manifest path removed, no tooling broken

```
Feature: Manifest consolidation
  As an OS operator
  I want the stale manifest path removed with a redirect stub
  So that no tool or agent can accidentally resolve to old data

  Scenario: Stale manifest directory is archived with redirect
    Given the directory 01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/ exists
     When the consolidation is applied
     Then the original files are moved to an archive location (e.g. 07_Archive/)
      And the directory is replaced with a single README.md stub
      And the README.md stub clearly states the redirect path
      And any README.md in the archived path preserves the original content

  Scenario: No tooling breaks after manifest removal (regression)
    Given no Python scripts reference the stale path (confirmed)
     When the stale path is removed
     Then running "python 20_System_Mapper_Hub.py --validate" still passes (exit 0)
      And running "python 20_System_Mapper_Hub.py --scan" still generates to the fresh path
      And git status shows the stale path as deleted (or moved)
```

### Scenario 2.2 — Manifest consumers resolve to correct path

```
  Scenario: All documentation references point to the fresh path
    Given the stale path is 01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/
      And the fresh path is 01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/
     When all 5 files (14 occurrences) have been updated
     Then "grep -r 00_Core/02_Tools/00_SDD/00_Manifest ." returns zero matches
      And each updated file references 01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/
      And the updated references still read naturally in their documentation context
      And "python 20_System_Mapper_Hub.py --validate" does not flag path drift in docs
```

### Scenario 3.1 — graphify update completes without errors

```
Feature: Knowledge graph refresh
  As an OS operator
  I want the knowledge graph to reflect current project state
  So that graphify queries return accurate results

  Scenario: graphify update runs successfully
    Given graphify is installed and available in PATH
      And the project root is C:\Users\sebas\Desktop\Think_Different
     When I run "graphify update ." from the project root
     Then exit code is 0
      And 02_Playground/Graphify_Out/graph.json is updated (modification date changes)
      And 02_Playground/Graphify_Out/GRAPH_REPORT.md is regenerated
      And the operation completes within 120 seconds
```

---

## 4. Out of Scope

| Item | Reason |
|------|--------|
| **Master doc version sync** (OS_DIRECTORY.md, CLAUDE.md, AGENTS.md, README.md canonical numbers) | Deferred to a dedicated sync change. This change only fixes the .agent rules file format and manifest paths. |
| **Watchdog changes** | No auto-sync daemon or git hook for rules sync. The `--sync-rules` flag remains explicit. |
| **SDD process changes** | This change follows existing SDD workflow. No modifications to the SDD pipeline itself. |
| **Home .agent/CLAUDE.md path update** | The file at `C:\Users\sebas\.agent\CLAUDE.md` references `04_Operations/` not the stale `00_Core/` path. This is a separate concern. |
| **`00_Core/02_Tools/00_SDD/` (SDD Registry) path** | Root CLAUDE.md line 377 references the parent SDD tools directory, not the manifest. Separately scoped. |
| **`.claude/02_Rules/` rule sync** | The `--validate` section also checks `.claude/02_Rules/12_Audit_OS_Integrity.mdc`. If this file exists, `--sync-rules` MAY update it, but the primary target is `.agent/00_Rules/`. |
| **Graphify structural changes** | Only running `graphify update .` — no config changes, no schema migrations. |

---

## 5. Verification Criteria

| Scenario | Verification Method | Expected Result |
|----------|-------------------|-----------------|
| 1.1: --sync-rules generates full format | Run `python 20_System_Mapper_Hub.py --sync-rules` then inspect generated file | File has all 6 sections, YAML frontmatter, 8 metric rows, > 70 lines |
| 1.1: Metrics match manifest | Parse generated file with `--validate` | 0 drift errors between Core, .agent, and manifest |
| 1.2: No incorrect overwrite | Diff generated .agent file against Core template (excluding numbers) | Only number values differ; structure is identical |
| 1.2: Drift detection works | Artificially alter the .agent file; run `--validate` | Non-zero exit + suggestion to run `--sync-rules` |
| 2.1: Stale manifest removed | Check directory existence | `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` no longer contains 01-07 files; has README redirect stub |
| 2.1: No tooling broken | Run `--validate` and `--scan` | Both exit 0 |
| 2.2: All references updated | `grep -r "00_Core/02_Tools/00_SDD/00_Manifest" .` | Zero matches across the repo |
| 2.2: Fresh path referenced | Check each of the 5 updated files | Each contains `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/` |
| 3.1: graphify update succeeds | Run `graphify update .` from root | Exit 0, graph.json mtime updated |

---

## 6. Verification Commands

```bash
# Item 1 verification
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --sync-rules
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --validate
wc -l C:/Users/sebas/.agent/00_Rules/12_Audit_OS_Integrity.mdc
grep -c "Números Canónicos" C:/Users/sebas/.agent/00_Rules/12_Audit_OS_Integrity.mdc

# Item 2 verification
grep -r "00_Core/02_Tools/00_SDD/00_Manifest" C:/Users/sebas/Desktop/Think_Different/
ls -la "01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/"

# Item 3 verification
graphify update .
echo $?
stat -c %Y 02_Playground/Graphify_Out/graph.json
```

---

## 7. Risks

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| `--sync-rules` overwrites a hand-edited .agent file | Very Low | Medium | Script explicitly reads Core as the ONLY template. The .agent file is auto-generated — the README stub and a comment header in the generated file will warn against hand-editing. |
| Stale manifest removal breaks an unindexed script dependency | Very Low | High | Grep confirmed zero Python references to the stale path. Only markdown docs reference it. The archive approach (move + redirect stub) provides a safety net. |
| graphify unavailable or broken | Low | Low | Fall back to manual regeneration note. Graphify is documented as installed in the OS. |
| A stale reference is missed in a .md file edge case (commented code, inline code fences) | Low | Medium | The grep pattern catches inline code and regular text. Escaped or concatenated paths would be extremely unusual in these docs. Post-apply diff review catches any misses. |
| `--sync-rules` drifts further if Core template is later modified without updating the script | Low | Medium | The script substitutes values at marker positions. If Core adds/removes metrics, the marker parsing needs updating — but this is a Core-first change problem, not specific to sync-rules. |

---

*Generated: 2026-07-09 | Phase: Spec | Next: sdd-design*
