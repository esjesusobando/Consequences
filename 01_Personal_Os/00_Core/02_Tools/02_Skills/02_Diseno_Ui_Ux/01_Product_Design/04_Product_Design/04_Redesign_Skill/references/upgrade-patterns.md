# Upgrade Patterns

## Typography Upgrade
```css
/* Before */
font-family: 'Inter', sans-serif;
font-size: 24px;

/* After */
font-family: 'Geist Sans', sans-serif;
font-size: 32px;
letter-spacing: -0.03em;
line-height: 1.1;
```

## Shadow Upgrade
```css
/* Before */
box-shadow: 0 4px 6px rgba(0,0,0,0.1);

/* After */
box-shadow: 0 1px 2px rgba(0,0,0,0.04);
```

## Color Upgrade
```css
/* Before */
background: #000000;
color: #ffffff;

/* After */
background: #faf9f7;
color: #1c1917;
```

## Spacing Upgrade
```css
/* Before */
gap: 8px;
padding: 16px;

/* After */
gap: 24px;
padding: 32px;
```

## Border Upgrade
```css
/* Before */
border: 1px solid #e5e7eb;

/* After */
border: 1px solid rgba(0,0,0,0.08);
```


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
