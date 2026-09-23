---
type: entity
name: Obsidian
created: '2026-09-23'
role: Note-taking vault system
---

# Obsidian

## What It Is

Obsidian is a local-first note-taking and knowledge management application that stores all data as plain Markdown files in a local vault. Unlike cloud-based note-taking tools, Obsidian keeps everything on the user's filesystem — owned, inspectable, and portable. It supports plugins, graph views, and bidirectional linking between notes.

## Role in AI Research OS

Obsidian serves as the **primary local vault** and long-term memory layer for the AI Research OS. In the system's architecture:

- **Immutable snapshot**: Obsidian holds the user's complete second brain — structured using Tiago Forte's PARA method (Projects, Areas, Resources, Archive). The LLM never directly touches personal notes; it works through the wiki layer.
- **Source of truth**: Raw research data ingested from Obsidian feeds into the deep research algorithm. The system reads from Obsidian as one of several source types (alongside Readwise, Notebook LM, GitHub, etc.).
- **Wiki rendering**: The LLM-generated wiki pages are stored in Obsidian, making them visually inspectable, graph-viewable, and editable by hand.

## Why It's Preferred Over Cloud Solutions

Louis-François Bouchard explains his switch from scattered tools (Granola for meeting recaps, Apple Notes, saved Chrome tabs, Notion) to Obsidian:

1. **Local ownership**: "You don't own" cloud tools like NotebookLM — you cannot personalize or extend them. Obsidian gives full control.
2. **Cross-platform**: Works on Windows, Mac, phone — the vault syncs via filesystem.
3. **Agent-native**: Plain Markdown files are trivially parseable by AI agents and scripts.
4. **Graph visualization**: The graph view in Obsidian reflects connections between wiki pages, concepts, and entities — creating a visual map of knowledge.
5. **No vendor lock-in**: Everything is just files on disk, readable by any tool.

## Integration in the System

Obsidian is not the only source — the system connects to Readwise, Notebook LM, GitHub, YouTube, Google Drive, and Notion as well. But it is the anchor: the primary vault where the user's accumulated knowledge lives and where the AI Research OS writes its outputs. The system uses Codex to automate saving content into Obsidian (e.g., automatically piping Granola meeting recaps into the vault).

## Related Pages

- [AI Research OS Overview]([[overview]])
- [Three-Layer Architecture]([[concepts/three-layer-architecture]])
- [Memory Management]([[concepts/memory-management]])
- [Paul Iusztin]([[paul-iusztin]])
