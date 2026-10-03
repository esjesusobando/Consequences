# Plan de Migración: PARA Numerado — Antes → Después

> **Fecha:** 2026-09-22
> **Estado:** ✅ RESPALDO CREADO — En 04_Archive/
> **Ubicación:** `04_Archive/Obsidian_Pre_Backup/`
> **Propósito:** Documentar el estado actual antes de aplicar migración PARA
> **Acción:** Aplicar DESPUÉS de confirmar este respaldo

---

## 📋 RESPALDO (Obsidian Pre)

**Ubicación:** `04_Archive/Obsidian_Pre_Backup/`
**Contiene:**
- `README_Obsidian_Pre_Migration.md` — README original antes de cambios
- `index.md` — Copia de seguridad del índice LLM Wiki
- `index.yaml` — Copia de seguridad del metadata
- `Log.md` — Copia de seguridad de la bitácora
- `PLAN_MIGRACION_PAR.md` — Este archivo

**Rollback:** Restaurar estos archivos y hacer `git reset --hard HEAD~1`

---

## 📋 ESTADO ACTUAL (ANTES)

### Estructura actual

```
Consequences/
├── 00_Backups_Os/       ← Backups (sin cambios)
├── 01_Capture/          ← Raw + Inbox + Attachments
├── 02_Process/          ← LLM Wiki + Schema
├── 03_Reference/        ← Knowledge + Research + Archive + Playground
├── 04_Daily/            ← 39 notas diarias
├── 05_Templates/        ← Plantillas
└── 06_Excalidraw/       ← Diagramas
```

---

## 🎯 ESTRUCTURA OBJETIVO (DESPUÉS)

```
Consequences/
├── 00_Backups_Os/       ← Backups (sin cambios)
├── 00_Inbox/            ← Bandeja de entrada
├── 01_Projects/         ← Proyectos activos
├── 02_Areas/            ← Áreas permanentes
├── 03_Resources/        ← Referencia + Research
├── 04_Archive/          ← Completado + Obsidian_Pre_Backup/
├── 05_Daily/            ← Notas diarias
├── 06_Process/          ← Motor LLM Wiki
├── 07_Templates/        ← Plantillas
├── 08_Excalidraw/       ← Diagramas
└── README.md            ← Actualizado con estructura PARA
```

### Mapeo de migración

| Ahora (ANTES) | → | Nuevo (DESPUÉS) | Acción |
|---------------|----|-----------------|--------|
| `01_Capture/02_Inbox/` | → | `00_Inbox/` | Mover |
| `04  -  Archive/01_Knowledge/` | → | `02_Areas/` | Mover + Renombrar |
| `04  -  Archive/02_Research/` | → | `03  -  Resources/` | Mover + Renombrar |
| `04  -  Archive/` | → | `04_Archive/` | Mover + Renombrar |
| `05  -  Daily/` | → | `05_Daily/` | Mover + Renombrar |
| `06  -  Process/01_LLM_Wiki/` | → | `06_Process/01_LLM_Wiki/` | Mover |
| `03  -  Resources/10_Templates/` | → | `07_Templates/` | Mover + Renombrar |
| `06_Excalidraw/` | → | `08_Excalidraw/` | Mover + Renombrar |
| `Obsidian_Pre_Backup/` | → | `04_Archive/Obsidian_Pre_Backup/` | ✅ YA AQUÍ |

---

## ✅ CRITERIOS DE ÉXITO

1. [ ] `00_Inbox/` creado con contenido de `01_Capture/02_Inbox/`
2. [ ] `01_Projects/` creado con proyectos activos
3. [ ] `02_Areas/` creado con `04  -  Archive/01_Knowledge/`
4. [ ] `03  -  Resources/` creado con `04  -  Archive/02_Research/`
5. [ ] `04_Archive/` con `Obsidian_Pre_Backup/` + contenido antiguo
6. [ ] `05_Daily/` movido desde `05  -  Daily/`
7. [ ] `06_Process/01_LLM_Wiki/` movido desde `06  -  Process/`
8. [ ] `07_Templates/` movido desde `03  -  Resources/10_Templates/`
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
1. Restaurar desde `04_Archive/Obsidian_Pre_Backup/`
2. `git reset --hard HEAD~1` para volver al commit "Obsidian Pre"
3. Volver a la estructura anterior manualmente

---

*Plan creado: 2026-09-22*
*Backup commit: 80604fa*
*Backup ubicado en: 04_Archive/Obsidian_Pre_Backup/*
