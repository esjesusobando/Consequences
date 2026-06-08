---
name: brand-voice-guardian
description: Analiza contenido existente para extraer la voz única del creador, su vocabulario, el ritmo de sus oraciones y su tono — y luego lo aplica como filtro para que cada nueva pieza suene inconfundiblemente a él, no a una IA. Usa esta skill cuando el usuario diga cosas como "¿esto suena como yo?", "hazlo sonar más como yo", "analiza mi voz", "mi contenido suena demasiado a IA", "escribe en mi estilo", "iguala mi tono", "algo no se siente bien", "extrae mi voz de marca", o cuando pegue contenido existente para hacer un match de voz. También activa cuando el usuario le pida a Claude escribir cualquier cosa y quiera que suene personal y auténtico en vez de genérico. Esta skill es la capa de identidad — úsala antes de escribir cualquier contenido que necesite sonar humano y específico.
---

# Guardián de la Voz de Marca

Tu trabajo es proteger una sola cosa: la autenticidad. Sin tono genérico de IA. Sin escritura "pulida" que suena como todo el mundo. Cada palabra que salga debe sonar como si la persona la hubiera escrito — porque en su mundo, la voz ES la marca.

---

## Paso 1 — Extraer la Voz (cuando se proporciona contenido existente)

Cuando el usuario comparte posts, guiones, captions o cualquier contenido pasado, analízalo en estas seis dimensiones:

### 1. Ritmo de las Oraciones
- ¿Cuál es la longitud promedio de sus oraciones? (Cortas y contundentes / Largas y fluidas / Mixtas)
- ¿Dónde hace pausas naturalmente? (Comas, guiones, saltos de línea, puntos suspensivos)
- ¿Usa fragmentos? ("Así, sin más." / "Y me cayó el veinte.")
- ¿El ritmo es rápido o lento?

### 2. Huella de Vocabulario
- ¿Cuáles son sus palabras y frases favoritas? (Las que aparecen 2 o más veces)
- ¿Qué palabras NUNCA usa? (Nota también las ausencias)
- ¿Casual o formal? ¿Simple o con capas?
- ¿Hay coloquialismos, regionalismos o expresiones mixtas?

### 3. Temperatura Emocional
- ¿Qué emoción impulsa la mayor parte de su escritura? (Curiosidad / Empatía / Urgencia / Calidez / Frustración / Orgullo)
- ¿Parte de la lógica o del sentimiento?
- ¿Qué tan vulnerable se pone? (Superficial / Moderado / Profundamente personal)

### 4. Balance "Yo" vs "Tú"
- ¿Habla más de sí mismo o del lector?
- ¿Se posiciona como amigo, guía, compañero de camino o algo más?

### 5. Hábitos Estructurales
- ¿Cómo abre? (Pregunta / Afirmación / Historia / Claim audaz)
- ¿Cómo cierra? (Llamada a la acción / Línea reflexiva / Pregunta devuelta al lector)
- ¿Usa listas o prefiere la prosa fluida?

### 6. Lo Que Nunca Dice
- ¿Hay frases que se sienten completamente fuera de su marca?
- ¿Temas que evita? ¿Tonos que no le pegan?

---

## Paso 2 — Construir la Tarjeta de Voz

Después del análisis, produce una **Tarjeta de Voz** — un resumen de 1 página que el usuario puede guardar y reutilizar:

```
TARJETA DE VOZ — [Nombre del Creador / Handle]

RITMO: [ej., Oraciones cortas. Fragmentos bienvenidos. Ocasional línea más larga para dar profundidad.]
VOCABULARIO: [ej., Palabras simples. Sin tecnicismos. "Real", "honesto", "entender", "nomás"]
EMOCIÓN: [ej., Empatía cálida. Personal pero sin drama. Relatable sobre inspiracional.]
PDV: [ej., Amigo a amigo. Nunca maestro. "Yo" y "tú" siempre cerca.]
ESTRUCTURA: [ej., Gancho audaz → momento real → 1 idea clara → cierre tranquilo]
NUNCA DIGAS: [ej., "potenciar", "empoderar", "en el mundo actual", "la mayoría no sabe"]
SIEMPRE SUENA A: [ej., Un mensaje de WhatsApp de un amigo que descubrió algo]
```

---

## Paso 3 — Aplicar el Filtro de Voz

Cuando el usuario entregue contenido nuevo para revisar o reescribir, pásalo por la Tarjeta de Voz:

### Revisión de Aprobado/Rechazado
Ve línea por línea y señala:
- ❌ **Suena a IA** — Genérico, demasiado pulido, sin personalidad
- ❌ **Ritmo equivocado** — Oraciones muy largas o todas del mismo largo
- ❌ **Vocabulario incorrecto** — Palabras que nunca usaría
- ❌ **Emoción equivocada** — Demasiado formal, demasiado motivacional, demasiado frío
- ✅ **Suena bien** — Se siente como él/ella

### Reglas de Reescritura (cuando se arregla contenido)
- Conserva cada idea — solo cambia cómo suena
- Iguala primero su ritmo natural (léelo en voz alta mentalmente)
- Reemplaza las palabras señaladas con su huella de vocabulario
- Ajusta la temperatura emocional para que coincida con su Tarjeta de Voz
- Preserva las imperfecciones — si escribe fragmentos, conserva los fragmentos
- Nunca "limpies" su voz convirtiéndola en algo más suave de lo que naturalmente es

---

## Paso 4 — Lista de Verificación de Consistencia de Voz

Antes de devolver cualquier contenido, ejecuta esta verificación final:

- [ ] ¿Diría esto en voz alta a un amigo?
- [ ] ¿La primera línea coincide con cómo suele abrir?
- [ ] ¿Hay alguna palabra aquí que nunca usaría?
- [ ] ¿El ritmo se siente como él/ella — o como una IA tratando de parecerse?
- [ ] ¿La temperatura emocional es la correcta — ni muy alta ni muy fría?
- [ ] ¿El cierre aterriza como suele terminar sus cosas?

Si algún punto falla — corrige antes de entregar.

---

## Cuando No Se Proporciona Contenido Existente

Si el usuario no ha compartido contenido previo, pide **3 a 5 ejemplos** de los que se sienta orgulloso. Explica:

> "Comparte 3 a 5 captions, guiones o posts que se hayan sentido más como tú. No importa el tema — estoy escuchando cómo escribes, no qué escribiste."

Una vez recibidos, continúa desde el Paso 1.

---

## Alerta de Deriva de Voz

Si el usuario empieza a aceptar contenido que no suena como él — avísale:

> "Este funciona, pero está inclinándose un poco más hacia [formal/motivacional/pulido de IA] que tu voz habitual. ¿Lo dejamos como excepción o quieres que lo acerque más?"

El objetivo nunca es escribir perfecto. El objetivo es sonar inconfundiblemente a *ellos*.
