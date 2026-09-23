# Oband_Os - Second Brain

> **Knowledge Layer** - El cerebro que lee, conecta y navega.
> **Think_Different** es el **Executable Layer** - las manos que ejecutan.

## 🎯 Metodología Base Principal: LLM Wiki + AI Research OS

> "Tú guardas → Yo organizo → Tú consultas"

### Arquitectura de Tres Capas (AI Research OS)

```
┌─────────────────────────────────────────────────────────────┐
│                    METODOLOGÍA BASE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. RAW CONTENT (inmutable)                                │
│     └── 01_Capture/01_Raw/                                 │
│         ├── Artículos web                                  │
│         ├── Videos (transcripts)                           │
│         ├── Papers                                        │
│         └── Notas personales                              │
│                                                             │
│  2. INDEX (catálogo)                                       │
│     └── 02_Process/01_LLM_Wiki/index.md                   │
│         ├── Metadata de cada fuente                       │
│         ├── Resúmenes ejecutivos                          │
│         └── Referencias cruzadas                          │
│                                                             │
│  3. WIKI LAYER (derivados LLM)                            │
│     └── 02_Process/01_LLM_Wiki/                           │
│         ├── Entities (personas, herramientas)              │
│         ├── Concepts (ideías, patrones)                   │
│         ├── Comparisons (diferencias)                     │
│         ├── Notes (derivadas de preguntas)                │
│         └── Open Questions (gaps)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Operaciones

| Operación | Input | Output | Frequencia |
|-----------|-------|--------|------------|
| **Ingest** | Source en 01_Raw/ | Páginas wiki + index actualizado | Cuando guardas algo |
| **Query** | Pregunta | Respuesta con citas + nuevas páginas | Cuando consultas |
| **Lint** | Petición | Salud del wiki (contradicciones, orphans) | Mantenimiento |

### Flujo de Trabajo

```
TÚ GUARDAS                    YO ORGANIZO                   TÚ CONSULTAS
    │                              │                              │
    ▼                              ▼                              ▼
┌─────────┐                  ┌─────────┐                  ┌─────────┐
│ 01_Raw/ │ ──── ingest ───► │  Wiki   │ ◄──── query ──── │  Tú     │
│ (fuentes)│                  │ (páginas)│                  │(pregunta)│
└─────────┘                  └─────────┘                  └─────────┘
                                  │
                                  ▼
                            ┌─────────┐
                            │  Index  │
                            │(catálogo)│
                            └─────────┘
```

### Archivos Clave

| Archivo | Propósito | Lectura |
|---------|-----------|---------|
| `02_Process/02_Schema/CLAUDE.md` | Schema y reglas | Primero |
| `02_Process/01_LLM_Wiki/index.md` | Catálogo de contenido | Antes de cada query |
| `02_Process/01_LLM_Wiki/log.md` | Registro cronológico | Para historial |
| `01_Capture/01_Raw/` | Fuentes crudas | Para ingest |

### Para Empezar

1. **Leer schema**: `02_Process/02_Schema/CLAUDE.md`
2. **Guardar source**: En `01_Capture/01_Raw/`
3. **Decir "ingest"**: Al LLM con el nombre del archivo
4. **El LLM organiza**: Crea páginas, actualiza index, registra en log
5. **Consultar**: Hacer preguntas al LLM sobre el wiki

## Web Clipper

### Instalación
1. Ve a Chrome Web Store / Firefox Add-ons
2. Busca "Obsidian Web Clipper"
3. Instala la extensión
4. Configura:
   - **Vault URL:** `obsidian://open?vault=Consequences`
   - **Default folder:** `01_Capture/01_Raw`

### Uso
1. Ve al artículo que quieres guardar
2. Haz clic en el ícono del Web Clipper
3. Selecciona "Clip to Obsidian"
4. El artículo se guardará en `01_Capture/01_Raw/`
5. Abre OpenCode/Claude y di "ingest [nombre del archivo]"

### Atajos de teclado
- `Ctrl+Shift+C` - Clippear selección
- `Ctrl+Shift+F` - Clippear página completa

---

## 🔄 Sincronización OS ↔ Obsidian

| OS (Think_Different) | Obsidian (Now_Invictus/00_Consequences/Consequences) | Estado |
|----------------------|------------------------------------------------------|--------|
| `01_Personal_Os/02_Knowledge/06_Research/` | `02_Process/01_LLM_Wiki/` | ✅ **SYNCED** (2026-08-29) |
| `PLAN_3D_Anticolision.md` | `03_Reference/02_Research/` (si existe) | 🔄 PENDING |

> **Nota:** La sincronización es manual por ahora. El protocolo automático Think_Different ↔ Oband_Os fue eliminado durante la reorganización. Ver `sync_oband_think_different.py` en archivo.

## 📚 Metodologías Adicionales

Además de la **Metodología Base Principal** (LLM Wiki + AI Research OS), el vault integra otras metodologías complementarias:

