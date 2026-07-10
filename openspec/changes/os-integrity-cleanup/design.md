# Design: OS Integrity Cleanup

**Change:** `os-integrity-cleanup`
**Phase:** Design
**Previous phase:** Spec (completed)
**Root:** `C:\Users\sebas\Desktop\Think_Different`
**Date:** 2026-07-09

---

## Architecture Overview

Three independent items, executed sequentially:

```
Item 1: --sync-rules flag          → Modify 20_System_Mapper_Hub.py (add ~90 lines)
Item 2: Stale manifest cleanup     → Archive dir + update 5 markdown files (14 occurrences)
Item 3: graphify update            → Single command execution
```

---

## Item 1: `--sync-rules` Flag

### Design Decision: Regex Substitution (NOT Markers)

The spec proposes HTML comment markers (`<!-- SYNC:HUBs -->`). **Design rejects this.** Instead, the script will use regex substitution directly on the table row values.

**Rationale:**
1. **No Core template modification required** — the Core template at `01_Personal_Os/00_Core/01_Rules/12_Audit_OS_Integrity.mdc` stays hand-maintained and unmodified
2. **Proven infrastructure** — the existing `--validate` function (lines 866-899) already parses these exact table rows with regex, proving the format is stable and machine-readable
3. **Self-documenting** — the `| **Metric** | **Value** |` format IS the implicit marker
4. **Composition for complex values** — MCPs needs `f"{claude} (Claude) + {opencode} (OpenCode)"`, which is cleaner with f-string composition than marker substitution

### Manifest-to-Table Mapping

Based on the existing `--validate` parsing code (lines 877-883) and the Core template table (lines 15-24):

| Table Row | Manifest Path | Regex Pattern | Value Template |
|-----------|---------------|---------------|----------------|
| **HUBs** | `totals.hubs` | `\| \*\*HUBs\*\* \| \*\*(\d+)\*\*` | `**{val}**` |
| **Scripts** | `hubs.scripts_totales` | `\| \*\*Scripts\*\* \| \*\*(\d+).*\*\*` | `**{val}** ({val} = {val_hubs_root} HUBs root + {val_sub} en subdirectorios funcionales)` |
| **Skills** | `totals.skills` | `\| \*\*Skills\*\* \| \*\*(\d+).*\*\*` | `**{val}** ({totals.skill_areas} áreas funcionales)` |
| **MCPs** | `totals.mcps_claude` + `totals.mcps_opencode` | `\| \*\*MCPs\*\* \| \*\*(.+?)\*\*` | `**{claude} (Claude) + {opencode} (OpenCode)**` |
| **Agentes source** | `totals.agents_source` | `\| \*\*Agentes source\*\* \| \*\*(\d+)\*\*` | `**{val}**` |
| **Workflows** | `totals.workflows` | `\| \*\*Workflows\*\* \| \*\*(\d+).*\*\*` | `**{val}** ({totals.workflow_categories} categorías)` |
| **Hooks** | `totals.hooks` | `\| \*\*Hooks\*\* \| \*\*(\d+).*\*\*` | `**{val}** ({totals.hook_phases} fases)` |
| **Rules (.mdc)** | `totals.rules` | `\| \*\*Rules \(\.mdc\)\*\* \| \*\*(\d+)\*\*` | `**{val}**` |

### Function: `sync_rules()`

**Location:** New function in `20_System_Mapper_Hub.py`, placed after `validate()` (after line 902) and before the `# REPORT` section.

**Pseudocode:**

