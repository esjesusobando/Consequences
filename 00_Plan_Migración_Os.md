# 📋 Plan de Migración del PersonalOS

> **Fecha de creación:** 2026-04-23  
> **Estado:** PLANEADO - Pendiente de ejecución  
> **Proyecto:** Think_Different → Nueva estructura reorganizada

---

## 🎯 Objetivo

Reorganizar la estructura del OS de `Think_Different` manteniendo compatibilidad hacia atrás (backwards), con múltiples backups antes de ejecutar cambios.

---

## 📊 Estado Actual

### Estructura Actual
```
Think_Different/
├── 00_Winter_is_Coming/     ← REGLAS (Goals, Backlog, AGENTS.md)
├── 01_Core/                 ← CORE del sistema
│   ├── 01_Rules/           ← 25 reglas del sistema
│   ├── 03_Skills/         ← 22 categorías de skills (~15,844 archivos)
│   ├── 05_Mcp/            ← Configuraciones MCP
│   ├── 07_Hooks/          ← Hooks del sistema
│   └── 04_Agents/         ← Agentes configurados
├── 02_Knowledge/          ← Documentación
├── 03_Tasks/              ← Tareas activas
├── 04_Operations/          ← Auto-Improvement, Scripts
├── 05_Archive/            ← Archivo
├── 06_Playground/         ← Área de pruebas
├── 07_Projects/           ← Proyectos activos
├── 08_Scripts_Os/         ← HUBs y scripts principales
├── AGENTS.md               ← Config de agentes
├── CLAUDE.md              ← Config de Claude
└── .mcp.json              ← MCP servers activos (27)
```

### Problemas Identificados
1. **Profundidad de carpetas:** Skills están en `01_Core/03_Skills/` (muy profundo)
2. **Scripts en raíz:** `08_Scripts_Os/` en raíz, no agrupado con operaciones
3. **Paths hardcodeados:** 89 scripts con `sys.path.insert` hardcodeado
4. **Sin backup inmutable:** No hay backup físico reciente

---

## 🎯 Nueva Estructura Propuesta

```
Think_Different/
├── 00_Rules/              ← de 00_Winter_is_Coming/ (REGLAS)
├── 01_Os/                 ← El OS reorganizado
│   ├── 01_Core/          ← Skills, Rules, MCP, Agents (de 01_Core/)
│   ├── 04_Operations/    ← Scripts, Auto-Improvement (de 04_Operations/ + 08_Scripts_Os/)
│   ├── 02_Knowledge/    ← Documentación (de 02_Knowledge/)
│   ├── 03_Task/         ← Tareas (de 03_Tasks/)
│   ├── 05_Archive/      ← Archivo (de 05_Archive/)
│   └── 06_Projects/     ← Proyectos (de 07_Projects/)
├── 02_Playground/        ← Área de pruebas (de 06_Playground/)
├── 03_Output/            ← Resultados de trabajos
├── AGENTS.md             ← Redirige a 00_Rules/AGENTS.md
├── CLAUDE.md             ← Actualizado con nuevos paths
└── .mcp.json            ← MCP servers
```

### Convenciones
- Prefijos numéricos: `00_`, `01_`, `02_`, `03_` para orden
- Nombres en español claros
- Backwards: alias/symlinks a paths viejos durante transición

---

## 📋 Fases de Ejecución

### ✅ Fase 0: Backups (COMPLETADOS)

| Commit | Descripción | Estado |
|--------|-------------|--------|
| 1 | Backup completo estado actual | ✅ Completado (pendiente push) |
| 2 | config_paths.py y paths críticos | ⏳ Pendiente |
| 3 | Skills index y estructura | ⏳ Pendiente |

**Backup físico:** Copia en `C:\Users\sebas\Desktop\00_Consequences\`

### Fase 1: Hacer Dinámicos los 89 Scripts

**Objetivo:** Reemplazar `sys.path.insert(0, str(_root / "08_Scripts_Os"))` por imports dinámicos

**Cambio tipo:**
```python
# ANTES (hardcodeado)
sys.path.insert(0, str(_root / "08_Scripts_Os"))

