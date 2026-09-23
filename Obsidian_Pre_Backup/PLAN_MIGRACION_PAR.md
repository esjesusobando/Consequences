# Plan de Migración: PARA Numerado — Antes → Después

> **Fecha:** 2026-09-22
> **Propósito:** Documentar el estado actual y la estructura objetivo
> **Acción:** Aplicar después de confirmar este respaldo

---

## 📋 ESTADO ACTUAL (ANTES)

### Estructura de carpetas (Obsidian Consequences)

```
Consequences/
├── 00_Backups_Os/       ← Backups del sistema
│   ├── README.md
│   └── Winter_Is_Coming/
│       ├── AGENTS.md
│       ├── BACKLOG.md
│       ├── GOALS.md
│       ├── 00_Iron_Man_Gen.md
│       ├── 01_Inventario_Total.md
│       ├── Skills/
│       └── 00_Complemento_Leer/
├── 01_Capture/          ← Lo que entra
│   ├── 01_Raw/          ← Fuentes RAW
│   ├── 02_Inbox/        ← Cosas por procesar
│   └── 03_Attachments/  ← Medios
├── 02_Process/          ← Lo que el LLM organiza
│   ├── 01_LLM_Wiki/     ← Wiki (páginas LLM)
│   │   ├── index.md
│   │   ├── index.yaml
│   │   ├── Log.md
│   │   ├── AI_Research_OS.md
│   │   ├── Wiki_Layer.md
│   │   ├── LLM_Wiki.md
│   │   ├── RAG_vs_Wiki.md
│   │   ├── Andrej_Karpathy.md
│   │   ├── Paul_Iusztin.md
│   │   ├── Louis-François_Bouchard.md
│   │   ├── Obsidian.md
│   │   ├── Claude.md
│   │   ├── Readwise.md
│   │   ├── NotebookLM.md
│   │   └── 00_Complemento_Leer/
│   └── 02_Schema/
│       └── CLAUDE.md
├── 03_Reference/        ← Lo que ya está organizado
│   ├── 01_Knowledge/    ← Lo que ya aprendí
│   ├── 02_Research/     ← Investigación activa
│   ├── 03_Archive/      ← Completado
│   └── 04_Playground/   ← Hubs + Sandbox
├── 04_Daily/            ← Notas diarias
├── 05_Templates/        ← Plantillas
└── 06_Excalidraw/       ← Diagramas
```

### README actual
- **Archivo:** `README.md` (417 líneas)
- **Metodología base:** LLM Wiki + AI Research OS
- **Carpetas documentadas:** 7 carpetas numeradas (00-06)
- **Estado:** ✅ Funcionando correctamente

---

## 🎯 ESTRUCTURA OBJETIVO (DESPUÉS)

### Estructura PARA numerada

```
Consequences/
├── 00_Backups_Os/       ← Backups (sin cambios)
├── 00_Inbox/            ← Bandeja de entrada (reemplaza 01_Capture/02_Inbox/)
├── 01_Projects/         ← Proyectos activos con deadline
├── 02_Areas/            ← Áreas permanentes (sin fecha)
├── 03_Resources/        ← Referencia, research, lectura
├── 04_Archive/          ← Completado/archivado
├── 05_Daily/            ← Notas diarias (conecta P + A)
├── 06_Process/          ← Motor LLM Wiki
│   └── 01_LLM_Wiki/    ← Index + Wiki pages + Log
│       ├── index.md
│       ├── index.yaml
│       ├── Log.md
│       └── *.md
├── 07_Templates/        ← Plantillas (was 05_Templates)
├── 08_Excalidraw/       ← Diagramas (was 06_Excalidraw)
└── README.md            ← Actualizado con estructura PARA
```

### Mapeo de migración

| Ahora (ANTES) | → | Nuevo (DESPUÉS) | Acción |
|---------------|----|-----------------|--------|
| `01_Capture/02_Inbox/` | → | `00_Inbox/` | Mover |
| `03_Reference/01_Knowledge/` | → | `02_Areas/` | Mover + Renombrar |
| `03_Reference/02_Research/` | → | `03_Resources/` | Mover + Renombrar |
| `03_Reference/03_Archive/` | → | `04_Archive/` | Mover + Renombrar |
| `04_Daily/` | → | `05_Daily/` | Mover + Renombrar |
| `02_Process/01_LLM_Wiki/` | → | `06_Process/01_LLM_Wiki/` | Mover |
| `05_Templates/` | → | `07_Templates/` | Mover + Renombrar |
| `06_Excalidraw/` | → | `08_Excalidraw/` | Mover + Renombrar |

### Archivos que QUEDAN iguales
- `00_Backups_Os/` — Sin cambios
- `01_Capture/01_Raw/` — Se integra en `00_Inbox/`
- `01_Capture/03_Attachments/` — Se integra en `03_Resources/`
- `02_Process/02_Schema/CLAUDE.md` — Se integra en `06_Process/` o `02_Areas/`

---

## ✅ CRITERIOS DE ÉXITO

1. [ ] `00_Inbox/` creado con contenido de `01_Capture/02_Inbox/`
2. [ ] `01_Projects/` creado con proyectos activos
3. [ ] `02_Areas/` creado con `03_Reference/01_Knowledge/`
4. [ ] `03_Resources/` creado con `03_Reference/02_Research/`
5. [ ] `04_Archive/` creado con `03_Reference/03_Archive/`
6. [ ] `05_Daily/` movido desde `04_Daily/`
7. [ ] `06_Process/01_LLM_Wiki/` movido desde `02_Process/`
8. [ ] `07_Templates/` movido desde `05_Templates/`
9. [ ] `08_Excalidraw/` movido desde `06_Excalidraw/`
10. [ ] `README.md` actualizado con nueva estructura PARA
11. [ ] `index.md` del LLM Wiki actualizado con nuevas rutas
12. [ ] `00_Backups_Os/` sin cambios
13. [ ] Sync Think_Different completado
14. [ ] Todos los wikilinks funcionando

---

## ⚠️ RIESGOS

1. **Broken wikilinks:** Al mover carpetas, los `[[rutas]]` internos pueden romperse
2. **Perdida de metadata:** Propiedades YAML pueden perderse en el traslado
3. **Obsidian cache:** Obsidian puede cachear rutas antiguas — necesita reindexar
4. **Sync Think_Different:** El backup `00_Backups_Os/` en Think_Different debe actualizarse

---

## 🔄 ROLLBACK

Si algo sale mal:
1. Restaurar desde `Obsidian_Pre_Backup/README_Obsidian_Pre_Migration.md`
2. Restaurar `index.md`, `index.yaml`, `Log.md` de backup
3. Volver a la estructura anterior manualmente
4. Rehacer commit con estructura original

---

*Plan creado: 2026-09-22 — Antes de aplicar migración PARA*
