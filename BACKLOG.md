# Backlog — Oband_Os (Second Brain) v3.0

> **Última actualización:** 2026-09-22 (migración Daily→04_Daily completada)
> **Sistema:** Oband_Os — Conocimiento, investigación y diario
> **Metodología Base:** LLM Wiki + AI Research OS + Engram Sync
> **Ubicación:** `C:\Users\sebas\Desktop\Now_Invictus\00_Consequences\Consequences\`
> **Vault Obsidian:** `obsidian://open?vault=Consequences`
> **Estado:** ACTIVE — Sistema operativo, backlog activo

---

## 📚 Metodologías Activas

| Metodología | Trigger | Ubicación | Estado |
|------------|---------|-----------|--------|
| **LLM Wiki + AI Research OS** | `ingest [source]` | `02_Process/01_LLM_Wiki/` | ✅ OPERATIVO |
| **AI Research OS (Paul Iusztin)** | `research [tema]` | `03_Reference/02_Research/` | ✅ OPERATIVO |
| **Steph Ango Method** | `daily` / `hábito [nombre]` | `04_Daily/` | ✅ OPERATIVO |
| **Research Skills (Obsidian)** | `research:command` | `03_Reference/02_Research/` | ✅ OPERATIVO |
| **Categories/MOC** | `categorizar [nota] en [categoría]` | `03_Reference/04_Playground/` | ✅ OPERATIVO |
| **Zinking Tone** | `zinking [texto]` | `03_Reference/01_Knowledge/01_Content/` | ✅ OPERATIVO |
| **Engram Sync** | `mem_save` / `mem_search` | `03_Reference/01_Knowledge/Engram_Sync.md` | ✅ OPERATIVO |

---

## 🚨 P0 — CRÍTICO

| # | Ítem | Descripción | Owner | Estado |
|---|------|-------------|-------|--------|
| 1 | **Ingest Pipeline** | Implementar ingest automático: source → wiki → index | LLM | ✅ OPERATIVO |
| 2 | **Daily Notes System** | Notas diarias en `04_Daily/YYYY-MM-DD.md` | Usuario | ✅ OPERATIVO |
| 3 | **Research Skills Integration** | Integrar `research:research`, `research:distill`, `research:lint`, `research:render`, `research:readwise`, `research:nlm`, `research:obsidian` | LLM | ✅ OPERATIVO |

---

## ⚡ P1 — ALTA PRIORIDAD

| # | Ítem | Descripción | Ubicación | Estado |
|---|------|-------------|-----------|--------|
| 4 | **LLM Wiki Sync** | Mantener `02_Process/01_LLM_Wiki/index.md` actualizado con las fuentes procesadas | `02_Process/01_LLM_Wiki/` | ✅ OPERATIVO |
| 5 | **Index.md Mantenimiento** | Actualizar `03_Reference/02_Research/index.md` con nuevos artifacts | `03_Reference/02_Research/` | ✅ OPERATIVO |
| 6 | **Obsidian.md Wiki** | Mantener `02_Process/01_LLM_Wiki/Obsidian.md` actualizado con notas del vault | `02_Process/01_LLM_Wiki/Obsidian.md` | ✅ OPERATIVO |
| 7 | **Web Clipper Setup** | Configurar Obsidian Web Clipper extensión para captura rápida | `01_Capture/01_Raw/` | ✅ CONFIGURADO |

---

## 📋 P2 — MEDIA PRIORIDAD

| # | Ítem | Descripción | Ubicación | Estado |
|---|------|-------------|-----------|--------|
| 8 | **AI Research OS Deep Dive** | Implementar `03_Reference/02_Research/01_AI_Research_OS/` completamente | `03_Reference/02_Research/` | 📝 EN PROGRESO |
| 9 | **Categories/MOC Hubs** | Completar `03_Reference/04_Playground/` con hubs: OS, Conocimiento, Investigación, Dirección | `03_Reference/04_Playground/` | 📝 EN PROGRESO |
| 10 | **Knowledge Base Consolidation** | Consolidar `03_Reference/01_Knowledge/` con patterns, conventions, learnings | `03_Reference/01_Knowledge/` | 📝 EN PROGRESO |
| 11 | **NotebookLM Integration** | Conectar `research:nlm` skill con vault para transcripciones y notas | `02_Process/01_LLM_Wiki/NotebookLM.md` | 📝 EN PROGRESO |
| 12 | **Readwise Sync** | Sincronizar highlights de Readwise con el vault | `03_Reference/01_Knowledge/` | 📝 EN PROGRESO |
| 13 | **Engram ↔ Obsidian Sync** | Automatizar sincronización de learnings clave entre vault y Engram | `03_Reference/01_Knowledge/Engram_Sync.md` | 📝 EN PROGRESO |
| 14 | **Daily Review Workflow** | Implementar flujo `daily` → `review daily` → `meta [meta]` completo | `04_Daily/` | 📝 EN PROGRESO |

---

## 🧊 P3 — BACKLOG FRÍO

| # | Ítem | Descripción | Ubicación | Estado |
|---|------|-------------|-----------|--------|
| 15 | **MIGRATION_NOTE.md** | Verificar y actualizar `03_Reference/02_Research/MIGRATION_NOTE.md` | `03_Reference/02_Research/` | 📝 PENDIENTE |
| 16 | **Zinking Tone Full Integration** | Completar integración de `03_Reference/01_Knowledge/01_Content/00_Zinking_Tone.md` | `03_Reference/01_Knowledge/01_Content/` | 📝 PENDIENTE |
| 17 | **Daily Notes Archival** | Mover notas diarias antiguas de `04_Daily/` a `03_Reference/03_Archive/` | `04_Daily/`, `03_Reference/03_Archive/` | 📝 PENDIENTE |
| 18 | **Graph Engineering** | Implementar `03_Reference/02_Research/07_Graph_Engineering/` | `03_Reference/02_Research/` | 📝 PENDIENTE |
| 19 | **Obsidian CLI Integration** | Usar `research:obsidian` skill para gestión programmatica del vault | `03_Reference/02_Research/` | 📝 PENDIENTE |
| 20 | **Steph Ango Method Full** | Implementar flujo completo de hábitos y revisión diaria | `04_Daily/` | 📝 PENDIENTE |

