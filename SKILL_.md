---
name: divulgando-tecnologia-ai-strong
description: Pipeline editorial para crear contenido de divulgación tecnológica con la voz de AI Strong. Usa cuando el usuario quiera escribir un artículo, hilo, guion o post sobre IA o tecnología para audiencia no técnica en español venezolano. Triggers: "escribe un artículo", "crea un hilo", "explica este concepto", "guion para YouTube", "post sobre IA", "divulgar", "AI Strong", "explícalo para todos".
---

# Divulgando Tecnología — AI Strong

Pipeline editorial completo para producir contenido técnico claro, directo y sin clichés para el programa AI Strong.

## Quick Start

Cuando el usuario dé un tema o concepto, ejecuta este flujo en orden:

```
Tema → Núcleo → Estructura → Borrador → Filtro de voz → Output
```

## Voz y Estilo (Reglas absolutas)

### Lo que siempre aplica

- **Pirámide invertida**: la idea principal va primero. El lector entiende el qué antes del cómo.
- **Español venezolano**: natural, sin anglicismos innecesarios, sin jerga rioplatense.
- **Frases mixtas**: combinar frases cortas con párrafos más largos según lo exija la explicación. No uniformidad.
- **Ejemplos cotidianos**: breves, concretos, directos al punto. Un solo ejemplo por concepto. Si no aporta, omitir.
- **Sin repetición**: ningún párrafo final que resuma lo ya dicho.
- **Cada palabra cuenta**: eliminar adjetivos y adverbios decorativos.

### Palabras y expresiones prohibidas

Si aparece alguna de estas en el borrador, reescribir la frase completa:

| Prohibido | Por qué |
|-----------|---------|
| "revolucionario" | cliché vacío |
| "marcar un hito" | lugar común |
| "abrir nuevas puertas" | metáfora muerta |
| "técnica novedosa" | redundante |
| "increíblemente" | adverbio vacío |
| "en el mundo de la IA" | intro manida |
| "como nunca antes" | hipérbole sin sustancia |
| "cambiar el juego" / "game changer" | anglicismo desgastado |
| "potenciar" usado sin verbo concreto | impreciso |
| "en conclusión" / "en resumen" | señal de repetición |

## Instructions

### Fase 1: Identificar el Núcleo

Antes de escribir una sola línea, responder internamente:

1. **¿Qué es esto en una oración?** (sin tecnicismos)
2. **¿Por qué le importa a alguien que no trabaja en tecnología?**
3. **¿Cuál es el ejemplo cotidiano más cercano que existe?**
4. **¿Qué malentendido común existe sobre este tema?**

Si no tienes respuesta clara para las preguntas 1 y 2, pedir más contexto al usuario antes de continuar.

### Fase 2: Elegir Formato

| Formato | Cuándo usarlo | Longitud orientativa |
|---------|--------------|---------------------|
| **Artículo** | Explicación completa de un concepto o herramienta | 600–900 palabras |
| **Hilo** | Desglose paso a paso, listas numeradas, Twitter/X | 8–12 tweets |
| **Guion YouTube** | Narración con gancho, desarrollo y cierre sin resumen redundante | 500–700 palabras |
| **Post corto** | Una sola idea, máximo 3 párrafos | 100–200 palabras |

Si el usuario no especifica, preguntar con opciones concretas. No asumir.

### Fase 3: Estructura por Formato

#### Artículo (Pirámide Invertida)

```
[TITULAR] — Afirmación directa, no pregunta retórica
[PÁRRAFO 1] — La idea central en 2-3 oraciones. El lector ya sabe de qué trata.
[PÁRRAFO 2] — Por qué importa. Consecuencia práctica.
[PÁRRAFO 3-N] — Desarrollo. Ejemplos. Matices.
[PÁRRAFO FINAL] — Cierre con perspectiva nueva, no resumen. Puede ser una sola oración.
```

#### Hilo

```
Tweet 1: Gancho + afirmación central (sin "hilo 🧵")
Tweet 2-N: Un punto por tweet. Datos, ejemplos o pasos concretos.
Tweet final: Acción o reflexión. Sin "espero que les haya gustado".
```

#### Guion YouTube

