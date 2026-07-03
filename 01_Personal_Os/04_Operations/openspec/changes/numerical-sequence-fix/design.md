# Design: Fix de Secuencia Numérica de Directorios

## 1. Resumen

Normalizar la secuencia numérica de 11 directorios en el PersonalOS que tienen prefijos duplicados o fuera de secuencia. El cambio abarca 4 áreas del sistema: Knowledge, Skills (Creación de Contenidos y Automatización) y Workflows.

**Repositorio activo:** `C:\Users\sebas\Desktop\Think_Different`
**Repositorio duplicado (parcial):** `C:\Users\sebas\01_Personal_Os`

---

## 2. Estado Actual Verificado

### 2.1 Estructura Física en Disco

#### 2.1.1 `02_Knowledge/` — 3 directorios con prefijo incorrecto

| Path Actual | Nuevo Path | Estado físico |
|---|---|---|
| `02_Knowledge/03_Unicorn/` | `02_Knowledge/03_Unicorn/` | ✅ Existe — necesita rename |
| `02_Knowledge/04_Invictus/` | `02_Knowledge/04_Invictus/` | ✅ Existe — necesita rename |
| `02_Knowledge/05_Anthropic/` | `02_Knowledge/05_Anthropic/` | ✅ Existe — necesita rename |

#### 2.1.2 `00_Core/02_Tools/02_Skills/01_Creacion_Contenidos/` — 2 directorios fuera de secuencia

| Path Actual | Nuevo Path | Estado físico |
|---|---|---|
| `01_Creacion_Contenidos/19_Audio_Pipeline/` | `01_Creacion_Contenidos/16_Audio_Pipeline/` | ✅ Existe — necesita rename |
| `01_Creacion_Contenidos/15_Marketing_Scripts/` | `01_Creacion_Contenidos/15_Marketing_Scripts/` | ✅ **Ya es correcto (15)** — no necesita cambio |

> **Nota:** La spec listaba `15_Marketing_Scripts` como cambio de 15→16, pero el análisis revela que `15_Audio_Pipeline` (SKILL.md real) es el que ocupa 15 y debe ir a 16. `15_Marketing_Scripts` ya está en 15 y es el que debe quedarse. **Corrección aplicada.**

#### 2.1.3 `00_Core/02_Tools/02_Skills/04_Automatizacion/` — 5 directorios con colisiones

| Path Actual | Nuevo Path | Estado físico |
|---|---|---|
| `04_Automatizacion/09_N8N_Invictus/` | `04_Automatizacion/09_N8N_Invictus/` | ✅ Existe — colisión con 08_AI_News_Weekly |
| `04_Automatizacion/12_GWS_Client/` | `04_Automatizacion/12_GWS_Client/` | ✅ Existe — colisión con 10_Firecrawl y 11_Gcierr |
| `04_Automatizacion/18_Gws_Client/` | `04_Automatizacion/18_Gws_Client/` | ✅ Existe — salta a 18 tras ocupar 12-17 |
| `04_Automatizacion/17_Reverse_Engineering/` | `04_Automatizacion/17_Reverse_Engineering/` | ✅ Existe — colisión con 16_N8n |
| `04_Automatizacion/17_Learning_Url_To_Knowledge/` | `04_Automatizacion/19_Learning_Url_To_Knowledge/` | ✅ Existe — colisión con 17_Reverse_Engineering y 18_Gws_Client |

**Secuencia final esperada en 04_Automatizacion/:**
```
08_AI_News_Weekly/        → 08 (sin cambios)
09_N8N_Invictus/          → 09 (desde 08)
10_Firecrawl/             → 10 (sin cambios)
11_Gcierr/                → 11 (sin cambios)
12_GWS_Client/            → 12 (desde 10)
13_Content_From_Url/      → 13 (sin cambios)
14_Compound_Knowledge/    → 14 (sin cambios)
15_Os_Self_Improvement/   → 15 (sin cambios)
16_N8n/                   → 16 (sin cambios)
17_Reverse_Engineering/   → 17 (desde 16)
18_Gws_Client/            → 18 (desde 11)
19_Learning_Url_To_Knowledge/ → 19 (desde 17)
```

#### 2.1.4 `00_Core/00_Workflows/01_Personal_Os/` — 1 workflow fuera de secuencia

| Path Actual | Nuevo Path | Estado físico |
|---|---|---|
| `05_Audio_To_Content.md` | `06_Audio_To_Content.md` | ✅ Existe — colisión con 05_Ritual_Cierre_Protocol.md |

