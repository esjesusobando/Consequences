"""
search.py — Semantic and Hybrid Search
=====================================
Implements semantic similarity search and hybrid (tag + semantic) search.
"""

import logging
import math
from pathlib import Path
from typing import List, Tuple, Optional

import numpy as np

import database as db
from embedding import generate_embedding

logger = logging.getLogger(__name__)

DEFAULT_THRESHOLD = 0.70
DEFAULT_TOP_K = 3


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    vec_a = np.array(a)
    vec_b = np.array(b)

    dot = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(dot / (norm_a * norm_b))


def semantic_search(
    query: str,
    top_k: int = DEFAULT_TOP_K,
    threshold: float = DEFAULT_THRESHOLD
) -> List[Tuple[int, float, str]]:
    """Perform pure semantic search.

    Args:
        query: Text description to search for
        top_k: Number of results to return
        threshold: Minimum similarity score (0-1)

    Returns:
        List of (script_id, similarity_score, description) tuples,
        sorted by similarity descending.
    """
    # Generate query embedding
    try:
        query_embedding = generate_embedding(query)
    except Exception as e:
        logger.error(f"Failed to generate query embedding: {e}")
        return []

    # Get all embeddings from DB
    try:
        all_embeddings = db.get_all_embeddings()
    except Exception as e:
        logger.error(f"Failed to load embeddings from DB: {e}")
        return []

    if not all_embeddings:
        logger.warning("No embeddings in database - run --scan first")
        return []

    # Compute similarities
    scored = []
    for script_id, embedding in all_embeddings:
        score = cosine_similarity(query_embedding, embedding)
        if score >= threshold:
            scored.append((script_id, score))

    # Sort by score descending
    scored.sort(key=lambda x: x[1], reverse=True)

    # Get top_k with descriptions
    results = []
    for script_id, score in scored[:top_k]:
        script = db.get_script_by_id(script_id)
        if script:
            results.append((script_id, score, script["description"]))

    return results


def hybrid_search(
    query: str,
    tags: List[str],
    top_k: int = DEFAULT_TOP_K,
    threshold: float = DEFAULT_THRESHOLD
) -> List[Tuple[int, float, str]]:
    """Perform hybrid search: filter by tags first, then rank by semantic similarity.

    Args:
        query: Text description to search for
        tags: List of tags to filter by (OR logic - script matches ANY tag)
        top_k: Number of results to return
        threshold: Minimum similarity score (0-1)

    Returns:
        List of (script_id, similarity_score, description) tuples.
    """
    if not tags:
        return semantic_search(query, top_k, threshold)

    # Get script IDs that match any of the tags
    matching_ids: set = set()
    for tag in tags:
        by_tag = db.get_scripts_by_tag(tag)
        matching_ids.update(by_tag)

    if not matching_ids:
        logger.info(f"No scripts found with tags: {tags}")
        return semantic_search(query, top_k, threshold)

    # Generate query embedding
    try:
        query_embedding = generate_embedding(query)
    except Exception as e:
        logger.error(f"Failed to generate query embedding: {e}")
        return []

    # Compute similarities only for matching scripts
    scored = []
    for script_id in matching_ids:
        embedding = db.get_embedding(script_id)
        if embedding is None:
            continue

        score = cosine_similarity(query_embedding, embedding)
        if score >= threshold:
            scored.append((script_id, score))

    # Sort by score descending
    scored.sort(key=lambda x: x[1], reverse=True)

    # Get top_k with descriptions
    results = []
    for script_id, score in scored[:top_k]:
        script = db.get_script_by_id(script_id)
        if script:
            results.append((script_id, score, script["description"]))

    return results


def search(
    query: str,
    top_k: int = DEFAULT_TOP_K,
    tags: Optional[List[str]] = None,
    threshold: float = DEFAULT_THRESHOLD
) -> List[Tuple[Path, float, str]]:
    """Main search interface.

    Args:
        query: Text description to search for
        top_k: Number of results to return
        tags: Optional list of tags to filter by
        threshold: Minimum similarity score (0-1)

    Returns:
        List of (script_path, similarity_score, description) tuples.
    """
    # Sanitize query - reject path traversal attempts
    if query and any(c in query for c in ["..", "/", "\\", "\x00"]):
        logger.warning(f"Query rejected: potentially malicious input")
        return []

    if len(query) > 1000:
        query = query[:1000]
        logger.warning("Query truncated to 1000 chars")

    used_hybrid = tags is not None and len(tags) > 0

    if used_hybrid:
        results = hybrid_search(query, tags, top_k, threshold)
    else:
        results = semantic_search(query, top_k, threshold)

    # Resolve to full paths and filter by threshold
    resolved = []
    for script_id, score, description in results:
        script = db.get_script_by_id(script_id)
        if script:
            resolved.append((Path(script["path"]), score, description))

    # Log search for analytics
    log_results = [
        {"script_id": script_id, "score": float(score)}
        for script_id, score, _ in results
    ]
    db.log_search(query, log_results, used_hybrid)

    return resolved


# Convenience function for config_paths integration
def find_similar_scripts(
    query: str,
    top_k: int = 3,
    tags: Optional[List[str]] = None,
    threshold: float = DEFAULT_THRESHOLD
) -> List[Tuple[Path, float, str]]:
    """Find scripts similar to query.

    Alias for search() for cleaner integration.
    """
    return search(query, top_k, tags, threshold)


if __name__ == "__main__":
    # CLI test
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Pattern Intelligence Search")
    parser.add_argument("query", nargs="+", help="Search query")
    parser.add_argument("--top-k", type=int, default=DEFAULT_TOP_K, help=f"Number of results (default: {DEFAULT_TOP_K})")
    parser.add_argument("--tags", type=str, help="Comma-separated tags to filter by")
    parser.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD, help=f"Minimum score (default: {DEFAULT_THRESHOLD})")

    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO)

    query = " ".join(args.query)
    tag_list = args.tags.split(",") if args.tags else None

    results = search(query, top_k=args.top_k, tags=tag_list, threshold=args.threshold)

    if not results:
        print("No results found")
        sys.exit(0)

    print(f"\n🔍 Results for: '{query}'")
    if tag_list:
        print(f"   Tags: {tag_list}")
    print()
    for path, score, description in results:
        print(f"  [{score:.2f}] {path.name}")
        print(f"       {description[:80]}...")
        print()