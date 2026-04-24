---
name: compound-engineering
description: "Compound Engineering - Captura y reutiliza conocimiento del equipo. Triggers: compound, knowledge capture, lessons learned, document solution, capturar conocimiento."
version: 1.0.0
---

# Compound Engineering

## Propósito

Sistema de capitalización de conocimiento - documenta soluciones para que el equipo no repita trabajo.

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

- **Sin categoría válida**: Si guardas en categoría que no existe, el script falla. Solución: Crear la carpeta primero en `04_Operations/06_Solutions/`
- **Documentación vacía**: Si documentas sin contexto (qué problema, por qué, cómo), la knowledge no es reutilizable. Solución: Always follow the template: "What → Why → How → Learned"
- **Duplicados**: Si guardas la misma solución dos veces, pierdes trazabilidad. Solución: Buscar antes de crear nuevo documento
- **Sin vínculo a issues**: Si no vinculas con el issue original, no hay trazabilidad. Solución: Incluir referencia al issue/PR en el documento

---

*Skill Version: 1.0.0*
