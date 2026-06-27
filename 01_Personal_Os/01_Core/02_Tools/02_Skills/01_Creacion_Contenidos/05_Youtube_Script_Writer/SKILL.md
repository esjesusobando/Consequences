---
name: youtube-script-writer
description: "Escribe guiones de YouTube optimizados para retención, estructura narrativa, hooks y CTAs. Triggers on: youtube script writing, video narrative, retention hooks, script timestamps, video CTA structure"
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

# Youtube Script Writer

> Escribe guiones de video para YouTube optimizados para retención.

## Esencia Original

- **Metaskill**: Traducir un tema o brief en una estructura narrativa audiovisual completa con hooks, timestamps y CTAs, maximizando la retención de audiencia en cada segmento del video.
- **Propósito original**: Eliminar la incertidumbre de "cómo estructurar un video" dando un esquema probado que mantiene al espectador enganchado del hook inicial al CTA final, replicable para cualquier nicho o duración.

## Propósito

Toma un tema o brief y genera un guion completo de YouTube con estructura narrativa, timestamps, hooks y CTAs optimizados para maximizar retención y engagement.

## Cuándo Usar

- Para crear videos de YouTube (largo formato o shorts)
- Cuando necesitas un guion estructurado y listo para grabar
- Para contenido educativo, entretenimiento o marketing

## Input

- **Tema principal**: El topic del video
- **Duración objetivo**: 5 min, 10 min, 20 min, etc.
- **Tipo de video**: Tutorial, explicación, review, vlog, etc.
- **Audiencia**: Nivel de conocimiento del target

## Proceso

1. **Analizar** el tema → identificar angle único
2. **Estructurar** el guion: intro → desarrollo → cierre
3. **Crear hooks** para cada sección (retention points)
4. **Insertar timestamps** sugeridos
5. **Añadir CTAs** estratégicos

## Output

```markdown
# [Título del Video]

## METADATA
- Duración: [X] minutos
- hooks: [3-5 hooks principales]
- CTA: [call to action]

---

## GUION

### 00:00 - [HOOK]
[Opening hook + promesa]

### 02:30 - [TRANSICIÓN]
[Punto de conexión]

### [XX:XX] - [TÍTULO SECCIÓN]
[Contenido]

---

## PRODUCCIÓN NOTES
- B-roll sugerido: [descripción]
- Música: [tipo]
- Gráficos: [elementos]
```

## Ejemplo

**Input:** "Cómo usar AI para crear contenido 10x más rápido"
**Output:** Guion de 15 min con 3 hooks, timestamps y CTAs para suscribirse

---

## ⚠️ Gotchas

1. **Guion demasiado denso para la entrega oral real**
   - **Por qué**: Los guiones escritos por AI tienden a incluir demasiada información por minuto, ignorando que el habla natural necesita pausas, respiros y tiempo para que las ideas procesen.
   - **Solución**: Siempre incluir una regla de "densidad verbal máxima" (ej: 120-140 palabras por minuto) y marcar explícitamente los momentos de pausa o énfasis en el guion.

2. **Hooks que prometen algo que el video no entrega**
   - **Por qué**: La skill optimiza para retención, pero un hook espectacular sin respaldo en el desarrollo del video genera alta tasa de abandono (bounce) en el minuto 2-3.
   - **Solución**: Validar que cada hook tenga un "payoff" correspondiente en el cuerpo del guion — si el hook promete X, el video debe entregar X antes del final.

3. **Timestamps fijos que ignoran el pacing natural**
   - **Por qué**: Los timestamps generados asumen una duración lineal perfecta, pero en la grabación real el creator se extiende en ciertos puntos, descalibrando toda la estructura temporal.
   - **Solución**: Usar timestamps relativos por sección (ej: "25% del video") en lugar de absolutos, o incluir una nota de "pacing flexible" que adapte la duración estimada.

## 💾 State Persistence

Esta skill es stateless. Cada invocación produce un guion completo basado únicamente en el brief de entrada. No hay memoria entre sesiones de escritura. Para versiones iterativas del mismo guion, el orquestador debe pasar el guion anterior como parte del input.

---

*Agent 14 de Marketing Team*
*Siguiente: 15_Youtube_Thumbnail_Prompter*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
