#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
usability_test_generator.py — Usability Test Generator
======================================================
Generates structured usability tests from prototypes:
- 5-8 questions (task-based + satisfaction)
- Interactive HTML test page
- NPS-style satisfaction scoring
- Open-ended feedback fields

CLI:
    python usability_test_generator.py --prototype-id "proto_xxx"
    python usability_test_generator.py --test

Output: test_{id}.html in .cache/prototypes/
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


def _gen_id(prefix: str = "test") -> str:
    import random, string
    date_str = datetime.now().strftime("%Y%m%d")
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{prefix}_{date_str}_{rand}"


def _safe_write(content: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(content, encoding='utf-8')
    tmp.replace(path)


# =============================================================================
# QUESTION GENERATION
# =============================================================================

def _generate_questions(prototype_id: str, hypothesis: dict = None) -> list:
    """Generate usability test questions based on prototype context."""
    idea = "this feature" if not hypothesis else hypothesis.get("idea", "this feature")

    questions = [
        {
            "id": "q1",
            "type": "task",
            "question": f"Look at this prototype. What do you think this product does?",
            "input_type": "text",
            "required": True,
            "scoring": "clarity — does their answer match the intended purpose?"
        },
        {
            "id": "q2",
            "type": "task",
            "question": f"Try to complete the main action on this page. Were you able to do it?",
            "input_type": "multiple_choice",
            "options": [
                "Yes, completed successfully",
                "Partially — got stuck but figured it out",
                "Partially — got stuck and gave up",
                "No, couldn't figure it out"
            ],
            "required": True,
            "scoring": "task_completion"
        },
        {
            "id": "q3",
            "type": "task",
            "question": "How long did it take you to find and click the main button/action?",
            "input_type": "multiple_choice",
            "options": [
                "Less than 5 seconds",
                "5-15 seconds",
                "15-30 seconds",
                "More than 30 seconds",
                "I couldn't find it"
            ],
            "required": True,
            "scoring": "time_to_complete"
        },
        {
            "id": "q4",
            "type": "satisfaction",
            "question": "How would you rate the overall visual design?",
            "input_type": "rating",
            "min": 1,
            "max": 10,
            "labels": {1: "Terrible", 5: "Average", 10: "Amazing"},
            "required": True,
            "scoring": "design_satisfaction"
        },
        {
            "id": "q5",
            "type": "satisfaction",
            "question": "How likely are you to use this product?",
            "input_type": "nps",
            "min": 0,
            "max": 10,
            "labels": {0: "Not at all likely", 5: "Neutral", 10: "Extremely likely"},
            "required": True,
            "scoring": "nps"
        },
        {
            "id": "q6",
            "type": "usability",
            "question": "Was there anything confusing about the interface?",
            "input_type": "text",
            "required": False,
            "scoring": "usability_issues"
        },
        {
            "id": "q7",
            "type": "feature",
            "question": "What feature would you add or change to make this better?",
            "input_type": "text",
            "required": False,
            "scoring": "feature_requests"
        },
        {
            "id": "q8",
            "type": "open",
            "question": "Any other thoughts, feelings, or suggestions?",
            "input_type": "text",
            "required": False,
            "scoring": "general_feedback"
        },
    ]

    return questions


# =============================================================================
# HTML TEST GENERATION
# =============================================================================

def _build_test_html(test_id: str, prototype_id: str, questions: list,
                     hypothesis: dict = None) -> str:
    """Build an interactive HTML test page."""
    idea = "Prototype" if not hypothesis else hypothesis.get("idea", "Prototype")
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    questions_json = json.dumps(questions, ensure_ascii=False)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usability Test: {idea.title()}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #F8F9FA; color: #212529; line-height: 1.6;
        }}
        .container {{ max-width: 700px; margin: 0 auto; padding: 24px; }}
        .header {{
            text-align: center; padding: 32px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; margin-bottom: 32px;
        }}
        .header h1 {{ font-size: 24px; margin-bottom: 8px; }}
        .header p {{ opacity: 0.9; font-size: 14px; }}
        .progress {{
            background: #DEE2E6; border-radius: 20px; height: 6px;
            margin-bottom: 24px; overflow: hidden;
        }}
        .progress-bar {{
            background: #667eea; height: 100%; transition: width 0.3s;
            border-radius: 20px;
        }}
        .question-card {{
            background: white; border-radius: 12px; padding: 24px;
            margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            border: 2px solid transparent;
            transition: border-color 0.2s;
        }}
        .question-card.active {{ border-color: #667eea; }}
        .question-card.completed {{ border-color: #28a745; }}
        .question-number {{
            font-size: 12px; font-weight: 700; color: #667eea;
            text-transform: uppercase; letter-spacing: 1px;
            margin-bottom: 8px;
        }}
        .question-text {{ font-size: 16px; font-weight: 600; margin-bottom: 16px; }}
        .question-type {{
            font-size: 12px; color: #6C757D; margin-bottom: 12px;
        }}
        .options {{ display: flex; flex-direction: column; gap: 8px; }}
        .option {{
            display: flex; align-items: center; gap: 12px;
            padding: 12px 16px; border: 1px solid #DEE2E6;
            border-radius: 8px; cursor: pointer; transition: all 0.2s;
        }}
        .option:hover {{ background: #F1F3F5; }}
        .option.selected {{ background: #667eea10; border-color: #667eea; }}
        .option input[type="radio"] {{ accent-color: #667eea; }}
        textarea {{
            width: 100%; min-height: 80px; padding: 12px;
            border: 1px solid #DEE2E6; border-radius: 8px;
            font-family: inherit; font-size: 14px; resize: vertical;
        }}
        textarea:focus {{ outline: none; border-color: #667eea; }}
        .rating {{
            display: flex; gap: 4px; flex-wrap: wrap;
        }}
        .rating-btn {{
            width: 40px; height: 40px; border-radius: 8px;
            border: 2px solid #DEE2E6; background: white;
            font-weight: 700; cursor: pointer; transition: all 0.2s;
            font-size: 14px;
        }}
        .rating-btn:hover {{ border-color: #667eea; background: #667eea10; }}
        .rating-btn.selected {{ background: #667eea; color: white; border-color: #667eea; }}
        .rating-labels {{
            display: flex; justify-content: space-between;
            font-size: 12px; color: #6C757D; margin-top: 4px;
        }}
        .btn {{
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 24px; border-radius: 8px; font-size: 14px;
            font-weight: 600; border: none; cursor: pointer;
            transition: all 0.2s;
        }}
        .btn-primary {{ background: #667eea; color: white; }}
        .btn-primary:hover {{ background: #5a6fd6; }}
        .btn-submit {{ background: #28a745; color: white; font-size: 16px; padding: 16px 48px; }}
        .btn-submit:hover {{ background: #218838; }}
        .submit-section {{ text-align: center; padding: 32px 0; }}
        .success-message {{
            display: none; text-align: center; padding: 48px;
            background: white; border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }}
        .success-message h2 {{ color: #28a745; margin-bottom: 12px; }}
        @media (max-width: 600px) {{
            .container {{ padding: 16px; }}
            .rating-btn {{ width: 32px; height: 32px; font-size: 12px; }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Usability Test: {idea.title()}</h1>
        <p>Prototype ID: {prototype_id} | Date: {now_str}</p>
        <p style="margin-top: 8px; opacity: 0.8;">Answer honestly — there are no right or wrong answers!</p>
    </div>

    <div class="container">
        <div class="progress">
            <div class="progress-bar" id="progressBar" style="width: 0%"></div>
        </div>

        <div id="questionsContainer"></div>

        <div class="submit-section" id="submitSection" style="display: none;">
            <button class="btn btn-submit" onclick="submitTest()">
                Submit Feedback
            </button>
        </div>

        <div class="success-message" id="successMessage">
            <h2>&#10003; Thank You!</h2>
            <p>Your feedback has been recorded. It helps us build better products.</p>
            <p style="margin-top: 16px; color: #6C757D;">Test ID: {test_id}</p>
        </div>
    </div>

    <script>
        const QUESTIONS = {questions_json};
        const TEST_ID = "{test_id}";
        const PROTOTYPE_ID = "{prototype_id}";
        let answers = {{}};
        let answeredCount = 0;

        function renderQuestions() {{
            const container = document.getElementById('questionsContainer');
            container.innerHTML = '';

            QUESTIONS.forEach((q, i) => {{
                const card = document.createElement('div');
                card.className = 'question-card';
                card.id = 'card-' + q.id;

                let inputHtml = '';
                if (q.input_type === 'multiple_choice') {{
                    inputHtml = '<div class="options">' +
                        q.options.map(opt =>
                            `<div class="option" onclick="selectOption('${{q.id}}', '${{opt.replace(/'/g, "\\'")}}', this)">
                                <input type="radio" name="${{q.id}}" value="${{opt}}">
                                <span>${{opt}}</span>
                            </div>`
                        ).join('') + '</div>';
                }} else if (q.input_type === 'text') {{
                    inputHtml = `<textarea id="input-${{q.id}}" placeholder="Type your answer..."
                        oninput="updateText('${{q.id}}', this.value)"></textarea>`;
                }} else if (q.input_type === 'rating' || q.input_type === 'nps') {{
                    const min = q.min || 1;
                    const max = q.max || 10;
                    let btns = '';
                    for (let v = min; v <= max; v++) {{
                        btns += `<button class="rating-btn" onclick="selectRating('${{q.id}}', ${{v}}, this)">${{v}}</button>`;
                    }}
                    inputHtml = `<div class="rating">${{btns}}</div>
                        <div class="rating-labels">
                            <span>${{q.labels[min] || min}}</span>
                            <span>${{q.labels[max] || max}}</span>
                        </div>`;
                }}

                card.innerHTML = `
                    <div class="question-number">Question ${{i + 1}} of ${{QUESTIONS.length}}</div>
                    <div class="question-type">${{q.type}} | ${{q.required ? 'Required' : 'Optional'}}</div>
                    <div class="question-text">${{q.question}}</div>
                    ${{inputHtml}}
                `;
                container.appendChild(card);
            }});

            updateProgress();
        }}

        function selectOption(qId, value, el) {{
            el.closest('.options').querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');
            el.querySelector('input').checked = true;
            markAnswered(qId, value);
        }}

        function selectRating(qId, value, el) {{
            el.closest('.rating').querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
            markAnswered(qId, value);
        }}

        function updateText(qId, value) {{
            if (value.trim().length > 0) {{
                markAnswered(qId, value);
            }}
        }}

        function markAnswered(qId, value) {{
            if (!answers[qId]) answeredCount++;
            answers[qId] = value;
            document.getElementById('card-' + qId).classList.add('completed');
            updateProgress();
        }}

        function updateProgress() {{
            const pct = Math.round((answeredCount / QUESTIONS.length) * 100);
            document.getElementById('progressBar').style.width = pct + '%';
            if (answeredCount >= QUESTIONS.filter(q => q.required).length) {{
                document.getElementById('submitSection').style.display = 'block';
            }}
        }}

        function submitTest() {{
            const payload = {{
                test_id: TEST_ID,
                prototype_id: PROTOTYPE_ID,
                answers: answers,
                completed_at: new Date().toISOString(),
                total_questions: QUESTIONS.length,
                answered: answeredCount
            }};

            // Store in localStorage
            localStorage.setItem('test_' + TEST_ID, JSON.stringify(payload));

            // Also try to POST to a local server if available
            fetch('/api/feedback', {{
                method: 'POST',
                headers: {{ 'Content-Type': 'application/json' }},
                body: JSON.stringify(payload)
            }}).catch(() => {{ /* Server not available — localStorage is fine */ }});

            // Show success
            document.getElementById('questionsContainer').style.display = 'none';
            document.getElementById('submitSection').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('progressBar').style.width = '100%';
        }}

        renderQuestions();
    </script>
</body>
</html>"""


# =============================================================================
# PUBLIC API
# =============================================================================

def generate_usability_test(prototype_id: str, prototype_file: str = None,
                            hypothesis: dict = None,
                            output_dir: Path = None) -> dict:
    """
    Generate a usability test from a prototype.

    Args:
        prototype_id: ID of the prototype to test
        prototype_file: Path to the HTML prototype (optional)
        hypothesis: Hypothesis dict for context (optional)
        output_dir: Where to save

    Returns:
        dict with test ID, questions, and file path
    """
    out = output_dir or PROTOTYPES_DIR
    test_id = _gen_id("test")
    now = datetime.now(timezone.utc).isoformat()

    # Generate questions
    questions = _generate_questions(prototype_id, hypothesis=hypothesis)

    # Build HTML
    html = _build_test_html(test_id, prototype_id, questions, hypothesis=hypothesis)

    # Save HTML
    filepath = out / f"test_{test_id}.html"
    _safe_write(html, filepath)

    # Save questions JSON
    questions_data = {
        "id": test_id,
        "created_at": now,
        "prototype_id": prototype_id,
        "prototype_file": prototype_file,
        "questions": questions,
        "test_file": str(filepath),
        "total_questions": len(questions),
        "required_questions": sum(1 for q in questions if q.get("required")),
    }
    meta_path = out / f"test_{test_id}.json"
    tmp = meta_path.with_suffix('.tmp')
    tmp.write_text(json.dumps(questions_data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(meta_path)

    logger.info(f"Usability test generated: {test_id}")
    logger.info(f"  Questions: {len(questions)} ({questions_data['required_questions']} required)")
    logger.info(f"  Saved: {filepath}")

    return questions_data


# =============================================================================
# CLI
# =============================================================================

def main():
    _fix_encoding()
    parser = argparse.ArgumentParser(description="Usability Test Generator")
    parser.add_argument("--prototype-id", required=True, help="Prototype ID to test")
    parser.add_argument("--prototype-file", help="Path to prototype HTML")
    parser.add_argument("--output-dir", type=Path, default=None)
    parser.add_argument("--test", action="store_true", help="Run self-test")
    parser.add_argument("--verbose", "-v", action="store_true")

    args = parser.parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.test:
        # Generate test prototype inline
        from hypothesis_generator import generate_hypothesis
        from prototype_builder import build_prototype
        hyp = generate_hypothesis("test feature", output_dir=PROTOTYPES_DIR)
        proto = build_prototype(hyp, output_dir=PROTOTYPES_DIR)
        result = generate_usability_test(proto['id'], str(PROTOTYPES_DIR / f"prototype_{proto['id']}.html"),
                                          hypothesis=hyp, output_dir=PROTOTYPES_DIR)
        f = Path(result["test_file"])
        assert f.exists(), f"File not found: {f}"
        assert result["total_questions"] >= 5, f"Too few questions: {result['total_questions']}"
        print(f"\n[TEST PASS] Usability test generated: {result['test_file']}")
        print(f"  Questions: {result['total_questions']}")
        return

    result = generate_usability_test(args.prototype_id,
                                      prototype_file=args.prototype_file,
                                      output_dir=args.output_dir)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
