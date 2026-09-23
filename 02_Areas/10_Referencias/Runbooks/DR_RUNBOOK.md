---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Runbooks\DR_RUNBOOK.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Runbooks\DR_RUNBOOK.md"
sync_date: "2026-08-01T00:55:47.536378"
sync_updated: true---

# DR_RUNBOOK — Disaster Recovery Runbook

> **Última revisión:** 2026-07-14
> **Responsable:** Junior + Engram
> **RTO (Recovery Time Objective):** < 30 minutos
> **RPO (Recovery Point Objective):** < 24 horas

---

## 📋 Pre-requisitos

- [ ] Acceso a Engram server (local o cloud)
- [ ] Python 3.10+ instalado
- [ ] Último snapshot verificado (ver `engram_snapshot.py`)
- [ ] Backup de `config_paths.py` y `path_guardian.py`

---

## 🔴 Escenario 1: Pérdida total de datos locales

### Síntomas
- Archivos de config borrados
- `01_Personal_Os/` corrupto o inaccesible
- `config_paths.py` falla

### Pasos de recuperación

```bash
# 1. Verificar estado actual
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_verify.py

# 2. Listar snapshots disponibles
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_snapshot.py --list

# 3. Restaurar último snapshot
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_restore.py --latest

# 4. Verificar post-restauración
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_verify.py

# 5. Re-ejecutar config_paths validation
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/05_Validator/config_paths.py --validate
```

### Tiempo estimado: 10-15 minutos

---

## 🟠 Escenario 2: Engram memory corrompido

### Síntomas
- `mem_search` retorna resultados erróneos
- Observaciones con IDs duplicados
- Errores de JSON parse en Engram

### Pasos de recuperación

```bash
# 1. Verificar Engram health
python -c "import engram; engram.doctor()"

# 2. Si falla, restaurar desde último snapshot
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_restore.py --component memory

# 3. Re-sincronizar
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_verify.py --deep
```

### Tiempo estimado: 5-10 minutos

---

## 🟡 Escenario 3: Scripts rotos post-update

### Síntomas
- `config_paths.py` lanza ImportError
- Scripts fallan con `ModuleNotFoundError`
- `path_guardian` no resolve paths

### Pasos de recuperación

```bash
# 1. Verificar Python version
python --version  # Debe ser 3.10+

# 2. Reinstall dependencies
pip install colorama pyyaml

# 3. Verificar paths
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/05_Validator/config_paths.py --validate

# 4. Si paths fallan, restaurar config
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_restore.py --component config
```

### Tiempo estimado: 5 minutos

---

## 🟢 Escenario 4: Git history corruption

### Síntomas
- `git status` falla
- `.git/` corrupto
- Commits perdidos

### Pasos de recuperación

```bash
# 1. Verificar git status
git status

# 2. Si falla, restaurar desde remote
git fetch origin
git reset --hard origin/master

# 3. Si no hay remote, usar último snapshot
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_restore.py --component git
```

### Tiempo estimado: 10 minutos

---

## 📊 Monitoreo post-recuperación

Después de cualquier recuperación:

1. **Ejecutar test suite completa:**
   ```bash
   python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/session_init_test.py
   ```

2. **Verificar métricas:**
   ```bash
   python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/01_Auto_Improvement/01_Engine/learner.py --status
   ```

3. **Crear snapshot post-recovery:**
   ```bash
   python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/engram_snapshot.py --label "post-recovery"
   ```

---

## 📞 Escalation

Si ningún paso funciona:
1. Crear issue en `01_Personal_Os/04_Tasks/` con detalle del error
2. Ejecutar `engram_verify.py --full` y adjuntar output
3. Restaurar desde backup manual en `07_Archive/02_Backups_Refs/`

---

## 🔄 Backup Schedule

| Qué | Cuándo | Cómo |
|-----|--------|------|
| Engram snapshot | Diario (automático) | `engram_snapshot.py` |
| Config files | Pre-update | Backup manual |
| Git push | Post-commit | `git push` |
| Full backup | Semanal | `07_Archive/02_Backups_Refs/` |
