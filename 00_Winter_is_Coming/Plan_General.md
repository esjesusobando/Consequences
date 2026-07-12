# 🛠️ Plan de Resolución: Error en ToolsView (Zero Consequences)

## 📌 Diagnóstico del Error

Tras revisar el código y la compilación, se identificaron los problemas que rompen la sección de "Tools" (herramientas) en tiempo de ejecución y en desarrollo:

1. **Crash por WASM de `@imgly/background-removal`**: Este paquete descarga un modelo pesado de ~80MB que usa WebAssembly. Vite intenta preempaquetar y optimizar este paquete (pre-bundling), lo cual rompe la carga del WASM en tiempo de desarrollo/ejecución. Esto causa un fallo silencioso o un crash en `ToolsView.tsx`.
2. **Conflictos con `ErrorBoundary` y React 19**: El componente `ErrorBoundary.tsx` utiliza una firma personalizada para sobrescribir `setState` (`setState<K extends keyof State>...`). En React 19 y bajo la configuración `useDefineForClassFields: false`, esto genera advertencias de tipo y comportamiento inestable en el ciclo de vida del error.
3. **Tipos Faltantes (Build silenciosamente roto)**: El compilador estricto (`tsc --noEmit`) falla por la falta de tipos para `react-dom/client` y `vitest`. Aunque Vite empaquete correctamente (ignora los tipos), esto causa errores en el IDE e inestabilidad.

---

## 🚀 Propuesta de Solución (Plan de Acción)

### 1. Configuración de dependencias WASM en Vite
Modificar `vite.config.ts` para excluir a `@imgly/background-removal` de la optimización estricta de Vite. Esto permite que el WASM se cargue dinámicamente sin que el servidor de Vite se bloquee intentando analizarlo:
- **Archivo**: `vite.config.ts`
- **Cambio**: Añadir `optimizeDeps: { exclude: ['@imgly/background-removal'] }`

### 2. Estabilización de `ErrorBoundary.tsx`
Refactorizar `ErrorBoundary` para que sea un `Component` de React 19 100% estándar, eliminando la sobrecarga innecesaria de `setState` que genera fricción con el motor interno de React.

### 3. Instalación de Tipos Faltantes
Ejecutar la instalación de los tipos estrictos que el IDE requiere:
- `npm i --save-dev @types/react-dom vitest`

### 4. Actualización del Registro de Memoria (Bucle Dorado)
Documentar la resolución de este error técnico del WASM en:
- `Notas_de_Proceso.md`
- `Context_Memory.md`

## ✅ Plan de Verificación

1. Ejecutar el servidor de desarrollo y navegar a la pestaña **Tools**.
2. Verificar que el **Prompt Library** cargue inmediatamente sin pantallas de error.
3. Navegar a la pestaña **Remove BG** (que invoca a `@imgly`) y verificar que inicialice correctamente.
4. Asegurar que `tsc --noEmit` termine sin errores (Exit code 0).
