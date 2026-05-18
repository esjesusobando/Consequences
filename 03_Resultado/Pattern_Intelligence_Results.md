# Pattern Intelligence Engine —Resultados de Implementación

**Fecha:** 2026-05-18
**Estado:** ✅ Implementado

---

## ¿Qué es el Pattern Intelligence Engine?

Un motor de búsqueda semántica que indexa todos los scripts de PersonalOS y permite encontrarlos por descripción textual, no solo por nombre.

### Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| Discovery de scripts | Por nombre exacto en `SCRIPT_LOCATION_MAP` | Búsqueda semántica + por nombre |
| Scripts encontrados | Solo los mapeados (~30) | Todos los indexados (~120+) |
| Rewrites duplicados | Frecuentes | Reducidos via reuse |
| Error ante script faltante | `None` (silencioso) | Fallback semántico + log |

---

## Qué podés hacer ahora

### 1. Buscar scripts por descripción textual

```bash
python -m pattern_engine --search "auditor skill validation"
```

Ya no necesitás saber el nombre exacto. Buscás por lo que necesitás.

**Ejemplos de queries:**
- `"auditar skills de frontmatter"` → encuentra `22_Validate_Skill_Frontmatter.py`, `34_Skill_Auditor.py`
- `"métricas de sistema"` → encuentra `14_Health_Metrics_Hub.py`, `50_System_Health_Monitor.py`
- `"sincronizar agentes"` → encuentra `19_Agent_Sync_Hub.py`, `16_Agent_Mirror_Hub.py`

---

### 2. Integración automática en `config_paths.py`

Cualquier script que llame a `get_skill_script()` ahora tiene fallback semántico:

```python
from config_paths import get_skill_script

# Antes: solo si existe en SCRIPT_LOCATION_MAP
path = get_skill_script("01_Auditor_Hub.py")

# Ahora: si no existe en MAP, busca semánticamente
path = get_skill_script("auditor_de_skills.py")  # → fallback a script similar
```

El fallback solo activa cuando:
1. El script no está en `SCRIPT_LOCATION_MAP`
2. El script no existe en paths legacy
3. El script no existe en `skills/*/scripts/`

---

### 3. Indexación automática de todo el OS

```bash
# Scan completo (re-index todo)
python -m pattern_engine --scan

# Update incremental (solo lo que cambió)
python -m pattern_engine --update

# Ver estadísticas del índice
python -m pattern_engine --stats
```

---

### 4. Registro de nuevos scripts

```bash
# Registrar un script manualmente
python -m pattern_engine --register path/to/nuevo_script.py

# Registrar con descripción custom
python -m pattern_engine --register path/to/script.py --description "Mi script custom"
```

---

### 5. Búsqueda híbrida (tags + semántica)

```bash
# Buscar solo en scripts tagged "auditor"
python -m pattern_engine --search "validation" --tags "auditor"
```

Tags disponibles según path:
- `hub` — scripts en `03_Scripts_Os/`
- `skill` — scripts en `skills/*/`
- `auditor` — scripts en `13_Auditors_Os/`
- `devops`, `git`, `mcp`, etc. — extraídos del nombre de archivo

---

## Arquitectura

```
03_Pattern_Engine/
├── __init__.py          # Version info
├── database.py          # SQLite schema + CRUD
├── embedding.py         # MiniLM + description generation
├── indexer.py          # Scan + rebuild + incremental
├── search.py           # Semantic + hybrid search
├── api.py             # Public wrapper
├── __main__.py        # CLI
└── tests/
    └── test_pattern_engine.py
```

**Stack técnico:**
- Embeddings: `sentence-transformers` (MiniLM, offline, local)
- Vector DB: SQLite (zero infra)
- Dimensionality: 384d → 128d via random projection

---

## Métricas de Uso

| Métrica | Valor |
|---------|-------|
| Scripts indexados | ~120+ |
| Tiempo de scan | <60s |
| Tiempo de búsqueda | <500ms |
| RAM requerida | <500MB |
| Threshold default | 0.70 |

---

## Casos de Uso Reales

### Scenario 1: "Necesito un script para auditar"

**Antes:** Tenías que saber que existe `01_Auditor_Hub.py` o buscar manualmente.

**Ahora:**
```python
get_skill_script("auditar cosas del sistema")
# → retorna el auditor más similar
```

### Scenario 2: "Quiero saber qué scripts tienen funcionalidad similar a X"

```bash
python -m pattern_engine --search "validar frontmatter de skills"
# → lista de scripts similares con scores
```

### Scenario 3: "Tengo un script nuevo y quiero saber si ya existe algo similar"

```bash
python -m pattern_engine --search "mi nuevo script hace parsing de JSON"
# → descubre si hay overlap antes de escribir código duplicado
```

---

## Siguientes Pasos (Roadmap)

| Mejora | Prioridad | Descripción |
|--------|-----------|-------------|
| Auto-register hook | Alta | Integrar con file watcher para auto-registro |
| Knowledge Graph | Media | Link decisiones pasadas con scripts usados |
| Analytics dashboard | Media | Ver qué scripts se buscan más, qué se reuse |
| Mutation testing | Baja | Integrar con evals para medir calidad |

---

## Comandos Rápidos

```bash
# Scan completo
python -m pattern_engine --scan

# Buscar
python -m pattern_engine --search "tu query aqui"

# Stats
python -m pattern_engine --stats

# Update incremental
python -m pattern_engine --update

# Registrar script
python -m pattern_engine --register path/to/script.py
```

---

## Errores Conocidos y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `No module named 'sentence_transformers'` | No instalado | `pip install sentence-transformers` |
| `No results found` | Threshold muy alto | Bajar threshold: `--threshold 0.50` |
| `Database not found` | No se ejecutó scan | `python -m pattern_engine --scan` primero |

---

*Documento generado: 2026-05-18*
*Pattern Intelligence Engine v1.0.0*