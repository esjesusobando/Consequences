---
description: 07_Feature_List_JSON
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# Feature List JSON Generator Skill

**CATEGORÍA:** Anthropic Harness Patterns
**SUBCATEGORÍA:** Feature List JSON
**VERSIÓN:** 1.0

---

## Propósito

Genera un archivo JSON con TODAS las features que el usuario pidió, cada una inicialmente en `"passes": false`.

> **Inspirado en:** "Effective harnesses for long-running agents" (Nov 26, 2025)

---

## Por Qué Es Vital

1. **Evita que el agente declare victory prematuramente** — Tiene que marcar cada feature como passing
2. **Tracking objetivo de progreso** — Número exacto de completadas vs total
3. **JSON > Markdown** — Claude no modifica accidentalmente archivos JSON

---

## Estructura del JSON

```json
{
  "project": "mi-proyecto",
  "version": "1.0.0",
  "features": [
    {
      "id": "feat_001",
      "category": "functional",
      "description": "User can create a new chat",
      "steps": [
        "Click New Chat button",
        "Verify new conversation appears",
        "Verify input is focused"
      ],
      "passes": false,
      "priority": "high"
    }
  ],
  "stats": {
    "total": 50,
    "passed": 12,
    "failed": 38
  }
}
```

---

## Implementación

### Scripts

| Script                                                        | Función                                                         |
|--------------------------------------------------------------|----------------------------------------------------------------|
| `00_Feature_List_Generator.py`                                | Genera feature list desde prompt                                |
| `01_Feature_Tracker.py`                                       | Tracking de progreso                                            |

### Uso

```python
from 00_Feature_List_Generator import FeatureListGenerator

generator = FeatureListGenerator()

# Generar desde prompt del usuario
features = generator.generate_from_prompt("""
Build a clone of claude.ai with:
- Chat interface
- Theme switching
- Conversation history
- File uploads
""")

# Guardar a JSON
generator.save_to_json(features, "features.json")

# Marcar una como completada
generator.mark_complete(features, "feat_001")

# Obtener stats
stats = generator.get_stats(features)
print(f"Progress: {stats['passed']}/{stats['total']}")
```

---

## Integración con Workflow

1. **Initializer Agent** genera el feature list
2. **Coding Agent** trabaja en una feature a la vez
3. **Al terminar** marca la feature como passes: true
4. **Evaluador** puede verificar el feature list completo

---

## Referencias

- Artículo: `00_Core/02_Knowledge_Brain/13_Anthropic_Engineering_02_03.md` (Post 8)

---

*Creado: 2026-03-26 | Filosofía: "No te traiciones, no te abandonones"*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
