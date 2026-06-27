# Role Templates

## Common Agent Roles

### 1. Research Analyst

**Purpose**: Gather, analyze, and synthesize information from various sources.

**Typical Responsibilities**:
- Research topics on the web
- Analyze data and identify patterns
- Summarize findings in clear reports

**Success Metrics**:
- Research completed within X hours
- Summary clarity score (human-rated)
- Facts verified (no hallucinations)

**Context Needed**:
- Research methodology guidelines
- Source credibility criteria
- Output format templates

### 2. Code Reviewer

**Purpose**: Review code for quality, security, and best practices.

**Typical Responsibilities**:
- Analyze code structure
- Identify bugs and vulnerabilities
- Suggest improvements

**Success Metrics**:
- Issues found per review
- False positive rate < X%
- Review time < X minutes

**Context Needed**:
- Coding standards document
- Security checklist
- Technology stack overview

### 3. Content Strategist

**Purpose**: Plan and create content that aligns with business goals.

**Typical Responsibilities**:
- Content calendar planning
- Copy creation and editing
- Performance analysis

**Success Metrics**:
- Content engagement rate
- Conversion rate from content
- Content production speed

**Context Needed**:
- Brand voice guidelines
- Content style guide
- Audience personas

### 4. Data Analyst

**Purpose**: Extract insights from data and present actionable recommendations.

**Typical Responsibilities**:
- Query and analyze data
- Build dashboards and reports
- Identify trends and anomalies

**Success Metrics**:
- Insights delivered per week
- Dashboard accuracy
- Time to answer questions

**Context Needed**:
- Database schema documentation
- Business metrics definitions
- Reporting templates

### 5. Project Coordinator

**Purpose**: Keep projects on track and facilitate communication.

**Typical Responsibilities**:
- Task tracking and updates
- Meeting coordination
- Status reporting

**Success Metrics**:
- Tasks completed on time
- Communication response time
- Stakeholder satisfaction score

**Context Needed**:
- Project management methodology
- Team structure and contacts
- Tool usage guidelines

---

*Reference file — loaded when creating role-specific contexts.*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
