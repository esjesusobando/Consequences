"""
BEAUTIFY TABLES (PIXEL PERFECT)
Alinea verticalmente los pipes '|' de las tablas Markdown.
"""
import sys
import re
import os

def align_table(table_block):
    lines = table_block.strip().split('\n')
    if len(lines) < 2:
        return table_block

    # Parse rows
    rows = []
    for line in lines:
        # Split by pipe, but we need to handle the outer pipes correctly
        # Assuming standard markdown table format like | val | val |
        if not line.strip().startswith('|'):
            return table_block # Not a standard pipe table

        # Split and strip whitespace
        cells = [c.strip() for c in line.split('|')]

        # Usually split('|') on "| a | b |" gives ["", "a", "b", ""]
        if cells and cells[0] == '': cells.pop(0)
        if cells and cells[-1] == '': cells.pop(-1)

        rows.append(cells)

    if not rows:
        return table_block

    # Calculate max width for each column
    col_widths = {}
    for row in rows:
        for i, cell in enumerate(row):
            # Check length of cell, treat emojis as 1 char? No, len() is usually fine for monospace
            # But specific complex emojis might be wide. Python len() is decent enough.
            col_widths[i] = max(col_widths.get(i, 0), len(cell))
            # Separator lines (---) need to be at least 3 chars
            if set(cell) == {'-'}: # It's a separator line
                 col_widths[i] = max(col_widths.get(i, 0), 3)

    # Reconstruct lines
    new_lines = []
    for row in rows:
        new_row = "|"
        for i, cell in enumerate(row):
            width = col_widths.get(i, 0)

            # Formatting separator line
            if set(cell) == {'-'} or (set(cell) == {'-', ':'} and len(cell) > 1):
                # Handle align markers :---, ---:, :---:
                # For simplicity in this script, we just standardise to dashes or preserve colons if sophisticated logic added
                # But simple version: just fill with dashes
                content = "-" * (width + 2)
            else:
                content = f" {cell.ljust(width)} "

            new_row += content + "|"
        new_lines.append(new_row)

    return "\n".join(new_lines)

def process_file(file_path):
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}: Not found")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    original_content = content

    # Simple state machine parser
    new_lines = []
    current_table = []
    in_table = False

    for line in content.splitlines():
        is_table_row = line.strip().startswith('|') and '|' in line

        if is_table_row:
            current_table.append(line)
            in_table = True
        else:
            if in_table:
                # Process the accumulated table
                table_block = "\n".join(current_table)
                # For safety, blindly validating it looks like a table
                if len(current_table) >= 2 and any('---' in l for l in current_table):
                     new_lines.append(align_table(table_block))
                else:
                     new_lines.extend(current_table)
                current_table = []
                in_table = False

            new_lines.append(line)

    # Handle case where file ends exactly with a table
    if in_table and current_table:
         table_block = "\n".join(current_table)
         if len(current_table) >= 2 and any('---' in l for l in current_table):
                new_lines.append(align_table(table_block))
         else:
                new_lines.extend(current_table)

    new_content = "\n".join(new_lines) + "\n" # Ensure single trailing newline

    if new_content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[OK] Beautified: {os.path.basename(file_path)}")
    else:
        print(f"[--] Already perfect: {os.path.basename(file_path)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python 29_beautify_tables.py target=<file_path> or just <file_path>")
        sys.exit(1)

    target = sys.argv[1]
    if target.startswith("target="):
        target = target.split("=")[1]

    process_file(target)
