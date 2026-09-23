---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\01_Docs\plans\2026-07-22-plan-neko-tools.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\01_Docs\plans\2026-07-22-plan-neko-tools.md"
sync_date: "2026-08-01T00:55:48.913546"
sync_updated: true---

# Plan Neko — Tools de Automatización (Necopanion + Audio to Everything + Necatificador)

> **Para Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans para implementar este plan task-by-task.

**Goal:** Crear 3 tools de automatización inspirados en necopanion: browser automation, voice-to-OS pipeline, y video/audio transcript-to-actions.

**Architecture:** Cada tool es una skill OpenCode independiente con Python scripts backend. Usa Playwright para browser, Whisper/Exa para transcripción, y Engram para persistencia.

**Tech Stack:** Python 3.10+, Playwright, Whisper API (o local), Exa/Firecrawl, Engram

---

## Contexto — El Patron Necopanion

```
NECOPANION (Browser Agent):
  Tarea repetitiva → Descomponer en microtareas → Ejecutar en navegador → Reportar

AUDIO TO EVERYTHING (Voice Pipeline):
  Audio del micrófono → Transcribir → Extraer tareas/ideas → Enrutar a sistemas

NECATIFICADOR (Transcript Engine):
  Video/Audio → Transcripción instantánea → IA genera resumen/tareas
```

**Patrón unificado:** CAPTURA → EXTRACCIÓN → ESTRUCTURACIÓN → EJECUCIÓN → PERSISTENCIA

---

## Tool 1: `browser-automation` (Necopanion-like)

### Descripción
Ejecutar tareas repetitivas en el navegador del usuario. El usuario describe QUÉ quiere hacer, la skill genera un script Playwright y lo ejecuta.

### Arquitectura

```
Usuario: "llená el form de contacto en esta página con mi info"
    ↓
[SKILL] Parsear intención → Identificar elementos UI
    ↓
[SCRIPT] Generar script Playwright
    ↓
[EJECUTAR] Playwright ejecuta en browser real
    ↓
[REPORTAR] Resultado + screenshot de confirmación
```

### Task 1.1: Crear estructura del skill

**Archivos a crear:**
- `01_Personal_Os/00_Core/02_Tools/02_Skills/browser-automation/SKILL.md`
- `01_Personal_Os/00_Core/02_Tools/02_Skills/browser-automation/scripts/browse.py`
- `01_Personal_Os/00_Core/02_Tools/02_Skills/browser-automation/references/playwright-patterns.md`

**Paso 1: Crear SKILL.md**

```markdown
# Browser Automation Skill

## Trigger
"automatizá esto en el browser", "llená este form", "scrapeá esta página", 
"hacé click en", "navegá a", "subí este archivo"

## Pre-requisitos
- Playwright instalado: `pip install playwright && playwright install`
- Chromium o Firefox disponible

## Flujo
1. Parsear intención del usuario
2. Identificar URL target
3. Generar script Playwright
4. Ejecutar con timeout de 30s
5. Capturar screenshot del resultado
6. Reportar: éxito/fallo + evidencia visual

## Comandos
```bash
# Navegar y hacer click
python scripts/browse.py --url "https://example.com" --action "click:#submit-btn"

# Llenar form
python scripts/browse.py --url "https://example.com/contact" --fill '{"name":"Sebas","email":"test@test.com"}'

# Scrapear contenido
python scripts/browse.py --url "https://example.com" --scrape "h2, p, .price"

# Screenshot
python scripts/browse.py --url "https://example.com" --screenshot
```

## Seguridad
- NUNCA ejecutar en páginas de banking/pagos
- NUNCA enviar credenciales sin enmascarar
- Siempre confirmar con usuario antes de submits
- Timeout máximo: 60s por acción
```

**Paso 2: Crear scripts/browse.py**

Script Python que:
- Acepta URL + acción (click, fill, scrape, screenshot)
- Usa Playwright para ejecutar
- Captura screenshot del resultado
- Retorna JSON con status + screenshot path

**Paso 3: Crear references/playwright-patterns.md**

