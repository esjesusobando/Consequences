# SDD: Reorganización Skills por Áreas Funcionales

## Meta
- **Proyecto**: Personal OS - Reorganización de Skills
- **Estado**: PLAN (pendiente ejecución)
- **Fecha**: 2026-04-21

---

## Análisis

### What
- Consolidar 29 carpetas dispersas de `01_Personal_Os/01_Core/02_Tools/02_Skills/` en 8 áreas funcionales
- Crear script mapeador de referencias antes de mover
- Completar homologación de agents entre `.agent/` y `01_Core/04_Agents/`

### Why
- Evitar colapsos cuando hay muchas skills
- Facilitar discovery de skills correctas para cada tarea
- Crear meta-versos de escenarios resolubles automáticamente

### Where
- **Origen**: `01_Personal_Os/01_Core/02_Tools/02_Skills/` (29 carpetas actuales)
- **Destino**: 8 nuevas áreas funcionales
- **Docs**: Este plan + Engram

---

## Scenarios

| ID               | Escenario               | Input                        | Workflow                       | Output                             |
|------------------|-------------------------|------------------------------|--------------------------------|------------------------------------|
| S1               | Homologar               | Agents en .agent             | Copiar a Core                  | 17 agents en 04_Agents             |
| S2               | Mapear                  | Todas las refs               | Script grep                    | CSV con refs                       |
| S3               | Mover                   | Por área                     | Mover + actualizar             | Estructura nueva                   |
| S4               | Validar                 | Post-move                    | QMD Auditor                    | 0 links rotos                      |

---

## Estructura Final (8 Áreas)

| Área               | Nombre                          | Skills Integradas                                |
|--------------------|---------------------------------|--------------------------------------------------|
| 01                 | CREACION_Contenidos             | Marketing, YouTube, Carousel                     |
| 02                 | DISEÑO_UI_UX                    | Taste, Minimalist, UI/UX                         |
| 03                 | VIDEO_MEDIA                     | James Cameron, Video Intel                       |
| 04                 | AUTOMATIZACION                  | N8N, Firecrawl, GWS                              |
| 05                 | WORKFLOWS                       | PM, Brainstorming, Planning                      |
| 06                 | TOOLS                           | Skill Creator, Evaluators, Templates             |
| 07                 | PERSONAL_OS                     | Life OS, Fantasticos, QMD                        |
| 08                 | INVICTUS_WEB                    | GWS, Playwright, Excalidraw                      |
| 09                 | LEGACY                          | Backup                                           |

---

## Tasks (16 Total) - EJECUCIÓN POR FASES

### FASE 1: Preparación (T1-T5)
- [x] T1: Completar homologación 18_Hillary
- [x] T2: Homologar LEEME restantes de .agent
- [x] T3: Crear script mapeador de refs
- [x] T4: Escanear 50+ referencias (75 encontradas)
- [x] T5: Identificar edge cases críticos

### FASE 2: Índice Navegable (T6-T7)
- [x] T6: Crear índice por áreas funcionales
- [x] T7: Crear mapa de migración (59 carpetas)

### FASE 3: Reorganización por tramadas
- [ ] TRAMO 1: Área 01 - Contenidos (15 carpetas)
- [ ] TRAMO 2: Área 02 - Diseño UI/UX (6 carpetas)
- [ ] TRAMO 3: Área 03 - Video (2 carpetas)
- [ ] TRAMO 4: Área 04 - Automatización (10 carpetas)
- [ ] TRAMO 5: Área 05 - Workflows (6 carpetas)
- [ ] TRAMO 6: Área 06 - Tools (8 carpetas)
- [ ] TRAMO 7: Área 07 - Personal OS (7 carpetas)
- [ ] TRAMO 8: Área 08 - Invictus Web (3 carpetas)
- [ ] TRAMO 9: Área 09 - Legacy (2 carpetas)

### FASE 3: Reorganización (T8-T15)
- [ ] T8: Mover Área 01 (Contenido)
- [ ] T9: Mover Área 02 (Diseño)
- [ ] T10: Mover Área 03 (Video)
- [ ] T11: Mover Área 04 (Automatización)
- [ ] T12: Mover Área 05 (Workflows)
- [ ] T13: Mover Área 06 (Tools)
- [ ] T14: Mover Área 07 (PersonalOS)
- [ ] T15: Mover Áreas 08-09 (Invictus + Legacy)

### FASE 4: Validación (T16)
- [ ] T16: Validar con Auditor

---

## Gotchas

1. Rutas relativas en sub-skills quebrarán si no se actualizan
2. `-frontmatter` con `name:` son seguros
3. `CLAUDE.md` y `AGENTS.md` tienen paths hardcodeados
4. `.mcp.json` tiene refs a skills (NO TOCAR)

---

## Dependencies

- **Requiere**: Script Mapeador antes de ejecutar T7-T15
- **Bloqueado por**: Homologación completa (T1-T2)

---

## Notes

- Plan mixto: BASE del análisis + COMPLEMENTOS del usuario
- Idioma: Español rioplatense
- Enfoque: 4 FANTÁSTICOS (Swarm + Auditor + Engram + Docs)