```python
def sync_rules() -> int:
    """Genera la copia .agent del audit rule desde el Core template + manifest."""
    
    # 1. Paths
    core_template = REPO_ROOT / "01_Personal_Os" / "00_Core" / "01_Rules" / "12_Audit_OS_Integrity.mdc"
    inv_file = MANIFEST_DIR / "01_OS_Inventory.json"
    agent_rules_dir = Path.home() / ".agent" / "00_Rules"
    claude_rules_dir = REPO_ROOT / ".claude" / "02_Rules"
    
    # 2. Validate inputs
    if not core_template.exists():
        print("❌ Core template no encontrado")
        return 1
    if not inv_file.exists():
        print("❌ Manifest no existe — correr --scan primero")
        return 1
    
    # 3. Read inputs
    template = core_template.read_text(encoding="utf-8")
    inventory = json.loads(inv_file.read_text(encoding="utf-8"))
    totals = inventory["totals"]
    hubs = inventory["hubs"]
    
    # 4. Build substitution map
    today = datetime.now().strftime("%Y-%m-%d")
    date_suffix = f" {today} ✅"
    
    substitutions = [
        # (regex_pattern, replacement_value)
        (r'(\|\s*\*\*HUBs\*\*\s*\|\s*\*\*)\d+(\*\*)',
         rf'\g<1>{totals["hubs"]}\g<2>{date_suffix} |'),
        
        (r'(\|\s*\*\*Scripts\*\*\s*\|\s*\*\*)\d+(\s*\(.*?\)\s*\*\*)',
         rf'\g<1>{hubs["scripts_totales"]}\g<2>{date_suffix} |'),
        
        (r'(\|\s*\*\*Skills\*\*\s*\|\s*\*\*)\d+(\s*\(.*?\)\s*\*\*)',
         rf'\g<1>{totals["skills"]}\g<2>{date_suffix} |'),
        
        (r'(\|\s*\*\*MCPs\*\*\s*\|\s*\*\*)(.+?)(\*\*)',
         rf'\g<1>{totals["mcps_claude"]} (Claude) + {totals["mcps_opencode"]} (OpenCode)\g<3>{date_suffix} |'),
        
        (r'(\|\s*\*\*Agentes source\*\*\s*\|\s*\*\*)\d+(\*\*)',
         rf'\g<1>{totals["agents_source"]}\g<2>{date_suffix} |'),
        
        (r'(\|\s*\*\*Workflows\*\*\s*\|\s*\*\*)\d+(\s*\(.*?\)\s*\*\*)',
         rf'\g<1>{totals["workflows"]}\g<2>{date_suffix} |'),
        
        (r'(\|\s*\*\*Hooks\*\*\s*\|\s*\*\*)\d+(\s*\(.*?\)\s*\*\*)',
         rf'\g<1>{totals["hooks"]}\g<2>{date_suffix} |'),
        
        (r'(\|\s*\*\*Rules \(\.mdc\)\*\*\s*\|\s*\*\*)\d+(\*\*)',
         rf'\g<1>{totals["rules"]}\g<2>{date_suffix} |'),
    ]
    
    # 5. Apply substitutions
    output = template
    for pattern, replacement in substitutions:
        output = re.sub(pattern, replacement, output)
    
    # 6. Inject auto-generated header comment
    #    Prepend a warning comment AFTER the YAML frontmatter (--- block)
    frontmatter_end = output.find("---", output.find("---") + 3) + 3
    header_comment = "\n\n<!-- ⚠️ AUTO-GENERATED by 20_System_Mapper_Hub.py --sync-rules -->\n<!-- Do NOT hand-edit this file. Re-run --sync-rules to regenerate. -->\n"
    output = output[:frontmatter_end] + header_comment + output[frontmatter_end:]
    
    # 7. Write to .agent/00_Rules/
    agent_rules_dir.mkdir(parents=True, exist_ok=True)
    agent_file = agent_rules_dir / "12_Audit_OS_Integrity.mdc"
    agent_file.write_text(output, encoding="utf-8")
    print(f"  ✅ Escrito: {agent_file}")
    
    # 8. Write to .claude/02_Rules/ (if parent dir exists)
    if claude_rules_dir.parent.exists():
        claude_rules_dir.mkdir(parents=True, exist_ok=True)
        claude_file = claude_rules_dir / "12_Audit_OS_Integrity.mdc"
        claude_file.write_text(output, encoding="utf-8")
        print(f"  ✅ Escrito: {claude_file}")
    
    # 9. Verify output
    line_count = len(output.splitlines())
    has_frontmatter = output.startswith("---")
    has_numbers = "Números Canónicos" in output
    has_hallazgos = "Hallazgos Conocidos" in output
    has_protocol = "Protocolo de Cambio" in output
    has_arboles = "Árboles de Directorios Duplicados" in output
    
    print(f"\n  📋 Verificación: {line_count} líneas, frontmatter={'✅' if has_frontmatter else '❌'}, "
          f"números={'✅' if has_numbers else '❌'}, hallazgos={'✅' if has_hallazgos else '❌'}, "
          f"protocolo={'✅' if has_protocol else '❌'}, árboles={'✅' if has_arboles else '❌'}")
    
    if line_count < 70:
        print(f"  ⚠️ WARNING: Solo {line_count} líneas — se esperan >70")
    
    return 0
```

