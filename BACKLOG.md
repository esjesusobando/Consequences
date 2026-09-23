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
| **LLM Wiki + AI Research OS** | `ingest [source]` | `06_Process/01_LLM_Wiki/` | ✅ OPERATIVO |
| **AI Research OS (Paul Iusztin)** | `research [tema]` | `03_Resources/02_Coding_Agent_Architectures/` | ✅ OPERATIVO |
| **Steph Ango Method** | `daily` / `hábito [nombre]` | `04_Daily/` | ✅ OPERATIVO |
| **Research Skills (Obsidian)** | `research:command` | `03_Resources/02_Coding_Agent_Architectures/` | ✅ OPERATIVO |
| **Categories/MOC** | `categorizar [nota] en [categoría]` | `03_Resources/05_Playground/` | ✅ OPERATIVO |
| **Zinking Tone** | `zinking [texto]` | `03_Resources/01_AI_Research_OS/01_Content/` | ✅ OPERATIVO |
| **Engram Sync** | `mem_save` / `mem_search` | `03_Resources/01_AI_Research_OS/Engram_Sync.md` | ✅ OPERATIVO |

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
| 4 | **LLM Wiki Sync** | Mantener `06_Process/01_LLM_Wiki/index.md` actualizado con las fuentes procesadas | `06_Process/01_LLM_Wiki/` | ✅ OPERATIVO |
| 5 | **Index.md Mantenimiento** | Actualizar `03_Resources/02_Coding_Agent_Architectures/index.md` con nuevos artifacts | `03_Resources/02_Coding_Agent_Architectures/` | ✅ OPERATIVO |
| 6 | **Obsidian.md Wiki** | Mantener `06_Process/01_LLM_Wiki/Obsidian.md` actualizado con notas del vault | `06_Process/01_LLM_Wiki/Obsidian.md` | ✅ OPERATIVO |
| 7 | **Web Clipper Setup** | Configurar Obsidian Web Clipper extensión para captura rápida | `00_Inbox/` | ✅ CONFIGURADO |

---

## 📋 P2 — MEDIA PRIORIDAD

| # | Ítem | Descripción | Ubicación | Estado |
|---|------|-------------|-----------|--------|
| 8 | **AI Research OS Deep Dive** | Implementar `03_Resources/02_Coding_Agent_Architectures/01_AI_Research_OS/` completamente | `03_Resources/02_Coding_Agent_Architectures/` | 📝 EN PROGRESO |
| 9 | **Categories/MOC Hubs** | Completar `03_Resources/05_Playground/` con hubs: OS, Conocimiento, Investigación, Dirección | `03_Resources/05_Playground/` | 📝 EN PROGRESO |
| 10 | **Knowledge Base Consolidation** | Consolidar `03_Resources/01_AI_Research_OS/` con patterns, conventions, learnings | `03_Resources/01_AI_Research_OS/` | 📝 EN PROGRESO |
| 11 | **NotebookLM Integration** | Conectar `research:nlm` skill con vault para transcripciones y notas | `06_Process/01_LLM_Wiki/NotebookLM.md` | 📝 EN PROGRESO |
| 12 | **Readwise Sync** | Sincronizar highlights de Readwise con el vault | `03_Resources/01_AI_Research_OS/` | 📝 EN PROGRESO |
| 13 | **Engram ↔ Obsidian Sync** | Automatizar sincronización de learnings clave entre vault y Engram | `03_Resources/01_AI_Research_OS/Engram_Sync.md` | 📝 EN PROGRESO |
| 14 | **Daily Review Workflow** | Implementar flujo `daily` → `review daily` → `meta [meta]` completo | `04_Daily/` | 📝 EN PROGRESO |

---

## 🧊 P3 — BACKLOG FRÍO

| # | Ítem | Descripción | Ubicación | Estado |
|---|------|-------------|-----------|--------|
| 15 | **MIGRATION_NOTE.md** | Verificar y actualizar `03_Resources/02_Coding_Agent_Architectures/MIGRATION_NOTE.md` | `03_Resources/02_Coding_Agent_Architectures/` | 📝 PENDIENTE |
| 16 | **Zinking Tone Full Integration** | Completar integración de `03_Resources/01_AI_Research_OS/01_Content/00_Zinking_Tone.md` | `03_Resources/01_AI_Research_OS/01_Content/` | 📝 PENDIENTE |
| 17 | **Daily Notes Archival** | Mover notas diarias antiguas de `04_Daily/` a `04_Archive/` | `04_Daily/`, `04_Archive/` | 📝 PENDIENTE |
| 18 | **Graph Engineering** | Implementar `03_Resources/02_Coding_Agent_Architectures/07_Graph_Engineering/` | `03_Resources/02_Coding_Agent_Architectures/` | 📝 PENDIENTE |
| 19 | **Obsidian CLI Integration** | Usar `research:obsidian` skill para gestión programmatica del vault | `03_Resources/02_Coding_Agent_Architectures/` | 📝 PENDIENTE |
| 20 | **Steph Ango Method Full** | Implementar flujo completo de hábitos y revisión diaria | `04_Daily/` | 📝 PENDIENTE |