### 1. AI Research OS (Paul Iusztin)
- **Ubicación:** `03_Reference/02_Research/`
- **Enfoque:** Sistema de investigación personal con three-layer architecture
- **Componentes:** Raw → Index → Wiki
- **Repo:** https://github.com/Pauliusztin/ai-research-os-workshop
- **Ver también:** `02_Process/01_LLM_Wiki/AI_Research_OS.md`

### 2. Steph Ango Method
- **Enfoque:** Sistema de aprendizaje basado en hábitos
- **Ubicación:** Integrado en `04_Daily/` y `03_Reference/`
- **Principio:** Consistencia > intensidad

### 3. Research Skills (Obsidian Integration)
- **Ubicación:** `03_Reference/02_Research/`
- **Skills activos:**
  - `research:research` — Investigación profunda con wiki
  - `research:distill` — Extraer fuentes usadas
  - `research:lint` — Health check del research dir
  - `research:render` — Generar múltiples formatos
  - `research:readwise` — Acceder a highlights
  - `research:nlm` — Interactuar con NotebookLM
  - `research:obsidian` — Gestionar notas de Obsidian

### 4. Categories/MOC (Map of Content)
- **Ubicación:** `03_Reference/04_Playground/`
- **Enfoque:** Hubs transversales que agrupan notas por categorías sin duplicar
- **Hubs:** OS, Conocimiento, Investigación, Dirección
- **Principio:** Una nota vive en UNA carpeta, puede pertenecer a VARIAS categorías

### 5. Zinking Tone (Content Voice)
- **Ubicación:** `03_Reference/01_Knowledge/01_Content/`
- **Enfoque:** Tono de voz para contenido en español
- **Archivo:** `00_Zinking_Tone.md`

### 6. Engram Sync
- **Enfoque:** Sincronización de learnings entre vault y Engram
- **Protocolo:** `mem_save` / `mem_search` para persistencia cross-session

---

### 🔄 Relación entre Metodologías

```
┌─────────────────────────────────────────────────────────────┐
│                    METODOLOGÍA BASE                          │
│              LLM Wiki + AI Research OS                       │
│   (Tú guardas → Yo organizo → Tú consultas)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │ AI Research  │  │ Research    │  │ Categories/MOC  │   │
│  │ OS (Iusztin) │  │ Skills      │  │ (Hubs)          │   │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │
│         │                │                    │             │
│         ▼                ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              03_Reference/                          │   │
│  │  ├── 01_Knowledge/  ← Aprendizajes + Convenciones │   │
│  │  ├── 02_Research/   ← Proyectos de research       │   │
│  │  ├── 03_Archive/    ← Completado                  │   │
│  │  └── 04_Playground/ ← Hubs + Sandbox              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │ Steph Ango   │  │ Zinking     │  │ Engram Sync     │   │
│  │ (Hábitos)    │  │ (Voz)       │  │ (Persistencia)  │   │
│  └─────────────┘  └─────────────┘  └─────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura (7 carpetas)

```
00_Backups_Os/       ← Backups del sistema
├── README.md
└── Winter_Is_Coming/  ← Backup de 00_Winter_is_Coming
    ├── AGENTS.md
    ├── BACKLOG.md
    ├── GOALS.md
    ├── 00_Iron_Man_Gen.md
    ├── 01_Inventario_Total.md
    ├── Skills/
    └── 00_Complemento_Leer/
01_Capture/           ← Lo que entra
├── 01_Raw/           ← Fuentes RAW (tú las guardas aquí)
├── 02_Inbox/         ← Cosas por procesar
└── 03_Attachments/   ← Medios (imágenes, PDFs)

02_Process/           ← Lo que el LLM organiza
├── 01_LLM_Wiki/      ← Wiki (páginas generadas por LLM)
└── 02_Schema/        ← Reglas CLAUDE.md

03_Reference/         ← Lo que ya está organizado
├── 01_Knowledge/     ← Lo que ya aprendí
├── 02_Research/      ← Investigación activa
├── 03_Archive/       ← Completado
└── 04_Playground/    ← Sandbox

04_Daily/             ← Notas diarias
05_Templates/         ← Plantillas
06_Excalidraw/        ← Diagramas
```

## Convenciones

- **Pascal_Case** para todas las carpetas
- **Max 4 subcarpetas** por carpeta
- **Enumeración** en cada nivel (01_, 02_, etc.)
- **Guion bajo** entre palabras

## Principles

1. **One file, one place** - No duplicates
2. **Link, don't copy** - Use wikilinks
3. **Daily notes are ephemeral** - Move learnings to Knowledge/
4. **Templates enforce structure** - Use them always
5. **Think_Different executes** - This brain only reads
6. **Engram syncs** - Learnings persist across sessions

## Sync Protocol

### Principio de Filtrado

Solo se sincroniza información que **sume, sea vital e importante**. Ruido, contenido de baja relevancia y datos no esenciales **no** cruzan la frontera del segundo cerebro.

### Engram ↔ Consequences

```bash
# Guardar learning desde Consequences a Engram (solo lo vital)
mem_save title="[learning]" type="learning" content="[content]"

