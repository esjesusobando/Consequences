import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
33_Doc_Sync.py — Documentation Sync Generator
================================================
Scans disk for actual counts and validates/generates documentation to prevent drift.

Usage:
    python 33_Doc_Sync.py --scan          # Dry-run: show drift report
    python 33_Doc_Sync.py --apply         # Fix all docs in-place
    python 33_Doc_Sync.py --report        # JSON output for Auto-Improvement
    python 33_Doc_Sync.py --scan --doc OS_DIRECTORY.md  # Scan single doc

Integration:
    - Uses config_paths.py for path resolution
    - Compatible with Auto-Improvement Engine Issue dataclass
    - Can be called by 17_Watchdog_Hub.py for scheduled health checks
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

# Import path resolution
try:
    from config_paths import ROOT_DIR, CORE_DIR, OPERATIONS_DIR
except ImportError:
    # Fallback: auto-detect root
    current = Path(__file__).resolve().parent
    for candidate in [current, *current.parents]:
        if (candidate / "00_Winter_is_Coming").exists():
            ROOT_DIR = candidate
            CORE_DIR = ROOT_DIR / "01_Personal_Os" / "00_Core"
            OPERATIONS_DIR = ROOT_DIR / "01_Personal_Os" / "05_Scripts"
            break
    else:
        print("ERROR: Could not detect project root")
        sys.exit(1)


# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class DiskCounts:
    """Actual counts from disk scan"""
    agents_total: int = 0
    agents_root: int = 0
    agents_dream_team: int = 0
    agents_specialists: int = 0
    agents_growth: int = 0
    agents_os_conductor: int = 0
    agents_atl_gen: int = 0
    agents_teams_lite: int = 0
    
    skills_total: int = 0
    skills_by_area: Dict[str, int] = None
    
    rules_total: int = 0
    workflows_total: int = 0
    hubs_total: int = 0
    scripts_total: int = 0
    mcps_total: int = 0
    
    def __post_init__(self):
        if self.skills_by_area is None:
            self.skills_by_area = {}
    
    def agents_breakdown(self) -> str:
        """Format agent breakdown string"""
        otras = self.agents_os_conductor + self.agents_atl_gen + self.agents_teams_lite
        return f"{self.agents_total} ({self.agents_root} Root + {self.agents_dream_team} Dream + {self.agents_specialists} Specialists + {self.agents_growth} Growth + {otras} otras categorías)"


@dataclass
class DocCounts:
    """Declared counts extracted from a doc"""
    doc_name: str
    agents_total: Optional[int] = None
    skills_total: Optional[int] = None
    rules_total: Optional[int] = None
    workflows_total: Optional[int] = None
    hubs_total: Optional[int] = None
    scripts_total: Optional[int] = None
    mcps_total: Optional[int] = None


@dataclass
class DriftItem:
    """Single drift between disk and doc"""
    doc_name: str
    field: str
    disk_value: int
    doc_value: int
    line_number: Optional[int] = None
    line_content: Optional[str] = None


# ============================================================================
# DISK SCANNER
# ============================================================================

