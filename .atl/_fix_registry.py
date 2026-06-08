import re
import subprocess

# Read current file
with open('.atl/skill-registry.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Get old version from git (handle encoding)
result = subprocess.run(['git', 'show', 'HEAD~4:.atl/skill-registry.md'], capture_output=True)
old_content = result.stdout.decode('utf-8', errors='replace')

lines_new = content.split('\n')
lines_old = old_content.split('\n')

# Find all lines in old that have CE skills with proper descriptions
ce_pattern = re.compile(r'^\| `ce-')
fixes = {}
for i, line in enumerate(lines_old):
    if ce_pattern.match(line) and '| \u2014 |' not in line and '| \u2014|' not in line:
        parts = line.split('|')
        if len(parts) >= 5:
            skill_cell = parts[1].strip().strip('`')
            # Only restore if old line has a real description
            desc = parts[2].strip()
            if desc and desc != '\u2014':
                fixes[skill_cell] = line

# Apply fixes to new content
fixed_lines = []
for line in lines_new:
    m = ce_pattern.match(line)
    if m:
        parts = line.split('|')
        if len(parts) >= 5:
            skill_cell = parts[1].strip().strip('`')
            if skill_cell in fixes:
                fixed_lines.append(fixes[skill_cell])
                continue
    fixed_lines.append(line)

result_content = '\n'.join(fixed_lines)

# Fix paths: .pi/agent/skills/ce- -> .config/opencode/skills/ce-
result_content = result_content.replace(
    'C:\\Users\\sebas\\.pi\\agent\\skills\\ce-',
    'C:\\Users\\sebas\\.config\\opencode\\skills\\ce-'
)
# Also fix lfg path if needed
result_content = result_content.replace(
    'C:\\Users\\sebas\\.pi\\agent\\skills\\lfg\\SKILL.md',
    'C:\\Users\\sebas\\.config\\opencode\\skills\\lfg\\SKILL.md'
)

# Fix remaining blank descriptions
result_content = result_content.replace(
    '| ' + chr(96) + 'ce-dogfood-beta' + chr(96) + ' | \u2014 |',
    '| ' + chr(96) + 'ce-dogfood-beta' + chr(96) + ' | [BETA] Dogfood the active branch end-to-end as a QA engineer |'
)
result_content = result_content.replace(
    '| ' + chr(96) + 'ce-review' + chr(96) + ' | \u2014 |',
    '| ' + chr(96) + 'ce-review' + chr(96) + ' | Structured code review using tiered persona agents, confidence-gated findings, and a merge/dedup pipeline |'
)
result_content = result_content.replace(
    '| ' + chr(96) + 'lfg' + chr(96) + ' | \u2014 |',
    '| ' + chr(96) + 'lfg' + chr(96) + ' | Run the full autonomous engineering pipeline end-to-end (plan, work, code review, test, commit, push, open PR, watch CI, fix CI failures until green) |'
)

with open('.atl/skill-registry.md', 'w', encoding='utf-8') as f:
    f.write(result_content)

print('Done: skill-registry.md fixed')

# Final verification
count_ce = 0
count_blank = 0
for line in result_content.split('\n'):
    if ce_pattern.match(line):
        count_ce += 1
        if '| \u2014 |' in line:
            count_blank += 1

print(f'CE skills: {count_ce}, still blank: {count_blank}')

# Check for any remaining .pi paths
if '.pi\\' in result_content:
    # Find them
    for line in result_content.split('\n'):
        if '.pi\\' in line:
            print(f'  REMAINING .pi PATH: {line.strip()[:150]}')
else:
    print('  No remaining .pi paths - OK')
