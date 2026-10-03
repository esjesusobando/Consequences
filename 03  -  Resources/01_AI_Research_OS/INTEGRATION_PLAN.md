# AI Research OS — Plan de Integración con Obsidian Vault

> Fecha: 2026-09-23
> Estado: EN PROCESO
> Metodología: Three-Layer Architecture (Raw → Index → Wiki)

---

## 1. Contexto

### Qué es AI Research OS

AI Research OS es un sistema de 3 capas creado por Paul Iusztin y Louis-François Bouchard que convierte un Second Brain en una **memoria de investigación viva** que los agentes AI mantienen.

**Repo:** `iusztinpaul/ai-research-os-workshop` (154★, 28 forks)

### Estado Actual

| Componente | Estado | Detalle |
|------------|--------|---------|
| Skills instaladas | ✅ Listas | 7 skills en `.claude/skills/` |
| `01_AI_Research_OS/` | 📝 Integrado | 45 archivos, 5 fuentes |
| `02_Coding_Agent_Architectures/` | ✅ Completado | 3 fuentes, 19+ wiki pages |
| `06_Process/01_LLM_Wiki/` | ✅ 12 páginas | Referencian los skills |
| Pipeline `/research` | ⚠️ Pendiente | Ejecutar por primera vez |
| Readwise sync | ⚠️ Pendiente | `research:readwise` no ejecutado |
| NotebookLM sync | ⚠️ Pendiente | `research:nlm` no ejecutado |

---

## 2. Arquitectura Target

```
Consequences/ (Obsidian Vault)
│
├── 03_Resources/
│   ├── 01_AI_Research_OS/          ← AI Research OS workshop
│   │   ├── raw/                    ← Capa 1: Fuentes inmutables
│   │   │   ├── 2026-07-30-youtube-convierte-10994-notas-en-memoria.md
│   │   │   ├── transcript-autogenerado.md
│   │   │   └── index.md
│   │   ├── wiki/                   ← Capa 3: Síntesis LLM
│   │   │   ├── sources/
│   │   │   ├── concepts/
│   │   │   ├── entities/
│   │   │   ├── comparisons/
│   │   │   ├── open-questions.md
│   │   │   └── index.md
│   │   ├── example_1_deep_research/    ← Ejemplo completado
│   │   ├── example_3_ingest_links/     ← Ejemplo completado
│   │   ├── index.yaml              ← Capa 2: Catálogo central
│   │   ├── index.md
│   │   ├── seeds.json
│   │   ├── deduped.json
│   │   └── discovery-results.json
│   │
│   ├── 02_Coding_Agent_Architectures/ ← Investigación completada ✅
│   │   ├── raw/
│   │   ├── wiki/ (19+ pages)
│   │   └── index.yaml / index.md
│   │
│   └── 03_Custom_URLs/              ← En proceso
│
├── 06_Process/
│   ├── 01_LLM_Wiki/               ← Wiki de conocimiento
│   │   ├── 01_AI_Research_OS.md   ← Página principal
│   │   ├── 08_Paul_Iusztin.md
│   │   ├── 05_Louis-François_Bouchard.md
│   │   └── ... (12 pages total)
│   └── 02_Schema/
│       ├── 01_CLAUDE.md           ← Schema del vault
│       └── 02_Index.md
│
└── .claude/skills/                ← Skills instaladas
    ├── research/                  ← /research
    ├── research-distill/          ← /research:distill
    ├── research-lint/             ← /research:lint
    ├── research-render/           ← /research:render
    ├── nlm-skill/                 ← /research:nlm
    ├── obsidian-cli/              ← /research:obsidian
    └── readwise-cli/              ← /research:readwise
```

---

## 3. Plan de Integración por Fases

### Fase 1: Verificación de Skills (DONE ✅)

**Objetivo:** Confirmar que todas las skills están instaladas y accesibles.

**Acciones:**
- ✅ Skills copiadas a `.claude/skills/`
- ✅ `research` skill verificado (931 líneas, 7 modos)
- ✅ `research-distill` skill verificado (195 líneas)
- ✅ `research-lint` skill verificado
- ✅ `research-render` skill verificado
- ✅ `research:nlm`, `research:obsidian`, `research:readwise` verificadas

**Verificación:**
```bash
ls .claude/skills/
# Resultado: nlm-skill, obsidian-cli, readwise-cli, research, research-distill, research-lint, research-render
```

