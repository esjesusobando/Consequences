# Graphify Tutorial: Make Claude Code 10x More Intelligent

## Puntos principales
- Graphify convierte cualquier código, documentación, papers, imágenes o videos en un grafo de conocimiento queryable
- Reduce el consumo de tokens en Claude Code hasta 71.5x al leer el grafo en lugar de hacer grepping en todos los archivos
- Funciona en modo AST-only (sin necesidad de API keys de LLM) para extracción estructural
- Genera tres outputs principales: graph.json (grafo), GRAPH_REPORT.md (reporte estructural), y graph.html (visualización interactiva)
- Los comandos principales son: `graphify query` (consultas), `graphify path` (relaciones), `graphify explain` (conceptos)

## Herramientas identificadas
| #  | Herramienta      | Propósito                      | Versión  |
|---|-----------------|-------------------------------|---------|
| 1  | Graphify         | Knowledge graph generator      | 0.8.27   |
| 2  | Claude Code      | AI coding assistant            | v2.1.9+  |
| 3  | Tree-sitter      | AST parser                     | N/A      |
| 4  | NetworkX + Leiden| Graph construction & clustering| N/A      |
| 5  | D3.js            | Interactive visualization      | N/A      |

## Para el OS
[SÍ] - Agregar al contexto:
- Graphify como herramienta estructural para comprensión de código base
- Integración con Cursor, Claude Code y OpenCode vía AGENTS.md y configuraciones específicas
- Workflow de actualización automática mediante git hooks

## Insights para ~/Knowledge
- Graphify en modo AST-only es suficiente para la mayoría de las necesidades de comprensión estructural
- La separación de responsabilidades es clara: AST para estructura (sin LLM), LLM para semántica (cuando se necesita)
- Los "god nodes" y "comunidades" revelan la arquitectura real del proyecto mejor que la inspección manual de archivos
- El valor de Graphify aumenta con el tamaño del codebase (más archivos = mayor reducción de tokens)

## Conexiones con conocimiento previo
- Relacionado con el workflow de Document Alignment (01_Plan/01_Docs_Alignment)
- Complementa el sistema de skills al proporcionar conciencia estructural para decisiones de implementación
- Se integra con el patrón de Verificación Antes de Completación (03_Review/03_Verification_Before_Completion)
- Potencial para usar en el flujo de Juicio Final (judgment-day) para revisiones arquitecturales

---
