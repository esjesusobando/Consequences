# 17_Anthropic_Harness — Three-Agent Workflow

**TIPO**: Workflow de Harness para Agentes de Larga Duración
**VERSIÓN**: 1.0
**FILOSOFÍA**: "No te traiciones, no te abandones" — Siempre lo correcto

---

## 📖 Descripción

Workflow que implementa el patrón de **Three-Agent Architecture** de Anthropic:
- **Planner**: Expande prompt simple en spec completo
- **Generator**: Construye feature por feature
- **Evaluator**: QA separado (NO self-evaluation!)

Inspirado en: [Anthropic Engineering Blog](https://docs.anthropic.com)

---

## 🔄 Flujo del Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PLANNER   │───▶│  GENERATOR  │───▶│  EVALUATOR  │
│ Spec expand │    │ Code + Test │    │ QA + Grading│
└─────────────┘    └─────────────┘    └─────────────┘
                           │                 │
                           ▼                 ▼
                    ┌─────────────┐    ┌─────────────┐
                    │  ITERATE    │◀───│  FEEDBACK   │
                    │ Fix issues  │    │ List bugs   │
                    └─────────────┘    └─────────────┘
```

---

## 📋 Pasos del Workflow

### Paso 1: Safety Check (Pre-ejecución)

```bash
# Verificar que no hay riesgos
python 08_Scripts_Os/Legacy_Backup/11_Anthropic_Harness/00_Safety_Wrapper.py
```

**Validaciones:**
- Dependencias disponibles
- Paths protegidos no afectados
- Token budget OK
- Git status limpio

---

### Paso 2: Context Analysis

```bash
# Analizar contexto y decidir reset vs compaction
python 08_Scripts_Os/Legacy_Backup/11_Anthropic_Harness/01_Context_Manager.py
```

**Decisiones:**
| Token Usage     | Modelo       | Acción     |
|-----------------|--------------|------------|
| >80%            | Sonnet 4.5   | RESET      |
| 50-80%          | Any          | COMPACT    |
| <50%            | Any          | CONTINUE   |

---

### Paso 3: PLANNER - Expande Spec

1. Cargar contexto del prompt del usuario
2. Expandir en spec completo con features
3. Dividir en sprints si es necesario

**Input:** "Build a login form"
**Output:** "## Spec: Login Form\n- Email input with validation\n- Password input with show/hide toggle\n- Remember me checkbox\n- Forgot password link\n- OAuth buttons (Google, GitHub)\n- Form validation\n- Error handling"

---

### Paso 4: SPRINT CONTRACT (para cada sprint)

```bash
python 08_Scripts_Os/Legacy_Backup/11_Anthropic_Harness/03_Sprint_Contract.py
```

1. Generator propone qué va a build
2. Evaluator responde con requirements
3. Negotiate hasta agreement
4. Contract firmado

---

### Paso 5: GENERATOR - Build

1. Escribir código siguiendo TDD
2. Commit después de cada feature chunk
3. Dejar artifacts claros para siguiente agente

---

### Paso 6: EVALUATOR - QA

```bash
python 08_Scripts_Os/Legacy_Backup/11_Anthropic_Harness/02_Evaluator_Runner.py
```

**Criterios de Grading:**

| Tipo Output     | Criterios                                            |
|-----------------|------------------------------------------------------|
| **Diseño**      | Design Quality, Originalidad, Craft, Funcionalidad   |
| **Código**      | Code Quality, Test Coverage, Security, Performance   |

**Resultado:** PASS/FAIL con bugs list

---

### Paso 7: PLAYWRIGHT QA (opcional)

```bash
python 08_Scripts_Os/Legacy_Backup/11_Anthropic_Harness/04_Playwright_QA.py
```

Para diseño o features que requieren testing visual/interactivo.

---

### Paso 8: ITERATE o DEPLOY

- Si Evaluator FAILED → Volver a Generator (Paso 5)
- Si Evaluator PASSED → Deploy

---

## 🎯 Cuándo Usar Este Workflow

| Escenario           | Usar?      | Reason                                   |
|---------------------|------------|------------------------------------------|
| Feature simple      | ❌ NO       | Overhead innecesario                     |
| Feature media       | ⚠️ MAYBE   | Depende de complejidad                   |
| App completa        | ✅ SÍ       | Anthropic demostró 6hr → app funcional   |
| Sesión >1 hora      | ✅ SÍ       | Context anxiety prevention               |
| Trabajo en equipo   | ✅ SÍ       | Sprint contracts                         |

---

## 📦 Skills Relacionadas

| Skill                                           | Uso en Workflow    |
|-------------------------------------------------|--------------------|
| `14_Anthropic_Harness/01_Evaluator_Pattern/`    | Paso 6             |
| `14_Anthropic_Harness/02_Context_Management/`   | Paso 2             |
| `14_Anthropic_Harness/03_Sprint_Contract/`      | Paso 4             |

---

## ⚙️ Scripts del Workflow

| Script                                          | Paso     | Función     |
|-------------------------------------------------|----------|-------------|
| `11_Anthropic_Harness/00_Safety_Wrapper.py`     | 1        | Pre-check   |
| `11_Anthropic_Harness/01_Context_Manager.py`    | 2        | Context     |
| `11_Anthropic_Harness/02_Evaluator_Runner.py`   | 6        | QA          |
| `11_Anthropic_Harness/03_Sprint_Contract.py`    | 4        | Contract    |
| `11_Anthropic_Harness/04_Playwright_QA.py`      | 7        | Visual QA   |

---

## 📚 Referencia

- Artículo: [Anthropic Engineering Blog](https://docs.anthropic.com)
- Scripts: `08_Scripts_Os/Legacy_Backup/11_Anthropic_Harness/` (legacy - verificar)
- Skills: `01_Core/03_Skills/14_Anthropic_Harness/`

---

## 🏆 Resultados Esperados

Según Anthropic:

| Métrica         | Solo Generator     | Full Harness     |
|-----------------|--------------------|------------------|
| **Tiempo**      | 20 min             | 6 hr             |
| **Costo**       | $9                 | $200             |
| **Resultado**   | App rotas          | App funcional    |

> "The game built by the full harness actually was functional"

---

*Creado: 2026-03-26 | Filosofía: "No te traiciones, no te abandones"*
