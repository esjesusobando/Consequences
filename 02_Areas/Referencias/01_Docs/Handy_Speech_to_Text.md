---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\01_Docs\Handy_Speech_to_Text.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\01_Docs\Handy_Speech_to_Text.md"
sync_date: "2026-08-01T00:55:46.097172"
sync_updated: true
---

# Handy — Speech-to-Text Offline

> **URL:** https://github.com/cjpais/Handy
> **Stars:** 27.3k | **Forks:** 2.4k | **License:** MIT
> **Saved:** 2026-07-23

## What
Free, open source, extensible speech-to-text app that works **completely offline**. Cross-platform (Windows, macOS, Linux).

## Why
- Privacy-first: voice stays on your computer, no cloud
- Free: accessibility tooling belongs in everyone's hands
- Open source: extend for yourself, contribute to something bigger
- Simple: one tool, one job — transcribe speech to text

## How It Works
1. Press configurable keyboard shortcut to start/stop recording
2. Speak your words
3. Release → Whisper processes speech locally
4. Transcribed text pasted directly into any text field

## Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Rust (Tauri v2)
- **ML:** Whisper models (Small/Medium/Turbo/Large) + Parakeet V3
- **Audio:** cpal (cross-platform I/O), Silero VAD, rubato (resampling)
- **Shortcuts:** rdev (global keyboard events)

## Models
| Model | Size | Notes |
|-------|------|-------|
| Whisper Small | 487 MB | Good balance |
| Whisper Medium | 492 MB | Q4_1 quantized |
| Whisper Turbo | 1600 MB | Fast |
| Whisper Large | 1100 MB | Q5_0 quantized |
| Parakeet V3 | 478 MB | CPU-optimized, auto language detection |

## Key Features
- GPU acceleration when available
- Voice Activity Detection (Silero)
- Push-to-talk mode
- CLI flags for remote control (`--toggle-transcription`, `--start-hidden`)
- Raycast extension available
- Custom Whisper GGML models support

## Installation
- **macOS:** `brew install --cask handy`
- **Windows:** `winget install cjpais.Handy`
- **Linux:** AppImage from releases

## Use Cases for OS
- Voice-to-text for content creation
- Accessibility tool
- Quick note-taking
- Transcription for meetings/calls
