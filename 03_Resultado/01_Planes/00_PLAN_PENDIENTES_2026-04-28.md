# 📋 PLAN PENDIENTES — PersonalOS v3.1 | 2026-04-29

> **Propósito:** Plan de continuación por si se acaban los tokens. Retomar desde aquí.
> **Estado del sistema:** ✅ PURE GREEN (commit `0426f884`)

---

## ✅ YA HECHO EN ESTA SESIÓN (2026-04-28 / 2026-04-29)

| Tarea                                                                                            | Commit                                   | Estado               |
|--------------------------------------------------------------------------------------------------|------------------------------------------|----------------------|
| 4 archivos 01_Core/ actualizados (Comandos, Inventario, Dream Team, INVENTARIO_CORE)             | `f4ecd531` (sesión anterior)             | ✅                    |
| `.agent/README.md`: 9 → 11 áreas, 14 → 23 HUBs                                                   | `0fe81612`                               | ✅                    |
| `.gitignore`: reglas binarios (*.exe, PDFs, imágenes grandes)                                    | `0fe81612`                               | ✅                    |
| `INDEX_AREA_FUNCTIONAL.md`: removido ÁREA 09, footer 11 áreas                                    | `0fe81612`                               | ✅                    |
| `09_Legacy_Archive` movido a `05_Archive/09_Legacy_Skills_Archive/`                              | `0fe81612`                               | ✅                    |
| `OS_DIRECTORY.md`: MCPs 33→35, Rules 10→11, HUB paths corregidos                                 | `0fe81612`                               | ✅                    |
| OIM_Website_Backup: 8 commits pusheados a `Office_Installations_` via GitHub API                 | externo                                  | ✅                    |
| **Sesión 2026-04-29 — Limpieza disco + Git**                                                     |                                          |                      |
| Disco C: liberado ~40 GB (npm 21GB, uv 12GB, Temp 10GB, Playwright 1.9GB, Brave 1.1GB)           | n/a                                      | ✅                    |
| Update 1100+ archivos OS: workflows, skills, agents, rules, docs                                 | `92983546`                               | ✅                    |
| Fix `.gitignore`: excluir `01_Original_Source_Backups/` (firecrawl + marketingskills)            | `92983546`                               | ✅                    |
| Removidos 5 submodules huérfanos del índice git                                                  | `750151c3`                               | ✅                    |
| `.gitmodules` vaciado — repo sin dependencias externas                                           | `750151c3`                               | ✅                    |
| Ex-submodules agregados al `.gitignore` — working tree limpio                                    | `0426f884`                               | ✅                    |

---

## 🔴 PENDIENTE ALTA PRIORIDAD

### 1. Actualizar todos los README con beauty tables
- **Qué:** Aplicar `13_Beautify_Tables.py` a todos los README.md del sistema
- **Cómo:**
  ```bash
  python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/13_Beautify_Tables.py --all
  ```
- **Archivos clave a revisar manualmente:**
  - `README.md` (raíz)
  - `.agent/README.md`
  - `01_Personal_Os/01_Core/02_Tools/02_Skills/README.md`
  - `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md`

### 2. Disco lleno — .git tiene 392MB ⚠️ (C: liberado ~40GB hoy, pero .git history pesa)

**Root cause identificado:**
| Archivo                                                  | Tamaño en historia                           |
|----------------------------------------------------------|----------------------------------------------|
| `Now/03_Imagenes_Finales/*.png`                          | 64MB (no existe en working tree)             |
| `00_Library_PDFs/12_Globant_Tech_Trends.pdf`             | 27MB                                         |
| `00_Library_PDFs/09_Data_Lab_Unicorn.pdf`                | 27MB                                         |
| `improvement_log.json`                                   | 26MB                                         |
| `engram.exe`                                             | 21MB                                         |
| `Engram/cmd/engram/gentle-creation`                      | 17MB                                         |
| `Engram/cmd/engram/main`                                 | 17MB                                         |

**Fix (requiere confirmación del usuario — operación destructiva):**
```bash
# Opción A: git filter-repo (reescribe historia)
pip install git-filter-repo
git filter-repo --path-glob "*.exe" --invert-paths
git filter-repo --path-glob "*.pdf" --invert-paths
git filter-repo --path "01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/03_Metrics/improvement_log.json" --invert-paths

# Opción B: BFG Repo Cleaner (más simple)
java -jar bfg.jar --strip-blobs-bigger-than 10M .
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```
⚠️ **Confirmación requerida antes de ejecutar** — reescribe historia y requiere force push

