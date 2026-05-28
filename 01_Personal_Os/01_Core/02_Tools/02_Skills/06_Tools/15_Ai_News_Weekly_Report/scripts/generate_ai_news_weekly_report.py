#!/usr/bin/env python3
"""Generate a last-week AI news PDF report and HTML presentation.

The script intentionally uses only Python stdlib so the skill works in a fresh
PersonalOS checkout. It discovers news through RSS feeds, deduplicates titles,
ranks source items, and writes artifacts under the next numbered 03_Resultado
folder.
"""

from __future__ import annotations

import argparse
import datetime as dt
import email.utils
import html
import json
import re
import textwrap
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

DEFAULT_QUERIES = [
    'artificial intelligence AI OpenAI Anthropic Google DeepMind Meta Microsoft',
    'AI model release artificial intelligence startup regulation',
    'generative AI research model benchmark safety policy',
]

KEYWORDS = {
    'openai': 8,
    'anthropic': 8,
    'google': 5,
    'deepmind': 6,
    'meta': 5,
    'microsoft': 5,
    'nvidia': 5,
    'model': 4,
    'release': 4,
    'launch': 4,
    'regulation': 5,
    'safety': 5,
    'benchmark': 3,
    'research': 3,
    'startup': 3,
    'funding': 2,
    'agent': 3,
    'robot': 3,
}


@dataclass
class NewsItem:
    title: str
    source: str
    url: str
    published: str
    summary: str
    score: int


def find_project_root(start: Path) -> Path:
    for candidate in [start, *start.parents]:
        if (candidate / '00_Winter_is_Coming').exists() and (candidate / '01_Personal_Os').exists():
            return candidate
    return start


def next_result_dir(root: Path, label: str) -> Path:
    out_root = root / '03_Resultado'
    out_root.mkdir(parents=True, exist_ok=True)
    numbers: list[int] = []
    for child in out_root.iterdir():
        if child.is_dir():
            match = re.match(r'^(\d{2})_', child.name)
            if match:
                numbers.append(int(match.group(1)))
    next_num = (max(numbers) + 1) if numbers else 1
    today = dt.datetime.now().strftime('%Y%m%d')
    path = out_root / f'{next_num:02d}_{label}_{today}'
    suffix = 2
    while path.exists():
        path = out_root / f'{next_num:02d}_{label}_{today}_{suffix}'
        suffix += 1
    path.mkdir(parents=True, exist_ok=False)
    return path


def feed_url(query: str, days: int) -> str:
    q = f'({query}) when:{days}d'
    params = urllib.parse.urlencode({'q': q, 'hl': 'en-US', 'gl': 'US', 'ceid': 'US:en'})
    return f'https://news.google.com/rss/search?{params}'


def parse_date(value: str) -> dt.datetime | None:
    if not value:
        return None
    try:
        parsed = email.utils.parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=dt.timezone.utc)
        return parsed.astimezone(dt.timezone.utc)
    except Exception:
        return None


def fetch_url(url: str, timeout: int = 20) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'ThinkDifferentPersonalOS/ai-news-weekly-report (+https://github.com/esjesusobando/Think_Different_AI)'
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.read()


def clean_text(value: str) -> str:
    value = re.sub(r'<[^>]+>', ' ', value or '')
    value = html.unescape(value)
    value = re.sub(r'\s+', ' ', value).strip()
    return value


def score_item(title: str, summary: str, source: str) -> int:
    text = f'{title} {summary} {source}'.lower()
    score = 0
    for keyword, weight in KEYWORDS.items():
        if keyword in text:
            score += weight
    if any(domain in source.lower() for domain in ['reuters', 'associated press', 'the verge', 'techcrunch', 'wired', 'bloomberg', 'ft.com', 'mit technology review']):
        score += 5
    return score


def canonical_title(title: str) -> str:
    title = re.sub(r'\s+-\s+[^-]{2,60}$', '', title)
    title = re.sub(r'[^a-z0-9]+', ' ', title.lower())
    words = [w for w in title.split() if w not in {'the', 'a', 'an', 'to', 'of', 'and', 'for', 'in', 'on'}]
    return ' '.join(words[:12])


def extract_source(title: str) -> str:
    if ' - ' in title:
        return title.rsplit(' - ', 1)[-1].strip()
    return 'Google News RSS'


