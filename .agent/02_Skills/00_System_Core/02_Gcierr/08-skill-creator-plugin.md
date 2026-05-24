# Meta-skill: crea tus propias skills

> Demo 08 - Skill Creator Plugin
> Fecha: 2026-04-17
> Audiencia: video corto (3-4 min) para devs y tech leads

---

## 1. El problema: skills hechas a mano duelen

Cada vez que quieres automatizar algo repetitivo en Claude Code (resumir PRs, generar assets, auditar codigo) necesitas escribir una **Skill**: una carpeta con `SKILL.md` + archivos auxiliares + YAML frontmatter correcto + triggers bien redactados.

El problema: escribirlas a mano es **aburrido y propenso a errores**. El frontmatter se rompe, el trigger queda ambiguo, te olvidas del scope, y Claude termina invocando la skill cuando no debe (o peor, nunca la invoca).

La solucion: **Skill Creator Plugin**, una meta-skill oficial de Anthropic que crea skills por ti.

---

## 2. Que es Skill Creator

Plugin interno que se instala desde dentro de Claude Code:

```
/plugin  ->  buscar "Skill creator"  ->  Install
```

No tiene un `SKILL.md` externo (es parte del nucleo del plugin manager). Una vez instalado, puedes invocarlo con lenguaje natural:

> "Crea una skill para generar thumbnails de YouTube con Gemini"

Y genera la estructura completa siguiendo las best practices de Anthropic.

---

## 3. Diagrama: del caos a la skill pulida

```
   +-------------------+        +-------------------+        +----------------------+
| IDEA VAGA        |      | SKILL CREATOR     |      | OUTPUT: SKILL.md   |
|                  |      |                   |      | + assets + README  |
| "quiero algo que | ---> | - Pregunta scope  | ---> |                    |
| resuma PRs       |      | - Sugiere trigger |      | + YAML frontmatter |
| para mi jefe"    |      | - Genera YAML     |      | + trigger pulido   |
|                  |      | - Crea carpeta    |      | + 3 ejemplos       |
   +-------------------+        +-------------------+        +----------------------+
                                        |
                                        v
                              +---------------------+
                              |  Best practices     |
                              |  injected:          |
                              |  - trigger claro    |
                              |  - scope limitado   |
                              |  - evidence-based   |
                              +---------------------+
```

---

## 4. Workflow de creacion: 3 fases

### Fase 1 - Discovery (2 min)

El plugin te interroga en lenguaje natural:

```
Skill Creator: Que problema concreto resuelve esta skill?
You: Resumir PRs de GitHub con tono ejecutivo para mi CEO.

Skill Creator: Cual es el trigger que deberia activarla?
You: Cuando me pidan un "resumen ejecutivo del PR X".

Skill Creator: Que archivos auxiliares necesita?
You: Un template de email y un prompt de tono.
```

### Fase 2 - Scaffolding (30 seg)

Genera la estructura de archivos con `Write` y valida el YAML frontmatter.

### Fase 3 - Testing (1 min)

Corre un caso de ejemplo en dry-run y te muestra el output. Si falla el trigger, ofrece refinarlo.

---

## 5. Tres skills creadas con esta meta-skill

### Skill 1: generador de thumbnails para YouTube

**Prompt usado:**
> "Crea una skill reutilizable para generar imagenes con Gemini AI" (ver `demo_generador_imagenes.py` en `/Users/agustinmedina/Claude/skill-creator-plugin/`)

**Estructura generada:**

```
youtube-thumbnail-generator/
|-- SKILL.md
|-- scripts/
|   |-- demo_generador_imagenes.py    <- generado por el plugin
|   +-- batch_render.sh
|-- templates/
|   |-- thumbnail_1x1.json
|   +-- thumbnail_16x9.json
+-- examples/
    +-- cyberpunk_saas_ui.png
```

**Snippet de SKILL.md:**

```yaml
---
name: youtube-thumbnail-generator
description: Genera thumbnails de YouTube usando Gemini 3.1 Flash
             Image Preview. Activar cuando el usuario pida "crear
             thumbnail", "portada para video" o "imagen 16:9".
triggers:
  - crear thumbnail
  - portada para video
  - render imagen con gemini
scope: limited
---
```

### Skill 2: resumidor de PRs con tono ejecutivo

**Prompt usado:**
> "Necesito una skill que lea un PR de GitHub y genere un resumen de 3 bullets para mi CEO, sin jerga tecnica."

**Estructura generada:**

```
executive-pr-summarizer/
|-- SKILL.md
|-- prompts/
|   |-- tone_executive.md
|   +-- tone_investor.md
|-- templates/
|   +-- email_template.md
+-- examples/
    |-- pr_12345_summary.md
    +-- pr_67890_summary.md
```

**Trigger generado:**
```yaml
description: Resume PRs de GitHub en 3 bullets ejecutivos sin jerga
             tecnica. Activar cuando pidan "resumen para CEO",
             "executive summary del PR" o "email para stakeholder".
```

