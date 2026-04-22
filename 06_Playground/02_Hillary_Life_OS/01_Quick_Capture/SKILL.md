---
name: quick-capture
description: "Use when you need to capture quick thoughts, tasks, or insights directly to markdown. Trigger: user wants to capture, quick add, record, or write down something."
---

# Quick Capture Skill — Technical Design

> "Simple is better. No ceremony, no complexity. Just capture and move on." — Anti-system philosophy

## Overview

The Quick Capture skill transforms free-form user input into persistent markdown files with YAML frontmatter. It extracts metadata automatically (timestamp, tags, type), generates unique filenames, and writes to the inbox directory. Zero external dependencies — pure file operation.

### Data Flow

```
Input → PARSE(tags) → PROCESS(type,slug) → SAVE(filename,content)
"reunión 3pm [trabajo]" → inbox/2026-03-31-1430-reunion.md
```

| Component     | Responsibility                  | API                                |
|---------------|---------------------------------|------------------------------------|
| Parser        | Extract tags, clean content     | `parse(input): {content, tags}`    |
| Processor     | Detect type, slugify            | `process(parsed): {slug, type}`    |
| Saver         | Generate filename, write file   | `save(processed, content): path`   |

---

## Key Decisions

### 1. Filename Generation

**Pattern**: `inbox/YYYY-MM-DD-HHmm-{slug}.md`

- Lowercase, spaces→hyphens, max 50 chars, fallback "captura"
- Collision → random 4-char suffix: `inbox/2026-03-31-1430-captura-a1b2.md`
- Retry 3x, then UUID fallback

### 2. Tag Parsing

**Format**: `[tag1, tag2]` anywhere in input

```typescript
function extractTags(input: string): string[] {
  const bracketRegex = /\[([^\]]+)\]/g;
  const matches = [...input.matchAll(bracketRegex)];
  const tags = matches.flatMap(m => m[1].split(','));
  return [...new Set(tags.map(t => t.trim().toLowerCase()))];
}
```

| Input                            | Tags                       |
|----------------------------------|----------------------------|
| `"comprar leche [compras]"`      | `["compras"]`              |
| `"reunión [trabajo, reunion]"`   | `["trabajo", "reunion"]`   |
| `"nota sin tags"`                | `[]`                       |

### 3. Type Detection (Two-Phase)

**Phase 1 - Explicit markers**: `insight:`/`idea:`/`nota:` → insight | `recordar:`/`hacer:`/`comprar:` → task

**Phase 2 - Verb fallback**: first word in `comprar|hacer|llamar|enviar|revisar|crear|actualizar|agendar|recordar|terminar` → task

**Default**: insight

### 4. Frontmatter Defaults

```yaml
created: 2026-03-31T14:30:00Z
source: text
type: task
tags: []
```

| Field       | Default     | Source                        |
|-------------|-------------|-------------------------------|
| `created`   | ISO 8601    | System time                   |
| `source`    | `text`      | Input (text/voice/shortcut)   |
| `type`      | `task`      | Content analysis              |
| `tags`      | `[]`        | `[tag]` patterns              |

---

## Gotchas & Edge Cases

- **Empty Input**: `input.trim().length === 0` → error "Captura vacía"
- **Filename Collision**: Random 4-char suffix, retry 3x, UUID fallback
- **YAML Special Chars**: Wrap values in quotes, escape body
- **Long Input (5000+ chars)**: No body truncation, slug capped at 50
- **Unicode/Accents**: Normalize to ASCII, remove emojis, fallback "captura"
- **Concurrent Writes**: Add PID/random suffix as final fallback
- **Nested Brackets `[[tag]]`**: Only single-level `[...]` extracted
- **Empty Tags `[]`, `[ , ]`**: Filter empty strings after comma split
- **Title from Long Input**: Use first line (not full input)
- **Timezone**: Use local time, store as UTC with `Z` suffix
- **Whitespace in Tags `[ tag1 , tag2 ]`**: Trim each tag
- **Duplicate Tags `[Trabajo, TRABAJO]`**: Case-insensitive dedupe
- **Long Tag Names**: Truncate at 30 chars
- **Special Chars in Tags**: Strip non-alphanumeric except hyphen
- **Whitespace-Only After Tag Removal**: error "Captura vacía"
- **Malformed YAML in Input**: Wrap body in `|` block
- **Missing .gitkeep**: Create in inbox on init
- **Permission Denied**: Return clear error
- **Disk Full**: Catch exception, return "Error: disco lleno"
- **Invalid Filename Chars**: Filter `<>:"/\|?*`

---

## File Structure

```
01_Quick_Capture/
├── SKILL.md
├── inbox/
│   └── .gitkeep
└── examples/
    └── sample_capture.md
```

---

## Output Format

```markdown
---
created: 2026-03-31T14:30:00Z
source: text
type: task
tags: ["trabajo", "reunion"]
---

# Reunión con cliente 3pm

reunión con cliente 3pm
```

Rules: Title from first line → slug | Body: original (tags removed) | Blank line | Verbatim

---

## Implementation

| Scenario        | Behavior                 |
|-----------------|--------------------------|
| Inbox missing   | Create automatically     |
| Write denied    | Error, no file           |
| Invalid YAML    | Wrap in code block       |
| Empty input     | Error: "Captura vacía"   |
| File exists     | Retry 3x, then UUID      |
| Disk full       | Error: "disco lleno"     |

**Dependencies**: Zero — pure file ops only. Target: <50ms, <5MB memory.

---

## Changelog

| Date         | Change           |
|--------------|------------------|
| 2026-03-31   | Initial design   |
