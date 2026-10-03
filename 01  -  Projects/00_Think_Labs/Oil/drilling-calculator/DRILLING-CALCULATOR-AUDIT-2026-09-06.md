# AUDITORÍA COMPLETA: Drilling Calculator

## Fecha: 2026-09-06

## Alcance: Cadena de datos completa (Store → Orchestrator → Engines → Alerts → Jetro AI)

- --

## RESUMEN EJECUTIVO

| Severidad             | Cantidad  | Estado                        |
|----------------------|----------|------------------------------|
| 🔴 BUGS CRÍTICOS       | 4         | Rompen funcionalidad          |
| 🟡 DESCONEXIONES       | 8         | Módulos no hablan entre sí    |
| 🟢 CÁLCULOS INCOMPLETOS| 3         | Valores placeholder o erróneos|
| **TOTAL**             | **15**    |                               |

- --

## CADENA DE DATOS ACTUAL

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌──────────────┐
│  User Input  │ ──▶ │  Zustand Store    │ ──▶ │ Orchestrator │ ──▶ │ Alert Engine  │
│  (Forms)     │     │  (drilling-store) │     │ (12 engines) │     │ (166 lines)   │
└─────────────┘     └──────────────────┘     └─────────────┘     └──────────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────────┐
                                                                │   UI Panel    │
                                                                │  + Jetro AI   │
                                                                └──────────────┘
