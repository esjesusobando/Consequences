---
name: skill-template-base
description: "Template base para crear nuevas skills. Triggers: skill template, crear skill, nueva skill, template skill."
version: 1.0.0
---

# Skill Template — Skill Index

## Esencia Original

> **Metaskill**: Template estructurado que define el estándar mínimo para cualquier skill del PersonalOS, asegurando consistencia y calidad.

Esta skill es la **plantilla fundacional** del ecosistema. Define las convenciones que todas las skills deben seguir.

## Descripción
Template base para crear nuevas skills en el sistema PersonalOS. Provee la estructura estándar y convenciones que deben seguir todas las skills del ecosistema.

## Sub-Skills

| #                     | Skill                                 | Descripción                                                        |
|-----------------------|---------------------------------------|--------------------------------------------------------------------|
| 01                    | `01_Skill_Template`                   | Template base con estructura mínima de una skill                   |

## Uso
Usar como punto de partida al crear una nueva skill. Ver también `15_Skill_Creator_Oficial` para el proceso completo de creación.

---

## ⚠️ Gotchas

### ERROR 1: Olividar triggers en description
- **Por qué**: Sin triggers, el agente no sabe cuándo activar la skill
- **Solución**: Incluir "triggers: keyword1, keyword2" al final de la descripción

### ERROR 2: SKILL.md muy larga
- **Por qué**: Archivos >200 líneas saturan el contexto y afectan rendimiento
- **Solución**: Usar folder references/ para docs >200 líneas

### ERROR 3: Sin versión en YAML
- **Por qué**: Sin version, no hay forma de trackear cambios
- **Solución**: Siempre incluir version: X.X.X en frontmatter

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*
