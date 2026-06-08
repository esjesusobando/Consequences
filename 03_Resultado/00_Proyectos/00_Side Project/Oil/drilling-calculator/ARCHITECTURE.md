# Arquitectura del Sistema: Drilling Calculator 🔱

## Resumen Ejecutivo

Drilling Calculator es una aplicación de alta precisión para ingeniería de perforación, diseñada bajo los estándares de PersonalOS y certificada para grado Élite. Utiliza una arquitectura moderna basada en React, Zustand para gestión de estado y motores de cálculo desacoplados.

## Capas del Sistema

### 1. Capa de Datos (Store)

- **Tecnología:** Zustand
- **Archivo Principal:** `src/store/drilling-store.ts`
- **Responsabilidad:** Mantiene el estado global del pozo, lodo, bombas y resultados de cálculos. Implementa persistencia local y sincronización con el motor.

### 2. Motor de Cálculo (Engine)

- **Tecnología:** TypeScript (Pure Logic)
- **Componentes Clave:**
  - `orchestrator.ts`: Coordina el flujo de datos entre motores.
  - `rheology.ts`: Triple Modelo Reológico (Bingham, Power Law, Herschel-Bulkley) + Análisis de Geles.
  - `volumetrics.ts`: Cálculos de capacidades, volúmenes anulares y desplazamientos.
  - `hydraulics.ts`: Pérdidas de presión, ECD y optimización de boquillas.
  - `pressures.ts`: Ventana de presión y análisis hidrostático.
  - `bit-intelligence.ts`: Algoritmos avanzados para optimización de barrenas.

### 3. Capa de Interfaz (UI)

- **Tecnología:** React + Vanilla CSS (Premium Aesthetics)
- **Estilo:** Dieter Rams Standard (Symmetry, Glassmorphism, HSL tailors).
- **Componentes Críticos:**
  - `PressureWindow.tsx`: Visualización de la ventana de operativa.
  - `AlertBanner.tsx`: Sistema de blindaje (Armor Layer) para notificaciones críticas.
  - `JetroChat.tsx`: Integración de IA experta (Gemini 1.5 Flash via REST).

## Flujo de Información

1. El usuario modifica un parámetro en la UI.
2. `drilling-store` actualiza el estado.
3. El `useEffect` global dispara el `orchestrator`.
4. Los resultados retornan al store y se reflejan en la UI en tiempo real.

## Despliegue (Vercel Ready)

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment:** Node.js (Vite)

---

_Documento generado por Antigravity — Protocolo Pachamama 🔱_