### Skill 3: auditor de accesibilidad WCAG

**Prompt usado:**
> "Crea una skill que audite componentes React contra WCAG 2.2 nivel AA y me diga que falta."

**Estructura generada:**

```
wcag-accessibility-auditor/
|-- SKILL.md
|-- rules/
|   |-- wcag_2_2_AA.json
|   |-- aria_roles.md
|   +-- contrast_ratios.md
|-- scripts/
|   |-- audit_component.py
|   +-- generate_report.sh
+-- examples/
    |-- Button_audit.md
    +-- Modal_audit.md
```

**Trigger generado:**
```yaml
description: Audita componentes React/HTML contra WCAG 2.2 nivel AA.
             Reporta contraste, roles ARIA, keyboard nav, focus order.
             Activar cuando pidan "auditoria de accesibilidad",
             "revisar WCAG" o "componente accesible?".
```

---

## 6. Template universal que el plugin genera

Todo `SKILL.md` creado por Skill Creator sigue esta estructura:

```markdown
---
name: nombre-kebab-case
description: Una frase de 2 lineas con QUE hace y CUANDO activarse.
             Siempre incluye "Activar cuando...".
triggers:
  - frase literal 1
  - frase literal 2
  - frase literal 3
scope: limited | broad
version: 0.1.0
---

# <Nombre legible>

## Proposito
Un parrafo claro del problema que resuelve.

## Cuando usar (y cuando NO)
- USAR: escenario A, escenario B
- NO USAR: escenario X (usar skill Y en su lugar)

## Workflow
Pasos concretos que Claude debe seguir.

## Archivos auxiliares
- `scripts/foo.py`: hace X
- `templates/bar.md`: template para Y

## Ejemplos
3 input/output pairs reales.
```

---

## 7. Tips: que hace una skill *excelsa*

| Dimension                         | Skill pobre                          | Skill excelsa                                               |
|-----------------------------------|--------------------------------------|-------------------------------------------------------------|
| **Trigger**                       | "ayuda con codigo"                   | "auditar WCAG 2.2 AA de componente React"                   |
| **Scope**                         | hace 10 cosas                        | hace 1 cosa muy bien                                        |
| **Evidence**                      | "yo creo que..."                     | cita archivo, linea, regla WCAG                             |
| **Frontmatter**                   | roto, sin triggers                   | YAML valido + triggers literales                            |
| **Ejemplos**                      | cero                                 | 3+ input/output reales                                      |
| **Auxiliares**                    | todo inline                          | scripts/templates en archivos separados                     |

**Regla de oro:** si el trigger es ambiguo, la skill nunca se activa cuando debe. Skill Creator te **obliga** a pulir el trigger antes de guardar.

---

## 8. Caso de uso estrella: 15 skills en una tarde

Un equipo de plataforma de una fintech latinoamericana (8 devs) uso Skill Creator en un hackaton interno de 4 horas. Resultado:

- **15 skills internas creadas**, todas con SKILL.md + auxiliares + ejemplos
- Areas cubiertas: onboarding de repos, auditoria de IaC, resumen de incidentes, generacion de runbooks, triage de Sentry, changelog automation, seed de fixtures, smoke tests de deploy, revision de migrations, etc.
- **Tiempo promedio por skill: 16 min** (vs 2-3 horas a mano)
- Adopcion en el equipo: **95% en la primera semana** (todas las skills se invocaron al menos una vez)
- Las 15 skills viven en un repo compartido y se instalan con `/plugin marketplace add <repo>`

**Lesson learned del lead:**
> "Skill Creator nos forzo a escribir triggers literales. Antes teniamos 'prompts magicos' que solo algunos sabian invocar. Ahora cualquier junior los dispara solo."

---

## 9. Cierre para el video

**Hook (0-10s):**
> "Que pasaria si Claude Code pudiera crear sus propias skills? Hoy te muestro la meta-skill."

**Demo (10-120s):**
1. Mostrar `/plugin` -> instalar Skill Creator
2. Decir: "crea una skill para generar thumbnails con Gemini"
3. Plugin pregunta 3 cosas, genera la carpeta
4. Mostrar arbol de archivos resultante
5. Probar la skill: "generame thumbnail cyberpunk SaaS" -> corre `demo_generador_imagenes.py`

**Punchline (120-180s):**
> "Un equipo hizo 15 skills en una tarde. Cuantas tiene tu equipo?"

**CTA:**
> "/plugin -> Skill creator -> Install. La meta-skill que te ahorra 2 horas por skill."

---

## Referencias

- `/Users/agustinmedina/Claude/skill-creator-plugin/INSTRUCCIONES.md`
- `/Users/agustinmedina/Claude/skill-creator-plugin/demo_generador_imagenes.py`
- Anthropic Skills best practices (docs.claude.com/skills)
