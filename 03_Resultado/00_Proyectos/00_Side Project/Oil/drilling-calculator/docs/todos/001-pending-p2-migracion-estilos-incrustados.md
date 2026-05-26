---
status: pending
priority: p2
issue_id: 001
tags: [security, architecture, quality, code-review]
dependencies: []
---

# Problem Statement

El componente `OperatingWindow.tsx` utiliza `dangerouslySetInnerHTML` para inyectar estilos CSS. Aunque funciona localmente, evita el modelo de seguridad de React y dificulta la mantenibilidad y el cacheo de estilos por parte del navegador.

# Findings

- Archivo: `src/components/visuals/OperatingWindow.tsx`
- El bloque `<style dangerouslySetInnerHTML={{ __html: ... }} />` contiene más de 100 líneas de CSS.

# Proposed Solutions

## Opción A: Migrar a CSS Module (Recomendado)

Crear `OperatingWindow.module.css` e importar los estilos.

- **Pros**: Soporte nativo de Vite, aislamiento de estilos, seguridad.
- **Contras**: Requiere crear un nuevo archivo.

## Opción B: Usar styled-components o similar

- **Pros**: Estilos dinámicos potentes.
- **Contras**: Añade una dependencia extra (innecesario para PersonalOS).

# Acceptance Criteria

- [ ] Eliminar `dangerouslySetInnerHTML` de `OperatingWindow.tsx`.
- [ ] Mover todos los estilos a un archivo `.css` o `.module.css` dedicado.
- [ ] Verificar que la visualización no cambie un solo píxel.
