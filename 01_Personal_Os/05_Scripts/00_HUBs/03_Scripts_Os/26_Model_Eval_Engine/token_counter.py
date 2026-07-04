"""
token_counter.py — Token Counter Wrappers
==========================================
Cuenta tokens para modelos API y locales.
Soporta:
  - tiktoken (OpenAI)
  - Anthropic tokenizers
  - HuggingFace AutoTokenizer (modelos locales)
  - Fallback: estimación rough (4 chars / token)

Uso:
    from token_counter import count_tokens, TokenCounter
    n = count_tokens("Hello world", model="gpt-5.1")
    counter = TokenCounter()
    report = counter.count_call("gpt-5.1", "input text", "output text")
"""

import json
from pathlib import Path
from typing import Optional


# ---------------------------------------------------------------------------
# Tokenizer registry: qué tokenizer usar para cada modelo
# ---------------------------------------------------------------------------

TOKENIZER_MAP = {
    # OpenAI
    "gpt-5.1": "tiktoken",
    "gpt-5.5-codex": "tiktoken",
    # Anthropic
    "claude-sonnet-4.8": "anthropic",
    "claude-opus-4.8": "anthropic",
    # Google
    "gemini-3-pro": "google",
    "gemini-3-ultra": "google",
    # Mistral
    "mistral-large-3": "mistral",
    # Open-source (HuggingFace)
    "llama-4-70b": "huggingface",
    "glm-5.2": "huggingface",
    "deepseek-v4": "huggingface",
}

# Fallback: characters per token ratio (varies by tokenizer)
# ~4 chars/token for English, ~2 for CJK
CHARS_PER_TOKEN = 4.0


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def count_tokens(text: str, model: str = "gpt-5.1", encoder: Optional[str] = None) -> int:
    """Count tokens in text using the appropriate tokenizer.

    Args:
        text: Text to count tokens for
        model: Model name (used to select tokenizer)
        encoder: Force specific encoder type

    Returns:
        Number of tokens
    """
    if not text:
        return 0

    if encoder is None:
        encoder = TOKENIZER_MAP.get(model, "tiktoken")

    try:
        if encoder == "tiktoken":
            return _count_tiktoken(text, model)
        elif encoder == "anthropic":
            return _count_anthropic(text)
        elif encoder == "huggingface":
            return _count_huggingface(text, model)
        else:
            # Fallback for google, mistral, or unknown
            return _count_fallback(text)
    except Exception:
        return _count_fallback(text)


def count_tokens_batch(texts: list, model: str = "gpt-5.1") -> list:
    """Count tokens for a batch of texts."""
    return [count_tokens(t, model) for t in texts]


# ---------------------------------------------------------------------------
# Tokenizer implementations
# ---------------------------------------------------------------------------


def _count_tiktoken(text: str, model: str) -> int:
    """Count using tiktoken (OpenAI)."""
    try:
        import tiktoken
        # Map model to encoding
        try:
            encoding = tiktoken.encoding_for_model(model)
        except KeyError:
            # Fallback to cl100k_base for unknown models
            encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))
    except ImportError:
        return _count_fallback(text)


def _count_anthropic(text: str) -> int:
    """Count using Anthropic's tokenizer."""
    try:
        # Anthropic no tiene tokenizer público standalone.
        # Alternativa: usar la estimación de Anthropic (~5 chars/token para Claude)
        return max(1, len(text) // 5)
    except Exception:
        return _count_fallback(text)


def _count_huggingface(text: str, model: str) -> int:
    """Count using HuggingFace AutoTokenizer."""
    try:
        from transformers import AutoTokenizer
        # Try to load tokenizer for this model
        try:
            tokenizer = AutoTokenizer.from_pretrained(model, trust_remote_code=True)
            return len(tokenizer.encode(text))
        except Exception:
            # Fallback to a common open-source tokenizer
            tokenizer = AutoTokenizer.from_pretrained(
                "bert-base-uncased", trust_remote_code=True
            )
            return len(tokenizer.encode(text))
    except ImportError:
        return _count_fallback(text)


def _count_fallback(text: str) -> int:
    """Rough fallback: chars / chars_per_token."""
    return max(1, round(len(text) / CHARS_PER_TOKEN))


# ---------------------------------------------------------------------------
# TokenCounter class (with tracking)
# ---------------------------------------------------------------------------


class TokenCounter:
    """Token counter with call tracking and reporting.

    Usage:
        counter = TokenCounter()
        n = counter.count("Hello world", model="gpt-5.1")
        report = counter.count_call("gpt-5.1", "input text", "output text")
        summary = counter.summary()
    """

    def __init__(self):
        self._history = []

    def count(self, text: str, model: str = "gpt-5.1") -> int:
        """Count tokens in text."""
        return count_tokens(text, model)

    def count_call(
        self,
        model: str,
        input_text: str,
        output_text: str,
    ) -> dict:
        """Count tokens for a complete call (input + output).

        Returns:
            dict with tokens_in, tokens_out, tokens_total, model
        """
        tokens_in = count_tokens(input_text, model)
        tokens_out = count_tokens(output_text, model)

        result = {
            "model": model,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "tokens_total": tokens_in + tokens_out,
        }

        self._history.append(result)
        return result

    def get_history(self) -> list:
        return self._history

    def summary(self) -> dict:
        """Get token usage summary across all tracked calls."""
        if not self._history:
            return {}

        total_in = sum(h["tokens_in"] for h in self._history)
        total_out = sum(h["tokens_out"] for h in self._history)

        return {
            "total_calls": len(self._history),
            "total_tokens_in": total_in,
            "total_tokens_out": total_out,
            "total_tokens": total_in + total_out,
            "avg_tokens_per_call": round((total_in + total_out) / len(self._history), 1),
        }
