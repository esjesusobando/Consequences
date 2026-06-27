---
description: 01_Evaluator_Pattern
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# Evaluator Pattern Skill

**CATEGORÍA:** Anthropic Harness Patterns
**SUBCATEGORÍA:** Evaluator Pattern
**VERSIÓN:** 1.0

---

## Propósito

Implementa el patrón de Adversarial Evaluation (GAN-inspired) de Anthropic:
- **Generator**: Crea código/diseño
- **Evaluator**: Verifica el trabajo (NO el mismo agente!)
- Evita que el agente se auto-apruebe trabajo mediocre

---

## Contexto (del artículo de Anthropic)

> "Out of the box, Claude is a poor QA agent"
> "Claude identified legitimate issues and then talked itself into deciding they weren't a big deal"
> "It also tended to test superficially rather than probing edge cases"

---

## Cuándo Usar

- Cuando necesitas QA de alta calidad
- Para tareas complejas (no tasks simples)
- Cuando el output necesita verificación interactiva
- Para evitar "AI slop" en diseño

---

## Criterios de Grading (Anthropic Pattern)

### Para Diseño
| Criterio                                          | Peso                                   | Descripción                                            |
|--------------------------------------------------|---------------------------------------|-------------------------------------------------------|
| **Design Quality**                                | 🔴 ALTO                                 | Coherencia visual, mood                                |
| **Originalidad**                                  | 🔴 ALTO                                 | Custom vs AI slop                                      |
| **Craft**                                         | default                                | Ejecución técnica                                      |
| **Funcionalidad**                                 | default                                | Usabilidad                                             |

### Para Código
| Criterio                                         | Peso                                   | Descripción                                     |
|-------------------------------------------------|---------------------------------------|------------------------------------------------|
| **Code Quality**                                 | 1.2                                    | Clean code                                      |
| **Test Coverage**                                | 1.2                                    | % cubierto                                      |
| **Security**                                     | 🔴 ALTO                                 | Vulnerabilidades                                |
| **Performance**                                  | default                                | Speed                                           |

---

## Implementación

Usa `02_Evaluator_Runner.py`:

```python
from 01_Personal_Os/04_Operations/03_Scripts_Os/11_Anthropic_Harness/02_Evaluator_Runner import run_evaluator

# Evaluar código
result = run_evaluator(
    output=code_output,
    output_type="code"
)

if result.passed:
    print("✅ QA Passed")
else:
    print("❌ Review bugs:", result.bugs)
```

---

## Integración con Perfiles

| Perfil                                         | Cómo usa                                                      |
|-----------------------------------------------|--------------------------------------------------------------|
| Product Builder                                | Invoca después de cada feature                                |
| Design Ops                                     | Playwright para interactivo                                   |
| Data Engineer                                  | Verifica pipelines                                            |

---

## Reglas Clave

1. **NUNCA auto-evaluarte** — Generator ≠ Evaluator
2. **Criterios gradables** — "Es hermoso?" → "Sigue principios de diseño?"
3. **Interacción real** — Usa Playwright para verificar diseño
4. **Pesos según strengths** — Opus ya es bueno en código, enfocar en diseño

---

## Referencias

- Artículo: `01_Core/02_Knowledge_Brain/10_Anthropic_Harness_Design.md`
- Script: `01_Personal_Os/04_Operations/03_Scripts_Os/11_Anthropic_Harness/02_Evaluator_Runner.py`
- Playwright QA: `01_Personal_Os/04_Operations/03_Scripts_Os/11_Anthropic_Harness/04_Playwright_QA.py`

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
