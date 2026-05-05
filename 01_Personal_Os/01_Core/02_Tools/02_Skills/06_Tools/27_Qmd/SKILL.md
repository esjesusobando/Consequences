---
name: qmd
description: >
  Sistema de metadata QMD para skills. Framework de evaluación y schema de metadata 
  para skills. Referencia al código en Archive + utilidad operativa para consultar 
  schemas de evaluación. Activa cuando: "qmd", "metadata de skill", "eval schema", 
  "skill scoring", "qué metadata tiene esta skill".
---

# 📦 QMD — Sistema de Metadata para Skills

## Esencia Original

> **Metaskill**: Sistema de metadata estructurada para skills que permite evaluarlas, scoring automático y tracking de versiones.

Esta skill es el **sistema de registro** del PersonalOS. Centraliza metadata, evals y schemas de todas las skills.

## Principio Fundamental

**QMD es un sistema de metadata layer que permite:**
- Definir schemas de evaluación para skills
- Scoring automático de skills
- Metadatos estructurados (author, version, tags, evals)
- Referencias cruzadas entre skills

## Ubicaciones

| Tipo                                | Ubicación                                                   |
|-------------------------------------|-------------------------------------------------------------|
| **Código fuente**                   | `05_Archive/07_Repos_Gentleman/qmd/`                        |
| **Skills definition**               | `05_Archive/07_Repos_Gentleman/qmd/skills/`                 |
| **Eval framework**                  | `05_Archive/07_Repos_Gentleman/qmd/finetune/`               |

## Estructura QMD

```
qmd/
├── skills/              # Definiciones de skills
│   └── [skill-name]/
│       ├── SKILL.md
│       ├── schema.json  # Metadata schema
│       └── evals.json   # Casos de evaluación
├── finetune/           # Framework de fine-tuning
│   ├── eval.py         # Evaluador
│   ├── train.py       # Trainer
│   └── experiments/    # Experimentos
└── src/                # Código fuente
    ├── store.ts        # Storage
    ├── llm.ts          # LLM utilities
    └── mcp/            # MCP server
```

## Uso Operativo

### Consultar Schema de una Skill

```python
# QMD permite consultar metadata de cualquier skill
# En el contexto de PersonalOS, esto se usa para:

# 1. Verificar qué metadata tiene una skill
qmd_schema = {
    "name": "skill-name",
    "version": "1.0",
    "author": "PersonalOS",
    "tags": ["frontend", "design"],
    "evals": {
        "quality_score": ">= 80%",
        "test_coverage": ">= 70%"
    }
}

# 2. Evaluar si una skill cumple standards
def evaluar_skill(skill_path):
    schema = load_schema(skill_path)
    eval_results = run_evals(skill_path, schema.evals)
    return eval_results
```

### Schema de Metadata

```json
{
  "name": "skill-name",
  "description": "Qué hace esta skill",
  "version": "1.0.0",
  "author": "PersonalOS Team",
  "tags": ["category", "framework"],
  "triggers": ["when user says X", "on pattern Y"],
  "dependencies": ["other-skill"],
  "evals": {
    "required": ["test-1", "test-2"],
    "metrics": {
      "quality_score": 80,
      "coverage": 70
    }
  }
}
```

## Integración con PersonalOS

### Skill Auditor usa QMD

El **Skill Auditor** en PersonalOS consulta el schema QMD para evaluar skills:

```python
# Pseudo-código de cómo Skill Auditor usa QMD
def audit_skill(skill_path):
    schema = qmd.load_schema(skill_path)
    
    # Verificar required fields
    required = ["name", "description", "triggers"]
    for field in required:
        if not schema.get(field):
            issues.append(f"Missing: {field}")
    
    # Ejecutar evals
    eval_results = qmd.run_evals(skill_path, schema.evals)
    
    return {
        "score": eval_results.score,
        "issues": issues,
        "recommendations": eval_results.recommendations
    }
```

### En el Contexto de una Tarea

Cuando estés auditando o creando una skill:

1. **Cargar QMD schema** → `05_Archive/07_Repos_Gentleman/qmd/`
2. **Verificar campos requeridos** → name, description, triggers
3. **Ejecutar evals** → si existen casos de prueba
4. **Calcular score** → basado en métricas definidas

## Comandos Útiles

```bash
# Ver estructura QMD
ls 05_Archive/07_Repos_Gentleman/qmd/

# Ver skills definitions
ls 05_Archive/07_Repos_Gentleman/qmd/skills/

# Ver evals
cat 05_Archive/07_Repos_Gentleman/qmd/finetune/eval.py
```

## Esencia Original (añadida 2026-04-20)

> **Metaskill**: Framework de metadata y evaluación para skills del PersonalOS. Permite definir schemas, scoring y tracking de versiones.

## Gotchas

- ❌ QMD no es una metodología operativa como SDD o CE
- ✅ Es un **framework de metadata** — complementa otras metodologías
- ✅ Útil para auditorías de skills (Skill Auditor)
- ✅ Proporciona schema standard para todas las skills

## Diferencia con Otras

| Sistema                 | Propósito                               | Tipo                          |
|-------------------------|-----------------------------------------|-------------------------------|
| **QMD**                 | Metadata + Evaluación                   | Framework                     |
| **SDD**                 | Especificar + implementar               | Metodología                   |
| **CE**                  | Plan + Review + Compound                | Workflow                      |
| **GGA**                 | Code review                             | Pre-commit hook               |

---

## ⚠️ Gotchas

### ERROR 1: Confundir QMD con metodología
- **Por qué**: QMD es metadata, no un workflow de desarrollo
- **Solución**: Usar SDD/CE para desarrollo activo, QMD solo para metadata

### ERROR 2: Sin actualizar evals.json
- **Por qué**: Meta desactualizada no refleja el estado real
- **Solución**: Actualizar evals.json después de cada cambio significativo

### ERROR 3: Meta without evaluation
- **Por qué**: Meta no tracked sin evals no sirve para comparar
- **Solución**: Always crear evals.json con casos de prueba

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*
