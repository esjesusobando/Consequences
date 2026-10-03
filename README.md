# Consequences — Personal OS

> **Sistema Operativo Personal** — Segundo Cerebro digital.
> Versión: 1.0.1 | Actualizado: 2026-10-03

## Estructura del Vault

> **Separador real de carpetas raíz:** dos espacios + guion + dos espacios → `NN  -  Nombre`
> (los nombres SIN separador que aparecían en versiones anteriores de este README eran erróneos).

| # | Carpeta (nombre real) | Descripción |
|---|---------|-------------|
| 00 | `00  -  Inbox` | Bandeja de entrada (3 archivos numerados) |
| 01 | `01  -  Projects` | Proyectos universitarios (00_Think_Labs, 02_Consequences, 03_Centurion, 04_Renacimiento_Digital, 05_Personal_Os_App) |
| 02 | `02  -  Areas` | Áreas de conocimiento (00_Engram_Sync a 11_Sesiones) |
| 03 | `03  -  Resources` | Recursos de investigación (01_AI_Research_OS a 11_Excalidraw + 10_Templates) |
| 04 | `04  -  Archive` | Archivo histórico: 00_Backups_Os, Context_Memory (21 archivos), Obsidian_Pre_Backup |
| 05 | `05  -  Daily` | Notas diarias: `05  -  Daily/YYYY-MM/YYYY-MM-DD.md` (2026-07 … 2026-10) |
| 06 | `06  -  Process` | Procesos internos (01_LLM_Wiki con 12 páginas, 02_Schema) |

## Convenciones de Naming

- **Carpetas raíz**: `NN  -  PascalCase` (2 dígitos, dos espacios, guion, dos espacios) — `00  -  Inbox`, `05  -  Daily`
- **PascalCase con guiones bajos**: `01_Nombre_Del_Archivo.md`
- **Numeración secuencial**: `01_`, `02_`, `03_`... hasta `99_`
- **Carpetas internas con 2 dígitos**: `00_`, `01_`, `02_`... `12_`
- **Index files**: `index.md` dentro de cada carpeta numerada

## Reglas

1. Todo archivo y carpeta debe tener numeración secuencial
2. PascalCase con guiones bajos entre palabras
3. Los índices (`index.md`) están numerados internamente
4. `00_Backups_Os` vive dentro de `04  -  Archive/00_Backups_Os/`
5. `03  -  Resources/` contiene `09_Platzi/`, `10_Templates/`, `11_Excalidraw/`

## Componentes Principales

### 06  -  Process/01_LLM_Wiki/
Motor de conocimiento con 12 páginas numeradas: `01_AI_Research_OS.md` → `12_Log.md`
- `index.yaml` — Configuración del índice
- `index.md` — Índice principal

### 02  -  Areas/
12 áreas de conocimiento con subestructura numerada internamente.

### 03  -  Resources/
12 carpetas de recursos con contenido numerado internamente.
- `01_AI_Research_OS/` — seeds, discovery, wiki, index.yaml
- `07_From_Think_Different/` — 14 archivos + `06_Transcripts/`

### 04  -  Archive/Context_Memory/
21 archivos de contexto numerados `01_` a `21_`.

---

## 🧠 Metodología — Segundo Cerebro (Tiago Forte · PARA)

Este vault es el **segundo cerebro**. La estructura de carpetas sigue **PARA**
(*Projects, Areas, Resources, Archives*), no un árbol por temas.

| Carpeta | Quadrant PARA | Qué va ahí | Revisión |
|---------|---------------|-----------|----------|
| `00  -  Inbox` | **Captura** | Todo lo entrante sin clasificar. **Captura primero, clasifica después.** | Diario |
| `01  -  Projects` | **P** — Projects | Trabajo con deadline y resultado verificable. Requiere GOALS + BACKLOG. | Semanal |
| `02  -  Areas` | **A** — Areas | Responsabilidad continua sin fecha de fin. Se mantiene viva. | Trimestral |
| `03  -  Resources` | **R** — Resources | Conocimiento evergreen de interés. Se consulta, no se trabaja. | Cuando reaparece |
| `04  -  Archive` | **Archive** | Proyectos completados o material muerto. **Se archiva, nunca se borra.** | Trimestral |
| `05  -  Daily` | **Daily** | Una nota por día: `05  -  Daily/YYYY-MM/YYYY-MM-DD.md` | Diario |
| `06  -  Process` | Sistema | Procesos internos del OS (LLM Wiki, schemas) | Cuando cambia |

### Reglas de captura (Forte)

1. **Captura sin fricción.** Si dudás entre Projects y Areas, va a Inbox. Clasificar es una decisión posterior, no un requisito para guardar.
2. **Una nota, una idea.** Si necesitás dos títulos, son dos notas.
3. **Progressive summarization:** captura cruda → resaltado → resumen → nota sintetizada. Cada carpeta de `03  -  Resources` tiene su `index.md` como mapa del resumen.
4. **Nada se borra.** Se archiva en `04  -  Archive`. Esto preserva el contexto histórico de decisiones.
5. **Projects → Archive es un viaje de ida.** Un proyecto terminado se mueve completo, no se dejan partes.

### Reglas de documentación para agentes (IA)

- **No dupliques contenido.** Si la nota vive en el vault, en Engram guardás solo el puntero (`topic_key`), no el texto.
- **Naming:** PascalCase con guiones bajos, numeración secuencial (`01_`, `02_`...). Sin excepciones.
- **Toda nota nueva lleva `index.md` actualizado** si la carpeta tiene índice.
- **Research = evidencia.** Nada entra a `03 - Resources` sin fuente primaria citada (URL) y sin pasar el health check.
- **Antes de commit** en este repo: actualizar los READMEs de las carpetas tocadas.
- **Repo separado del código.** Código y workflows viven en `Think_Different`; el vault es solo conocimiento, decisiones y documentación.

### Configuración Daily Notes

> ⚠️ Rutas reales verificadas 2026-10-03. La versión anterior declaraba
> `05_Daily/YYYY-MM` + template `00_Inbox/index.md` — ambas **inexistentes**, por lo que
> Obsidian no podía crear notas diarias. Corregido en `.obsidian/daily-notes.json`.

```json
{
  "format": "YYYY-MM-DD",
  "folder": "05  -  Daily/YYYY-MM",
  "template": "03  -  Resources/10_Templates/03_Daily.md"
}
```

**Rutas de reportes/notas para agentes (IA):**
- **Nota diaria** → `05  -  Daily/YYYY-MM/YYYY-MM-DD.md` (template `03_Daily.md`).
- **Reportes operativos del OS** → `Think_Different/01_Personal_Os/04_Operations/07_Reports/01_Generated/` (repo separado, no el vault).
- **Learnings/compound** → `Think_Different/01_Personal_Os/02_Knowledge/04_Docs/solutions/` (`docs_root` de CE).

---

*Actualizado: 2026-10-03 — estructura real (separador `  -  `), rutas daily corregidas, rutas de reportes documentadas.*
*Estructura verificada 2026-09-26. Generado automáticamente — 2026-09-23*
