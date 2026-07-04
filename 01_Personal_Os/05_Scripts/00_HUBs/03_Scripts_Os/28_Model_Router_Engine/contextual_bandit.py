"""
contextual_bandit.py — Contextual bandit with UCB policy for online learning

Selects models using Upper Confidence Bound (UCB) with epsilon-greedy
exploration. Each arm (model) tracks its mean reward and visit count.
Policy can be persisted to JSON for continuity across sessions.

Usage:
    from contextual_bandit import ContextualBandit
    cb = ContextualBandit()
    action = cb.select_action({"task_type": "reasoning", "difficulty": 0.8})
    cb.update({"task_type": "reasoning"}, action["model"], 0.95)
"""

import json
import math
import random
from pathlib import Path
from typing import Optional


# Default arm initialization (pre-seeded statistics for simulation)
_DEFAULT_ARMS: dict[str, dict] = {
    "gpt-5.5-codex":      {"n": 50, "total_reward": 44.0},  # ~0.88 avg
    "claude-opus-4.8":    {"n": 50, "total_reward": 45.0},  # ~0.90 avg
    "gemini-3-ultra":     {"n": 40, "total_reward": 35.2},  # ~0.88 avg
    "claude-sonnet-4.8":  {"n": 60, "total_reward": 51.0},  # ~0.85 avg
    "gemini-3-pro":       {"n": 40, "total_reward": 32.0},  # ~0.80 avg
    "gpt-5.1":            {"n": 40, "total_reward": 31.6},  # ~0.79 avg
    "deepseek-v4":        {"n": 25, "total_reward": 19.5},  # ~0.78 avg
    "llama-4-70b":        {"n": 15, "total_reward": 11.1},  # ~0.74 avg
    "mistral-large-3":    {"n": 20, "total_reward": 15.0},  # ~0.75 avg
    "glm-5.2":            {"n": 10, "total_reward": 7.2},   # ~0.72 avg
}

_DEFAULT_EPSILON = 0.1


class ContextualBandit:
    """Contextual bandit with UCB policy for model selection.

    Uses Upper Confidence Bound to balance exploration vs exploitation.
    Epsilon-greedy (epsilon=0.1) provides additional random exploration.

    Args:
        policy_file: Optional path to persist/load policy state as JSON.
        simulation: If True, initialize with pre-seeded arm statistics.
    """

    def __init__(self, policy_file: Optional[Path] = None, simulation: bool = True):
        self._policy_file = policy_file
        self._epsilon = _DEFAULT_EPSILON
        self._context_features: list[str] = ["task_type", "difficulty", "required_quality"]

        # Arm statistics: model -> {"n": int, "total_reward": float}
        self._arms: dict[str, dict] = {}

        # Load existing policy or initialize
        if policy_file and policy_file.exists() and not simulation:
            try:
                with open(policy_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                self._arms = data.get("bandit_arms", {})
                self._epsilon = data.get("bandit_config", {}).get("epsilon", _DEFAULT_EPSILON)
                return
            except (json.JSONDecodeError, KeyError):
                pass

        if simulation:
            self._arms = {m: dict(s) for m, s in _DEFAULT_ARMS.items()}

        # Safety: if _arms is still empty (simulation=False, no policy file),
        # initialize with defaults so select_action() does not crash with IndexError.
        if not self._arms:
            self._arms = {m: dict(s) for m, s in _DEFAULT_ARMS.items()}

    def select_action(self, context: dict) -> dict:
        """Select a model using UCB with epsilon-greedy exploration.

        Args:
            context: Dict with task features (task_type, difficulty, etc.).

        Returns:
            dict with keys: model, ucb_score, arm_stats (n, avg_reward),
                            explored (bool), context_features
        """
        # Epsilon-greedy: random exploration
        if random.random() < self._epsilon:
            model = random.choice(list(self._arms.keys()))
            arm = self._arms[model]
            avg = arm["total_reward"] / max(arm["n"], 1)
            return {
                "model": model,
                "ucb_score": round(avg, 4),
                "arm_stats": {"n": arm["n"], "avg_reward": round(avg, 4)},
                "explored": True,
                "context_features": context,
            }

        # UCB selection
        n_total = sum(a["n"] for a in self._arms.values())
        best_model = None
        best_ucb = -float("inf")

        for model, arm in self._arms.items():
            if arm["n"] == 0:
                # Untried arm: high UCB to encourage exploration
                ucb = float("inf")
            else:
                avg = arm["total_reward"] / arm["n"]
                confidence = math.sqrt(math.log(n_total + 1) / (arm["n"] + 1e-6))
                ucb = avg + 1.414 * confidence  # sqrt(2) * confidence bound

            if ucb > best_ucb:
                best_ucb = ucb
                best_model = model

        if best_model is None:
            best_model = list(self._arms.keys())[0]

        arm = self._arms[best_model]
        avg = arm["total_reward"] / max(arm["n"], 1)
        return {
            "model": best_model,
            "ucb_score": round(best_ucb, 4),
            "arm_stats": {"n": arm["n"], "avg_reward": round(avg, 4)},
            "explored": False,
            "context_features": context,
        }

    def update(self, context: dict, action: str, reward: float) -> None:
        """Update arm statistics with observed reward.

        Args:
            context: Context dict from the original request (for future feature binning).
            action: The model that was selected.
            reward: Observed reward (0.0 to 1.0).
        """
        if action not in self._arms:
            self._arms[action] = {"n": 0, "total_reward": 0.0}
        self._arms[action]["n"] += 1
        self._arms[action]["total_reward"] += reward
        self._save_policy()

    def get_policy(self) -> dict:
        """Return the full policy state including arm statistics.

        Returns:
            dict with epsilon, context_features, and per-arm stats.
        """
        return {
            "epsilon": self._epsilon,
            "context_features": self._context_features,
            "arms": {
                model: {
                    "n": arm["n"],
                    "avg_reward": round(arm["total_reward"] / max(arm["n"], 1), 4),
                }
                for model, arm in sorted(self._arms.items())
            },
        }

    def _save_policy(self) -> None:
        """Persist policy state to JSON file if policy_file is configured."""
        if not self._policy_file:
            return
        try:
            self._policy_file.parent.mkdir(parents=True, exist_ok=True)
            data = {
                "bandit_arms": self._arms,
                "bandit_config": {
                    "epsilon": self._epsilon,
                    "context_features": self._context_features,
                },
            }
            with open(self._policy_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except (OSError, PermissionError):
            pass
