# Demo: Midjourney Avanzado

> Técnicas profesionales para imágenes de alta calidad

---

## Repaso: Estructura de Prompt Avanzado

```
[Sujeto] + [Contexto] + [Estilo Visual] + [Iluminación] + [Parámetros Técnicos]
```

### Ejemplo Completo

```
/imagine prompt: a cyberpunk street market at night, neon lights reflections on wet pavement, futuristic asian market, cinematic lighting, volumetric fog, unreal engine 5 render, 8k resolution --ar 16:9 --v 6 --s 750 --q 2 --style raw
```

---

## Técnicas Avanzadas

### 1. Weight (Pesos)

Usa :: para dar peso a diferentes elementos

```
/imagine prompt: cat::2 street::1 sunset::1 --iw 0.5
```

| Peso    | Efecto                                |
|---------|---------------------------------------|
| `::2`   | El elemento es 2x más importante      |
| `::0.5` | El elemento es la mitad de importante |

### 2. Negative Weight (Peso Negativo)

Usa --no para excluir elementos

```
/imagine prompt: a beautiful landscape --no people water
```

### 3. Image Prompts (Mezclar Imágenes)

```
/imagine prompt: [image URL] [image URL] --iw 0.5
```

- `--iw` (0-1): Peso de la imagen vs tu prompt

### 4. Seed (Consistencia)

Usa --seed para mantener coherencia

```
/imagine prompt: a character portrait --seed 12345
```

### 5. Tile (Patrones)

Usa --tile para crear patrones repetibles

```
/imagine prompt: abstract geometric pattern --tile --ar 3:2
```

---

## Parámetros Avanzados

| Parámetro  | Descripción               | Rango        |
|------------|---------------------------|--------------|
| `--stop`   | Detiene en X%             | 10-100       |
| `--video`  | Genera video del proceso  | true/false   |
| `--tile`   | Crea patrón repetible     |--------------|
| `--no`     | Excluye elementos         |--------------|
| `--iw`     | Peso de imagen            | 0-1          |
| `--seed`   | Semilla de consistencia   | 0-4294967295 |
| `--repeat` | Genera X variaciones      | 1-40         |
| `--video`  | Guarda proceso como video |--------------|

---

## Estilos Predefinidos

### Por Tipo de Salida

| Estilo          | Prompt adicional                         |
|-----------------|------------------------------------------|
| Fotografía      | `photorealistic, shot with Canon EOS R5` |
| Ilustración     | `illustration, watercolor, artstation`   |
| 3D              | `3d render, blender, octane render`      |
| Arte conceptual | `concept art, epic composition`          |
| Anime           | `anime style, manga aesthetic`           |
| Logo            | `logo design, minimalist, vector style`  |

### Lighting (Iluminación)

| Término               | Efecto               |
|-----------------------|----------------------|
| `cinematic lighting`  | Iluminación de cine  |
| `golden hour`         | Luz de atardecer     |
| `volumetric lighting` | Luz volumétrica      |
| `rim lighting`        | Luz de borde         |
| `softbox lighting`    | Luz suave de estudio |

---

## Workflow Profesional

### Para un Proyecto Completo

```
1. GENERAR: /imagine prompt: [idea base]
2. SELECCIONAR: U1 (mejor opción)
3. VARIAR: V1 (nuevas versiones)
4. MEJORAR: U1 again (upsale)
5. REFINAR: /imagine prompt: [detalles adicionales] --seed [anterior seed]
6. EXPORTAR: Descargar en alta resolución
```

---

## Comandos Útiles

| Comando     | Función                   |
|-------------|---------------------------|
| `/settings` | Ver/configurar opciones   |
| `/describe` | Imagen a prompt (reverse) |
| `/blend`    | Mezclar 2-5 imágenes      |
| `/prefer`   | Configuraciones favorito  |

---

## Ejercicio Extra

### Ejercicio 1: Consistencia
Crea 4 imágenes del mismo personaje usando --seed

### Ejercicio 2: Estilo
Aplica diferente estilo (foto, 3D, anime) al mismo sujeto

### Ejercicio 3: Negativo
Usa --no para excluir elementos no deseados

### Ejercicio 4: Mezcla
Mezcla dos imágenes diferentes

---

## Errores Avanzados

| #   | Error          | Solución                 |
|-----|----------------|--------------------------|
| 1   | "Inconsistent" | Usa --seed               |
| 2   | "Too similar"  | Usa V para variar        |
| 3   | "Low detail"   | Usa --q 2                |
| 4   | "Wrong style"  | Especifica más en prompt |

---

## Siguiente Paso

🚀 **Continúa con:** Demo #3 — Midjourney para Marketing

---

// Advanced Tutorial - Midjourney Pro Techniques
