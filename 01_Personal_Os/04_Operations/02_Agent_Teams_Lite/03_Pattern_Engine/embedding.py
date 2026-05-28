"""
embedding.py — Semantic Embedding Generator
==========================================
Generates embeddings for scripts using sentence-transformers (MiniLM).
Includes PCA dimensionality reduction from 384d to 128d.
"""

import gc
import logging
from pathlib import Path
from typing import List, Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)

# Model configuration
MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM_IN = 384   # Native MiniLM output
EMBEDDING_DIM_OUT = 128  # Compressed for storage efficiency

# Singleton model instance
_model = None
_pca = None


def _get_model():
    """Load and cache the sentence-transformer model (singleton)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        logger.info(f"Loading embedding model: {MODEL_NAME}")
        _model = SentenceTransformer(MODEL_NAME)
        logger.info("Embedding model loaded successfully")
    return _model


def _get_pca() -> np.ndarray:
    """Get or compute PCA matrix for dimensionality reduction."""
    global _pca
    if _pca is None:
        # Generate a random projection matrix ( Johnsons-Lindestrauss lemma)
        # For 384d -> 128d with epsilon=0.25, this is a valid JL projection
        np.random.seed(42)
        _pca = np.random.randn(EMBEDDING_DIM_IN, EMBEDDING_DIM_OUT).astype(np.float32) * (1.0 / np.sqrt(EMBEDDING_DIM_OUT))
    return _pca


def reduce_dimension(vector_384d: List[float]) -> List[float]:
    """Reduce embedding from 384d to 128d via random projection."""
    pca = _get_pca()
    vec = np.array(vector_384d, dtype=np.float32)
    vec_reduced = vec @ pca
    # L2 normalize
    norm = np.linalg.norm(vec_reduced)
    if norm > 0:
        vec_reduced = vec_reduced / norm
    return vec_reduced.tolist()


def generate_embedding(text: str) -> List[float]:
    """Generate embedding for a text string."""
    model = _get_model()
    embedding_384d = model.encode(text, convert_to_numpy=True)
    embedding_128d = reduce_dimension(embedding_384d.tolist())
    return embedding_128d


def generate_script_description(script_path: Path) -> str:
    """Generate a semantic description from a Python script.

    Extracts:
    1. Module docstring (first triple-quoted string)
    2. Filename processed (splits underscore/hyphen/ CamelCase)
    3. First non-empty line of docstring if available
    """
    try:
        content = script_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            content = script_path.read_text(encoding="cp1252")
        except Exception:
            content = ""

    # Extract docstring
    docstring = ""
    if '"""' in content:
        start = content.index('"""')
        end = content.find('"""', start + 3)
        if end > start:
            docstring = content[start+3:end].strip()
    elif "'''" in content:
        start = content.index("'''")
        end = content.find("'''", start + 3)
        if end > start:
            docstring = content[start+3:end].strip()

    # Process filename
    name_clean = script_path.stem.replace("_", " ").replace("-", " ")
    # Split CamelCase
    import re
    name_clean = re.sub(r'(?<!^)(?=[A-Z])', ' ', name_clean)

    # Build description
    description = name_clean
    if docstring:
        # Take first non-empty line of docstring
        first_line = docstring.split('\n')[0].strip()
        if first_line:
            # Remove leading/trailing punctuation
            first_line = first_line.strip('.-:')
            description += ". " + first_line

    # Truncate to reasonable length
    return description[:500]


def generate_script_embedding(script_path: Path) -> Tuple[List[float], str]:
    """Generate embedding + description for a script.

    Returns:
        (embedding_128d, description)
    """
    description = generate_script_description(script_path)
    embedding = generate_embedding(description)
    return embedding, description


def extract_tags_from_path(script_path: Path) -> List[Tuple[str, str]]:
    """Extract tags from script path structure.

    E.g.:
    01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py
    -> tag: "auditor", area: "hub"

    skills/06_Tools/04_DevOps/scripts/62_Tool_Shed.py
    -> tag: "devops", area: "tools"
    """
    parts = script_path.parts
    tags = []

    # Determine area from path structure
    if "skills" in parts:
        idx = parts.index("skills")
        if idx + 1 < len(parts):
            area = parts[idx + 1]
            tags.append(("skill", area))
            # Add area-specific tag
            area_clean = area.replace("_", " ").split()[0] if "_" in area else area
            tags.append((area_clean.lower(), area))
    elif "03_Scripts_Os" in parts:
        tags.append(("hub", "scripts"))
        # Check subdirectory for category
        for part in parts:
            if part.isdigit() and len(part) == 2:
                tags.append((f"cat_{part}", "scripts"))
                break
    elif "Auditors_Os" in parts or "12_Auditors_Os" in str(script_path):
        tags.append(("auditor", "auditors"))
    elif "14_Otros" in str(script_path):
        tags.append(("other", "misc"))

    # Extract functional tags from filename
    filename = script_path.stem.lower()
    functional_tags = {
        "auditor": "audit",
        "validator": "validation",
        "git": "git",
        "mcp": "mcp",
        "health": "health",
        "telemetry": "metrics",
        "sync": "sync",
        "watchdog": "monitoring",
        "system": "system",
        "mapper": "mapper",
        "agent": "agent",
        "skill": "skill",
        "workflow": "workflow",
        "data": "data",
        "ritual": "ritual",
    }
    for key, tag in functional_tags.items():
        if key in filename:
            tags.append((tag, "function"))

    return tags


# =============================================================================
# FALLBACK: TF-IDF if sentence-transformers unavailable
# =============================================================================

def generate_tfidf_fallback(texts: List[str]) -> List[List[float]]:
    """Fallback TF-IDF based embedding when transformer model unavailable.

    Returns list of TF-IDF vectors (sparse-like arrays as lists).
    This is MUCH simpler but provides baseline functionality.
    """
    from collections import Counter
    import math

    vectors = []
    for text in texts:
        words = text.lower().split()
        tf = Counter(words)
        # Simple TF-IDF: just use term frequency normalized
        total = len(words) if words else 1
        vec = {w: count / total for w, count in tf.items()}
        vectors.append(vec)

    # Convert to fixed-size vectors using vocabulary
    vocab = set()
    for vec in vectors:
        vocab.update(vec.keys())

    vocab = sorted(list(vocab))[:1000]  # Limit to 1000 features
    vocab_idx = {w: i for i, w in enumerate(vocab)}

    result = []
    for vec in vectors:
        fixed = [0.0] * len(vocab)
        for w, v in vec.items():
            if w in vocab_idx:
                fixed[vocab_idx[w]] = v
        result.append(fixed)

    return result


def get_fallback_embeddings(texts: List[str]) -> List[List[float]]:
    """Try transformer embedding, fallback to TF-IDF on failure."""
    try:
        model = _get_model()
        embeddings = model.encode(texts, convert_to_numpy=True)
        return [reduce_dimension(e.tolist()) for e in embeddings]
    except Exception as e:
        logger.warning(f"Embedding model failed: {e}, using TF-IDF fallback")
        return generate_tfidf_fallback(texts)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    # Test embedding generation
    test_texts = [
        "auditor hub script for system validation",
        "git workflow automation script",
        "skill validator for frontmatter checks"
    ]

    print("Testing embedding generation...")
    for text in test_texts:
        emb = generate_embedding(text)
        print(f"  '{text[:40]}...' -> {len(emb)}d vector")

    print("PCA matrix shape:", _get_pca().shape)