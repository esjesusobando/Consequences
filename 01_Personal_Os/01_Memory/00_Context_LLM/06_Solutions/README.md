# 06_Solutions

Soluciones documentadas generadas por el workflow de compound engineering. **Lugar ÚNICO y canónico** para compounds — no crear en `docs/solutions/` (obsoleto) ni en ningún otro lado.

## Ubicación

Esta carpeta reemplaza `docs/solutions/` obsoleto.

## Estructura

```
06_Solutions/
├── build-errors/
├── test-failures/
├── runtime-errors/
├── performance-issues/
├── database-issues/
├── security-issues/
├── ui-bugs/
├── integration-issues/
└── logic-errors/
```

## Workflows que generan aquí

- `01_Personal_Os/00_Core/00_Workflows/02_Marvel/06_Hulk_Compound.md` — Workflow orquestador (ce:compound)
- `01_Personal_Os/00_Core/02_Tools/02_Skills/00_Compound_Engineering/` — Skills CE que leen y escriben aquí

## Búsqueda

- **Rápida**: Engram (`mem_search`)
- **Archivos**: Búsqueda directa por categoría

## Formato

Cada solución incluye:
- YAML frontmatter (`title`, `date`, `category`, `tags`, `severity`, `project`, `status`, `generated_by`)
- Symptom
- Investigation steps / What didn't work
- Root cause analysis
- Working solution (con código si aplica)
- Prevention strategies
- Related (commits, tags, links)
