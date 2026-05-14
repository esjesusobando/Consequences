---
name: dumbledor-design
description: "Design editorial de alto impacto con jerarquía visual de 3 niveles y contraste binario. Aplica principios de tipografía强硬 (Knockout HTF, Mark Pro), paleta Dominante-Acento, y tensión por contraste extremo. Para crear piezas que parecen 'caras y con intención' — diseño funcional, no decorativo."
---

# Dumbledor Design

Diseño editorial de alto impacto basado en la metodología de contraste binario y jerarquía visual de 3 niveles.

## Filosofía Central

**"El éxito se ve como una pieza que parece 'cara y con intención'. No es un diseño decorativo, es un diseño funcional que utiliza la agresividad visual (pesos pesados) y el minimalismo estratégico para transmitir control, disciplina y resultados inmediatos."**

---

## Sistema de Jerarquía Visual (3 Niveles)

### Nivel 1 — Impacto Brutal (Headline)
- **Fuente:** Knockout HTF (o fallback: Impact, Bebas Neue)
- **Tracking:** Cerrado (letter-spacing: -0.02em a -0.05em)
- **Características:** Bloque sólido, se lee como imagen, no como palabras
- **Regla:** Títulos cortos (2-5 palabras máximo)

### Nivel 2 — Anclaje (Statement)
- **Fuente:** Mark Pro Black (o fallback: Helvetica Neue Bold, Arial Black)
- **Propósito:** Dar contexto sin competir con el headline
- **Característica:** Soporta el mensaje, ancla la composición

### Nivel 3 — Refinamiento (Cuerpo)
- **Fuente:** Mark Pro Light (o fallback: Helvetica Neue Light, Arial)
- **Propósito:** Elegancia, ritmo, descanso visual
- **Característica:** Cuerpos de texto, bajadas, detalles editoriales

---

## Arquitectura de Color "Dominante-Acento"

### Paleta Base

| Color                      | Rol                 | Uso Estratégico                                      |
|----------------------------|---------------------|------------------------------------------------------|
| **Rojo intenso**           | Acento              | Energía, urgencia, decisión. Call to action.         |
| **Azul eléctrico**         | Base sólida         | Profundidad, contraste, confianza                    |
| **Negro**                  | Ancla               | Control, elegancia, control visual                   |
| **Grises**                 | Respiro             | Evitan que todo grite al mismo tiempo                |

### Reglas de Aplicación

1. **1 color dominante** — El que más área cubre
2. **1 color de acento** — Rojo para打断 el ritmo y llamar atención
3. **El resto como soporte** — Negros y grises para структурная база

### Errores Fatales

- ❌ Usar rojo y azul con la misma jerarquía
- ❌ Meter todos los colores en el mismo plano
- ❌ Falta de contraste en tipografía
- ❌ Usar "pesos medios" (Medium, Regular) — estos matan la tensión

---

## Regla de Contraste Binario

El sistema rechaza los "puntos medios". Éxito visual mediante контраст:

```
O es muy grueso O es muy delgado
O es color vibrante (Rojo/Azul) O es neutro (Negro/Blanco)
```

**Resultado:** Elimina la ambigüedad → proyecta autoridad y claridad mental.

### Implementación Práctica

```css
/* IMPACTO: Headlines en peso máximo */
.headline {
  font-family: 'Impact', 'Bebas Neue', sans-serif;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

/* ANCLAJE: Statements en peso alto */
.statement {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 700;
}

/* REFINAMIENTO: Cuerpo en peso ligero */
.body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  line-height: 1.6;
}
```

---

## Sistema de Tensión Visual

### Contraste de Peso
```css
/* TENSIÓN MÁXIMA: Black vs Light */
.headline { font-weight: 900; }
.body { font-weight: 300; }
/* Resultado: El ojo立刻lee el contraste */
```

### Contraste de Color
```css
/* ACENTO que guía: Rojo sobre fondo oscuro */
.cta {
  color: #E63946;
  font-weight: 700;
}

/* BASE que ancla: Azul profundo */
.hero {
  background: #1D3557;
  color: #F1FAEE;
}
```

---

## Aplicación por Tipo de Pieza

### Presentaciones (Slides)
- Headline: Knockout HTF, 72-96px, tracking cerrado
- Statement: Mark Pro Black, 32-48px
- Body: Mark Pro Light, 18-24px, line-height 1.5

### Landing Pages
- Hero headline: Impact/Bebas, viewport width
- Subheadline: Helvetica Bold
- Body: Helvetica Light, max-width 65ch

### Posts / Cards
- Headline: Bold, uppercase, tracking
- Accent: Rojo para números o highlights
- Body: Light, opacity 0.8

---

## Checklist de Calidad Dumbledor

- [ ] Headline usa peso EXTREMO (900/black)
- [ ] Tracking cerrado en headlines
- [ ] Contraste binario: nunca medios pesos
- [ ] 1 color dominante, 1 acento (rojo)
- [ ] Tensión visual: lo pesadovs lo ligero
- [ ] Body con line-height mínimo 1.5
- [ ] No hay elementos compitiendo por atención
- [ ] La pieza "obliga" al ojo a procesar en <2 segundos

---

## Fallback Strategy

Si las fuentes originales no están disponibles:

| Original               | Fallback 1                   | Fallback 2           |
|------------------------|------------------------------|----------------------|
| Knockout HTF           | Bebas Neue                   | Impact               |
| Mark Pro Black         | Helvetica Neue Bold          | Arial Black          |
| Mark Pro Light         | Helvetica Neue Light         | Arial                |

---

## Fuentes de Inspiración

- Diseño editorial de Vogue, Harper's Bazaar
- Carteles de Helmut Lang, Maison Margiela
- Arquitectura visual de Virgil Abloh
- Propaganda gráfica soviética (contraste brutal)
- Tipografía suiza moderna (Bauhaus influence)
