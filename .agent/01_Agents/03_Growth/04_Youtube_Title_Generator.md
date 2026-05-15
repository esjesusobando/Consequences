# 04_Youtube_Title_Generator

> Genera múltiples títulos optimizados para YouTube con scoring.

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

| #             | Título               | CTR             | Search             | Brand             | Total             |
|---------------|----------------------|-----------------|--------------------|-------------------|-------------------|
| 1             | [Título 1]           | 8               | 9                  | 8                 | 8.3               |
| 2             | [Título 2]           | 9               | 7                  | 8                 | 8.0               |
| ...           | ...                  | ...             | ...                | ...               | ...               |

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

*Agent 16 de Marketing Team*
*Anterior: 15_Youtube_Thumbnail_Prompter*
