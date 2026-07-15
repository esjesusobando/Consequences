#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
labs_page_generator.py — Labs Page (Feedback Collection) Generator
==================================================================
Generates a feedback collection page:
- HTML page with prototype embedded
- Embedded feedback form
- Shareable (local file, works offline)
- Tracks completion status

CLI:
    python labs_page_generator.py --prototype-id "proto_xxx"
    python labs_page_generator.py --test

Output: labs_{prototype_id}.html in .cache/prototypes/
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

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

PROTOTYPES_DIR = CACHE_DIR / "prototypes"


def _safe_write(content: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(content, encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# LABS PAGE GENERATION
# =============================================================================

def generate_labs_page(prototype_id: str, output_dir: Path = None) -> dict:
    """
    Generate a feedback collection labs page.

    Args:
        prototype_id: Prototype ID
        output_dir: Where to save

    Returns:
        dict with labs file path
    """
    out = output_dir or PROTOTYPES_DIR
    now = datetime.now(timezone.utc).isoformat()

    # Load prototype metadata
    proto_file = None
    idea = "Prototype"
    for f in out.glob(f"prototype_{prototype_id}*"):
        if f.suffix == '.html':
            proto_file = f
            break

    meta_file = out / f"prototype_{prototype_id}_meta.json"
    if meta_file.exists():
        try:
            meta = json.loads(meta_file.read_text(encoding='utf-8'))
            idea = meta.get("idea", idea)
        except (json.JSONDecodeError, OSError):
            pass

    # Load test questions
    questions = []
    test_files = list(out.glob(f"test_*.json"))
    for tf in test_files:
        try:
            td = json.loads(tf.read_text(encoding='utf-8'))
            if td.get("prototype_id") == prototype_id:
                questions = td.get("questions", [])
                break
        except (json.JSONDecodeError, OSError):
            pass

    questions_json = json.dumps(questions, ensure_ascii=False)

    # Build the labs page HTML
    html = _build_labs_html(prototype_id, idea, questions, now)

    # Save
    filepath = out / f"labs_{prototype_id}.html"
    _safe_write(html, filepath)

    result = {
        "prototype_id": prototype_id,
        "labs_file": str(filepath),
        "idea": idea,
        "generated_at": now,
        "has_questions": len(questions) > 0,
    }

    logger.info(f"Labs page generated: {filepath}")
    return result


def _build_labs_html(prototype_id: str, idea: str, questions: list, timestamp: str) -> str:
    """Build the full labs page HTML."""
    questions_json = json.dumps(questions, ensure_ascii=False)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Labs: {idea.title()} — Prototype Feedback</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0F0F0F; color: #FFFFFF; line-height: 1.6;
        }}
        .labs-header {{
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            padding: 48px 24px; text-align: center;
            border-bottom: 1px solid #333;
        }}
        .labs-badge {{
            display: inline-block; padding: 6px 16px; border-radius: 20px;
            background: #E91E6320; color: #E91E63; font-size: 12px;
            font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
            margin-bottom: 16px;
        }}
        .labs-header h1 {{ font-size: 32px; margin-bottom: 8px; }}
        .labs-header p {{ color: #B3B3B3; font-size: 14px; }}
        .labs-meta {{
            display: flex; justify-content: center; gap: 24px;
            margin-top: 16px; font-size: 13px; color: #666;
        }}
        .container {{ max-width: 800px; margin: 0 auto; padding: 24px; }}
        .section {{
            background: #1a1a1a; border-radius: 12px; padding: 24px;
            margin-bottom: 24px; border: 1px solid #333;
        }}
        .section h2 {{
            font-size: 18px; margin-bottom: 16px; color: #E91E63;
        }}
        .prototype-frame {{
            border: 1px solid #333; border-radius: 8px;
            overflow: hidden; margin-bottom: 24px;
        }}
        .prototype-frame iframe {{
            width: 100%; height: 500px; border: none;
        }}
        .prototype-frame .frame-header {{
            background: #222; padding: 8px 16px; font-size: 12px;
            color: #999; display: flex; justify-content: space-between;
            border-bottom: 1px solid #333;
        }}
        .question-group {{ margin-bottom: 20px; }}
        .question-group label {{
            display: block; font-size: 14px; font-weight: 600;
            margin-bottom: 8px; color: #DDD;
        }}
        .question-group .required {{ color: #E91E63; }}
        .option-list {{ display: flex; flex-direction: column; gap: 8px; }}
        .option-item {{
            display: flex; align-items: center; gap: 10px;
            padding: 10px 14px; background: #222; border-radius: 8px;
            cursor: pointer; border: 1px solid #333; transition: all 0.2s;
        }}
        .option-item:hover {{ border-color: #E91E63; background: #2a1a2e; }}
        .option-item.selected {{ border-color: #E91E63; background: #E91E6310; }}
        .option-item input {{ accent-color: #E91E63; }}
        textarea {{
            width: 100%; min-height: 60px; padding: 12px;
            background: #222; border: 1px solid #333; border-radius: 8px;
            color: #FFF; font-family: inherit; font-size: 14px; resize: vertical;
        }}
        textarea:focus {{ outline: none; border-color: #E91E63; }}
        .rating-row {{ display: flex; gap: 4px; flex-wrap: wrap; }}
        .rating-btn {{
            width: 36px; height: 36px; border-radius: 6px;
            border: 2px solid #333; background: #222; color: #999;
            font-weight: 700; cursor: pointer; font-size: 13px;
            transition: all 0.2s;
        }}
        .rating-btn:hover {{ border-color: #E91E63; color: #FFF; }}
        .rating-btn.selected {{ background: #E91E63; color: #FFF; border-color: #E91E63; }}
        .submit-btn {{
            display: block; width: 100%; padding: 16px; border-radius: 8px;
            background: #E91E63; color: white; font-size: 16px; font-weight: 700;
            border: none; cursor: pointer; transition: all 0.2s;
        }}
        .submit-btn:hover {{ background: #C2185B; transform: scale(1.01); }}
        .submit-btn:disabled {{ background: #333; color: #666; cursor: not-allowed; }}
        .success-msg {{
            display: none; text-align: center; padding: 48px;
            background: #1a2e1a; border-radius: 12px; border: 1px solid #2a4a2a;
        }}
        .success-msg h2 {{ color: #4CAF50; margin-bottom: 12px; }}
        .counter {{
            text-align: center; padding: 12px; font-size: 13px; color: #666;
        }}
        @media (max-width: 600px) {{
            .labs-header h1 {{ font-size: 24px; }}
            .rating-btn {{ width: 30px; height: 30px; font-size: 12px; }}
        }}
    </style>
</head>
<body>
    <div class="labs-header">
        <div class="labs-badge">Labs Page</div>
        <h1>{idea.title()}</h1>
        <p>Help us validate this prototype with your honest feedback</p>
        <div class="labs-meta">
            <span>Prototype: {prototype_id}</span>
            <span>Created: {timestamp[:10]}</span>
        </div>
    </div>

    <div class="container">
        <div class="section">
            <h2>Prototype Preview</h2>
            <p style="color: #999; font-size: 13px; margin-bottom: 12px;">
                Explore the prototype below, then answer the questions.
            </p>
            <div class="prototype-frame">
                <div class="frame-header">
                    <span>Prototype Preview</span>
                    <span>Interactive</span>
                </div>
                <iframe id="protoFrame" src="prototype_{prototype_id}.html"></iframe>
            </div>
        </div>

        <div class="section" id="feedbackForm">
            <h2>Feedback Form</h2>
            <div id="questionsContainer"></div>
            <button class="submit-btn" id="submitBtn" disabled onclick="submitFeedback()">
                Submit Feedback
            </button>
        </div>

        <div class="success-msg" id="successMsg">
            <h2>&#10003; Thank You!</h2>
            <p>Your feedback has been recorded successfully.</p>
            <p style="margin-top: 8px; color: #999;">Response ID: <span id="responseId"></span></p>
        </div>

        <div class="counter" id="counter"></div>
    </div>

    <script>
        const QUESTIONS = {questions_json};
        const PROTOTYPE_ID = "{prototype_id}";
        let answers = {{}};
        let answeredRequired = 0;
        const requiredCount = QUESTIONS.filter(q => q.required).length;

        function render() {{
            const container = document.getElementById('questionsContainer');
            container.innerHTML = '';

            QUESTIONS.forEach((q, i) => {{
                const group = document.createElement('div');
                group.className = 'question-group';
                group.id = 'qgroup-' + q.id;

                let inputHtml = '';
                if (q.input_type === 'multiple_choice') {{
                    inputHtml = '<div class="option-list">' +
                        q.options.map(opt =>
                            `<div class="option-item" onclick="selectOption('${{q.id}}', '${{opt.replace(/'/g, "\\'")}}', this)">
                                <input type="radio" name="${{q.id}}" value="${{opt}}">
                                <span>${{opt}}</span>
                            </div>`
                        ).join('') + '</div>';
                }} else if (q.input_type === 'text') {{
                    inputHtml = `<textarea id="input-${{q.id}}" placeholder="Your answer..."
                        oninput="updateText('${{q.id}}', this.value)"></textarea>`;
                }} else if (q.input_type === 'rating' || q.input_type === 'nps') {{
                    const min = q.min || 1;
                    const max = q.max || 10;
                    let btns = '';
                    for (let v = min; v <= max; v++) {{
                        btns += `<button class="rating-btn" onclick="selectRating('${{q.id}}', ${{v}}, this)">${{v}}</button>`;
                    }}
                    inputHtml = `<div class="rating-row">${{btns}}</div>`;
                }}

                group.innerHTML = `
                    <label>${{q.question}} ${{q.required ? '<span class="required">*</span>' : ''}}</label>
                    ${{inputHtml}}
                `;
                container.appendChild(group);
            }});
        }}

        function selectOption(qId, value, el) {{
            el.closest('.option-list').querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');
            el.querySelector('input').checked = true;
            markAnswered(qId);
        }}

        function selectRating(qId, value, el) {{
            el.closest('.rating-row').querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
            markAnswered(qId);
        }}

        function updateText(qId, value) {{
            if (value.trim().length > 0) markAnswered(qId);
        }}

        function markAnswered(qId) {{
            const q = QUESTIONS.find(q => q.id === qId);
            if (!answers[qId] && q && q.required) answeredRequired++;
            answers[qId] = true;
            if (answeredRequired >= requiredCount) {{
                document.getElementById('submitBtn').disabled = false;
            }}
        }}

        function submitFeedback() {{
            const allAnswers = {{}};
            QUESTIONS.forEach(q => {{
                const group = document.getElementById('qgroup-' + q.id);
                if (!group) return;
                if (q.input_type === 'multiple_choice') {{
                    const selected = group.querySelector('input:checked');
                    allAnswers[q.id] = selected ? selected.value : '';
                }} else if (q.input_type === 'text') {{
                    const ta = group.querySelector('textarea');
                    allAnswers[q.id] = ta ? ta.value : '';
                }} else if (q.input_type === 'rating' || q.input_type === 'nps') {{
                    const btn = group.querySelector('.rating-btn.selected');
                    allAnswers[q.id] = btn ? btn.textContent : '';
                }}
            }});

            const responseId = 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            const payload = {{
                test_id: responseId,
                prototype_id: PROTOTYPE_ID,
                answers: allAnswers,
                completed_at: new Date().toISOString(),
                total_questions: QUESTIONS.length,
                answered: Object.keys(allAnswers).length
            }};

            // Store locally
            const key = 'labs_' + PROTOTYPE_ID + '_responses';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push(payload);
            localStorage.setItem(key, JSON.stringify(existing));

            // Show success
            document.getElementById('feedbackForm').style.display = 'none';
            document.getElementById('successMsg').style.display = 'block';
            document.getElementById('responseId').textContent = responseId;

            // Update counter
            document.getElementById('counter').textContent =
                `${{existing.length}} response(s) collected for this prototype`;
        }}

        // Load and show response count
        (function() {{
            const key = 'labs_' + PROTOTYPE_ID + '_responses';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            document.getElementById('counter').textContent =
                `${{existing.length}} response(s) collected for this prototype`;
        }})();

        render();
    </script>
</body>
</html>"""


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()
    parser = argparse.ArgumentParser(description="Labs Page Generator")
    parser.add_argument("--prototype-id", required=True, help="Prototype ID")
    parser.add_argument("--output-dir", type=Path, default=None)
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verbose", "-v", action="store_true")

    args = parser.parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        # Create a minimal test prototype
        proto_path = PROTOTYPES_DIR / "prototype_test_labs_001.html"
        proto_path.parent.mkdir(parents=True, exist_ok=True)
        _safe_write(
            "<html><body><h1>Test Prototype</h1></body></html>",
            proto_path
        )

        # Create meta
        meta_path = PROTOTYPES_DIR / "prototype_test_labs_001_meta.json"
        tmp = meta_path.with_suffix('.tmp')
        tmp.write_text(json.dumps({
            "id": "test_labs_001",
            "idea": "test feature for labs page"
        }, ensure_ascii=False, indent=2), encoding='utf-8')
        tmp.replace(meta_path)

        # Create test questions
        test_path = PROTOTYPES_DIR / "test_labs_001.json"
        tmp2 = test_path.with_suffix('.tmp')
        tmp2.write_text(json.dumps({
            "id": "test_labs_001",
            "prototype_id": "test_labs_001",
            "questions": [
                {"id": "q1", "type": "task", "question": "What does this do?",
                 "input_type": "text", "required": True},
                {"id": "q2", "type": "satisfaction", "question": "Rate it",
                 "input_type": "rating", "min": 1, "max": 10, "required": True},
            ]
        }, ensure_ascii=False, indent=2), encoding='utf-8')
        tmp2.replace(test_path)

        result = generate_labs_page("test_labs_001", output_dir=PROTOTYPES_DIR)

        assert Path(result["labs_file"]).exists(), f"Labs file not found: {result['labs_file']}"

        # Cleanup
        Path(result["labs_file"]).unlink(missing_ok=True)
        proto_path.unlink(missing_ok=True)
        meta_path.unlink(missing_ok=True)
        test_path.unlink(missing_ok=True)

        print(f"\n[TEST PASS] Labs page generated successfully")
        return

    result = generate_labs_page(args.prototype_id, output_dir=args.output_dir)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
