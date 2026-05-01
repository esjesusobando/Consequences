# PRODUCT.md — Presentación IA SOTA

## 1. Audience

**Quién consume este contenido:**
- Profesionales técnicos (developers, architects, product managers)
- Hispanoparlantes con nivel intermedio de inglés técnico
- Contexto: Transcripción de video de 30min sobre IA moderna

**Situaciones de lectura:**
- Viewing en pantalla grande (presentación/proyector)
- Review individual en laptop
- Skimming selective (buscando perlas de sabiduría)

---

## 2. Register

**Nivel de formalidad:** Semi-formal, accesible, con autoridad técnica. No es un paper académico, pero tampoco es clickbait.

**Tono:** Clínico, directo, sin hype. Inspirado en la estética de impeccable.style — calmado, profesional, con intención.

**Analogía:** Un paper de investigación presentado como keynote de conference. El rigor del primero con la accesibilidad del segundo.

---

## 3. Voice

**Palabras que SÍ usamos:**
- Preciso, específico, accionable
- "El modelo aprende a..." no "La IA revoluciona..."
- Datos concretos, numbers reales, timestamps

**Palabras que NO usamos:**
- "Disruptivo", "game-changer", "next-gen"
- "Imagina un futuro donde..."
- Exclamaciones excesivas

**Anti-hype manifesto:** Cada claim debe poder defenderse con evidencia o ejemplo concreto.

---

## 4. Anti-references

**Lo que NO queremos (y por qué):**

| Anti-pattern | Por qué está mal | Referencia buena |
|--------------|------------------|------------------|
| Purple gradients | Hype infantil, readability killed | Navy profundo (#1E2530) |
| Glassmorphism | Distraction, no function | Solid cards con borde sutil |
| Glowing neons | 2019 vibes, cansado | Naranja acento (#FF6B35) estratégico |
| Centrifugado胡乱 | Chaos sin jerarquía | Grid limpio, alineación estricta |
| Peso tipográfico uniforme | Sin tensión visual, aburrido | Headline bold → body light |

**Diseño "viejo" que descartamos:**
- Fondos claros con texto oscuro
- PowerPoint blue default
- Iconos de Font Awesome genéricos
- "Bullet points" como estructura principal

---

## 5. Visual Language (Extraído de referencias)

### Palette (Dominante-Acento modificada)
```
Dominante:  Navy profundo (#1E2530) — fondo principal
Ancla:      Blanco (#FFFFFF) — texto principal
Acento:     Naranja (#FF6B35) — numbers, badges, highlights
Respaldo:   Gris (#414B5A) — borders de cards
Refinamiento: Gris claro (#6B7785) — body text secundario
```

### Typography
```
Headline:   Inter Bold/Black, 48-72px, uppercase
Statement:  Inter SemiBold, 24-32px
Body:       Inter Regular/Light, 16-20px, line-height 1.6
Metadata:   Inter Medium, 12-14px, color gris
```

### Composición
```
Cards:      Border 1px #414B5A, border-radius 8px, padding 24px
Dividers:   Línea horizontal #414B5A, 1px
Badges:     Background #FF6B35, text white, padding 4px 12px, radius 4px
Numbers:    Font-size 48-72px, color #FF6B35, font-weight 900
```

---

## 6. Structure

### Formato de cada slide
```
┌─────────────────────────────────────────┐
│ [Badge: TOPIC]                          │
│                                         │
│ HEADLINE EN MAYÚSCULA                    │
│ (Inter Bold, 48-72px)                    │
│                                         │
│ Statement de contexto                   │
│ (Inter SemiBold, 24-32px)               │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ Card con frontera sutil            │   │
│ │ Body text en gris claro            │   │
│ └───────────────────────────────────┘   │
│                                         │
│ [Footer: número de slide]               │
└─────────────────────────────────────────┘
```

### Jerarquía de 3 niveles (adaptado de Dumbledor)
1. **Impacto:** Badge + Headline (el ojo llega primero)
2. **Anclaje:** Statement que da contexto
3. **Refinamiento:** Cards con body text

---

## 7. Constraints

**No podemos cambiar:**
- Contenido (transcripción YouTube)
- Duración (25 slides)
- Plataforma de output (HTML/CSS/JS)

**Sí podemos cambiar:**
- Visual design
- Layout y estructura
- Animaciones y transiciones
- Tipografía y color

---

## 8. Success Criteria

La presentación es exitosa si:
- [ ] Se puede leer en proyector (contraste alto)
- [ ] Cada slide comunica 1 idea clara en <5 segundos
- [ ] No hay "mecedoras" — nada compite por atención
- [ ] El naranja accent guía el ojo, no lo distrae
- [ ] Doble check: ¿Parece "cara y con intención"?

---

*Generado siguiendo el workflow de impeccable.style/designing con la paleta de Dumbledor Design*