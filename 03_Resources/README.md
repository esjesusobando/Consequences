# 06_Research

Cerebro de investigación viva — metodología **AI Research OS** (Paul Iusztin).

> El vault NO es un almacén de documentos: es una memoria de investigación que el agente mantiene, actualiza y consulta. Tú defines los temas (`seeds`), el agente descubre fuentes, las sintetiza en `wiki/` y mantiene el `index.yaml` como catálogo consultable.

---
## Proyectos

- [[03_Reference/02_Research/01_AI_Research_OS/index|01 - AI Research OS]] - video de Paul Iusztin sobre el sistema
- [[03_Reference/02_Research/02_Coding_Agent_Architectures/index|02 - Coding Agent Architectures]] - opencode vs pi vs hermes-agent
- [[03_Reference/02_Research/03_Custom_URLs/index|03 - Custom URLs]] - agent memory, agentic coding, GraphRAG
- [[03_Reference/02_Research/05_Migracion_Segundo_Cerebro/PLAN|05 - Migración Segundo Cerebro]] - plan SOTA: Think_Different → Oband_Os

---


## 1. Cómo funciona (el pipeline)

```
tú (seeds.json) → research:research (query) → descubrimiento (nlm, github, youtube, pdf, web)
                                        │
                                        ▼
                                  raw/  (fuentes inmutables descargadas)
                                        │
research:distill ──────────────────────►│
                                        ▼
                                  wiki/  (síntesis por fuente + conclusiones)
                                        │
research:lint ──► valida estructura y enlaces
research:render ► genera formatos (deck, chart, canvas, brief) desde wiki/
```

| Capa      | Qué es                                              | Editable |
| --------- | --------------------------------------------------- | -------- |
| `seeds.json` | Semillas iniciales del tema (títulos, URLs, preguntas) | tú       |
| `raw/`    | Fuentes originales inmutables: PDFs, transcripts, repos clonados, capturas | NO, solo lectura |
| `wiki/`   | Notas de síntesis: una por fuente + conclusiones del tema | el agente; tú editas y enlazas |
| `index.yaml` | Catálogo de fuentes con metadatos, para el agente   | solo scripts |
| `index.md` | El mismo catálogo en formato legible, para ti       | solo scripts (regenerar con build_index_md.py) |

Los scripts Python se ejecutan con `uv run --script` (PEP 723): `uv` instala las dependencias declaradas en cada script automáticamente. No necesitas entornos virtuales ni `pip install`.

---

## 2. Cómo usar con el agente

Todos los comandos son skills invocables con el prefijo `research:` (igual que `ce:` en Compound Engineering). `working-dir` es esta misma carpeta (`03_Reference/02_Research/`): cada tema crea `03_Reference/02_Research/NN_Name_Pascal_Case/` según la convención de la sección 5.

### Referencia de comandos (skills `research:*`)

| Skill | Qué hace | Ejemplos |
| ----- | -------- | -------- |
| `research:research` | Skill principal (punto de entrada). Enruta entre 4 modos según lo que pidas: **init** (crear tema), **query** (descubrir fuentes y descargarlas a `raw/`), **append** (añadir semillas a un tema existente), **deep** (más rondas de descubrimiento) y también responde preguntas consultando el `wiki/` existente. | 1. "Investiga RAG evaluators y crea el tema" (init) · 2. "¿Qué dice nuestro wiki sobre GraphRAG?" (pregunta) |
| `research:distill` | Lee `raw/` (fuentes inmutables descargadas) y escribe la síntesis en `wiki/` — una nota por fuente + conclusiones del tema. Es el paso que convierte material crudo en conocimiento consultable. | 1. "Destila el tema 02_Coding_Agent_Architectures" · 2. "Haz el distill de las fuentes de GraphRAG" |
| `research:lint` | Valida la estructura de un tema: nombre y layout de carpetas, enlaces rotos, referencias wiki correctas, contradicciones. Reporta; edita solo lo seguro (flags) y avisa de lo que necesita decisión. | 1. "Haz lint del tema 01_AI_Research_OS" · 2. "Revisa si hay enlaces rotos en mi wiki de RAG" |
| `research:render` | Genera formatos de salida desde páginas del `wiki/`: slide deck (Marp), chart (matplotlib), canvas (Obsidian), brief de contenido social. Salida en `wiki/renders/<formato>/`. Puede generar varios formatos a la vez y es idempotente. | 1. "Renderiza comparación BM25 vs híbrido como deck de 5 slides" · 2. "Crea un chart y un canvas del overview de GraphRAG" |
| `research:obsidian` | Conector con Obsidian (CLI): crear/leer/apuntar notas del vault, comandos de la app, enlaces y tags. Requiere Obsidian abierto y `OBSIDIAN_CLI` configurada. | 1. "Crea una nota en 03_Reference/02_Research sobre X" · 2. "Lista los tags del vault" |
| `research:readwise` | Conector con Readwise/Reader: importa highlights y documentos como fuentes de investigación. No instalado aún (`npm install -g @readwise/cli` + token). | 1. "Trae mis highlights de Readwise sobre LLM evals" · 2. "Importa este documento de Reader a mi investigación" |
| `research:nlm` | Conector con NotebookLM: usa notebooks como fuente — consulta el notebook, extrae citas con su fuente y las guarda como notas inmutables con referencia en `raw/`. | 1. "Consulta mi notebook de agentes y guarda las citas" · 2. "Extrae 5 citas con fuente de la transcripción" |

