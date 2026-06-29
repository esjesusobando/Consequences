#!/usr/bin/env python3
"""
Backlog Processor — Enhanced with MCP Server Intelligence

Full-featured backlog processing with:
- Intelligent dedup (SequenceMatcher similarity scoring)
- Ambiguity detection (regex patterns)
- Clarification question generation
- Rich task content generation by category
- YAML frontmatter creation
- Goal alignment
- Backlog clearing

Based on: personal-os-main/core/mcp/server.py (original MCP server)
Enhanced for: Think Different PersonalOS v4.9.1

Usage:
    python backlog-triage.py                           # Analyze backlog
    python backlog-triage.py --create-tasks            # Create task files
    python backlog-triage.py --dedup                   # Check for duplicates
    python backlog-triage.py --auto-create             # Auto-create non-duplicate tasks
    python backlog-triage.py --clear                   # Clear backlog after processing
    python backlog-triage.py --full-process            # Full pipeline: analyze + create + clear
"""

import argparse
import json
import re
import sys
from pathlib import Path
from datetime import datetime, timedelta
from difflib import SequenceMatcher
from collections import Counter
from typing import List, Dict, Any, Optional

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ─── Configuration ───────────────────────────────────────────────────────────

DEDUP_CONFIG = {
    "similarity_threshold": 0.6,
    "check_categories": True,
}

CATEGORIES = [
    "technical", "outreach", "research", "writing",
    "content", "admin", "personal", "marketing", "other"
]

PRIORITY_KEYWORDS = {
    "P0": ["urgent", "asap", "critical", "blocked", "production down", "security"],
    "P1": ["important", "priority", "this week", "tomorrow", "deadline"],
    "P2": ["plan", "roadmap", "strategy", "improve", "optimize"],
    "P3": ["someday", "maybe", "idea", "explore", "research"],
}

# ─── Path Resolution ─────────────────────────────────────────────────────────

def get_project_root() -> Path:
    """Find project root (Think_Different/)"""
    current = Path.cwd()
    for parent in [current] + list(current.parents):
        if (parent / "00_Winter_is_Coming").exists():
            return parent
    return current


def get_backlog_path(root: Path) -> Path:
    """Find BACKLOG.md"""
    candidates = [
        root / "00_Winter_is_Coming" / "BACKLOG.md",
        root / "BACKLOG.md",
    ]
    for c in candidates:
        if c.exists():
            return c
    raise FileNotFoundError("BACKLOG.md not found")


def get_tasks_dir(root: Path) -> Path:
    """Find Tasks directory"""
    candidates = [
        root / "01_Personal_Os" / "04_Tasks",
        root / "Tasks",
    ]
    for c in candidates:
        if c.exists():
            return c
    raise FileNotFoundError("Tasks directory not found")


def get_goals_path(root: Path) -> Path:
    """Find GOALS.md"""
    candidates = [
        root / "00_Winter_is_Coming" / "GOALS.md",
        root / "GOALS.md",
    ]
    for c in candidates:
        if c.exists():
            return c
    return None

# ─── YAML Helpers ────────────────────────────────────────────────────────────

def parse_yaml_frontmatter(content: str) -> tuple:
    """Parse YAML frontmatter from markdown content"""
    if not content.startswith("---"):
        return {}, content

    try:
        parts = content.split("---", 2)[1:]
        if len(parts) >= 1:
            # Simple YAML parser (no dependency)
            metadata = {}
            for line in parts[0].strip().split("\n"):
                if ":" in line:
                    key, _, value = line.partition(":")
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    if value.lower() == "true":
                        value = True
                    elif value.lower() == "false":
                        value = False
                    elif value.isdigit():
                        value = int(value)
                    metadata[key] = value
            body = parts[1] if len(parts) > 1 else ""
            return metadata, body
    except Exception:
        pass
    return {}, content


def get_all_tasks(tasks_dir: Path) -> List[Dict[str, Any]]:
    """Get all tasks from the Tasks directory"""
    tasks = []
    if not tasks_dir.exists():
        return tasks

    for task_file in tasks_dir.glob("*.md"):
        try:
            content = task_file.read_text(encoding="utf-8")
            metadata, body = parse_yaml_frontmatter(content)
            if metadata:
                metadata["filename"] = task_file.name
                metadata["body_content"] = body[:500] if body else ""
                tasks.append(metadata)
        except Exception:
            pass

    return tasks

