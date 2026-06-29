---
name: invictus-web
description: >
  Área de INVICTUS WEB — Superpowers, Buscador Skills, Playwright.
  Skills para automatización web, browser, y superpoderes de desarrollo.
  Triggers on: invictus web, playwright, browser automation, superpowers, web scraping, chrome devtools, buscador skills
sota_upgraded: true
---

# 🌐 INVICTUS WEB — Superpowers, Buscador Skills, Playwright

## Esencia Original

Invictus Web es la interfaz del sistema con el mundo exterior — browser automation, web scraping, DevTools. Playwright no está aquí solo para tests: es el brazo que extiende el agente al navegador. Los Superpowers son atajos que convierten acciones frecuentes en comandos de un solo paso. El Buscador Skills resuelve un problema concreto: el sistema tiene decenas de skills y el usuario no siempre sabe cuál invocar. Sin esta capa, el agente opera en una burbuja sin acceso a la web.

**Área Funcional:** 07_Invictus_Web
**Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Sub-áreas y Contenido

| Sub-área             | Descripción             |
|---------------------|------------------------|
| `01_Superpowers/`    | Superpoderes del sistema|
| `02_Buscador_Skills/`| Buscador de skills      |
| `03_Playwright/`     | Automatización browser  |

## Integración

- **Playwright MCP**: Browser automation
- **Chrome DevTools MCP**: Chrome DevTools
- **Exa MCP**: Web search

## Playwright Runbook

```bash
# Capturar screenshot
playwright screenshot [url] [output.png]

# Automatización
npx playwright test
```

## ⚠️ Gotchas

### Playwright sin waitFor
> El test falla porque el selector existe pero el elemento todavía no es interactuable.

- **Por qué**: Playwright ejecuta rápido — más rápido que el navegador. Si el código busca un selector y el elemento está en el DOM pero no terminó de cargar (imágenes, event listeners), Playwright falla silenciosamente o interactúa con un elemento a medio cargar.
- **Solución**: Siempre usar `waitForSelector` + `waitForLoadState` antes de interactuar. Para SPAs, esperar por `networkidle` después de cada navegación. Nunca confiar en `page.waitForTimeout`.

### Superpower sin validación
> Un superpower ejecuta una acción destructiva sin confirmación.

- **Por qué**: Los Superpowers están diseñados para ser rápidos — un comando, una acción. Pero esa velocidad es peligrosa si el superpower borra archivos, cierra pestañas o modifica config sin pedir confirmación.
- **Solución**: Categorizar superpowers por nivel de riesgo: (🔵) seguros — solo lectura, (🟡) cuidado — modifican estado, (🔴) peligrosos — destructivos. Los 🔴 siempre deben pedir confirmación antes de ejecutar.

### Buscador Skills sin contexto
> El buscador encuentra la skill pero el agente no sabe cómo usarla.

- **Por qué**: El Buscador Skills indexa nombres y descripciones de skills, pero no su semántica de uso. Encuentra el archivo correcto pero el agente no tiene suficiente metadata para saber cuándo y cómo invocarla correctamente.
- **Solución**: Enriquecer el índice con ejemplos de uso y parámetros requeridos. Cada skill debe exponer: (1) trigger keywords, (2) input esperado, (3) output producido. El buscador debe mostrar estos 3 campos en resultados.

## 💾 State Persistence

| Componente            | Persistencia   | Mecanismo                                                       |
|----------------------|---------------|----------------------------------------------------------------|
| Buscador skills index | ⚠️ Bajo demanda| Se regenera al buscar — no hay índice persistente entre sesiones|
| Playwright scripts    | ✅ Archivo      | Scripts en `03_Playwright/` — reutilizables                     |
| Superpowers config    | ✅ Archivo      | Config en `01_Superpowers/` — persistente entre sesiones        |
| Chrome DevTools sesión| ❌ No persiste  | Cada sesión DevTools empieza fresh                              |

---

*Área Invictus Web v1.0 — 2026-05-19*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