### Ciclo básico (recomendado)

1. **`research:research` con modo init** — crea el directorio del tema con las semillas. Ejemplo: "Crea el tema RAG evaluators" o `research:research init "RAG evaluators"`
2. **`research:research` con modo query** — el agente descubre fuentes (NotebookLM, GitHub, YouTube, PDFs, web), las evalúa por relevancia, las descarga a `raw/` y actualiza el índice. Ejemplo: "Investiga RAG evaluators y descarga las fuentes"
3. **`research:distill <tema>`** — el agente lee `raw/` y escribe la síntesis en `wiki/`.
4. **`research:research <tema>` (pregunta)** — consulta el wiki existente y responde; cada pregunta deja traza en el wiki (notas, comparaciones, conceptos nuevos).
5. **`research:render <tema>`** — genera formatos de salida desde el wiki: slide deck (Marp), chart (matplotlib), canvas (Obsidian), brief de contenido social. Opcional.
6. **`research:lint <tema>`** — validación final: estructura, enlaces rotos, referencias wiki correctas.

### Modos de la skill `research:research`

| Modo        | Cuándo usarlo                                          | Ejemplo |
| ----------- | ------------------------------------------------------ | ------- |
| `init`      | Crear un tema nuevo desde cero.                        | "Crea el tema 05_GraphRAG_Basics" |
| `query`     | Ronda de descubrimiento (1 ronda por defecto).         | "Descubre fuentes sobre agent memory" |
| `deep`      | Más rondas de descubrimiento sobre el mismo tema (sigue usando las fuentes ya encontradas como contexto). | "Investiga más profundo sobre coding agents" |
| `append`    | Añadir más semillas a un tema existente y seguir investigando. | "Añade este paper a RAG evaluators" |

### Nota sobre notebooks de NotebookLM

Si usas NotebookLM (`nlm`), los notebooks son la forma más rápida de alimentar `raw/`: el agente consulta el notebook, extrae citas con su fuente y las guarda como notas inmutables con referencia.

---

## 3. Integraciones instaladas (estado 2026-07-30)

| Conector     | Estado  | Qué hace                                            | Cómo se activa |
| ------------ | ------- | --------------------------------------------------- | -------------- |
| `uv`         | ✅ listo | Runtime de los scripts Python                        | `uv` 0.10.4 en PATH |
| `nlm`        | ✅ listo | NotebookLM: notebooks como fuente de investigación   | v0.3.11 en `~/.local/bin/nlm` (necesita auth de Google en su primera ejecución) |
| `obsidian-cli` | ✅ listo | Crear/leer/apuntar notas del vault desde el agente   | Obsidian 1.13.4 en `C:\Program Files\Obsidian\Obsidian.com`; `OBSIDIAN_CLI` configurada; CLI habilitado en Settings > General > Advanced ✅ |
| `readwise-cli` | ❌ no instalado | Readwise/Reader: highlights y documentos como fuente | `npm install -g @readwise/cli` + token de https://readwise.io/access_token |
| `raindrop`   | ❌ no soportado | Bookmarks de Raindrop.io como fuente                 | El repo NO incluye un conector Raindrop (solo nlm, obsidian, readwise). Se podría añadir con la API pública de Raindrop.io |