# ─── Intelligence Layer ──────────────────────────────────────────────────────

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two strings (0-1 score)"""
    return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()


def extract_keywords(text: str) -> set:
    """Extract meaningful keywords from text"""
    stop_words = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
        "for", "with", "from", "up", "out", "is", "it", "my", "we",
        "our", "this", "that", "need", "should", "would", "could"
    }
    words = re.findall(r"\b\w+\b", text.lower())
    return {w for w in words if w not in stop_words and len(w) > 3}


def find_similar_tasks(item: str, existing_tasks: List[Dict]) -> List[Dict]:
    """Find tasks similar to the given item"""
    similar = []
    item_keywords = extract_keywords(item)

    for task in existing_tasks:
        if task.get("status") == "d":
            continue

        title = task.get("title", "")
        title_similarity = calculate_similarity(item, title)

        task_keywords = extract_keywords(title)
        if item_keywords and task_keywords:
            keyword_overlap = len(item_keywords & task_keywords) / len(item_keywords | task_keywords)
        else:
            keyword_overlap = 0

        similarity_score = (title_similarity * 0.7) + (keyword_overlap * 0.3)

        if similarity_score >= DEDUP_CONFIG["similarity_threshold"]:
            similar.append({
                "title": title,
                "filename": task.get("filename", ""),
                "category": task.get("category", ""),
                "status": task.get("status", ""),
                "similarity_score": round(similarity_score, 2),
            })

    similar.sort(key=lambda x: x["similarity_score"], reverse=True)
    return similar[:3]


def is_ambiguous(item: str) -> bool:
    """Check if an item is too vague or ambiguous"""
    vague_patterns = [
        r"^(fix|update|improve|check|review|look at|work on)\s+(the|a|an)?\s*\w+$",
        r"^\w+\s+(stuff|thing|issue|problem)$",
        r"^(follow up|reach out|contact|email)$",
        r"^(investigate|research|explore)\s*\w{0,20}$",
    ]

    item_lower = item.lower().strip()

    if len(item_lower.split()) <= 2:
        return True

    for pattern in vague_patterns:
        if re.match(pattern, item_lower):
            return True

    return False


def generate_clarification_questions(item: str) -> List[str]:
    """Generate clarification questions for ambiguous items"""
    questions = []
    item_lower = item.lower()

    if any(w in item_lower for w in ["fix", "bug", "error", "issue"]):
        questions.append("Which specific bug or error? Can you provide more details?")
        questions.append("What component or feature is affected?")

    if any(w in item_lower for w in ["update", "improve", "refactor"]):
        questions.append("What specific aspects need updating/improvement?")
        questions.append("What's the success criteria?")

    if any(w in item_lower for w in ["email", "contact", "reach out", "follow up"]):
        questions.append("Who should be contacted?")
        questions.append("What's the purpose of this outreach?")

    if any(w in item_lower for w in ["research", "investigate", "explore"]):
        questions.append("What specific questions need to be answered?")
        questions.append("What decisions will this inform?")

    if not questions:
        questions.append("Can you provide more specific details?")
        questions.append("What's the expected outcome or deliverable?")

    return questions

# ─── Category & Priority ─────────────────────────────────────────────────────

def guess_category(item: str) -> str:
    """Guess category based on item text"""
    text = item.lower()

    category_keywords = {
        "outreach": ["email", "contact", "reach out", "follow up", "meeting", "call", "1:1"],
        "technical": ["code", "api", "database", "deploy", "fix", "bug", "implement", "build"],
        "research": ["research", "study", "learn", "understand", "investigate", "analyze"],
        "writing": ["write", "draft", "document", "blog", "article", "proposal"],
        "admin": ["expense", "invoice", "schedule", "calendar", "organize", "report"],
        "marketing": ["tweet", "post", "linkedin", "social", "twitter", "marketing"],
        "content": ["content", "video", "podcast", "newsletter"],
        "personal": ["health", "exercise", "routine", "habit"],
    }

    for cat, keywords in category_keywords.items():
        if any(w in text for w in keywords):
            return cat

    return "other"


def suggest_priority(item: str, item_type: str = "general") -> str:
    """Suggest priority based on content and type"""
    text = item.lower()

    if item_type == "bug":
        return "P0"

    for priority, keywords in PRIORITY_KEYWORDS.items():
        if any(w in text for w in keywords):
            return priority

    if "tomorrow" in text or "today" in text:
        return "P1"
    if "overdue" in text or "late" in text:
        return "P1"

    return "P2"


def detect_item_type(text: str) -> str:
    """Detect item type from text"""
    lower = text.lower()
    if any(w in lower for w in ["bug", "error", "fix", "broken", "crash"]):
        return "bug"
    elif any(w in lower for w in ["idea", "maybe", "someday", "what if"]):
        return "idea"
    elif any(w in lower for w in ["meeting", "1:1", "call", "sync"]):
        return "meeting"
    return "general"

# ─── Content Generation ──────────────────────────────────────────────────────

def get_task_overview(item: str, category: str) -> str:
    """Generate contextual overview"""
    item_lower = item.lower()

    if "proposal" in item_lower:
        return f"Create and submit a comprehensive proposal for {item}. Research requirements, draft content, and prepare supporting materials."
    elif "review" in item_lower:
        return f"Conduct thorough review of {item}. Provide feedback, suggestions, and actionable improvements."
    elif "follow up" in item_lower or "reach out" in item_lower:
        return f"Establish or continue communication regarding {item}. Ensure clear next steps."
    elif "post" in item_lower or "write" in item_lower:
        return f"Create compelling content for {item}. Focus on value delivery and audience engagement."
    elif "implement" in item_lower or "build" in item_lower:
        return f"Design and implement solution for {item}. Ensure functionality, testing, and documentation."
    else:
        return f"Complete {item} with focus on quality and timeliness."


def get_next_actions(item: str, category: str) -> str:
    """Generate smart next actions by category"""
    actions = ["- [ ] Review related context and existing work"]

    category_actions = {
        "outreach": [
            "- [ ] Research contact's recent activity/interests",
            "- [ ] Draft personalized message",
            "- [ ] Schedule follow-up reminder",
        ],
        "writing": [
            "- [ ] Create outline with key points",
            "- [ ] Write first draft",
            "- [ ] Review and edit for clarity",
            "- [ ] Prepare for publication/submission",
        ],
        "technical": [
            "- [ ] Define technical requirements",
            "- [ ] Set up development environment",
            "- [ ] Implement core functionality",
            "- [ ] Test and validate solution",
        ],
        "research": [
            "- [ ] Define research questions",
            "- [ ] Gather relevant sources",
            "- [ ] Analyze and synthesize findings",
            "- [ ] Document insights and recommendations",
        ],
        "marketing": [
            "- [ ] Research trending topics/hashtags",
            "- [ ] Draft engaging content",
            "- [ ] Add relevant visuals/links",
            "- [ ] Schedule optimal posting time",
        ],
        "admin": [
            "- [ ] Gather required documents/receipts",
            "- [ ] Complete required forms",
            "- [ ] Submit for approval",
            "- [ ] Follow up if not processed within 48h",
        ],
    }

    actions.extend(category_actions.get(category, [
        "- [ ] Define specific requirements",
        "- [ ] Create action plan",
        "- [ ] Execute plan",
        "- [ ] Verify completion",
    ]))

    return "\n".join(actions)


def generate_task_content(item: str, category: str) -> str:
    """Generate rich task content based on category"""
    overview = get_task_overview(item, category)
    next_actions = get_next_actions(item, category)

    content = f"""## Overview
{overview}