**Secuencia final esperada en 01_Personal_Os/workflows:**
```
01_Morning_Standup.md        → 01 (sin cambios)
02_Backlog_Processing.md     → 02 (sin cambios)
03_Content_Generation.md     → 03 (sin cambios)
04_Weekly_Review.md          → 04 (sin cambios)
05_Ritual_Cierre_Protocol.md → 05 (sin cambios)
06_Audio_To_Content.md       → 06 (desde 05)
07_System_Health_Audit.md    → 07 (sin cambios)
08_Context_Recovery.md       → 08 (sin cambios)
09_AI_Task_Template.md       → 09 (sin cambios)
10_Classify_Task.md          → 10 (sin cambios)
```

---

## 3. Análisis de Impacto

### 3.1 Scripts Críticos (operacionales — requieren actualización)

#### 3.1.1 `config_paths.py` (352 líneas)
- **Línea 63:** `ARCHIVE_DIR = ROOT_DIR / "01_Personal_Os" / "07_Archive"` → ✅ **Ya actualizado** (apunta a 07_Archive)
- **Línea 50:** `KNOWLEDGE_DIR = ROOT_DIR / "01_Personal_Os" / "02_Knowledge"` → ✅ No incluye subdirectorios, es genérico
- **Línea 184:** `UNICORN_DIR = KNOWLEDGE_DIR` → ✅ Alias genérico, no referencia 06_Unicorn directamente
- **Conclusión:** `config_paths.py` **no necesita cambios** para este fix. Las rutas se resuelven dinámicamente.

#### 3.1.2 `20_System_Mapper_Hub.py` (980 líneas)
- **Línea 59:** `EXCLUDE_DIRS` contiene `"05_Archive"` → ⚠️ Se usa como patrón de exclusión, no como path activo. `05_Archive` ya no existe en disco, pero el patrón es inocuo. **No es prioritario actualizar** pero debe ajustarse para limpieza.
- **Línea 175:** `skills_dir = PROJECT_ROOT / "01_Personal_Os/00_Core/02_Tools/02_Skills"` → ✅ Path genérico, escanea dinámicamente
- **Línea 236-237:** `source_dir = .../01_Agents`, `backup_dir = .../.agent/01_Agents` → ✅ Genéricos
- **Línea 327:** `hubs_dir = .../03_Scripts_Os` → ✅ Genérico
- **Línea 409:** `workflows_dir = .../00_Workflows` → ✅ Genérico
- **Conclusión:** Los scripts son dinámicos (walk directories). **No necesitan cambios** para detectar los directorios renombrados. La exclusión `"05_Archive"` puede eliminarse (cosmético).

#### 3.1.3 `21_Legacy_Path_Cleanup.py` (146 líneas)
- **Línea 29:** `EXCLUDE_DIRS = {"05_Archive", ...}` → ⚠️ Mismo caso que System Mapper. Patrón de exclusión, no path activo.
- **Conclusión:** **No necesita cambios funcionales.** La exclusión puede eliminarse como limpieza cosmética.

### 3.2 Manifests Auto-generados (04_Skill_Index.json)

Hay **2 copias** del manifest, ambas con paths hardcodeados:
1. `05_Scripts/02_Agent_Teams_Lite/00_Manifest/04_Skill_Index.json` (2067 líneas, generado 2026-07-03)
2. `00_Core/02_Tools/00_SDD/00_Manifest/04_Skill_Index.json` (2067 líneas, generado 2026-06-27)

**Paths hardcodeados a actualizar en AMBOS manifests:**
- `01_Creacion_Contenidos/19_Audio_Pipeline/SKILL.md` → `01_Creacion_Contenidos/16_Audio_Pipeline/SKILL.md`
- `04_Automatizacion/09_N8N_Invictus/SKILL.md` → `04_Automatizacion/09_N8N_Invictus/SKILL.md`
- `04_Automatizacion/12_GWS_Client/SKILL.md` → `04_Automatizacion/12_GWS_Client/SKILL.md`
- `04_Automatizacion/18_Gws_Client/SKILL.md` → `04_Automatizacion/18_Gws_Client/SKILL.md`
- `04_Automatizacion/17_Reverse_Engineering/SKILL.md` → `04_Automatizacion/17_Reverse_Engineering/SKILL.md`
- `04_Automatizacion/17_Learning_Url_To_Knowledge/SKILL.md` → `04_Automatizacion/19_Learning_Url_To_Knowledge/SKILL.md`

> **Estrategia:** NO editar manualmente el JSON. Regenerar con `python 20_System_Mapper_Hub.py --scan` **después** de completar todos los renames.

