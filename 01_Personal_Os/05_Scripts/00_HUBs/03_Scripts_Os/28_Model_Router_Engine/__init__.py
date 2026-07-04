"""
28_Model_Router_Engine — Routing modules for the Model Eval pipeline.

Modules:
  semantic_router.py     — Pattern-matching task router (code→openai, reasoning→claude, etc.)
  cascade_router.py      — Cost-escalation router (cheapest→quality gate→expensive)
  contextual_bandit.py   — Contextual bandit with UCB policy for online learning
"""

__version__ = "1.0.0"
