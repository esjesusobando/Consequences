#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
prototype_builder.py — HTML Prototype Builder
=============================================
Builds interactive, self-contained HTML prototypes from hypotheses.

Features:
- Self-contained HTML (no external dependencies)
- Brand-calibrated design systems (Spotify, minimalist, corporate, playful)
- Mobile-responsive
- Interactive elements (buttons, forms, navigation)

CLI:
    python prototype_builder.py --hypothesis-id "hyp_xxx" --brand spotify
    python prototype_builder.py --test

Output: prototype_{id}.html in .cache/prototypes/
"""
import sys
import os
import json
import argparse
import logging
from pathlib import Path
from datetime import datetime, timezone

# ─────────────────────────────────────────────────────────────
# WINDOWS UTF-8 FIX
# ─────────────────────────────────────────────────────────────
def _fix_encoding():
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ─────────────────────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

PROTOTYPES_DIR = CACHE_DIR / "prototypes"


# =============================================================================
# ID GENERATION
# =============================================================================

def _gen_id(prefix: str = "proto") -> str:
    import random
    import string
    date_str = datetime.now().strftime("%Y%m%d")
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{prefix}_{date_str}_{rand}"


def _safe_write(content: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(content, encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# DESIGN SYSTEMS
# =============================================================================

DESIGN_SYSTEMS = {
    "spotify": {
        "name": "Spotify",
        "bg_primary": "#121212",
        "bg_secondary": "#181818",
        "bg_card": "#282828",
        "bg_card_hover": "#333333",
        "text_primary": "#FFFFFF",
        "text_secondary": "#B3B3B3",
        "accent": "#1DB954",
        "accent_hover": "#1ed760",
        "danger": "#E91429",
        "border": "#333333",
        "font_family": "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        "border_radius": "8px",
        "shadow": "0 4px 12px rgba(0,0,0,0.3)",
    },
    "minimalist": {
        "name": "Minimalist",
        "bg_primary": "#FFFFFF",
        "bg_secondary": "#F8F9FA",
        "bg_card": "#FFFFFF",
        "bg_card_hover": "#F1F3F5",
        "text_primary": "#212529",
        "text_secondary": "#6C757D",
        "accent": "#212529",
        "accent_hover": "#495057",
        "danger": "#DC3545",
        "border": "#DEE2E6",
        "font_family": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        "border_radius": "4px",
        "shadow": "0 1px 3px rgba(0,0,0,0.08)",
    },
    "corporate": {
        "name": "Corporate",
        "bg_primary": "#F5F7FA",
        "bg_secondary": "#E8EDF2",
        "bg_card": "#FFFFFF",
        "bg_card_hover": "#F0F4F8",
        "text_primary": "#1A2332",
        "text_secondary": "#5A6B7F",
        "accent": "#2563EB",
        "accent_hover": "#1D4ED8",
        "danger": "#DC2626",
        "border": "#D1D9E6",
        "font_family": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        "border_radius": "8px",
        "shadow": "0 2px 8px rgba(37,99,235,0.08)",
    },
    "playful": {
        "name": "Playful",
        "bg_primary": "#FFF8F0",
        "bg_secondary": "#FFF0E0",
        "bg_card": "#FFFFFF",
        "bg_card_hover": "#FFF5EB",
        "text_primary": "#2D1B4E",
        "text_secondary": "#6B5B8D",
        "accent": "#FF6B35",
        "accent_hover": "#E85D2C",
        "danger": "#E63946",
        "border": "#E8DDD0",
        "font_family": "'Nunito', 'Segoe UI', sans-serif",
        "border_radius": "16px",
        "shadow": "0 4px 16px rgba(255,107,53,0.12)",
    },
}


# =============================================================================
# HTML GENERATION
# =============================================================================

def _get_css(ds: dict) -> str:
    """Generate CSS from design system tokens."""
    return f"""
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{
        font-family: {ds['font_family']};
        background: {ds['bg_primary']};
        color: {ds['text_primary']};
        line-height: 1.6;
        min-height: 100vh;
    }}
    .container {{ max-width: 800px; margin: 0 auto; padding: 24px; }}
    .header {{
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 0; margin-bottom: 32px;
        border-bottom: 1px solid {ds['border']};
    }}
    .logo {{ font-size: 20px; font-weight: 700; }}
    .nav {{ display: flex; gap: 16px; }}
    .nav a {{
        color: {ds['text_secondary']}; text-decoration: none;
        font-size: 14px; font-weight: 500;
        transition: color 0.2s;
    }}
    .nav a:hover {{ color: {ds['accent']}; }}
    .hero {{
        text-align: center; padding: 48px 0;
    }}
    .hero h1 {{
        font-size: 32px; font-weight: 700;
        margin-bottom: 12px;
    }}
    .hero p {{
        font-size: 16px; color: {ds['text_secondary']};
        max-width: 500px; margin: 0 auto;
    }}
    .card {{
        background: {ds['bg_card']};
        border: 1px solid {ds['border']};
        border-radius: {ds['border_radius']};
        padding: 24px; margin-bottom: 16px;
        box-shadow: {ds['shadow']};
        transition: background 0.2s, transform 0.2s;
    }}
    .card:hover {{
        background: {ds['bg_card_hover']};
        transform: translateY(-1px);
    }}
    .btn {{
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 24px; border-radius: {ds['border_radius']};
        font-size: 14px; font-weight: 600; border: none;
        cursor: pointer; transition: all 0.2s;
        text-decoration: none;
    }}
    .btn-primary {{
        background: {ds['accent']}; color: {'#000000' if ds['name'] == 'Spotify' else '#FFFFFF'};
    }}
    .btn-primary:hover {{ background: {ds['accent_hover']}; transform: scale(1.02); }}
    .btn-secondary {{
        background: transparent; color: {ds['accent']};
        border: 1px solid {ds['accent']};
    }}
    .btn-secondary:hover {{ background: {ds['accent']}10; }}
    .input-group {{ margin-bottom: 16px; }}
    .input-group label {{
        display: block; font-size: 13px; font-weight: 600;
        margin-bottom: 6px; color: {ds['text_secondary']};
    }}
    .input-group input, .input-group textarea, .input-group select {{
        width: 100%; padding: 12px; border-radius: {ds['border_radius']};
        border: 1px solid {ds['border']}; background: {ds['bg_secondary']};
        color: {ds['text_primary']}; font-size: 14px;
        font-family: inherit;
    }}
    .input-group input:focus, .input-group textarea:focus {{
        outline: none; border-color: {ds['accent']};
    }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }}
    .badge {{
        display: inline-block; padding: 4px 10px; border-radius: 20px;
        font-size: 12px; font-weight: 600;
        background: {ds['accent']}20; color: {ds['accent']};
    }}
    .list {{ list-style: none; }}
    .list li {{
        padding: 12px 0; border-bottom: 1px solid {ds['border']};
        display: flex; align-items: center; gap: 12px;
    }}
    .list li:last-child {{ border-bottom: none; }}
    .list-icon {{ color: {ds['accent']}; font-size: 18px; }}
    .footer {{
        text-align: center; padding: 32px 0; margin-top: 48px;
        border-top: 1px solid {ds['border']};
        color: {ds['text_secondary']}; font-size: 13px;
    }}
    .feedback-banner {{
        position: fixed; bottom: 0; left: 0; right: 0;
        background: {ds['bg_card']}; border-top: 1px solid {ds['border']};
        padding: 12px 24px; display: flex; align-items: center;
        justify-content: space-between; z-index: 100;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    }}
    .tabs {{ display: flex; gap: 0; margin-bottom: 24px; }}
    .tab {{
        padding: 10px 20px; cursor: pointer;
        border-bottom: 2px solid transparent;
        color: {ds['text_secondary']}; font-weight: 500;
        transition: all 0.2s;
    }}
    .tab.active {{ color: {ds['accent']}; border-bottom-color: {ds['accent']}; }}
    .tab:hover {{ color: {ds['text_primary']}; }}
    .hidden {{ display: none; }}
    .toast {{
        position: fixed; bottom: 80px; right: 24px;
        background: {ds['accent']}; color: {'#000' if ds['name'] == 'Spotify' else '#fff'};
        padding: 12px 24px; border-radius: {ds['border_radius']};
        font-weight: 600; opacity: 0; transition: opacity 0.3s;
        z-index: 200;
    }}
    .toast.show {{ opacity: 1; }}
    @media (max-width: 600px) {{
        .container {{ padding: 16px; }}
        .hero h1 {{ font-size: 24px; }}
        .grid {{ grid-template-columns: 1fr; }}
    }}
    """


def _get_interactive_js(idea: str, ds_name: str) -> str:
    """Generate interactive JavaScript for the prototype."""
    return f"""
    // Prototype Interactive Layer
    (function() {{
        const prototypeData = {{
            idea: "{idea}",
            brand: "{ds_name}",
            created: new Date().toISOString(),
            interactions: []
        }};

        // Track all clicks
        document.addEventListener('click', function(e) {{
            const target = e.target.closest('[data-action]');
            if (target) {{
                const action = target.dataset.action;
                const label = target.dataset.label || target.textContent.trim();
                prototypeData.interactions.push({{
                    timestamp: new Date().toISOString(),
                    action: action,
                    label: label,
                    element: target.tagName
                }});

                // Visual feedback
                showToast(action + ': ' + label);
            }}
        }});

        // Toast notification
        function showToast(message) {{
            const toast = document.getElementById('toast');
            if (toast) {{
                toast.textContent = message;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
            }}
        }}

        // Tab switching
        window.switchTab = function(tabId) {{
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.querySelector('[data-tab="' + tabId + '"]')?.classList.add('active');
            document.getElementById('tab-' + tabId)?.classList.remove('hidden');
        }};

        // Form submission simulation
        window.simulateSubmit = function(formId) {{
            const form = document.getElementById(formId);
            if (form) {{
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                prototypeData.interactions.push({{
                    timestamp: new Date().toISOString(),
                    action: 'form_submit',
                    data: data
                }});
                showToast('Form submitted!');
            }}
        }};

        // Expose for external access
        window.PrototypeData = prototypeData;
    }})();
    """


def _build_hypothesis_content(hypothesis: dict) -> str:
    """Build HTML content from hypothesis data."""
    idea = hypothesis.get("idea", "Prototype")
    problem = hypothesis.get("problem_statement", "")
    user = hypothesis.get("target_user", {})
    persona = user.get("persona", "User")
    pain_points = user.get("pain_points", [])
    goals = user.get("goals", [])
    metrics = hypothesis.get("success_metrics", [])

    pain_points_html = "\n".join(f'<li><span class="list-icon">&#10005;</span> {p}</li>' for p in pain_points)
    goals_html = "\n".join(f'<li><span class="list-icon">&#10003;</span> {g}</li>' for g in goals)
    metrics_html = "\n".join(
        f'<li><span class="badge">{m.get("priority","")}</span> {m.get("metric","")} — Target: {m.get("target","")}</li>'
        for m in metrics
    )

    return f"""
    <div class="container">
        <header class="header">
            <div class="logo">{idea.title()}</div>
            <nav class="nav">
                <a href="#" data-action="nav" data-label="Home">Home</a>
                <a href="#" data-action="nav" data-label="Features">Features</a>
                <a href="#" data-action="nav" data-label="About">About</a>
            </nav>
        </header>

        <section class="hero">
            <h1>{idea.title()}</h1>
            <p>{problem}</p>
            <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-primary" data-action="cta" data-label="Get Started">Get Started</button>
                <button class="btn btn-secondary" data-action="cta" data-label="Learn More">Learn More</button>
            </div>
        </section>

        <div class="tabs">
            <div class="tab active" data-tab="features" onclick="switchTab('features')">Features</div>
            <div class="tab" data-tab="user" onclick="switchTab('user')">User</div>
            <div class="tab" data-tab="metrics" onclick="switchTab('metrics')">Metrics</div>
        </div>

        <div id="tab-features" class="tab-content">
            <div class="grid">
                <div class="card" data-action="feature" data-label="Core Feature">
                    <h3>Core Feature</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">
                        The primary action that delivers value to the user.
                    </p>
                    <button class="btn btn-primary" style="margin-top: 16px;"
                            data-action="feature" data-label="Try Core Feature">
                        Try it now
                    </button>
                </div>
                <div class="card" data-action="feature" data-label="Secondary Feature">
                    <h3>Secondary Feature</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">
                        Supporting functionality that enhances the core experience.
                    </p>
                    <button class="btn btn-secondary" style="margin-top: 16px;"
                            data-action="feature" data-label="Try Secondary Feature">
                        Explore
                    </button>
                </div>
                <div class="card" data-action="feature" data-label="Social Feature">
                    <h3>Social Feature</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">
                        Share, collaborate, and connect with others.
                    </p>
                    <button class="btn btn-secondary" style="margin-top: 16px;"
                            data-action="feature" data-label="Try Social Feature">
                        Connect
                    </button>
                </div>
            </div>
        </div>

        <div id="tab-user" class="tab-content hidden">
            <div class="card">
                <h3>Target User: {persona}</h3>
                <p style="color: var(--text-secondary); margin-top: 4px;">
                    {user.get('demographics', '')}
                </p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="card">
                    <h4 style="margin-bottom: 12px;">Pain Points</h4>
                    <ul class="list">{pain_points_html}</ul>
                </div>
                <div class="card">
                    <h4 style="margin-bottom: 12px;">Goals</h4>
                    <ul class="list">{goals_html}</ul>
                </div>
            </div>
        </div>

        <div id="tab-metrics" class="tab-content hidden">
            <div class="card">
                <h3 style="margin-bottom: 16px;">Success Metrics</h3>
                <ul class="list">{metrics_html}</ul>
            </div>
        </div>

        <div class="feedback-banner">
            <span style="font-size: 14px; color: var(--text-secondary);">
                This is an interactive prototype &mdash; click around to explore!
            </span>
            <button class="btn btn-primary" data-action="feedback" data-label="Give Feedback">
                Give Feedback
            </button>
        </div>
    </div>

    <div id="toast" class="toast"></div>
    """


# =============================================================================
# PUBLIC API
# =============================================================================

def build_prototype(hypothesis: dict, brand: str = "generic", style: str = "minimalist",
                    output_dir: Path = None) -> dict:
    """
    Build an HTML prototype from a hypothesis.

    Args:
        hypothesis: Hypothesis dict (from generate_hypothesis)
        brand: Design system name
        style: Style preference
        output_dir: Where to save

    Returns:
        dict with prototype ID and file path
    """
    out = output_dir or PROTOTYPES_DIR
    prototype_id = _gen_id("proto")
    now = datetime.now(timezone.utc).isoformat()

    # Resolve design system
    ds_key = brand.lower() if brand.lower() in DESIGN_SYSTEMS else style.lower()
    if ds_key not in DESIGN_SYSTEMS:
        ds_key = "minimalist"
    ds = DESIGN_SYSTEMS[ds_key]

    # Generate HTML
    css = _get_css(ds)
    content = _build_hypothesis_content(hypothesis)
    js = _get_interactive_js(hypothesis.get("idea", ""), ds["name"])

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{hypothesis.get('idea', 'Prototype').title()} — Prototype</title>
    <style>
    :root {{
        --bg-primary: {ds['bg_primary']};
        --bg-secondary: {ds['bg_secondary']};
        --bg-card: {ds['bg_card']};
        --text-primary: {ds['text_primary']};
        --text-secondary: {ds['text_secondary']};
        --accent: {ds['accent']};
    }}
    {css}
    </style>
</head>
<body>
    {content}
    {js}
</body>
</html>"""

    # Save
    filepath = out / f"prototype_{prototype_id}.html"
    _safe_write(html, filepath)

    # Build metadata
    metadata = {
        "id": prototype_id,
        "created_at": now,
        "idea": hypothesis.get("idea", ""),
        "hypothesis_id": hypothesis.get("id", ""),
        "brand": brand,
        "style": style,
        "design_system": ds["name"],
        "prototype_file": str(filepath),
        "file_size_bytes": filepath.stat().st_size,
        "html_length": len(html),
    }

    # Save metadata alongside HTML
    meta_path = out / f"prototype_{prototype_id}_meta.json"
    tmp = meta_path.with_suffix('.tmp')
    tmp.write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(meta_path)

    logger.info(f"Prototype built: {prototype_id}")
    logger.info(f"  Design system: {ds['name']}")
    logger.info(f"  File size: {metadata['file_size_bytes']} bytes")
    logger.info(f"  Saved: {filepath}")

    return metadata


