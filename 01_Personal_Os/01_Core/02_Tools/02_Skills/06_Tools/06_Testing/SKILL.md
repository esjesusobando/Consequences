---
name: testing-index
description: "Estrategias y patrones de testing: TDD, debugging, cobertura, E2E, integración. Triggers: testing, test, tdd, coverage, e2e, debugging, integration test."
version: 1.0.0
---

# Testing — Skill Index

## Esencia Original

El testing no es una fase ni un chore — es el **sistema nervioso** del proyecto. Cada test que escribís es una decisión de diseño congelada: "esto funciona así, y si alguien lo rompe, quiero saberlo". Esta skill index reúne 17 sub-skills que cubren desde TDD puro hasta validación de shell scripts, porque la calidad no es una capa, es una propiedad emergente de todo el sistema.

## Descripción
Estrategias y patrones de testing: TDD, debugging sistemático, cobertura, E2E, integración, evaluación y calidad de código.

## Sub-Skills

| #                              | Skill                                                    | Descripción                                                     |
|-------------------------------|---------------------------------------------------------|----------------------------------------------------------------|
| 01                             | `01_Test_Driven_Development`                             | Ciclo RED-GREEN-REFACTOR                                        |
| 02                             | `02_Systematic_Debugging`                                | Debugging estructurado y sistemático                            |
| 03                             | `03_Verify_And_Commit`                                   | Verificación pre-commit                                         |
| 04                             | `04_Test_Resource_Management`                            | Gestión de recursos en tests                                    |
| 05                             | `05_Testing_Coverage`                                    | Estrategia de cobertura                                         |
| 06                             | `06_Go_Testing`                                          | Testing en Go                                                   |
| 07                             | `07_Tui_Quality`                                         | Calidad en TUIs (Bubbletea)                                     |
| 08                             | `08_E2e_Testing`                                         | Testing End-to-End                                              |
| 09                             | `09_Integration_Testing`                                 | Tests de integración                                            |
| 10                             | `10_Edge_Case`                                           | Manejo de edge cases                                            |
| 11                             | `11_Test_Coverage`                                       | Cobertura de tests v2                                           |
| 12                             | `12_Evaluation`                                          | Evaluación de outputs de IA                                     |
| 13                             | `13_Skill_Testing_Automation`                            | Automatización de testing de skills                             |
| 14                             | `14_Commit_Hygiene`                                      | Higiene de commits                                              |
| 15                             | `15_Shellcheck`                                          | Validación de scripts shell                                     |
| 16                             | `16_Docs_Alignment`                                      | Alineación de docs con código                                   |
| 17                             | `17_Testing_Coverage`                                    | Testing coverage patterns                                       |

## Uso
Cargar según el tipo de test o estrategia de calidad requerida.

## ⚠️ Gotchas

### Skill incorrecta para el problema
> Usar E2E Testing para algo que debería ser un test unitario.

- **Por qué**: Cada sub-skill resuelve un nivel distinto de la pirámide de testing. Usar E2E para lógica pura es lento y frágil.
- **Solución**: Identificar el nivel antes de cargar la skill: lógica pura → TDD, integración → Integration, flujo completo → E2E.

### Debugging sin TDD primero
> Ir directo a debugging sistemático sin haber escrito el test que reproduce el bug.

- **Por qué**: El debugging encuentra la causa, pero sin un test que la reproduzca, no sabés si la solución realmente funciona.
- **Solución**: Primero escribir el test rojo (RED), después debuggear, después verificar que pasa (GREEN).

### Cobertura como meta
> Optimizar para 100% cobertura en vez de para tests que importan.

- **Por qué**: 100% cobertura con tests triviales da falsa confianza. El riesgo está en lo que no se testea con profundidad.
- **Solución**: Priorizar tests de lógica de negocio y edge cases sobre tests de getters/setters o ramas triviales.

---

*Skill Version: 1.0.0*
