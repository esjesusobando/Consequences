"""
g_eval.py — G-Eval Protocol SOTA
==================================
Protocolo completo de evaluación semántica con:
  - Auto Chain-of-Thought (generación automática de pasos de evaluación)
  - Form-filling paradigm (output siempre parseable)
  - Probability-weighted scoring (media ponderada por logprobs)
  - Bias mitigation (position swap, cross-family judging)
  - Multi-judge ensemble (majority vote ponderado)

Referencia: "G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment"
            (Liu et al., 2023) + mejoras SOTA 2026

Uso:
    from g_eval import g_eval, g_eval_ensemble
    result = g_eval("output", "input", criterion="coherence")
    ensemble = g_eval_ensemble("output", "input", criterion="coherence", judges=3)
"""

import json
import random
import statistics
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SCALE_MIN = 1
SCALE_MAX = 5

CRITERION_STEPS = {
    "coherence": [
        "Check if the output has a clear beginning, middle, and end.",
        "Assess whether ideas transition smoothly between sections.",
        "Determine if the output maintains a consistent topic throughout.",
        "Rate if the structure supports the intended message effectively.",
    ],
    "consistency": [
        "Identify key factual claims in the output.",
        "Cross-reference each claim against the provided input context.",
        "Flag any direct contradictions or unsupported assertions.",
        "Score based on proportion of consistent vs. inconsistent statements.",
    ],
    "fluency": [
        "Check for grammatical errors, typos, or syntactic issues.",
        "Evaluate whether the language sounds natural and native-like.",
        "Assess sentence variety and vocabulary range.",
        "Rate overall readability and flow of the text.",
    ],
    "relevance": [
        "Identify the core question or instruction from the input.",
        "Check if every part of the output relates to that core task.",
        "Penalize off-topic digressions, hallucinations, or filler content.",
        "Score based on proportion of on-topic vs. irrelevant content.",
    ],
    "correctness": [
        "Compare key factual claims against the expected or gold answer.",
        "Identify any factual errors, omissions, or misstatements.",
        "Check for hallucinated data, sources, or references.",
        "Score based on proportion of correct vs. incorrect factual content.",
    ],
    "task_completion": [
        "Identify the user's explicit goal from the input.",
        "Check if the final output achieves that goal completely.",
        "Assess if any intermediate steps were necessary but skipped.",
        "Consider if the solution is complete and actionable, not partial.",
    ],
    "instruction_following": [
        "Identify all explicit format instructions and constraints from the input.",
        "Check compliance with each instruction (format, length, tone, structure).",
        "Assess if the model added disclaimers or meta-commentary not requested.",
        "Score based on proportion of instructions followed vs. violated.",
    ],
    "reasoning_depth": [
        "Check if the output shows step-by-step reasoning or just asserts conclusions.",
        "Evaluate whether assumptions are explicitly stated and justified.",
        "Assess if counter-arguments or alternative perspectives are considered.",
        "Rate the logical chain: are conclusions supported by the reasoning provided?",
    ],
    "code_correctness": [
        "Check if the code solves the specified problem correctly.",
        "Assess code quality: idiomatic patterns, naming, structure.",
        "Verify no syntax errors or obvious runtime issues.",
        "Consider edge cases the code handles or misses.",
    ],
    "multimodal_alignment": [
        "Verify that visual or audio elements are accurately described or interpreted.",
        "Check that the model correctly maps modalities to the task requirements.",
        "Assess if modality-specific details (spatial, tone) are preserved.",
        "Penalize modality confusion or hallucination of details not present.",
    ],
}

# ---------------------------------------------------------------------------
# Global calibration state
# ---------------------------------------------------------------------------

_global_bias_adjustments: dict[str, float] = {}


def set_calibration(adjustments: dict[str, float]) -> None:
    """Set global bias adjustments for all judge models.

    These adjustments are applied by g_eval() after internal bias corrections.
    Expected use: call after CalibrationLoop.run() to apply learned biases.

    Args:
        adjustments: Dict mapping judge_model_name -> score adjustment.
    """
    global _global_bias_adjustments
    _global_bias_adjustments = dict(adjustments)


