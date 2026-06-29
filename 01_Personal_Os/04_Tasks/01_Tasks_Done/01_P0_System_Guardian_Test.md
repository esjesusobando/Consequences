---
status: d
priority: high
created: 2026-03-20
updated: 2026-04-25
completed_date: 2026-04-25
tags: [system-guardian, testing]
---

# P0: Testing System Guardian Post-Implementación

## Descripción

Testing pendiente después de implementar System Guardian v1.0 con alias, hooks y metodología 3-agents.

## Tareas Completadas ✅

### 🔴 Alta Prioridad

- [x] **Testear alias `gr` en terminal** ✅
  ```bash
  gr              # Funciona ✅

  gra             # Funciona ✅

  gr-agents      # Funciona ✅ (tarda por agents)

  ```
  * *Ubicación:** ~/.bashrc (funciones), ~/gr (script bash ejecutable)

- [ ] **Probar hook stop al cerrar sesión Claude**
  ```bash
  # Opción 1: Cerrar sesión y ver output

  # Opción 2: Ejecutar manualmente

  python .AGENT/04_EXTENSIONS/hooks/03_Lifecycle/stop.py
  ```
  * *Verificar:** Beep + notificación si hay issues

- [ ] **Documentar metodología 3-Agents + Judge en 01_Personal_Os/11_AGENTS.md**
  ```markdown
  ## 3-Agents + Judge Review

  (Agregar sección en 01_Personal_Os/11_AGENTS.md)
  ```

### 🟡 Media Prioridad

- [ ] **Regenerar trees**
  ```bash
  python 04_Operations/04_Tools/02_Generate_Tree.py
  ```

- [ ] **Testear installer completo**
  ```bash
  python 04_Operations/07_Installer/installer.py
  # Modo migrate (detecta config.json)

  ```

### 🟢 Baja Prioridad

- [ ] Integrar con SDD workflow
- [ ] QMD Embeddings (GPU lento)
- [ ] Skills profiles

## Scripts de Test

```bash
# Test 1: Alias ✅

gr
gra
gr-agents

# Test 2: Hook

python .AGENT/04_EXTENSIONS/hooks/03_Lifecycle/stop.py --no-guardian

# Test 3: Installer

python 04_Operations/07_Installer/installer.py

# Test 4: Tests

pytest 04_Operations/05_Tests/ -v
```

## Referencias

- **Nota de proceso:** `01_Core/03_Process_Notes/14_Sesion_System_Guardian_Integracion_2026-03-20.md`
- **Super Report:** `04_ENGINE/06_Reports/04_Super_Report_System_Guardian_2026-03-20.md`
- **Script principal:** `04_ENGINE/03_Scripts_Os/79_System_Guardian.py`

## Checklist Resultado

- [x] `gr` funciona en terminal
- [ ] Hook stop detecta cambios y ejecuta Guardian
- [ ] Beep suena si hay issues
- [ ] Reporte se genera en `06_Reports/`
- [ ] Metodología documentada en 01_Personal_Os/11_AGENTS.md


---
# 🧠 AI Task Planning Framework (Ajuste de Tareas)
---
# Plantilla de Planificación de Tareas IA - Estilo ShipKit

> **Acerca de esta Plantilla:** Un marco sistemático para la codificación asistida por IA en Cursor.

- --

## 0. 🧩 Context Briefing (Ignición de Tarea)

> [!TIP]
> **INSTRUCCIÓN:** Copia el siguiente bloque en un NUEVO chat de Cursor para iniciar esta tarea con contexto puro.

```markdown
# Context Ignition: [Nombre de la Tarea]

Actúa como un experto en PersonalOS. Mi objetivo es completar la tarea: [Título].
Contexto relevante: [Metas/Refs].
Estado actual: [Resumen corto].
Por favor, lee el archivo de la tarea en `04_Operations/[archivo].md` y propón los primeros pasos.
```

- --

## 1. Resumen de la Tarea

### Título de la Tarea

* *Título:** [Nombre de la Tarea]

### Declaración de Objetivo

* *Objetivo:** [¿Qué estamos construyendo y por qué?]

- --

## 2. Análisis del Proyecto y Estado Actual

### Tecnología y Arquitectura

- **Frameworks y Versiones:** Next.js (última), React 19
- **Lenguaje:** TypeScript (Estricto)
- **Base de Datos y ORM:** Prisma + PostgreSQL
- **UI y Estilo:** Tailwind CSS, Lucide Icons
- **Autenticación:** Better Auth
- **Patrones Arquitectónicos Clave:** App Router, Server Components, Server Actions

