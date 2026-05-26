# Plan de Validación: Motor Mechanics (Surge/Swab + Stuck Pipe)

## 🔘 Agentes de Validación (5 Capas)

### 1. Agente Matemático (Burkhardt Core)

- **Misión:** Validar que el gradiente de fricción ($P_f$) coincida con el Benchmark (1272 psi @ 10,000 ft).
- **Control:** Error relativo < 0.1%.

### 2. Agente de Riesgo (Sticking Force)

- **Misión:** Calcular la Fuerza de Pegadura Diferencial ($F_s$).
- **Escenario:** Overbalance de 500 psi, Área de contacto de 150 $in^2$, CoF de 0.25.
- **Esperado:** $F_s = 500 \times 150 \times 0.25 = 18,750$ lbs de overpull necesario.

### 3. Agente Geométrico (Key Seating)

- **Misión:** Identificar zonas de riesgo por Dogleg Severity (DLS).
- **Escenario:** DLS > 4°/100ft + Tensión de tubería elevada.
- **Esperado:** Alerta de "Key Seating High Risk".

### 4. Agente de Recuperación (Free Point)

- **Misión:** Validar el cálculo de profundidad de pegadura basada en "stretch".
- **Escenario:** Stretch de 20 pulgadas, Pull de 50,000 lbs, FPC de 2500.
- **Esperado:** Depth = (20 \* 2500) / 50 = 1,000 ft de tubería libre.

### 5. Agente de Integración (Store/UI)

- **Misión:** Verificar que `MechanicsResult` fluya correctamente al `drilling-store.ts` sin romper el build.

## 🧪 Ejercicio Combinado (Master Test)

Se creará un script `validate_mechanics_master.mjs` que ejecutará estos 5 agentes de forma secuencial.
