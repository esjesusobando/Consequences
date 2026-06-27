---
title: "{{Nombre del Playbook}}"
version: 1.0
owner: "{{Rol responsable}}"
last_reviewed: "{{YYYY-MM-DD}}"
tags: []
dependencies: []
inputs:
  - name: "{{input}}"
    type: "string"
    description: "{{qué se necesita}}"
outputs:
  - name: "{{output}}"
    type: "document"
    description: "{{qué se produce}}"
---

# {{Nombre del Playbook}}

## Objetivo
{{Qué problema resuelve este playbook}}

## Cuándo Usarlo
- {{Situación 1}}
- {{Situación 2}}

## Actores
- **{{Rol}}**: {{responsabilidad}}
- **{{Rol}}**: {{responsabilidad}}

## Prerrequisitos
- [ ] {{requisito 1}}
- [ ] {{requisito 2}}

---

## Paso a Paso

### 1. {{Paso 1}}
{{Descripción de qué hacer en este paso}}

**Input:** {{qué se necesita}}
**Output:** {{qué se produce}}

```yaml
# Ejemplo de output esperado
clave: valor
```

### 2. {{Paso 2}}
{{Descripción de qué hacer}}

**Check:**
- [ ] {{verificación 1}}
- [ ] {{verificación 2}}

### 3. {{Paso 3}}
{{Descripción}}

---

## Calidad Gates

- [ ] {{gate 1}}
- [ ] {{gate 2}}
- [ ] {{gate 3}}

## Errores Comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| {{error}} | {{síntoma}} | {{solución}} |

## Métricas

| Métrica | Target | Cómo medir |
|---------|--------|-----------|
| {{métrica}} | {{target}} | {{medición}} |

---

## Histórico

| Versión | Fecha | Cambio | Autor |
|---------|-------|--------|-------|
| 1.0 | {{YYYY-MM-DD}} | Creación inicial | — |
