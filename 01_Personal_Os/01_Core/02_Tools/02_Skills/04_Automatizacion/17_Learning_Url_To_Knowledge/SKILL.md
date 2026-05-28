---
name: learning-url-to-knowledge
description: Transform any URL into 8 structured deliverables using the Learning Always methodology. Use when you have a URL (video, article, documentation) and need to extract knowledge, generate prompts, demos, tools, insights, social posts, mega-prompts, and reverse-engineering analysis. Trigger: /learning-url-to-knowledge [URL]
---

# Learning URL to Knowledge

Transform any URL into 8 structured deliverables using the Learning Always methodology.

---

## Esencia Original

Transforms any URL (video, article, documentation) into 8 structured deliverables using the Learning Always methodology. Covers summary, prompts, demos, tools, insights, social posts, mega-prompt, and reverse engineering. Designed as the primary knowledge ingestion pipeline for the OS.

---

## Quick Start

```
/learning-url-to-knowledge [URL]
```

The skill will:
1. Fetch and extract content from the URL
2. Identify tools, techniques, and patterns
3. Generate all 8 deliverables
4. Store in Engram for future retrieval

---

## The 8 Deliverables

| #  | Deliverable                 | Description                                 |
|---|----------------------------|--------------------------------------------|
| 1  | **Resumen 500 palabras**    | ES + EN summary accessible for Junior level |
| 2  | **Prompts Usados**          | Extracted prompts + 7 agent profiles (ES/EN)|
| 3  | **Demos Junior**            | Step-by-step tutorials with code            |
| 4  | **Herramientas**            | Tools mentioned in the content              |
| 5  | **Insights Learning Always**| For ~/Knowledge and ~/Context               |
| 6  | **Posts Redes**             | Facebook, Instagram, X, LinkedIn            |
| 7  | **Mega Prompt**             | Customized for GEMs/GPTs                    |
| 8  | **Ingeniería Inversa**      | Analysis of how it was built                |

---

## Output Structure

```
03_Resultado/10_Contenido_Learning/
└── 01_LA_[Description]/
    ├── 00_Raw_Content/01_Video_Info.md
    ├── 01_Resumen_500_Palabras/01_Resumen_500_Palabras.md
    ├── 02_Prompts_Usados/{ES.md, EN.md}
    ├── 03_Demos_Junior/*.md
        ├── 04_Herramientas/04_Herramientas.md
        ├── 05_Insights_Segundo_Cerebro/05_Insights.md
        ├── 06_Post_Redes/{Facebook, Instagram, X_Twitter, LinkedIn}.md
        ├── 07_Mega_Prompt/07_Mega_Prompt_Gems_GPTs.md
        ├── 08_Ingenieria_Inversa/08_Ingenieria_Inversa.md
        └── 09_OS_Mejoras/09_OS_Mejoras.md
```

---

## Pipeline Steps

### Step 1: Fetch Content
- Use Firecrawl MCP or web_fetch to extract content
- For YouTube: use transcript extraction
- For docs: scrape with proper headers

### Step 2: Extract Metadata
- Title, author, platform, date
- Main topics and concepts
- Tools and technologies mentioned

### Step 3: Generate Deliverables
Process each deliverable in parallel where possible:

**Resumen**: 500 words ES + 500 words EN, Junior-accessible

**Prompts**: Extract actual prompts used + create 7 profile versions
- Project Manager, Product Manager, Product Design
- Vibe Coding, Testing, DevOps, Marketing

**Demos**: Step-by-step with code, Junior-friendly

**Herramientas**: List with links, versions, alternatives

**Insights**: Connect to existing knowledge in 06_Unicorn/

**Posts**: Adapt for each social platform tone

**Mega Prompt**: Reusable prompt that captures the learning

**Ingeniería Inversa**: Analyze construction, architecture, decisions

### Step 4: Engram Integration
Save key insights with topic keys:
- `learning/{topic}` - main topic
- `learning/{tool}` - specific tool learnings
- `learning/{pattern}` - patterns discovered

---

## Tools Used

- **Firecrawl**: Web scraping with proper extraction
- **WebFetch**: Simple URL content retrieval
- **mcp__claude_ai_Exa__web_search_exa**: Find related content
- **mcp__claude_ai_Exa__web_fetch_exa**: Deep content extraction

---

## Integration with Engram

After generating deliverables:

```javascript
// Save main insight
mem_save({
  title: "Learned: {specific discovery}",
  type: "discovery",
  scope: "project",
  topic_key: "learning/{topic}",
  content: {
    what: "Brief description of what was learned",
    why: "Motivation for learning this",
    where: "URL and generated files",
    learned: "Gotchas or surprising findings"
  }
});
```

---

## ⚠️ Gotchas

### Gotcha 1: YouTube transcription failures
- **Por qué**: YouTube transcripts can be auto-generated (poor quality), disabled by the creator, or region-restricted. The skill may fail silently or produce unusable text.
- **Solución**: Always attempt transcript extraction first, but have a fallback: if transcript fails, use web search to find a summary/article about the video. Log the transcript quality score. For critical videos, manually review the transcript.

### Gotcha 2: 8 deliverables create excessive output for short content
- **Por qué**: A 2-minute tutorial video or a short blog post doesn't have enough substance to fill 8 deliverables. The skill generates padded, low-value content for deliverables 4-8.
- **Solución**: Add a content depth check before generating all 8. If the source is "short" (<500 words or <5 minutes), skip deliverables 4-8 and only generate 1-3. Add a note: "Content too short for full pipeline."

### Gotcha 3: Social post generation without platform context
- **Por qué**: The skill generates posts for Facebook, Instagram, X, and LinkedIn, but these platforms have vastly different formats, character limits, and audience expectations. Posts generated without platform-specific rules require heavy editing.
- **Solución**: Embed platform-specific templates and constraints: X = <280 chars, LinkedIn = professional tone, Facebook = conversational, Instagram = visual-first. If the content isn't suited for a platform (e.g., technical content on Instagram), skip it with reasoning.

### Gotcha 4: Junior-friendly demos assume too much context
- **Por qué**: The "Junior-accessible" demos in deliverable 3 may still assume knowledge of specific tools, frameworks, or terminology that a true junior wouldn't have. This creates a gap between the stated audience and the actual content.
- **Solución**: Define "Junior" explicitly in the skill: someone with 0-6 months of experience. Include prerequisite sections in each demo. Link to foundational concepts. Run a self-check: "Could someone with no prior knowledge follow this?" If not, simplify.

---

## 💾 State Persistence

State is managed through generated files and Engram observations. The skill:
- **Creates output files** under `03_Resultado/10_Contenido_Learning/01_LA_[Description]/` — this is the primary persistence layer
- **Saves key insights** to Engram with `topic_key: learning/{topic}`, `learning/{tool}`, and `learning/{pattern}`
- **No local state between runs** — each URL is processed independently
- **Idempotent**: processing the same URL twice generates a fresh output alongside the old one (different timestamps)

To find previous outputs, search `03_Resultado/10_Contenido_Learning/` or use `mem_search({query: "[topic]", project: "Think_Different"})`.

---

## Related Skills

- **compound-knowledge**: Connect new knowledge to existing OS
- **os-self-improvement**: Detect opportunities to improve the OS
- **content-from-url**: Alternative for simple content extraction

---

## Changelog

| Version  | Date      | Changes                                           |
|---------|----------|--------------------------------------------------|
| v1.0     | 2026-05-22| Initial skill based on Learning Always methodology|

---

**Status**: Ready to use

*Generated by Think Different PersonalOS v6.1 | Pure Green State*
