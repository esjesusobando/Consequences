#!/usr/bin/env python3
"""English Learning System — Vocabulary Spaced Repetition"""

import json
import os
import sys
from datetime import datetime, date, timedelta
from pathlib import Path
import random

DECK_PATH = Path(__file__).parent / "vocabulary_deck.json"

def load_deck():
    """Load vocabulary deck or create default."""
    if DECK_PATH.exists():
        with open(DECK_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"words": [], "stats": {"total": 0, "mastered": 0}}

def save_deck(deck):
    """Save deck to file."""
    with open(DECK_PATH, "w", encoding="utf-8") as f:
        json.dump(deck, f, indent=2, ensure_ascii=False)

def add_word(word, definition, example, category="general"):
    """Add a new word to the deck."""
    deck = load_deck()
    
    # Check if word already exists
    for w in deck["words"]:
        if w["word"].lower() == word.lower():
            print(f"⚠️  Word '{word}' already exists in deck.")
            return
    
    new_word = {
        "word": word,
        "definition": definition,
        "example": example,
        "category": category,
        "added_date": date.today().isoformat(),
        "next_review": date.today().isoformat(),
        "interval_days": 1,
        "ease_factor": 2.5,
        "review_count": 0,
        "correct_count": 0,
        "status": "new"  # new, learning, review, mastered
    }
    
    deck["words"].append(new_word)
    deck["stats"]["total"] = len(deck["words"])
    save_deck(deck)
    
    print(f"✅ Added: {word}")
    print(f"   Definition: {definition}")
    print(f"   Example: {example}")

def get_due_words(count=5):
    """Get words due for review."""
    deck = load_deck()
    today = date.today().isoformat()
    
    due = [w for w in deck["words"] if w["next_review"] <= today]
    
    # Sort by priority: new first, then by next review
    due.sort(key=lambda w: (0 if w["status"] == "new" else 1, w["next_review"]))
    
    return due[:count]

def review_word(word, correct=True):
    """Update word after review using SM-2 algorithm."""
    deck = load_deck()
    
    for w in deck["words"]:
        if w["word"].lower() == word.lower():
            w["review_count"] += 1
            
            if correct:
                w["correct_count"] += 1
                if w["interval_days"] == 1:
                    w["interval_days"] = 3
                else:
                    w["interval_days"] = int(w["interval_days"] * w["ease_factor"])
                w["ease_factor"] = min(3.0, w["ease_factor"] + 0.1)
            else:
                w["interval_days"] = 1
                w["ease_factor"] = max(1.3, w["ease_factor"] - 0.2)
            
            # Update next review
            next_date = date.today() + timedelta(days=w["interval_days"])
            w["next_review"] = next_date.isoformat()
            
            # Update status
            if w["review_count"] >= 5 and w["correct_count"] / w["review_count"] >= 0.8:
                w["status"] = "mastered"
            elif w["review_count"] >= 2:
                w["status"] = "review"
            else:
                w["status"] = "learning"
            
            save_deck(deck)
            print(f"✅ Updated: {word}")
            print(f"   Next review: {w['next_review']} ({w['interval_days']} days)")
            return
    
    print(f"❌ Word '{word}' not found in deck.")

def show_due():
    """Show words due for review."""
    due = get_due_words(10)
    
    if not due:
        print("✅ No words due for review! Great job!")
        return
    
    print(f"📝 Words due for review ({len(due)}):")
    print("=" * 50)
    
    for i, w in enumerate(due, 1):
        print(f"{i}. {w['word']}")
        print(f"   Definition: {w['definition']}")
        print(f"   Example: {w['example']}")
        print(f"   Status: {w['status']} | Reviews: {w['review_count']}")
        print()

def show_stats():
    """Show deck statistics."""
    deck = load_deck()
    
    stats = deck["stats"]
    statuses = {}
    for w in deck["words"]:
        s = w["status"]
        statuses[s] = statuses.get(s, 0) + 1
    
    print("📊 Vocabulary Deck Stats")
    print("=" * 40)
    print(f"Total Words: {stats['total']}")
    print(f"Mastered: {statuses.get('mastered', 0)}")
    print(f"Review: {statuses.get('review', 0)}")
    print(f"Learning: {statuses.get('learning', 0)}")
    print(f"New: {statuses.get('new', 0)}")
    
    # Show categories
    categories = {}
    for w in deck["words"]:
        c = w.get("category", "general")
        categories[c] = categories.get(c, 0) + 1
    
    print()
    print("Categories:")
    for c, count in sorted(categories.items()):
        print(f"  {c}: {count}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: vocabulary.py [--add|--due|--review|--stats]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "--add":
        if len(sys.argv) < 5:
            print("Usage: vocabulary.py --add <word> <definition> <example> [category]")
            sys.exit(1)
        word = sys.argv[2]
        definition = sys.argv[3]
        example = sys.argv[4]
        category = sys.argv[5] if len(sys.argv) > 5 else "general"
        add_word(word, definition, example, category)
    
    elif cmd == "--due":
        show_due()
    
    elif cmd == "--review":
        if len(sys.argv) < 4:
            print("Usage: vocabulary.py --review <word> <correct:true|false>")
            sys.exit(1)
        word = sys.argv[2]
        correct = sys.argv[3].lower() == "true"
        review_word(word, correct)
    
    elif cmd == "--stats":
        show_stats()
    
    else:
        print(f"Unknown command: {cmd}")
        print("Usage: vocabulary.py [--add|--due|--review|--stats]")
        sys.exit(1)
