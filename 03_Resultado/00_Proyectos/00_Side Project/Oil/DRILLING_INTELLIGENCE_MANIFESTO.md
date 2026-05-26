# 🔱 Manifiesto de Inteligencia de Perforación (Jetro AI Context)

## Overview

Este documento consolida el ADN técnico del **Drilling Calculator - Protocolo Revolución**. Jetro AI debe utilizar este marco de referencia para todas las operaciones de razonamiento y asistencia.

## 🛠️ Modelos de Reología (API RP 13B-1)

El motor implementa una arquitectura de Triple Modelo para máxima precisión:

### 1. Bingham Plastic (BP)

- **PV (Plastic Viscosity):** $\theta_{600} - \theta_{300}$ [cP]. Representa la resistencia mecánica.
- **YP (Yield Point):** $\theta_{300} - PV$ [lb/100ft²]. Representa fuerzas electroestáticas.

### 2. Power Law (PL)

- **n (Flow Behavior Index):** $3.322 \cdot \log_{10}(\theta_{600} / \theta_{300})$. Define la pseudoplasticidad.
- **K (Consistency Index):** $\theta_{300} / 511^n$. Define la viscosidad base.

### 3. Herschel-Bulkley (YPL)

- **τ₀ (Yield Stress):** $2\theta_3 - \theta_6$. El modelo más preciso para lodos modernos.
- **Lógica de Guardias:** Todo cálculo de $\tau_0$ incluye `Math.max(..., 0)` para prevenir valores físicos imposibles.

---

## 🌊 Hidráulica e Interconexión

### ECD (Equivalent Circulating Density)

- **Fórmula:** $ECD = MW + \frac{P_{annular}}{0.052 \cdot TVD}$
- **Interconexión:** El ECD es el puente entre el módulo de Hidráulica y el motor de Alertas. Si $ECD > Grad. Fractura$, el sistema dispara alertas críticas de nivel 1.

### Reynolds (Audit de Régimen)

- **Laminar:** $Re < 2100$
- **Transición:** $2100 - 4000$ (Zona de inestabilidad)
- **Turbulento:** $Re > 4000$

---

## ⏱️ Circulación Dinámica (Eliminación de Hardcoding)

- **Factor de Conversión:** Todos los cálculos usan $Q$ en BPM ($GPM / 42$) para alinearse con los estándares de Halliburton.
- **Tiempos Real:** Se calculan dividiendo volúmenes anulares/internos reales entre el gasto dinámico. **No existen valores estáticos o hardcodeados (como el antiguo "8S")**.

---

## 🚨 Capa de Asesoría Operacional (Alert Engine)

El sistema no solo reporta errores, sino que actúa como un ingeniero senior:

- **Margen de Kick/Loss:** Alertas proactivas si el margen contra poro es $< 0.3$ ppg o contra fractura es $< 0.5$ ppg.
- **HHP/in²:** Objetivo de $2.0 - 7.0$ para limpieza de barrena.
- **Hole Cleaning:** Mínimo de $120$ ft/min de AV para evitar colchones de recortes.

---

## 🛡️ Armor Layer & PURE GREEN

El sistema está blindado por el script `14_logic_validator.py`. Ninguna modificación puede corromper las fórmulas maestras anteriores sin activar el bloqueo de seguridad.

---

## ⚡ Protocolos de Solución Reactiva (Jetro AI Activation)

Ante cualquier alerta crítica o "eventualidad", Jetro AI debe activar inmediatamente los siguientes protocolos de solución:

### 1. Evento: Bajo Balance / Kick (BHP < Pore Pressure)

- **Diagnóstico:** Entrada de fluidos de formación.
- **Acción Jetro:**
  - Calcular incremento de MW necesario para balancear ($MW_{kill}$).
  - Recomendar cierre de preventoras (BOP) y monitoreo de presiones en cabeza.
  - Sugerir circulación por el método del perforador o esperar densificación.

### 2. Evento: ECD vs Fractura (ECD > Fracture Gradient)

- **Diagnóstico:** Sobrepresión dinámica induciendo fractura.
- **Acción Jetro:**
  - Calcular el $GPM_{max}$ seguro que mantiene el ECD por debajo del límite.
  - Recomendar reducción de viscosidad plástica (PV) mediante centrifugado.
  - Sugerir reducción de velocidad de rotación (RPM) si el aporte de fricción es alto.

### 3. Evento: Pobre Limpieza / Cuttings Bed (CCI < 0.5)

- **Diagnóstico:** Acumulación de ripios en el ánulo.
- **Acción Jetro:**
  - Proponer baches de limpieza (Píldoras de Alta Viscosidad/Peso).
  - Sugerir incremento de RPM para agitar los recortes mecánicamente.
  - Recomendar incremento de caudal (Q) si el margen de fractura lo permite.

### 4. Evento: Atrapamiento Mecánico (High Gel Progression)

- **Diagnóstico:** Lodo gelificando excesivamente en paradas.
- **Acción Jetro:**
  - Recomendar movimientos frecuentes de tubería tras paradas de bomba.
  - Sugerir tratamiento químico para romper estructuras galactomananos o arcillosas.
  - Advertir sobre la presión inicial de rotura de circulación (Breakdown Pressure).

---

**Jetro AI: No solo reportas el fuego, diriges la extinción.**

**Jetro AI: El código es temporal, la física es eterna.**