Documentar patrones comunes:
- Fill form: selector discovery + fill
- Click button: wait for element + click
- Scrape table: iterate rows + extract
- File upload: input[type=file] interaction
- Infinite scroll: scroll + wait + scrape loop

---

### Task 1.2: Implementar browse.py

**Archivos:**
- Create: `01_Personal_Os/00_Core/02_Tools/02_Skills/browser-automation/scripts/browse.py`

**Paso 1: Script base con argparse**

```python
#!/usr/bin/env python3
"""Browser Automation — Playwright-based task executor."""

import argparse
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

def browse(url, action=None, fill=None, scrape=None, screenshot=False, timeout=30):
    """Execute browser task and return result."""
    result = {"url": url, "status": "pending", "screenshot": None, "data": None}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Visible for user confirmation
        page = browser.new_page()
        
        try:
            page.goto(url, timeout=timeout * 1000)
            result["status"] = "loaded"
            
            if action:
                # Parse action: "click:#btn" or "fill:#input:text"
                action_type, selector = action.split(":", 1)
                if action_type == "click":
                    page.click(selector)
                elif action_type == "fill":
                    page.fill(selector, "")
                result["action_performed"] = action
                
            if fill:
                # fill is JSON: '{"name":"Sebas","email":"test@test.com"}'
                field_map = json.loads(fill)
                for selector, value in field_map.items():
                    page.fill(selector, value)
                result["fields_filled"] = list(field_map.keys())
                
            if scrape:
                # scrape is CSS selector(s)
                elements = page.query_selector_all(scrape)
                result["data"] = [el.inner_text() for el in elements]
                
            if screenshot:
                screenshot_path = Path("browser_screenshot.png")
                page.screenshot(path=str(screenshot_path))
                result["screenshot"] = str(screenshot_path.absolute())
                
            result["status"] = "success"
            
        except Exception as e:
            result["status"] = "error"
            result["error"] = str(e)
            
        finally:
            browser.close()
    
    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Browser Automation")
    parser.add_argument("--url", required=True)
    parser.add_argument("--action", help="Action: click:#selector or fill:#selector")
    parser.add_argument("--fill", help="JSON map of selector:value pairs")
    parser.add_argument("--scrape", help="CSS selector to scrape")
    parser.add_argument("--screenshot", action="store_true")
    parser.add_argument("--timeout", type=int, default=30)
    
    args = parser.parse_args()
    result = browse(args.url, args.action, args.fill, args.scrape, args.screenshot, args.timeout)
    print(json.dumps(result, indent=2))
```

**Paso 2: Test con sitio real**

```bash
python scripts/browse.py --url "https://httpbin.org/forms/post" --fill '{"#name":"Test User","#email":"test@example.com","#message":"Hello from browser automation"}' --screenshot
```

**Paso 3: Commit**

```bash
git add 01_Personal_Os/00_Core/02_Tools/02_Skills/browser-automation/
git commit -m "feat(skill): browser-automation — Necopanion-like Playwright executor"
```

---

## Tool 2: `voice-capture` (Audio to Everything-like)

### Descripción
Capturar audio del micrófono, transcribir, extraer tareas/ideas/decisiones, y guardar en Engram.

### Arquitectura

```
Usuario: "capturá por voz"
    ↓
[MIC] Grabar audio (120s max)
    ↓
[WHISPER] Transcribir a texto
    ↓
[LLM] Extraer: tareas, ideas, decisiones, contactos
    ↓
[ENGRAM] Guardar cada ítem clasificado
    ↓
[REPORT] Resumen de lo capturado
```

### Task 2.1: Crear estructura del skill

**Archivos a crear:**
- `01_Personal_Os/00_Core/02_Tools/02_Skills/voice-capture/SKILL.md`
- `01_Personal_Os/00_Core/02_Tools/02_Skills/voice-capture/scripts/capture.py`
- `01_Personal_Os/00_Core/02_Tools/02_Skills/voice-capture/scripts/transcribe.py`
- `01_Personal_Os/00_Core/02_Tools/02_Skills/voice-capture/scripts/extract.py`

