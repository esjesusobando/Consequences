---
name: Token Management — Claude Code Efficiency
description: >
  13 tácticas para extender el uso de Claude Code hasta 10x sin cambiar de plan.
  Basado en análisis de consumo de tokens, caching, MCPs y gestión de contexto.
category: 08_Personal_Os
version: "1.0"
---

# Token Management — Claude Code Efficiency

## Problema

Claude relee TODA la conversación desde cero en cada mensaje.
El mensaje #30 cuesta ~30x más que el mensaje #1.
Más del 98% de los tokens se gastan releyendo historial viejo.

## Los 13 Trucos

### 1. Siempre empezá conversaciones nuevas (`/clear`)
- Usá `/clear` entre tareas no relacionadas
- Al cerrar un tema, pedí un summary (max 4 párrafos) y guardalo como `.md`
- En la nueva sesión: arrastrá ese archivo como contexto inicial
- **Impacto**: Es el truco #1 que más alarga la sesión

### 2. Desconectá MCPs que no uses (`/mcp`)
- Cada MCP carga sus definiciones en CADA mensaje (~18.000 tokens/mensaje)
- Corré `/mcp` al inicio de cada sesión y desactivá los que no vayas a usar
- Habilitá solo cuando los necesités
- Preferí CLI sobre MCP cuando exista la opción (más rápido, más barato)

### 3. Juntá tus prompts en un solo mensaje
- NO mandes 3 mensajes separados → mandá 1 mensaje con las 3 tareas
- Separados cuestan 3x más que uno combinado
- Si Claude se equivoca: **editá el mensaje original** y regenerá (no mandes corrección encima)

### 4. Usá Plan Mode antes de tareas pesadas
- Antes de crear algo desde cero → activá Plan Mode
- Evitá el error más caro: Claude se va por el camino equivocado y desperdicia tokens
- Agregá en CLAUDE.md: `"No hagas cambios hasta tener el 95% de confianza de lo que pedís"`

### 5. Corre `/context` y `/cost` para hacer lo invisible visible
- `/context`: muestra exactamente qué está consumiendo tokens ahora mismo
- `/cost`: muestra cuántos tokens llevás gastados y el costo estimado
- Una sesión nueva SIN escribir nada ya puede estar en 51.000 tokens (skills + MCPs + CLAUDE.md)

### 6. Configurá la Status Line
- Corré `/status-line` y pedile a Claude que configure la barra en tu terminal
- Muestra el modelo activo + conteo de tokens EN VIVO
- Es tu medidor de gasolina — visibilidad constante sin comandos extra

### 7. Monitoreá tu uso en tiempo real
- Tené abierta la ventana de uso de Claude (plan Pro/Max) en otro monitor
- No mandés un prompt y te vayas en tareas arquitecturales importantes
- Un loop malo (Claude releyendo en círculos) puede comerse el 80% de la sesión

### 8. Sé inteligente al pegar contexto
- No pegués archivos enteros si solo necesitás una función
- Usá `@archivo` para apuntar directo al archivo específico (no "buscá en el folder")
- Menos exploración libre = menos tokens + menos errores

### 9. Supervisá a Claude mientras trabaja
- Si ves que está creando algo que no pediste: `Escape` inmediato
- Identificá loops: si está releyendo los mismos archivos una y otra vez, interrumpí

### 10. Mantené CLAUDE.md lo más corto posible
- Cada línea se recarga con CADA mensaje
- Tratalo como un índice, no como un documento completo
- Apuntá a otros archivos en lugar de copiar contenido ahí
- Guardá decisiones estables y reglas de arquitectura, no conversaciones

### 11. Referencá archivos con precisión
- Usá `@archivo` o nombrá el archivo exacto y la función exacta
- NO digas "buscá en mi repo" — dale la ruta exacta

### 12. Compactá al 60%, no al 95%
- Autocompact ocurre recién al 95% — para entonces la calidad ya bajó
- Correlo manualmente con `/compact` al llegar al ~60%
- Después de 3-4 compacts, empezá conversación nueva
- Verificá porcentaje con `/context` o la Status Line

### 13. Los descansos cortos no cuestan — los largos sí
- El caché de Claude dura ~5 minutos
- Si te alejás 10+ minutos: cuando volvés, Claude relee TODO desde cero
- Antes de alejarte: corré `/compact` para que al volver solo lea el resumen

---

## Bonus

### Elegí el modelo correcto
| Tarea                                          | Modelo recomendado            |
|------------------------------------------------|-------------------------------|
| Planeación, arquitectura, decisiones pesadas   | **Opus** (~20% del trabajo)   |
| Implementación, código, tareas cotidianas      | **Sonnet** (~80% del trabajo) |
| Subagentes con tareas simples y bien definidas | **Haiku**                     |

### Trabajá fuera de horas pico
- Horas pico Anthropic: **8am–2pm EST** (hora Nueva York)
- En LATAM (GMT-5/GMT-6): evitá de ~7am–1pm local
- Tardes, noches y fines de semana rinden más por token

---

## Regla de Oro

> El gasto no se suma, se MULTIPLICA.
> Cada mensaje cuesta más que el anterior porque relee todo el historial.
> Sesiones cortas + contexto preciso = 10x más sesión por el mismo dinero.