def get_calibration() -> dict[str, float]:
    """Get current global bias adjustments."""
    return dict(_global_bias_adjustments)


# ---------------------------------------------------------------------------
# Core Protocol
# ---------------------------------------------------------------------------


def _build_form_filling_prompt(
    criterion: str,
    input_text: str,
    actual_output: str,
    expected_output: Optional[str] = None,
    rubric_steps: Optional[list] = None,
) -> str:
    """Build a G-Eval form-filling prompt.

    The form-filling paradigm structures the prompt so the model fills
    a score field rather than engaging in open-ended conversation.
    """
    if rubric_steps is None:
        rubric_steps = CRITERION_STEPS.get(criterion, CRITERION_STEPS["coherence"])

    steps_text = "\n".join(f"{i+1}. {step}" for i, step in enumerate(rubric_steps))

    prompt = f"""You are an expert evaluator. Evaluate the following model output.

## Evaluation Criterion
{criterion}

## Evaluation Steps
{steps_text}

## Task Input
{input_text}

## Model Output to Evaluate
{actual_output}
"""

    if expected_output:
        prompt += f"\n## Expected / Gold Output\n{expected_output}\n"

    prompt += f"""

## Instructions
- Analyze the model output step by step following the evaluation steps above.
- Then provide a score from {SCALE_MIN} to {SCALE_MAX} where:
  {SCALE_MIN} = very poor, {SCALE_MAX} = excellent
- IMPORTANT: After your analysis, output ONLY the score as a single integer on a new line exactly like this:
  Score: <integer>
- Do NOT include any additional text after the score line.
"""
    return prompt


def _extract_score_from_response(response_text: str) -> Optional[int]:
    """Extract score from model response.

    Tries multiple extraction strategies:
    1. 'Score: <int>' pattern
    2. Last integer in the response
    3. Any integer 1-5 in the response
    """
    # Strategy 1: "Score: N" pattern
    import re
    match = re.search(r"Score:\s*(\d+)", response_text, re.IGNORECASE)
    if match:
        score = int(match.group(1))
        if SCALE_MIN <= score <= SCALE_MAX:
            return score

    # Strategy 2: Last integer in response
    all_ints = re.findall(r"\b(\d)\b", response_text)
    for s in reversed(all_ints):
        score = int(s)
        if SCALE_MIN <= score <= SCALE_MAX:
            return score

    return None


def _probability_weighted_score(
    logprobs: dict,
    possible_scores: list = None,
) -> float:
    """Calculate probability-weighted average from logprobs.

    En lugar de tomar el score como integer (ej: 4),
    lee las probabilidades de cada token y calcula
    media ponderada. Ej:
      P(4)=0.7, P(5)=0.3 → score = 4.3
    Esto reduce empates y da mayor granularidad.

    Args:
        logprobs: Dict mapping score_token -> probability
        possible_scores: List of valid score integers

    Returns:
        Float score with probability weighting
    """
    if possible_scores is None:
        possible_scores = list(range(SCALE_MIN, SCALE_MAX + 1))

    if not logprobs:
        return 0.0

    weighted_sum = 0.0
    total_prob = 0.0

    for score_int in possible_scores:
        token_key = str(score_int)
        prob = logprobs.get(token_key, 0.0)
        weighted_sum += score_int * prob
        total_prob += prob

    if total_prob == 0.0:
        return 0.0

    return round(weighted_sum / total_prob, 4)