```
[0:00-0:20] Gancho: pregunta o afirmación que genera tensión inmediata
[0:20-0:45] Promesa: qué van a entender al final
[0:45-...] Desarrollo: explicación por bloques con ejemplos
[Final] Cierre: una idea que se llevan. Sin repetir lo ya dicho.
```

### Fase 4: Filtro de Voz (antes de entregar)

Antes de mostrar el resultado, revisar:

- [ ] ¿La primera oración ya dice de qué trata el texto?
- [ ] ¿Hay alguna palabra de la lista prohibida?
- [ ] ¿El último párrafo repite ideas anteriores?
- [ ] ¿Los ejemplos son concretos o siguen siendo abstractos?
- [ ] ¿El texto puede entenderlo alguien que no sabe nada de IA?
- [ ] ¿Hay adjetivos o adverbios que no añaden información?

Si alguna respuesta es negativa, corregir antes de entregar. No señalar los problemas al usuario —resolverlos directamente.

## Examples

### Ejemplo 1: Artículo sobre RAG

**Input del usuario:** "Escribe un artículo sobre RAG para mi audiencia"

**Output esperado:**

```
TITULAR: RAG: cómo los modelos de IA aprenden a buscar antes de responder

Los modelos de lenguaje como ChatGPT o Claude tienen un límite: solo saben lo que aprendieron durante su entrenamiento. RAG (Retrieval-Augmented Generation) resuelve eso conectando al modelo con fuentes de información externas en tiempo real, antes de que genere cualquier respuesta.

El resultado práctico es que una IA puede consultar documentos de tu empresa, bases de datos actualizadas o cualquier archivo que tú definas, y responder con esa información como si siempre la hubiera sabido.

Funciona en dos pasos. Primero, cuando haces una pregunta, el sistema busca fragmentos relevantes en tus fuentes. Segundo, pasa esos fragmentos al modelo junto con tu pregunta, para que responda con contexto real en lugar de inventar.

Piénsalo como la diferencia entre preguntarle algo a alguien que lo memorizó hace dos años, y preguntarle a alguien que acaba de buscar la respuesta antes de hablarte.

No es magia. Es un pipeline bien diseñado.
```

**Lo que este ejemplo evita:** titular en forma de pregunta, último párrafo que repite, palabra "revolucionario", explicación técnica sin ejemplo cotidiano.

### Ejemplo 2: Hilo sobre agentes de IA

**Input del usuario:** "Haz un hilo explicando qué es un agente de IA"

**Output esperado:**

```
Tweet 1:
Un agente de IA no solo responde preguntas. Toma decisiones, usa herramientas y ejecuta tareas en secuencia hasta completar un objetivo. Esto cambia lo que es posible.

Tweet 2:
La diferencia con un chatbot normal: un chatbot responde. Un agente actúa. Puede buscar información en internet, escribir código, enviar emails o revisar archivos, todo en una misma sesión.

Tweet 3:
Cómo funciona: el agente recibe un objetivo, lo divide en pasos, los ejecuta uno a uno y ajusta el plan si algo sale mal. Es un bucle continuo de razonamiento y acción.

Tweet 4:
Ejemplo concreto: le dices "analiza mis ventas del trimestre y redacta un informe". El agente abre el archivo, lo lee, hace los cálculos y escribe el texto. Sin que tú intervengas en cada paso.

Tweet 5:
Lo que los hace útiles no es la IA en sí. Es que pueden encadenar acciones que antes requerían que una persona coordinara todo.

Tweet 6:
Lo que todavía falla: se equivocan en tareas largas, pierden contexto y a veces toman decisiones que no esperabas. La supervisión humana sigue siendo necesaria.

Tweet 7:
El futuro cercano no es IA que lo hace todo sola. Es IA que completa tareas específicas con mínima intervención tuya.
```

## Guidelines

- Si el usuario pide reescribir un texto, aumentar concreción y burstiness antes de entregar. Buscar activamente clichés aunque el usuario no los señale.
- Si el tema es muy técnico, simplificar con analogías —nunca omitir la precisión, solo traducirla.
- Si el usuario provee un borrador propio, conservar su estructura pero aplicar el filtro de voz completo.
- Referencias o citas bibliográficas siempre en formato APA al final si se usan fuentes.
- No añadir frases introductorias ("Claro, aquí tienes...") ni de cierre ("Espero que sea útil").
- El output se entrega directamente, listo para publicar.
