"""
database.py — SQLite Database for Pattern Intelligence Engine
============================================================
Handles all database operations: schema creation, CRUD, integrity checks.
"""

import sqlite3
import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Tuple, Any


DB_PATH = Path(__file__).parent / "pattern_index.db"


def get_connection() -> sqlite3.Connection:
    """Get a database connection with row factory."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create database schema if not exists."""
    conn = get_connection()
    cursor = conn.cursor()

    # Scripts metadata
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scripts (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            path            TEXT UNIQUE NOT NULL,
            name            TEXT NOT NULL,
            description     TEXT,
            code_hash       TEXT,
            lines_of_code   INTEGER DEFAULT 0,
            last_indexed    DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_modified  DATETIME
        )
    """)

    # Embeddings stored as JSON (list of floats)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS embeddings (
            script_id   INTEGER PRIMARY KEY REFERENCES scripts(id) ON DELETE CASCADE,
            vector      BLOB NOT NULL,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tags for hybrid search
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tags (
            script_id   INTEGER REFERENCES scripts(id) ON DELETE CASCADE,
            tag         TEXT NOT NULL,
            area        TEXT,
            PRIMARY KEY (script_id, tag)
        )
    """)

    # Search history for analytics
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS search_history (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            query       TEXT,
            results     TEXT,
            used_hybrid INTEGER DEFAULT 0,
            timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Index metadata
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS index_meta (
            key         TEXT PRIMARY KEY,
            value       TEXT
        )
    """)

    # Full-text search for descriptions
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_scripts_name ON scripts(name)
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_scripts_path ON scripts(path)
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_tags_area ON tags(area)
    """)

    conn.commit()
    conn.close()


def db_exists() -> bool:
    """Check if database file exists."""
    return DB_PATH.exists()


def check_integrity() -> bool:
    """Run PRAGMA integrity_check on the database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("PRAGMA integrity_check")
    result = cursor.fetchone()[0]
    conn.close()
    return result == "ok"


def delete_db() -> None:
    """Delete the database file (for testing or rebuild)."""
    if DB_PATH.exists():
        DB_PATH.unlink()


# =============================================================================
# SCRIPTS CRUD
# =============================================================================

def insert_script(
    path: Path,
    name: str,
    description: str,
    code_hash: str,
    lines_of_code: int,
    last_modified: datetime
) -> int:
    """Insert a new script and return its ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR REPLACE INTO scripts (path, name, description, code_hash, lines_of_code, last_modified)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (str(path), name, description, code_hash, lines_of_code, last_modified.isoformat() if last_modified else None)
    )
    script_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return script_id


def get_script_by_path(path: Path) -> Optional[dict]:
    """Get script record by path."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scripts WHERE path = ?", (str(path),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_script_by_id(script_id: int) -> Optional[dict]:
    """Get script record by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scripts WHERE id = ?", (script_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_all_scripts() -> List[dict]:
    """Get all scripts."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scripts ORDER BY name")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def delete_script(script_id: int) -> None:
    """Delete a script and its embeddings/tags (cascade)."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scripts WHERE id = ?", (script_id,))
    conn.commit()
    conn.close()


def script_exists(path: Path) -> bool:
    """Check if script is already indexed."""
    return get_script_by_path(path) is not None


# =============================================================================
# EMBEDDINGS CRUD
# =============================================================================

def insert_embedding(script_id: int, vector: List[float]) -> None:
    """Insert or replace embedding for a script."""
    import json
    conn = get_connection()
    cursor = conn.cursor()
    # Store as JSON blob
    vector_json = json.dumps(vector)
    cursor.execute(
        "INSERT OR REPLACE INTO embeddings (script_id, vector) VALUES (?, ?)",
        (script_id, vector_json)
    )
    conn.commit()
    conn.close()


def get_embedding(script_id: int) -> Optional[List[float]]:
    """Get embedding vector for a script."""
    import json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT vector FROM embeddings WHERE script_id = ?", (script_id,))
    row = cursor.fetchone()
    conn.close()
    return json.loads(row[0]) if row else None


def get_all_embeddings() -> List[Tuple[int, List[float]]]:
    """Get all script_id + embedding pairs."""
    import json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT script_id, vector FROM embeddings")
    rows = cursor.fetchall()
    conn.close()
    return [(row["script_id"], json.loads(row["vector"])) for row in rows]


# =============================================================================
# TAGS CRUD
# =============================================================================

def insert_tags(script_id: int, tags: List[Tuple[str, str]]) -> None:
    """Insert tags for a script. tags is list of (tag, area) tuples."""
    conn = get_connection()
    cursor = conn.cursor()
    for tag, area in tags:
        cursor.execute(
            "INSERT OR IGNORE INTO tags (script_id, tag, area) VALUES (?, ?, ?)",
            (script_id, tag, area)
        )
    conn.commit()
    conn.close()


def get_tags_for_script(script_id: int) -> List[Tuple[str, str]]:
    """Get all tags for a script."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT tag, area FROM tags WHERE script_id = ?", (script_id,))
    rows = cursor.fetchall()
    conn.close()
    return [(row["tag"], row["area"]) for row in rows]


def get_scripts_by_tag(tag: str) -> List[int]:
    """Get script IDs that have a specific tag."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT script_id FROM tags WHERE tag = ?", (tag,))
    rows = cursor.fetchall()
    conn.close()
    return [row["script_id"] for row in rows]


def get_scripts_by_area(area: str) -> List[int]:
    """Get script IDs that belong to an area."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT script_id FROM tags WHERE area = ?", (area,))
    rows = cursor.fetchall()
    conn.close()
    return [row["script_id"] for row in rows]


# =============================================================================
# SEARCH HISTORY
# =============================================================================

def log_search(query: str, results: List[dict], used_hybrid: bool) -> None:
    """Log a search query and its results."""
    import json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO search_history (query, results, used_hybrid) VALUES (?, ?, ?)",
        (query, json.dumps(results), 1 if used_hybrid else 0)
    )
    conn.commit()
    conn.close()


def get_recent_searches(limit: int = 20) -> List[dict]:
    """Get recent search history."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM search_history ORDER BY timestamp DESC LIMIT ?",
        (limit,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


# =============================================================================
# INDEX META
# =============================================================================

def set_meta(key: str, value: str) -> None:
    """Set a metadata key-value pair."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO index_meta (key, value) VALUES (?, ?)",
        (key, value)
    )
    conn.commit()
    conn.close()


def get_meta(key: str) -> Optional[str]:
    """Get a metadata value."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT value FROM index_meta WHERE key = ?", (key,))
    row = cursor.fetchone()
    conn.close()
    return row["value"] if row else None


# =============================================================================
# UTILITY
# =============================================================================

def compute_hash(content: str) -> str:
    """Compute SHA256 hash of content."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def compute_code_hash(path: Path) -> str:
    """Compute hash of a file's content."""
    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            content = path.read_text(encoding="cp1252")
        except Exception:
            content = ""
    return compute_hash(content)


if __name__ == "__main__":
    init_db()
    print(f"Database initialized at: {DB_PATH}")
    print(f"Integrity: {check_integrity()}")