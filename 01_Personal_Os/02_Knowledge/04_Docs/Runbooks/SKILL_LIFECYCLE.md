# Skill Lifecycle Runbook — PersonalOS

> **Owner:** Sebastian  
> **Last Updated:** 2026-07-14  
> **Audience:** Anyone creating, modifying, or deprecating skills

---

## Lifecycle Stages

```
Create → Test → Register → Document → Maintain → Deprecate
```

---

## Stage 1: Create

### File Structure

Every skill lives under `01_Personal_Os/02_Tools/02_Skills/` or `~/.config/opencode/skills/`:

```
skill-name/
├── SKILL.md          # Required — skill definition with frontmatter
├── scripts/          # Optional — helper scripts
├── templates/        # Optional — output templates
└── tests/            # Optional — skill-specific tests
```

### Frontmatter Requirements (SKILL.md)

```yaml
---
name: skill-name
description: One-line description of what the skill does
trigger: keywords that activate this skill
version: 1.0.0
author: Sebastian
---
```

### Implementation

1. Write the SKILL.md with clear trigger conditions
2. Keep the skill focused — one concern per skill
3. Follow the project's Python patterns (shebang, encoding, config_paths import)

---

## Stage 2: Test

```bash
# Run the skill's own tests if they exist
python tests/test_skill.py

# If the skill has a --test flag
python skill_script.py --test

# Run the full validator suite to check nothing broke
python certify_10_10.py --verbose
```

---

## Stage 3: Register

```bash
# Run the skill auditor
python 27_Skill_Auditor.py

# Validate frontmatter
python 22_Validate_Skill_Frontmatter.py

# Update the skill registry
python skill_discovery.py
```

---

## Stage 4: Document

- Add entry to `HUB_CATALOG.md` with name, purpose, and trigger
- Add usage example to the skill's own README if complex
- Update `SCRIPTS_INDEX.md` if the skill has helper scripts

---

## Stage 5: Maintain

- Run `python certify_10_10.py --verbose` weekly to catch regressions
- Update version in frontmatter when making changes
- Keep trigger keywords current

---

## Stage 6: Deprecate

1. Add deprecation notice to SKILL.md frontmatter:
   ```yaml
   deprecated: true
   deprecated_date: 2026-07-14
   replaced_by: new-skill-name
   ```
2. Keep the skill files for 30 days (reference period)
3. Remove from `HUB_CATALOG.md` and `SCRIPTS_INDEX.md`
4. Delete the skill directory after the grace period

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Skill not triggering | Check trigger keywords in frontmatter |
| Scripts import fails | Ensure `sys.path.insert(0, ...)` and config_paths import |
| Windows encoding errors | Add UTF-8 wrapper block at top of .py files |
