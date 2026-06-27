# Runbook: [Incident Type]

> **Severity:** [P1/P2/P3] | **Response Time:** [X minutes] | **Escalate To:** [Team]

## Definition of Done

- [ ] Incident resolved
- [ ] Root cause identified
- [ ] Post-mortem scheduled
- [ ] Team notified

## Detection

**Symptoms:**
- [Symptom 1]
- [Symptom 2]

**Alerts:**
- [Alert name/link]

## Immediate Actions

1. **Acknowledge** the alert
2. **Assess** impact (users affected, services down)
3. **Communicate** in #incidents channel

## Investigation

### Step 1: Check Recent Changes
```bash
git log --oneline -10
```

### Step 2: Check Logs
```bash
kubectl logs [pod-name] --tail=100
```

### Step 3: Check Metrics
[Link to dashboard]

## Resolution

### Option A: Rollback
```bash
git revert [commit-hash]
```

### Option B: Hotfix
[Steps]

### Option C: Scale
```bash
kubectl scale deployment [name] --replicas=[n]
```

## Escalation

If not resolved in [X] minutes, escalate to:
- [Team lead]
- [On-call engineer]


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
