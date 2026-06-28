# SDD: Pattern Intelligence + Script Reuse Engine
## Compound Engineering v2.0 — Semantic Search para Scripts y Decisiones

---

## Meta
- **Change ID:** pattern-intelligence-v1
- **Versión:** 0.1 (draft)
- **Fecha:** 2026-05-18
- **Estado:** PROPOSAL
- **Artifact Store:** openspec (file-based, shareable)

---

## 1. Context & Motivation

### Problema Actual

`get_skill_script()` en `config_paths.py` opera por **nombre exacto**. Si el mapping no existe, retorna None. Esto causa:

- **Rewrites duplicates:** Scripts con funcionalidad similar se reescriben porque no hay forma de encontrar "el que hace esto"
- **Orfanidad técnica:** 342 skills × N scripts = miles de posibilidades, pero solo 30 HUBs tienen mapping hardcoded
- **Debt técnico silencioso:** El agente no aprende de decisiones pasadas
- **Fragilidad del SCRIPT_LOCATION_MAP:** Si un script se mueve sin actualizar el map, retorna None aunque exista

### Costos del Status Quo

| Escenario | Costo estimado |
|-----------|---------------|
| Rewrite de script similar | 30-60 min |
| Bug por script outdated | 1-4 horas |
| Debt acumulado por no reuse | Invisible pero crece |

### Por qué ESTA mejora

