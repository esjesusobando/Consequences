# Backlog — Think Different PersonalOS v4.9.1

*Última actualización: 2026-06-25*

---

## P0 — CRÍTICO

*Sin ítems críticos activos*

---

## P1 — ALTA PRIORIDAD

- [ ] **Elite Portfolio** — Rediseñar con Exaggerated Minimalism (sección por sección)
- [ ] **OIM Website** — Verificación visual en browser (servidor parado)

---

## P2 — MEDIA PRIORIDAD

- [ ] **Marketing Agency Fase 1.4** — Validar agentes: ejecutar flujo Estratega→Creador con contenido real (1 post LinkedIn, 1 newsletter)
- [ ] **Marketing Agency Fase 2.1** — Quality Gates por Agente: checklist de revisión para cada deliverable
- [ ] **Marketing Agency Fase 2.2** — SLA Framework: tiempos de entrega por tipo de contenido + brief mínimo
- [ ] **Marketing Agency Fase 2.3** — MCPs Setup: investigar y configurar Make, YouTube Data API, LinkedIn API
- [ ] **Marketing Agency Fase 2.4** — Dashboard de Métricas: template HTML para reportes de rendimiento
- [ ] **Marketing Agency Fase 2.5** — Automated Feedback Loop: Analista→Estratega sin intervención humana
- [ ] Pre-commit hook para detectar API keys en archivos staged
- [ ] Documentar proceso de onboarding para nueva máquina
- [ ] **Corregir System Mapper Hub**: Agent Catalog cuenta 58 vs 48 real. Mapper cuenta mal (incluye READMEs o subdirectorios)
- [ ] **GGA Pre-commit hook**: Instalar `gga install` en repo (listo en `.agent/05_GGA/`)
- [ ] **Revisar Metodología Hillary**: Workflow `04_Hillary/`, integración con Life OS
- [ ] **Revisar Metodología Learning Always**: Workflow `00_Learning_Always/`, verificar operativos
- [ ] **Revisar Supercampeones Protocol**: Agent Teams en `09_Agent_Teams_Protocol.mdc`, integración SDD
- [ ] **Revisar Octopus Framework**: Skills en `06_Tools/08_Octopus/`, estado y utilidad
- [ ] **Revisar Los 4 Fantásticos**: Skills en `00_Personal_Os/03_Fantasticos/`, contexto y propósito

---

## P3 — BACKLOG FRÍO

- [ ] **Marketing Agency Fase 3** — Multi-cliente, reporting, lead gen, orquestador (tareas 3.1-3.8)
- [ ] **Marketing Agency Fase 4** — SOTA: compound learning, design system v2, A/B testing, case studies (tareas 4.1-4.7)
- [ ] Automatizar generación de `04_Operations/07_Reports/` con `01_Auditor_Hub.py`
- [ ] **Revisar y ejecutar**: Workflows Marvel (01_Iron_Man_Gen, 04_Vision_Review, 05_Thor_Work, 06_Hulk_Compound) — verificar que estén actualizados y operativos
- [ ] **Revisar y ejecutar**: Ritual de Cierre (`05_Ritual_Cierre_Protocol.md` + `04_Ritual_Hub.py`) — verificar pasos automatizados
- [ ] **Evaluar Avengers Plan**: Definir si ejecutar, actualizar o archivar

---

## ✅ Completados (2026-06-25)

- [x] **Marketing Agents SOTA Upgrade**: SDD pipeline completo — 3 agentes (15, 16, 17) + Dream Team 06 Orchestrator
- [x] **CLAUDE.marketing.md**: Template de contexto para sesiones de marketing
- [x] **linkedin-content-flow skill**: SKILL.md 4-stage pipeline
- [x] **MARKETING_PIPELINE.md**: Comprehensive workflow guide
- [x] **READMEs actualizados**: 01_Agents/ + Dream Team (5→6 jugadores)
- [x] **Judgment Day v4**: 1 CRITICAL fix (`对` → `comparar`), 1 WARNING fix (skill path), re-judge aprobado
- [x] **git rebase**: API key commit d438b6cac dropped del historial, push exitoso
- [x] **Graphify_Out/ movido**: Root → 02_Playground/Graphify_Out/. 7 archivos con referencias actualizadas
- [x] **Settings Drawer SDD archivado**: `04_Docs/SDD/settings-drawer-improvements/` → `05_Legacy_SDDAudits/`
- [x] **Agent Sync Hub restored**: 9 files restaurados via git restore
- [x] **Learning Always**: RE + Learning del video vINrPqUxnho (7 setup pieces)

## ✅ Completados (2026-05-29)

- [x] **Revisar Metodología Learning Always**: Workflow actualizado a v1.1 — paths corregidos, modo rápido como default, `_transcripts/` para VTT, Engram save obligatorio. Sync a .agent mirror.
- [x] **Corregir System Mapper Hub**: Agent Catalog ahora excluye README.md, LEEME.md, SKILL.md, registry.md y dirs `references/`. Count bajó de 73 a 55 agentes reales.
- [x] **GGA Pre-commit hook**: Ya instalado (secret scanner + gga run en `.git/hooks/pre-commit`). Verificado operativo.
- [x] **Revisar Metodología Hillary**: Duplicado `04_Hillary.md` archivado. Paths corregidos en workflow (`07_Personal_Os` → `00_Personal_Os`). Workflow bump v1.1.0. Sync a .agent.
- [x] **Revisar Supercampeones Protocol**: `09_Agent_Teams_Protocol.mdc` actualizado con nota de compatibilidad OpenCode (task_id vs fork subagent).
- [x] **Mover VTT legacy**: `Creé un equipo de Marketing...vtt` y `Por Qué La Suerte...vtt` movidos de `03_Resultado/05_JAO/` a `01_Research_Os/_transcripts/`.

---

*Sistema en estado PURE GREEN — 2026-06-01*
