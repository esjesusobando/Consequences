# Runbook — Brand Voice Guardian

## Cuándo Usar Esta Skill

| Situación                                     | Trigger                      | Acción                                                             |
|-----------------------------------------------|------------------------------|--------------------------------------------------------------------|
| Usuario pide revisar si suena a él            | "¿esto suena como yo?"       | Paso 3: Aplicar filtro de voz                                      |
| Usuario quiere que agent escriba en su estilo | "escribe en mi estilo"       | Paso 1: Extraer voz (si hay contenido) o Paso 2: Construir tarjeta |
| Usuario pega contenido para análisis          | [pega posts/captions]        | Paso 1: Extraer las 6 dimensiones                                  |
| Usuario dice que suene muy a IA               | "suena a IA", "muy genérico" | Paso 3: Revisión Aprobado/Rechazado                                |
| Usuario lanza contenido nuevo                 | [entrega contenido nuevo]    | Paso 4: Verificación de consistencia                               |

---

## Flujo Principal

### Si el usuario tiene contenido previo (ejemplos):

```
1. ANALIZAR contenido en 6 dimensiones
2. CONSTRUIR Tarjeta de Voz
3. APLICAR filtro al nuevo contenido
4. VERIFICAR consistencia
5. ENTREGAR con validación
```

### Si el usuario NO tiene contenido previo:

```
1. PEDIR 3-5 ejemplos
2. Si no tiene → usar método descriptivo
3. CONSTRUIR Tarjeta de Voz
4. APLICAR filtro
5. VERIFICAR y entregar
```

---

## Método Descriptivo (sin ejemplos)

Si el usuario no tiene contenido previo, usa estas preguntas en una sola interacción:

1. "Describime cómo escribís en 3 palabras"
2. "¿Qué palabras usás mucho y cuáles evitas?"
3. "¿Cómo empezás y cómo terminás vos típicamente?"
4. "¿Tu estilo es más-amigo, más-guía, o más-profesor?"

Construye la tarjeta con esta info.

---

## Casos Edge

### Edge 1: Contenido en diferentes idiomas
- Analizar cada idioma por separado
- Voz puede diferir por idioma

### Edge 2: Usuario con múltiples cuentas/marcas
- Crear una tarjeta por cuenta
- Preguntar: "¿Para cuál cuenta es esto?"

### Edge 3: Contenido muy corto (captions de 1 línea)
- Análisis limitado — pedir más contexto
- Usar el gancho como muestra principal

---

## Estado Persistencia

Guardar tarjetas de voz en:
- `02_Knowledge/03_Voices/{handle}-voice.md`

Para reutilizar en futuras sesiones.

---

## Integración con Otras Skills

| Skill                 | Cómo se complementan                      |
|-----------------------|-------------------------------------------|
| offer-and-bio-writer  | Usar tarjeta de voz antes de escribir bio |
| content-ideation      | Aplicar voz al generar ideas              |
| brand-voice-generator | Si no hay voz, usar generator para crear  |

## Quick Reference

- **6 dimensiones**: Ritmo, Vocabulario, Emoción, PDV, Estructura, Lo que nunca dice
- **Tarjeta max**: 10 items
- **Verificación final**: 6 preguntas
- **Alerta drift**: Notificar cuando contenido se desvía
