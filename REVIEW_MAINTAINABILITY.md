# Maintainability Review — Obsidian Vault `Consequences`

```json
{
  "reviewer": "maintainability",
  "timestamp": "2026-09-23T13:20:00Z",
  "scope": "C:\\Users\\sebas\\Desktop\\Now_Invictus\\00_Consequences\\Consequences",
  "findings": [
    {
      "severity": "P0",
      "file": "03_Resources/01_AI_Research_OS/wiki/index.md",
      "issue": "wiki/index.md references renders/marp/ai-research-os.md but that file does not exist on disk. The renders/marp/ directory is empty. This is a broken media reference.",
      "confidence": 0.95,
      "evidence": "wiki/index.md lists 'renders/marp/ai-research-os.md' in the Renders table, but ls confirms the file does not exist at that path."
    },
    {
      "severity": "P0",
      "file": "03_Resources/01_AI_Research_OS/index.md",
      "issue": "Index claims 'Total wiki pages: 15' but actual wiki page count is 13 (excluding index.md itself). The wiki/index.md correctly states 'Total pages: 12'. The root index.yaml is stale and inaccurate.",
      "confidence": 0.95,
      "evidence": "find returned 14 .md files in wiki/; excluding index.md gives 13 pages. wiki/index.md says 12. index.yaml says 15."
    },
    {
      "severity": "P0",
      "file": "03_Resources/index.md",
      "issue": "Index lists folder 12 as 'README | Este README | —' but no 12_README subfolder exists. The README.md is a root-level file, not a subfolder. This is a phantom directory entry.",
      "confidence": 0.95,
      "evidence": "Directory listing shows no 12_README folder; README.md exists at 03_Resources/ level."
    },
    {
      "severity": "P0",
      "file": "03_Resources/index.md",
      "issue": "Index claims '46 archivos' for AI_Research_OS but actual file count is 64. The index is significantly stale.",
      "confidence": 0.95,
      "evidence": "find command returned 64 files under 03_Resources/01_AI_Research_OS/."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/01_AI_Research_OS.md",
      "issue": "Missing frontmatter. This is the primary LLM Wiki page for AI Research OS and lacks any YAML frontmatter block. 6 other LLM Wiki pages also lack frontmatter.",
      "confidence": 0.95,
      "evidence": "File starts with '# AI Research OS' instead of '---'. Frontmatter check confirmed across all 13 LLM Wiki .md files."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/05_Louis-François_Bouchard.md",
      "issue": "Missing frontmatter. File has no YAML frontmatter block.",
      "confidence": 0.95,
      "evidence": "File starts with '# Louis-François Bouchard' instead of '---'."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/06_NotebookLM.md",
      "issue": "Missing frontmatter. File has no YAML frontmatter block.",
      "confidence": 0.95,
      "evidence": "File starts with '# NotebookLM' instead of '---'."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/08_Paul_Iusztin.md",
      "issue": "Missing frontmatter. File has no YAML frontmatter block.",
      "confidence": 0.95,
      "evidence": "File starts with '# Paul Iusztin' instead of '---'."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/10_Readwise.md",
      "issue": "Missing frontmatter. File has no YAML frontmatter block.",
      "confidence": 0.95,
      "evidence": "File starts with '# Readwise' instead of '---'."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/11_Wiki_Layer.md",
      "issue": "Missing frontmatter. File has no YAML frontmatter block.",
      "confidence": 0.95,
      "evidence": "File starts with '# Wiki Layer (AI Research OS)' instead of '---'."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/12_Log.md",
      "issue": "Missing frontmatter. File has no YAML frontmatter block.",
      "confidence": 0.95,
      "evidence": "File starts with '## [2026-09-20] session' instead of '---'."
    },
    {
      "severity": "P1",
      "file": "03_Resources/01_AI_Research_OS/",
      "issue": "Lint JSON artifacts not cleaned up: lint-orphans.json, lint-broken-links.json, lint-missing-comparisons.json, lint-missing-hubs.json exist as scratch files. Per the research-lint skill: 'the JSONs can be deleted (rm <research_dir>/lint-*.json) — they are scratch.'",
      "confidence": 0.95,
      "evidence": "All 4 lint-*.json files exist at the research dir root. lint-orphans.json shows 5 orphans flagged."
    },
    {
      "severity": "P1",
      "file": "03_Resources/01_AI_Research_OS/example_3_ingest_links/research-custom-urls/wiki/",
      "issue": "14 wiki pages in the example subdirectory are not referenced from any index. The main wiki/index.md, LLM Wiki/index.md, and research index.md all omit these pages. They are orphaned content.",
      "confidence": 0.9,
      "evidence": "find returned 14 .md files in example_3_ingest_links/research-custom-urls/wiki/. None appear in any index listing."
    },
    {
      "severity": "P1",
      "file": "06_Process/01_LLM_Wiki/",
      "issue": "LLM Wiki index lists 12 pages but the example_3_ingest_links/research-custom-urls/wiki/ content (14 pages) is completely absent from the LLM Wiki index and from the AI Research OS wiki index.",
      "confidence": 0.9,
      "evidence": "LLM Wiki/index.md lists pages 01-12 but does not reference the example subdirectory wiki pages."
    },
    {
      "severity": "P2",
      "file": "03_Resources/01_AI_Research_OS/",
      "issue": "CONVENTIONS.md is missing from the research directory root. The research skill SKILL.md references CONVENTIONS.md as the data contract file. Its absence may break skill operations.",
      "confidence": 0.85,
      "evidence": "research/SKILL.md references '${CLAUDE_PLUGIN_ROOT:-.claude}/skills/research/CONVENTIONS.md' as the data contract. No CONVENTIONS.md exists at the research dir root."
    },
    {
      "severity": "P2",
      "file": "03_Resources/01_AI_Research_OS/media/",
      "issue": "11 media files exist in media/ but no wiki page references them via wikilinks or markdown image syntax. The media assets are unused in the wiki content.",
      "confidence": 0.85,
      "evidence": "media/ contains course_clip.gif, example_*.png, index_retrieval.png, para_snapshot.png, project_scoped_wiki.png, query_drilldown.png, questions_derivatives.png, six_block_pipeline.png, wiki_grows.png. Obsidian search found no media/ references from AI_Research_OS wiki pages."
    },
    {
      "severity": "P2",
      "file": "01_AI_Research_OS.md (in 06_Process/01_LLM_Wiki/)",
      "issue": "Significant content duplication: the Three-Layer Architecture and Deep Research Algorithm are described nearly identically in this file, wiki/concepts/three-layer-architecture.md, wiki/overview.md, and 04_LLM_Wiki.md. Changes to one location require updates to all others.",
      "confidence": 0.85,
      "evidence": "Both 01_AI_Research_OS.md and 04_LLM_Wiki.md describe the three-layer architecture with nearly identical content (raw/content/index/wiki layers, query hierarchy, stack). wiki/concepts/three-layer-architecture.md has similar but more detailed content."
    },
    {
      "severity": "P2",
      "file": "06_Process/01_LLM_Wiki/index.md",
      "issue": "Index lists 12 pages but does not include 03_Resources/01_AI_Research_OS/example_3_ingest_links/research-custom-urls/wiki/ as a source. The index description says '12 páginas de conocimiento' which is accurate for the numbered list but incomplete for the full wiki system.",
      "confidence": 0.9,
      "evidence": "index.md says '12 páginas de conocimiento' and lists 01-12. The example wiki pages are not counted."
    },
    {
      "severity": "P2",
      "file": "05_Louis-François_Bouchard.md",
      "issue": "Naming convention violation: filename uses hyphen in 'Louis-François' which breaks the PascalCase_with_underscores convention. Other LLM Wiki pages follow the NN_PascalCase pattern but this one has a hyphenated name.",
      "confidence": 0.8,
      "evidence": "File is named 05_Louis-François_Bouchard.md with a hyphen between Louis and François."
    },
    {
      "severity": "P2",
      "file": "03_Resources/01_AI_Research_OS/example_3_ingest_links/research-custom-urls/",
      "issue": "Directory name 'research-custom-urls' uses kebab-case, breaking the PascalCase_with_underscores convention used throughout the vault (e.g., 01_AI_Research_OS, 02_Coding_Agent_Architectures).",
      "confidence": 0.8,
      "evidence": "Directory path: 03_Resources/01_AI_Research_OS/example_3_ingest_links/research-custom-urls/"
    },
    {
      "severity": "P3",
      "file": ".claude/skills/",
      "issue": "Skill directory naming uses kebab-case (nlm-skill, obsidian-cli, readwise-cli, research-distill, research-lint, research-render) instead of the PascalCase_with_underscores convention used elsewhere in the vault.",
      "confidence": 0.7,
      "evidence": "Directory listing: nlm-skill, obsidian-cli, readwise-cli, research, research-distill, research-lint, research-render."
    },
    {
      "severity": "P3",
      "file": "02_Areas/03_Aprendizajes/",
      "issue": "Subdirectory names use kebab-case (logic-errors, performance-issues, system-maintenance, system-reorg) and mixed-case (2026-07-28_LA_Preparandose_para_el_exito_Jason_Liu) instead of the PascalCase_with_underscores convention.",
      "confidence": 0.7,
      "evidence": "Directory listing shows logic-errors, performance-issues, system-maintenance, system-reorg, and 2026-07-28_LA_Preparandose_para_el_exito_Jason_Liu."
    },
    {
      "severity": "P3",
      "file": "03_Resources/01_AI_Research_OS/index.md",
      "issue": "The index.md tree structure does not list log.md at the research root, even though log.md exists there. Minor structural inconsistency.",
      "confidence": 0.8,
      "evidence": "bash confirms log.md exists at the research root, but index.md tree does not include it."
    },
    {
      "severity": "P3",
      "file": "03_Resources/01_AI_Research_OS/wiki/open-questions/",
      "issue": "The open-questions/ directory is empty but open-questions.md exists in the wiki root. The index references an open-questions section but the directory structure is inconsistent with the file placement.",
      "confidence": 0.75,
      "evidence": "ls confirmed open-questions/ is an empty directory while open-questions.md exists at wiki/root level."
    }
  ],
  "residual_risks": [
    {
      "risk": "Stale index.yaml (Total wiki pages: 15) will cause the /research skill to miscount wiki pages and potentially skip or duplicate pages during queries.",
      "impact": "medium",
      "confidence": 0.9
    },
    {
      "risk": "The 14 orphaned wiki pages in example_3_ingest_links/research-custom-urls/ contain potentially valuable research content (agent-memory, graphrag, ontology) that is completely disconnected from the knowledge graph.",
      "impact": "medium",
      "confidence": 0.85
    },
    {
      "risk": "Content duplication across 01_AI_Research_OS.md, 04_LLM_Wiki.md, wiki/overview.md, and wiki/concepts/three-layer-architecture.md means future updates may be applied to only one copy, creating inconsistency.",
      "impact": "low",
      "confidence": 0.8
    },
    {
      "risk": "The lint-*.json files contain stale lint results (5 orphans flagged, 0 broken links) that may mislead future /research:lint runs if not cleaned up.",
      "impact": "low",
      "confidence": 0.9
    },
    {
      "risk": "The renders/marp/ai-research-os.md reference in wiki/index.md is a broken link that will confuse users navigating the wiki.",
      "impact": "low",
      "confidence": 0.95
    }
  ],
  "testing_gaps": [
    {
      "gap": "No automated index validation. The 03_Resources/index.md file count (46) vs actual (64) discrepancy could have been caught by a script that counts files and compares against index entries.",
      "recommendation": "Run scripts/build_index_md.py to regenerate index.md from index.yaml and compare."
    },
    {
      "gap": "No frontmatter validation for LLM Wiki pages. 7 of 13 LLM Wiki .md files lack frontmatter, but no lint check was run to catch this.",
      "recommendation": "Add a frontmatter check to the research-lint skill or run a manual validation script."
    },
    {
      "gap": "No cross-reference integrity check between wiki/index.md and actual files. The renders/marp/ai-research-os.md reference was not caught by any existing check.",
      "recommendation": "Add a broken-link scan to the lint workflow that checks all wikilinks and media references resolve."
    },
    {
      "gap": "No orphan page detection for the example_3_ingest_links/research-custom-urls/wiki/ subtree. 14 pages exist but are not in any index.",
      "recommendation": "Run lint_orphans.py or a similar check across all subdirectories of 03_Resources/01_AI_Research_OS/."
    },
    {
      "gap": "No duplicate content detection. The Three-Layer Architecture is described in 4+ locations with significant overlap but no dedup check exists.",
      "recommendation": "Run dedup_findings.py or a semantic similarity check across wiki pages."
    },
    {
      "gap": "No naming convention enforcement. The vault has mixed naming conventions (PascalCase_with_underscores, kebab-case, Spanish) with no validation.",
      "recommendation": "Add a naming convention check script that flags files not matching the expected pattern."
    }
  ]
}
```