def load_prototype_metadata(prototype_id: str, directory: Path = None) -> dict:
    """Load prototype metadata by ID."""
    d = directory or PROTOTYPES_DIR
    meta_path = d / f"prototype_{prototype_id}_meta.json"
    if meta_path.exists():
        return json.loads(meta_path.read_text(encoding='utf-8'))
    # Fallback: try to find by glob
    matches = list(d.glob(f"prototype_{prototype_id}*_meta.json"))
    if matches:
        return json.loads(matches[0].read_text(encoding='utf-8'))
    raise FileNotFoundError(f"Prototype metadata not found: {prototype_id}")


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()
    parser = argparse.ArgumentParser(description="Prototype Builder")
    parser.add_argument("--hypothesis-id", required=True, help="Hypothesis ID to build from")
    parser.add_argument("--brand", default="generic", help="Brand design system")
    parser.add_argument("--style", default="minimalist", help="Visual style")
    parser.add_argument("--output-dir", type=Path, default=None)
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verbose", "-v", action="store_true")

    args = parser.parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        # Generate a test hypothesis inline
        from hypothesis_generator import generate_hypothesis
        hyp = generate_hypothesis("test feature for demo", output_dir=PROTOTYPES_DIR)
        result = build_prototype(hyp, brand="spotify", output_dir=PROTOTYPES_DIR)
        f = Path(result["prototype_file"])
        assert f.exists(), f"File not found: {f}"
        content = f.read_text(encoding='utf-8')
        assert "<html" in content.lower(), "Missing HTML"
        assert "1DB954" in content, "Missing Spotify green"
        print(f"\n[TEST PASS] Prototype built: {result['prototype_file']}")
        return

    from hypothesis_generator import load_hypothesis
    hypothesis = load_hypothesis(args.hypothesis_id, PROTOTYPES_DIR)
    result = build_prototype(hypothesis, brand=args.brand, style=args.style,
                              output_dir=args.output_dir)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
