---
name: compound-engineering
description: "Compound Engineering - Captura y reutiliza conocimiento del equipo. Triggers: compound, knowledge capture, lessons learned, document solution, capturar conocimiento. Triggers on: compound, knowledge capture, lessons learned, document solution, capturar conocimiento, solution documentation, problem solving"
version: 1.0.0
---

# Compound Engineering

## Propósito

Sistema de capitalización de conocimiento - documenta soluciones para que el equipo no repita trabajo.

## Esencia Original

Compound Engineering nace de una verdad incómoda: en el software, el equipo resuelve el mismo problema dos veces porque nadie documentó la primera solución. No se trata de documentar por documentar — se trata de que el tiempo invertido en resolver un problema difícil se multiplique en valor cada vez que alguien evita repetir ese esfuerzo. El conocimiento no capitalizado es deuda técnica invisible.

## Cuándo Usar

- "compound"
- "capturar conocimiento"
- "documentar solución"
- "lessons learned"
- Al resolver un problema difícil

## Flujo

1. **Detectar**: Problema resuelto recientemente
2. **Documentar**: Escribir la solución
3. **Categorizar**: Guardar en 04_Operations/06_Solutions/
4. **Vincular**: Relacionar con issues existentes

## Categorías de Soluciones

- build-errors/
- test-failures/
- performance-issues/
- database-issues/
- security-issues/

## Scripts

- 62_Tool_Shed.py: Selector de MCPs por contexto

## ⚠️ Gotchas

### Sin categoría válida
> Si guardas en categoría que no existe, el script falla.

- **Por qué**: El validador recorre `04_Operations/06_Solutions/` buscando subdirectorios existentes. Si la categoría no está, el script no tiene dónde escribir y lanza error.
- **Solución**: Crear la carpeta primero en `04_Operations/06_Solutions/`. `mkdir -p 04_Operations/06_Solutions/<categoria>/`

### Documentación vacía
> Si documentas sin contexto (qué problema, por qué, cómo), la knowledge no es reutilizable.

- **Por qué**: Una solución sin contexto es solo un fragmento de código. Quien la lea después no sabrá si aplica a su problema ni por qué se tomó esa decisión.
- **Solución**: Seguir siempre la plantilla: "What → Why → How → Learned". Incluir el contexto del problema, no solo la respuesta.

### Duplicados
> Si guardas la misma solución dos veces, pierdes trazabilidad.

- **Por qué**: Dos documentos sobre el mismo tema se bifurcan — futuras lecturas encuentran información contradictoria o incompleta.
- **Solución**: Antes de crear, buscar en `06_Solutions/` por keywords. Si existe, actualizar el documento en lugar de crear uno nuevo.

### Sin vínculo a issues
> Si no vinculas con el issue original, no hay trazabilidad.

- **Por qué**: Sin el issue/PR original, la solución flota sin contexto del sistema — no se sabe qué versión aplica, ni qué decisión de negocio la motivó.
- **Solución**: Incluir referencia al issue/PR en el documento. Formato: `Relacionado: #ISSUE-123` o `PR: #456`.

## 💾 State Persistence

| Componente             | Persistencia     | Mecanismo                                                |
|-----------------------|-----------------|---------------------------------------------------------|
| Soluciones documentadas| ✅ Permanente     | Archivos `.md` en `04_Operations/06_Solutions/`          |
| Categorías disponibles | ✅ Archivo        | Directorios en `06_Solutions/` + validación al guardar   |
| Índice de búsqueda     | ⚠️ Bajo demanda  | Se regenera con cada búsqueda — no hay índice persistente|
| Vínculos a issues      | ✅ En el documento| Formato `Relacionado: #ISSUE-123` incluido en el template|

---

*Skill Version: 1.0.0*
