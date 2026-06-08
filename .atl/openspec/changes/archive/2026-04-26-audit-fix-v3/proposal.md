# Proposal: Audit & Fix — Think Different PersonalOS v3.0 Consequences

## Intent

Validar, corregir y mejorar el estado del proyecto PersonalOS v3.0 Consequences. El objetivo es sanear referencias rotas, standardize paths, y atualizar el registry de skills sin eliminar información histórica. El proyecto está en verde pero tiene deuda técnica acumulada (paths hardcoded, config duplicated, version drift).

## Scope

### In Scope
- **Fix critical hardcoded Windows paths** en `.mcp.json` (4 instances)
- **Deduplicate** `config.yaml` (secciones `rules:` y `testing:` duplicadas)
- **Actualizar skill-registry.md** de v2.0 → v3.0 Consequences
- **Enriquecer** `opencode.jsonc` con skill registry básico
- **Documentar** issues conocidos en `openspec/config.yaml`
- **Verificar** estructura de carpetas vs referencias en docs
- **Validar** HUBs scripts y su estado

### Out of Scope
- No modificar archivos de Archive (legado preservado)
- No crear nuevos specs (solo fix del infrastructure)
- No eliminar AGENTS.md legacy (referencias obsoletas se documentan)

## Capabilities

### Modified Capabilities
- `personal-os-config`: Actualizar configuración SDD para reflejar v3.0
- `mcp-registry`: Sanear paths hardcoded en .mcp.json
- `skill-registry`: Actualizar version y count de skills

### New Capabilities
- `project-audit-report`: Generar reporte de salud del proyecto

## Approach

1. **Fix .mcp.json**: Reemplazar `C:\Users\sebas\...` con `${HOME}` o paths relativos donde sea posible. Para paths críticos que deben ser absolutos (Obsidian vault), agregar comentarios de configuración.
2. **Fix config.yaml**: Remover duplicados de `rules:` y `testing:`.
3. **Update skill-registry.md**: Cambiar versión a v3.0 Consequences, actualizar fecha y count de skills (297 skills, 18 HUBs, 52 agents).
4. **Enrich opencode.jsonc**: Agregar skill registry path configuration.
5. **Add audit notes**: Agregar sección de "Known Issues" en config.yaml.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `.mcp.json` | Modified | Fix 4 hardcoded Windows paths |
| `.atl/openspec/config.yaml` | Modified | Remove duplicates, add known issues |
| `.atl/skill-registry.md` | Modified | Update version to v3.0 |
| `.opencode/opencode.jsonc` | Modified | Add skill registry config |
| `AGENTS.md` (root) | Verified | GGA entry point correcto |
| `00_Winter_is_Coming/AGENTS.md` | Verified | Core constitution intacta |
| `README.md` | Verified | Estructura vs realidad coincide |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Path fixes break MCP connections | Low | Hacer backup de .mcp.json antes, testing manual post-fix |
| Engram MCP not running | Medium | Documentar en config que está en failover mode |

## Rollback Plan

- **Git revert** en cada archivo modificado
- `.mcp.json`: `git checkout HEAD -- .mcp.json`
- Configs: `git checkout HEAD -- .atl/openspec/config.yaml .atl/skill-registry.md`

## Dependencies

- Git para version control
- Ningún external dependency

## Success Criteria

- [ ] `.mcp.json` sin paths hardcoded de usuario
- [ ] `config.yaml` sin secciones duplicadas
- [ ] `skill-registry.md` refleja v3.0 Consequences
- [ ] `opencode.jsonc` tiene skill registry path
- [ ] Git status muestra solo los archivos modificados esperados
- [ ] MCP servers pueden reconectarse post-fix
