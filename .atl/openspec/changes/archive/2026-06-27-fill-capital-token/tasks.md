# Tasks: Fill Capital Token

## Phase 1: Real Content

- [x] **1.1 Fill organizational context**
  - Replace ALL `{{placeholder}}` values in `context/organizacion.md` with real data
  - Sections: Misión, Visión, Equipo, Stack Tecnológico, Clientes/Proyectos
  - Mark unknown values as `[TBD: description]`
  - Files: `10_Shared_Org/context/organizacion.md`
  - Verify: no `{{` remain in the file

- [x] **1.2 Document process: Project Kickoff SOP**
  - Create `processes/01-proyecto-kickoff.md` using `00-template.md`
  - Include: stakeholders, timeline definition, tool setup, communication channels
  - Files: `processes/01-proyecto-kickoff.md`
  - Verify: has YAML frontmatter + numbered steps + quality gates

- [x] **1.3 Document process: Weekly Client Reporting SOP**
  - Create `processes/02-reporte-semanal.md` using `00-template.md`
  - Include: data gathering, template, review cycle, delivery
  - Files: `processes/02-reporte-semanal.md`
  - Verify: has YAML frontmatter + numbered steps + quality gates

- [x] **1.4 Document decision: Knowledge Structure ADR**
  - Create `decisions/002-estructura-conocimiento.md`
  - Document: why 6 categories, why markdown+YAML, why templates
  - Files: `decisions/002-estructura-conocimiento.md`
  - Verify: follows 00-template.md format

- [x] **1.5 Create playbook: Content Production Workflow**
  - Create `playbooks/02-produccion-contenido.md`
  - Cover: ideation → drafting → review → publish → measure cycle
  - Same level of detail as onboarding playbook
  - Files: `playbooks/02-produccion-contenido.md`
  - Verify: has YAML frontmatter + steps + quality gates + metrics + error table

## Phase 2: Deploy Bridge & Connect Agents

- [x] **2.1 Verify bridge all modes**
  - Test `--index`, `--query`, `--sync`, and interactive mode
  - Fix any runtime errors
  - Files: `capital-token-bridge.py`
  - Verify: all 4 modes work without errors

- [x] **2.2 Create real Admin Agent config**
  - Create `admin-config.yaml` that loads Shared Org context + admin agent template
  - Reference skills, MCPs, and playbooks from the template
  - Place in appropriate agent directory or alongside template
  - Files: `10_Shared_Org/agents/admin-config.yaml`
  - Verify: config references existing files and skills

- [x] **2.3 Update dashboard with real metrics**
  - Fill in current real counts (playbooks, decisions, processes, agents, context files, bridge status)
  - Update estado column with real current state
  - Files: `metrics/capital-token-dashboard.md`
  - Verify: no placeholder values remain

## Phase 3: Docs & Quickstart

- [x] **3.1 Add CLI usage guide to README**
  - Add CLI cheatsheet section to Shared Org README
  - Cover: --index, --query, --serve, interactive mode
  - Files: `10_Shared_Org/README.md`
  - Verify: user can follow the guide without reading bridge source code

- [x] **3.2 Update completion record in proposal.md**
  - Fill in dates for Implemented, Verified
  - Files: `proposal.md`
