---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\12_Frictionless_Creation\01_Code_Clean_Manifesto.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Frameworks\12_Frictionless_Creation\01_Code_Clean_Manifesto.md"
sync_date: "2026-08-01T00:55:47.919951"
sync_updated: true
---

# 01 — Code Clean Manifesto

> **Aplicación de los Principios de Fricción Cero al desarrollo de software**
> "Código limpio no es estética — es eliminar fricción mental."

---

## ⚡ Principio: Código Muerto = Refresco en la Nevera

**Cada línea de código que no se usa, import sin referencia, variable sin uso, dependencia obsoleta, función comentada — te absorbe energía mental.**

Así como tener un refresco en la nevera te hace pensar en él aunque no lo tomes, el código muerto te hace preguntar: "¿Esto se usa? ¿Puedo borrarlo? ¿Y si algo depende de esto?"

### Reglas Code Clean

| Regla | Descripción | Fricción que elimina |
|-------|-------------|---------------------|
| 🚫 **No imports sin usar** | Cada archivo: limpia imports al guardar | No preguntarse "¿esto se usa?" |
| 🚫 **No variables sin referencia** | Si declaras y no usas, borra | Ruido visual en el código |
| 🚫 **No código comentado** | Git guarda el historial. NO comentas código, lo borras | Dudas de si el código comentado es relevante |
| 🚫 **No dependencias obsoletas** | `npm outdated`, `go mod tidy` regular | Riesgo de seguridad + ruido mental |
| 🚫 **No archivos huérfanos** | Si no se importa desde ningún lado, no debería existir | Confusión sobre la arquitectura |

---

## ⚡ Principio: Materia Prima de Código

**No escribas código desde cero. Tu "swipe file" de desarrollo:**

### Lo que DEBES tener (y alimentar):

| Recurso | Propósito | Elimina esta fricción |
|---------|-----------|----------------------|
| **Snippets** | Patrones de código que usas seguido | Tener que recordar o googlear lo mismo |
| **Templates** | Scaffolding de proyectos, componentes, archivos | Configurar desde cero cada vez |
| **Knowledge Base** | Decisiones, ADRs, por qué se hizo X | Repetir investigación, re-aprender |
| **Skills de agente** | Automatización de tareas repetitivas | Hacer manual lo que ya hiciste antes |
| **Swipe file de UI** | Componentes, layouts, paletas que te gustan | Diseñar desde cero cada pantalla |
| **Swipe file de arquitectura** | Diagramas, patrones, estructuras que funcionaron | Decidir estructura cada nuevo proyecto |

### ⚡ Regla: Si lo escribes dos veces, es skill
> La tercera vez que haces la misma tarea de código, CONVIÉRTELA EN SKILL. No esperes.

---

## ⚡ Principio: Entorno Cero Fricción

**Tu entorno de desarrollo debe hacer que la acción correcta sea la más fácil.**

### Checklist de Entorno Dev

| Aspecto | Ideal | Fricción que elimina |
|---------|-------|---------------------|
| **IDE** | Configurado con shortcuts para TODO | Tocar el mouse rompe el flow |
| **Terminal** | Aliases para comandos frecuentes | Escribir comandos largos |
| **Tests** | `npm test` en un shortcut, watcher activo | Tener que acordarse del comando exacto |
| **Lint + Format** | On-save, no manual | Decidir estilos, limpiar manual |
| **Git** | Hooks automáticos (pre-commit, pre-push) | Acordarse de correr checks |
| **Build** | Dev server con hot reload | Parar y rebuildear manualmente |

### ⚡ Regla: Si lo haces más de 3 veces, automatízalo
> El umbral de automatización es 3. No 10, no 20 — 3. A la tercera, script/alias/hook.

---

## ⚡ Principio: Adelántate en el Código

**Planifica HOY lo que escribirás MAÑANA.**

### Práctica: End-of-Session Ritual

Antes de terminar una sesión de código:

```
1. ✅ Commit con mensaje claro
2. ✅ ¿Qué quedó a medias? — déjalo en estado compilable
3. ✅ ¿Cuál es la PRÓXIMA LÍNEA que escribiré? — déjala comentada o en TODO
4. ✅ ¿Qué necesito mañana? — dependencias instaladas, branch lista, docs abiertas
```

**Resultado**: Mañana abres el proyecto y ya sabes EXACTAMENTE dónde continuar. Cero fricción.

---

## ⚡ Principio: Bootstrapping Cero Fricción

**Cuando empiezas un proyecto NUEVO, no empieces de cero.**

### Flujo de Inicio Rápido

```
1. Buscar en Knowledge Base proyectos similares
2. Clonar estructura que ya funcionó antes
3. Template de README, estructura de carpetas, CI config
4. Skills del agente cargadas para el stack
5. Swipe file abierto para referencias
6. SOLO ENTONCES: empezar a escribir código
```

### ⚡ Regla: El arranque es el momento de MÁS fricción
> Dedica el 10% del tiempo del proyecto a eliminar fricción de arranque. Te ahorrará el 50% del tiempo total.

---

## 🧠 Resumen Code Clean

| Principio Original | Versión Code Clean |
|-------------------|-------------------|
| Eliminar el estímulo | No código muerto, no imports sin usar, no dependencias obsoletas |
| Materia prima | Snippets, templates, knowledge base, skills |
| Adelantarse | End-of-session ritual, planificar mañana hoy |
| Herramientas que fluyen | IDE configurado, shortcuts, automatización |
| Solución adelantada | Identificar fricción del proyecto antes de empezar |

---

> **Código limpio no es una cuestión de gustos. Es eliminar fricción para que tu cerebro se enfoque en lo que importa: resolver problemas.**


> 🔗 Zona: [[03_Reference/01_Knowledge/Referencias/Frameworks/12_Frictionless_Creation/README]]
