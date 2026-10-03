# LLM Wiki Schema

> Patrón Karpathy: El LLM es el programador, Obsidian es el IDE, el wiki es el codebase.

## Estructura del Vault

```
00_Inbox/           ← Lo que entra
├── 01_Raw/           ← Fuentes RAW (tú las guardas aquí)
├── 02_Inbox/         ← Cosas por procesar
└── 03_Attachments/   ← Medios (imágenes, PDFs)

06_Process/           ← Lo que el LLM organiza
├── 01_LLM_Wiki/      ← Wiki (páginas generadas por LLM)
│   ├── index.md      ← Catálogo de contenido
│   ├── log.md        ← Registro cronológico
│   ├── [entity].md   ← Páginas de entidades
│   ├── [concept].md  ← Páginas de conceptos
│   └── [source].md   ← Resúmenes de fuentes
└── 02_Schema/        ← Reglas (este archivo)
    └── CLAUDE.md

03_Resources/         ← Lo que ya está organizado
├── 01_AI_Research_OS ← Motor de investigación AI
├── 02_Coding_Agent_Architectures ← Arquitecturas de agentes
├── 03_Custom_URLs    ← URLs personalizados
├── 04_Deep_Research_Example ← Investigación activa
├── 05_Playground     ← Sandbox
├── 06_Migracion_Segundo_Cerebro ← Plan de migración
├── 07_From_Think_Different ← Contenido migrado desde Think_Different
├── 08_Graph_Engineering ← Ingeniería de grafos
├── 09_Platzi         ← Cursos Platzi (6 cursos + transcript)
├── 10_Templates      ← Plantillas de documentos
└── 11_Excalidraw     ← Diagramas y visualizaciones

04_Archive/            ← Archivo histórico (Backups, Context_Memory, Obsidian_Pre_Backup)
05  -  Daily/              ← Notas diarias (YYYY-MM/DDD.md)
```

## Flujo de Trabajo

### 1. INGEST (Tú guardas → Yo organizo)
```
Tú: Guardas artículo en 00_Inbox/01_Raw/archivo.md
Tú: Dices "ingest archivo.md"
Yo: Leo → Creo páginas en 06_Process/01_LLM_Wiki/ → Actualizo index.md → Registro en log.md
```

### 2. QUERY (Tú preguntas → Yo respondo)
```
Tú: "¿Qué es X?"
Yo: Busco en index.md → Leo páginas → Respondo con citas
```

### 3. LINT (Yo mantengo el wiki sano)
```
Tú: "Lint el wiki"
Yo: Busco problemas → Te doy reporte → Arreglo si quieres
```

## Reglas

1. **NUNCA modificar 00_Inbox/01_Raw/** - Solo lectura
2. **SIEMPRE actualizar index.md** después de cada cambio
3. **SIEMPRE registrar en log.md** después de cada operación
4. **USAR frontmatter YAML** en todas las páginas
5. **MANTENER cross-references** - Cada página linked
6. **CITAR fuentes** - Todo claim tiene source

## Formato de páginas

```markdown
---
tags: [entity|concept|source]
date: YYYY-MM-DD
source_count: N
status: active
---

# Título

## Resumen
[1-2 párrafos]

## Contenido
[Detalle]

## Relacionados
- [[otra_página]]

## Fuentes
- [[fuente]]
```
