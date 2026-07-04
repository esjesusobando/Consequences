# ⚡ 22_Dynamic_Workflows — Pipeline Completo de Feature

> **Status:** Semi-Autonomous — Se activa para features que requieren el ciclo completo (research→ship→compound)
> **Source of Truth:** `01_Personal_Os/00_Core/02_Tools/02_Skills/00_Personal_Os/09_Workflow_Os/02_Dynamic_Workflows/`
> **Skills:** `01_Personal_Os/00_Core/02_Tools/02_Skills/00_Personal_Os/09_Workflow_Os/02_Dynamic_Workflows/SKILL.md`
> **Dependencias:** SDD flow (propose→spec→design→tasks→apply→verify→archive), ce-compound, GitHub

---

## 🧠 Propósito

Pipeline completo de ejecución de features: desde la idea o bug report hasta el código implementado, verificado y documentado. 11 fases, 6 modos de entrada.

**Diferencia con LFG:** LFG es autonomous (sin intervención humana). Dynamic Workflows es semi-autónomo: el usuario revisa y aprueba cada fase crítica.

## 🎯 Cuándo Invocarlo

| Usuario dice... | Modo |
|----------------|------|
| "implementá X feature" | SDD completo |
| "arreglá este bug" | Bug Fix mode |
| "refactor X" | Refactor mode |
| "generame tests para X" | Test Generation mode |
| "ship this" | Ship mode (commit + PR) |
| "nuevo feature: [brief]" | Feature mode (el más común) |

## 📋 Protocolo

### 1. Cargar la Metodología
```yaml
file: 00_Personal_Os/09_Workflow_Os/02_Dynamic_Workflows/SKILL.md
action: identificar modo de entrada y ejecutar fases correspondientes
```

### 2. Determinar Modo de Entrada
- **Feature**: Brief → SDD Explore → Propose → Spec → Design → Tasks → Apply → Verify → Archive → Compound
- **Bug Fix**: Bug report → Debug → Fix → Test → PR
- **Refactor**: Scope → Code → Test → Verify → PR
- **Test Generation**: Scope → Spec → Generate → Validate
- **Ship**: Commit → Push → PR
- **Discovery**: Research → Learn → Compound

### 3. Ejecutar Fases
Cada fase incluye human-in-the-loop checkpoints. DW no avanza sin aprobación en fases críticas (Spec, Design, Verify).

### 4. Salida Esperada
- Feature implementado y verificado
- PR creado (si aplica)
- Learning compoundeado en `docs/solutions/`
- Engram save del resultado

## 💬 Communication Style

- **Estructurado**: Reporta progreso fase por fase
- **Claro en bloqueos**: Si algo no está definido, pregunta antes de continuar
- **Resumen ejecutivo**: Al final, un TL;DR de qué se hizo, qué falta, qué se aprendió

---

*22_Dynamic_Workflows v1.0 — Pipeline Completo de Feature — 2026-05-30*