## Next Actions
{next_actions}

## Notes & Details
- Task created from backlog processing
- Category: {category}
- Created: {datetime.now().strftime("%Y-%m-%d")}
"""

    if category == "outreach":
        content += """
## Draft Message
[Draft outreach message here]

## Contact Details
- Name: [to be added]
- Email: [to be added]
"""
    elif category == "writing":
        content += """
## Key Points
- [Main argument or thesis]
- [Supporting points]
- [Call to action]

## Target Audience
[Define who this is for]
"""
    elif category == "technical":
        content += """
## Technical Requirements
- [Specific technical details]
- [Dependencies or prerequisites]
- [Expected outcome]

## Implementation Notes
- [Technical approach]
- [Testing considerations]
"""
    elif category == "research":
        content += """
## Research Questions
- [What are we trying to learn?]
- [Key hypotheses to test]

## Sources to Explore
- [Relevant resources]
- [People to consult]
"""

    return content

# ─── Goal Alignment ──────────────────────────────────────────────────────────

def load_goals(goals_path: Path) -> str:
    """Load goals content for alignment"""
    if goals_path and goals_path.exists():
        return goals_path.read_text(encoding="utf-8")
    return ""


def find_goal_alignment(item: str, goals_content: str) -> Optional[str]:
    """Find which goal an item aligns with"""
    item_keywords = extract_keywords(item)
    best_match = None
    best_score = 0

    current_goal = None
    for line in goals_content.split("\n"):
        line = line.strip()
        if line.startswith("### ") or line.startswith("## "):
            current_goal = line.lstrip("#").strip()
        elif current_goal and line.startswith("- "):
            goal_text = line[2:].strip()
            goal_keywords = extract_keywords(goal_text)
            if item_keywords and goal_keywords:
                overlap = len(item_keywords & goal_keywords) / max(len(item_keywords | goal_keywords), 1)
                if overlap > best_score and overlap > 0.15:
                    best_score = overlap
                    best_match = current_goal

    return best_match

# ─── Task Creation ───────────────────────────────────────────────────────────

def create_task_file(
    tasks_dir: Path,
    item: str,
    category: str,
    priority: str,
    goals_content: str = "",
    due_date: str = "",
) -> str:
    """Create a task file with YAML frontmatter and rich content"""
    # Generate filename
    safe_name = re.sub(r"[^\w\s-]", "", item).strip()
    safe_name = re.sub(r"[-\s]+", "_", safe_name)
    safe_name = safe_name[:60]  # Limit length
    filename = f"{priority}_{safe_name}.md"
    filepath = tasks_dir / filename

    # Avoid overwrite
    counter = 1
    while filepath.exists():
        filename = f"{priority}_{safe_name}_{counter}.md"
        filepath = tasks_dir / filename
        counter += 1

    # Find goal alignment
    goal_alignment = find_goal_alignment(item, goals_content)

    # Build metadata
    metadata = {
        "title": item,
        "category": category,
        "priority": priority,
        "status": "n",
        "created_date": datetime.now().strftime("%Y-%m-%d"),
    }
    if due_date:
        metadata["due_date"] = due_date

    # Build content
    task_content = generate_task_content(item, category)

    if goal_alignment:
        task_content = f"## Context\nAligned to goal: **{goal_alignment}**\n\n{task_content}"

    # Write file
    yaml_lines = []
    for key, value in metadata.items():
        if isinstance(value, str) and (" " in value or ":" in value):
            yaml_lines.append(f'{key}: "{value}"')
        else:
            yaml_lines.append(f"{key}: {value}")

    yaml_str = "\n".join(yaml_lines)
    file_content = f"---\n{yaml_str}\n---\n\n# {item}\n\n{task_content}"

    filepath.write_text(file_content, encoding="utf-8")
    return filename

# ─── Backlog Parsing ─────────────────────────────────────────────────────────

def parse_backlog_items(content: str) -> List[Dict[str, Any]]:
    """Parse backlog items from markdown (excludes completed [x] items)"""
    items = []
    for line in content.split("\n"):
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("---"):
            continue
        if line.startswith("- "):
            text = line[2:].strip()
            # Skip completed items (marked with [x])
            if text.startswith("[x]") or text.startswith("[X]"):
                continue
            # Skip checkbox items that are checked
            if re.match(r"^\[[xX]\]", text):
                continue
            if text:
                items.append({
                    "text": text,
                    "type": detect_item_type(text),
                })
    return items

# ─── Main Processing Pipeline ────────────────────────────────────────────────

def process_backlog(
    items: List[Dict],
    existing_tasks: List[Dict],
    goals_content: str = "",
    auto_create: bool = False,
    tasks_dir: Path = None,
) -> Dict[str, Any]:
    """Process backlog items with full intelligence"""
    result = {
        "new_tasks": [],
        "potential_duplicates": [],
        "needs_clarification": [],
        "auto_created": [],
        "summary": {},
    }

    for item in items:
        text = item["text"]

        # Check for duplicates
        similar = find_similar_tasks(text, existing_tasks)
        if similar:
            result["potential_duplicates"].append({
                "item": text,
                "similar_tasks": similar,
                "recommended_action": "merge" if similar[0]["similarity_score"] > 0.8 else "review",
            })
        elif is_ambiguous(text):
            result["needs_clarification"].append({
                "item": text,
                "questions": generate_clarification_questions(text),
            })
        else:
            category = guess_category(text)
            priority = suggest_priority(text, item["type"])
            goal = find_goal_alignment(text, goals_content)

            result["new_tasks"].append({
                "item": text,
                "category": category,
                "priority": priority,
                "goal_alignment": goal,
                "ready_to_create": True,
            })

            if auto_create and tasks_dir:
                filename = create_task_file(
                    tasks_dir, text, category, priority, goals_content
                )
                result["auto_created"].append(filename)

    result["summary"] = {
        "total_items": len(items),
        "new_tasks": len(result["new_tasks"]),
        "duplicates_found": len(result["potential_duplicates"]),
        "needs_clarification": len(result["needs_clarification"]),
        "auto_created": len(result["auto_created"]),
    }

    return result

# ─── CLI Output ──────────────────────────────────────────────────────────────

def print_report(result: Dict, items: List[Dict]):
    """Print formatted report"""
    print("=" * 60)
    print("📋 BACKLOG PROCESSING REPORT")
    print("=" * 60)
    print(f"\nFound {len(items)} items to process:\n")

    # New tasks
    if result["new_tasks"]:
        print("✅ READY TO CREATE:")
        for i, task in enumerate(result["new_tasks"], 1):
            emoji = {"P0": "🔴", "P1": "🟡", "P2": "🟢", "P3": "⚪"}.get(task["priority"], "⚪")
            goal = f" → {task['goal_alignment']}" if task.get("goal_alignment") else ""
            print(f"  {i}. {emoji} [{task['priority']}] [{task['category']}] {task['item']}{goal}")

    # Duplicates
    if result["potential_duplicates"]:
        print("\n⚠️  POTENTIAL DUPLICATES:")
        for dup in result["potential_duplicates"]:
            print(f"  • \"{dup['item']}\"")
            for sim in dup["similar_tasks"]:
                print(f"    → Similar to: \"{sim['title']}\" (score: {sim['similarity_score']})")

    # Needs clarification
    if result["needs_clarification"]:
        print("\n❓ NEEDS CLARIFICATION:")
        for clar in result["needs_clarification"]:
            print(f"  • \"{clar['item']}\"")
            for q in clar["questions"]:
                print(f"    → {q}")

    # Auto-created
    if result["auto_created"]:
        print(f"\n🤖 AUTO-CREATED ({len(result['auto_created'])}):")
        for f in result["auto_created"]:
            print(f"  ✓ {f}")

    # Summary
    s = result["summary"]
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"  Total items:    {s['total_items']}")
    print(f"  Ready to create: {s['new_tasks']}")
    print(f"  Duplicates:     {s['duplicates_found']}")
    print(f"  Need clarify:   {s['needs_clarification']}")
    print(f"  Auto-created:   {s['auto_created']}")
    print("=" * 60)

# ─── CLI Entry Point ─────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Backlog Processor — Enhanced")
    parser.add_argument("--create-tasks", action="store_true", help="Create task files for ready items")
    parser.add_argument("--auto-create", action="store_true", help="Auto-create non-duplicate tasks")
    parser.add_argument("--dedup", action="store_true", help="Check for duplicates")
    parser.add_argument("--clear", action="store_true", help="Clear backlog after processing")
    parser.add_argument("--full-process", action="store_true", help="Full pipeline: analyze + create + clear")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--limit", type=int, default=50, help="Max items to process")

    args = parser.parse_args()

    # Resolve paths
    root = get_project_root()
    backlog_path = get_backlog_path(root)
    tasks_dir = get_tasks_dir(root)
    goals_path = get_goals_path(root)

    # Read backlog
    content = backlog_path.read_text(encoding="utf-8")
    items = parse_backlog_items(content)

    if not items:
        print("✅ BACKLOG.md is empty — nothing to process!")
        sys.exit(0)

    items = items[:args.limit]

    # Get existing tasks for dedup
    existing_tasks = get_all_tasks(tasks_dir)

    # Load goals for alignment
    goals_content = load_goals(goals_path) if goals_path else ""

    # Process
    auto_create = args.auto_create or args.full_process
    result = process_backlog(items, existing_tasks, goals_content, auto_create, tasks_dir)

    # Output
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print_report(result, items)

    # Create tasks (manual mode)
    if args.create_tasks and not auto_create:
        print(f"\n📝 Creating {len(result['new_tasks'])} tasks...")
        for task in result["new_tasks"]:
            filename = create_task_file(
                tasks_dir, task["item"], task["category"],
                task["priority"], goals_content
            )
            print(f"  ✓ Created: {filename}")
        print("Done!")

    # Clear backlog
    if args.clear or args.full_process:
        backlog_path.write_text(
            f"# Backlog\n\n_Cleared on {datetime.now().strftime('%Y-%m-%d %H:%M')}_\n",
            encoding="utf-8"
        )
        print("\n🧹 BACKLOG.md cleared!")


if __name__ == "__main__":
    main()