def fetch_news(days: int, max_items: int, queries: Iterable[str]) -> list[NewsItem]:
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)
    seen: set[str] = set()
    items: list[NewsItem] = []

    for query in queries:
        url = feed_url(query, days)
        try:
            data = fetch_url(url)
            xml_root = ET.fromstring(data)
        except Exception as exc:
            print(f'[WARN] Feed failed for {query!r}: {exc}')
            continue

        for node in xml_root.findall('.//item'):
            title = clean_text(node.findtext('title', ''))
            link = clean_text(node.findtext('link', ''))
            summary = clean_text(node.findtext('description', ''))
            published_raw = clean_text(node.findtext('pubDate', ''))
            published_dt = parse_date(published_raw)
            if published_dt and published_dt < cutoff:
                continue
            key = canonical_title(title)
            if not title or key in seen:
                continue
            seen.add(key)
            source = extract_source(title)
            score = score_item(title, summary, source)
            items.append(
                NewsItem(
                    title=title,
                    source=source,
                    url=link,
                    published=published_dt.isoformat() if published_dt else published_raw,
                    summary=summary[:500],
                    score=score,
                )
            )

    return sorted(items, key=lambda item: (item.score, item.published), reverse=True)[:max_items]


def escape_pdf_text(value: str) -> str:
    return value.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def wrap_lines(text: str, width: int = 92) -> list[str]:
    lines: list[str] = []
    for paragraph in text.splitlines() or ['']:
        if not paragraph.strip():
            lines.append('')
        else:
            lines.extend(textwrap.wrap(paragraph, width=width, break_long_words=False) or [''])
    return lines


