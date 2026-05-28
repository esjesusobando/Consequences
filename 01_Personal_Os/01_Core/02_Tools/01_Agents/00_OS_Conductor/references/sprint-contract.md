# 📜 Sprint Contract — Template y Protocolo

> **Propósito:** Template reutilizable para el patrón Sprint Contract de Anthropic 2.0.
> **Cargar cuando:** Se inicia un flujo compuesto y se necesita negociar "done" con el usuario.

---

## 🧠 ¿Por qué Sprint Contract?

El patrón Sprint Contract evita:

- **Scope creep:** el usuario agrega requisitos después de empezar
- **Moving goalpost:** el agente declara "done" prematuramente
- **Ambigüedad:** "terminado" significa cosas distintas para cada persona

**Filosofía:** "Generator + Evaluator negocian 'done' antes de cada sprint. El Generator no puede mover el goalpost durante el build."

---

## 📋 Template de Contrato

```
📜 SPRINT CONTRACT
====================
ID: [flow-name]-[yyyy-mm-dd]
Feature: [lo que el usuario pidió]
Status: [PROPOSED | AGREED | IN_PROGRESS | FULFILLED | REJECTED]

📋 CRITERIOS ACORDADOS:
  1. [ ] [Criterio verificable 1] (verificación: [automated|manual|test])
  2. [ ] [Criterio verificable 2] (verificación: [automated|manual|test])
  3. [ ] [Criterio verificable 3] (verificación: [automated|manual|test])

====================
```

---

## 📏 Reglas del Sprint Contract

### 1. Negociar ANTES de ejecutar
Nunca empieces un flujo compuesto sin un contract firmado.

### 2. Criterios específicos y verificables
| ❌ Mal | ✅ Bien |
|--------|---------|
| "La campaña debe estar lista" | "Campaña de ads configurada con audiencia targeting y 3 creativos aprobados" |
| "El contenido debe ser bueno" | "Post de LinkedIn escrito con hook, desarrollo y CTA" |
| "Que funcione" | "Workflow N8N validado con 3 casos de test pasando" |

### 3. Cada criterio tiene un tipo de verificación
| Tipo | Qué significa | Quién verifica |
|------|---------------|----------------|
| `automated` | Se puede verificar automáticamente (test, validación) | Skill/agente |
| `manual` | Requiere revisión humana | Usuario |
| `test` | Requiere test unitario o E2E | Agent Teams / SDD |

### 4. Binding
Ambos (Conductor y usuario) cumplen lo acordado. Si el usuario cambia de opinión, se firma un nuevo contract — no se modifican criterios a mitad de ejecución.

---

## 🔄 Flujo del Sprint Contract

```
USUARIO: pide algo
    │
    ▼
CONDUCTOR: propone criterios de "done"
    │
    ▼
USUARIO: acepta / modifica / rechaza
    │
    ├── Acepta → CONTRATO FIRMADO → ejecutar
    ├── Modifica → ajustar criterios → re-propone → vuelve a ▼
    └── Rechaza → preguntar qué esperaba → redefinir contract
    │
    ▼
EJECUCIÓN: skills trabajan
    │
    ▼
VERIFICACIÓN: cada skill reporta contra sus criterios
    │
    ├── ✅ Todo OK → "Contract fulfilled"
    └── ❌ Falló → re-ejecutar paso (máx 2) o escalar
```

---

## 💡 Ejemplos

### Buen Contract
```
📜 SPRINT CONTRACT
ID: lanzamiento-producto-2026-05-28
Feature: Lanzar newsletter semanal
Status: AGREED

📋 CRITERIOS ACORDADOS:
  1. [✅] Brand voice definido con tono y ejemplos (verificación: manual)
  2. [✅] Template de email diseñado en Figma (verificación: manual)
  3. [✅] 3 ediciones piloto escritas (verificación: manual)
  4. [✅] Formulario de suscripción configurado (verificación: automated)
  5. [✅] Campaña de bienvenida automática en N8N (verificación: test)
```

### Mal Contract
```
📜 SPRINT CONTRACT
ID: lanzamiento-producto-2026-05-28
Feature: Newsletter
Status: AGREED

📋 CRITERIOS ACORDADOS:
  1. [ ] Que esté lindo
  2. [ ] Que funcione
  3. [ ] Listo
```

---

*OS Conductor v2.0 — Anthropic 2.0 Harness — 2026-05-28*