### CLI Integration

**Location:** `main()` function (line 947), modify argparse and dispatch:

```python
# Add to argparse (after --report)
parser.add_argument("--sync-rules", action="store_true", 
                    help="Genera copia .agent del audit rule desde Core template + manifest")

# Add to dispatch (after the validate block)
if args.sync_rules:
    return sync_rules()
```

**Execution order in `main()`:**
1. `--scan` runs first (generates fresh manifest)
2. `--validate` runs after scan
3. `--sync-rules` runs independently (can be called standalone or after --scan)
4. `--report` runs last

### Enhanced `--validate` Drift Detection

Modify the existing `--validate` rules check (lines 852-899) to **suggest `--sync-rules`** when drift is detected between Core and `.agent`:

```python
# After the existing rules validation loop (after line 899)
# Add drift detection between Core and .agent
core_rules = REPO_ROOT / "01_Personal_Os" / "00_Core" / "01_Rules" / "12_Audit_OS_Integrity.mdc"
agent_rules = Path.home() / ".agent" / "00_Rules" / "12_Audit_OS_Integrity.mdc"

if core_rules.exists() and agent_rules.exists():
    core_content = core_rules.read_text(encoding="utf-8")
    agent_content = agent_rules.read_text(encoding="utf-8")
    
    # Quick structural comparison: line count difference
    core_lines = len(core_content.splitlines())
    agent_lines = len(agent_content.splitlines())
    
    if abs(core_lines - agent_lines) > 10:
        print(f"\n  💡 Core tiene {core_lines} líneas, .agent tiene {agent_lines}")
        print(f"     Ejecuta: python 20_System_Mapper_Hub.py --sync-rules")
        errors += 1
```

### What the Generated File Preserves (83 lines)

The `--sync-rules` output preserves ALL sections from the Core template:

1. **YAML frontmatter** (lines 1-3) — `description`, `globs` — copied verbatim
2. **Title + intro** (lines 6-9) — copied verbatim
3. **Números Canónicos table** (lines 13-24) — **values substituted from manifest**, date updated to today
4. **Archivos que Deben Estar Sync** (lines 26-44) — copied verbatim (static prose)
5. **Árboles de Directorios Duplicados** (lines 46-56) — copied verbatim (static prose)
6. **Hallazgos Conocidos** (lines 58-71) — copied verbatim (static prose, 7 preserved findings)
7. **Protocolo de Cambio** (lines 72-79) — copied verbatim (static prose)
8. **Footer** (line 83) — copied verbatim

Only the 8 metric values and their dates change. Everything else is byte-identical to the Core template.

### Static vs Dynamic Values

| Component | Behavior |
|-----------|----------|
| YAML frontmatter | Static — copied verbatim |
| Section headers | Static — copied verbatim |
| Metric VALUES (46, 148, 429, etc.) | **Dynamic** — substituted from manifest |
| Metric dates (2026-07-09 ✅) | **Dynamic** — set to today's date |
| Descriptive text in metric rows | Static — e.g., "(148 = 37 HUBs root + 111 en subdirectorios)" stays as-is because the regex only replaces the leading number |
| Hallazgos Conocidos table | Static — never substituted |
| Protocolo de Cambio | Static — copied verbatim |
| Footer comment | Static — copied verbatim |
| Auto-generated warning | **Dynamic** — injected after frontmatter |