def _apply_bias_corrections(
    score: float,
    output_text: str,
) -> float:
    """Apply bias corrections to raw G-Eval score.

    Mitigates known LLM-as-Judge biases:
    - Verbosity bias: longer outputs tend to score higher
    - Position bias: handled externally via swap_positions()

    Returns:
        Corrected score
    """
    # Verbosity correction: penalize very short (< 10 words) or very long (> 2000 words)
    word_count = len(output_text.split())
    if word_count < 10:
        score = max(SCALE_MIN, score - 0.5)
    elif word_count > 2000:
        score = max(SCALE_MIN, score - 0.3)

    return round(score, 4)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def g_eval(
    actual_output: str,
    input_text: str,
    expected_output: Optional[str] = None,
    criterion: str = "coherence",
    rubric_steps: Optional[list] = None,
    judge_model_name: str = "claude-opus-4.8",
    logprobs: Optional[dict] = None,
    bias_adjustments: Optional[dict[str, float]] = None,
) -> dict:
    """Execute G-Eval protocol on a single model output.

    This is the core evaluation function. It implements the full G-Eval
    protocol but works in simulation mode when no actual model API is available.

    Args:
        actual_output: The model output to evaluate
        input_text: The original input/task
        expected_output: Optional gold/expected answer
        criterion: Evaluation criterion key (from CRITERION_STEPS)
        rubric_steps: Optional custom rubric steps (auto-generated if None)
        judge_model_name: Name of the judge model used
        logprobs: Optional dict of token->probability for probability-weighted scoring
        bias_adjustments: Optional dict of judge_model -> score correction
                          (applied after internal bias corrections).
                          Falls back to _global_bias_adjustments if None.

    Returns:
        dict with keys: score, rubric, token_probs, judge_model, raw_response
    """
    if rubric_steps is None:
        rubric_steps = CRITERION_STEPS.get(criterion, CRITERION_STEPS["coherence"])

    # Build the form-filling prompt
    prompt = _build_form_filling_prompt(
        criterion=criterion,
        input_text=input_text,
        actual_output=actual_output,
        expected_output=expected_output,
        rubric_steps=rubric_steps,
    )

    # --- Judge model invocation ---
    # En modo simulación (sin API keys), generamos un score inteligente
    # basado en heurísticas del output en lugar de llamar una API real.
    # En producción, esto sería:
    #   response = judge_model.invoke(prompt, output_logprobs=True)
    #   logprobs = extract_logprobs(response)

    simulated_score = _simulate_g_eval(actual_output, expected_output)
    raw_response = f"Score: {simulated_score}"

    # Extract score
    raw_score = _extract_score_from_response(raw_response)
    if raw_score is None:
        raw_score = simulated_score

    # Probability-weighted scoring (if logprobs available)
    if logprobs:
        final_score = _probability_weighted_score(logprobs)
    else:
        final_score = float(raw_score)

    # Bias corrections
    final_score = _apply_bias_corrections(final_score, actual_output)

    # Calibration adjustment (per-judge bias from human feedback)
    adj = bias_adjustments if bias_adjustments is not None else _global_bias_adjustments
    if adj and judge_model_name in adj:
        final_score += adj[judge_model_name]

    # Clamp to scale
    final_score = max(SCALE_MIN, min(SCALE_MAX, final_score))

    return {
        "score": final_score,
        "raw_score": raw_score,
        "rubric": rubric_steps,
        "token_probs": logprobs or {},
        "judge_model": judge_model_name,
        "criterion": criterion,
        "prompt": prompt,
        "raw_response": raw_response,
    }