---

### Fase 2: Ingest Inicial con `/research:init` (⏳ PENDIENTE)

**Objetivo:** Ejecutar el pipeline de research para `01_AI_Research_OS` por primera vez para generar las páginas del wiki que faltan.

**Comando:**
```
/research init --topic "AI Research OS" --path 03_Resources/01_AI_Research_OS
```

**Pipeline esperado:**
1. **Step 0 - Route**: Clasificar como `init` mode
2. **Step 1 - Seed**: Usar `seeds.json` (1 seed de YouTube)
3. **Step 2 - Discovery**: Buscar fuentes adicionales (github repo, web)
4. **Step 3-5 - Research**: Deep research sobre AI Research OS
5. **Step 6-8 - Generate**: Crear wiki pages (sources, concepts, entities, comparisons)

**Resultado esperado:**
- `total_wiki_pages: 0` → `total_wiki_pages: 15+`
- `wiki/sources/` ← Contenido poblado
- `wiki/concepts/` ← Conceptos extraídos
- `wiki/entities/` ← Entidades (Paul Iusztin, Louis-François Bouchard, tools)
- `wiki/comparisons/` ← Comparaciones entre approaches

---

### Fase 3: Integración de Fuentes Externas (⏳ PENDIENTE)

**Objetivo:** Conectar las fuentes de conocimiento existentes al sistema Research OS.

#### 3a. Readwise → Research
**Comando:** `/research:readwise`

**Acción:** Sincronizar highlights de Readwise con el vault.
- Readwise tiene highlights que deberían alimentar `raw/readwise/`
- Cada highlight se convierte en una fuente research

**Fuente existente:**
- `02_Areas/00_Engram_Sync.md` — Ya referencia Readwise
- `06_Process/01_LLM_Wiki/10_Readwise.md` — Página sobre Readwise

#### 3b. NotebookLM → Research
**Comando:** `/research:nlm`

**Acción:** Conectar NotebookLM collections al vault.
- Collection de investigación debe alimentar `raw/nlm/`
- Transcripciones de sesiones

#### 3c. Obsidian CLI → Research
**Comando:** `/research:obsidian`

**Acción:** Gestión programática del vault mediante Obsidian CLI.
- Crear notas automáticamente
- Organizar archivos por tags
- Query del vault existente

#### 3d. GitHub Repos → Research
**Comando:** `/research` (mode: deep)

**Acción:** Ingest de repositorios relevantes.
- `iusztinpaul/ai-research-os-workshop`
- Otros repos de Decoding AI

---

### Fase 4: Lint y Mantenimiento (⏳ PENDIENTE)

**Objetivo:** Verificar la salud del wiki y mantenerlo sincronizado.

**Comando:** `/research:lint`

**Acciones:**
1. Verificar que todas las `index.yaml` son consistentes
2. Verificar cross-references entre páginas
3. Encontrar orphan pages
4. Verificar que todos los sources tienen对应的 wiki pages
5. Reportar problemas y sugerir correcciones

**Frecuencia:** Semanal o después de cada ingest significativo

---

### Fase 5: Render y Visualización (⏳ PENDIENTE)

**Objetivo:** Generar visualizaciones del conocimiento.

**Comando:** `/research:render`

**Acciones:**
1. **Research.md** — Distilled appendix de cada research topic
2. **Marp slides** — Presentaciones del conocimiento
3. **Obsidian Canvas** — Mapas visuales del vault
4. **Graph visualization** — Dependencias entre conceptos

**Output esperado:**
- `01_AI_Research_OS/research.md` — Resumen ejecutivo
- `03  -  Resources/01_AI_Research_OS/media/research-graph.png` — Mapa de conocimiento

---

### Fase 6: Integración con LLM Wiki (⏳ PENDIENTE)

**Objetivo:** Conectar el AI Research OS con el LLM Wiki existente.

**Acción:** Actualizar `06_Process/01_LLM_Wiki/01_AI_Research_OS.md` con referencias a:
- Las wiki pages generadas por `/research`
- Los concepts y entities del `01_AI_Research_OS/wiki/`
- Los sources del `raw/`