**Paso 1: Crear SKILL.md**

```markdown
# Voice Capture Skill

## Trigger
"capturá por voz", "grabá audio", "voice note", "dictá esto"

## Pre-requisitos
- Python: `pip install sounddevice scipy whisper`
- O: Whisper API key para cloud transcription
- Engram activo para persistencia

## Flujo
1. Grabar audio del micrófono (max 120s)
2. Transcribir con Whisper
3. Extraer ítems: tareas, ideas, decisiones, contactos
4. Guardar cada ítem en Engram con tipo correcto
5. Reportar resumen

## Comandos
```bash
# Grabar y procesar
python scripts/capture.py --duration 60 --output audio.wav

# Transcribir audio existente
python scripts/transcribe.py --input audio.wav --output transcript.txt

# Extraer ítems del transcript
python scripts/extract.py --input transcript.txt --format json
```

## Clasificación de ítems
- **Tarea**: "necesito hacer X", "hay que Y", "acordate de Z"
- **Idea**: "se me ocurrió que", "y si hiciéramos", "podría ser"
- **Decisión**: "decidimos que", "vamos a", "la opción elegida es"
- **Contacto**: "[nombre] es de [empresa]", "hablé con [nombre]"
```

**Paso 2: Crear capture.py**

Script que:
- Usa `sounddevice` para grabar del micrófono
- Guarda como WAV
- Retorna path del archivo grabado

**Paso 3: Crear transcribe.py**

Script que:
- Acepta archivo WAV
- Usa Whisper (local o API)
- Retorna transcript como texto

**Paso 4: Crear extract.py**

Script que:
- Acepta transcript como texto
- Usa LLM (Claude API) para extraer ítems clasificados
- Retorna JSON con ítems tipados

---

### Task 2.2: Implementar scripts

**Paso 1: capture.py**

```python
#!/usr/bin/env python3
"""Capture audio from microphone."""

import argparse
import sounddevice as sd
import scipy.io.wavfile as wav
import numpy as np
from datetime import datetime
from pathlib import Path

def capture(duration=60, output="capture.wav", sample_rate=16000):
    """Record audio from microphone."""
    print(f"🔴 Grabando {duration}s de audio... (Ctrl+C para parar)")
    try:
        audio = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype='int16')
        sd.wait()
    except KeyboardInterrupt:
        pass
    
    wav.write(output, sample_rate, audio)
    print(f"✅ Audio guardado: {output}")
    return output

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--duration", type=int, default=60)
    parser.add_argument("--output", default="capture.wav")
    args = parser.parse_args()
    capture(args.duration, args.output)
```

**Paso 2: transcribe.py**

```python
#!/usr/bin/env python3
"""Transcribe audio using Whisper."""

import argparse
import whisper
import json
from pathlib import Path

def transcribe(input_path, model_size="base"):
    """Transcribe audio file to text."""
    model = whisper.load_model(model_size)
    result = model.transcribe(input_path)
    return result["text"]

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--model", default="base")
    parser.add_argument("--output", default="transcript.txt")
    args = parser.parse_args()
    
    text = transcribe(args.input, args.model)
    Path(args.output).write_text(text)
    print(f"✅ Transcripción: {args.output}")
```

**Paso 3: extract.py**

```python
#!/usr/bin/env python3
"""Extract actionable items from transcript using LLM."""

import argparse
import json
from anthropic import Anthropic

EXTRACT_PROMPT = """Extract actionable items from this transcript. 
Classify each as: task, idea, decision, contact.

Transcript:
{transcript}

Return JSON array:
[
  {"type": "task", "content": "...", "priority": "high/medium/low"},
  {"type": "idea", "content": "...", "category": "..."},
  {"type": "decision", "content": "...", "context": "..."},
  {"type": "contact", "name": "...", "context": "..."}
]

Only include items that are clearly stated. Return [] if nothing actionable."""

def extract(transcript):
    client = Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": EXTRACT_PROMPT.format(transcript=transcript)}]
    )
    return json.loads(response.content[0].text)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", default="items.json")
    args = parser.parse_args()
    
    transcript = Path(args.input).read_text()
    items = extract(transcript)
    Path(args.output).write_text(json.dumps(items, indent=2))
    print(f"✅ {len(items)} ítems extraídos: {args.output}")
```

