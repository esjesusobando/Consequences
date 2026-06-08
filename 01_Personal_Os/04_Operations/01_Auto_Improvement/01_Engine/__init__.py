# Auto-Improvement Engine - Package init
from .detector import Detector, Issue
from .analyzer import Analyzer, AnalyzedIssue
from .executor import Executor
from .learner import Learner
from .recursive_improvement_engine import RecursiveImprovementEngine

__all__ = [
    "Detector", "Issue",
    "Analyzer", "AnalyzedIssue",
    "Executor",
    "Learner",
    "RecursiveImprovementEngine",
]