**Cross-references a actualizar:**
```markdown
## Relacionado (agregar)
- [[03  -  Resources/01_AI_Research_OS/wiki/sources|AI Research OS Sources]]
- [[03  -  Resources/01_AI_Research_OS/wiki/concepts|AI Research OS Concepts]]
- [[03  -  Resources/01_AI_Research_OS/wiki/entities|AI Research OS Entities]]
```

---

## 4. Fuentes Existentes a Integrar

### Fuentes ya en el vault que pueden alimentar Research:

| Fuente | Ubicación actual | Type | Target Research |
|--------|-----------------|------|-----------------|
| YouTube transcript | `01_AI_Research_OS/raw/` | video | AI Research OS |
| Engram sync notes | `02_Areas/00_Engram_Sync.md` | knowledge | General |
| Readwise highlights | `06_Process/01_LLM_Wiki/10_Readwise.md` | highlights | General |
| Coding Agent research | `02_Coding_Agent_Architectures/` | github repos | Agent architectures |
| Graph Engineering | `03  -  Resources/08_Graph_Engineering/` | github repo | Graph systems |
| Custom URLs | `03  -  Resources/03_Custom_URLs/` | web links | Various |
| Deep Research examples | `03  -  Resources/04_Deep_Research_Example/` | research | Various |

---

## 5. Convenciones y Reglas

### Para toda nueva investigación:

1. **Siempre** ejecutar `/research` en modo `append` o `deep` — nunca manualmente
2. **Siempre** actualizar `index.yaml` después de cada ingest
3. **Nunca** modificar archivos en `raw/` después de ingestión
4. **Siempre** ejecutar `/research:lint` después de completar una investigación
5. **Siempre** generar `/research:render` para visualizar resultados
6. **Siempre** cross-referencear con `06_Process/01_LLM_Wiki/`

### Para el vault Obsidian:

1. **Passthrough** notes (sin frontmatter) → `raw/`
2. **Wiki pages** (con frontmatter YAML) → `wiki/`
3. **Index files** → `index.yaml` + `index.md`
4. **Todos** los archivos deben tener `categories: [03_Resources]` en frontmatter

---

## 6. Checklist de Integración

- [ ] Fase 1: Skills verificadas ✅
- [ ] Fase 2: `/research:init` ejecutado para `01_AI_Research_OS`
- [ ] Fase 3a: `/research:readwise` sincronizado
- [ ] Fase 3b: `/research:nlm` conectado
- [ ] Fase 3c: `/research:obsidian` configurado
- [ ] Fase 3d: `/research` deep para repos adicionales
- [ ] Fase 4: `/research:lint` ejecutado y limpio
- [ ] Fase 5: `/research:render` generado
- [ ] Fase 6: LLM Wiki actualizado con cross-references
- [ ] `01_AI_Research_OS/index.yaml`: `total_wiki_pages` actualizado
- [ ] Todos los `index.md` de `03  -  Resources/` consistentes
- [ ] `02_Areas/index.md` categories actualizado a `[03_Resources]`

---

## 7. Estado de la Integración

| Fecha | Acción | Estado |
|-------|--------|--------|
| 2026-09-23 | Estructura de carpetas creada | ✅ |
| 2026-09-23 | Skills copiadas a `.claude/skills/` | ✅ |
| 2026-09-23 | Examples 1 y 3 copiados | ✅ |
| 2026-09-23 | Media (slides/diagrams) copiado | ✅ |
| 2026-09-23 | `index.yaml` y `index.md` actualizados | ✅ |
| 2026-09-23 | Este plan creado | ✅ |
| **PENDIENTE** | `/research:init` ejecutado | ⏳ |
| **PENDIENTE** | `/research:readwise` sincronizado | ⏳ |
| **PENDIENTE** | `/research:nlm` conectado | ⏳ |
| **PENDIENTE** | `/research:lint` ejecutado | ⏳ |

---

## 8. Referencias

- **Repo:** https://github.com/iusztinpaul/ai-research-os-workshop
- **Video:** https://www.youtube.com/watch?v=ZRM_TfEZcIo
- **Skills:** `.claude/skills/research/SKILL.md`
- **Workshop docs:** `01_AI_Research_OS/README_workshop.md`
- **Conventions:** `01_AI_Research_OS/wiki/sources/`

---

*Última actualización: 2026-09-23*
*Próxima acción: Ejecutar `/research:init` para poblar el wiki de AI Research OS*
