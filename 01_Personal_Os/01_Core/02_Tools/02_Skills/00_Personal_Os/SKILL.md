---
name: personal-os-area
description: >
  Área de PERSONAL OS — Life OS, Hillary, Rituales.
  Skills para gestión de vida, productividad personal, y rituales del sistema.
  Triggers on: life os, personal os, hillary, rituales, productividad personal, gestión de vida, learning always
---

# 🌱 PERSONAL OS — Life OS, Hillary, Rituales

## Esencia Original

Personal OS es el centro nervioso del sistema — no es un conjunto de herramientas, es el sistema operativo de tu vida. Hillary no es un bot de productividad más: es la interfaz que transforma el caos del día a día en estructura ejecutable. Cada ritual, cada template, cada workflow existe porque hubo una iteración anterior que falló. Este skill área orquesta la relación entre el agente y el humano para que el sistema funcione aunque ninguno de los dos esté al 100%.

**Área Funcional:** 07_Personal_Os
**Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Sub-áreas y Contenido

| Sub-área             | Descripción                                        |
|---------------------|---------------------------------------------------|
| `01_Life_OS/`        | Sistema de vida personal                           |
| `02_Personal_Os/`    | Core del OS                                        |
| `03_Fantasticos/`    | **4 Fantásticos** — Swarm + Auditor + Engram + Docs|
| `04_Hillary.md`      | Legacy — agente Hillary                            |
| `08_Hillary/`        | **Hillary** — Personal Life OS Specialist          |
| `09_Learning_Always/`| **Learning Always** — Knowledge Compounding        |
| `05_Marca/`          | Gestión de marca personal                          |
| `06_Plantillas/`     | Templates del sistema                              |

## Metodologías Integradas

| Metodología        | Ubicación                       | Descripción                       |
|-------------------|--------------------------------|----------------------------------|
| **Hillary**        | `08_Hillary/`                   | Captura, rutinas, backlog personal|
| **Learning Always**| `09_Learning_Always/`           | Knowledge compounding             |
| **4 Fantásticos**  | `03_Fantasticos/26_Fantasticos/`| Swarm + Auditor + Engram + Docs   |

## Runbook: Daily Standup

```
1. Revisar Hillary_Inbox
2. Procesar entradas nuevas
3. Actualizar Daily_Report.md
4. Verificar tareas pendientes
5. Reportar a Gentleman
```

## Estructura de Life OS

```
07_Personal_Os/
├── 01_Life_OS/       # Sistema de vida
├── 08_Hillary/        # Skill Hillary ✅
├── 09_Learning_Always/ # Skill Learning ✅
└── 03_Fantasticos/    # 4 Fantásticos ✅
```

## ⚠️ Gotchas

### Hillary no responde
> El agente Hillary falla silenciosamente si no tiene contexto de la sesión.

- **Por qué**: Hillary depende del estado de sesión de Engram. Si la sesión expiró o se perdió el contexto, Hillary ejecuta acciones sin saber qué pasó antes.
- **Solución**: Verificar Engram context antes de llamar a Hillary. Si no hay sesión activa, ejecutar `mem_context` primero.

### Rituales se acumulan
> Los rituales diarios se vuelven ruido si no se completan y marcan.

- **Por qué**: El sistema no diferencia entre rituales pendientes y completados sin marcación explícita. Con el tiempo la lista crece y el agente pierde foco.
- **Solución**: Implementar estado de completitud en daily-report.md. Marcar ✅ al completar. No mantener más de 5 rituales activos simultáneamente.

### Life OS desincronizado
> Los cambios en el sistema de vida no se reflejan en Hillary automáticamente.

- **Por qué**: Hillary lee los archivos de Life OS al inicio de la sesión pero no detecta cambios en caliente. Si actualizás un template, Hillary sigue operando con la versión anterior.
- **Solución**: Después de modificar un archivo en Life OS, ejecutar `touch 07_Personal_Os/01_Life_OS/.reload` para forzar a Hillary a reindexar.

## 💾 State Persistence

| Componente | Persistencia | Mecanismo |
|---|---|---|
| Hillary backlog | ✅ Sesión cruzada | Engram mem_save vía `08_Hillary/` SKILL.md + session-summary |
| Daily report | ✅ Archivo | `Daily_Report.md` en `01_Life_OS/` |
| Rituales activos | ⚠️ Por sesión | Se pierden al cerrar — capturar en mem_session_summary |

---

*Área Personal OS v1.0 — 2026-05-19*
