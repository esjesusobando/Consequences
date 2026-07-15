---
name: skill-chain
description: "Ejecuta cadenas de skills automaticamente — flujos completos sin intervencion"
triggers:
  - "skill chain"
  - "chain"
  - "propuesta para"
  - "crear contenido sobre"
  - "auditar"
  - "crear prototipo"
  - "ejecutar cadena"
scope: user
globs: ["**/*.yaml", "**/*.py"]
---

# Skill Chain Engine

Ejecuta secuencias de skills de forma automatica. Dado un chain definition YAML,
el engine resuelve variables, ejecuta cada paso como subprocess, y persiste estado
para permitir resume despues de interrupciones.

## Uso rapido

```bash
python skill_chain.py run proposal_chain --client "Spotify" --context "retention"
python skill_chain.py run content_chain --topic "AI trends" --platform linkedin
python skill_chain.py list
python skill_chain.py validate proposal_chain
```

## Chain definitions

Ubicadas en: `00_System_Core/05_Skill_Chains/*.yaml`

Cada chain define:
- `name`: nombre descriptivo
- `description`: que hace
- `trigger`: frase que activa la chain
- `timeout_per_step`: timeout global por paso
- `steps`: lista de pasos con `name`, `command`, `required`, `timeout`

## Variables disponibles

| Variable | Descripcion |
|----------|-------------|
| `{chain_id}` | ID unico de esta ejecucion |
| `{prev_output}` | Output del paso anterior |
| `{client}` | Argumento --client |
| `{context}` | Argumento --context |
| `{topic}` | Argumento --topic |
| `{platform}` | Argumento --platform |
| `{idea}` | Argumento --idea |

## Edge cases

- Step falla + required=true → aborta la chain
- Step falla + required=false → skip con warning
- Step excede timeout → kill + abort/skip segun required
- Chain se corta → estado en `chain_state_{id}.json` → reanudable con `--resume`
