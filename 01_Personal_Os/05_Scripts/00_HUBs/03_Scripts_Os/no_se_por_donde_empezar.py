#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
no_se_por_donde_empezar.py — Motor de Recomendaciones por Intencion
=====================================================================
Toma una pregunta en lenguaje natural y recomienda skills, agents,
workflows y comandos del sistema.

Basado en skill_discovery.py con capa de mapeo de intencion.

CLI:
  python no_se_por_donde_empezar.py --question "quiero crear contenido"
  python no_se_por_donde_empezar.py --interactive
  python no_se_por_donde_empezar.py --test
"""

import sys
import os
import json
import re
import argparse
import logging
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

# ── Intention Mapping ───────────────────────────────────────
# Maps user intent keywords to concrete system actions.

INTENT_MAP = {
    # Content creation
    "contenido": {
        "category": "Contenido",
        "skills": ["content-pipeline", "market-copy", "agency-content-creation"],
        "agents": ["Content Creator"],
        "workflows": ["03_Content_Generation.md"],
        "commands": [
            "python content_pipeline.py run --topic '<tema>' --platform linkedin",
        ],
        "description": "Generacion de contenido para redes y blogs.",
    },
    "post": {
        "category": "Contenido",
        "skills": ["content-pipeline", "social-content"],
        "agents": ["Content Creator"],
        "workflows": ["03_Content_Generation.md"],
        "commands": [
            "python content_pipeline.py run --topic '<tema>' --platform linkedin",
        ],
        "description": "Crear un post para redes sociales.",
    },
    "linkedin": {
        "category": "Contenido",
        "skills": ["social-content", "content-pipeline"],
        "agents": ["Content Creator"],
        "workflows": ["03_Content_Generation.md"],
        "commands": [
            "python content_pipeline.py run --topic '<tema>' --platform linkedin",
        ],
        "description": "Crear contenido para LinkedIn.",
    },
    "blog": {
        "category": "Contenido",
        "skills": ["content-pipeline"],
        "agents": ["Content Creator"],
        "workflows": ["03_Content_Generation.md"],
        "commands": [
            "python content_pipeline.py run --topic '<tema>' --platform blog",
        ],
        "description": "Escribir un articulo o blog post.",
    },
    "copywriting": {
        "category": "Contenido",
        "skills": ["market-copy"],
        "agents": ["Copywriter"],
        "workflows": ["03_Content_Generation.md"],
        "commands": ["Carga skill 'market-copy' y escribe el copy."],
        "description": "Copywriting para anuncios, emails o landing pages.",
    },
    "email": {
        "category": "Marketing",
        "skills": ["market-emails", "agency-email-marketing"],
        "agents": ["Email Marketer"],
        "workflows": [],
        "commands": ["Carga skill 'market-emails' para secuencias de email."],
        "description": "Secuencias de email marketing.",
    },
    "video": {
        "category": "Contenido",
        "skills": ["video-visuals-producer"],
        "agents": ["Video Producer"],
        "workflows": ["06_Youtube_Full_Video/"],
        "commands": ["Carga skill 'video-visuals-producer' para guiones y assets."],
        "description": "Produccion de video y guiones.",
    },

    # SEO & Marketing
    "seo": {
        "category": "Marketing",
        "skills": ["seo-audit", "claude-seo-ai", "agency-seo-search"],
        "agents": ["SEO Specialist"],
        "workflows": [],
        "commands": [
            "python 28_System_Health_Monitor.py (verificar sitio)",
            "Carga skill 'seo-audit' para auditoria completa.",
        ],
        "description": "Auditoria y optimizacion SEO.",
    },
    "marketing": {
        "category": "Marketing",
        "skills": ["market", "agency"],
        "agents": ["Marketing Strategist"],
        "workflows": [],
        "commands": ["Carga skill 'market' para el suite completo de marketing."],
        "description": "Suite completo de marketing: SEO, ads, contenido, email.",
    },
    "ads": {
        "category": "Marketing",
        "skills": ["market-ads", "agency-paid-ads"],
        "agents": ["Ad Specialist"],
        "workflows": [],
        "commands": ["Carga skill 'market-ads' para campanas de anuncios."],
        "description": "Campanas de anuncios en Google, Meta, LinkedIn.",
    },
    "brand": {
        "category": "Marketing",
        "skills": ["market-brand", "agency-brand-voice"],
        "agents": ["Brand Strategist"],
        "workflows": [],
        "commands": ["Carga skill 'market-brand' para analisis de marca."],
        "description": "Definicion y auditoria de brand voice.",
    },

    # System & Development
    "git": {
        "category": "Sistema",
        "skills": [],
        "agents": [],
        "workflows": [],
        "commands": [
            "python 02_Git_Hub.py",
        ],
        "description": "Gestion de git: commits, branches, PRs.",
    },
    "commit": {
        "category": "Sistema",
        "skills": ["ce-commit"],
        "agents": [],
        "workflows": [],
        "commands": ["Carga skill 'ce-commit' para commits con convencion."],
        "description": "Crear commits con mensajes descriptivos.",
    },
    "debug": {
        "category": "Desarrollo",
        "skills": ["systematic-debugging", "ce-debug"],
        "agents": ["Debugger"],
        "workflows": [],
        "commands": ["Carga skill 'systematic-debugging' para debug metodico."],
        "description": "Debug y diagnostico de errores.",
    },
    "test": {
        "category": "Desarrollo",
        "skills": ["test-driven-development", "e2e-testing-skill"],
        "agents": ["QA Engineer"],
        "workflows": [],
        "commands": ["Carga skill 'test-driven-development' para TDD."],
        "description": "Testing y aseguramiento de calidad.",
    },
    "code": {
        "category": "Desarrollo",
        "skills": ["ce-work", "ce-plan"],
        "agents": ["Developer"],
        "workflows": [],
        "commands": ["Carga skill 'ce-plan' para planificar, luego 'ce-work' para ejecutar."],
        "description": "Desarrollo de software con planificacion.",
    },

    # Rituals & Workflows
    "ritual": {
        "category": "Workflows",
        "skills": [],
        "agents": [],
        "workflows": [
            "01_Morning_Standup.md",
            "05_Ritual_Cierre_Protocol.md",
        ],
        "commands": [
            "python 04_Ritual_Hub.py --simple (diario)",
            "python 04_Ritual_Hub.py standup (manana)",
            "python 04_Ritual_Hub.py cierre (noche)",
        ],
        "description": "Rituales diarios de productividad.",
    },
    "standup": {
        "category": "Workflows",
        "skills": [],
        "agents": [],
        "workflows": ["01_Morning_Standup.md"],
        "commands": ["python 04_Ritual_Hub.py standup"],
        "description": "Morning standup: prioridades del dia.",
    },
    "tareas": {
        "category": "Workflows",
        "skills": [],
        "agents": [],
        "workflows": ["02_Backlog_Processing.md"],
        "commands": ["python 04_Ritual_Hub.py triage"],
        "description": "Gestion de backlog y tareas pendientes.",
    },

    # Design & Visual
    "diseno": {
        "category": "Diseno",
        "skills": ["frontend-design", "canvas-design", "design-taste-frontend"],
        "agents": ["Designer"],
        "workflows": [],
        "commands": ["Carga skill 'frontend-design' para interfaces web."],
        "description": "Diseno de interfaces y arte visual.",
    },
    "diagrama": {
        "category": "Diseno",
        "skills": ["canvas-diagram-studio"],
        "agents": ["Diagram Designer"],
        "workflows": [],
        "commands": ["Carga skill 'canvas-diagram-studio' para diagramas."],
        "description": "Creacion de diagramas y flowcharts.",
    },
    "presentacion": {
        "category": "Diseno",
        "skills": ["presentaciones-visuales", "pptx"],
        "agents": ["Presentation Designer"],
        "workflows": [],
        "commands": ["Carga skill 'presentaciones-visuales' para slides HTML."],
        "description": "Presentaciones y slides.",
    },
    "imagen": {
        "category": "Diseno",
        "skills": ["ce-gemini-imagegen", "product-studio"],
        "agents": ["Image Generator"],
        "workflows": [],
        "commands": ["Carga skill 'ce-gemini-imagegen' para generar imagenes."],
        "description": "Generacion de imagenes con IA.",
    },

    # Research & Analysis
    "investigar": {
        "category": "Investigacion",
        "skills": ["deep-research"],
        "agents": ["Researcher"],
        "workflows": [],
        "commands": ["Carga skill 'deep-research' para investigacion profunda."],
        "description": "Investigacion exhaustiva de temas complejos.",
    },
    "analizar": {
        "category": "Analisis",
        "skills": ["analytics-workflow", "ce-optimize"],
        "agents": ["Data Analyst"],
        "workflows": [],
        "commands": ["Carga skill 'analytics-workflow' para analisis de datos."],
        "description": "Analisis de datos y metricas.",
    },
    "competidores": {
        "category": "Marketing",
        "skills": ["market-competitors", "agency-competitive-ops"],
        "agents": ["Competitive Analyst"],
        "workflows": [],
        "commands": ["Carga skill 'market-competitors' para inteligencia competitiva."],
        "description": "Analisis de competidores y posicionamiento.",
    },

    # Memory & Learning
    "memoria": {
        "category": "Sistema",
        "skills": ["engram-memory-protocol"],
        "agents": [],
        "workflows": [],
        "commands": ["Engram memoria persistente — se activa automaticamente."],
        "description": "Memoria persistente entre sesiones.",
    },
    "planificar": {
        "category": "Workflows",
        "skills": ["ce-plan", "ce-brainstorm"],
        "agents": ["Planner"],
        "workflows": [],
        "commands": [
            "Carga skill 'ce-brainstorm' para explorar ideas.",
            "Carga skill 'ce-plan' para planificar implementacion.",
        ],
        "description": "Planificacion y brainstorming.",
    },

    # AI & Automation
    "agente": {
        "category": "AI",
        "skills": ["ce-agent-native-architecture"],
        "agents": ["Agent Designer"],
        "workflows": [],
        "commands": ["Carga skill 'ce-agent-native-architecture' para agentes."],
        "description": "Diseno y construccion de agentes de IA.",
    },
    "mcp": {
        "category": "AI",
        "skills": ["mcp-builder"],
        "agents": [],
        "workflows": [],
        "commands": ["Carga skill 'mcp-builder' para crear servidores MCP."],
        "description": "Crear herramientas MCP para integraciones.",
    },
}


# ── Scoring ─────────────────────────────────────────────────

def score_intentions(query: str) -> list[dict]:
    """Analiza la query y retorna intenciones rankeadas por relevancia."""
    query_lower = query.lower()
    query_words = set(re.split(r"[\W_]+", query_lower))
    query_words = {w for w in query_words if len(w) >= 2}

    results = []
    for keyword, intent in INTENT_MAP.items():
        # Direct match in query
        if keyword in query_lower:
            score = 0.9
            results.append({"keyword": keyword, "score": score, **intent})
            continue

        # Word-level match
        matches = sum(1 for w in query_words if w in keyword or keyword in w)
        if matches > 0:
            score = min(0.3 + matches * 0.2, 0.85)
            results.append({"keyword": keyword, "score": round(score, 2), **intent})

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


def get_recommendations(query: str, top_n: int = 3) -> dict:
    """Genera recomendaciones completas para una query."""
    intentions = score_intentions(query)

    if not intentions:
        return {
            "query": query,
            "found": False,
            "message": (
                "No encontre algo concreto para eso. "
                "Intenta ser mas especifico: menciona la plataforma (linkedin, blog), "
                "el tipo de tarea (contenido, SEO, debug), o el resultado que buscas."
            ),
            "suggestions": [
                "python skill_discovery.py --interactive (busqueda avanzada)",
                "python 04_Ritual_Hub.py --simple (empezar el dia)",
                "cat HUB_CATALOG.md (ver todos los comandos disponibles)",
            ],
        }

    top = intentions[:top_n]

    # Deduplicate skills and commands
    all_skills = []
    all_commands = []
    all_workflows = []
    seen_skills = set()
    for intent in top:
        for s in intent.get("skills", []):
            if s not in seen_skills:
                all_skills.append(s)
                seen_skills.add(s)
        for c in intent.get("commands", []):
            if c not in all_commands:
                all_commands.append(c)
        for w in intent.get("workflows", []):
            if w not in all_workflows:
                all_workflows.append(w)

    return {
        "query": query,
        "found": True,
        "primary_intent": top[0]["category"],
        "confidence": top[0]["score"],
        "intention_label": top[0].get("keyword", ""),
        "description": top[0].get("description", ""),
        "skills": all_skills[:5],
        "commands": all_commands[:5],
        "workflows": all_workflows[:3],
        "alternatives": [
            {"category": i["category"], "score": i["score"], "description": i["description"]}
            for i in top[1:]
        ],
    }


# ── Display ─────────────────────────────────────────────────

_rich = False
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    _rich = True
    console = Console()
except ImportError:
    console = None


def print_recommendation(rec: dict):
    """Imprime recomendacion formateada."""
    if not rec["found"]:
        if _rich:
            console.print(Panel(
                f"[yellow]{rec['message']}[/yellow]\n\n"
                "[bold]Sugerencias:[/bold]\n"
                + "\n".join(f"  [dim]> {s}[/dim]" for s in rec["suggestions"]),
                title="No se encontro recomendacion",
                border_style="yellow",
            ))
        else:
            print(f"\n  {rec['message']}\n")
            print("  Sugerencias:")
            for s in rec["suggestions"]:
                print(f"    > {s}")
        return

    if _rich:
        # Primary recommendation
        console.print(Panel(
            f"[bold cyan]{rec['primary_intent']}[/bold cyan] "
            f"[dim](confianza: {rec['confidence']:.0%})[/dim]\n\n"
            f"{rec['description']}",
            title="Recomendacion Principal",
            border_style="cyan",
        ))

        # Skills
        if rec["skills"]:
            console.print("\n[bold]Skills recomendados:[/bold]")
            for i, skill in enumerate(rec["skills"], 1):
                console.print(f"  {i}. [green]{skill}[/green]")

        # Commands
        if rec["commands"]:
            console.print("\n[bold]Comandos para empezar:[/bold]")
            for cmd in rec["commands"]:
                console.print(f"  [dim]> {cmd}[/dim]")

        # Workflows
        if rec["workflows"]:
            console.print("\n[bold]Workflows relacionados:[/bold]")
            for wf in rec["workflows"]:
                console.print(f"  [dim]> {wf}[/dim]")

        # Alternatives
        if rec["alternatives"]:
            console.print("\n[bold]Tambien podria interesarte:[/bold]")
            for alt in rec["alternatives"]:
                console.print(
                    f"  - [yellow]{alt['category']}[/yellow] "
                    f"[dim]({alt['score']:.0%}) — {alt['description']}[/dim]"
                )
    else:
        print(f"\n  Recomendacion: {rec['primary_intent']} (confianza: {rec['confidence']:.0%})")
        print(f"  {rec['description']}\n")

        if rec["skills"]:
            print("  Skills recomendados:")
            for i, skill in enumerate(rec["skills"], 1):
                print(f"    {i}. {skill}")

        if rec["commands"]:
            print("\n  Comandos para empezar:")
            for cmd in rec["commands"]:
                print(f"    > {cmd}")

        if rec["alternatives"]:
            print("\n  Alternativas:")
            for alt in rec["alternatives"]:
                print(f"    - {alt['category']} ({alt['score']:.0%}): {alt['description']}")


# ── Interactive Mode ────────────────────────────────────────

def interactive_mode():
    """Modo interactivo de recomendaciones."""
    if _rich:
        console.print(Panel(
            "[bold]No se por donde empezar[/bold]\n"
            "[dim]Escribi lo que queres hacer y te recomiendo que usar.[/dim]\n"
            "[dim]Escribe 'salir' para terminar.[/dim]",
            border_style="cyan",
        ))
    else:
        print("=" * 60)
        print("  No se por donde empezar")
        print("  Escribi lo que queres hacer y te recomiendo que usar.")
        print("  Escribe 'salir' para terminar.")
        print("=" * 60)

    while True:
        try:
            query = input("\n  Tu> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n  Hasta luego!")
            break

        if not query or query.lower() in ("salir", "exit", "q", "quit"):
            print("  Hasta luego!")
            break

        rec = get_recommendations(query)
        print()
        print_recommendation(rec)


# ── Test ────────────────────────────────────────────────────

def run_tests():
    """Tests internos del motor de recomendaciones."""
    print("Running recommendation engine tests...\n")
    passed = 0
    failed = 0

    def check(name: str, condition: bool, detail: str = ""):
        nonlocal passed, failed
        if condition:
            passed += 1
            print(f"  [PASS] {name}")
        else:
            failed += 1
            print(f"  [FAIL] {name} — {detail}")

    # Test 1: INTENT_MAP has entries
    check("INTENT_MAP populated", len(INTENT_MAP) > 15, f"got {len(INTENT_MAP)}")

    # Test 2: Each intent has required fields
    for keyword, intent in INTENT_MAP.items():
        check(
            f"Intent '{keyword}' has skills",
            "skills" in intent and isinstance(intent["skills"], list),
        )
        check(
            f"Intent '{keyword}' has commands",
            "commands" in intent and isinstance(intent["commands"], list),
        )
        check(
            f"Intent '{keyword}' has category",
            "category" in intent and isinstance(intent["category"], str),
        )

    # Test 3: Known queries return results
    test_cases = [
        ("quiero crear contenido", "Contenido"),
        ("necesito hacer un post de linkedin", "Contenido"),
        ("quiero hacer SEO", "Marketing"),
        ("como commitear", "Sistema"),
        ("necesito debuggear un error", "Desarrollo"),
        ("hacer un diagrama", "Diseno"),
        ("planificar una feature", "Workflows"),
        ("investigar un tema", "Investigacion"),
    ]

    for query, expected_cat in test_cases:
        rec = get_recommendations(query)
        check(
            f"Query '{query}' found",
            rec["found"],
        )
        if rec["found"]:
            check(
                f"Query '{query}' category match",
                rec["primary_intent"] == expected_cat,
                f"got '{rec['primary_intent']}'",
            )

    # Test 4: Unknown query returns suggestion
    rec_unknown = get_recommendations("xyzzy plugh foo bar")
    check(
        "Unknown query returns not-found",
        not rec_unknown["found"],
    )
    check(
        "Unknown query has suggestions",
        "suggestions" in rec_unknown and len(rec_unknown["suggestions"]) > 0,
    )

    # Test 5: Empty query
    rec_empty = get_recommendations("")
    check(
        "Empty query returns not-found",
        not rec_empty["found"],
    )

    print(f"\n  Results: {passed} passed, {failed} failed")
    if failed:
        sys.exit(1)


# ── CLI ─────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="No se por donde empezar — Motor de Recomendaciones"
    )
    parser.add_argument(
        "--question", "-q",
        type=str,
        help="Tu pregunta en lenguaje natural",
    )
    parser.add_argument(
        "--interactive", "-i",
        action="store_true",
        help="Modo interactivo",
    )
    parser.add_argument(
        "--test", "-t",
        action="store_true",
        help="Ejecutar tests internos",
    )
    parser.add_argument(
        "--json-output",
        action="store_true",
        help="Output en JSON",
    )

    args = parser.parse_args()

    if args.test:
        run_tests()
        return

    if args.interactive:
        interactive_mode()
        return

    if not args.question:
        parser.print_help()
        sys.exit(1)

    rec = get_recommendations(args.question)

    if args.json_output:
        print(json.dumps(rec, indent=2, ensure_ascii=False))
    else:
        print_recommendation(rec)


if __name__ == "__main__":
    main()
