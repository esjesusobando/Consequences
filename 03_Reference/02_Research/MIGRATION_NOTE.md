# Research — Nota de Migración

> **Estado actual:** Directorio funcional dentro de `.obsidian/Oband_Os/`
> **Problema:** Estructura inusual — Research vive dentro de la carpeta de configuración de Obsidian
> **Solución:** Mantener donde está por ahora, migrar cuando el vault se estabilice

## Por qué NO migrar ahora

1. **95 archivos** con wikilinks internos — rompería todas las referencias
2. **Metodología AI Research OS** espera `06_Research/` en la raíz del vault
3. **Scripts Python** (`build_index_yaml.py`, `research-lint`, etc.) usan rutas relativas
4. **Skill paths** en `.claude/skills/` y `.opencode/skills/` apuntan a esta ubicación

## Plan de migración (futuro)

Cuando el vault se estabilice:

```
Oband_Os/
├── 06_Research/           ← Mover aquí (raíz del vault)
├── .obsidian/
│   └── Consequences/      ← Vault original
└── ...
```

### Pasos para migrar

1. Crear backup completo de `06_Research/`
2. Mover a raíz del vault
3. Actualizar wikilinks en todas las notas (usar sed)
4. Actualizar paths en scripts Python
5. Actualizar skill paths en `.claude/skills/` y `.opencode/skills/`
6. Verificar con `research-lint`

### Riesgos

- Wikilinks rotos si se olvida alguna referencia
- Scripts Python fallan si no se actualizan paths
- Skills no encuentran el directorio

## Mientras tanto

El directorio funciona correctamente donde está. La única molestia es estética (está dentro de `.obsidian/`).

---
*Oband_Os — Nota de migración pendiente*