# Demo: Midjourney Básico para Juniors

> Tutorial paso a paso para crear tu primera imagen con Midjourney

---

## ¿Qué es Midjourney?

Midjourney es una herramienta de IA generativa que crea imágenes a partir de descripciones textuales (prompts). Es la más potente para imágenes fotorrealistas y artísticas.

### Requisitos Previos

1. Tener Discord instalado o usar la web
2. Unirse al servidor de Midjourney: midjourney.com/app
3. Aceptar invitación al servidor

---

## Paso 1: Tu Primer Prompt

### Comandos básicos

```bash
/imagine prompt: [tu descripción]
```

### Ejemplo: Tu primera imagen

```bash
/imagine prompt: a cute cat sitting on a windowsill, photorealistic, natural light --ar 16:9
```

### Parámetros básicos

| Parámetro   | Significado             | Ejemplo         |
|-------------|-------------------------|-----------------|
| `--ar 16:9` | Aspect ratio horizontal | 16:9, 1:1, 9:16 |
| `--v 6`     | Versión del modelo      | 1-6             |
| `--s 250`   | Stylize (estilo)        | 0-1000          |
| `--q 1`     | Quality (calidad)       | 0.25-2          |

---

## Paso 2: Entendiendo la Respuesta

Midjourney devuelve 4 opciones:

```
[U1] [U2]
[U3] [U4]
```

### Acciones disponibles

- **U1, U2, U3, U4**: Upscale (mejora calidad)
- **V1, V2, V3, V4**: Variación (crear nuevas versiones)
- 🔄: Regenerar

---

## Paso 3: Mejorando tu Prompt

### Estructura de prompt efectivo

```
[Sujeto] + [Contexto] + [Estilo] + [Iluminación] + [Parámetros]
```

### Ejemplo completo

```
/imagine prompt: a majestic lion in a savanna at sunset, golden hour lighting, photography style, shallow depth of field --ar 16:9 --v 6 --s 500
```

### Tips para mejores resultados

| #   | Tip                | Ejemplo                     |
|-----|--------------------|-----------------------------|
| 1   | Sé específico      | "gato" → "gato Maine Coon"  |
| 2   | Agrega contexto    | "en una ventana victoriana" |
| 3   | Define estilo      | "fotografía profesional"    |
| 4   | Agrega iluminación | "luz golden hour"           |
| 5   | Usa parámetros     | --ar 16:9 para Instagram    |

---

## Ejercicio Extra

### Ejercicio 1: Tu primera imagen
Crea un prompt con:
- Un animal
- Un lugar
- Una hora del día

### Ejercicio 2: Mejora tu imagen
Agrega:
- Estilo (fotografía, ilustración, etc.)
- Iluminación
- Parámetros --ar y --v

### Ejercicio 3: Crea una variación
Usa V en tu mejor imagen para crear nuevas versiones

---

## Errores Comunes y Cómo Evitarlos

| #   | Error                                    | Solución                              |
|-----|------------------------------------------|---------------------------------------|
| 1   | "La imagen no se parece a lo que quería" | Sé más específico en el prompt        |
| 2   | "Parece AI"                              | Agrega "photorealistic" o "cinematic" |
| 3   | "Calidad baja"                           | Usa --v 6 --q 1                       |
| 4   | "Muy pequeño"                            | Usa --ar con proporción correcta      |

---

## Siguiente Paso

🚀 **Continúa con:** Demo #2 — Midjourney Avanzado

---

// Junior-Friendly Tutorial - Midjourney Basics
