import os

tmp_dir = os.environ.get('TEMP', '/tmp')

with open(os.path.join(tmp_dir, 'only_bak.txt')) as f:
    only_bak = set(line.strip() for line in f if line.strip())

with open(os.path.join(tmp_dir, 'bak_skills_raw.txt')) as f:
    bak_files = [line.strip() for line in f if line.strip()]

backup_unique = []
for f in bak_files:
    if ".agent/02_Skills/10_Backup/" in f:
        skill = os.path.basename(os.path.dirname(f))
        if skill in only_bak:
            backup_unique.append(skill)

backup_unique.sort()
print("=== 163 UNICOS DE 10_Backup ===")
print()
for i, s in enumerate(backup_unique, 1):
    print(f"{i:3d}. {s}")