class DiskScanner:
    """Scans disk for actual counts"""
    
    EXCLUDE_DIRS = {
        ".git", ".venv", "venv", "node_modules", "__pycache__",
        "05_Archive", ".pytest_cache", ".idea", ".vscode",
        "dist", "build", ".next", ".agent", ".claude"
    }
    
    def __init__(self, root: Path):
        self.root = root
    
    def scan_agents(self) -> Dict[str, int]:
        """Scan agents by category"""
        agents_dir = CORE_DIR / "02_Tools" / "01_Agents"
        counts = {
            "root": 0,
            "dream_team": 0,
            "specialists": 0,
            "growth": 0,
            "os_conductor": 0,
            "atl_gen": 0,
            "teams_lite": 0
        }
        
        if not agents_dir.exists():
            return counts
        
        # Root agents (numbered 00-22 + 00_Orchestrator)
        for f in agents_dir.glob("*.md"):
            if f.name.startswith(("00_", "01_", "02_", "03_", "04_", "05_", 
                                  "06_", "07_", "08_", "09_", "10_", "11_", 
                                  "12_", "13_", "14_", "15_", "16_", "17_", 
                                  "18_", "19_", "20_", "21_", "22_")):
                counts["root"] += 1
        
        # Dream Team
        dream_dir = agents_dir / "01_Dream_Team"
        if dream_dir.exists():
            counts["dream_team"] = len(list(dream_dir.glob("*.md")))
        
        # Specialists
        spec_dir = agents_dir / "02_Specialists_Compound"
        if spec_dir.exists():
            counts["specialists"] = len(list(spec_dir.glob("*.md")))
        
        # Growth
        growth_dir = agents_dir / "03_Growth"
        if growth_dir.exists():
            counts["growth"] = len(list(growth_dir.glob("*.md")))
        
        # OS Conductor
        cond_dir = agents_dir / "00_OS_Conductor"
        if cond_dir.exists():
            counts["os_conductor"] = len(list(cond_dir.glob("*.md")))
        
        # ATL Gen
        atl_dir = agents_dir / "07_Agent_Teams_Lite_Gen"
        if atl_dir.exists():
            counts["atl_gen"] = len(list(atl_dir.glob("*.md")))
        
        # Agent Teams Lite
        teams_dir = agents_dir / "00_Agent_Teams_Lite"
        if teams_dir.exists():
            counts["teams_lite"] = len(list(teams_dir.glob("skills/sdd-apply/*.md")))
        
        return counts
    
    def scan_skills(self) -> Dict[str, int]:
        """Scan skills by area"""
        skills_dir = CORE_DIR / "02_Tools" / "02_Skills"
        counts = {}
        
        if not skills_dir.exists():
            return counts
        
        for area_dir in skills_dir.iterdir():
            if area_dir.is_dir() and not area_dir.name.startswith("."):
                skill_count = len(list(area_dir.rglob("SKILL.md")))
                if skill_count > 0:
                    counts[area_dir.name] = skill_count
        
        return counts
    
    def scan_rules(self) -> int:
        """Count .mdc rule files"""
        rules_dir = CORE_DIR / "01_Rules"
        if not rules_dir.exists():
            return 0
        
        return len(list(rules_dir.glob("*.mdc")))
    
    def scan_workflows(self) -> int:
        """Count workflow .md files"""
        workflows_dir = CORE_DIR / "00_Workflows_Os"
        if not workflows_dir.exists():
            return 0
        
        # Count .md files excluding README
        count = 0
        for f in workflows_dir.rglob("*.md"):
            if f.name != "README.md":
                count += 1
        
        return count
    
    def scan_hubs_and_scripts(self) -> tuple[int, int]:
        """Count HUBs and total scripts"""
        scripts_dir = OPERATIONS_DIR / "03_Scripts_Os"
        if not scripts_dir.exists():
            return 0, 0
        
        hubs = 0
        scripts = 0
        
        for f in scripts_dir.rglob("*.py"):
            scripts += 1
            if f.name.endswith("_Hub.py") or f.name == "HUB_SOTA.py":
                hubs += 1
        
        return hubs, scripts
    
    def scan_mcps(self) -> int:
        """Count MCPs from .mcp.json"""
        mcp_file = self.root / ".mcp.json"
        if not mcp_file.exists():
            return 0
        
        try:
            with open(mcp_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                return len(data.get("mcpServers", {}))
        except Exception:
            return 0
    
    def scan_all(self) -> DiskCounts:
        """Scan all counts from disk"""
        agent_counts = self.scan_agents()
        skill_counts = self.scan_skills()
        rules_count = self.scan_rules()
        workflows_count = self.scan_workflows()
        hubs_count, scripts_count = self.scan_hubs_and_scripts()
        mcps_count = self.scan_mcps()
        
        return DiskCounts(
            agents_total=sum(agent_counts.values()),
            agents_root=agent_counts["root"],
            agents_dream_team=agent_counts["dream_team"],
            agents_specialists=agent_counts["specialists"],
            agents_growth=agent_counts["growth"],
            agents_os_conductor=agent_counts["os_conductor"],
            agents_atl_gen=agent_counts["atl_gen"],
            agents_teams_lite=agent_counts["teams_lite"],
            skills_total=sum(skill_counts.values()),
            skills_by_area=skill_counts,
            rules_total=rules_count,
            workflows_total=workflows_count,
            hubs_total=hubs_count,
            scripts_total=scripts_count,
            mcps_total=mcps_count
        )


# ============================================================================
# DOC PARSER
# ============================================================================

class DocParser:
    """Parses documentation files to extract declared counts"""
    
    def __init__(self, root: Path):
        self.root = root
    
    def parse_os_directory(self) -> Optional[DocCounts]:
        """Parse OS_DIRECTORY.md"""
        doc_path = self.root / "00_Winter_is_Coming" / "OS_DIRECTORY.md"
        if not doc_path.exists():
            return None
        
        content = doc_path.read_text(encoding="utf-8")
        counts = DocCounts(doc_name="OS_DIRECTORY.md")
        
        # Extract agent count from status table
        match = re.search(r'\| Agentes\s+\|\s+\*\*(\d+)\*\*', content)
        if match:
            counts.agents_total = int(match.group(1))
        
        # Extract skills count
        match = re.search(r'\| Skills\s+\|\s+\*\*(\d+)\*\*', content)
        if match:
            counts.skills_total = int(match.group(1))
        
        # Extract rules count
        match = re.search(r'\| Rules\s+\|\s+\*\*(\d+)\s*\(\.mdc\)', content)
        if match:
            counts.rules_total = int(match.group(1))
        
        # Extract HUBs count
        match = re.search(r'\| HUBs\s+\|\s+\*\*(\d+)\*\*', content)
        if match:
            counts.hubs_total = int(match.group(1))
        
        # Extract scripts count
        match = re.search(r'\| Scripts totales\s+\|\s+\*\*(\d+)\*\*', content)
        if match:
            counts.scripts_total = int(match.group(1))
        
        # Extract MCPs count
        match = re.search(r'\| MCPs Claude Code\s+\|\s+\*\*(\d+)\*\*', content)
        if match:
            counts.mcps_total = int(match.group(1))
        
        return counts
    
    def parse_readme(self) -> Optional[DocCounts]:
        """Parse README.md"""
        doc_path = self.root / "README.md"
        if not doc_path.exists():
            return None
        
        content = doc_path.read_text(encoding="utf-8")
        counts = DocCounts(doc_name="README.md")
        
        # Extract agent count
        match = re.search(r'\| \*\*Agentes\*\* \| \*\*(\d+)\*\*', content)
        if match:
            counts.agents_total = int(match.group(1))
        
        # Extract skills count
        match = re.search(r'\| \*\*Skills\*\* \| \*\*(\d+)\*\*', content)
        if match:
            counts.skills_total = int(match.group(1))
        
        # Extract rules count
        match = re.search(r'\| \*\*Rules\*\* \| \*\*(\d+)\*\*', content)
        if match:
            counts.rules_total = int(match.group(1))
        
        # Extract HUBs count
        match = re.search(r'\| \*\*HUBs\*\* \| \*\*(\d+)\*\*', content)
        if match:
            counts.hubs_total = int(match.group(1))
        
        # Extract workflows count
        match = re.search(r'\| \*\*Workflows\*\* \| \*\*(\d+)\*\*', content)
        if match:
            counts.workflows_total = int(match.group(1))
        
        return counts
    
    def parse_structure(self) -> Optional[DocCounts]:
        """Parse Structure_v5.0.md"""
        doc_path = self.root / "Structure_v5.0.md"
        if not doc_path.exists():
            return None
        
        content = doc_path.read_text(encoding="utf-8")
        counts = DocCounts(doc_name="Structure_v5.0.md")
        
        # Extract from summary table
        match = re.search(r'\| Agentes \(def files\) \| (\d+)', content)
        if match:
            counts.agents_total = int(match.group(1))
        
        match = re.search(r'\| Skills \(SKILL\.md\) \| (\d+)', content)
        if match:
            counts.skills_total = int(match.group(1))
        
        match = re.search(r'\| Reglas \(\.mdc\) \| (\d+)', content)
        if match:
            counts.rules_total = int(match.group(1))
        
        match = re.search(r'\| HUBs \| (\d+)', content)
        if match:
            counts.hubs_total = int(match.group(1))
        
        match = re.search(r'\| Scripts totales \| (\d+)', content)
        if match:
            counts.scripts_total = int(match.group(1))
        
        match = re.search(r'\| Workflows \(\.md\) \| (\d+)', content)
        if match:
            counts.workflows_total = int(match.group(1))
        
        return counts
    
    def parse_claude(self) -> Optional[DocCounts]:
        """Parse CLAUDE.md"""
        doc_path = self.root / "CLAUDE.md"
        if not doc_path.exists():
            return None
        
        content = doc_path.read_text(encoding="utf-8")
        counts = DocCounts(doc_name="CLAUDE.md")
        
        # Extract agent count from agent matrix
        match = re.search(r'\| Agent Matrix.*\| (\d+) agentes', content)
        if match:
            counts.agents_total = int(match.group(1))
        
        # Extract skills count
        match = re.search(r'\| Skills \((\d+),', content)
        if match:
            counts.skills_total = int(match.group(1))
        
        # Extract rules count
        match = re.search(r'\| Rules \((\d+) \.mdc\)', content)
        if match:
            counts.rules_total = int(match.group(1))
        
        # Extract HUBs count
        match = re.search(r'\| HUBs \((\d+)', content)
        if match:
            counts.hubs_total = int(match.group(1))
        
        # Extract workflows count
        match = re.search(r'\| Workflows \((\d+)\)', content)
        if match:
            counts.workflows_total = int(match.group(1))
        
        return counts


# ============================================================================
# DRIFT DETECTOR
# ============================================================================

class DriftDetector:
    """Detects drift between disk counts and doc counts"""
    
    def detect(self, disk: DiskCounts, docs: List[DocCounts]) -> List[DriftItem]:
        """Detect all drift items"""
        drift = []
        
        for doc in docs:
            if doc is None:
                continue
            
            if doc.agents_total is not None and doc.agents_total != disk.agents_total:
                drift.append(DriftItem(
                    doc_name=doc.doc_name,
                    field="agents_total",
                    disk_value=disk.agents_total,
                    doc_value=doc.agents_total
                ))
            
            if doc.skills_total is not None and doc.skills_total != disk.skills_total:
                drift.append(DriftItem(
                    doc_name=doc.doc_name,
                    field="skills_total",
                    disk_value=disk.skills_total,
                    doc_value=doc.skills_total
                ))
            
            if doc.rules_total is not None and doc.rules_total != disk.rules_total:
                drift.append(DriftItem(
                    doc_name=doc.doc_name,
                    field="rules_total",
                    disk_value=disk.rules_total,
                    doc_value=doc.rules_total
                ))
            
            if doc.hubs_total is not None and doc.hubs_total != disk.hubs_total:
                drift.append(DriftItem(
                    doc_name=doc.doc_name,
                    field="hubs_total",
                    disk_value=disk.hubs_total,
                    doc_value=doc.hubs_total
                ))
            
            if doc.scripts_total is not None and doc.scripts_total != disk.scripts_total:
                drift.append(DriftItem(
                    doc_name=doc.doc_name,
                    field="scripts_total",
                    disk_value=disk.scripts_total,
                    doc_value=doc.scripts_total
                ))
            
            if doc.workflows_total is not None and doc.workflows_total != disk.workflows_total:
                drift.append(DriftItem(
                    doc_name=doc.doc_name,
                    field="workflows_total",
                    disk_value=disk.workflows_total,
                    doc_value=doc.workflows_total
                ))
            
            if doc.mcps_total is not None and doc.mcps_total != disk.mcps_total:
                drift.append(DriftItem(
                    doc_name=doc.doc_name,
                    field="mcps_total",
                    disk_value=disk.mcps_total,
                    doc_value=doc.mcps_total
                ))
        
        return drift


# ============================================================================
# DOC FIXER
# ============================================================================

class DocFixer:
    """Fixes documentation files in-place"""
    
    def __init__(self, root: Path):
        self.root = root
    
    def fix_os_directory(self, disk: DiskCounts) -> bool:
        """Fix OS_DIRECTORY.md"""
        doc_path = self.root / "00_Winter_is_Coming" / "OS_DIRECTORY.md"
        if not doc_path.exists():
            return False
        
        content = doc_path.read_text(encoding="utf-8")
        original = content
        
        # Fix agent count in status table
        content = re.sub(
            r'(\| Agentes\s+\|\s+\*\*)\d+(\*\*.*\|)',
            rf'\g<1>{disk.agents_total}\g<2>',
            content
        )
        
        # Fix agent breakdown
        content = re.sub(
            r'(\| Agentes.*\| \*\*\d+\*\* \()\d+ Root \+ \d+ Dream \+ \d+ Specialists \+ \d+ Growth \+ \d+ otras',
            rf'\g<1>{disk.agents_root} Root + {disk.agents_dream_team} Dream + {disk.agents_specialists} Specialists + {disk.agents_growth} Growth + {disk.agents_os_conductor + disk.agents_atl_gen + disk.agents_teams_lite} otras',
            content
        )
        
        # Fix skills count
        content = re.sub(
            r'(\| Skills\s+\|\s+\*\*)\d+(\*\*)',
            rf'\g<1>{disk.skills_total}\g<2>',
            content
        )
        
        # Fix rules count
        content = re.sub(
            r'(\| Rules\s+\|\s+\*\*)\d+(\s*\(\.mdc\))',
            rf'\g<1>{disk.rules_total}\g<2>',
            content
        )
        
        # Fix HUBs count
        content = re.sub(
            r'(\| HUBs\s+\|\s+\*\*)\d+(\*\*)',
            rf'\g<1>{disk.hubs_total}\g<2>',
            content
        )
        
        # Fix scripts count
        content = re.sub(
            r'(\| Scripts totales\s+\|\s+\*\*)\d+(\*\*)',
            rf'\g<1>{disk.scripts_total}\g<2>',
            content
        )
        
        # Fix MCPs count
        content = re.sub(
            r'(\| MCPs Claude Code\s+\|\s+\*\*)\d+(\*\*)',
            rf'\g<1>{disk.mcps_total}\g<2>',
            content
        )
        
        if content != original:
            doc_path.write_text(content, encoding="utf-8")
            return True
        
        return False
    
    def fix_readme(self, disk: DiskCounts) -> bool:
        """Fix README.md"""
        doc_path = self.root / "README.md"
        if not doc_path.exists():
            return False
        
        content = doc_path.read_text(encoding="utf-8")
        original = content
        
        # Fix agent count
        content = re.sub(
            r'(\| \*\*Agentes\*\* \| \*\*)\d+(\*\*)',
            rf'\g<1>{disk.agents_total}\g<2>',
            content
        )
        
        # Fix agent breakdown
        content = re.sub(
            r'(\| \*\*Agentes\*\* \| \*\*\d+\*\* \()\d+ root, \d+ Dream Team, \d+ Specialists, \d+ Growth, \d+ otras',
            rf'\g<1>{disk.agents_root} root, {disk.agents_dream_team} Dream Team, {disk.agents_specialists} Specialists, {disk.agents_growth} Growth, {disk.agents_os_conductor + disk.agents_atl_gen + disk.agents_teams_lite} otras',
            content
        )
        
        # Fix skills count
        content = re.sub(
            r'(\| \*\*Skills\*\* \| \*\*)\d+(\*\*)',
            rf'\g<1>{disk.skills_total}\g<2>',
            content
        )
        
        # Fix rules count
        content = re.sub(
            r'(\| \*\*Rules\*\* \| \*\*)\d+(\*\*)',
            rf'\g<1>{disk.rules_total}\g<2>',
            content
        )
        
        # Fix HUBs count
        content = re.sub(
            r'(\| \*\*HUBs\*\* \| \*\*)\d+(\*\*)',
            rf'\g<1>{disk.hubs_total}\g<2>',
            content
        )
        
        # Fix workflows count
        content = re.sub(
            r'(\| \*\*Workflows\*\* \| \*\*)\d+(\*\*)',
            rf'\g<1>{disk.workflows_total}\g<2>',
            content
        )
        
        if content != original:
            doc_path.write_text(content, encoding="utf-8")
            return True
        
        return False
    
    def fix_structure(self, disk: DiskCounts) -> bool:
        """Fix Structure_v5.0.md"""
        doc_path = self.root / "Structure_v5.0.md"
        if not doc_path.exists():
            return False
        
        content = doc_path.read_text(encoding="utf-8")
        original = content
        
        # Fix agent count in summary table
        content = re.sub(
            r'(\| Agentes \(def files\) \| )\d+',
            rf'\g<1>{disk.agents_total}',
            content
        )
        
        # Fix skills count
        content = re.sub(
            r'(\| Skills \(SKILL\.md\) \| )\d+',
            rf'\g<1>{disk.skills_total}',
            content
        )
        
        # Fix rules count
        content = re.sub(
            r'(\| Reglas \(\.mdc\) \| )\d+',
            rf'\g<1>{disk.rules_total}',
            content
        )
        
        # Fix HUBs count
        content = re.sub(
            r'(\| HUBs \| )\d+',
            rf'\g<1>{disk.hubs_total}',
            content
        )
        
        # Fix scripts count
        content = re.sub(
            r'(\| Scripts totales \| )\d+',
            rf'\g<1>{disk.scripts_total}',
            content
        )
        
        # Fix workflows count
        content = re.sub(
            r'(\| Workflows \(\.md\) \| )\d+',
            rf'\g<1>{disk.workflows_total}',
            content
        )
        
        if content != original:
            doc_path.write_text(content, encoding="utf-8")
            return True
        
        return False
    
    def fix_claude(self, disk: DiskCounts) -> bool:
        """Fix CLAUDE.md"""
        doc_path = self.root / "CLAUDE.md"
        if not doc_path.exists():
            return False
        
        content = doc_path.read_text(encoding="utf-8")
        original = content
        
        # Fix agent count in agent matrix
        content = re.sub(
            r'(\| Agent Matrix.*\| )\d+( agentes)',
            rf'\g<1>{disk.agents_total}\g<2>',
            content
        )
        
        # Fix agent breakdown
        content = re.sub(
            r'(\| Agent Matrix.*\| \d+ agentes \()\d+ root \+ \d+ Dream \+ \d+ Spec \+ \d+ Growth \+ \d+ otras',
            rf'\g<1>{disk.agents_root} root + {disk.agents_dream_team} Dream + {disk.agents_specialists} Spec + {disk.agents_growth} Growth + {disk.agents_os_conductor + disk.agents_atl_gen + disk.agents_teams_lite} otras',
            content
        )
        
        # Fix skills count
        content = re.sub(
            r'(\| Skills \()\d+(,)',
            rf'\g<1>{disk.skills_total}\g<2>',
            content
        )
        
        # Fix rules count
        content = re.sub(
            r'(\| Rules \()\d+( \.mdc\))',
            rf'\g<1>{disk.rules_total}\g<2>',
            content
        )
        
        # Fix HUBs count
        content = re.sub(
            r'(\| HUBs \()\d+( —)',
            rf'\g<1>{disk.hubs_total}\g<2>',
            content
        )
        
        # Fix workflows count
        content = re.sub(
            r'(\| Workflows \()\d+(\))',
            rf'\g<1>{disk.workflows_total}\g<2>',
            content
        )
        
        if content != original:
            doc_path.write_text(content, encoding="utf-8")
            return True
        
        return False
    
    def fix_all(self, disk: DiskCounts) -> Dict[str, bool]:
        """Fix all docs"""
        return {
            "OS_DIRECTORY.md": self.fix_os_directory(disk),
            "README.md": self.fix_readme(disk),
            "Structure_v5.0.md": self.fix_structure(disk),
            "CLAUDE.md": self.fix_claude(disk)
        }


# ============================================================================
# MAIN CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Doc Sync Generator — Scan disk and validate/fix documentation"
    )
    parser.add_argument("--scan", action="store_true", help="Dry-run: show drift report")
    parser.add_argument("--apply", action="store_true", help="Fix all docs in-place")
    parser.add_argument("--report", action="store_true", help="JSON output for Auto-Improvement")
    parser.add_argument("--doc", type=str, help="Scan single doc (e.g., OS_DIRECTORY.md)")
    
    args = parser.parse_args()
    
    if not any([args.scan, args.apply, args.report]):
        parser.print_help()
        sys.exit(1)
    
    # Scan disk
    print("=" * 70)
    print("  DOC SYNC GENERATOR v1.0")
    print("=" * 70)
    print(f"\n[SCAN] Scanning disk at {ROOT_DIR}...")
    
    scanner = DiskScanner(ROOT_DIR)
    disk = scanner.scan_all()
    
    print(f"\n[DISK] Actual counts:")
    print(f"  Agents: {disk.agents_breakdown()}")
    print(f"  Skills: {disk.skills_total} ({len(disk.skills_by_area)} areas)")
    print(f"  Rules: {disk.rules_total} (.mdc)")
    print(f"  Workflows: {disk.workflows_total}")
    print(f"  HUBs: {disk.hubs_total}")
    print(f"  Scripts: {disk.scripts_total}")
    print(f"  MCPs: {disk.mcps_total}")
    
    # Parse docs
    print(f"\n[PARSE] Reading documentation...")
    doc_parser = DocParser(ROOT_DIR)
    
    docs = []
    if args.doc:
        # Parse single doc
        if args.doc == "OS_DIRECTORY.md":
            docs.append(doc_parser.parse_os_directory())
        elif args.doc == "README.md":
            docs.append(doc_parser.parse_readme())
        elif args.doc == "Structure_v5.0.md":
            docs.append(doc_parser.parse_structure())
        elif args.doc == "CLAUDE.md":
            docs.append(doc_parser.parse_claude())
        else:
            print(f"ERROR: Unknown doc {args.doc}")
            sys.exit(1)
    else:
        # Parse all docs
        docs = [
            doc_parser.parse_os_directory(),
            doc_parser.parse_readme(),
            doc_parser.parse_structure(),
            doc_parser.parse_claude()
        ]
    
    for doc in docs:
        if doc:
            print(f"  [OK] {doc.doc_name}")
    
    # Detect drift
    print(f"\n[DRIFT] Detecting drift...")
    detector = DriftDetector()
    drift = detector.detect(disk, docs)
    
    if not drift:
        print("  [OK] No drift detected — all docs match disk")
    else:
        print(f"  [WARN] Found {len(drift)} drift items:")
        for item in drift:
            print(f"    - {item.doc_name}: {item.field} (disk: {item.disk_value}, doc: {item.doc_value})")
    
    # Apply fixes
    if args.apply:
        print(f"\n[APPLY] Fixing documentation...")
        fixer = DocFixer(ROOT_DIR)
        results = fixer.fix_all(disk)
        
        for doc_name, fixed in results.items():
            status = "[OK] Fixed" if fixed else "[OK] No changes"
            print(f"  {status}: {doc_name}")
        
        # Re-scan to verify
        print(f"\n[VERIFY] Re-scanning to verify fixes...")
        docs = [
            doc_parser.parse_os_directory(),
            doc_parser.parse_readme(),
            doc_parser.parse_structure(),
            doc_parser.parse_claude()
        ]
        drift = detector.detect(disk, docs)
        
        if not drift:
            print("  [OK] All docs now match disk")
        else:
            print(f"  [WARN] Still {len(drift)} drift items after fix")
    
    # JSON report
    if args.report:
        print(f"\n[REPORT] Generating JSON report...")
        report = {
            "timestamp": datetime.now().isoformat(),
            "disk": asdict(disk),
            "drift": [asdict(item) for item in drift],
            "docs_parsed": [doc.doc_name for doc in docs if doc]
        }
        
        report_path = OPERATIONS_DIR / "03_Scripts_Os" / "doc_sync_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"  ✓ Report saved to {report_path}")
        
        # Also print to stdout for piping
        print("\n" + json.dumps(report, indent=2, ensure_ascii=False))
    
    print("\n" + "=" * 70)
    print("  COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()
