# Templates de Agentes por Rol

> Templates de agentes para roles organizacionales.
> Cada template hereda del shared context y agrega capacidades específicas del rol.

---

## Estructura

Cada template es un archivo YAML + markdown que define:

- **Contexto del rol**: qué hace, qué necesita saber
- **Skills que carga**: qué skills del OS usa
- **MCPs que necesita**: qué herramientas externas
- **Playbooks que ejecuta**: qué procesos repetitivos corre
- **Quality gates**: cómo se evalúa su trabajo

---

## Templates Disponibles

| #   | Rol           | Archivo               | Estado   |
| --- | ------------- | --------------------- | -------- |
| 1   | Admin Agent   | `01-admin-agent.md`   | 📝 Creado |
| 2   | Finance Agent | `02-finance-agent.md` | 📝 Creado |
| 3   | HR Agent      | `03-hr-agent.md`      | 📝 Creado |

---

## Cómo Usar

1. Copiar el template correspondiente a `01_Personal_Os/01_Core/02_Tools/01_Agents/`
2. Personalizar contexto, skills y MCPs según el equipo específico
3. Agregar playbooks relevantes de `10_Shared_Org/playbooks/`
4. Configurar en el workspace compartido del equipo