---

## 🔧 Pendientes Técnicos

| Ítem | Descripción | Prioridad | Estado |
|------|-------------|-----------|--------|
| **Vault Sync** | Sincronización bidireccional `Consequences` ↔ `Now_Invictus` | Alta | 📝 PENDIENTE |
| **CLAUDE.md Schema** | Verificar `06_Process/02_Schema/CLAUDE.md` actualizado | Media | ✅ OPERATIVO |
| **Web Clipper Config** | URL `obsidian://open?vault=Consequences` + Default folder `00_Inbox/01_Raw` | Baja | ✅ CONFIGURADO |
| **Research Skills Validation** | Verificar que todos los `research:*` skills funcionen correctamente | Media | 📝 PENDIENTE |
| **Daily Note 2026-09-22** | Crear nota diaria de hoy en `04_Daily/2026-09/2026-09-22.md` | Alta | ✅ CREADO |

---

## 📁 Estructura del Sistema

```
Consequences/
├── 00_Inbox/            ← Bandeja de entrada (01_, 02_, 03_ numerados)
├── 01_Projects/         ← Proyectos universitarios
│   ├── 00_Think_Labs/   ← Proyectos Think_Different
│   ├── 02_Consequences/ ← Proyecto Consequences
│   ├── 03_Centurion/    ← Proyecto Centurion
│   ├── 04_Renacimiento_Digital/
│   └── 05_Personal_Os_App/
├── 02_Areas/            ← Áreas de conocimiento (00 a 11)
├── 03_Resources/        ← Recursos de investigación (01 a 12)
│   ├── 01_AI_Research_OS/
│   ├── 02_Coding_Agent_Architectures/
│   ├── 03_Custom_URLs/
│   ├── 04_Deep_Research_Example/
│   ├── 05_Playground/
│   ├── 06_Migracion_Segundo_Cerebro/
│   ├── 07_From_Think_Different/
│   ├── 08_Graph_Engineering/
│   ├── 09_Platzi/       ← Cursos Platzi (6 cursos + transcript)
│   ├── 10_Templates/
│   ├── 11_Excalidraw/
│   └── 12_README/
├── 04_Archive/          ← Archivo histórico (Backups, Context_Memory, Sessions)
├── 05_Daily/            ← Notas diarias (YYYY-MM/DDD.md)
├── 06_Process/          ← Procesos internos
│   ├── 01_LLM_Wiki/     ← Wiki (12 páginas)
│   │   ├── index.md     ← Catálogo de contenido
│   │   ├── index.yaml   ← Índice YAML
│   │   └── Log.md       ← Registro cronológico
│   └── 02_Schema/       ← Reglas y schema (CLAUDE.md)
├── README.md            ← Este archivo
└── BACKLOG.md           ← Este backlog
```

---

## 🔄 Flujo de Trabajo Recomendado

```
1. GUARDAR → 00_Inbox/01_Raw/
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
| `06_Process/01_LLM_Wiki/` | `01_Personal_Os/02_Knowledge/06_Research/` | ✅ SYNCED (2026-08-29) |
| `03_Resources/02_Coding_Agent_Architectures/` | `PLAN_3D_Anticolision.md` → `03_Resources/02_Coding_Agent_Architectures/` | 🔄 PENDING |
| `04_Daily/` | `00_Winter_is_Coming/` daily notes | ✅ SEPARADOS |

> **Nota:** La sincronización es manual por ahora. El protocolo automático Think_Different ↔ Oband_Os fue eliminado durante la reorganización a 6 carpetas.

---

## 📊 Stats del Sistema

- **Daily notes:** 3 notas en `04_Daily/2026-09/`
- **Wiki pages:** 10+ pages en `06_Process/01_LLM_Wiki/`
- **Research areas:** 7 carpetas en `03_Resources/02_Coding_Agent_Architectures/`
- **Knowledge areas:** 10 carpetas en `03_Resources/01_AI_Research_OS/`
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
