# Tasks: Fix Stale Documentation Counts

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 25–45 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | All 7 file edits + verify | PR 1 | Single atomic PR — all edits are independent, no cross-file dependencies |

## Phase 1: Ley Framework Update ✅

- [x] 1.1 **CLAUDE.md** — Update Ley #8: append exception clause permitting factual data corrections in active documentation (narrow scope: numbers/disk counts, not architecture, or history)
  - Post-verify: line 206 also updated from 63→74 (additional stale count found during verify)

## Phase 2: Count Sweep (6 Files) ✅

- [x] 2.1 **README.md** — Lines 41–42: change `63` → `74` (agents), `392` → `396` (skills)
- [x] 2.2 **00_Winter_is_Coming/AGENTS.md** — Replace 6+ stale agent/skill/area count references (verify which: 61/62/63 agent, 392 skill, etc.) with 74/396/15
- [x] 2.3 **00_Winter_is_Coming/OS_DIRECTORY.md** — Replace 8+ stale count references across tables and sections with verified values
- [x] 2.4 **Structure_v5.0.md** — Line 160: `63` → `74` (agentes); any other stale counts found
- [x] 2.5 **01_Personal_Os/01_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md** — Footer line ~231: `392` → `396` (skills)
- [x] 2.6 **01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/03_Agent_Catalog.yaml** — Line 11: source `63` → `74` (agents)

## Phase 3: claude-seo-ai Documentation ✅

- [x] 3.1 **00_Winter_is_Coming/AGENTS.md** — Add claude-seo-ai entry in Slash Commands / MCP section
- [x] 3.2 **00_Winter_is_Coming/OS_DIRECTORY.md** — Add claude-seo-ai entry in Global Skills section
- [x] 3.3 **Structure_v5.0.md** — Add claude-seo-ai to available tools listing

## Phase 4: Verification ✅

- [x] 4.1 **Grep sweep** — Search all active docs for stale patterns (`61 `, `62 `, `63 ` near agent context; `392 ` near skill context) to confirm zero remaining
- [x] 4.2 **Grep sweep** — Confirm claude-seo-ai mentioned in all 3 target files (AGENTS.md, OS_DIRECTORY.md, Structure_v5.0.md)
- [x] 4.3 **Grep sweep** — Confirm historical/changelog entries were NOT modified (search for old values in CHANGELOG sections, ensure they remain)
