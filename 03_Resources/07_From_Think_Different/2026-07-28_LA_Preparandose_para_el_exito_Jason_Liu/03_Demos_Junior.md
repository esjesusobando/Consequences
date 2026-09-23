---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\01_Research\2026-07-28_LA_Preparandose_para_el_exito_Jason_Liu\03_Demos_Junior.md'
---
# Demos Junior — Taller Jason Liu, OpenAI Codex
## Tutoriales paso a paso para los patterns principales

---

## Demo 1: Setup de Appshots (15 min)

### Qué es y para qué sirve
Appshots captura screenshots con el accessibility tree de la app activa. Le da al modelo contexto estructurado — no solo píxeles, sino IDs de canales, usuarios, campos de formulario. Convierte 4 tool calls en 1.

### Requisitos previos
- Codex Desktop instalado
- Permisos de pantalla en macOS (Settings → Privacy → Screen Recording)

### Paso a paso
1. Abre Codex Desktop
2. Presiona el botón de Appshots en el sidebar
3. Captura la app o ventana que necesitas analizar
4. En el prompt, describe qué necesitas ejecutar con esa captura
5. Observa que el modelo responde con un function call directo

### Errores comunes
- No funciona bien en apps sin soporte de accesibilidad → usa Computer Use como fallback
- La captura no incluye el tree completo → asegúrate de que la app esté en primer plano
- El modelo no entiende el tree → sé más específico en el prompt

### Ejercicio extra
Captura una channel de Slack con actividad reciente. Pide: "¿Quién mencionó mi nombre? Responde con su nombre." Cuenta los steps sin appshots vs con appshots.

---

## Demo 2: Loop Skill — PR Maintenance Automation (20 min)

### Qué es y para qué sirve
El Loop skill es una automation heartbeat que revisa periódicamente un PR — reviews, CI, rebase — y auto-fija lo que puede.

### Paso a paso
1. Crea `loop-skill.md` con instrucciones: check PR → new reviews? fix → CI failing? fix → behind main? rebase → wait 30 min → repeat
2. Add timeout: "Stop after 24 hours or 20 cycles"
3. Carga el loop skill en Codex
4. Dile: "Run this loop on [PR URL]"
5. Observa el primer ciclo y luego el "sleep" hasta el próximo heartbeat

### Errores comunes
- El loop no tiene timeout → configura max iterations
- CI failure no es actionable en infra → agrega regla de fallback
- Rebase conflict → configura "ask me first" para cambios conflictivos

---

## Demo 3: Memory Vault Setup (10 min)

### Qué es y para qué sirve
Un vault de memoria personal basado en git + markdown. Cada interacción con la IA se guarda como observación searchable. Tu contexto crece con el tiempo.

### Paso a paso
1. Crea la estructura:
   ```
   ~/memory-vault/
   ├── observations/
   ├── templates/
   └── .git/
   ```
2. Crea `templates/observation.md` con formato: frontmatter (title, type, scope, topic_key, date) + sections (What, Why, Where, Learned)
3. Cada vez que aprendas algo nuevo, crea un archivo con el template
4. Haz commit cada semana con un resumen

### Errores comunes
- Olvidar actualizar el vault → configura un reminder semanal
- Demasiados archivos pequeños → agrupa por semana
- No buscar antes de crear → busca en el vault antes de guardar algo nuevo

---

## Demo 4: Ultra Goal — File-Based Goal Tracking (15 min)

### Qué es y para qué sirve
Los goals viven en archivos MD editables. El plan se ajusta mientras el modelo trabaja. El progreso es tracelog observable.

### Paso a paso
1. Crea `goal.md` con criterios de éxito (checkboxes) y scope (in/out)
2. Crea `plan.md` con fases y steps
3. Crea `state.md` vacío para que el modelo llene con progreso
4. Abre Codex y dile: "Read goal.md, plan.md, state.md. Start Phase 1. After each step, update state.md with progress and verification results."
5. Observa cómo el modelo ejecuta, verifica, y actualiza automaticamente

### Errores comunes
- El plan queda estático → Ultra Goal permite editar el plan DURANTE la ejecución
- No verificar los steps → cada step necesita una verification gate en goal.md
- state.md no se actualiza → configura el prompt para obligar la actualización después de cada ciclo


> 🔗 Zona: [[03_Resources/06_From_Think_Different/2026-07-28_LA_Preparandose_para_el_exito_Jason_Liu/README]]
