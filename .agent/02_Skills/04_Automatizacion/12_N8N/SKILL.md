---
name: n8n-automation
description: "Automatización con N8N. Triggers: n8n, automatización, workflow n8n, nodo python, nodo javascript, expression n8n, integrar n8n."
version: 1.0.0
---

# N8N — Skill Index

## Esencia Original

> **Metaskill**: Habilidad para crear, configurar y optimizar workflows de automatización en N8N, integrando código, APIs y herramientas MCP.

Esta skill es el **motor de automatización** del PersonalOS. Permite conectar servicios, automatizar tareas recurrentes y construir pipelines de datos.

## Descripción
Automatización con N8N: código JavaScript/Python, expresiones, configuración de nodos, herramientas MCP, validación y patrones de workflows.

## Sub-Skills

| #                       | Skill                                           | Descripción                                                |
|-------------------------|-------------------------------------------------|------------------------------------------------------------|
| 01                      | `01_N8n_Code_Javascript`                        | Nodos de código JavaScript en N8N                          |
| 02                      | `02_N8n_Code_Python`                            | Nodos de código Python en N8N                              |
| 03                      | `03_N8n_Expression_Syntax`                      | Sintaxis de expresiones N8N                                |
| 04                      | `04_N8n_Mcp_Tools_Expert`                       | Integración MCP en N8N                                     |
| 05                      | `05_N8n_Node_Configuration`                     | Configuración avanzada de nodos                            |
| 06                      | `06_N8n_Validation_Expert`                      | Validación de workflows                                    |
| 07                      | `07_N8n_Workflow_Patterns`                      | Patrones y best practices de workflows                     |

## Uso
Cargar la skill específica del componente N8N con el que se trabaja.

---

## ⚠️ Gotchas

### ERROR 1: Código Python sin manejo de errores en nodos
- **Por qué**: Errores en nodos Python rompen todo el workflow sin mensaje claro
- **Solución**: Wrappear todo código en try/except y usar console.error() para logs

### ERROR 2: Expresiones N8N sin validadción de tipos
- **Por qué**: Expressions con tipos incorrectos fallan silenciosamente en runtime
- **Solución**: Usar $json.type === "type" o validación explícita. Testear en modo desarrollo

### ERROR 3: Webhooks sin autenticación
- **Por qué**: Endpoints expuestos públicamente son vulnerables
- **Solución**: Siempre agregar headers de Authorization o usar API Key en query params

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*
