# Video Intel - Technical Reference

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLI (Click)                                 │
├─────────────────────────────────────────────────────────────────┤
│                  SynthesisEngine                                │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │  VideoAnalyzer   │    │    RepoScanner    │                 │
│  │  ─────────────── │    │  ─────────────── │                 │
│  │  yt-dlp          │    │  git clone       │                 │
│  │  whisper         │    │  AST parse       │                 │
│  └──────────────────┘    └──────────────────┘                  │
├─────────────────────────────────────────────────────────────────┤
│  Methodology Extraction + OS Verification + Plan Generation     │
└─────────────────────────────────────────────────────────────────┘
```

## Video Analysis Pipeline

### Step 1: Metadata Extraction

```python
from video_intel import VideoAnalyzer

analyzer = VideoAnalyzer()
metadata = analyzer.download_metadata("https://youtube.com/...")
# Returns: {title, duration, channel, upload_date, description, ...}
```

### Step 2: Transcription

```python
# Downloads subtitles via yt-dlp
transcript_path = analyzer.transcribe("https://youtube.com/...", model="base")
```

### Step 3: Transcript Extraction

```python
# Parses VTT/SRT to plain text
transcript = analyzer.extract_transcript("https://youtube.com/...")
```

## Repository Scanning Pipeline

### Step 1: Clone

```python
from video_intel import RepoScanner

scanner = RepoScanner()
repo_path = scanner.clone_repo("https://github.com/user/repo")
```

### Step 2: AST Analysis

```python
code_map = scanner.generate_code_map(repo_path)
# Returns: {files, file_tree, summary}
```

## Synthesis Pipeline

```python
from video_intel import SynthesisEngine

engine = SynthesisEngine()
result = engine.synthesize(
    video_url="https://youtube.com/...",
    repo_url="https://github.com/..."
)
```

### Output Schema

```typescript
interface ImplementationPlan {
  prerequisites: Array<{
    tool: string;
    action: "install" | "update";
    description: string;
  }>;
  steps: Array<{
    description: string;
    category: "technique" | "demo" | "setup";
    methodology: string;
  }>;
  verification: Array<{
    type: "demo" | "completion" | "note";
    url?: string;
    description: string;
  }>;
  complexity: "low" | "medium" | "high";
  components: {
    video: VideoMetadata;
    transcript: string;
    methodologies: Methodology[];
    demo_urls: DemoUrl[];
    repo: RepoInfo | null;
    os_verification: OSVerification;
  };
}
```

## Error Handling

| Error                                                   | Cause                                            | Solution                                                |
|--------------------------------------------------------|-------------------------------------------------|--------------------------------------------------------|
| "Video is private"                                      | Video no es público                              | Proporcionar video público                              |
| "yt-dlp not installed"                                  | Falta dependencia                                | `pip install yt-dlp`                                    |
| "Repository requires auth"                              | Repo privado                                     | `gh auth login`                                         |
| "Failed to clone"                                       | URL inválida                                     | Verificar URL de repo                                   |

## OS Verification

El motor verifica las siguientes herramientas:

- **Lenguajes**: python, node, go, rust, java
- **Frameworks**: react, vue, angular, nextjs, docker
- **Cloud**: aws, gcp, azure, vercel
- **AI**: openai, anthropic, claude

Para agregar herramientas, modificar `verify_os_capabilities()` en `synthesis_engine.py`.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
