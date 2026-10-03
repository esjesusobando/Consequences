# Proposal: Actualizar Documentación OS a v4.0 Consequences

## Intent

El sistema PersonalOS Think_Different está en **v4.0 Consequences** ( commits `c7ca03e8`, `8750740b`, `232dbffd` del 2026-05-10 ) pero la documentación de las carpetas 00-03 dice versiones antiguas (v3.2, v6.1, v3.1, v2.0, etc). Necesitamos actualizar TODO para que refleje el estado real del sistema y quede listo para producción.

## Scope

### In Scope
- Actualizar versión en todos los archivos de documentación de 01_Core/ (00_Workflows_Os, 01_Rules, 02_Tools)
- Verificar y corregir rutas referencedas en workflows (muchas apuntan a paths old v1.x)
- Actualizar 04_Operations/03_Scripts_Os/SCRIPTS_INDEX.md a v4.0
- Actualizar AGENTS.md (root y .agent) a v4.0 Consequences
- Verificar System_Map y CHANGELOG.md para coherencia

### Out of Scope
- No modificar código fuente de HUBs o scripts
- No crear nuevos workflows o reglas
- No modificar estructura de carpetas

## Capabilities

### New Capabilities
- Ninguna (es actualización de docs, no features)

### Modified Capabilities
- `documentation-v4`: La documentación del OS ahora refleja estado v4.0 Consequences

## Approach

1. **Auditoría rápida**: Grep recursivo para encontrar todos los archivos con versiones antiguas
2. **Plan de acción**: Lista de archivos a modificar con old→new version
3. **Actualización en batch**: Editar archivos en paralelo
4. **Validación final**: System Guardian para verificar consistencia

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `01_Personal_Os/01_Core/00_Workflows_Os/README.md` | Modified | v6.1 → v4.0 Consequences |
| `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md` | Modified | v3.2 → v4.0 Consequences |
| `01_Personal_Os/01_Core/00_Workflows_Os/01_Personal_Os/11_AGENTS.md` | Modified | v6.1 → v4.0 Consequences |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/README.md` | Modified | v3.3 → v4.0 Consequences |
| `01_Personal_Os/04_Operations/03_Scripts_Os/SCRIPTS_INDEX.md` | Modified | v2.0 → v4.0 Consequences |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md` | Modified | v3.1 → v4.0 Consequences |
| `01_Personal_Os/01_Core/00_Workflows_Os/02_Marvel/01_Iron_Man_Gen.md` | Modified | Rutas old v1.x → v4.0 |
| `.agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md` | Modified | Rutas old v1.x → v4.0 |
| `00_Winter_is_Coming/AGENTS.md` | Verify | Ya está en v3.2 Consequences (verificar) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Archivos con versiones en comments no detectados | Medium | Grep adicional por "v3.", "v2.", "v6.1" |
| Paths old en workflowsrom workflowsmd (no .md) | High | Revisar workflow definition files |
| Archivos en 05_Archive/ que referencian versions activas | Low | Ignorar carpeta Archive |

## Rollback Plan

- Git revert del commit con cambios de docs
- Los cambios son solo en archivos .md — rollback directo

## Dependencies

- Ninguna (documentación pura)

## Success Criteria

- [ ] Todos los archivos de docs en 01_Core/ dicen "v4.0 Consequences"
- [ ] Rutas en workflows actualizadas de old v1.x a v4.0
- [ ] CHANGELOG.md actualizado si hay cambios de estado
- [ ] System Guardian pasa sin errores
- [ ] Git status limpio post-cambios