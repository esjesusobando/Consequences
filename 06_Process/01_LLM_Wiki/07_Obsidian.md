---
tags: [entity, tool, app]
date: 2026-08-02
source_count: 1
status: active
---

# Obsidian

## Resumen
Aplicación de gestión de conocimiento basada en markdown. Herramienta recomendada por Karpathy para el patrón LLM Wiki.

## Características Clave

### Base
- Markdown files (plain text)
- Local-first (no cloud dependency)
- Plugins system
- Graph view
- Bidirectional links

### Para LLM Wiki
- **Graph view**: Mejor forma de ver conexiones del wiki
- **Plugins**: Dataview para queries, Marp para slides
- **Web Clipper**: Capturar artículos directo al vault
- **Templates**: Estructura consistente
- **Hotkeys**: Navegación rápida

### Configuración Recomendada
- **Attachment folder**: `09_Attachments/` (imagenes locales)
- **New file location**: Current folder (not root)
- **Templates folder**: `11_Templates/`

## Plugins Útiles para LLM Wiki

### Dataview
- Queries sobre frontmatter YAML
- Tablas dinámicas
- Lists automáticas

### Marp
- Slide decks desde markdown
- Presentaciones directas del wiki

### Web Clipper
- Capturar artículos web a markdown
- Download automático de imágenes

### Templater
- Templates avanzados
- Variables dinámicas

## Uso en Oband_Os
- Vault principal para LLM Wiki
- Estructura: 00-11 folders
- Schema: `CLAUDE.md`
- Index: `index.md`
- Log: `log.md`

## Relacionado
- [[LLM_Wiki|LLM Wiki]]
- [[Andrej_Karpathy|Andrej Karpathy]]
- [[Claude|Claude]]

## Fuentes
- [[../../01_Capture/01_Raw/Karpathy_LLM_Wiki_Gist|Karpathy LLM Wiki Gist]] (2026-08-02)

---
*Última actualización: 2026-08-02*
