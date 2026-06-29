# References - Content from URL

## Extraction Tools

| Tool         | Best For                        | Limit          |
|-------------|--------------------------------|---------------|
| Firecrawl    | Complex pages, proper extraction| Rate limited   |
| WebFetch     | Quick simple retrieval          | Limited parsing|
| WebSearch Exa| Finding related content         | Query based    |
| WebFetch Exa | Deep content extraction         | Batch capable  |

## URL Types and Best Approaches

| URL Type     | Recommended Tool          | Notes                     |
|-------------|--------------------------|--------------------------|
| YouTube      | Transcript API            | Use yt-dlp or similar     |
| Documentation| Firecrawl                 | Best structured extraction|
| Blog/Article | WebFetch                  | Simple text extraction    |
| GitHub       | GitHub API + content fetch| Raw content works best    |
| Twitter/X    | API or scrape             | Rate limited              |

## Content Quality Checklist

- [ ] Remove navigation elements
- [ ] Remove ads and sidebars
- [ ] Preserve main content structure
- [ ] Keep code blocks intact
- [ ] Remove tracking scripts
- [ ] Preserve links and references

---

*Last updated: 2026-05-15*