---

### Task 2.3: Integrar con Engram

**Paso 1:** Modificar `extract.py` para que cada ítem se guarde automáticamente en Engram:

```python
# Después de extraer items, guardar cada uno
for item in items:
    mem_save(
        title=f"Voice: {item['content'][:50]}",
        type=item['type'],  # task, idea, decision, contact
        topic_key=f"voice-capture/{date}",
        content=f"**What**: {item['content']}\n**Source**: Voice capture\n**When**: {datetime.now()}"
    )
```

**Paso 2: Commit**

```bash
git add 01_Personal_Os/00_Core/02_Tools/02_Skills/voice-capture/
git commit -m "feat(skill): voice-capture — Audio to Everything pipeline with Engram"
```

---

## Tool 3: `video-transcript` (Necatificador-like)

### Descripción
Pegar URL de YouTube u otro video → obtener transcripción → resumen + tareas extraídas.

### Arquitectura

```
Usuario: "transcribí este video: [URL]"
    ↓
[EXTRAER] Obtener transcript del video (YouTube API / Firecrawl)
    ↓
[RESUMIR] LLM genera resumen ejecutivo
    ↓
[EXTRAER] LLM extrae tareas, ideas, decisiones
    ↓
[ENGRAM] Guardar resumen + ítems
    ↓
[REPORT] Resumen + tareas listas para ejecutar
```

### Task 3.1: Crear estructura del skill

**Archivos a crear:**
- `01_Personal_Os/00_Core/02_Tools/02_Skills/video-transcript/SKILL.md`
- `01_Personal_Os/00_Core/02_Tools/02_Skills/video-transcript/scripts/transcript_video.py`
- `01_Personal_Os/00_Core/02_Tools/02_Skills/video-transcript/scripts/summarize.py`

**Paso 1: Crear SKILL.md**

```markdown
# Video Transcript Skill

## Trigger
"transcribí este video", "resumen de YouTube", "sacá tareas de este video",
"qué dice este video", "video summary"

## Pre-requisitos
- Python 3.10+
- `pip install youtube-transcript-api anthropic`
- O: Firecrawl para páginas no-YouTube

## Flujo
1. Detectar plataforma (YouTube, Vimeo, genérico)
2. Extraer transcript (API nativa o scraping)
3. Generar resumen ejecutivo con LLM
4. Extraer tareas, ideas, decisiones
5. Guardar en Engram
6. Mostrar resumen + tareas

## Comandos
```bash
# YouTube
python scripts/transcript_video.py --url "https://youtube.com/watch?v=xxx"

# Resumen + extracción
python scripts/summarize.py --input transcript.txt --output summary.md
```
```

**Paso 2: Crear transcript_video.py**

```python
#!/usr/bin/env python3
"""Extract transcript from YouTube videos."""

import argparse
import json
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

def extract_video_id(url):
    """Extract YouTube video ID from URL."""
    parsed = urlparse(url)
    if parsed.hostname in ['youtu.be']:
        return parsed.path[1:]
    if parsed.hostname in ['www.youtube.com', 'youtube.com']:
        return parse_qs(parsed.query).get('v', [None])[0]
    return None

def get_transcript(url):
    """Get transcript from YouTube video."""
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError(f"Cannot extract video ID from: {url}")
    
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    full_text = " ".join([t['text'] for t in transcript])
    return full_text

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--output", default="transcript.txt")
    args = parser.parse_args()
    
    text = get_transcript(args.url)
    Path(args.output).write_text(text)
    print(f"✅ Transcript guardado: {args.output}")
    print(f"   {len(text)} caracteres, ~{len(text.split())} palabras")
```

**Paso 3: Crear summarize.py**

