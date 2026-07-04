---
name: content-generation
description: Generate written content (blog posts, emails, social media) in the user's authentic voice. Invoke for any writing, marketing, or content task.
argument-hint: "[tema o tipo de contenido — ej: post sobre AI para LinkedIn]"
tags: [content, writing, voice, blog, email, social]
area: "01 Creación de Contenidos"
version: 1.0
---

# Content Generation

Generate written content that sounds like the user, not generic AI.

> ⚠️ **This is a workflow skill.** The full playbook lives in:
> `01_Personal_Os/00_Core/00_Workflows/01_Personal_Os/03_Content_Generation.md`
> — load that file and follow its steps.

## When to Activate

| Trigger                                   | Ejemplo                                |
|------------------------------------------|---------------------------------------|
| Escribir blog post / artículo             | "Escribí un post sobre..."             |
| Draft de email / outreach                 | "Redactá un email para..."             |
| Post para redes sociales                  | "Necesito un post de LinkedIn sobre..."|
| Contenido marketing                       | "Escribí copy para la landing de..."   |
| Categoría `content`, `writing`, `outreach`| Cualquier skill que rutee aquí         |

## Inputs Required

- **What to write**: Content type and topic
- **Audience**: Who is this for?
- **Goal**: What action or response do we want?

## Workflow

### 1. Load the Playbook
```yaml
file: 01_Personal_Os/00_Core/00_Workflows/01_Personal_Os/03_Content_Generation.md
action: follow each step sequentially
```

### 2. Check for Voice Samples
```yaml
path: <project-root>/Knowledge/voice-samples/
if exists: read 2-3 samples to learn user's voice
if missing: ask user to provide samples or describe preferred tone
```

### 3. Check for Voice Guide
```yaml
path: <project-root>/Knowledge/voice-guide.md
if exists: read and apply patterns
if missing: extract from samples or use defaults
```

### 4. Gather Context
Depends on content type:
- **Blog post**: `02_Knowledge/` docs + `GOALS.md`
- **Email**: Task file + recipient context
- **Social**: Recent posts + themes in GOALS.md

### 5. Draft Content
Apply the voice principles from the workflow. Avoid cliché AI phrases.

### 6. Present & Iterate
Show draft with adjustment options (tone, length, structure).

## Success Criteria

- [ ] Content matches user's voice (if samples available)
- [ ] Appropriate length for the format
- [ ] Clear call-to-action or next step
- [ ] No cliched AI phrases
- [ ] User approves or requests specific edits

## Related

- **Workflow full playbook**: `01_Personal_Os/00_Core/00_Workflows/01_Personal_Os/03_Content_Generation.md`
- **Voice training**: `<project-root>/Knowledge/voice-samples/` + `<project-root>/Knowledge/voice-guide.md`
- **Related skills**: Brand Voice, Content Transformer, Marketing Strategy
