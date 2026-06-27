# Audit Checklist

## Typography
- [ ] Browser default fonts or Inter → Replace with Geist, Outfit, Satoshi
- [ ] Headlines lack presence → Increase size, tighten tracking
- [ ] Body text too wide → Limit to 65ch
- [ ] Only Regular/Bold weights → Add Medium, SemiBold
- [ ] Numbers in proportional → Use monospace or tabular-nums
- [ ] Missing letter-spacing → Negative tracking for headers
- [ ] All-caps subheaders → Try lowercase italics
- [ ] Orphaned words → Use text-wrap: balance

## Color
- [ ] Pure black (#000000) → Use #111111 or #2F3437
- [ ] Banned purple/blue AI aesthetic → Use neutral + singular accent
- [ ] Too many accent colors → Max 1 accent color
- [ ] High saturation → Keep saturation < 80%

## Spacing
- [ ] Inconsistent spacing → Use consistent gap units
- [ ] No breathing room → Add padding
- [ ] Crowded elements → Increase white space

## Shadows
- [ ] Heavy shadows (shadow-md/lg) → Use ultra-diffuse shadows
- [ ] Harsh colors → Use rgba(0,0,0,0.05) max

## Icons
- [ ] FontAwesome/Material → Replace with Phosphor/Radix

## Motion
- [ ] No transitions → Add smooth transitions
- [ ] Linear easing → Use cubic-bezier


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