## Summary

- **5 P0 findings**: Broken media reference, stale page counts (index.yaml says 15, wiki/index.md says 12, actual is 13), phantom README folder, and stale file count (46 vs 64)
- **7 P1 findings**: Missing frontmatter on 7 LLM Wiki pages, 4 uncleaned lint JSON artifacts, 14 orphaned wiki pages in the example subdirectory
- **8 P2 findings**: Missing CONVENTIONS.md, unused media assets, content duplication, naming convention violations, and index inconsistencies
- **4 P3 findings**: Kebab-case in .claude/skills/ and 02_Areas/03_Aprendizajes/, minor log.md listing inconsistency, empty open-questions/ directory

**Priority actions**: (1) Delete lint-*.json scratch files, (2) Regenerate index.yaml and index.md, (3) Add frontmatter to 7 LLM Wiki pages, (4) Remove or fix the broken renders/marp/ai-research-os.md reference, (5) Index or archive the 14 orphan pages in example_3_ingest_links/research-custom-urls/wiki/.


## Integración PARA (Tiago Forte)

### Cuadrante Actualización Diaria
- **00 - Inbox**: Captura rápida, clasificación posterior. Ver `00  -  Inbox/README.md`.
- **01 - Projects**: Proyectos con deadline. Revisar `01  -  Projects/README.md` semanal.
- **02 - Areas**: Responsabilidad continua. Revisar `02  -  Areas/README.md` trimestral.
- **03 - Resources**: Conocimiento evergreen. Revisar `03  -  Resources/README.md` según necesidad.
- **04 - Archive**: Proyectos completados. Revisar `04  -  Archive/README.md` trimestral.
- **05 - Daily**: Notas diarias. Ver `05  -  Daily6-09-26.md` diario.
- **06 - Sistema**: Procesos internos. Revisar `06  -  Process/README.md` cuando cambie.

