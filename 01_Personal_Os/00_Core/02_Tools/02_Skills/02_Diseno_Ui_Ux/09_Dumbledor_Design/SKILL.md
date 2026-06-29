---
name: dumbledor-design
description: "Design editorial de alto impacto con jerarquía visual de 3 niveles y contraste binario. Aplica principios de tipografía强硬 (Knockout HTF, Mark Pro), paleta Dominante-Acento, y tensión por contraste extremo. Para crear piezas que parecen 'caras y con intención' — diseño funcional, no decorativo. Triggers on: diseño editorial, alto impacto, contraste binario, tipografía bold, jerarquía visual editorial, paleta dominante-accento, diseño de presentaciones"
sota_upgraded: true
---

# Dumbledor Design

Diseño editorial de alto impacto basado en la metodología de contraste binario y jerarquía visual de 3 niveles.

## Esencia Original

**Metaskill**: Metodología de diseño editorial de alto impacto basada en contraste binario extremo. No es un theme UI ni un sistema de componentes — es una **filosofía de tensión visual** que rechaza los puntos medios: todo es o muy grueso o muy delgado, o muy vibrante o neutro. Resuelve el problema de cómo hacer que una pieza de diseño se vea "cara y con intención" sin decoración superflua.

**Propósito original**: Crear piezas editoriales que proyectan autoridad, control y disciplina a través de la agresividad visual controlada. Nace de la observación de que el diseño funcional (no decorativo) comunica mejor cuando usa pesos tipográficos extremos y paletas dominante-accento en lugar de múltiples colores compitiendo.

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

| Color                               | Rol                          | Uso Estratégico                                               |
|------------------------------------|-----------------------------|--------------------------------------------------------------|
| **Rojo intenso**                    | Acento                       | Energía, urgencia, decisión. Call to action.                  |
| **Azul eléctrico**                  | Base sólida                  | Profundidad, contraste, confianza                             |
| **Negro**                           | Ancla                        | Control, elegancia, control visual                            |
| **Grises**                          | Respiro                      | Evitan que todo grite al mismo tiempo                         |

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

## ⚠️ Gotchas

### Usar pesos medios en lugar de extremos
> Elegir `font-weight: 500` o `600` en titulares porque "se ve bien en el editor".

- **Por qué**: Los pesos medios destruyen el contraste binario. El sistema Dumbledor funciona en extremos: Black (900) vs Light (300). Medium no es ni impacto ni refinamiento — es ambigüedad visual.
- **Solución**: Headlines siempre en 800-900. Body siempre en 300. Si no tienes la fuente exacta, usar los fallbacks (Bebas Neue / Impact para headlines, Helvetica Light para body).

### Rojo y azul con la misma jerarquía
> Usar rojo para un headline y azul para otro headline, o rojo para un CTA y azul para otro CTA.

- **Por qué**: Dos colores fuertes compitiendo por atención = ruido visual. El ojo no sabe a dónde mirar. El sistema Dumbledor exige **1 dominante + 1 acento**.
- **Solución**: Elegir: ¿el azul es fondo dominante o el rojo es acento? Nunca los dos al mismo nivel. Si el fondo es azul, el acento es rojo (solo en CTAs, badges, highlights).

### Tracking incorrecto en headlines
> Dejar `letter-spacing: normal` o usar tracking positivo (expandido).

- **Por qué**: El tracking cerrado (`-0.02em` a `-0.05em`) hace que el headline se lea como una imagen, no como palabras. Es la diferencia entre un título de PowerPoint y un titular de revista Vogue.
- **Solución**: Aplicar tracking negativo agresivo en headlines. Short headlines (2-5 palabras) con `text-transform: uppercase` y `letter-spacing: -0.03em`.

### Body con line-height insuficiente
> Usar `line-height: 1.2` en body text porque ahorra espacio.

- **Por qué**: El body en peso Light necesita respirar. `line-height < 1.5` hace que el texto refinado se vea apretado y pierde su elegancia.
- **Solución**: Mínimo `line-height: 1.5` en body text Light. Idealmente `1.6-1.8` para máxima legibilidad editorial.

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

| Original                        | Fallback 1                            | Fallback 2                    |
|--------------------------------|--------------------------------------|------------------------------|
| Knockout HTF                    | Bebas Neue                            | Impact                        |
| Mark Pro Black                  | Helvetica Neue Bold                   | Arial Black                   |
| Mark Pro Light                  | Helvetica Neue Light                  | Arial                         |

---

## Fuentes de Inspiración

- Diseño editorial de Vogue, Harper's Bazaar
- Carteles de Helmut Lang, Maison Margiela
- Arquitectura visual de Virgil Abloh
- Propaganda gráfica soviética (contraste brutal)
- Tipografía suiza moderna (Bauhaus influence)

---

## 💾 State Persistence

### What to persist between sessions

| Dato                                | Cómo se persiste                                   | Cuándo restaurar                                                         |
|------------------------------------|---------------------------------------------------|-------------------------------------------------------------------------|
| **Paleta dominante-accento elegida**| Variables CSS o notas de sesión                    | Al iniciar un nuevo proyecto editorial                                   |
| **Fallback fonts verificados**      | Lista de fuentes disponibles en el sistema/proyecto| Cada sesión — verificar que Knockout/Impact/Bebas están instalados       |
| **Checklist de calidad aprobada**   | `mem_save` con el último checklist completado      | Si el usuario pide "usar la misma configuración que el proyecto anterior"|

### Reglas de persistencia
- **NO** persistir diseños completos — el output HTML es el source of truth
- **SÍ** guardar la configuración de paleta (dominante + acento) para consistencia entre piezas
- Las fuentes instaladas se verifican al inicio de cada sesión


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