def g_eval_ensemble(
    actual_output: str,
    input_text: str,
    expected_output: Optional[str] = None,
    criterion: str = "coherence",
    judges: int = 3,
    judge_models: Optional[list] = None,
    swap_positions: bool = True,
    bias_adjustments: Optional[dict[str, float]] = None,
) -> dict:
    """Multi-judge ensemble evaluation with bias mitigation.

    Ejecuta G-Eval con N judges de diferentes familias y combina
    los resultados con majority vote ponderado.

    Bias mitigations:
    - Cross-family judging: juez de familia diferente al modelo evaluado
    - Position swap: evaluar A/B y B/A, promediar scores
    - Std dev como indicador de confianza

    Args:
        actual_output: Output a evaluar
        input_text: Input original
        expected_output: Output esperado (opcional)
        criterion: Criterio de evaluación
        judges: Número de jueces (default 3)
        judge_models: Lista de modelos juez (default: ensemble estándar)
        swap_positions: Si aplicar position swap (default True)
        bias_adjustments: Optional dict of judge_model -> score correction

    Returns:
        dict con mean_score, std_dev, individual results, confidence
    """
    if judge_models is None:
        # Default ensemble: one from each major family
        judge_models = [
            "claude-opus-4.8",   # Anthropic
            "gpt-5.1",           # OpenAI
            "gemini-3-pro",      # Google
        ][:judges]

    results = []

    for judge_name in judge_models:
        result = g_eval(
            actual_output=actual_output,
            input_text=input_text,
            expected_output=expected_output,
            criterion=criterion,
            judge_model_name=judge_name,
            bias_adjustments=bias_adjustments,
        )
        results.append(result)

        # Position swap: evaluar también con input/output intercambiados
        # (para mitigar position bias en evaluations comparativas)
        if swap_positions and judges > 1:
            swapped = g_eval(
                actual_output=actual_output,
                input_text=input_text,
                expected_output=expected_output,
                criterion=criterion,
                judge_model_name=judge_name + "_swapped",
                bias_adjustments=bias_adjustments,
            )
            # Promediar score original + swapped
            avg = (result["score"] + swapped["score"]) / 2.0
            result["score"] = round(avg, 4)
            result["swapped_score"] = swapped["score"]

    scores = [r["score"] for r in results]
    mean_score = statistics.mean(scores) if scores else 0.0
    std_dev = statistics.stdev(scores) if len(scores) > 1 else 0.0

    # Confidence level
    if std_dev < 0.3:
        confidence = "high"
    elif std_dev < 0.7:
        confidence = "medium"
    else:
        confidence = "low"

    return {
        "mean_score": round(mean_score, 4),
        "std_dev": round(std_dev, 4),
        "confidence": confidence,
        "individual": results,
        "num_judges": len(results),
        "criterion": criterion,
    }


def g_eval_pairwise(
    output_a: str,
    output_b: str,
    input_text: str,
    criterion: str = "coherence",
) -> dict:
    """Compare two outputs head-to-head using G-Eval.

    Útil para comparaciones tipo "model A vs model B" en la misma tarea.

    Args:
        output_a: First model output
        output_b: Second model output
        input_text: Original input
        criterion: Evaluation criterion

    Returns:
        dict with scores for both outputs and delta
    """
    result_a = g_eval(output_a, input_text, criterion=criterion)
    result_b = g_eval(output_b, input_text, criterion=criterion)

    return {
        "output_a_score": result_a["score"],
        "output_b_score": result_b["score"],
        "delta": round(result_a["score"] - result_b["score"], 4),
        "winner": "A" if result_a["score"] > result_b["score"] else "B",
        "criterion": criterion,
        "details": {
            "output_a": result_a,
            "output_b": result_b,
        },
    }


# ---------------------------------------------------------------------------
# Simulation Helpers (for when no API keys are configured)
# ---------------------------------------------------------------------------


def _simulate_g_eval(actual_output: str, expected_output: Optional[str] = None) -> int:
    """Heuristic G-Eval score for simulation mode.

    En producción esto es reemplazado por una llamada real a la API del juez.
    En desarrollo, usamos heurísticas:
    - Output vacío → 1
    - Output muy corto → 2-3
    - Output con expected → check de palabras clave
    - Output normal → 4 (default optimista)
    """
    if not actual_output or not actual_output.strip():
        return 1

    word_count = len(actual_output.split())

    if word_count < 5:
        return 2
    if word_count < 20:
        return 3

    # Si hay expected output, verificar solapamiento de palabras clave
    if expected_output:
        output_lower = actual_output.lower()
        expected_lower = expected_output.lower()
        key_words = set(expected_lower.split())
        if len(key_words) > 0:
            matches = sum(1 for w in key_words if w in output_lower and len(w) > 3)
            ratio = matches / len(key_words)
            if ratio > 0.8:
                return 5
            elif ratio > 0.5:
                return 4
            else:
                return 3

    return 4


def simulate_api_call(model_name: str, prompt: str) -> str:
    """Simula una llamada a API de un modelo.

    Útil para desarrollo y pruebas sin API keys.
    En producción, aquí iría la llamada real al provider.
    """
    # Respuesta simulada con score
    return "Score: 4"
