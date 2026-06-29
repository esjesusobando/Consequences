#!/usr/bin/env python3
"""
Capital Token — MCP Bridge Server (v0.1)

Bridge que expone el Shared Context Organizacional a través de 
interfaces externas (Slack, Notion, WhatsApp).

Arquitectura:
  ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
  │  Slack Bot   │────▶│              │────▶│  Shared Org  │
  │  Notion API  │────▶│  MCP Bridge  │────▶│   Knowledge   │
  │  WhatsApp    │────▶│   Server     │────▶│   (markdown)  │
  └─────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Engram     │
                    │   Memory     │
                    └──────────────┘

Uso:
  python capital-token-bridge.py --serve    # Iniciar servidor
  python capital-token-bridge.py --query    # Consulta interactiva
  python capital-token-bridge.py --sync     # Sincronizar con Engram

Estado: DEVELOPMENT — Fase 2 del Capital Token Plan
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Optional

# --- Config ---
SHARED_ORG_PATH = Path("01_Personal_Os/02_Knowledge/10_Shared_Org")
INDEX_FILE = SHARED_ORG_PATH / ".bridge_index.json"


def get_shared_org_path() -> Path:
    """Resuelve la ruta absoluta al shared org."""
    # Intentar desde el proyecto
    cwd = Path.cwd()
    for parent in [cwd] + list(cwd.parents):
        candidate = parent / SHARED_ORG_PATH
        if candidate.exists():
            return candidate
    # Fallback: relativo al script
    script_dir = Path(__file__).parent
    return script_dir / SHARED_ORG_PATH


def build_index() -> dict:
    """Construye índice de todos los archivos del shared org."""
    base = get_shared_org_path()
    if not base.exists():
        return {"error": f"Shared Org no encontrado en {base}"}

    index = {
        "path": str(base),
        "last_built": None,
        "playbooks": [],
        "decisions": [],
        "processes": [],
        "agents": [],
        "context": [],
        "metrics": [],
    }

    for category in ["playbooks", "decisions", "processes", "agents", "context", "metrics"]:
        cat_path = base / category
        if cat_path.exists():
            for f in sorted(cat_path.glob("*.md")):
                if f.name == "README.md":
                    continue
                if f.name.startswith("00-template"):
                    continue
                index[category].append({
                    "name": f.stem,
                    "path": str(f.relative_to(base)),
                    "size": f.stat().st_size,
                    "modified": f.stat().st_mtime,
                })

    return index


def query_shared_context(query: str, category: Optional[str] = None) -> list:
    """Busca en los archivos del shared context por categoría o texto."""
    base = get_shared_org_path()
    results = []

    categories = [category] if category else ["playbooks", "decisions", "processes", "agents", "context", "metrics"]

    for cat in categories:
        cat_path = base / cat
        if not cat_path.exists():
            continue
        for f in cat_path.glob("*.md"):
            content = f.read_text(encoding="utf-8")
            if query.lower() in content.lower():
                results.append({
                    "category": cat,
                    "file": f.name,
                    "path": str(f.relative_to(base)),
                    "match_preview": _get_preview(content, query),
                })

    return results


def _get_preview(content: str, query: str, context_chars: int = 100) -> str:
    """Extrae preview del contexto alrededor del match."""
    idx = content.lower().find(query.lower())
    if idx == -1:
        return ""
    start = max(0, idx - context_chars)
    end = min(len(content), idx + len(query) + context_chars)
    preview = content[start:end]
    if start > 0:
        preview = "... " + preview
    if end < len(content):
        preview = preview + " ..."
    return preview


def serve():
    """Modo servidor — escucha consultas (stdin JSON-RPC estilo MCP)."""
    index = build_index()
    print(f"[CT] Capital Token MCP Bridge v0.1", file=sys.stderr)
    print(f"[i] Shared Org: {index.get('path', 'N/A')}", file=sys.stderr)
    print(f"[i] Playbooks: {len(index.get('playbooks', []))}", file=sys.stderr)
    print(f"[i] Decisiones: {len(index.get('decisions', []))}", file=sys.stderr)
    print(f"[i] Procesos: {len(index.get('processes', []))}", file=sys.stderr)
    print(f"[i] Agentes: {len(index.get('agents', []))}", file=sys.stderr)
    print(f"[i] Esperando consultas... (lee stdin, formato JSON)", file=sys.stderr)

    for line in sys.stdin:
        try:
            req = json.loads(line.strip())
            action = req.get("action", "query")
            if action == "index":
                print(json.dumps(index))
            elif action == "query":
                results = query_shared_context(
                    req.get("query", ""),
                    req.get("category"),
                )
                print(json.dumps({"results": results, "count": len(results)}))
            elif action == "get":
                path = req.get("path", "")
                full_path = get_shared_org_path() / path
                if full_path.exists() and full_path.is_file():
                    content = full_path.read_text(encoding="utf-8")
                    print(json.dumps({"path": path, "content": content, "size": len(content)}))
                else:
                    print(json.dumps({"error": f"Archivo no encontrado: {path}"}))
            else:
                print(json.dumps({"error": f"Acción desconocida: {action}"}))
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"JSON inválido: {str(e)}"}))
        sys.stdout.flush()


def interactive_query():
    """Modo interactivo para consultar el shared context."""
    print("[CT] Capital Token — Consulta Interactiva")
    print("Comandos: /index, /query <texto>, /get <path>, /help, /exit")
    print()

    while True:
        try:
            line = input("ct> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if not line:
            continue
        if line == "/exit":
            break
        if line == "/help":
            print("Comandos:")
            print("  /index              — mostrar indice del shared org")
            print("  /query <texto>      — buscar en shared context")
            print("  /get <path>         — leer archivo completo")
            print("  /help               — esta ayuda")
            print("  /exit               — salir")
            continue
        if line == "/index":
            idx = build_index()
            print(f"Shared Org: {idx.get('path', 'N/A')}")
            for cat in ["playbooks", "decisions", "processes", "agents"]:
                items = idx.get(cat, [])
                print(f"  {cat}: {len(items)} archivos")
                for item in items:
                    print(f"    - {item['name']} ({item['size']} bytes)")
            continue
        if line.startswith("/query "):
            query = line[7:]
            results = query_shared_context(query)
            if results:
                print(f"Buscar: {len(results)} resultados para '{query}':")
                for r in results:
                    print(f"  [{r['category']}] {r['file']}")
                    print(f"    ...{r['match_preview']}...")
            else:
                print(f"No se encontraron resultados para '{query}'")
            continue
        if line.startswith("/get "):
            path = line[5:]
            full_path = get_shared_org_path() / path
            if full_path.exists() and full_path.is_file():
                print(f"Archivo: {path}:")
                print(full_path.read_text(encoding="utf-8"))
            else:
                print(f"Archivo no encontrado: {path}")
            continue

        print(f"Comando desconocido: {line}. Escribi /help para ayuda.")


def sync_to_engram():
    """Sincroniza el shared context con Engram Memory."""
    print("[CT] Sincronizando Shared Context con Engram...")
    index = build_index()

    total = sum(len(v) for k, v in index.items() if isinstance(v, list))
    print(f"  {total} archivos encontrados en shared org")

    # Cada playbook/agente se guarda como observación separada
    # Esta funcion es un stub — la implementacion real usa el MCP de Engram
    print("  [OK] Sincronizacion completada (stub)")
    print("  [i] Para sync real: engram_mem_save(topic_key='shared-org/<id>')")


def main():
    parser = argparse.ArgumentParser(description="Capital Token — MCP Bridge")
    parser.add_argument("--serve", action="store_true", help="Iniciar servidor MCP")
    parser.add_argument("--query", type=str, help="Consulta directa al shared context")
    parser.add_argument("--sync", action="store_true", help="Sincronizar con Engram")
    parser.add_argument("--index", action="store_true", help="Mostrar índice")
    args = parser.parse_args()

    if args.serve:
        serve()
    elif args.query:
        results = query_shared_context(args.query)
        print(json.dumps(results, indent=2))
    elif args.sync:
        sync_to_engram()
    elif args.index:
        print(json.dumps(build_index(), indent=2))
    else:
        interactive_query()


if __name__ == "__main__":
    main()
