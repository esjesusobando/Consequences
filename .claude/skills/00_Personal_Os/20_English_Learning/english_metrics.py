#!/usr/bin/env python3
"""English Learning System — Metrics & Streak Tracker"""

import json
import os
import sys
from datetime import datetime, date
from pathlib import Path

METRICS_PATH = Path(__file__).parent.parent.parent.parent / "03_Learning" / "04_Telemetry" / "english_metrics.json"

def load_metrics():
    """Load metrics or create default."""
    if METRICS_PATH.exists():
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "words_today": 0,
        "words_total": 0,
        "streak_days": 0,
        "longest_streak": 0,
        "minutes_today": 0,
        "minutes_total": 0,
        "sessions_completed": 0,
        "last_session_date": None,
        "history": []
    }

def save_metrics(metrics):
    """Save metrics to file."""
    METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2, ensure_ascii=False)

def check_streak(metrics):
    """Check if streak is still valid."""
    today = date.today().isoformat()
    last = metrics.get("last_session_date")
    
    if last == today:
        return  # Already practiced today
    
    if last:
        last_date = date.fromisoformat(last)
        days_diff = (date.today() - last_date).days
        if days_diff > 1:
            metrics["streak_days"] = 0  # Streak broken
    else:
        metrics["streak_days"] = 0

def log_session(words_new=0, words_reviewed=0, writing_min=0, reading_min=0):
    """Log a practice session."""
    metrics = load_metrics()
    check_streak(metrics)
    
    today = date.today().isoformat()
    total_min = writing_min + reading_min
    
    metrics["words_today"] = words_new + words_reviewed
    metrics["words_total"] += words_new
    metrics["minutes_today"] = total_min
    metrics["minutes_total"] += total_min
    metrics["sessions_completed"] += 1
    
    # Update streak
    if metrics["last_session_date"] != today:
        metrics["streak_days"] += 1
        metrics["last_session_date"] = today
    
    if metrics["streak_days"] > metrics["longest_streak"]:
        metrics["longest_streak"] = metrics["streak_days"]
    
    # Add to history
    metrics["history"].append({
        "date": today,
        "words_new": words_new,
        "words_reviewed": words_reviewed,
        "writing_min": writing_min,
        "reading_min": reading_min,
        "streak": metrics["streak_days"]
    })
    
    # Keep last 30 days only
    metrics["history"] = metrics["history"][-30:]
    
    save_metrics(metrics)
    
    print(f"✅ Session logged!")
    print(f"   Words: {words_new} new, {words_reviewed} reviewed")
    print(f"   Time: {total_min} min ({writing_min} writing + {reading_min} reading)")
    print(f"   Streak: {metrics['streak_days']} days 🔥")
    print(f"   Total: {metrics['words_total']} words, {metrics['minutes_total']} min")
    
    return metrics

def check_today():
    """Check if today's session is done."""
    metrics = load_metrics()
    today = date.today().isoformat()
    
    if metrics.get("last_session_date") == today:
        print(f"✅ Already practiced today! Streak: {metrics['streak_days']} days 🔥")
        return True
    else:
        print(f"⚠️  No practice today yet. Current streak: {metrics['streak_days']} days")
        print(f"   Run a 15-min session to keep the streak!")
        return False

def show_report():
    """Show metrics report."""
    metrics = load_metrics()
    
    print("📊 English Learning Report")
    print("=" * 40)
    print(f"🔥 Current Streak: {metrics['streak_days']} days")
    print(f"🏆 Longest Streak: {metrics['longest_streak']} days")
    print(f"📝 Total Words: {metrics['words_total']}")
    print(f"⏱️  Total Time: {metrics['minutes_total']} min")
    print(f"🎯 Sessions: {metrics['sessions_completed']}")
    print()
    
    if metrics["history"]:
        print("📅 Recent Sessions:")
        for h in metrics["history"][-7:]:
            print(f"   {h['date']}: {h['words_new']} words, {h['writing_min'] + h['reading_min']} min, streak {h['streak']}")
    print()
    
    # Next milestone
    streak = metrics['streak_days']
    if streak < 7:
        print(f"🎯 Next: {7 - streak} days to reach 1 week!")
    elif streak < 30:
        print(f"🎯 Next: {30 - streak} days to reach 30-day streak!")
    else:
        print("🎉 You've reached 30+ days! Keep compounding!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: english_metrics.py [--check|--log|--report]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "--check":
        check_today()
    elif cmd == "--report":
        show_report()
    elif cmd == "--log":
        import argparse
        parser = argparse.ArgumentParser()
        parser.add_argument("--words-new", type=int, default=0)
        parser.add_argument("--words-reviewed", type=int, default=0)
        parser.add_argument("--writing-min", type=int, default=0)
        parser.add_argument("--reading-min", type=int, default=0)
        parser.add_argument("--streak-day", type=int, default=0)
        args = parser.parse_args(sys.argv[2:])
        log_session(args.words_new, args.words_reviewed, args.writing_min, args.reading_min)
    else:
        print(f"Unknown command: {cmd}")
        print("Usage: english_metrics.py [--check|--log|--report]")
        sys.exit(1)
