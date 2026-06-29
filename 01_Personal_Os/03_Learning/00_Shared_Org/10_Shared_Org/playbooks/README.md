# Playbooks — Procesos Repetitivos

> Playbooks documentan **cómo se hacen las cosas** paso a paso.
> Son LLM-agnósticos: cualquier IA puede leerlos y ejecutarlos.

---

## Estructura de un Playbook

Cada playbook es un archivo `.md` con:

```yaml
---
title: "Nombre del Playbook"
version: 1.0
owner: "Rol/Persona responsable"
last_reviewed: "YYYY-MM-DD"
tags: [categoria, subcategoria]
dependencies: []
inputs:
  - name: "nombre del input"
    type: "string | file | selection"
    description: "Qué se necesita"
outputs:
  - name: "nombre del output"
    type: "document | decision | action"
    description: "Qué se produce"
---
```

---

## Playbooks

| #   | Playbook | Estado      | Owner |
| --- | -------- | ----------- | ----- |
| 1   | —        | 📝 Pendiente | —     |

---

## Templates

Usar `00-template.md` para crear nuevos playbooks.