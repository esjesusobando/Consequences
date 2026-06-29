# Gotchas — Errores Comunes en Voice Guardian

## GOTCHA 1: Pedir ejemplos sin contexto

**Por qué**: El usuario puede no tener contenido previo listo, y sin ejemplos no puedes extraer voz.

**Solución**: Ofrece opciones:
- "Tengo 3-5 posts que puedo compartir"
- "No tengo contenido previo pero puedo describir cómo escribo"
- "¿Querés que analicemos algo específico?"

---

## GOTCHA 2: Preservar errores de ortografía

**Por qué**: Puede ser parte de la autenticidad, pero errores obvios dañan credibilidad.

**Solución**: Consulta antes:
> "Tu escritura tiene algunas particularidades ortográficas — ¿las preservo como parte de tu voz o corrijo errores obvios?"

---

## GOTCHA 3: Ignorar el canal

**Por qué**: La voz en Instagram ≠ LinkedIn ≠ YouTube — cada plataforma tiene expectativas distintas.

**Solución**: Adapta el nivel de formalidad al medio:
- Instagram = más casual, emoji ok, fragmentos
- LinkedIn = más profesional, menos emoji, oraciones completas
- YouTube = más conversacional, storytelling allowed

---

## GOTCHA 4: Crear "voz perfecta" que no existe

**Por qué**: El usuario puede tener etapas o registros diferentes, no una sola voz consistente.

**Solución**: Cuando detectes inconsistencias, pregunta:
> "¿Escribís diferente según el contexto? Porque noto que en X usás otro tono."

Documenta las variaciones si existen.

---

## GOTCHA 5: Sobre-escribir la tarjeta de voz

**Por qué**: Una tarjeta de 2 páginas no es usable — el agente no la leerá completa.

**Solución**: Máximo 10 items en la tarjeta:
1. Ritmo principal
2. 3-5 palabras clave de vocabulario
3. Emoción dominante
4. PDV (amigo/guía/maestro)
5. Cómo abre típicamente
6. Cómo cierra típicamente
7. 3-5 cosas que NUNCA dice
8. 3-5 palabras que NUNCA usa
9. Tono general
10. Ejemplo de sonido (analogía)

---

## GOTCHA 6: Aceptar drift de voz sin notificar

**Por qué**: El usuario puede normalizar contenido que no suena como él.

**Solución**: Alerta proactiva:
> "Este funciona, pero está inclinándose un poco más hacia [formal/motivacional/pulido de IA] que tu voz habitual. ¿Lo dejamos como excepción o quieres que lo acerque más?"

---

## GOTCHA 7: No verificar antes de entregar

**Por qué**: El contenido puede pasar la prueba técnica pero no la de autenticidad.

**Solución**: Checklist final:
- [ ] ¿Diría esto en voz alta a un amigo?
- [ ] ¿La primera línea coincide con cómo suele abrir?
- [ ] ¿Hay alguna palabra aquí que nunca usaría?
- [ ] ¿El ritmo se siente como él/ella?
- [ ] ¿La temperatura emocional es la correcta?
- [ ] ¿El cierre aterriza como suele terminar sus cosas?


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