```python
#!/usr/bin/env python3
"""Summarize transcript and extract actionable items."""

import argparse
import json
from pathlib import Path
from anthropic import Anthropic

SUMMARY_PROMPT = """You are analyzing a video transcript. Provide:

1. **Executive Summary** (3-5 sentences)
2. **Key Takeaways** (bullet points, max 7)
3. **Actionable Items** classified as:
   - Tasks (things to do)
   - Ideas (things to explore)
   - Decisions (things decided)
   - Tools/Technologies mentioned
4. **Quotes** (most impactful 2-3 quotes)

Transcript:
{transcript}

Return as structured markdown."""

def summarize(transcript):
    client = Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{"role": "user", "content": SUMMARY_PROMPT.format(transcript=transcript[:8000])}]
    )
    return response.content[0].text

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", default="summary.md")
    args = parser.parse_args()
    
    transcript = Path(args.input).read_text()
    summary = summarize(transcript)
    Path(args.output).write_text(summary)
    print(f"✅ Resumen: {args.output}")
```

---

### Task 3.2: Integrar con Engram

**Paso 1:** Guardar resumen + tareas extraídas en Engram automáticamente

**Paso 2: Commit**

```bash
git add 01_Personal_Os/00_Core/02_Tools/02_Skills/video-transcript/
git commit -m "feat(skill): video-transcript — Necatificador YouTube → summary + tasks"
```

---

## Fase Final — Validación

### Task F.1: Test end-to-end de cada tool

**Tool 1 (Browser):**
```bash
python browser-automation/scripts/browse.py \
  --url "https://httpbin.org/forms/post" \
  --fill '{"#name":"Test","#email":"test@test.com"}' \
  --screenshot
```
✅ Esperado: Screenshot del form llenado

**Tool 2 (Voice):**
```bash
python voice-capture/scripts/capture.py --duration 10 --output test.wav
python voice-capture/scripts/transcribe.py --input test.wav
python voice-capture/scripts/extract.py --input transcript.txt
```
✅ Esperado: JSON con ítems clasificados

**Tool 3 (Video):**
```bash
python video-transcript/scripts/transcript_video.py --url "https://youtube.com/watch?v=dQw4w9WgXcQ"
python video-transcript/scripts/summarize.py --input transcript.txt
```
✅ Esperado: Resumen markdown + tareas

### Task F.2: Actualizar SKILL_OS.md

Agregar las 3 skills nuevas al dominio **Gathering & Actioning Signals from AI**.

### Task F.3: Commit final

```bash
git add -A
git commit -m "feat(os): add Neko tools — browser-automation, voice-capture, video-transcript"
git push origin master
```

### Task F.4: Guardar en Engram

```python
mem_save(
    title="Neko tools created — browser, voice, video",
    type="architecture",
    topic_key="os/neko-tools",
    content="3 automation tools created: browser-automation (Playwright), voice-capture (Whisper+Engram), video-transcript (YouTube+LLM)"
)
```

---

## Resumen de Entregables

| Tool | Inspiración | Archivos | Dependencias |
|------|-------------|----------|--------------|
| `browser-automation` | Necopanion | SKILL.md + browse.py + patterns.md | Playwright |
| `voice-capture` | Audio to Everything | SKILL.md + capture.py + transcribe.py + extract.py | sounddevice, whisper, anthropic |
| `video-transcript` | Necatificador | SKILL.md + transcript_video.py + summarize.py | youtube-transcript-api, anthropic |

---

## Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Playwright no instala en Windows | Alto | Usar headless=True como fallback, documentar troubleshooting |
| Whisper local es lento | Medio | Usar Whisper API como alternativa, configurar por usuario |
| YouTube bloquea scraping | Medio | Usar youtube-transcript-api (no scraping), fallback a Firecrawl |
| Audio del micrófono no funciona | Bajo | Testear con archivos WAV pre-grabados como fallback |
| Costos de API (Claude + Whisper) | Medio | Documentar estimated costs, ofrecer modos locale/free |

---

*Plan Neko v1.0 — 2026-07-22 — Think Different OS*
