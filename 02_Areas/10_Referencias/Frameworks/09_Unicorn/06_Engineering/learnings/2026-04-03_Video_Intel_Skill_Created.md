---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\09_Unicorn\06_Engineering\learnings\2026-04-03_Video_Intel_Skill_Created.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Frameworks\09_Unicorn\06_Engineering\learnings\2026-04-03_Video_Intel_Skill_Created.md"
sync_date: "2026-08-01T00:55:48.174698"
sync_updated: true
---

# Video Analysis Skill - Knowledge Base

## Overview

The Video_Intel skill extracts structured knowledge from YouTube videos and GitHub repositories to generate actionable implementation plans.

## Creation Date

2026-04-03

## Location

`01_Personal_Os/00_Core/02_Tools/02_Skills/19_Video_Intel/`

## Purpose

Transform audiovisual content (YouTube) and code (GitHub) into actionable implementation plans verified against the user's OS capabilities.

## Components

| Component                                      | Purpose                                                                    |
|-----------------------------------------------|---------------------------------------------------------------------------|
| video_analyzer.py                              | yt-dlp + whisper for metadata and transcription                            |
| repo_scanner.py                                | git clone + AST parsing for code analysis                                  |
| synthesis_engine.py                            | Combines data and generates plan                                           |
| cli.py                                         | Click CLI interface                                                        |

## Usage

```bash
python -m video_intel.cli analyze "VIDEO_URL" --repo "REPO_URL"
```

## Dependencies

- yt-dlp>=2024.8.6
- whisper>=20231117
- click>=8.1.7
- astor>=0.8.1
- tiktoken>=0.7.0

## Status

Production ready


> 🔗 Zona: [[03_Resources/01_AI_Research_OS/Referencias/Frameworks/09_Unicorn/README]]
