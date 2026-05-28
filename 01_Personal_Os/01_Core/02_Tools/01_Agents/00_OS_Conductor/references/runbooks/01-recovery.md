# 🛠️ Runbook: Recuperación ante Fallos de Skills

> **Propósito:** Procedimientos de recuperación cuando una skill orquestada por el Conductor falla.
> **Contexto:** El Conductor delega a una skill, la skill falla, y el flujo compuesto se detiene.

---

## 🔍 Diagnóstico Rápido

| Síntoma | Causa probable | Acción inmediata |
|---------|---------------|------------------|
| Skill no responde | SKILL.md mal cargado | Re-cargar skill via `skill()` |
| Output vacío o erróneo | Contexto insuficiente | Re-ejecutar con criterios de contrato + intent explícito |
| Error en tiempo de ejecución | Dependencia faltante | Verificar prerequisitos de la skill |
| Tiempo de espera agotado | Skill demasiado compleja | Dividir request en sub-pasos |
| Skill no encontrada | Path incorrecto en registry | Verificar `registry.md` con `validate-registry.py` |

---

## 📋 Procedimiento de Recuperación

### Fase 1: Identificar (30s)
```
1. ¿Qué skill falló? → nombre del registry
2. ¿En qué paso del flujo? → paso del Sprint Contract
3. ¿Qué devolvió? → capturar error/output
4. ¿Es la primera vez que falla esta skill en esta sesión?
```

### Fase 2: Re-ejecutar (máx 2 intentos)
```
Intento 1: Re-cargar skill + re-inyectar contexto + ejecutar de nuevo
   → ¿Funcionó? → avanzar al siguiente paso

Intento 2: Agregar contexto adicional + instrucciones explícitas
   → ¿Funcionó? → avanzar
   → ¿No? → Escalar (Fase 3)
```

### Fase 3: Escalar
```
1. Informar al usuario:
   "No pude completar [paso] después de 2 intentos.
    El error fue: [output del skill].
    ¿Preferís otro enfoque o querés debuggear manual?"
2. Ofrecer alternativas:
   - Skill alternativa del mismo dominio
   - Descomponer manualmente el paso
   - Debuggear con el usuario
```

---

## ⚡ Casos Conocidos

### Caso: Registry desincronizado
- **Síntoma:** Skill no encontrada en delegación
- **Recuperación:** 
  1. Correr `python scripts/validate-registry.py` para diagnosticar
  2. Actualizar `registry.md` si la skill fue renombrada
  3. O crear la skill faltante

### Caso: Sprint Contract violado
- **Síntoma:** Skill devuelve output que no cumple criterios
- **Recuperación:**
  1. Identificar qué criterio del contrato no se cumple
  2. Re-ejecutar con instrucción específica: "El criterio [X] requiere [Y] — ajustar output"
  3. Si persiste, ajustar contrato con el usuario

### Caso: Loop de auto-referencia
- **Síntoma:** El modelo intenta invocar al Conductor dentro de un flujo
- **Recuperación:**
  1. Detener flujo inmediatamente
  2. Verificar que el skill destino NO es `00_OS_Conductor`
  3. Re-ejecutar con ruteo explícito

---

*OS Conductor v2.0 — PersonalOS v4.8 — 2026-05-28*
