---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\05_Gotchas_Top20_Skills.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\05_Gotchas_Top20_Skills.md"
sync_date: "2026-08-01T00:55:45.947069"
sync_updated: true---

# Gotchas — Top 20 Skills

## 🚨 Errores Comunes y Cómo Evitarlos

### 1. agent-teams-lite (SDD Workflow)

**❌ Error:** Ejecutar `/sdd-apply` sin haber completado `/sdd-spec` y `/sdd-design`
**✅ Solución:** Siempre seguir la secuencia: explore → propose → spec → design → tasks → apply

**❌ Error:** No leer el manifest antes de iniciar
**✅ Solución:** Siempre ejecutar `mem_context` y leer el manifest al inicio

**❌ Error:** Cambiar la estructura de carpetas sin aprobación
**✅ Solución:** Presentar plan en formato checklist y esperar confirmación

---

### 2. compound-engineering

**❌ Error:** No documentar learnings después de resolver un problema
**✅ Solución:** Siempre ejecutar `/ce:compound` después de cada fix significativo

**❌ Error:** Crear PR sin review previo
**✅ Solución:** Ejecutar `/ce:review` antes de crear PR

**❌ Error:** No usar worktrees para features paralelas
**✅ Solución:** Ejecutar `ce-worktree` antes de empezar trabajo aislado

---

### 3. ce-brainstorm

**❌ Error:** Lanzarse a construir sin definir requisitos
**✅ Solución:** Siempre pasar por `/ce:brainstorm` antes de `/ce:plan`

**❌ Error:** No validar supuestos con el usuario
**✅ Solución:** Presentar 3-5 preguntas concretas antes de continuar

**❌ Error:** Scope creep durante el brainstorm
**✅ Solución:** Mantener foco en el problema central, no en soluciones

---

### 4. ce-plan

**❌ Error:** Planificar sin considerar dependencias
**✅ Solución:** Mapear dependencias antes de crear el plan

**❌ Error:** No incluir criterios de éxito
**✅ Solución:** Cada tarea debe tener un criterio de验收 claro

**❌ Error:** Planificar más de lo que se puede ejecutar
**✅ Solución:** Realista sobre capacity — mejor sub-estimar que sobre-estimar

---

### 5. ce-work

**❌ Error:** No crear worktree antes de trabajar
**✅ Solución:** Siempre usar `ce-worktree` para aislamiento

**❌ Error:** No hacer commits atómicos
**✅ Solución:** Un commit por cambio lógico, no por archivo

**❌ Error:** No verificar tests antes de commit
**✅ Solución:** Ejecutar tests relevantes antes de cada commit

---

### 6. ce-review

**❌ Error:** Review superficial solo de syntax
**✅ Solución:** Revisar lógica, edge cases, seguridad, y performance

**❌ Error:** No considerar el contexto del PR
**✅ Solución:** Leer la descripción del PR y los issues relacionados

**❌ Error:** Aprobar sin testing
**✅ Solución:** Verificar que los tests pasan y que el coverage no baja

---

### 7. ce-commit

**❌ Error:** Messages vagos como "fix" o "update"
**✅ Solución:** Usar formato convencional: `type(scope): description`

**❌ Error:** No referenciar issues
**✅ Solución:** Incluir `Fixes #123` o `Relates to #456` cuando aplique

**❌ Error:** Commits demasiado grandes
**✅ Solución:** Split en commits más pequeños y atómicos

---

### 8. ce-debug

**❌ Error:** Adivinar la causa sin investigar
**✅ Solución:** Seguir el protocolo: reproduce → isolate → fix → verify

**❌ Error:** No crear test de regresión
**✅ Solución:** Siempre agregar test que falle antes del fix

**❌ Error:** Fix sin entender el root cause
**✅ Solución:** Documentar root cause en el commit message

---

### 9. personal_os_stack

**❌ Error:** No cargar contexto al inicio
**✅ Solución:** Siempre ejecutar `mem_context` antes de responder

**❌ Error:** Modificar el OS sin seguir las 12 leyes
**✅ Solución:** Revisar las 12 leyes maestras antes de actuar

**❌ Error:** No reportar progreso
**✅ Solución:** Reportar cada 15% de avance en formato establecido

---

### 10. personal-os-area

**❌ Error:** No usar Hillary para tareas personales
**✅ Solución:** Routing automático: "capture", "plan my day" → Hillary