**Key insight on descriptive text**: The regex only targets the leading `\d+` in each metric cell. For rows like `**Scripts** | **148** (148 = 37 HUBs root + 111 en subdirectorios funcionales)`, the full parenthetical stays unchanged. This is **intentional** — the parenthetical is explanatory prose, not a computed value. If a future OS version changes the breakdown, a human updates the Core template directly.

### Verification: `--validate` Drift Check After `--sync-rules`

After running `--sync-rules`, the existing `--validate` will:
1. Read all 3 rules files (Core, .agent, .claude)
2. Parse each metric row
3. Compare claimed values against manifest
4. Report 0 errors if all values match

This is the natural verification loop — no new code needed for verification.

---

## Item 2: Stale Manifest Consolidation

### Design Decision: Archive + Redirect Stub (NOT Symlink)

**Rationale:**
1. **Windows symlink complexity** — symlinks on Windows require admin privileges or Developer Mode; unreliable across machines
2. **Git history** — a redirect README is visible in git history; a symlink may not be tracked properly
3. **Safety** — a human-readable README stub prevents accidental stale reads; a symlink silently redirects

### Step-by-Step

#### Step 1: Archive Stale Files

Move the 7 manifest files + 3 extra files to the archive:

```bash
# Source: 01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/
# Destination: 01_Personal_Os/07_Archive/04_Operations_Backup/01_Stale_Manifest_v4.9/
```

Files to archive:
| Original | Archive Path |
|----------|-------------|
| `01_OS_Inventory.json` | `04_Operations_Backup/01_Stale_Manifest_v4.9/01_OS_Inventory.json` |
| `02_MCP_Registry.yaml` | `04_Operations_Backup/01_Stale_Manifest_v4.9/02_MCP_Registry.yaml` |
| `03_Agent_Catalog.yaml` | `04_Operations_Backup/01_Stale_Manifest_v4.9/03_Agent_Catalog.yaml` |
| `04_Skill_Index.json` | `04_Operations_Backup/01_Stale_Manifest_v4.9/04_Skill_Index.json` |
| `05_HUB_Catalog.yaml` | `04_Operations_Backup/01_Stale_Manifest_v4.9/05_HUB_Catalog.yaml` |
| `06_Workflow_Graph.yaml` | `04_Operations_Backup/01_Stale_Manifest_v4.9/06_Workflow_Graph.yaml` |
| `07_Hook_Registry.yaml` | `04_Operations_Backup/01_Stale_Manifest_v4.9/07_Hook_Registry.yaml` |
| `08_Sync_Log.json` | `04_Operations_Backup/01_Stale_Manifest_v4.9/08_Sync_Log.json` |
| `MCP_SYNC_FIX.md` | `04_Operations_Backup/01_Stale_Manifest_v4.9/MCP_SYNC_FIX.md` |
| `README.md` | `04_Operations_Backup/01_Stale_Manifest_v4.9/README.md` |
| `SKILL_PORTFOLIO_REPORT.md` | `04_Operations_Backup/01_Stale_Manifest_v4.9/SKILL_PORTFOLIO_REPORT.md` |

#### Step 2: Create Redirect Stub

Replace the stale directory contents with a single README redirect:

```markdown
# ⚠️ MANIFEST MOVED

**This manifest is ARCHIVED.** The canonical manifest is now at:

> `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/`

Files archived to: `01_Personal_Os/07_Archive/04_Operations_Backup/01_Stale_Manifest_v4.9/`

Archived: 2026-07-09 | Reason: Consolidation — single source of truth

**Do NOT create new manifest files here.** Use the canonical path above.
```

#### Step 3: Update 5 Documentation Files (14 occurrences)

