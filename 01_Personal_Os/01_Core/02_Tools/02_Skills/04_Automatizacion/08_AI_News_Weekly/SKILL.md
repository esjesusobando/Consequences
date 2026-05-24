---
name: ai-news-weekly
description: "Trigger: AI news, newsletter, weekly news, news summary, AI briefing. Generate weekly AI news briefing with strategic analysis."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# AI News Weekly

Weekly AI news briefing with strategic analysis and executive summary.

---

## Quick Start

```
/ai-news-weekly
```

Generates a comprehensive weekly AI news briefing from multiple sources, saved to:
```
03_Resultado/NN_AI_News_Weekly_YYYYMMDD/
```

---

## Activation Contract

### Triggers
- "AI news weekly"
- "news summary AI"
- "weekly AI briefing"
- "/ai-news-weekly"
- Newsletter generation

### Prerequisites
- Firecrawl MCP configured OR web scraping capability
- Web search access (mcp__claude_ai_Exa__web_search_exa)
- Output directory: `03_Resultado/`

---

## Execution Steps

### Step 1: Define Target Date
Use current week's date range (Monday to Sunday).

### Step 2: Scrape AI News Sources

**Source 1: Hacker News (AI/ML)**
```
Search: site:news.ycombinator.com AI OR machine learning OR LLM OR GPT
Period: last 7 days
```

**Source 2: aginews.io**
```
URL: https://aginews.io
Scrape top stories from past week
```

**Source 3: TechCrunch AI**
```
Search: site:techcrunch.com AI OR artificial intelligence
Period: last 7 days
```

**Source 4: Additional Sources (optional)**
- arxiv.org (cs.AI, cs.LG)
- venturebeat.com/ai
- theverge.com/ai-artificial-intelligence

### Step 3: Extract Content
For each source:
1. Fetch headlines and summaries
2. Extract key developments
3. Identify major announcements
4. Note significant research papers

### Step 4: Generate Executive Summary
Compile findings into:
- **Top 5 Stories**: Most impactful news of the week
- **Key Themes**: Patterns and trends observed
- **Strategic Insights**: What it means for your work
- **Notable Research**: Important papers/releases

### Step 5: Create Output Structure

```
03_Resultado/NN_AI_News_Weekly_YYYYMMDD/
├── 01_Ejecutivo_Summary.md
├── 02_Top_Stories.md
├── 03_Links_Index.md
├── 04_Analisis_Estrategico.md
└── 05_Fuentes.md
```

---

## Output Contract

### File Structure

#### 01_Ejecutivo_Summary.md
```markdown
# AI News Weekly — [DATE]

## Executive Summary

**Periodo:** [DATE] - [DATE]
**Generado:** [TIMESTAMP]

### Top 3Insights
1. [Key insight with impact]
2. [Key insight with impact]
3. [Key insight with impact]

### tl;dr
[One paragraph summary for busy readers]

### Headlines by Theme
- **Models & Releases:** [Notable releases]
- **Research:** [Key papers/breakthroughs]
- **Industry:** [Business/enterprise news]
- **Tools:** [New tools and platforms]
```

#### 02_Top_Stories.md
```markdown
# Top Stories — Week of [DATE]

## 1. [Story Title]
**Source:** [Source Name]
**Date:** [DATE]
**Summary:** [2-3 sentence summary]
**Why it matters:** [Impact assessment]
**Link:** [URL]

---
[Repeat for top 8-12 stories]
```

#### 03_Links_Index.md
```markdown
# Links Index

## Categorized Links

### Model Releases
- [Title](URL) — [Brief description]
- ...

### Research Papers
- [Title](URL) — [Brief description]
- ...

### Industry News
- [Title](URL) — [Brief description]
- ...

### Tools & Platforms
- [Title](URL) — [Brief description]
- ...

### Events & Conferences
- [Title](URL) — [Brief description]
- ...
```

#### 04_Analisis_Estrategico.md
```markdown
# Strategic Analysis

## Patterns & Trends
[Analysis of recurring themes and trends]

## Impact Assessment
[What these developments mean strategically]

## Recommendations
[Suggested actions or focus areas]

## Watch List
[Things to monitor going forward]
```

#### 05_Fuentes.md
```markdown
# Fuentes Consultadas

1. [Hacker News](https://news.ycombinator.com) — AI/ML threads
2. [AI News](https://aginews.io) — Aggregated AI news
3. [TechCrunch AI](https://techcrunch.com/category/artificial-intelligence/) — Industry coverage
4. [ArXiv cs.AI](https://arxiv.org/list/cs.AI/recent) — Research papers
5. [VentureBeat AI](https://venturebeat.com/category/ai/) — Enterprise AI

---
*Generated: [TIMESTAMP]*
```

---

## Integration

### Engram Memory
Save key findings:
```javascript
mem_save({
  title: "AI News: [Key finding]",
  type: "discovery",
  scope: "project",
  project: "Think_Different",
  topic_key: "ai-news-weekly/YYYY-WXX",
  content: {
    what: "[What happened]",
    why: "[Why it matters]",
    where: "[Source link]",
    learned: "[Strategic insight]"
  }
});
```

### N8N Workflow
Can be triggered via N8N webhook for automated weekly generation.

---

## Frequency

- **Recommended:** Weekly (Sunday evening or Monday morning)
- **Minimum:** Weekly to stay current with fast-moving AI landscape

---

## Related Skills

- **content-from-url**: Quick content extraction
- **learning-url-to-knowledge**: Deep learning from specific articles
- **firecrawl**: Web scraping capability

---

## Changelog

| Version  | Date      | Changes               |
|---------|----------|----------------------|
| v1.0     | 2026-05-22| Initial skill creation|

---

**Status**: Ready to use

*Generated by Think Different PersonalOS v6.1 | Pure Green State*
