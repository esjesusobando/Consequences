---
name: ai-news-weekly-report
description: Research current AI news from the last 7 days and produce an executive findings package. Use when asked to investigate latest/recent AI news, create weekly AI intelligence briefings, summarize developments in OpenAI/Anthropic/Google/Meta/Microsoft/AI regulation/startups, or generate both a PDF report and an HTML presentation in 03_Resultado with cited sources.
---

# AI News Weekly Report

## Purpose

Create a current AI-news intelligence package for the last week, with:

- a cited PDF report,
- a browser-ready HTML presentation,
- source data/JSON for auditability,
- all outputs placed under `03_Resultado/` using the next available numeric prefix.

## Required workflow

1. **Confirm date window**
   - Default to the last 7 calendar days from the current date.
   - If the user specifies another window, use it explicitly in titles and filenames.

2. **Use current sources**
   - Because this task is always about recent news, use live web/RSS/search before writing conclusions.
   - Prefer primary or high-signal sources: official company blogs, research labs, regulator/government releases, reputable technology/business press, and original papers/model cards.
   - Keep source URLs for every important claim.

3. **Generate artifacts in `03_Resultado/`**
   - Use the bundled script for deterministic scaffolding:

   ```powershell
   python 01_Personal_Os/00_Core/02_Tools/02_Skills/06_Tools/23_Ai_News_Weekly_Report/scripts/generate_ai_news_weekly_report.py --days 7
   ```

   - The script automatically creates the next sequential folder:
     `03_Resultado/NN_AI_News_Weekly_YYYYMMDD/`.
   - Do not reuse an existing numeric prefix unless intentionally updating that exact report.

4. **Review and improve the generated content**
   - Open the generated Markdown/JSON if the user expects editorial quality.
   - Add missing context, citations, risks, and implications without deleting source data.
   - If browsing finds stronger or newer stories than RSS, update the report inputs or the generated Markdown/HTML/PDF.

5. **Deliver final paths**
   - Report the absolute paths to:
     - `ai_news_weekly_report.pdf`
     - `ai_news_weekly_presentation.html`
     - `ai_news_weekly_sources.json`

## Output standards

The PDF and HTML presentation must include:

- date range and generation timestamp,
- executive summary,
- top AI developments from the last week,
- why each item matters,
- source links,
- implications for builders/operators/strategy,
- risks or uncertainty where coverage is thin.

## Numbering rule

Before creating an output folder under `03_Resultado/`, scan existing top-level directories that start with `NN_`. Use the next integer with two digits. Example: if `03_Resultado/09_World_OIM/` exists and no later numbered folder exists, create `03_Resultado/10_AI_News_Weekly_YYYYMMDD/`.

## Bundled resources

- `scripts/generate_ai_news_weekly_report.py`: fetches recent AI news from RSS/search feeds, ranks and deduplicates stories, and writes PDF + HTML + Markdown + JSON artifacts.
- `references/source-policy.md`: source quality and citation policy for improving the generated briefing.
