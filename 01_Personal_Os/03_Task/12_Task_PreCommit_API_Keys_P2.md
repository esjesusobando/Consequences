# Task: Pre-commit Hook — Staged API Keys Scanner

**Prioridad:** P2  
**Fecha creación:** 2026-05-22  
**Proyecto:** Think_Different  
**Origen:** Plan_Seguir_2026-05-22.md — Fase E

---

## 📍 Contexto

### Hooks Existentes en el Sistema

| Hook                      | Ubicación                                     | Función                           |
|--------------------------|----------------------------------------------|----------------------------------|
| **GGA pre-commit**        | `.agent/05_GGA/.github/workflows/pr-check.yml`| Valida PR: issue reference, labels|
| **GGA pre-commit install**| `.agent/05_GGA/bin/gga`                       | Hook binario para staged files    |

### Buscar en el Proyecto

Se encontraron estos archivos con contenido relevante para API keys:

```
01_Personal_Os/01_Core/02_Tools/02_Skills/09_Claude_Ads/07_Scripts/generate_image.py
01_Personal_Os/04_Operations/03_Scripts_Os/25_Minimax_Optimizer_Hub.py
01_Personal_Os/04_Operations/03_Scripts_Os/33_Parallel_Audit_Pro.py
01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator/skill_security_scan.py
01_Personal_Os/04_Operations/03_Scripts_Os/05_AIPM/29_Guardrails_Service.py
```

### Concepto: Staged API Keys Scanner

Un pre-commit hook que:
1. Escanea archivos staged (git diff --cached)
2. Detecta patterns de API keys, secrets, tokens
3. Bloquea el commit si encuentra algo
4. Solo falla, no repara

---

## 🎯 Definición de Terminado

1. **Hook existe** — script en `.agent/05_GGA/` o similar
2. **Patterns cubiertos** — OpenAI, Anthropic, GitHub, AWS, etc.
3. **Testeado** — commit con fake key es bloqueado
4. **Documentado** — cómo agregar nuevos patterns

---

## ➡️ Siguiente Acción

**Investigar estado actual:**

```bash
# Ver si existe hook de API keys
ls .agent/05_GGA/hooks/ 2>/dev/null || echo "No hooks dir"

# Ver configuración de hooks global
git config --get core.hooksPath

# Revisar scripts de security scan existentes
cat 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator/skill_security_scan.py
```

**Si no existe:** Crear como parte del GGA o como hook standalone.

---

## 📋 Metadata

- **Ubicación tarea:** `01_Personal_Os/03_Task/12_Task_PreCommit_API_Keys_P2.md`
- **Keywords:** `pre-commit`, `api keys`, `security`, `hook`
- **Bloqueado por:** —
- **Related:** GGA ya tiene workflow de PR validation