# DESPUÉS (dinámico con backwards)
from config_paths import SCRIPTS_OS_DIR
sys.path.insert(0, str(SCRIPTS_OS_DIR))
```

**Scripts a modificar:**
- 08_Scripts_Os/ (19 HUBs)
- 08_Scripts_Os/05_AIPM/ (8 archivos)
- 08_Scripts_Os/03_Validator/ (6 archivos)
- 08_Scripts_Os/11_Anthropic_Harness/ (9 archivos)
- 01_Core/03_Skills/*/scripts/ (18 archivos)
- Otros (8 archivos)
- Backup/Legacy (11 archivos)
- Hooks/Operations (4 archivos)

**Total:** 89 scripts

### Fase 2: Migrar Estructura

**Paso 2.1:** Crear carpetas nuevas
```bash
mkdir 00_Rules
mkdir 01_Os
mkdir 02_Playground
mkdir 03_Output
```

**Paso 2.2:** Mover contenido

| Origen | Destino |
|--------|--------|
| 00_Winter_is_Coming/ | 00_Rules/ |
| 01_Core/ | 01_Os/01_Core/ |
| 02_Knowledge/ | 01_Os/02_Knowledge/ |
| 03_Tasks/ | 01_Os/03_Task/ |
| 04_Operations/ | 01_Os/04_Operations/ |
| 05_Archive/ | 01_Os/05_Archive/ |
| 07_Projects/ | 01_Os/06_Projects/ |
| 06_Playground/ | 02_Playground/ |
| (nuevo) | 03_Output/ |

**Paso 2.3:** Crear symlinks de backwards (opcional)
```bash
# En Windows (NTFS junction o symlink)
mklink /D 01_Core 01_Os\01_Core
mklink /D 08_Scripts_Os 01_Os\04_Operations\03_Scripts_Os
```

### Fase 3: Actualizar Configs

**Archivos a actualizar:**
- AGENTS.md — actualizar redirect
- CLAUDE.md — actualizar boot sequence
- .mcp.json — verificar paths
- config_paths.py — añadir nuevos paths y backwards

### Fase 4: Commit Final

```
refactor: nueva estructura OS con backwards support
- 00_Rules/ <- 00_Winter_is_Coming/
- 01_Os/ <- estructura reorganizada
- 02_Playground/ <- playground
- 03_Output/ <- resultados
- backward paths en config_paths.py
```

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Archivos totales | ~15,844 |
| Skills categorías | 22 |
| MCP servers activos | 27 |
| Scripts con sys.path hardcodeado | 89 |
| Scripts usando config_paths.py | 302 ✅ |
| HUBs principales | 12 |
| Commits de backup | 3 |
| Commits de migración | 1 |

---

## ⚠️ Riscos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|--------|----------|
| Scripts rompen | Alta | Alto | Backwards via config_paths.py |
| Paths incorrectos | Media | Alto | Test post-migración con HUBs |
| Pérdida de datos | Baja | Crítico | Backups múltiples |
| Conflictos Git | Media | Bajo | Commits atómicos |

---

## 🧪 Tests Post-Migración

```bash
# Verificar que HUBs funcionan
python 08_Scripts_Os/01_Auditor_Hub.py --dry-run
python 08_Scripts_Os/04_Ritual_Hub.py --check

# Verificar skills
python 01_Core/03_Skills/00_Skill_Auditor/03_Scripts/34_Skill_Auditor.py --list

# Verificar config_paths
python 08_Scripts_Os/config_paths.py
```

---

## 📅 Cronograma Tentativo

| Fase | Duración Estimada | Estado |
|------|------------------|--------|
| Fase 0: Backups | ~15 min | ⏳ En curso |
| Fase 1: Scripts dinámicos | ~30 min | ⏳ Pendiente |
| Fase 2: Migrar estructura | ~20 min | ⏳ Pendiente |
| Fase 3: Actualizar configs | ~10 min | ⏳ Pendiente |
| Fase 4: Commit final | ~5 min | ⏳ Pendiente |

**Total estimado:** ~80 minutos

---

## 📝 Changelog

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-04-23 | Plan creado | IA + Sebastián |
| 2026-04-23 | Backups iniciados | IA + Sebastián |

---

*Plan generado por PersonalOS v1.0 | Think_Different*