---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\01_Docs\ADR_Auto_Improvement_to_Core.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\01_Docs\ADR_Auto_Improvement_to_Core.md"
sync_date: "2026-08-01T00:55:46.016469"
sync_updated: true---

# ADR: Auto-Improvement Engine → Core Tool 10

> **Fecha:** 2026-07-29
> **Estado:** ✅ APROBADO
> **Tipo:** `architecture` + `product`

---

## Contexto

El Auto-Improvement Engine vivía en `03_Learning/01_Auto_Improvement/` desde la migración v4.9→v5.0. La justificación original era que `03_Learning` responde "¿Qué MEJORA al sistema?".

Sin embargo, el engine no es "aprendizaje" — es **operación del sistema**. Es el sistema inmune del OS:
1. **Detector** → escanea estructura, naming, docs, dependencias
2. **Analyzer** → clasifica severidad, prioriza
3. **Executor** → aplica fixes (6 fixers: missing dirs, version mismatch, docstrings, naming, duplicates, dependencies)
4. **Learner** → extrae patrones de fixes aplicados
5. **Triggers** → manual y cron (protegido, dry-run por defecto)

## Decisión

**Mover a `00_Core/02_Tools/10_Auto_Improvement/`**

Razones:
- Es un **tool del Core** — mantiene la salud de todos los demás tools
- El número `10` señala su importancia: es el guardián, el último tool que vela por todos
- Libera `03_Learning` para que sea realmente aprendizaje (Capital Token, etc.)

## Impacto

~33 archivos referencian la ruta anterior. Se actualizarán:
- `config_paths.py` — variable `AUTO_IMPROVEMENT_DIR`
- 10+ HUBs que importan o referencian el engine
- Rules y registros (context_profiles.yaml, UNIFIED_REGISTRY.md, etc.)
- Docs SDD (Evolucion_OS_v5.0.md)
- El propio engine tiene paths hardcodeados de export

---

## Producto Futuro: "Recursive Self-Improvement Engine"

Este engine tiene potencial como **producto standalone**. No es solo un script de mantenimiento — es un **sistema de auto-mejora recursiva** que:

### Core Capabilities
- **Pipeline Detect→Analyze→Execute→Learn** en loop
- **6 fixers reales** (structure, docs, code, naming, duplicates, deps)
- **Dry-run por defecto** con protección LIVE
- **Learner** que extrae patrones y evoluciona reglas

### Diferenciación
- No es un linter — es un **sistema inmune autónomo**
- Aprende de sus propios fixes (no reglas estáticas)
- Diseñado para agentes de IA, no para humanos
- Se adapta a la estructura de cualquier proyecto

### Potencial de Mercado
- Equipos que usan Claude Code, Cursor, Copilot
- Proyectos con ~1000+ archivos que necesitan mantenimiento estructural
- Overlap con: sonarcloud, sourcery, mega-linter PERO con enfoque agentic y auto-aprendizaje
- Diferenciador clave: **no necesita config — descubre la estructura y se adapta**

### Next Steps (Producto)
1. Extraer el core engine como paquete independiente
2. Crear CLI installable (`pip install recursive-engine` o similar)
3. Documentar API de fixers (permite fixers custom)
4. Publicar como open source + SaaS?

---

## Referencias

- Engine source: `00_Core/02_Tools/10_Auto_Improvement/01_Engine/`
- Backlog: `00_Winter_is_Coming/BACKLOG.md` — item #14
