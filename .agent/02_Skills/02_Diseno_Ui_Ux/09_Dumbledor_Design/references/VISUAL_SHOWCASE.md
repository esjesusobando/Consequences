# Dumbledor Design — Referencias Visuales

## Sistema de Jerarquía de 3 Niveles

### Nivel 1: Impacto Brutal (Headline)
```
FUENTE: Knockout HTF / Impact / Bebas Neue
PESO: 900 (Black)
TRACKING: -0.03em a -0.05em
TRATAMIENTO: UPPERCASE
EJEMPLO: "DESIGN YOUR ENVIRONMENT"
```

### Nivel 2: Anclaje (Statement)
```
FUENTE: Mark Pro Black / Helvetica Neue Bold
PESO: 700 (Bold)
TRACKING: normal
EJEMPLO: "La metodología del éxito visual"
```

### Nivel 3: Refinamiento (Cuerpo)
```
FUENTE: Mark Pro Light / Helvetica Neue Light
PESO: 300 (Light)
LINE-HEIGHT: 1.6
EJEMPLO: "Cuerpo de texto editorial con elegancia..."
```

---

## Paleta Dominante-Acento

### Composición Visual
```
┌─────────────────────────────────────┐
│  ████ AZUL ELECTRICO (dominante)   │ ← Fondo principal
│                                     │
│  ┌─────────────────────────────┐   │
│  │  HEADLINE BLANCO / NEGRO     │   │ ← Máxima jerarquía
│  └─────────────────────────────┘   │
│                                     │
│  Statement en MARK PRO BLACK        │ ← Segundo nivel
│                                     │
│  ██ ROJO INTENSO ██                 │ ← Acento/CTA
│                                     │
│  Grises para respiro...             │ ← Tercer nivel
└─────────────────────────────────────┘
```

### Aplicación de Color
| Elemento                    | Color                          | Hex                      | Propósito                              |
|----------------------------|-------------------------------|-------------------------|---------------------------------------|
| Fondo hero                  | Azul profundo                  | #1D3557                  | Base sólida                            |
| Headline                    | Blanco                         | #F1FAEE                  | Impacto máximo                         |
| Statement                   | Negro                          | #1D1D1D                  | Anclaje                                |
| Acento/CTA                  | Rojo vivo                      | #E63946                  | Urgencia, decisión                     |
| Body                        | Gris medio                     | #6C757D                  | Refinamiento, lectura                  |

---

## Contraste Binario — Visualización

### LO QUE SÍ HACER (Contraste extremo)
```
✅ HEADLINE: weight 900 — BODY: weight 300
✅ ROJO intenso — GRIS neutro
✅ MAYÚSCULA — minúscula
✅ TAMAÑO GRANDE — tamaño pequeño
```

### LO QUE NO HACER (Pesos medios = caos)
```
❌ weight 500 (Medium) — ambiguo, sin tensión
❌ weight 400 (Regular) — olvidable, sin impacto
❌ Todos los colores misma jerarquía
```

---

## Ejemplo de Aplicación: Card de Feature

```html
<div class="feature-card">
  <span class="feature-number">01</span>  <!-- ROJO, weight 900 -->
  <h2 class="feature-headline">IMPACTO BRUTAL</h2>  <!-- BLACK, uppercase -->
  <p class="feature-body">Refinamiento tipográfico que aporta
  elegancia y permite que el ojo descanse.</p>  <!-- Light, 300 -->
</div>
```

```css
.feature-number {
  color: #E63946;  /* Rojo = acento */
  font-weight: 900;
  font-size: 2rem;
}

.feature-headline {
  font-family: 'Impact', sans-serif;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.feature-body {
  font-weight: 300;
  line-height: 1.6;
  color: #6C757D;
}
```

---

## Checklist Visual Rápido

```
□ Headline: peso 900, tracking cerrado, uppercase
□ Statement: peso 700, sin competir con headline
□ Body: peso 300, line-height 1.6 mínimo
□ Color dominante: 1 solo (azul o negro)
□ Color acento: rojo (#E63946) para CTAs
□ Contraste binario: nunca pesos medios
□ Tensión visual: lo pesado contrasta con lo ligero
```

---

## Inspiración: Referencias Reales

1. **Vogue Magazine** — Jerarquía tipográfica brutal
2. **Helmut Lang** — Carteles de impacto máximo
3. **Virgil Abloh** — Arquitectura visual Off-White
4. **Propaganda soviética** — Contraste rojo/negro/blanco
5. **Bauhaus** — Tipografía suiza moderna
