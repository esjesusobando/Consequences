---
description: 04_Test_Resource_Management
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# Skill 48: Test Resource Management

## 🎯 Objetivo Triggers on: testing, QA, quality, validation.

Gestionar los recursos del sistema durante la ejecución de pruebas para evitar el agotamiento de CPU/RAM y mantener el estado "Pure Green".

## 🛠️ Especificaciones Técnicas

- **Máximo de Workers**: 4 (Limitación estricta para CPUs móviles/domésticas).
- **Timeouts**: 30s por test unitario, 2min por test E2E.
- **Limpieza**: Borrado automático de DBs de prueba tras ejecución exitosa.

## 📋 Comandos de Referencia

- Vitest: `vitest --maxWorkers=4`
- Playwright: `playwright test --workers=4`
- Jest: `jest --maxWorkers=4`

## 🛡️ Regla Asociada

Referirse a `.cursor/rules/10_testing-resource-management.mdc` para la aplicación automática de estos límites.

## Esencia Original
> **Propósito:** 05_Test_Resource_Management - propósito del skill
> **Flujo:** Pasos principales del flujo de trabajo

## ⚠️ Gotchas (Errores Comunes a Evitar)

- **[ERROR]**: Error común
  - **Por qué**: Explicación
  - **Solución**: Cómo evitar

## 📁 Progressive Disclosure

> Para información detallada:
- [references/guide.md](references/guide.md) — Guía completa

## 🛠️ Scripts

- [scripts/run.py](scripts/run.py) — Script principal

## 💾 State Persistence

Guardar en:
-  — Evaluaciones
-  — Documentación


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
