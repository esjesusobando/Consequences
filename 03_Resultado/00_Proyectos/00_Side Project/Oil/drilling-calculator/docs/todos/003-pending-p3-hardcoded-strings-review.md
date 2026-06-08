---
status: pending
priority: p3
issue_id: 003
tags: ["code-review", "quality", "localization"]
dependencies: []
---

# Problem Statement

Validation logic in `src/guards/input-guards.ts` contains hardcoded error messages (Spanish). This couples the business logic tightly to a specific locale and makes it harder to support multiple languages or change copy.

# Findings

- `fail("Total Depth debe ser > 0")` pattern used throughout.
- Good use of "Idioma Imperio" (Imperial Language) rule, but technically limiting.

# Proposed Solutions

## Option 1: Translation Keys (i18n)

- Return error codes (e.g., `ERR_TOTAL_DEPTH_INVALID`) and map in UI.
- **Pros**: Clean separation.
- **Cons**: More boilerplate.
- **Effort**: Low.

## Option 2: Externalize Strings

- Move strings to a constant file `src/locales/es.ts`.
- **Pros**: Centralized management.
- **Cons**: Still coupled to string literals.
- **Effort**: Low.

# Recommended Action

Implement Option 2 (Externalize Strings) for cleaner code.

# Technical Details

- Create `src/config/messages.ts`.
- Import messages in guards.

# Acceptance Criteria

- [ ] No hardcoded strings in `guards/`.
- [ ] Messages centralized in one file.

# Work Log

- 2026-02-10: Identified for code cleanliness.
