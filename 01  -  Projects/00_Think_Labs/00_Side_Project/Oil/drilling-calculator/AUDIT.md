# 🔱 Drilling Calculator — Proyecto de Perforación

## 📋 AUDITORÍA COMPLETA (2026-05-21)

### Estado: ✅ OPERATIVO — Código fuente recuperado

- --

## 📁 ESTRUCTURA DEL PROYECTO

```
03_Side_Project_Backup/Oil/drilling-calculator/
├── src/                              # ✅ Código fuente (107 archivos)

│   ├── components/
│   │   ├── common/                   # Componentes compartidos

│   │   ├── layout/                   # Layout principal

│   │   ├── results/                  # Panel de resultados

│   │   ├── sections/                 # Secciones principales (WellControl, MudProperties, etc.)

│   │   ├── ui/                       # Componentes UI (AIPMMenu, etc.)

│   │   └── visuals/                  # Gráficos (Trajectory3D, TorqueDragChart, etc.)

│   ├── engine/                       # Motores de cálculo (20 archivos)

│   │   ├── rheology.ts              # Triple modelo reológico

│   │   ├── hydraulics.ts            # ECD, pérdidas de presión

│   │   ├── well-control.ts          # Control de pozo

│   │   ├── volumetrics.ts           # Capacidades y volúmenes

│   │   ├── directional.ts           # Perforación direccional

│   │   ├── torque-drag.ts           # Torque y arrastre

│   │   ├── stuck-pipe.ts            # Análisis de tubería atorada

│   │   ├── surge-swab.ts            # Efectos surge/swab

│   │   ├── bit-intelligence.ts      # Optimización de barrenas

│   │   └── orchestrator.ts         # Orquestador de cálculos

│   ├── guards/                       # Sistema de alertas

│   │   ├── alert-engine.ts         # Motor de alertas

│   │   ├── input-guards.ts         # Validación de entrada

│   │   └── output-guards.ts        # Validación de salida

│   ├── hooks/
│   │   └── useToolManager.ts       # Gestor de herramientas 3D

│   ├── store/
│   │   └── drilling-store.ts       # Estado global (Zustand)

│   ├── types/                       # Tipos TypeScript

│   ├── utils/                       # Utilidades

│   └── test/                        # Tests

├── dist/                            # ✅ Build para Vercel

├── node_modules/                    # ✅ Dependencias instaladas

├── 06_ENGINE/                       # Motores Python de validación

├── 08_ARCHIVE/                      # ⚠️ ARCHIVO - scripts de validación legacy

├── docs/                            # Documentación técnica

├── eslint.config.js
├── package.json                     # React 19, Zustand 5, Three.js

├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts                # Configuración de tests

└── vercel.json

Oil/
├── docs/
│   ├── commercial-valuation-v1.md
│   └── solutions/ui/well-control-refinement-v2.md
├── drilling-calculator/             # ✅ Proyecto principal

└── Oil Brain/                      # Base de conocimiento (10 disciplinas)

    ├── cementacion/
    ├── completacion/
    ├── control_de_pozos/
    ├── fluidos_perforacion/
    ├── mechas/
    ├── perforacion/
    ├── perforacion_direccional/
    ├── registros_electricos/
    ├── workover_rehabilitacion/
    └── yacimiento/
```

- --

## 🔧 STACK TECNOLÓGICO

| Categoría     | Tecnología                  | Versión    |
|--------------|----------------------------|-----------|
| **Core**      | React                       | 19.2.0     |
| **State**     | Zustand                     | 5.0.11     |
| **3D**        | Three.js / React Three Fiber| 0.183 / 9.5|
| **Charts**    | Recharts                    | 3.7.0      |
| **Build**     | Vite                        | 7.3.1      |
| **TypeScript**| TypeScript                  | 5.9.3      |
| **Testing**   | Vitest                      | 4.1.0      |
| **Lint**      | ESLint                      | 9.39.1     |

- --

## 🛠️ MOTORES DE CÁLCULO

### Motor Reológico (rheology.ts)

- **Bingham Plastic** — PV, YP
- **Power Law** — n, K
- **Herschel-Bulkley** — τ₀ (Yield Stress)

### Motor Hidráulico (hydraulics.ts)

- **ECD** — Densidad Equivalente de Circulación
- **Pérdidas de presión** — Annals y sarta
- **Optimización de boquillas** — HHP/in²

### Motor Well Control (well-control.ts)

- **MAASP** — Máxima Presión Anular de Shelter
- **KMW** — Kill Mud Weight
- **Margin Kick/Loss** — Alertas críticas

### Motor Volumétrico (volumetrics.ts)

- **Capacidades** — Tubería, ánulo, pozo
- **Desplazamientos** — Volumes reales
- **Tiempos de circulación** — Dinámicos (no hardcoded)

- --

## 🚨 ALERTAS SISTEMA

### Niveles de Alerta

1. **CRÍTICO** (Rojo) — Kick o pérdida inminente
2. **WARNING** (Amarillo) — Margen < 0.3 ppg
3. **INFO** (Azul) — Recomendaciones operativas

### Triggers

- `ECD > Fracture Gradient`
- `MW < Pore Pressure - margin`
- `CCI < 0.5` (Hole Cleaning)
- `HHP/in² < 2.0` o `> 7.0`

- --

## ⚠️ ISSUES DETECTADAS (Pendientes)

> Actualizado 2026-09-09 — estado verificado tras el loop de reparación del módulo Anti-Colisión.
> Detalle completo en `docs/NOTAS_DE_PROCESO_2026-09.md`.

### ESTADO DEL LOOP: ✅ REPARADO

- **tsc**: 0 errores (eran 98, todos en 12 visuales huérfanas archivadas a `_visuals_archive/`)
- **Tests**: 253/253 (29 archivos)
- **Build**: OK (`tsc -b && vite build`)
- **Lint**: 0 errores / 7 warnings deliberados (react-refresh, exports de helpers para testing headless)
- **Bugs React 19 corregidos**: early return entre hooks (AntiCollision3D), refs escritas en render (AntiCollision3D, useDemoSeed), setState síncrono en effect (Anticolision → render-phase updates)
- **Scripts**: `validate-imports.js` reescrito (validaba contra lista hardcodeada obsoleta); ahora contra node_modules

### DEUDA DOCUMENTADA (no bloqueante)

- ErrorBoundary solo en 2.1% de componentes (47 sin) — atender si la app va a producción multi-usuario
- Aviso de build chunk >500 kB (three.js + recharts) — pre-existente
- Archivo `0` (0 bytes) en la raíz del repo — decidir al ordenar estructura

### LEGACY (08_ARCHIVE)

- Archivos con paths absolutos a `Downloads/...`
- Scripts de validación duplicados

- --

## 📌 COMANDOS

```bash
# Instalación

npm install

# Desarrollo

npm run dev

# Build

npm run build

# Tests

npm run test

# Lint

npm run lint

# Preview build

npm run preview
```

- --

## 📚 REFERENCIAS TÉCNICAS

- **API RP 13B-1** — Drilling Fluids
- **API RP 13D** — Hydraulics
- **Bourgoyne** — Applied Drilling Engineering
- **IADC** — Drilling Manual

- --

* *Última actualización:** 2026-09-09
* *Estado:** ✅ OPERATIVO — src recuperado de origen; módulo Anti-Colisión verificado (tsc 0, tests 253/253, lint 0 errores)