1. **High ROI:** 1 script reusable = 1hora saved × N veces usado
2. **Foundation:** Pattern intelligence alimenta knowledge graph (mejora #4) y agent memory
3. **Achievable:** No requiere cambio de arquitectura, solo nuevos módulos
4. **Measurable:** % de requests resueltos por reuse vs rewrite
5. **Low risk:** No удаляет nada existente, solo mejora discovery

---

## 2. Scope

### In Scope (v1.0)

- Indexar todos los scripts existentes (`01_Personal_Os/04_Operations/03_Scripts_Os/`, `skills/*/scripts/`, subdirectorios) con:
  - Metadata: path, nombre, fecha, línea de código, dependencias externas
  - Embedding vectorial: descripción semántica del propósito
  - Tags: categorías, áreas funcionales, inputs/outputs esperados

- API de búsqueda:
  - Búsqueda por similitud semántica (query → scripts más cercanos)
  - Búsqueda por tags/categorías
  - Búsqueda híbrida (semántica + keyword)

- Integración con `get_skill_script()`:
  - Fallback: si el mapping exacto no encuentra, buscar por embedding
  - Nuevo endpoint: `find_similar_scripts(query, top_k=3)`

- Base de datos de patterns:
  - SQLite local (no external dependency)
  - Index rebuild incremental (solo re-index lo que cambió)

### Out of Scope (v1.0)

- Knowledge graph (mejora #4) — esto es prerequisite
- Embedding de decisiones/razonamiento — solo scripts
- Multi-model comparison (mejora #6)
- Contract testing automático (mejora #1)

### Boundaries

- **Qué NO afecta:**
  - HUBs existentes siguen funcionando exactamente igual
  - `get_skill_script()` actual no cambia su API pública
  - Skills siguen siendo markdown files
  - Agents operan igual

- **Interfaces que cambian:**
  - `config_paths.py` gana `find_similar_scripts()`
  - `get_skill_script()` gana fallback a embedding search

---

## 3. Current State Analysis

### Estado Actual del Script Discovery

```
get_skill_script(script_name):
  1. Check SCRIPT_LOCATION_MAP (dict exacto)
  2. Si no existe en MAP → fallback paths legacy
  3. Si no existe ahí → None
```

**Limitaciones:**
- No hay fuzzy matching
- No hay similarity search
- No hay aprendizaje de reuses

### Inventario de Scripts Existentes

| Ubicación | Count | Tipo |
|-----------|-------|------|
| `03_Scripts_Os/*.py` (root) | 30 | HUBs y utilities |
| `03_Scripts_Os/06_Legacy/*.py` | ~25 | Legacy |
| `skills/*/scripts/*.py` | ~40 | Skill-specific |
| `09_Auditors_Os/scripts/*.py` | ~15 | Auditoria |
| `10_Otros/*.py` | ~10 | Otros |

**Total estimado:** ~120 scripts indexables

### Datos Disponibles para Indexación

Cada script tiene:
- **Nombre del archivo:** `01_Auditor_Hub.py` → "auditor hub"
- **Docstring/module comment:** describe propósito
- **Imports:** revela dependencias
- **Help text / argparse:** revela inputs/outputs
- **Path absoluto:** indica área funcional

### Dependencias Externas a Evitar (v1.0)

- **No usar:** OpenAI API para embeddings (costo, rate limits)
- **No usar:** Pinecone/Weaviate (external service dependency)
- **No usar:** ChromaDB (añade complexity innecesaria para SQLite + scikit-learn)

### Stack Técnico Válido

| Componente | Opción | Razón |
|------------|--------|-------|
| Embedding | `sentence-transformers` (local) | Gratis, offline, buena calidad |
| Vector DB | SQLite + `sqlite-vss` | Embedded, cero infra, suficiente para <10k vectors |
| API | Python module importable | No HTTP overhead |

---

## 4. Requirements

### FR-01: Script Indexing

**Descripción:** El sistema debe indexar todos los scripts Python del PersonalOS automáticamente.

**Criterios de aceptación:**
- [ ] `python -m pattern_indexer --scan` escanea todos los scripts
- [ ] Genera `pattern_index.db` con:
  - `scripts` table: id, path, name, description, code_hash, last_modified
  - `embeddings` table: script_id, vector (128d via MiniLM)
  - `tags` table: script_id, tag, area
- [ ] Index rebuild tarda <60s para 120 scripts
- [ ] Index rebuild es idempotente (re-run produce mismo resultado)

### FR-02: Semantic Search

**Descripción:** El sistema debe permitir buscar scripts por descripción semántica.

**Criterios de aceptación:**
- [ ] `find_similar_scripts("auditoria de skills")` → retorna top 3 scripts más cercanos
- [ ] Búsqueda tarda <500ms para 120 scripts (on-disk SQLite)
- [ ] Retorna: list of (script_path, similarity_score, match_reason)
- [ ] Threshold: solo retorna si similarity > 0.65, si no → empty list

### FR-03: Hybrid Search

**Descripción:** Combinar búsqueda semántica con keyword filtering.

**Criterios de aceptación:**
- [ ] `find_similar_scripts("auditoria", tags=["01_Auditor"])`
- [ ] Filtra por tags primero, luego ranking semántico dentro del subset
- [ ] Si no hay tags → pure semantic

### FR-04: Integration with get_skill_script()

**Descripción:** `get_skill_script()` debe usar embedding search como fallback.

**Criterios de aceptación:**
- [ ] `get_skill_script("01_Auditor_Hub.py")` → exact match directo (MAP no cambia)
- [ ] `get_skill_script("auditor_de_skills.py")` → fallback a semantic search si MAP miss
- [ ] Semantic fallback solo activa si: exact MAP miss AND script doesn't exist at expected path
- [ ] Log: "Fallback semantic search for 'X' → found 'Y' (score: 0.XX)"

### FR-05: Incremental Index Update

**Descripción:** Index debe actualizarse incrementally, no full rebuild.

**Criterios de aceptación:**
- [ ] `python -m pattern_indexer --update` solo re-index scripts modificados desde último scan
- [ ] Detecta cambios via: file hash + last_modified
- [ ] Si no hay cambios → "Index up to date, no rebuild needed"
- [ ] `--force-rebuild` flag para full rebuild cuando sea necesario

### FR-06: Script Registration (New Scripts)

**Descripción:** Cuando se crea un nuevo script, debe poder registrarse en el index.

**Criterios de aceptación:**
- [ ] `python -m pattern_indexer --register path/to/script.py`
- [ ] Auto-genera description desde docstring
- [ ] Asigna tags desde path (ej: `skills/06_Tools/` → tag: `tools`)
- [ ] Retorna: "Registered 01_Spider_Brainstorm.py with id:42"

### NFR-01: Offline Operation

**Descripción:** Todo debe funcionar sin conexión a internet.

- [ ] `sentence-transformers` cargada localmente (MiniLM via torch)
- [ ] No hay llamadas a APIs externas
- [ ] No hay rate limits

### NFR-02: Performance

**Descripción:** Latencia aceptable para uso interactivo.

- [ ] Semantic search: <500ms para 120 scripts
- [ ] Index rebuild: <60s para 120 scripts
- [ ] Index update: <5s para 1 script modificado
- [ ] Memory: <500MB RAM total

### NFR-03: Storage

**Descripción:** footprint razonable.

- [ ] `pattern_index.db`: ~10MB para 120 scripts (128d vectors × 120 ≈ 60KB, + overhead SQLite)
- [ ] Embedding model cache: ~500MB first run, luego cached

### NFR-04: Graceful Degradation

**Descripción:** Si el index está corrupto o no existe, el sistema sigue funcionando.

- [ ] Si `pattern_index.db` no existe → `get_skill_script()` usa solo MAP + legacy paths (comportamiento actual)
- [ ] Si DB existe but query fails → log warning, fallback a legacy behavior
- [ ] Si embedding model fails to load → log error, fallback a keyword-only search

---

## 5. Design

### 5.1 Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    PATTERN INTELLIGENCE ENGINE                  │
│                     (01_Personal_Os/04_Operations/             │
│                      02_Agent_Teams_Lite/                      │
│                      03_Pattern_Engine/)                       │
└─────────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  indexer.py     │  │  search.py      │  │  api.py         │
│  - scan_scripts │  │  - semantic     │  │  - find_similar │
│  - generate     │  │  - hybrid      │  │  - register    │
│  - update       │  │  - keyword     │  │  - update      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VECTOR DATABASE                              │
│              pattern_index.db (SQLite + sqlite-vss)             │
│  ┌──────────┐  ┌────────────┐  ┌──────┐  ┌────────────────┐     │
│  │ scripts │  │ embeddings │  │ tags │  │ search_history │     │
│  └──────────┘  └────────────┘  └──────┘  └────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  SENTENCE_TRANSFORMERS│
                    │  (MiniLM - local)    │
                    └─────────────────────┘
```

### 5.2 Database Schema

```sql
-- Scripts metadata
CREATE TABLE scripts (
    id          INTEGER PRIMARY KEY,
    path        TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    description TEXT,
    code_hash   TEXT,
    lines_of_code INTEGER,
    last_indexed DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME
);

-- Embeddings (stored as blob of floats)
CREATE TABLE embeddings (
    script_id   INTEGER PRIMARY KEY REFERENCES scripts(id) ON DELETE CASCADE,
    vector      BLOB NOT NULL  -- 128 floats × 4 bytes = 512 bytes
);

-- Tags para hybrid search
CREATE TABLE tags (
    script_id   INTEGER REFERENCES scripts(id) ON DELETE CASCADE,
    tag        TEXT NOT NULL,
    area       TEXT,
    PRIMARY KEY (script_id, tag)
);

-- Search history (para analytics y learning)
CREATE TABLE search_history (
    id          INTEGER PRIMARY KEY,
    query       TEXT,
    results     TEXT,  -- JSON: [{"script_id": X, "score": Y}]
    used_hybrid BOOLEAN,
    timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index metadata
CREATE TABLE index_meta (
    key         TEXT PRIMARY KEY,
    value       TEXT
);
-- Holds: last_full_scan, total_scripts, model_version
```

### 5.3 API Pública

```python
# pattern_engine/api.py

from pathlib import Path
from typing import List, Optional, Tuple

def find_similar_scripts(
    query: str,
    top_k: int = 3,
    tags: Optional[List[str]] = None,
    threshold: float = 0.65
) -> List[Tuple[Path, float, str]]:
    """
    Busca scripts semánticamente similares a la query.

    Args:
        query: Descripción textual del script buscado
        top_k: Número de resultados a retornar
        tags: Si presente, filtra por estos tags primero
        threshold: Similitud mínima (0-1)

    Returns:
        List of (script_path, similarity_score, match_reason)
        Vacío si no hay match sobre threshold.

    Example:
        >>> find_similar_scripts("auditoria de skills")
        [
            (PosixPath('.../22_Validate_Skill_Frontmatter.py'), 0.87, "audit skill validate"),
            (PosixPath('.../34_Skill_Auditor.py'), 0.72, "skill audit"),
            (PosixPath('.../01_Auditor_Hub.py'), 0.68, "hub auditor"),
        ]
    """

def register_script(
    script_path: Path,
    description: Optional[str] = None,
    tags: Optional[List[str]] = None
) -> int:
    """
    Registra un script nuevo en el index.

    Returns:
        script_id del script registrado.

    Raises:
        FileNotFoundError: Si el script no existe
        ValueError: Si el script ya está registrado
    """

def update_index(
    force: bool = False
) -> dict:
    """
    Actualiza el índice incrementalmente.

    Returns:
        dict con: {"updated": N, "unchanged": M, "errors": []}
    """

def scan_scripts(
    base_path: Optional[Path] = None
) -> dict:
    """
    Escanea y re-index todos los scripts.

    Returns:
        dict con: {"indexed": N, "skipped": M, "total_time": "Xs"}
    """
```

### 5.4 Integración con config_paths.py

```python
# En config_paths.py (extracto)

from pattern_engine.api import find_similar_scripts

def get_skill_script(script_name):
    """Resuelve la ruta de un script en su skill destino."""

    # ...existing code...

    # Fallback: semantic search si MAP + legacy fallan
    if script_path is None or not script_path.exists():
        logger.info(f"MAP miss for '{script_name}', trying semantic search...")
        similar = find_similar_scripts(
            query=script_name.replace(".py", "").replace("_", " "),
            top_k=3,
            threshold=0.60  # Más permisivo para fallback
        )
        if similar:
            best_path, score, reason = similar[0]
            logger.info(
                f"Semantic fallback: '{script_name}' → '{best_path.name}' "
                f"(score: {score:.2f}, reason: {reason})"
            )
            return best_path

    return script_path  # None si todo falló
```

### 5.5 Embedding Strategy

```python
# Usamos sentence-transformers con MiniLM
# Modelo: all-MiniLM-L6-v2 (128d, 384dim original pero comprimimos a 128)

from sentence_transformers import SentenceTransformer
import numpy as np

MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 128  # Reducimos de 384 para storage efficiency

def get_embedding_model():
    """Carga el modelo una sola vez (singleton)."""
    model = SentenceTransformer(MODEL_NAME)
    return model

def generate_description(script_path: Path) -> str:
    """Genera descripción semántica desde el script."""
    content = script_path.read_text(encoding="utf-8")

    # Extraer docstring
    docstring = ""
    if '"""' in content:
        start = content.index('"""')
        end = content.find('"""', start + 3)
        if end > start:
            docstring = content[start+3:end].strip()

    # Nombre procesdo
    name_clean = script_path.stem.replace("_", " ").replace("-", " ")

    # Combinar: nombre + primera línea del docstring
    description = name_clean
    if docstring:
        first_line = docstring.split('\n')[0]
        description += ". " + first_line

    return description[:500]  # Truncar a 500 chars

# Para comprimir de 384 a 128 dims:
# - PCA (Principal Component Analysis) - rápido, sin pérdida significativa
# - O mejor: usar modelo de 128 dims directamente
```

### 5.6 Edge Cases & Handling

| Edge Case | Handling |
|-----------|----------|
| Script con docstring vacío | Usar solo nombre procesdo como descripción |
| Script muy corto (<10 líneas) | Marcar como "utility" tag, no indexing |
| Archivo no es .py | Ignorar en scan |
| Encoding UTF-8 fallando | Try cp1252, latin1, fallback: skip |
| DB corrupto | Detectar via `PRAGMA integrity_check`, rebuild si falla |
| Script borrado pero en DB | Limpiar en next update (ON DELETE CASCADE) |
| Collision de nombre | Store full path, no solo nombre |
| Modelo no disponible offline | Fallback a `sklearn.TfidfVectorizer` + cosine similarity |
| RAM insuficiente para modelo | Procesar en batches de 10, garbage collect entre batches |

### 5.7 Security Considerations

| Vulnerabilidad | Mitigación |
|----------------|------------|
| Path traversal via query | Sanitizar input: reject `..`, `/`, `\`, solo alphanumeric + spaces |
| SQL injection | Usar parameterized queries exclusivamente |
| Script con código malicioso | Index solo metadata (path, nombre, hash), NO execute el script |
| Descripciones con secrets | No indexar contenido, solo docstrings públicos |
| DoS via queries muy largas | Limitar query a 1000 chars |

### 5.8 Testing Strategy

```python
# tests/test_pattern_engine.py

def test_semantic_search_finds_auditor():
    """'auditor skill' debe retornar validate_skill y skill_auditor."""
    results = find_similar_scripts("auditor skill", top_k=3)
    assert len(results) >= 2
    paths = [str(r[0]) for r in results]
    assert any("Validate_Skill" in p for p in paths)
    assert any("Skill_Auditor" in p for p in paths)

def test_exact_name_still_preferred():
    """MAP match debe tener precedencia sobre semantic fallback."""
    # Si existe en MAP, usar MAP aunque semantic score sea bajo
    # Esto mantiene backward compatibility
    pass

def test_graceful_degradation_no_db():
    """Sin DB, get_skill_script() funciona via MAP."""
    # Remove DB temporarily
    # Call get_skill_script()
    # Should return valid path or None, never crash
    pass

def test_empty_query_returns_empty():
    """Query vacía debe retornar lista vacía, no error."""
    results = find_similar_scripts("")
    assert results == []

def test_threshold_filters_low_scores():
    """Score bajo debe ser filtrado."""
    results = find_similar_scripts("xyzqwerty123", threshold=0.9)
    assert len(results) == 0
```

---

## 6. Tasks

### Phase 1: Core Indexing

- [ ] **T-01:** Crear estructura `03_Pattern_Engine/` con `__init__.py`
- [ ] **T-02:** Implementar `database.py` — schema + CRUD operations
- [ ] **T-03:** Implementar `embedding.py` — modelo + generación de descripciones
- [ ] **T-04:** Implementar `indexer.py` — scan + rebuild + incremental update
- [ ] **T-05:** Implementar `search.py` — semantic + hybrid + keyword search
- [ ] **T-06:** Implementar `api.py` — wrapper público con clean interface
- [ ] **T-07:** Implementar CLI (`__main__.py`) para --scan, --update, --register

### Phase 2: Integration

- [ ] **T-08:** Integrar `find_similar_scripts()` en `config_paths.py`
- [ ] **T-09:** Agregar logging (usan module logger, no print)
- [ ] **T-10:** Documentar en SKILL.md dentro de `00_Compound_Engineering/`

### Phase 3: Validation & Hardening

- [ ] **T-11:** Tests unitarios: `test_pattern_engine.py`
- [ ] **T-12:** Test de integración: full scan + search cycle
- [ ] **T-13:** Edge case tests: empty DB, corrupt DB, no model
- [ ] **T-14:** Performance test: 120 scripts in <500ms
- [ ] **T-15:** Security audit: path traversal, SQL injection

### Phase 4: Deployment

- [ ] **T-16:** Primer scan completo del OS
- [ ] **T-17:** Validar que HUBs existentes siguen funcionando
- [ ] **T-18:** Commit con los cambios

---

## 7. Risks & Mitigations

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|
| Modelo no funciona offline | High | Low | Fallback a TfidfVectorizer |
| RAM exceeded en embedding | Medium | Medium | Batch processing + gc |
| DB corruption | Low | Low | Integrity check + auto-rebuild |
| Search quality poor | Medium | Medium | Threshold tunable, hybrid search |
| MAP bypass accidentally | Medium | Low | MAP tiene precedencia absoluta |

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Search relevance | >80% de queries retornan relevant result | Manual eval sample |
| Reuse rate | >30% de scripts "no encontrados en MAP" resolved via semantic | Analytics query |
| Performance | <500ms per search | Benchmark test |
| Coverage | 100% de scripts en 03_Scripts_Os indexed | Count vs ls |
| Backward compatibility | 0 HUBs rotos post-integration | Smoke test all HUBs |

---

## 9. Alternatives Considered

### Alt A: Pure SQLite sin Vector Extension

- **Pros:** Más simple, funciona en todas partes
- **Cons:** Búsqueda por similitud requiere cargar todo a memoria, lento para >1000 vectors
- **Verdict:** Descartado — performance unacceptable

### Alt B: External Vector DB (Pinecone/Weaviate)

- **Pros:** Búsqueda optimizada, scalability
- **Cons:** Dependencia externa, no funciona offline, costo
- **Verdict:** Descartado — viola NFR-01 (offline operation)

### Alt C: Solo Keyword Search (TF-IDF)

- **Pros:** Simple, rápido, no ML
- **Cons:** No entiende sinónimos, no captcha semántica
- **Verdict:** Descartado — no resuelve el problema de rewrite

### Alt D: Embedding via API (OpenAI)

- **Pros:** Mejor calidad de embeddings
- **Cons:** Costo por request, rate limits, no offline
- **Verdict:** Descartado — viola NFR-01

---

## 10. Open Questions

1. **Q-01:** ¿Usamos 128d o 384d para embeddings? 128d = más storage-efficient pero menos nuance semántico.
2. **Q-02:** ¿El index debe actualizarse automáticamente cuando se crea un script nuevo, o solo via `--register` manual?
3. **Q-03:** ¿Qué threshold default? 0.65 puede ser muy permisivo o muy estricto. Validar empíricamente.
4. **Q-04:** ¿Include scripts en `06_Legacy/` en el index? Pueden ser útiles para reuse pero también son deprecated.
5. **Q-05:** ¿Guardar search history para analytics? Útil para mejorar pero añade complexity.

---

*End of Proposal v0.1*