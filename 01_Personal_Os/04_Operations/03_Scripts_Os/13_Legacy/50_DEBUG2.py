
import os, sys
# This is what the ACTUAL health monitor does (line 19)
script_path = os.path.abspath(__file__)  # ...03_Scripts_Os/10_Legacy/50_System_Health_Monitor.py
parent = os.path.abspath(os.path.join(os.path.dirname(script_path), "..", ".."))
print("PARENT (appended to sys.path):", parent, file=sys.stderr)
sys.path.append(parent)
print("sys.path[-1]:", sys.path[-1], file=sys.stderr)
from config_paths import ROOT_DIR, CORE_DIR, OPERATIONS_DIR, KNOWLEDGE_DIR, ENGINE_DIR, BRAIN_DIR, SYSTEM_DIR, ARCHIVE_DIR
print("ROOT_DIR:", ROOT_DIR, file=sys.stderr)
print("CORE_DIR:", CORE_DIR, file=sys.stderr)
print("CORE_DIR exists:", os.path.exists(CORE_DIR), file=sys.stderr)