```

### Flujo verificado:

1. `drilling-store.ts` → `calculateAll()` llama `orchestrateCalculations()`
2. `orchestrator.ts` → ejecuta 12 motores de cálculo en orden
3. `orchestrator.ts` → `calculateRiskAndAdvice()` genera score + consejos
4. `alert-engine.ts` → `generateAlerts(results)` genera alertas prioritizadas
5. `JetroChat.tsx` → lee store + alerts + results → envía contexto a Gemini

- --

## 🔴 BUGS CRÍTICOS

### BUG #1: Surge & Swab — Firma de función rota

* *Archivo:** `src/engine/orchestrator.ts` líneas 88-93
* *Severidad:** 🔴 CRÍTICO — Cálculos NaN, alertas nunca disparan

* *Código problemático:**
```typescript
// orchestrator.ts línea 88-93
const surgeSwab = calculateSurgeSwab(
  wellData,        // ← Objeto WellData
  mudData,         // ← Objeto MudData
  rheology,        // ← Objeto RheologyResult
  wellControlData.pipeSpeed ?? 90,  // ← Número
);
```

* *Pero la función espera un objeto único:**
```typescript
// surge-swab.ts línea 27
export function calculateSurgeSwab(params: SurgeSwabParams): SurgeSwabResult {
  // params.mudWeight, params.plasticViscosity, etc.
}
```

* *Resultado:** JavaScript usa `wellData` como `params`. `wellData.mudWeight` = undefined. Todo el cálculo produce NaN.

* *Fix:** Llamar con objeto correcto:
```typescript
const surgeSwab = calculateSurgeSwab({
  mudWeight: mudData.mudWeight,
  plasticViscosity: mudData.plasticViscosity,
  yieldPoint: mudData.yieldPoint,
  holeDiameter: wellData.holeSize,
  pipeDiameter: wellData.drillPipeOD,
  pipeVelocity: wellControlData.pipeSpeed ?? 90,
  pipeLength: wellData.totalDepth,
});
```

- --

### BUG #2: SurgeSwabResult — Tipo vs Implementación

* *Archivos:** `src/store/drilling-types.ts` líneas 269-278 vs `src/engine/surge-swab.ts` líneas 61-66
* *Severidad:** 🔴 CRÍTICO — Tipo no coincide con implementación

* *Tipo esperado (drilling-types.ts):**
```typescript
interface SurgeSwabResult {
  surgePressure: number;
  swabPressure: number;
  ecdSurge: number;              // ← Campo A
  ecdSwab: number;               // ← Campo B
  effectiveAnnularVelocity: number; // ← Campo C
  flowRegimeSurge: "Laminar" | "Turbulent" | "Transition"; // ← Campo D
  modelUsed: string;             // ← Campo E
  pipeSpeed: number;             // ← Campo F
}
```

* *Engine retorna (surge-swab.ts):**
```typescript
return {
  surgePressure: Number(totalChange.toFixed(2)),
  swabPressure: Number(totalChange.toFixed(2)),
  equivalentMudWeightSurge: Number(...),  // ← Nombre DIFERENTE
  equivalentMudWeightSwab: Number(...),   // ← Nombre DIFERENTE
  // FALTAN: ecdSurge, ecdSwab, effectiveAnnularVelocity, flowRegimeSurge, modelUsed, pipeSpeed
};
```

* *Resultado:** `surgeSwab.ecdSurge` = undefined. `surgeSwab.flowRegimeSurge` = undefined.

* *Fix:** Renombrar campos en el engine O actualizar el tipo. Recomendado: actualizar el tipo para reflejar lo que el engine realmente calcula.

- --

### BUG #3: Alert Engine lee campos inexistentes

* *Archivo:** `src/guards/alert-engine.ts` líneas 107-138
* *Severidad:** 🔴 CRÍTICO — Alertas de Surge/Swab NUNCA se disparan

* *Código problemático:**
```typescript
// Línea 109 — lee ecdSurge que NO existe
if (surgeSwab.ecdSurge > pressures.maxMudWeight) {  // ← undefined > number = false

// Línea 128 — lee ecdSwab que NO existe  
if (surgeSwab.ecdSwab < pressures.minMudWeight) {   // ← undefined < number = false

// Línea 113 — lee flowRegimeSurge que NO existe
detail: `...Régimen: ${surgeSwab.flowRegimeSurge}.`,  // ← "undefined"
```

* *Resultado:** Las 4 alertas de Surge/Swab NUNCA se generan. El usuario no recibe advertencias de maniobras peligrosas.

* *Fix:** Después de arreglar BUG #2, actualizar las referencias en alert-engine.ts para usar los campos correctos.

- --

### BUG #4: well-control.ts mata todos los cálculos

* *Archivo:** `src/engine/well-control.ts` línea 42
* *Severidad:** 🔴 CRÍTICO — Un error de validación destruye TODOS los resultados

* *Código problemático:**
```typescript
if (!well || !wcData || mudWeight <= 0) {
  throw new Error("Datos de pozo/control de pozos incompletos o inválidos");  // ← MATADOR
}
```

* *Cadena de destrucción:**
```
well-control.ts throw → orchestrator.ts catch → retorna TODOS los valores en 0
→ alert-engine.ts recibe zeros → no genera alertas → Jetro AI recibe datos vacíos
```

* *Resultado:** Si `wellControlData` tiene un campo faltante, TODO el sistema de cálculo se desactiva. El usuario ve ceros en todos los módulos sin explicación.

* *Fix:** Reemplazar throw por fallback seguro:
```typescript
if (!well || !wcData || mudWeight <= 0) {
  console.warn("⚠️ Well Control: datos incompletos, usando defaults");
  return { kmw: 0, icp: 0, fcp: 0, maasp: 0, ... };
}
```

- --

## 🟡 DESCONEXIONES

### DESCONECT #5: Anti-collision no está conectado a nada

* *Módulos afectados:** orchestrator.ts, alert-engine.ts, JetroChat.tsx
* *Estado:** Motor existe (`anti-collision.ts`) pero NUNCA es importado ni llamado

* *Cadena rota:**
```
orchestrator.ts ← NO importa anti-collision
calculateAll()  ← NO llama anti-collision
alert-engine.ts ← NO genera alertas de colisión
JetroChat.tsx   ← NO envía datos de colisión a Gemini
UI              ← NO existe componente Anticolision.tsx
```

* *Impacto:** El motor de anti-collision tiene 6 bugs conocidos y es código muerto.

- --

### DESCONECT #6: Sin alertas de Well Control

* *Módulo:** well-control.ts calcula KMW, ICP, FCP, MAASP pero alert-engine.ts NO los revisa

* *Alertas faltantes:**
- SIDPP > 0 → Kick detectado
- KMW > maxMudWeight → Densidad de kill excede ventana
- MAASP < 0 → Presión de fractura superada
- ICP > presión de sistema → Presión excesiva en surface

- --

### DESCONECT #7: Sin alertas de Reología

* *Módulo:** rheology.ts calcula PV, YP, geles, ratio PV/YP pero alert-engine.ts NO los revisa

* *Alertas faltantes:**
- PV/YP ratio < 1.5 o > 3.0 → Reología desbalanceada
- Gel progression negativa → Lodo inestable
- Mu_eff excesivo → Fricción alta

- --

### DESCONECT #8: Sin alertas de Bomba

* *Módulo:** pump.ts calcula eficiencia, GPM, HHP pero alert-engine.ts NO los revisa

* *Alertas faltantes:**
- Eficiencia < 90% → Bomba desgastada
- SPM excesivo → Riesgo de cavitación
- HHP insuficiente → Potencia baja para limpieza

- --

### DESCONECT #9: Sin alertas de Circulación

* *Módulo:** circulation.ts calcula lag time, bottoms-up pero alert-engine.ts NO los revisa

* *Alertas faltantes:**
- Bottoms-up time excesivo → Limpieza lenta
- Lag time inconsistent → Posible obstrucción

- --

### DESCONECT #10: calculateRiskAndAdvice lee campos inexistentes

* *Archivo:** `src/engine/orchestrator.ts` líneas 353, 367

* *Código problemático:**
```typescript
// Línea 353 — stuckPipe.totalRiskScore NO EXISTE en StuckPipeResult
const stuckRisk = results.stuckPipe?.totalRiskScore || 0;  // ← siempre 0

// Línea 367 — surgeSwab.ecdSurge NO EXISTE (BUG #2)
const surgeEcd = results.surgeSwab?.ecdSurge || 0;  // ← siempre 0
```

* *Resultado:** El Risk Score NUNCA incluye riesgo de stuck pipe ni surge. El score está subestimado.

- --

### DESCONECT #11: Jetro AI recibe datos rotos

* *Archivo:** `src/components/sections/JetroChat.tsx` líneas 340-348

* *Campos que Jetro envía a Gemini pero son undefined:**
```typescript
// Línea 342 — siempre "—"
ECD Surge/Swab: ${results?.surgeSwab?.ecdSurge?.toFixed(2) ?? "—"}
// Línea 343 — siempre "—"
Régimen Flow (Surge): ${results?.surgeSwab?.flowRegimeSurge ?? "—"}
```

* *Resultado:** Jetro AI no tiene datos reales de Surge/Swab para analizar. Gemini recibe información incompleta.

- --

### DESCONECT #12: Sin alertas de Volumetría

* *Módulo:** volumetrics.ts calcula capacidades, volúmenes pero alert-engine.ts NO los revisa

* *Alertas faltantes:**
- Capacidad anular vs interna desbalanceada → Riesgo de U-tubo
- Volúmenes inconsistente con geometría → Error de datos de entrada

- --

## 🟢 CÁLCULOS INCOMPLETOS

### INCOMPLETO #13: Stuck Pipe — Free Point nunca se calcula

* *Archivo:** `src/engine/stuck-pipe.ts` líneas 46-47

```typescript
freePointDepth: 0,      // ← PLACEHOLDER, nunca se calcula
feetOfFreePipe: 0,      // ← PLACEHOLDER, nunca se calcula
```

`freePointConstant` SÍ se calcula (línea 39) pero nunca se usa para derivar `freePointDepth`.

- --

### INCOMPLETO #14: Risk Score subestimado

* *Archivo:** `src/engine/orchestrator.ts` función `calculateRiskAndAdvice()`

* *Factores que SÍ cuenta:** DLS, Tension ratio, Neutral point, ECD margin, Stuck pipe (parcial)
* *Factores que NO cuenta:** Surge/Swab, Well Control, Rheology, Hole Cleaning, Anti-collision

El score máximo possible es ~100 pero en la práctica nunca pasa de 60-70 porque faltan factores.

- --

### INCOMPLETO #15: Orchestrator fallback retorna tipo inconsistente

* *Archivo:** `src/engine/orchestrator.ts` líneas 251-260

```typescript
// Fallback retorna:
surgeSwab: {
  surgePressure: 0,
  swabPressure: 0,
  ecdSurge: 0,        // ← Tipo correcto
  ecdSwab: 0,         // ← Tipo correcto
  ...
}
```

Pero el engine real retorna `equivalentMudWeightSurge/Swab`. El fallback y el engine no producen la misma estructura.

- --

## MAPA DE IMPACTO

```
BUG #1 (Surge Swab firma) ──┐
BUG #2 (SurgeSwab tipo)  ──┼──▶ BUG #3 (Alert engine) ──▶ DESCONECT #11 (Jetro AI)
                            │
BUG #4 (well-control throw) ──▶ DESCONECT #10 (Risk score) ──▶ DESCONECT #14 (Score bajo)
                            │
DESCONECT #5 (Anti-collision) ──▶ Código muerto, 6 bugs conocidos
                            │
DESCONECT #6-9, #12 (Alertas faltantes) ──▶ Usuario sin advertencias
```

- --

## PRIORIDAD DE CORRECCIÓN

| #  | Bug/Desconexión                  | Esfuerzo  | Impacto  | Prioridad  |

|---|---------------------------------|----------|---------|-----------|
| 1  | BUG #4: well-control throw       | Bajo      | Crítico  | 🔴 P0       |
| 2  | BUG #1: Surge Swab firma         | Bajo      | Crítico  | 🔴 P0       |
| 3  | BUG #2: SurgeSwab tipo           | Medio     | Crítico  | 🔴 P0       |
| 4  | BUG #3: Alert engine refs        | Bajo      | Crítico  | 🔴 P0       |
| 5  | DESCONECT #10: Risk score        | Bajo      | Alto     | 🟡 P1       |
| 6  | DESCONECT #6: Well Control alerts| Medio     | Alto     | 🟡 P1       |
| 7  | DESCONECT #7: Rheology alerts    | Medio     | Medio    | 🟡 P1       |
| 8  | DESCONECT #5: Anti-collision     | Alto      | Medio    | 🟡 P1       |
| 9  | DESCONECT #8-9, #12: más alerts  | Medio     | Medio    | 🟢 P2       |
| 10 | INCOMPLETO #13: Free point       | Medio     | Bajo     | 🟢 P2       |
| 11 | DESCONECT #11: Jetro data        | Bajo      | Medio    | 🟢 P2       |

- --

## ESTADO DE MÓTOSRES (15 motores)

| Motor                | Estado           | Conectado     | Alertas                |
|---------------------|-----------------|--------------|-----------------------|
| volumetrics.ts       | ✅ Funcional      | ✅ Almacén     | ❌ Sin alertas          |
| rheology.ts          | ✅ Funcional      | ✅ Almacén     | ❌ Sin alertas          |
| pump.ts              | ✅ Funcional      | ✅ Almacén     | ❌ Sin alertas          |
| circulation.ts       | ✅ Funcional      | ✅ Almacén     | ❌ Sin alertas          |
| pressures.ts         | ✅ Funcional      | ✅ Almacén     | ✅ 2 alertas            |
| hydraulics.ts        | ✅ Funcional      | ✅ Almacén     | ✅ 1 alerta             |
| cuttings-transport.ts| ✅ Funcional      | ✅ Almacén     | ✅ 2 alertas            |
| directional.ts       | ✅ Funcional      | ✅ Almacén     | ✅ 1 alerta (indirecta) |
| torque-drag.ts       | ✅ Funcional      | ✅ Almacén     | ✅ 1 alerta             |
| well-control.ts      | ⚠️ Throw en error| ✅ Almacén     | ❌ Sin alertas          |
| surge-swab.ts        | 🔴 Firma rota     | 🔴 NaN         | ❌ Alertas muertas      |
| stuck-pipe.ts        | ⚠️ Placeholders  | ✅ Almacén     | ✅ 2 alertas (parciales)|
| bit-intelligence.ts  | ✅ Funcional      | ❌ No conectado| ❌ Sin alertas          |
| anti-collision.ts    | 🔴 Código muerto  | ❌ No conectado| ❌ Sin alertas          |
| twin-engine.ts       | ✅ Funcional      | ✅ Simulador   | ❌ Sin alertas          |

- --

* Documento generado automáticamente por auditoría del código fuente.*
* Próximo paso: Corregir los 4 bugs críticos (P0) y las desconexiones P1.*
