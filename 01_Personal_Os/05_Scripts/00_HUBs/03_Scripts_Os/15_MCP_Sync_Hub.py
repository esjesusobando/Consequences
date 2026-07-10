import logging
import typing

logging.basicConfig(level=logging.INFO)
#!/usr/bin/env python3
"""
15_MCP_Sync_Hub.py — MCP Drift Synchronizer
FASE 2.1 del Plan Consequences 3.0

Sincroniza MCPs entre Claude Code (.mcp.json) y OpenCode (~/.config/opencode/opencode.json)
detecta drift y ofrece sync uni o bidireccional.
"""

import json
import os
import sys
import io
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ─────────────────────────────────────────────────────────────
# RUTAS — usando config_paths como fuente de verdad
# ─────────────────────────────────────────────────────────────
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))
from config_paths import ROOT_DIR

REPO_ROOT: Path = ROOT_DIR
MCP_CLAUDE = REPO_ROOT / ".mcp.json"
OPENCODE_CONFIG = Path.home() / ".config" / "opencode" / "opencode.json"
MANIFEST_DIR = REPO_ROOT / "01_Personal_Os" / "05_Scripts" / "02_Agent_Teams_Lite" / "00_Manifest"
REPORT_DIR = REPO_ROOT / "03_Resultado" / "07_Reports"


def load_json(path: Path) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"  ⚠️  load_json: {e}")
        return {}


def save_json(path: Path, data: dict):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def extract_mcp_names(config: dict, key: str = "mcpServers") -> set:
    """Extrae nombres de MCPs desde config."""
    if key in config:
        return set(config[key].keys())
    if key in config:
        return set(config[key].keys())
    return set()


def get_mcp_details(config: dict, key: str = "mcpServers") -> dict:
    """Extrae detalles completos de cada MCP."""
    if key in config:
        return config[key]
    if "mcp" in config:
        return config["mcp"]
    return {}


def compare_mcps():
    """Compara MCPs entre Claude y OpenCode."""
    if not MCP_CLAUDE.exists():
        print(f"❌ .mcp.json no encontrado en {MCP_CLAUDE}")
        return None
    if not OPENCODE_CONFIG.exists():
        print(f"❌ opencode.json no encontrado en {OPENCODE_CONFIG}")
        return None

    claude_config = load_json(MCP_CLAUDE)
    opencode_config = load_json(OPENCODE_CONFIG)

    claude_mcps = extract_mcp_names(claude_config, "mcpServers")
    opencode_mcps = extract_mcp_names(opencode_config, "mcp")

    claude_details = get_mcp_details(claude_config, "mcpServers")
    opencode_details = get_mcp_details(opencode_config, "mcp")

    both = claude_mcps & opencode_mcps
    claude_only = claude_mcps - opencode_mcps
    opencode_only = opencode_mcps - claude_mcps

    return {
        "claude": claude_mcps,
        "opencode": opencode_mcps,
        "both": both,
        "claude_only": claude_only,
        "opencode_only": opencode_only,
        "claude_details": claude_details,
        "opencode_details": opencode_details,
    }


def generate_report(diff: dict) -> str:
    """Genera reporte ASCII del drift."""
    lines = [
        "+==============================================================+",
        "|           MCP SYNC HUB -- DRIFT REPORT                    |",
        "+==============================================================+",
        f"|  Claude Code MCPs:     {len(diff['claude']):>3}                        |",
        f"|  OpenCode MCPs:        {len(diff['opencode']):>3}                        |",
        f"|  En ambos:             {len(diff['both']):>3}                        |",
        f"|  Solo Claude:          {len(diff['claude_only']):>3} (!)                 |",
        f"|  Solo OpenCode:        {len(diff['opencode_only']):>3} (i)                 |",
        "+==============================================================+",
    ]

    if diff["claude_only"]:
        lines.append("|  >> MCPs solo en Claude (faltan en OpenCode):          |")
        for mcp in sorted(diff["claude_only"]):
            lines.append(f"|    - {mcp:<50} |")
    else:
        lines.append("|  [OK] Sin drift desde Claude hacia OpenCode            |")

    lines.append("+==============================================================+")

    if diff["opencode_only"]:
        lines.append("|  << MCPs solo en OpenCode (faltan en Claude):        |")
        for mcp in sorted(diff["opencode_only"]):
            lines.append(f"|    - {mcp:<50} |")
    else:
        lines.append("|  [OK] Sin drift desde OpenCode hacia Claude            |")

    lines.append("+==============================================================+")
    return "\n".join(lines)


def update_registry(diff: dict):
    """Actualiza 02_MCP_Registry.yaml con el drift."""
    registry_path = MANIFEST_DIR / "02_MCP_Registry.yaml"
    lines = [
        "# MCP Registry — updated by 15_MCP_Sync_Hub.py",
        f"# Drift Claude<->OpenCode: claude_only={len(diff['claude_only'])}, opencode_only={len(diff['opencode_only'])}",
        "",
        "version: v3.0",
        f"generated: {__import__('datetime').datetime.now().isoformat()}",
        "totals:",
        f"  claude_code: {len(diff['claude'])}",
        f"  opencode: {len(diff['opencode'])}",
        f"  both: {len(diff['both'])}",
        f"  claude_only: {len(diff['claude_only'])}",
        f"  opencode_only: {len(diff['opencode_only'])}",
        "mcps:",
    ]

    # Ambos
    for name in sorted(diff["both"]):
        lines.append(f"  - name: {name}")
        lines.append(f"    availability: both")
        lines.append(f"    claude_code: true")
        lines.append(f"    opencode: true")

    # Solo Claude
    for name in sorted(diff["claude_only"]):
        lines.append(f"  - name: {name}")
        lines.append(f"    availability: claude_only")
        lines.append(f"    claude_code: true")
        lines.append(f"    opencode: false")

    # Solo OpenCode
    for name in sorted(diff["opencode_only"]):
        lines.append(f"  - name: {name}")
        lines.append(f"    availability: opencode_only")
        lines.append(f"    claude_code: false")
        lines.append(f"    opencode: true")

    MANIFEST_DIR.mkdir(parents=True, exist_ok=True)
    with open(registry_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    return registry_path


def main():
    print(">> MCP Sync Hub -- FASE 2.1\n")

    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "--report":
            diff = compare_mcps()
            if diff:
                print(generate_report(diff))
            return

        elif cmd == "--apply":
            diff = compare_mcps()
            if not diff: return
            
            claude_config = load_json(MCP_CLAUDE)
            opencode_config = load_json(OPENCODE_CONFIG)
            
            # Sync to OpenCode
            if "mcp" not in opencode_config:
                opencode_config["mcp"] = {}
                
            for mcp_name in diff["claude_only"]:
                opencode_config["mcp"][mcp_name] = diff["claude_details"][mcp_name]
                
            # Sync to Claude
            if "mcpServers" not in claude_config:
                claude_config["mcpServers"] = {}
                
            for mcp_name in diff["opencode_only"]:
                claude_config["mcpServers"][mcp_name] = diff["opencode_details"][mcp_name]
                
            save_json(OPENCODE_CONFIG, opencode_config)
            save_json(MCP_CLAUDE, claude_config)
            print("✅ MCPs sincronizados bidireccionalmente.")
            update_registry(compare_mcps())
            return

        elif cmd == "--validate":
            print("✅ Validación: usa --report para ver estado actual.")
            return

    # Default: reporte
    diff = compare_mcps()
    if diff:
        print(generate_report(diff))


if __name__ == "__main__":
    main()