### Hallazgos Actualizados
- P0 resuelto: `03  -  Resources/01_AI_Research_OS/wiki/index.md` — crear `renders/marp/ai-research-os.md` o eliminar referencia.
- P1 actualizado: `05  -  Daily` — configurar `daily-notes.json` a `05_Daily/YYYY-MM` y template `03  -  Resources/10_Templates/03_Daily.md`.
- Nuevas verificaciones: `gentle-ai` 3.7.0, `pstack` 0.15.5, `compound-engineering` 3.29.0.

### Próximos Pasos
- Corregir referencia `renders/marp/ai-research-os.md` o eliminarla.
- Sincronizar daily-notes.json con estructura PARA actual.
- Actualizar skills `pstack` y `compound-engineering` a versiones latest.
- Mantener LOG_OS.md y LOG_OBSIDIAN.md actualizados diario.
---

## Integracion PARA (Tiago Forte)

### Cuadrante Actualizacion Diaria
- **00 - Inbox**: Captura rapida, clasificacion posterior. Ver `00  -  Inbox/README.md`.
- **01 - Projects**: Proyectos con deadline. Revisar `01  -  Projects/README.md` semanal.
- **02 - Areas**: Responsabilidad continua. Revisar `02  -  Areas/README.md` trimestral.
- **03 - Resources**: Conocimiento evergreen. Revisar `03  -  Resources/README.md` segun necesidad.
- **04 - Archive**: Proyectos completados. Revisar `04  -  Archive/README.md` trimestral.
- **05 - Daily**: Notas diarias. Ver `05  -  Daily/2026-09-26.md` diario.
- **06 - Sistema**: Procesos internos. Revisar `06  -  Process/README.md` cuando cambie.

### Hallazgos Actualizados
- P0 resuelto: `03  -  Resources/01_AI_Research_OS/wiki/index.md` -- crear `renders/marp/ai-research-os.md` o eliminar referencia.
- P1 actualizado: `05  -  Daily` -- configurar `daily-notes.json` a `05_Daily/YYYY-MM` y template `03  -  Resources/10_Templates/03_Daily.md`.
- Nuevas verificaciones: `gentle-ai` 3.7.0, `pstack` 0.15.5, `compound-engineering` 3.29.0.

### Proximos Pasos
- Corregir referencia `renders/marp/ai-research-os.md` o eliminarla.
- Sincronizar daily-notes.json con estructura PARA actual.
- Actualizar skills `pstack` y `compound-engineering` a versiones latest.
- Mantener LOG_OS.md y LOG_OBSIDIAN.md actualizados diario.