### 3. Actualizar manifests JARVIS (números desactualizados)

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```
- `03_Agent_Catalog.yaml`: actualizar conteo (52+ agents)
- `04_Skill_Index.json`: actualizar a 11 áreas (sin Legacy Archive)
- `05_HUB_Catalog.yaml`: actualizar a 23 scripts

### 4. Sincronizar .agent/ con 01_Core/ (Agent Mirror)

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_Agent_Mirror_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py
```

---

## 🟡 PENDIENTE MEDIA PRIORIDAD

### 5. .agent/CLAUDE.md desactualizado
- Dice "15 áreas funcionales" en el tree pero tabla muestra 11
- Dice "HUBs 00-13" en lugar de "00-22"
- Fecha: 2026-04-24 (debería ser 2026-04-28)
- **Fix:** Actualizar manualmente las secciones de Skills y HUBs

### 6. Crear directorios faltantes en 04_Operations/
- `04_Operations/05_Plans/` (referenciado en agentes pero no existe)
- `04_Operations/06_Solutions/` (referenciado en agentes pero no existe)
- `04_Operations/10_Reports/` (referenciado en agentes pero no existe)

### 7. Fix referencia en .claude/rules/tech-defaults.md
- Apunta a `03_Pilar_Motor.mdc` que NO existe
- El archivo real es `01_Pilares_Sistema.mdc`

### 8. Web OIM — Completar funcionalidades
- Revisar si el formulario de contacto con Resend está implementado
- Verificar que las fotos del gallery estén en producción
- Review pending en `feature/improve-design-add-images`

---

## 🟢 PENDIENTE BAJA PRIORIDAD

### 9. Kit_Diseño_Top_11.md en raíz
- Archivo suelto sin referencia en README ni CLAUDE.md
- **Opciones:** Moverlo a `01_Personal_Os/02_Knowledge/` o documentarlo en README

### 10. excalidraw.log en raíz
- Ya está en `.gitignore` (regla `*.log`)
- No se committea más, pero el archivo físico sigue en disco
- **Fix:** Eliminar manualmente o ignorar (no afecta al repo)

### 11. Documentar agentes de 03_Growth, 04_Contexto, 05_Marca, 06_Plantillas
- Existen como carpetas pero no están en manifests ni documentación

### 12. Alias legacy en config_paths.py
- `BRAIN_DIR = OPERATIONS_DIR` y `SYSTEM_DIR = CORE_DIR` son confusos
- Marcar explícitamente como deprecated o remover

---

## 📊 ESTADO FINAL DEL SISTEMA

| Métrica                      | Valor                                                            |
|------------------------------|------------------------------------------------------------------|
| Versión OS                   | v3.1 Consequences                                                |
| Rules                        | 11 .mdc (00-10)                                                  |
| Skills activas               | 11 áreas / 299 skills                                            |
| Agents                       | 52+ (Dream Team 5, Specialists 24, individuales 12+)             |
| HUBs                         | 23 scripts (19 + 4 auxiliares)                                   |
| MCPs Claude                  | 35                                                               |
| Manifests JARVIS             | 7                                                                |
| .git size                    | 392MB ⚠️ (requiere limpieza con git filter-repo)                 |
| Disco C libre                | ~28 GB ✅ (liberados ~40 GB hoy)                                  |
| Submodules                   | ✅ Removidos (0 submodules activos)                               |
| OIM Website                  | ✅ Pusheado a Office_Installations_                               |
| Último commit OS             | `0426f884`                                                       |

---

## 🚀 CÓMO RETOMAR

```bash
# 1. Cargar contexto
engram_mem_context(limit=10)

# 2. Leer este plan
cat 00_PLAN_PENDIENTES_2026-04-28.md

# 3. Ejecutar desde tarea #1 (beauty tables)
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/13_Beautify_Tables.py

# 4. Regenerar manifests
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```

---

*Generado: 2026-04-28 | Sesión de auditoría v3.1 | PersonalOS PURE GREEN*
