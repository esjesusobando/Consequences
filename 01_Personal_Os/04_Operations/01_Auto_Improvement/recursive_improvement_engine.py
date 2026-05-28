#!/usr/bin/env python3
"""
REDIRECT - Esta versión ha sido movida a 01_Engine/recursive_improvement_engine.py
Mantenemos este archivo para compatibilidad con scripts que aun referencian la ruta antigua.
"""

import sys
import warnings
from pathlib import Path

# Redirigir al nuevo location
ENGINE_DIR = Path(__file__).parent / "01_Engine"
sys.path.insert(0, str(ENGINE_DIR))

from recursive_improvement_engine import RecursiveImprovementEngine, main

warnings.warn(
    "DEPRECATED: Use '01_Engine/recursive_improvement_engine.py' instead.",
    DeprecationWarning,
    stacklevel=2
)

if __name__ == "__main__":
    sys.exit(main())
