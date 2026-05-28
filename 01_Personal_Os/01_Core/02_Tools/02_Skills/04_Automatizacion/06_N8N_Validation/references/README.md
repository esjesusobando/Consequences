# References — n8n Validation Expert

## Detailed Guides (in skill root)

| File | Content |
|------|---------|
| [ERROR_CATALOG.md](../ERROR_CATALOG.md) | Complete list of error types with examples and fixes |
| [FALSE_POSITIVES.md](../FALSE_POSITIVES.md) | When warnings are acceptable and how to reduce noise |

## Validation Profiles Summary

| Profile | Use When | Strictness |
|---------|----------|------------|
| `minimal` | Quick editing checks | Very permissive |
| `runtime` | Pre-deployment (recommended) | Balanced |
| `ai-friendly` | AI-generated configs | Reduced false positives |
| `strict` | Production critical workflows | Maximum (noisy) |