**❌ Error:** No procesar el inbox
**✅ Solución:** Al inicio de sesión, verificar inbox sin procesar

**❌ Error:** No hacer daily review
**✅ Solución:** Si no hay daily report, sugerir al usuario

---

### 11. workflows-area

**❌ Error:** No seguir el flujo del workflow
**✅ Solución:** Ejecutar pasos en orden, no saltar etapas

**❌ Error:** No documentar decisiones
**✅ Solución:** Cada workflow debe tener un log de decisiones

**❌ Error:** No validar outputs
**✅ Solución:** Verificar que cada fase produce el output esperado

---

### 12. skill-creator

**❌ Error:** Crear skill sin frontmatter válido
**✅ Solución:** Siempre incluir `name`, `description` en YAML frontmatter

**❌ Error:** Skills demasiado específicas
**✅ Solución:** Mantener skills modulares y reutilizables

**❌ Error:** No documentar triggers
**✅ Solución:** Incluir triggers claros en la descripción

---

### 13. skill-improver

**❌ Error:** Mejorar sin auditar primero
**✅ Solución:** Ejecutar `skill-auditor` antes de mejorar

**❌ Error:** No mantener compatibilidad
**✅ Solución:** Verificar que los cambios no rompen existentes

**❌ Error:** No documentar cambios
**✅ Solución:** Actualizar CHANGELOG o README del skill

---

### 14. judgment-day

**❌ Error:** Ejecutar judgment day sin code review previo
**✅ Solución:** Primero `/ce:review`, luego judgment day

**❌ Error:** No considerar el contexto del proyecto
**✅ Solución:** Leer GOALS.md y BACKLOG.md antes de juzgar

**❌ Error:** Ser demasiado permisivo
**✅ Solución:** Mantener estándares altos — el OS debe ser PURE GREEN

---

### 15. branch-pr

**❌ Error:** Crear PR sin issue asociado
**✅ Solución:** Siempre crear issue primero, luego PR que lo referencia

**❌ Error:** PRs demasiado grandes
**✅ Solución:** Si >400 líneas, considerar chained PRs

**❌ Error:** No incluir tests en el PR
**✅ Solución:** Todo cambio debe incluir tests relevantes

---

### 16. issue-creation

**❌ Error:** Issues vagos sin repro steps
**✅ Solución:** Incluir: steps to reproduce, expected, actual, environment

**❌ Error:** No asignar prioridad
**✅ Solución:** Siempre usar P0-P3 labels

**❌ Error:** No cerrar issues resueltos
**✅ Solución:** Verificar que el fix cierra el issue automáticamente

---

### 17. claude-api

**❌ Error:** No usar prompt caching
**✅ Solución:** Siempre implementar cache para prompts estáticos

**❌ Error:** No manejar errores de rate limit
**✅ Solución:** Implementar retry con exponential backoff

**❌ Error:** No trackear costos
**✅ Solución:** Monitorear tokens y costo por request

---

### 18. mcp-builder

**❌ Error:** No validar inputs
**✅ Solución:** Siempre validar parámetros de entrada

**❌ Error:** No manejar errores graceful
**✅ Solución:** Retornar errores claros, no crashes

**❌ Error:** No documentar tools
**✅ Solución:** Cada tool debe tener descripción clara y parámetros documentados

---

### 19. frontend-design

**❌ Error:** No considerar responsive
**✅ Solución:** Siempre testear en mobile y desktop

**❌ Error:** No usar design system existente
**✅ Solución:** Respetar tokens y componentes existentes

**❌ Error:** No verificar accessibility
**✅ Solución:** WCAG 2.1 AA como mínimo

---

### 20. market

**❌ Error:** No calibrar con la marca existente
**✅ Solución:** Cargar brand voice antes de generar contenido

**❌ Error:** No medir resultados
**✅ Solución:** Implementar tracking desde el inicio

**❌ Error:** No segmentar audiencia
**✅ Solución:** Definir buyer persona antes de crear contenido

---

## 📋 Checklist General de Gotchas

Antes de CADA tarea, verificar:

- [ ] ¿Cargo contexto al inicio? (`mem_context`)
- [ ] ¿Sigo la secuencia correcta del workflow?
- [ ] ¿Documenté decisiones y learnings?
- [ ] ¿Incluyo tests cuando aplique?
- [ ] ¿El output cumple calidad mínima?
- [ ] ¿Reporté progreso al usuario?