Replace path in each occurrence. The fresh path is:
`01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/`

| File | Lines | Old → New |
|------|-------|-----------|
| `.agent/CLAUDE.md` | 41, 162, 204, 257 | `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/` → `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/` |
| `.agent/README.md` | 127 | Same replacement |
| `.agent/02_Skills/README.md` | 5, 59, 88 | Same replacement |
| `CLAUDE.md` | 256 | Same replacement |
| `00_Winter_is_Coming/OS_DIRECTORY.md` | 50, 251 | Same replacement |

**Important: Do NOT touch `CLAUDE.md` line 377** — it references `01_Personal_Os/00_Core/02_Tools/00_SDD/` (the parent SDD Registry), NOT the manifest. This is a separate directory with other content (Evolucion_OS_v5.0.md, SDD_SKILLS.md, etc.) and is out of scope.

#### Out-of-Scope Path Check

`C:\Users\sebas\.agent\CLAUDE.md` references `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/` — a DIFFERENT intermediate path. Confirmed out of scope per spec R2.7. This path does not point to the stale `00_Core/` location.

---

## Item 3: graphify Update

### Design: Single Command Execution

No code changes. One-shot command from project root:

```bash
graphify update .
```

**Expected behavior:**
- Scans project AST structure
- Regenerates `02_Playground/Graphify_Out/graph.json`
- Regenerates `02_Playground/Graphify_Out/GRAPH_REPORT.md`
- Exit code 0

**No risk mitigation needed** — graphify is additive, read-only on source files.

---

## Implementation Sequence

```
1. Item 2  — Archive stale manifest, create redirect stub, update 5 files
              (do this FIRST so Item 1's validation doesn't see stale paths)

2. Item 1  — Modify 20_System_Mapper_Hub.py:
              a. Add sync_rules() function after validate()
              b. Add --sync-rules to argparse
              c. Add dispatch in main()
              d. Enhance --validate to suggest --sync-rules on drift
              
3. Item 1 verification — Run --sync-rules, then --validate

4. Item 3  — graphify update .
```

**Why Item 2 before Item 1:** If `--validate` checks for stale manifest paths in the future, having the paths already updated prevents false drift warnings.

---

## Risk Matrix

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Regex substitution produces malformed table | Medium | Low | Regex patterns tested against actual 83-line template; verification section checks line count and section presence |
| `--sync-rules` writes to wrong `.agent` path | High | Very Low | Uses `Path.home() / ".agent"` which is deterministic; `.agent/00_Rules/` is created with `mkdir(parents=True)` |
| Archive directory doesn't exist in `07_Archive/` | Low | Low | `04_Operations_Backup/` already exists per directory listing |
| Missed stale path reference in docs | Medium | Low | Post-apply grep confirms zero remaining matches |
| `.claude/02_Rules/` doesn't exist | None | Expected | Script checks parent exists before writing; skips gracefully |
| MCPs row format changes | Low | Very Low | Regex `(.+?)` matches any content between `**` delimiters |

---

## Files Modified

| File | Change | Lines Affected |
|------|--------|---------------|
| `20_System_Mapper_Hub.py` | Add `sync_rules()` + argparse + dispatch + enhance `--validate` | ~90 new lines after line 902, ~5 lines in argparse block |
| `.agent/CLAUDE.md` | Path update | 41, 162, 204, 257 |
| `.agent/README.md` | Path update | 127 |
| `.agent/02_Skills/README.md` | Path update | 5, 59, 88 |
| `CLAUDE.md` | Path update | 256 |
| `00_Winter_is_Coming/OS_DIRECTORY.md` | Path update | 50, 251 |
| `01_Personal_Os/00_Core/02_Tools/00_SDD/00_Manifest/*` | Archive + replace with README stub | All files in dir |
| `01_Personal_Os/07_Archive/04_Operations_Backup/01_Stale_Manifest_v4.9/` | New archive directory | 11 files moved |

---

*Generated: 2026-07-09 | Phase: Design | Next: sdd-tasks*
