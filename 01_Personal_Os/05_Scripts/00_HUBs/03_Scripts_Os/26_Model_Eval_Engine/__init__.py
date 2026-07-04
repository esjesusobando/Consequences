"""
26_Model_Eval_Engine — SOTA Model Evaluation Engine for PersonalOS v5.0
=======================================================================
Core modules:
  - g_eval.py            : G-Eval protocol (CoT + form-filling + probability-weighted scoring)
  - quality_runner.py    : Benchmark execution against gold standards
  - speed_profiler.py    : TTFT, tok/s, latency percentiles
  - cost_analyzer.py     : Pricing engine per provider
  - token_counter.py     : API + local tokenizer wrappers
  - run_history.py       : Persistent JSON store for eval run records
  - drift_detector.py    : Statistical process control drift detection (SPC)
  - pareto_frontier.py   : Pareto frontier computation for quality vs. cost tradeoff
  - calibration_loop.py  : Judge bias calibration using historical feedback

Usage:
    from engine import g_eval, quality_runner
    result = g_eval.run(candidate_output, input_text, criterion="coherence")
"""

__version__ = "2.0.0"