### 3.3 Archivos con Referencias Hardcodeadas

#### 3.3.1 `00_Core/02_Tools/01_Agents/00_OS_Conductor/registry.md`
- Referencias a `09_Anthropic/` (líneas múltiples)
- Referencias a `08_N8N_Invictus`, `10_GWS_Client`, `11_Gws_Client`, `16_Reverse_Engineering`, `17_Learning_Url_To_Content`
- **Requiere revisión línea por línea**

#### 3.3.2 `00_Core/02_Tools/02_Skills/04_Automatizacion/README.md`
- Tabla de skills con paths hardcodeados a `08_N8N_Invictus`, `10_GWS_Client`, `11_Gws_Client`, `16_Reverse_Engineering`, `17_Learning_Url_To_Content`
- **Requiere actualización de tabla completa**

#### 3.3.3 `00_Core/02_Tools/02_Skills/04_Automatizacion/SKILL.md`
- Línea 33: referencias a directorios legacy
- **Requiere actualización**

#### 3.3.4 `00_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md`
- Tabla de skills con paths en formato `04_Automatizacion/09_N8N_Invictus/` etc.
- **Requiere actualización**

#### 3.3.5 `00_Core/02_Tools/02_Skills/README.md`
- Líneas 61-62: referencias a directorios de automatización
- **Requiere actualización**

#### 3.3.6 `.agent/02_Skills/04_Automatizacion/README.md`
- **Espejo/sync backup** de `00_Core/02_Tools/02_Skills/04_Automatizacion/README.md`
- Contiene la misma tabla de paths hardcodeados
- **Requiere actualización paralela**

#### 3.3.7 `.agent/02_Skills/INDEX_AREA_FUNCTIONAL.md`
- **Espejo/sync backup** de `INDEX_AREA_FUNCTIONAL.md` en skills
- **Requiere actualización paralela**

#### 3.3.8 `00_Core/00_Workflows/01_Personal_Os/05_Audio_To_Content.md`
- **Archivo a renombrar** a `06_Audio_To_Content.md`
- Línea 305: referencia interna a `01_Creacion_Contenidos/19_Audio_Pipeline/` → debe apuntar a `16_Audio_Pipeline/`
- **Requiere actualización de contenido + rename**

#### 3.3.9 `00_Winter_is_Coming/OS_DIRECTORY.md`
- Posibles referencias a directorios renombrados

#### 3.3.10 `CLAUDE.md`
- Línea 233: posible referencia a `07_Invictus` en knowledge

#### 3.3.11 `.agent/README.md`
- Tabla de directorios con paths antiguos (05_Archive)

#### 3.3.12 `Structure_v5.0.md` (si existe en raíz)
- Líneas 56-58: referencias a 06_Unicorn, 07_Invictus, 09_Anthropic

### 3.4 Archivos de Memoria/Historial (NO editar directamente)

Los siguientes archivos contienen referencias históricas a los paths antiguos. Documentan decisiones pasadas o el estado del sistema en un momento anterior. **No se actualizan** porque:
1. Son registros históricos, no configuraciones activas
2. Modificarlos rompería la trazabilidad
3. Son context_LLM, process_notes, y reportes generados

Archivos excluidos:
- `01_Memory/` completo (Context_Memory, Notas_de_Proceso, etc.)
- `01_Memory/00_Context_LLM/01_Process_Notes/*.md`
- `01_Memory/00_Context_LLM/07_Auditorias/*.md`
- `03_Resultado/00_Proyectos/*/PROJECT_AUDIT.md`
- `02_Knowledge/01_Research/*/04_INVENTARIO_INTEGRADO_SISTEMAS.md`
- Reportes en `03_Resultado/`

### 3.5 Directorio Duplicado `C:\Users\sebas\01_Personal_Os`

Este directorio parece ser un duplicado/sincronización parcial del repo activo. Algunos paths pueden existir aquí con la nomenclatura antigua. **No se modifica** porque no es el repo activo. Si el usuario desea sincronizar, debe ejecutarse el mismo proceso allí.

---

## 4. Estrategia de Ejecución

### 4.1 Principios

1. **Rename físico primero**, actualización de referencias después
2. **No editar manifests a mano** — regenerar con `--scan`
3. **No modificar registros históricos** (memory, process notes, reportes)
4. **Ejecutar en orden específico** para evitar colisiones temporales
5. **Verificar integridad** post-cambio con `20_System_Mapper_Hub.py --validate`

### 4.2 Orden de Operaciones