> **Complemento Estratégico (CONDUCTA IA):** No supongas. Audita el repositorio. Revisa `package.json`, `tsconfig.json`, `middleware.ts`, `drizzle/schema` y carpetas de componentes antes de proponer cambios.

### Estado Actual

[Contexto de @workspace - describe qué existe y qué falta]

- --

## 3. Contexto y Definición del Problema

### Definición del Problema

[¿Por qué es necesario este cambio? Impacto en el usuario/negocio]

### Criterios de Éxito

- [ ] Listado de resultados específicos y medibles
- [ ] [OCR Success Criteria: Resultados medibles y específicos de la tarea]

- --

## 4. Contexto del Modo de Desarrollo

- **🚨 Etapa del Proyecto:** Desarrollo (Nuevo / Feature / Fix)
- **Cambios Disruptivos:** [Aceptables / Evitar]
- **Manejo de Datos:** Preservar esquema a menos que se indique migración
- **Prioridad:** [Velocidad vs Estabilidad]

> **Complemento Ágil (OCR):**
>
> - Esta es una nueva aplicación en desarrollo activo (Modo ShipKit).
> - Los usuarios son desarrolladores/testers (no producción).
> - Prioridad: Velocidad y simplicidad sobre la preservación de datos antiguos.
> - Refactorización agresiva permitida (borrar/recrear componentes según sea necesario).

- --

## 5. Requerimientos Técnicos

### Requerimientos Funcionales

- [ ] El usuario puede...
- [ ] El sistema automáticamente...

### Requerimientos No Funcionales

- **Rendimiento:** Interacciones rápidas (<200ms)
- **Seguridad:** Validaciones de sesión, CSRF
- **Soporte de Temas:** Dark Mode compatible con Tailwind

- --

## 6. Cambios en Datos y Base de Datos

[Actualizaciones de esquema de Prisma, si aplica]

> **ANÁLISIS ESTRATÉGICO:** Si hay múltiples formas de modelar los datos o trade-offs significativos, evalúa Opciones (Pros/Contras/Riesgo) aquí antes de proponer la solución final.

- --

## 7. Cambios en API y Backend

[Server Actions / Rutas de API]

- --

## 8. Cambios en Frontend

[Nuevos Componentes / Actualizaciones de Páginas]

- --

## 9. Plan de Implementación

1. Fase 1: ...
2. Fase 2: ...

- --

## 10. Seguimiento de Finalización de Tareas

La IA debe actualizar este archivo con [x] a medida que se completen los pasos. Una vez finalizada la tarea, mover este archivo a `Tasks/task_done/`.

- --

## 11. Estructura de Archivos y Organización

[Lista de archivos nuevos y modificados]

- --

## 12. Instrucciones para el Agente IA

🎯 **PROCESO MANDATORIO:**

1. Analizar el código base antes de escribir.
2. Seguir TypeScript estricto (prohibido 'any').
3. Reutilizar utilidades y componentes existentes.
4. Actualizar los checkboxes de esta tarea.

> **CONDUCTA ESTRATÉGICA (OCR):**
>
> - **REALIZAR ANÁLISIS ESTRATÉGICO CUANDO:** Existen múltiples enfoques técnicos viables, trade-offs significativos, o decisiones arquitectónicas que afecten el futuro.
> - **OMITIR ANÁLISIS CUANDO:** Sea una corrección obvia, cambio menor aislado o patrón ya establecido.
> - **ESTRUCTURA DE OPCIONES:** Opción [X] -> Enfoque -> Pros -> Contras -> Riesgo/Complejidad.

- --

## 13. Auditoría de Diseño Dieter Rams

> **FILTRO DE CALIDAD:** Para tareas que involucren UI/UX, auditar contra la "Honestidad" y "Minimalismo".

- [ ] ¿Es innovador y útil?
- [ ] ¿Es estético y hace que el producto sea comprensible?
- [ ] ¿Es discreto y honesto?
- [ ] ¿Es duradero y cuida cada detalle?
- [ ] ¿Es respetuoso con el medio ambiente y ofrece el mínimo diseño posible?

- --

## 14. Alineación Estratégica (GOALS.md)

- [ ] **Métrica North Star:** ¿Cómo acerca esta tarea a la visión de 5 años?
- [ ] **Prioridad PersonalOS:** [P0/P1/P2/P3] según el framework de `GOALS.md`.

- --

## 15. Análisis de Impacto de Segundo Orden

## [Posibles regresiones / Problemas de rendimiento / Efectos en otras áreas]

© 2026 PersonalOS | Estándar de Ingeniería de Silicon Valley