### Detalle: obsidian-cli (verificado ✅)

- Binario: `C:\Program Files\Obsidian\Obsidian.com` (no está en la ruta default que asume la skill → se fijó `OBSIDIAN_CLI`).
- El vault registrado en Obsidian se llama `.obsidian` (raíz `Consequences\.obsidian`); `Oband_Os/` es una subcarpeta.
- Comandos útiles: `obsidian create path=03_Reference/02_Research/...`, `obsidian append`, `obsidian links`, `obsidian tags`, `obsidian command`, `obsidian help`.
- Requiere que Obsidian esté ABIERTO durante el uso (el CLI se comunica con la app en ejecución).
- Verificación realizada: `create name=... path="03_Reference/02_Research/test-cli.md"` → creó el archivo correctamente; luego se eliminó.

---

## 4. Requisitos del sistema (resumen)

- **`uv`** en PATH — ✅ 0.10.4
- **Obsidian 1.12.7+** con CLI habilitado — ✅ 1.13.4, CLI habilitado
- **`OBSIDIAN_CLI`** apuntando al binario — ✅ `C:\Program Files\Obsidian\Obsidian.com`
- Skills instaladas en el vault: `.claude/skills/` y `.opencode/skills/`
- **Opcional**: Readwise CLI (no instalado), Raindrop (no soportado en el repo)

---

## 5. Convenciones de trabajo

- **Naming (MANDATORY)**: cada tema = `03_Reference/02_Research/NN_Name_Pascal_Case/` — prefijo numérico de 2 dígitos en orden de creación (`01_`, `02_`, ...) + Pascal_Case con guion bajo. Ejemplos: `01_AI_Research_OS`, `02_Coding_Agent_Architectures`. Nada de kebab-case, espacios ni guiones.
- Archivos internos: prefijo `YYYY-MM-DD_` cuando la fecha importa + Pascal_Case con guion bajo (ej. `2026-07-30_YouTube_Titulo.md`).
- `raw/` NO se edita: las fuentes se enlazan o citan, nunca se reescriben.
- `index.yaml` es la fuente de verdad para el agente; `index.md` se regenera con `build_index_md.py`.
- Al finalizar un tema relevante, mueve conclusiones a `03_Reference/01_Knowledge/` o enlázalas desde ahí (regla: link, don't copy).
- Si una investigación se vuelve un proyecto, pásala a `03_Reference/04_Playground/` o `03_Reference/03_Archive/` al archivarla.

## 6. Ejemplos incluidos (del repo oficial)

| Carpeta | Origen | Qué contiene |
| ------- | ------ | ------------ |
| `01_AI_Research_OS` | nuestro tema (transcript del video) | seed + raw + index generados |
| `02_Coding_Agent_Architectures` | `examples/example_2_github` | wiki completo de 3 repos (OpenCode, Pi, Hermes): index, log, wiki/repos, concepts, entities, comparisons |
| `03_Custom_URLs` | `examples/example_3_ingest_links` | ingest de 3 links web con raw/ + wiki/sources |
| `04_Deep_Research_Example` | `examples/example_1_deep_research` | prompt.md de ejemplo + placeholder de brain dump |

Los ejemplos 2 y 3 son resultados reales del pipeline: sirven como referencia de cómo debe verse un tema completo (estructura wiki/ con sources, concepts, entities, comparisons, overview, synthesis, open-questions).

> **Nota sobre los ejemplos**: `02_Coding_Agent_Architectures` y `03_Custom_URLs` son salidas reales del pipeline generadas en la máquina del autor original. Su `lint_broken_links` reporta enlaces rotos hacia rutas del autor (`8 - Projects/Building Your Own AI Research OS/...`) y algunos nombres de archivo en kebab-case. Son **referencia de estructura**, no temas activos: si quieres reutilizarlos, copia el contenido a un tema nuevo con la convención de nombrado de este vault.
