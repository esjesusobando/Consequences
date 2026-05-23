# Learning URL to Knowledge - Technical Reference

## Pipeline Implementation

### Phase 1: Content Fetching

**Tool Selection**:
| URL Type  | Tool          | Command                      |
|----------|--------------|-----------------------------|
| YouTube   | Transcript API| `yt-dlp --write-auto-sub`    |
| Web Docs  | Firecrawl     | `firecrawl_scrape`           |
| GitHub    | GitHub API    | `gh api repos/{owner}/{repo}`|
| General   | WebFetch Exa  | `web_fetch_exa`              |

### Phase 2: Content Extraction

**Extraction Workflow**:
```javascript
// 1. Fetch raw content
const raw = await firecrawl_scrape({url: inputURL});

// 2. Clean and structure
const cleaned = cleanContent(raw.content);

// 3. Extract metadata
const metadata = extractMetadata(raw, inputURL);

// 4. Identify key components
const components = identifyComponents(cleaned);
```

### Phase 3: Deliverable Generation

**Parallel Generation Strategy**:
```
Deliverable 1 (Resumen) ──┐
Deliverable 2 (Prompts) ───┼──► Parallel generation
Deliverable 3 (Demos) ─────┼
...                        │
Deliverable 8 (Ing. Inversa) ┘
```

**Sequential for Dependencies**:
```
Resumen → Prompts (depends on themes)
Demos → Herramientas (extracted from demos)
Insights → Mega Prompt (synthesized insights)
```

### Phase 4: Engram Integration

**Topic Key Assignment**:
| Deliverable  | Topic Key Pattern            |
|-------------|-----------------------------|
| Resumen      | `learning/{topic}/resumen`   |
| Prompts      | `learning/{topic}/prompts`   |
| Demos        | `learning/{topic}/demos`     |
| Herramientas | `learning/{topic}/tools`     |
| Insights     | `learning/{topic}/insights`  |
| Posts        | `learning/{topic}/social`    |
| Mega Prompt  | `learning/{topic}/megaprompt`|
| Ing. Inversa | `learning/{topic}/reverse`   |

**Save Pattern**:
```javascript
mem_save({
  title: "Learning: {topic}",
  type: "discovery",
  scope: "project",
  topic_key: "learning/{topic}",
  capture_prompt: false,
  content: {
    what: "Learned {specific}",
    why: "From {source}",
    where: "{output files}",
    learned: "{gotchas if any}"
  }
});
```

---

## YouTube Processing Specifics

### Transcript Extraction
```bash
# Using yt-dlp
yt-dlp --write-auto-sub --sub-lang es,en --output "{output}" "{url}"

# Output formats
# - .vtt (WebVTT)
# - .srv1 (YouTube JSON)
# - .srv2 (YouTube JSON alternative)
```

### Video Analysis Template
```markdown
# Video Analysis - [Title]

## Metadata
- URL: {url}
- Duration: {minutes}
- Platform: YouTube
- Date: {upload_date}

## Content Structure
- [Section 1]: {timestamp}
- [Section 2]: {timestamp}

## Key Moments
- {timestamp}: {description}
- {timestamp}: {description}

## Extracted Prompts
- [Prompt 1]
- [Prompt 2]

## Tools Mentioned
- [Tool 1]
- [Tool 2]
```

---

## Quality Checklist

Before marking learning as complete:

- [ ] Content fetched successfully
- [ ] All 8 deliverables generated
- [ ] Resumen is ~500 words in ES and EN
- [ ] Prompts cover all 7 agent profiles
- [ ] Demos are step-by-step with code
- [ ] Tools have proper links and alternatives
- [ ] Insights connect to 06_Unicorn structure
- [ ] Social posts adapted for each platform
- [ ] Mega prompt is reusable
- [ ] Reverse engineering explains how built
- [ ] OS improvements identified
- [ ] All saved to Engram with proper topic keys
- [ ] Output saved to correct folder structure

---

*Last updated: 2026-05-15*