#### Fase 1: Renombrar Directorios (orden seguro)

```
1. 02_Knowledge/
   1a. 06_Unicorn → 03_Unicorn       # No hay 03 existente
   1b. 07_Invictus → 04_Invictus     # No hay 04 existente  
   1c. 09_Anthropic → 05_Anthropic   # No hay 05 existente

2. 01_Creacion_Contenidos/
   2a. 15_Audio_Pipeline → 16_Audio_Pipeline  # No hay 16 existente

3. 04_Automatizacion/
   3a. 08_N8N_Invictus → 09_N8N_Invictus      # No hay 09 existente
   3b. 10_GWS_Client → 12_GWS_Client          # No hay 12 existente
   3c. 16_Reverse_Engineering → 17_RE         # Temporal: evitar colisión con 17_Learning
   3d. 17_Learning_Url_To_Knowledge → 19_Learning_Url_To_Knowledge
   3e. 17_RE → 17_Reverse_Engineering         # Nombre final
   3f. 11_Gws_Client → 18_Gws_Client          # No hay 18 existente

4. Workflows/
   4a. 05_Audio_To_Content.md → 06_Audio_To_Content.md
```

#### Fase 2: Actualizar Referencias Hardcodeadas

1. `00_Core/02_Tools/02_Skills/04_Automatizacion/README.md` — tabla de paths
2. `00_Core/02_Tools/02_Skills/04_Automatizacion/SKILL.md` — referencias internas
3. `00_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md` — paths en tabla
4. `00_Core/02_Tools/02_Skills/README.md` — referencias a automatización
5. `00_Core/02_Tools/01_Agents/00_OS_Conductor/registry.md` — paths legacy
6. `.agent/02_Skills/04_Automatizacion/README.md` — espejo del skills README
7. `.agent/02_Skills/INDEX_AREA_FUNCTIONAL.md` — espejo
8. `00_Core/00_Workflows/01_Personal_Os/06_Audio_To_Content.md` — referencia a 15_Audio_Pipeline (línea 305)
9. `00_Winter_is_Coming/OS_DIRECTORY.md` — referencias a directorios
10. `CLAUDE.md` — línea 233
11. `Structure_v5.0.md` — líneas 56-58
12. `.agent/README.md` — tabla de directorios

#### Fase 3: Regenerar Manifests

```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```

Esto regenera ambos manifests:
- `05_Scripts/02_Agent_Teams_Lite/00_Manifest/04_Skill_Index.json`
- `05_Scripts/02_Agent_Teams_Lite/00_Manifest/01_OS_Inventory.json`

> **Nota:** El manifest en `00_Core/02_Tools/00_SDD/00_Manifest/` tiene `base_path` incorrecto (`01_Core` en vez de `00_Core`). El scanner de System Mapper escribe en `05_Scripts/02_Agent_Teams_Lite/00_Manifest/`. Corregir el SDD manifest está fuera del scope de este cambio.

#### Fase 4: Verificación

1. `python 20_System_Mapper_Hub.py --validate` — comprueba integridad referencial
2. Verificar que `06_Workflow_Graph.yaml` refleje el nuevo nombre del workflow
3. Confirmar que no haya paths rotos en los index de skills

---

## 5. Matriz de Impacto Completa

| # | Path | Cambio | Scripts | Manifests | Docs | README | Registry |
|---|---|---|---|---|---|---|---|
| 1 | `05_Archive/` → `07_Archive/` | **Ya migrado** | ✅ OK | ✅ OK | ⚠️ Doc refs | ⚠️ .agent/README | ✅ OK |
| 2 | `06_Unicorn/` → `03_Unicorn/` | Rename dir | ✅ OK | ⚠️ Auto-gen | ⚠️ Doc refs | ✅ N/A | ✅ OK |
| 3 | `07_Invictus/` → `04_Invictus/` | Rename dir | ✅ OK | ⚠️ Auto-gen | ⚠️ Doc refs | ✅ N/A | ✅ OK |
| 4 | `09_Anthropic/` → `05_Anthropic/` | Rename dir | ✅ OK | ⚠️ Auto-gen | ⚠️ Doc refs | ✅ N/A | ⚠️ registry.md |
| 5 | `15_Audio_Pipeline/` → `16_Audio_Pipeline/` | Rename dir | ✅ OK | ⚠️ 2 manifests | ⚠️ workflow ref | ✅ N/A | ⚠️ registry.md |
| 6 | `08_N8N_Invictus/` → `09_N8N_Invictus/` | Rename dir | ✅ OK | ⚠️ 2 manifests | ✅ N/A | ⚠️ 2 READMEs | ⚠️ registry.md |
| 7 | `10_GWS_Client/` → `12_GWS_Client/` | Rename dir | ✅ OK | ⚠️ 2 manifests | ✅ N/A | ⚠️ 2 READMEs | ⚠️ registry.md |
| 8 | `11_Gws_Client/` → `18_Gws_Client/` | Rename dir | ✅ OK | ⚠️ 2 manifests | ✅ N/A | ⚠️ 2 READMEs | ⚠️ registry.md |
| 9 | `16_Reverse_Engineering/` → `17_RE/` | Rename dir | ✅ OK | ⚠️ 2 manifests | ✅ N/A | ⚠️ 2 READMEs | ⚠️ registry.md |
| 10 | `17_Learning_Url.../` → `19_Learning.../` | Rename dir | ✅ OK | ⚠️ 2 manifests | ✅ N/A | ⚠️ 2 READMEs | ⚠️ registry.md |
| 11 | `05_Audio_To_Content.md` → `06_...` | Rename + content | ✅ OK | ⚠️ 2 manifests | ⚠️ Self-ref | ✅ N/A | ✅ N/A |

