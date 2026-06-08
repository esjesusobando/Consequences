---
title: "Blank Screen - Invalid Icon Imports from lucide-react"
date: 2026-02-12
category: runtime-errors
severity: critical
status: resolved
components:
  - JetroChat.tsx
  - AIPMMenu.tsx
  - PressureWindow.tsx
  - App.tsx
tags:
  - react
  - imports
  - lucide-react
  - hooks
  - jsx
related_issues: []
---

# Blank Screen - Invalid Icon Imports from lucide-react

## Síntoma

La aplicación mostraba una **pantalla completamente blanca** sin ningún contenido visible. No había mensajes de error visibles en la UI, solo silencio total.

**Reportes del usuario:**

- "no se ve nada"
- "aun nada, no veo nada"
- "nada"

## Contexto

Aplicación React (Vite) de cálculos de perforación petrolera con múltiples componentes visuales y gráficos. La aplicación había estado funcionando previamente pero dejó de renderizar después de cambios en los componentes de UI.

## Investigación

### Paso 1: Verificación Inicial

Revisé los archivos principales (`App.tsx`, `main.tsx`) en busca de errores obvios de sintaxis.

### Paso 2: Implementación de ErrorBoundary

Creé un componente `ErrorBoundary` para capturar errores de renderizado que estaban siendo silenciados:

```tsx
// src/components/common/ErrorBoundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  // ... render con fallback UI
}
```

### Paso 3: Búsqueda de Imports Inválidos

Ejecuté `grep` para buscar iconos problemáticos:

```bash
grep -r "Alien" src/
grep -r "Maximize2" src/
grep -r "Minimize2" src/
```

## Causa Raíz

Se identificaron **4 errores críticos** que causaban el fallo:

### 1. **Hook `useState` Declarado Después del `return`** (App.tsx)

```tsx
// ❌ INCORRECTO
return <div>...</div>;
const [showGraphs, setShowGraphs] = useState(true); // Viola reglas de React
```

**Por qué falla**: React Hooks deben declararse al inicio del componente, antes de cualquier lógica condicional o return.

### 2. **Icono `Alien` No Existe en lucide-react** (JetroChat.tsx, AIPMMenu.tsx)

```tsx
// ❌ INCORRECTO
import { Alien } from "lucide-react"; // Alien no existe
<Alien size={24} />;
```

**Error resultante**: `Uncaught SyntaxError: The requested module does not provide an export named 'Alien'`

### 3. **Iconos `Maximize2`/`Minimize2` Usados Sin Importar** (PressureWindow.tsx, JetroChat.tsx)

```tsx
// ❌ INCORRECTO
{
  isFocused ? <Minimize2 size={14} /> : <Maximize2 size={14} />;
}
// Sin import correspondiente
```

**Error resultante**: `ReferenceError: Maximize2 is not defined`

### 4. **JSX Malformado** (Varios componentes)

Divs sin cerrar y etiquetas huérfanas en componentes de gráficos.

## Solución

### Fix #1: Reordenar Hooks en App.tsx

```tsx
// ✅ CORRECTO
function App() {
  const [zenMode, setZenMode] = useState(false);
  const [showGraphs, setShowGraphs] = useState(true); // Al inicio

  // ... resto del código

  return <div>...</div>;
}
```

### Fix #2: Reemplazar `Alien` por `Bot`

**JetroChat.tsx:**

```diff
- import { Send, Bot, User, Alien, ... } from "lucide-react";
+ import { Send, Bot, User, ... } from "lucide-react";

- <Alien size={24} />
+ <Bot size={24} />
```

**AIPMMenu.tsx:**

```diff
- import { Alien, X, Bookmark, ... } from "lucide-react";
+ import { Bot, X, Bookmark, ... } from "lucide-react";

- <Alien size={22} />
+ <Bot size={22} />
```

### Fix #3: Eliminar Botones de Foco con Iconos Inválidos

**PressureWindow.tsx:**

```diff
- <button className="focus-btn">
-   {isFocused ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
- </button>
```

**JetroChat.tsx:**

```diff
- import { ..., Minimize2, ... } from "lucide-react";
+ import { ..., X, ... } from "lucide-react";

- <Minimize2 size={18} />
+ <X size={18} />
```

### Fix #4: Implementar ErrorBoundary Global

**main.tsx:**

```tsx
import { ErrorBoundary } from "./components/common/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
```

## Verificación

```bash
# Confirmar que no quedan referencias
grep -r "Alien" src/        # 0 resultados (excepto comentarios)
grep -r "Maximize2" src/    # 0 resultados
grep -r "Minimize2" src/    # 0 resultados
```

**Resultado**: ✅ "ok ya se ve" (confirmado por usuario)

## Prevención

### 1. **Validar Imports Antes de Usar**

Consultar la documentación de lucide-react antes de usar iconos:

- [Lucide Icons Directory](https://lucide.dev/icons/)

### 2. **Usar ErrorBoundary en Desarrollo**

Siempre envolver la app en `<ErrorBoundary>` para capturar errores silenciosos.

### 3. **Linter para Hooks**

Configurar ESLint con `eslint-plugin-react-hooks`:

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error"
  }
}
```

### 4. **Cleanup Completo al Refactorizar**

Al eliminar funcionalidad (ej: botones de foco), verificar:

- ✅ Imports eliminados
- ✅ Usos en JSX eliminados
- ✅ Props relacionadas eliminadas

### 5. **Búsqueda Global Antes de Commit**

```bash
# Buscar imports no utilizados
npm run lint

# Buscar referencias huérfanas
grep -r "ComponentName" src/
```

## Archivos Modificados

| Archivo             | Cambios                                     | Líneas Afectadas|
|--------------------|--------------------------------------------|----------------|
| `App.tsx`           | Reordenamiento de hooks                     | 27, 73          |
| `JetroChat.tsx`     | Import + 2 usos de Alien → Bot              | 2, 98, 126      |
| `AIPMMenu.tsx`      | Import + uso de Alien → Bot                 | 3, 66           |
| `PressureWindow.tsx`| Eliminación de botón con Maximize2/Minimize2| 33-39           |
| `ErrorBoundary.tsx` | Creación de componente nuevo                |----------------|
| `main.tsx`          | Integración de ErrorBoundary                | 4, 10-12        |

## Lecciones Aprendidas

1. **React Hook Rules**: Los hooks SIEMPRE deben estar al inicio del componente.
2. **Import Validation**: Verificar que los exports existan en la librería antes de usarlos.
3. **Error Boundaries**: Son esenciales para debugging - convierten pantallas blancas en mensajes útiles.
4. **Cleanup Discipline**: Al eliminar código, buscar y eliminar TODAS las referencias relacionadas.

## Referencias

- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [Error Boundaries in React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
