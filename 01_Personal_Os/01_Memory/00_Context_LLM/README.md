# 00_Context_LLM — LLM Memory & Persistent Context v5.0

> **Version:** v5.0 SOTA
> **Last updated:** 2026-07-03 — Directory sync, path audit

---

## Description

Memory and context system for LLMs. Stores system state, process notes, knowledge brain, memory mapping, model evals, and telemetry.

---

## Directory Structure

```
00_Context_LLM/
├── 00_Context_Memory/       # System context memory files
├── 01_Process_Notes/        # Session process notes (NP_*.md)
├── 02_Knowledge_Brain/      # Knowledge brain (inventory, docs)
├── 03_Memory_Brain/         # Persistent memory brain
├── 04_Docs/                 # System documentation
├── 05_Plans/                # Active and archived plans
├── 06_Solutions/            # Documented solutions (compound)
├── 07_Auditorias/           # Audit reports
├── 08_Model_Evals/          # Model evaluations, routing, SOTA
├── 09_Reports/              # Generated reports
├── 10_Telemetry/            # System telemetry
├── 11_Scripts/              # Auxiliary scripts
└── 12_Resources/            # Additional resources
---

## Memory Process

| Step   | Action                     | Tool                             |
|--------|----------------------------|----------------------------------|
| 1      | Load context on start      | `engram_mem_context()`           |
| 2      | Save key decisions         | `mem_save()`                     |
| 3      | Save session on close      | `engram_mem_session_summary()`   |
| 4      | Keep notes updated         | `01_Process_Notes/`              |

---

## Related

- **Engram MCP:** Persistent memory system
- **Process Notes:** Saved sessions in `01_Process_Notes/`
- **Model Evals:** Evaluation data in `08_Model_Evals/`
- **Telemetry:** System metrics in `10_Telemetry/`

---

*Personal OS v5.0 SOTA — Path audit 2026-07-03 — 84/84 paths OK*