### Leyenda
- ✅ OK = Sin impacto o ya resuelto
- ⚠️ = Requiere acción (especificada en sección anterior)
- 🔴 = Riesgo (no se detectó ninguno crítico)

---

## 6. Riesgos y Mitigaciones

### Riesgo 1: Colisiones temporales durante rename de 16_Reverse_Engineering y 17_Learning_Url_To_Knowledge
- **Problema:** Renombrar 16_RE → 17_RE y 17_Learning → 19 implica que 17 está ocupado temporalmente
- **Mitigación:** Usar nombre temporal (`17_RE`) para 16_RE, luego renombrar 17_Learning → 19, y finalmente 17_RE → 17_Reverse_Engineering (ver Fase 1 paso 3)

### Riesgo 2: Rotura de referencias entre rename y regeneración de manifests
- **Problema:** Entre el rename físico y la regeneración de manifests, los paths en 04_Skill_Index.json quedan rotos
- **Mitigación:** La ventana es corta (minutos). Regenerar manifests inmediatamente después del último rename. El sistema no se usa activamente durante la ventana.

### Riesgo 3: Contenido interno de SKILL.md con referencias a sí mismo
- **Problema:** Directorios renombrados pueden tener SKILL.md con self-references al path antiguo
- **Mitigación:** Buscar `grep -r` del nombre del directorio dentro de sí mismo post-rename. Ej: si `15_Audio_Pipeline/SKILL.md` menciona `15_Audio_Pipeline`, actualizar.

### Riesgo 4: Duplicado `01_Personal_Os` en home
- **Problema:** El directorio `C:\Users\sebas\01_Personal_Os` tiene su propia copia de la estructura
- **Mitigación:** Está fuera del scope. Si se desea sincronizar, aplicar los mismos cambios allí.

---

## 7. Criterios de Aceptación

1. ✅ Todos los directorios renombrados existen con su nuevo prefijo numérico
2. ✅ Los directorios antiguos ya no existen (o se han movido)
3. ✅ `20_System_Mapper_Hub.py --validate` reporta 0 errores
4. ✅ `20_System_Mapper_Hub.py --scan` regenera manifests con paths correctos
5. ✅ Los READMEs y tablas de skills reflejan los nuevos paths
6. ✅ `06_Workflow_Graph.yaml` lista el workflow como `06_Audio_To_Content.md`
7. ✅ No hay referencias a `15_Audio_Pipeline` en paths de skills (solo en históricos)
8. ✅ El workflow `05_Audio_To_Content.md` se ha renombrado y su contenido refleja `16_Audio_Pipeline`

---

## 8. Archivos Excluidos (por categoría)

| Categoría | Motivo |
|---|---|
| `01_Memory/` completo | Registro histórico de contexto |
| `01_Memory/00_Context_LLM/01_Process_Notes/` | Notas de proceso inmutables |
| `01_Memory/00_Context_LLM/07_Auditorias/` | Reportes de auditoría históricos |
| `02_Knowledge/01_Research/` | Investigaciones con referencias en contexto |
| `03_Resultado/` completo | Outputs generados, no configuración |
| `02_Playground/` | Experimentos no críticos |
| `C:\Users\sebas\01_Personal_Os\` | Repo duplicado fuera de scope |

---

*Design generado para el cambio `numerical-sequence-fix` — 2026-07-03*
