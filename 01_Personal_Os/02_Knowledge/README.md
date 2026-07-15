# 02_Knowledge — Base de Conocimiento

## Qué hay aquí
Templates, docs, configs, referencias. El conocimiento estructurado del OS.

## Cuándo usarlo
- Para encontrar templates de documentos
- Para configuraciones del sistema
- Para documentación de procesos

## Cómo acceder
- `04_Config/` — configuraciones
- `04_Docs/` — documentación
- `02_Templates/` — templates reutilizables

## QUÉ NO HACER
- ❌ No modificar configs sin entender el impacto
- ❌ No mezclar conocimiento personal con del proyecto

---

## 🧠 Componentes AI Native (v5.1.0)

### Archivos de referencia rápida

| Componente | Archivo | Propósito |
|------------|---------|-----------|
| Skill Chains | `../05_Scripts/00_HUBs/03_Scripts_Os/skill_chain.py` | Ejecuta flujos automatizados |
| Prototype Studio | `../05_Scripts/00_HUBs/03_Scripts_Os/prototype_studio.py` | Crea prototipos funcionales |
| Curation Filter | `../05_Scripts/00_HUBs/03_Scripts_Os/curation_filter.py` | Clasifica señales |
| Signal Aggregator | `../05_Scripts/00_HUBs/03_Scripts_Os/signal_aggregator.py` | Agrega métricas |
| Output Evaluator | `../05_Scripts/00_HUBs/03_Scripts_Os/output_eval.py` | Evalúa calidad |
| DR Snapshot | `../05_Scripts/00_HUBs/03_Scripts_Os/engram_snapshot.py` | Backup Engram |
| DR Restore | `../05_Scripts/00_HUBs/03_Scripts_Os/engram_restore.py` | Restore Engram |
| Benchmarks | `../05_Scripts/00_HUBs/03_Scripts_Os/benchmark_baseline.py` | Performance baselines |
| Certification | `../05_Scripts/00_HUBs/03_Scripts_Os/certify_10_10.py` | Validador maestro |
| Onboarding | `../05_Scripts/00_HUBs/03_Scripts_Os/onboarding_checklist.py` | TUI de onboarding |

### Chain Definitions
Ubicación: `00_Core/02_Tools/02_Skills/00_System_Core/05_Skill_Chains/`
- proposal_chain.yaml
- content_chain.yaml
- audit_chain.yaml
- prototype_chain.yaml

### Reglas de curation
Ubicación: `04_Config/curation_rules.yaml`
