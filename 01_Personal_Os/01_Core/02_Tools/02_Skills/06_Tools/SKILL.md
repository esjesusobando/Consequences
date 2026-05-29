---
name: tools
description: >
  Área de TOOLS — Skill Creator, Testing, DevOps, Development.
  Skills para creación de skills, testing, DevOps y desarrollo.
  Triggers on: skill creator, testing, devops, development, accessibility, performance, octopus, vibe coding, document processing
---

# 🛠️ TOOLS — Skill Creator, Testing, DevOps, Development

## Esencia Original

Tools es el taller del sistema — donde se fabrican y mantienen las skills que el resto del OS ejecuta. Cada sub-área es un banco de trabajo diferente: Skill Creator para la línea de montaje, Testing para el control de calidad, DevOps para la infraestructura. Octopus es el más paradigmático: nació porque un agente solo no daba abasto, y hoy es el patrón de ejecución paralela que mueve los workflows pesados. Sin Tools, el sistema no se construye ni se repara.

**Área Funcional:** 06_Tools
**Versión:** 2.0 | **Última actualización:** 2026-05-28

---

## Sub-áreas y Contenido

| N° | Sub-área                           | Descripción                     |
|----|-----------------------------------|--------------------------------|
| 01 | `01_Skill_Creator/`                | Creación de skills              |
| 02 | `02_Skill_Template/`               | Templates para skills           |
| 03 | `03_Anthropic_Harness/`            | Harness para Claude Code        |
| 04 | `04_DevOps/`                       | Operaciones DevOps              |
| 05 | `05_Vibe_Coding/`                  | Coding por vibes                |
| 06 | `06_Testing/`                      | Testing y QA                    |
| 07 | `07_Performance/`                  | Performance optimization        |
| 08 | `08_Skill_Creator_Invictus/`       | Skill creator para Invictus     |
| 09 | `09_Accessibility/`                | Accesibilidad web               |
| 10 | `10_Octopus/`                      | Octopus — Ejecución paralela    |
| 11 | `11_Doc_Processing/`               | Procesamiento de documentos     |
| 12 | `12_Qmd/`                          | Búsqueda híbrida BM25 + embed   |
| 13 | `13_System_Master/`                | System Guardian, MCP Builder    |
| 14 | `14_Silicon_Valley_Data_Analyst/`  | Data analysis, SQL, pandas      |
| 15 | `15_Ai_News_Weekly_Report/`        | News semanal con IA             |

## Consolidación

Esta área se redujo de **30 a 15** directorios (12 duplicados archivados en `05_Archive/02_Skills_Legacy/06_Tools/`).

## Octopus — Quick Reference

```
06_Tools/10_Octopus/
├── README.md           ✅
└── 00_Octopus_Skill/
    └── SKILL.md        ✅
```

## Skills Principales

| Skill              | Ubicación                       | Descripción              |
|-------------------|--------------------------------|-------------------------|
| **Octopus**        | `10_Octopus/00_Octopus_Skill/`  | Multi-brazos paralelo    |
| **System Master**  | `13_System_Master/`             | System Guardian, MCP     |
| **Skill Creator**  | `01_Skill_Creator/`             | Crear nuevas skills      |
| **Testing**        | `06_Testing/`                   | Test suites              |

## Runbook: Crear Nueva Skill

```bash
1. Copiar template de 02_Skill_Template/
2. Crear SKILL.md con frontmatter
3. Definir triggers y description
4. Agregar a skill-registry
```

## Testing

```bash
# Ejecutar tests
pytest tests/

# Coverage
pytest --cov
```

## ⚠️ Gotchas

### Skill sin frontmatter válido
> La skill se crea pero el skill-registry la rechaza porque el YAML es inválido.

- **Por qué**: Skill Creator genera el archivo con el template, pero si el frontmatter tiene errores de sintaxis YAML (indentación, comillas mal cerradas, caracteres especiales), el registry no lo parsea y la skill queda invisible.
- **Solución**: Validar el YAML después de crear la skill: ejecutar `python -c "import yaml; yaml.safe_load(open('SKILL.md'))"` o usar el linter de skills. La skill no está lista hasta que pasa validación.

### Octopus sin control de paralelismo
> Octopus lanza demasiados brazos y satura el rate limit del modelo.

- **Por qué**: Octopus ejecuta brazos en paralelo sin límite configurado. Si cada brazo llama al modelo, el rate limit se excede y los brazos empiezan a fallar con errores 429.
- **Solución**: Configurar `MAX_CONCURRENT_BRANCHES: 4` en Octopus. Implementar backoff exponencial en cada brazo. Monitorear errores 429 en el log de ejecución.

### Testing sin cobertura de integración
> Los tests unitarios pasan pero el sistema falla en producción.

- **Por qué**: `06_Testing/` cubre unit tests pero no integration tests. Las skills interactúan entre sí (ej: Hillary → Engram → Life OS) y esas interacciones no se testean. Un cambio en el formato de mem_save rompe la cadena sin que los tests lo detecten.
- **Solución**: Agregar integration tests que prueben cadenas completas: (1) entrada → (2) procesamiento → (3) persistencia. Usar scripts en `06_Testing/integration/` que ejecuten workflows reales en seco.

## 💾 State Persistence

| Componente | Persistencia | Mecanismo |
|---|---|---|
| Skills instaladas | ✅ Permanente | Directorios en `02_Skills/` + skill-registry index |
| Templates de skills | ✅ Archivo | `02_Skill_Template/` — immutables por diseño |
| Tests results | ⚠️ Por ejecución | Logs en `06_Testing/reports/` — no hay historial |
| Config DevOps | ✅ Archivo | Scripts y configs en `04_DevOps/` |

---

*Área Tools v2.0 — Consolidación 30→15 completada — 2026-05-28*