---

## 🔧 Pendientes Técnicos

| Ítem | Descripción | Prioridad | Estado |
|------|-------------|-----------|--------|
| **Vault Sync** | Sincronización bidireccional `Consequences` ↔ `Now_Invictus` | Alta | 📝 PENDIENTE |
| **CLAUDE.md Schema** | Verificar `02_Process/02_Schema/CLAUDE.md` actualizado | Media | ✅ OPERATIVO |
| **Web Clipper Config** | URL `obsidian://open?vault=Consequences` + Default folder `01_Capture/01_Raw` | Baja | ✅ CONFIGURADO |
| **Research Skills Validation** | Verificar que todos los `research:*` skills funcionen correctamente | Media | 📝 PENDIENTE |
| **Daily Note 2026-09-22** | Crear nota diaria de hoy en `04_Daily/2026-09/2026-09-22.md` | Alta | ✅ CREADO |

---

## 📁 Estructura del Sistema

```
Consequences/
├── 01_Capture/           ← Lo que entra
│   ├── 01_Raw/           ← Fuentes RAW (tú las guardas aquí)
│   ├── 02_Inbox/         ← Cosas por procesar
│   └── 03_Attachments/   ← Medios (imágenes, PDFs)
│
├── 02_Process/           ← Lo que el LLM organiza
│   ├── 01_LLM_Wiki/     ← Wiki (páginas generadas por LLM)
│   │   ├── index.md     ← Catálogo de contenido
│   │   ├── index.yaml   ← Índice YAML
│   │   ├── Log.md       ← Registro cronológico
│   │   └── Obsidian.md  ← Notas de Obsidian
│   └── 02_Schema/       ← Reglas y schema
│       └── CLAUDE.md
│
├── 03_Reference/         ← Lo que ya está organizado
│   ├── 01_Knowledge/    ← Lo que ya aprendí
│   ├── 02_Research/     ← Investigación activa
│   ├── 03_Archive/      ← Completado
│   └── 04_Playground/   ← Hubs + Sandbox
│
├── 04_Daily/             ← Notas diarias
│   └── 2026-09/        ← Notas del mes
│       ├── 2026-09-20.md
│       ├── 2026-09-21.md
│       └── 2026-09-22.md ← TODAY
│
├── 05_Templates/         ← Plantillas
├── 06_Excalidraw/       ← Diagramas
├── README.md            ← Este archivo
└── BACKLOG.md           ← Este backlog
```

---

## 🔄 Flujo de Trabajo Recomendado

```
1. GUARDAR → 01_Capture/01_Raw/
2. INGEST  → "ingest [nombre]"
3. RESEARCH → "research [tema]" (opcional)
4. CONSULTAR → Hacer preguntas al wiki
5. CATEGORIZAR → "categorizar [nota] en [categoría]"
6. PERSISTIR → "mem_save" para learnings clave
7. REVISAR → "lint" para mantener salud del wiki
8. DIARIO → "daily" para crear nota diaria
```

---

## 🔗 Relación con Think_Different

| Oband_Os (Obsidian) | Think_Different | Estado |
|---------------------|-----------------|--------|
| `02_Process/01_LLM_Wiki/` | `01_Personal_Os/02_Knowledge/06_Research/` | ✅ SYNCED (2026-08-29) |
| `03_Reference/02_Research/` | `PLAN_3D_Anticolision.md` → `03_Reference/02_Research/` | 🔄 PENDING |
| `04_Daily/` | `00_Winter_is_Coming/` daily notes | ✅ SEPARADOS |

> **Nota:** La sincronización es manual por ahora. El protocolo automático Think_Different ↔ Oband_Os fue eliminado durante la reorganización a 6 carpetas.

---

## 📊 Stats del Sistema

- **Daily notes:** 3 notas en `04_Daily/2026-09/`
- **Wiki pages:** 10+ pages en `02_Process/01_LLM_Wiki/`
- **Research areas:** 7 carpetas en `03_Reference/02_Research/`
- **Knowledge areas:** 10 carpetas en `03_Reference/01_Knowledge/`
- **Research skills:** 7 skills activas (`research:*`)
- **Methodologies:** 7 metodologías documentadas en README.md

---

*Oband_Os v3.0 — Backlog del Segundo Cerebro — 2026-09-22*

---

## 🔄 Daily Migration 2026-09-22

| Acción | Detalle | Estado |
|--------|---------|--------|
| `Daily/2026-07/` → `04_Daily/2026-07/` | 1 archivo (2026-07-30.md) | ✅ |
| `Daily/2026-08/` → `04_Daily/2026-08/` | 28 archivos (08-01 a 08-28) | ✅ |
| `Daily/2026-09/` → `04_Daily/2026-09/` | 9 archivos (09-11 a 09-19) | ✅ |
| `Daily/` legacy | Eliminada | ✅ |
| **Total migrado** | **38 archivos** | ✅ |

---

*Oband_Os v3.0 — Backlog del Segundo Cerebro — 2026-09-22 (migración completada)*
