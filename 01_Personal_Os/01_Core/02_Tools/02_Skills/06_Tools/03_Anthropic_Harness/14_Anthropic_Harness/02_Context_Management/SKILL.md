---
description: 02_Context_Management
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# Context Management Skill

**CATEGORÍA:** Anthropic Harness Patterns
**SUBCATEGORÍA:** Context Management
**VERSIÓN:** 1.0

---

## Propósito

Gestiona la decisión entre **Context Reset** vs **Context Compaction** según el modelo usado.

---

## Contexto (del artículo de Anthropic)

> "Context anxiety: models start wrapping up the conversation prematurely"
> "Sonnet 4.5 showed context anxiety - needed context reset"
> "Opus 4.6 didn't need reset at all - just compaction"

---

## Cuándo Usar

- Para sesiones largas (>30 min)
- Cuando el token count supera 80% del límite
- Antes de tareas complejas que requieren mucho contexto
- Cuando detectas que el modelo intenta terminar temprano

---

## Model Behavior

| Modelo                                        | Context Anxiety                                  | Recomendación                                  |
|----------------------------------------------|-------------------------------------------------|-----------------------------------------------|
| **Opus 4.6**                                  | ❌ NONE                                           | Compaction OK                                  |
| **Opus 4.5**                                  | ⚠️ LOW                                           | Compaction OK                                  |
| **Sonnet 4.5**                                | 🔴 HIGH                                           | Reset required                                 |
| **Sonnet**                                    | 🔴 HIGH                                           | Reset required                                 |

---

## Implementación

Usa `01_Context_Manager.py`:

```python
from 01_Personal_Os/04_Operations/03_Scripts_Os/11_Anthropic_Harness/01_Context_Manager import run_context_manager

# Analizar contexto
result = run_context_manager(token_count=150000)

# result = {
#     'action': 'reset' | 'compact' | 'continue',
#     'reason': '...',
#     'model': 'sonnet-4-5',
#     'anxiety_level': 'HIGH'
# }

if result['action'] == 'reset':
    print("⚠️ Reset required - save state first")
elif result['action'] == 'compact':
    print("🔄 Using compaction instead of reset")
```

---

## Integración con Perfiles

| Perfil                                           | Cómo usa                                                       |
|-------------------------------------------------|---------------------------------------------------------------|
| Product Builder                                  | Check antes de cada sprint                                     |
| Data Engineer                                    | Check antes de pipelines largos                                |
| Marketing Tech                                   | Check antes de campañas grandes                                |
| Platform Engineer                                | Check antes de builds complejos                                |

---

## Flags de Decisión

### Context Reset (Cuándo)
- Modelo: Sonnet 4.5
- Token usage: >80%
- Síntomas: Modelo acorta respuestas, no profundiza

### Context Compaction (Cuándo)
- Modelo: Opus 4.6+
- Token usage: 50-80%
- Síntomas: Ninguno (Opus maneja bien)

### Continue (Cuándo)
- Token usage: <50%
- Contexto saludable

---

## Reglas Clave

1. **Detecta el modelo** — AUTO desde CLAUDE_MODEL env
2. **Mide usage** — Tokens actuales / ventana máxima
3. **Actúa según modelo** — Opus = compact, Sonnet = reset
4. **No ignores warnings** — Context anxiety = problemas

---

## Scripts Relacionados

- `00_Safety_Wrapper.py` — Valida antes de ejecutar
- `01_Context_Manager.py` — Lógica principal

---

## Referencias

- Artículo: `01_Core/02_Knowledge_Brain/10_Anthropic_Harness_Design.md`
- Script: `01_Personal_Os/04_Operations/03_Scripts_Os/11_Anthropic_Harness/01_Context_Manager.py`

---

*Creado: 2026-03-26 | Filosofía: "No te traiciones, no te abandones"*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
