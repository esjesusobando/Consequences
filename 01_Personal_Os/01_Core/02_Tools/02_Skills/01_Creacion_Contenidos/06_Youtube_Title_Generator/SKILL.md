---
name: youtube-title-generator
description: "Genera títulos de YouTube con variantes, scoring de CTR y recomendación final. Triggers on: youtube titles, CTR optimization, title A/B testing, video headlines, click-through rate scoring"
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Youtube Title Generator

> Genera múltiples títulos optimizados para YouTube con scoring.

## Esencia Original

- **Metaskill**: Convertir el contenido de un video en 10+ variantes de título con scoring cuantificable (CTR, searchability, brand fit), emulando el trabajo de un equipo degrowth hacking editorial.
- **Propósito original**: Resolver el problema de que creators pasan más tiempo del necesario eligiendo títulos — esta skill aplica fórmulas probadas (how-to, numbers, controversy, story) y las rankea objetivamente para maximizar clicks sin perder autenticidad.

## Propósito

Toma el guion o contenido de un video y genera 10+ variantes de título con análisis de CTR estimado, ayudarte a elegir el mejor para maximizar clicks y engagement.

## Cuándo Usar

- Después de tener el guion (Agent 14)
- Para A/B testing de títulos
- Cuando necesitas múltiples opciones para probar

## Input

- **Guion o resumen del video**: Para entender el contenido
- **Tema principal**: Keywords principales
- **Estilo del canal**: Educativo, entretenimiento, vlog, etc.

## Proceso

1. **Analizar** el contenido → extraer emotion triggers
2. **Generar** 10+ variantes usando diferentes fórmulas:
   - How-to / Tutorial
   - Listicle (X ways, X tips)
   - Problem/Solution
   - Resultado específico (X días, $X, %X)
   - Contradiction / Controversy
   - Story-driven
3. **Scoring** cada título por:
   - CTR potencial (1-10)
   - Searchability (1-10)
   - Brand fit (1-10)
4. **Ranking** y recomendación final

## Output

```markdown
# TÍTULOS PARA: [Nombre del Video]

## TOP 3 RECOMENDADOS

### 🥇 #1: [Título]
- **Score total:** 8.5/10
- **CTR:** 8/10 | **Search:** 9/10 | **Brand:** 8/10
- **Por qué funciona:** [Razón]
- **Usar para:** [A/B test / Video principal]

### 🥈 #2: [Título]
- **Score total:** 8/10
- **CTR:** 9/10 | **Search:** 7/10 | **Brand:** 8/10
- **Por qué funciona:** [Razón]

### 🥉 #3: [Título]
- **Score total:** 7.5/10

---

## TODAS LAS VARIANTES

| #                                | Título                                  | CTR                                | Search                                | Brand                                | Total                                |
|---------------------------------|----------------------------------------|-----------------------------------|--------------------------------------|-------------------------------------|-------------------------------------|
| 1                                | [Título 1]                              | 8                                  | 9                                     | 8                                    | 8.3                                  |
| 2                                | [Título 2]                              | 9                                  | 7                                     | 8                                    | 8.0                                  |
| ...                              | ...                                     | ...                                | ...                                   | ...                                  | ...                                  |

---

## FÓRMULAS USADAS

- [ ] How-to: "[Cómo/How to]..."
- [ ] Numbers: "[X] ways/tips..."
- [ ] Result: "[Gané/Logré] $X en X..."
- [ ] Question: "[Por qué/Can you...]"
- [ ] Story: "[La vez que/When I...]"

---

## NOTAS

- **Longitud ideal:** 50-60 caracteres
- **Evitar:** Todo en mayúsculas,过多的感叹号
- **Tests A/B:** Usar #1 y #3 para testear
```

## Ejemplo

**Input:** Video sobre "AI para crear contenido"
**Output:** 12 títulos con scores, incluyendo "Cómo tripliqué mi producción de contenido con AI (sin ser experto)"

---

## ⚠️ Gotchas

1. **Títulos que sobre-prometen y dañan la retención**
   - **Por qué**: El scoring de CTR puede favorecer títulos agresivos que maximizan clicks pero generan decepción cuando el video no cumple, destruyendo la confianza del canal a largo plazo.
   - **Solución**: Incluir un filtro de "promesa realista" que verifique que el título no exceda lo que el guion realmente entrega — priorizar títulos con score balanceado (CTR + Brand fit) sobre los de CTR puro.

2. **Keywords stuffing que mata la legibilidad**
   - **Por qué**: Al optimizar para searchability, la skill puede generar títulos cargados de keywords que suenan robóticos o forzados, reduciendo el click real aunque el score de search sea alto.
   - **Solución**: Añadir una regla de "natural language test": el título debe sonar natural cuando se lee en voz alta. Penalizar en el scoring si parece una sopa de keywords.

3. **Sesgo cultural en las fórmulas de título**
   - **Por qué**: Fórmulas como "how-to" o "numbers" funcionan distinto en audiencias de habla hispana vs inglesa. Un título que funciona en USA puede sonar artificial en LATAM.
   - **Solución**: Parametrizar el "mercado objetivo" en el input y ajustar las fórmulas y ejemplos según el contexto cultural y regional del canal.

## 💾 State Persistence

Esta skill es stateless. Cada invocación genera títulos basados exclusivamente en el guion/resumen proporcionado. No hay memoria de títulos generados previamente para el mismo contenido. Para A/B testing histórico, el orquestador debe gestionar el registro de variantes usadas y sus resultados.

---

*Agent 16 de Marketing Team*
*Anterior: 15_Youtube_Thumbnail_Prompter*