# Buscar learnings en Engram
mem_search query="[query]"
```

> **Nota:** El protocolo de sincronización Think_Different ↔ Oband_Os (`01_OS/Operations/Scripts/sync_oband_think_different.py`) fue eliminado durante la reorganización a 6 carpetas. El repositorio Think_Different tiene objetos git corruptos y requiere re-clonación antes de cualquier sync futuro.

---

## 🚀 Cómo Usar Cada Metodología (Triggers)

### 1. LLM Wiki + AI Research OS (Metodología Base)

**Trigger:** `"ingest [nombre del archivo]"`

```
TÚ → Guardas source en 01_Capture/01_Raw/
     → Dices "ingest [nombre]"
YO   → Leo el source, creo/actualizo páginas wiki
     → Actualizo index.md y log.md
TÚ   → Consultas haciendo preguntas
```

**Triggers disponibles:**
- `ingest [source]` — Agregar nueva fuente al wiki
- `query [pregunta]` — Consultar el wiki
- `lint` — Revisar salud del wiki
- `status` — Ver estado del wiki

---

### 2. AI Research OS (Paul Iusztin)

**Trigger:** `"research [tema]"`

```
TÚ → Dices "research [tema]"
YO   → Ejecuto deep research algorithm
     → Creo raw files, index, wiki pages
TÚ   → Consultas el wiki resultante
```

**Triggers disponibles:**
- `research [tema]` — Investigación profunda
- `research [tema] light` — Research rápido (1 round, 3 queries)
- `research [tema] fast` — Research medio (2 rounds)
- `research [tema] deep` — Research exhaustivo (múltiples rounds)

---

### 3. Steph Ango Method

**Trigger:** `"daily"` o `"hábito [nombre]"`

```
TÚ → Dices "daily" al inicio del día
YO   → Creo/actualizo nota diaria en 04_Daily/
     → Registro hábitos y metas del día
TÚ   → Al final del día, dices "review daily"
```

**Triggers disponibles:**
- `daily` — Crear/actualizar nota diaria
- `hábito [nombre]` — Registrar hábito específico
- `review daily` — Revisar nota diaria
- `meta [meta]` — Registrar meta del día

---

### 4. Research Skills (Obsidian Integration)

**Trigger:** `research:command`

```
TÚ → Dices "research:research [tema]"
YO   → Ejecuto el skill de research
     → Creo directorio de research
     → Ingreso fuentes
     → Genero research.md
```

**Triggers disponibles:**
| Trigger | Acción |
|---------|--------|
| `research:research [tema]` | Investigación profunda con wiki |
| `research:distill [dir]` | Extraer fuentes usadas |
| `research:lint [dir]` | Health check del research dir |
| `research:render [dir]` | Generar múltiples formatos |
| `research:readwise` | Acceder a highlights |
| `research:nlm` | Interactuar con NotebookLM |
| `research:obsidian` | Gestionar notas de Obsidian |

---

### 5. Categories/MOC (Map of Content)

**Trigger:** `"categorizar [nota] en [categoría]"`

```
TÚ → Dices "categorizar [nota] en [categoría]"
YO   → Agrego la propiedad categories a la nota
     → Actualizo el hub correspondiente
TÚ   → Navegas por hubs en 03_Reference/04_Playground/
```

**Triggers disponibles:**
- `categorizar [nota] en [categoría]` — Agregar categoría a nota
- `hub [categoría]` — Ver todas las notas de una categoría
- `moc` — Ver Map of Content completo

---

### 6. Zinking Tone (Content Voice)

**Trigger:** `"zinking [texto]"`

```
TÚ → Dices "zinking [texto]"
YO   → Aplico el tono Zinking al texto
     → Humanizo, empatico, estratégico
```

**Triggers disponibles:**
- `zinking [texto]` — Transformar texto con tono Zinking
- `voz [tipo]` — Ver ejemplos de voz (blog, email, linkedin)
- `tone [texto]` — Ajustar tono de texto

---

### 7. Engram Sync

**Trigger:** `"mem_save"` o `"mem_search"`

```
TÚ → Dices "mem_save" con contenido
YO   → Guardo en Engram con metadata
TÚ   → Dices "mem_search [query]"
     → Busco en la memoria persistente
```

**Triggers disponibles:**
| Trigger | Acción |
|---------|--------|
| `mem_save [title] [content]` | Guardar en memoria persistente |
| `mem_search [query]` | Buscar en memoria |
| `mem_context` | Ver contexto reciente |
| `mem_session_summary` | Resumen de sesión |

---

### 🔄 Flujo Completo Recomendado

```
1. GUARDAR → 01_Capture/01_Raw/
2. INGEST  → "ingest [nombre]"
3. RESEARCH → "research [tema]" (opcional)
4. CONSULTAR → Hacer preguntas al wiki
5. CATEGORIZAR → "categorizar [nota] en [categoría]"
6. PERSISTIR → "mem_save" para learnings clave
7. REVISAR → "lint" para mantener salud del wiki
```

---

*Oband_Os v3.0 — Metodologías Organizadas — 2026-08-02*
