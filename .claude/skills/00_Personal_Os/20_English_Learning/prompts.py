#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""English Learning System — Daily Prompts Generator"""

import json
import random
import sys
import io
from datetime import date
from pathlib import Path

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

WRITING_TOPICS = [
    "Describe your ideal workday",
    "What's a skill you'd love to learn and why?",
    "Write about a place you'd like to visit",
    "Describe a challenge you've overcome",
    "What's your favorite way to spend a weekend?",
    "Write about a book or movie that influenced you",
    "Describe your morning routine",
    "What's a goal you're working towards?",
    "Write about a memorable experience",
    "Describe your perfect workspace",
    "What's something you're curious about?",
    "Write about a lesson you learned recently",
    "Describe your favorite hobby",
    "What's a technology you find fascinating?",
    "Write about a person who inspires you",
    "Describe your hometown",
    "What's a project you're proud of?",
    "Write about a recent discovery",
    "Describe your favorite season",
    "What's a skill you've improved recently?"
]

READING_TOPICS = [
    {
        "title": "The Power of Habit",
        "excerpt": "Habits are neural shortcuts. A habit is a behavior that has been repeated enough times to become automatic. The basal ganglia, a pair of Structures deep within the brain, takes over when a habit emerges.",
        "questions": ["What part of the brain is responsible for habits?", "How does a habit form?"]
    },
    {
        "title": "Remote Work Benefits",
        "excerpt": "Remote work has become increasingly popular. Studies show that remote workers are often more productive, report higher job satisfaction, and have better work-life balance. Companies benefit from reduced overhead costs and access to global talent.",
        "questions": ["What are two benefits of remote work for employees?", "How do companies benefit from remote work?"]
    },
    {
        "title": "The Future of AI",
        "excerpt": "Artificial Intelligence is transforming every industry. From healthcare diagnostics to autonomous vehicles, AI systems are becoming more capable. Experts predict that AI will create new job categories while automating routine tasks.",
        "questions": ["Name two industries transformed by AI.", "What do experts predict about AI and jobs?"]
    },
    {
        "title": "Learning Languages",
        "excerpt": "Learning a new language rewires the brain. Studies show bilingual individuals have better cognitive flexibility, improved memory, and delayed onset of dementia. The best time to learn is childhood, but adults can still achieve fluency with consistent practice.",
        "questions": ["What cognitive benefits does bilingualism provide?", "When is the best time to learn a language?"]
    },
    {
        "title": "Digital Minimalism",
        "excerpt": "Digital minimalism is a philosophy of technology use where you focus your online time on a small number of carefully selected activities. This approach helps reduce anxiety, improve focus, and increase satisfaction with technology.",
        "questions": ["What is digital minimalism?", "What are two benefits of this approach?"]
    }
]

CONVERSATION_SCENARIOS = [
    {
        "scenario": "Job Interview",
        "phrases": [
            "I'm very interested in this position because...",
            "My experience in... has prepared me well",
            "I'd love to tell you about a time when...",
            "What I bring to this role is...",
            "I'm excited about the opportunity to..."
        ]
    },
    {
        "scenario": "Coffee Shop",
        "phrases": [
            "Could I get a... please?",
            "What do you recommend?",
            "I'll have the...",
            "Can I add... to that?",
            "Thank you, that's perfect"
        ]
    },
    {
        "scenario": "Meeting a Colleague",
        "phrases": [
            "Hi, I'm... from the... team",
            "Nice to meet you! I work on...",
            "How long have you been with the company?",
            "What are you working on these days?",
            "Let's grab lunch sometime"
        ]
    },
    {
        "scenario": "Presenting an Idea",
        "phrases": [
            "I'd like to propose...",
            "The key benefit is...",
            "Let me walk you through...",
            "What questions do you have?",
            "I suggest we start with..."
        ]
    },
    {
        "scenario": "Customer Support",
        "phrases": [
            "How can I help you today?",
            "I understand your concern",
            "Let me look into that for you",
            "I'll get back to you within...",
            "Is there anything else I can help with?"
        ]
    }
]

def get_daily_writing_prompt():
    """Get a writing prompt based on today's date."""
    day_of_year = date.today().timetuple().tm_yday
    return WRITING_TOPICS[day_of_year % len(WRITING_TOPICS)]

def get_daily_reading():
    """Get a reading passage based on today's date."""
    day_of_year = date.today().timetuple().tm_yday
    return READING_TOPICS[day_of_year % len(READING_TOPICS)]

def get_daily_scenario():
    """Get a conversation scenario based on today's date."""
    day_of_year = date.today().timetuple().tm_yday
    return CONVERSATION_SCENARIOS[day_of_year % len(CONVERSATION_SCENARIOS)]

def show_daily_session():
    """Show today's full practice session."""
    writing = get_daily_writing_prompt()
    reading = get_daily_reading()
    scenario = get_daily_scenario()
    
    print("🎯 Today's English Practice Session")
    print("=" * 50)
    print()
    
    # Writing Phase
    print("✍️  PHASE 1: Writing (5 min)")
    print("-" * 40)
    print(f"Topic: {writing}")
    print()
    print("Write 2-3 sentences on this topic.")
    print("Focus on: grammar, vocabulary, sentence structure")
    print()
    
    # Reading Phase
    print("📖 PHASE 2: Reading (4 min)")
    print("-" * 40)
    print(f"Title: {reading['title']}")
    print()
    print(reading['excerpt'])
    print()
    print("Questions:")
    for i, q in enumerate(reading['questions'], 1):
        print(f"  {i}. {q}")
    print()
    
    # Speaking Phase
    print("🗣️  PHASE 3: Speaking Prep (3 min)")
    print("-" * 40)
    print(f"Scenario: {scenario['scenario']}")
    print()
    print("Key phrases to practice:")
    for phrase in scenario['phrases']:
        print(f"  • {phrase}")
    print()
    
    print("⏱️  Total time: 12 minutes")
    print("💪 You've got this!")

def show_writing_topics():
    """Show all available writing topics."""
    print("✍️  Writing Topics:")
    print("=" * 40)
    for i, topic in enumerate(WRITING_TOPICS, 1):
        print(f"{i:2d}. {topic}")

def show_reading_passages():
    """Show all available reading passages."""
    print("📖 Reading Passages:")
    print("=" * 40)
    for i, reading in enumerate(READING_TOPICS, 1):
        print(f"{i}. {reading['title']}")
        print(f"   Words: {len(reading['excerpt'].split())}")
        print()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: prompts.py [--daily|--writing|--reading]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "--daily":
        show_daily_session()
    elif cmd == "--writing":
        show_writing_topics()
    elif cmd == "--reading":
        show_reading_passages()
    else:
        print(f"Unknown command: {cmd}")
        print("Usage: prompts.py [--daily|--writing|--reading]")
        sys.exit(1)