def write_simple_pdf(path: Path, title: str, body: str) -> None:
    lines = [title, '', *wrap_lines(body)]
    pages = [lines[i:i + 44] for i in range(0, len(lines), 44)] or [[title]]
    objects: list[bytes] = []

    def add(obj: str | bytes) -> int:
        objects.append(obj.encode('latin-1', errors='replace') if isinstance(obj, str) else obj)
        return len(objects)

    font_id = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
    page_ids: list[int] = []

    for page_lines in pages:
        stream_lines = ['BT', '/F1 10 Tf', '50 780 Td', '14 TL']
        for idx, line in enumerate(page_lines):
            prefix = '' if idx == 0 else 'T* '
            stream_lines.append(f'{prefix}({escape_pdf_text(line)}) Tj')
        stream_lines.append('ET')
        stream = '\n'.join(stream_lines).encode('latin-1', errors='replace')
        content_id = add(b'<< /Length ' + str(len(stream)).encode() + b' >>\nstream\n' + stream + b'\nendstream')
        page_id = add(f'<< /Type /Page /Parent PAGES_ID 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 {font_id} 0 R >> >> /Contents {content_id} 0 R >>')
        page_ids.append(page_id)

    kids = ' '.join(f'{pid} 0 R' for pid in page_ids)
    pages_id = add(f'<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>')
    catalog_id = add(f'<< /Type /Catalog /Pages {pages_id} 0 R >>')

    objects = [obj.replace(b'PAGES_ID', str(pages_id).encode()) for obj in objects]
    output = bytearray(b'%PDF-1.4\n')
    offsets = [0]
    for idx, obj in enumerate(objects, 1):
        offsets.append(len(output))
        output.extend(f'{idx} 0 obj\n'.encode())
        output.extend(obj)
        output.extend(b'\nendobj\n')
    xref = len(output)
    output.extend(f'xref\n0 {len(objects) + 1}\n'.encode())
    output.extend(b'0000000000 65535 f \n')
    for off in offsets[1:]:
        output.extend(f'{off:010d} 00000 n \n'.encode())
    output.extend(f'trailer << /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
    path.write_bytes(output)


def build_markdown(items: list[NewsItem], days: int, generated_at: str) -> str:
    lines = [
        '# AI News Weekly Report',
        '',
        f'**Window:** Last {days} days',
        f'**Generated:** {generated_at}',
        f'**Stories selected:** {len(items)}',
        '',
        '## Executive Summary',
        '',
        'This briefing ranks recent AI news discovered from live RSS/search feeds. Verify high-impact claims against primary sources before publication or investment decisions.',
        '',
        '## Top Developments',
        '',
    ]
    for index, item in enumerate(items, 1):
        lines.extend([
            f'### {index}. {item.title}',
            '',
            f'- **Source:** {item.source}',
            f'- **Published:** {item.published}',
            f'- **Signal score:** {item.score}',
            f'- **URL:** {item.url}',
            f'- **Why it matters:** {item.summary or "Review the linked source for details."}',
            '',
        ])
    lines.extend([
        '## Recommended Follow-up',
        '',
        '- Verify the top 5 stories with primary sources.',
        '- Add strategic implications for your products, clients, or investment themes.',
        '- Keep the JSON source file with the report for traceability.',
    ])
    return '\n'.join(lines) + '\n'


def build_html(items: list[NewsItem], days: int, generated_at: str) -> str:
    cards = []
    for index, item in enumerate(items[:12], 1):
        cards.append(f'''
<section class="slide">
  <p class="eyebrow">AI News · #{index}</p>
  <h2>{html.escape(item.title)}</h2>
  <p class="meta">{html.escape(item.source)} · {html.escape(item.published)} · score {item.score}</p>
  <p>{html.escape(item.summary or 'Review linked source for detail.')}</p>
  <a href="{html.escape(item.url)}" target="_blank" rel="noreferrer">Open source</a>
</section>''')
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AI News Weekly Report</title>
<style>
:root {{ color-scheme: dark; --bg:#080b14; --card:#111827; --ink:#f8fafc; --muted:#94a3b8; --accent:#7c3aed; }}
* {{ box-sizing:border-box; }}
body {{ margin:0; font-family:Inter,Segoe UI,Arial,sans-serif; background:radial-gradient(circle at top left,#1e1b4b,var(--bg)); color:var(--ink); }}
.deck {{ scroll-snap-type:y mandatory; height:100vh; overflow-y:auto; }}
.slide {{ min-height:100vh; scroll-snap-align:start; display:flex; flex-direction:column; justify-content:center; padding:8vw; border-bottom:1px solid rgba(255,255,255,.1); }}
.title {{ background:linear-gradient(135deg,rgba(124,58,237,.35),rgba(14,165,233,.2)); }}
h1 {{ font-size:clamp(3rem,8vw,7rem); line-height:.95; margin:0 0 1rem; }}
h2 {{ font-size:clamp(2rem,5vw,4.5rem); line-height:1.02; margin:.2rem 0 1rem; max-width:1100px; }}
p {{ font-size:clamp(1.1rem,2vw,1.6rem); max-width:1000px; color:#dbeafe; }}
.meta,.eyebrow {{ color:var(--muted); text-transform:uppercase; letter-spacing:.12em; font-size:.9rem; }}
a {{ color:#93c5fd; font-weight:700; }}
.grid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1rem; margin-top:2rem; }}
.tile {{ background:rgba(17,24,39,.78); padding:1.2rem; border:1px solid rgba(255,255,255,.12); border-radius:20px; }}
</style>
</head>
<body>
<main class="deck">
<section class="slide title">
  <p class="eyebrow">Last {days} days · generated {html.escape(generated_at)}</p>
  <h1>AI News Weekly Report</h1>
  <p>Current AI developments discovered from live RSS/search feeds. Use source links for verification and editorial enrichment.</p>
</section>
<section class="slide">
  <p class="eyebrow">Executive brief</p>
  <h2>Top signals this week</h2>
  <div class="grid">
    {''.join(f'<div class="tile"><strong>{i+1}. {html.escape(item.source)}</strong><br>{html.escape(item.title[:120])}</div>' for i, item in enumerate(items[:6]))}
  </div>
</section>
{''.join(cards)}
<section class="slide">
  <p class="eyebrow">Next actions</p>
  <h2>Verify, synthesize, decide</h2>
  <p>Validate major claims with primary sources, add implications for your roadmap or clients, and preserve the JSON source file for auditability.</p>
</section>
</main>
</body>
</html>
'''


def main() -> int:
    parser = argparse.ArgumentParser(description='Generate last-week AI news PDF and HTML presentation.')
    parser.add_argument('--days', type=int, default=7, help='Lookback window in days.')
    parser.add_argument('--max-items', type=int, default=24, help='Maximum stories to include.')
    parser.add_argument('--query', action='append', help='Additional Google News RSS query. Can be repeated.')
    parser.add_argument('--output-dir', type=Path, help='Explicit output directory. Defaults to next 03_Resultado number.')
    args = parser.parse_args()

    if args.days < 1 or args.days > 31:
        parser.error('--days must be between 1 and 31 to keep the report current and bounded.')
    if args.max_items < 1 or args.max_items > 100:
        parser.error('--max-items must be between 1 and 100.')

    script_path = Path(__file__).resolve()
    root = find_project_root(script_path)
    output_dir = args.output_dir or next_result_dir(root, 'AI_News_Weekly')
    output_dir.mkdir(parents=True, exist_ok=True)

    queries = [*DEFAULT_QUERIES, *(args.query or [])]
    generated_at = dt.datetime.now(dt.timezone.utc).astimezone().isoformat(timespec='seconds')
    items = fetch_news(args.days, args.max_items, queries)

    json_path = output_dir / 'ai_news_weekly_sources.json'
    md_path = output_dir / 'ai_news_weekly_report.md'
    html_path = output_dir / 'ai_news_weekly_presentation.html'
    pdf_path = output_dir / 'ai_news_weekly_report.pdf'

    payload = {
        'generated_at': generated_at,
        'days': args.days,
        'queries': queries,
        'count': len(items),
        'items': [asdict(item) for item in items],
    }
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    markdown = build_markdown(items, args.days, generated_at)
    md_path.write_text(markdown, encoding='utf-8')
    html_path.write_text(build_html(items, args.days, generated_at), encoding='utf-8')
    write_simple_pdf(pdf_path, 'AI News Weekly Report', markdown)

    print(f'[OK] Output directory: {output_dir}')
    print(f'[OK] PDF: {pdf_path}')
    print(f'[OK] HTML: {html_path}')
    print(f'[OK] JSON: {json_path}')
    print(f'[OK] Markdown: {md_path}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
