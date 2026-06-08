# 🗜️ Drilling Calculator - Elite Engine

Este proyecto es una herramienta avanzada de cálculos de ingeniería de perforación, optimizada para precisión industrial y visualización de datos de alto rendimiento.

## 🔱 Auditoría Élite (2026-02-20)

El motor de cálculo ha sido sometido a una auditoría forense profunda, logrando la certificación **Elite Grade 10.0**.

### 🔬 Correcciones Críticas (Invictus)

- **μ_eff Bingham:** Corregida desviación en el factor de ajuste (Bourgoyne §4). Anteriormente utilizaba constantes no estándar para 511 s⁻¹.
- **μ_eff Power Law & HB:** Integración del factor de conversión dimensional **478.8** (API RP 13D §5). Esto corrige cálculos de Reynolds que presentaban errores de magnitud de hasta 100x.
- **Velocity Ratio:** Implementación de cálculo dinámico `AV / PipeV` eliminando constantes estáticas.
- **NaN Shielding:** Blindaje total contra valores nulos en el flujo de datos reactivo.

## 🛠️ Stack Tecnológico

- **Core:** React 18 + TypeScript + Vite
- **Engine:** PersonalOS Engine v2.0 (Validador Lógico Integrado)
- **Estándares:** API RP 13D, API RP 13B-1, Bourgoyne et al.

---

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Validación de Lógica

```bash
# Requiere PersonalOS Engine
python ../../../../06_ENGINE/14_logic_validator.py
```

---

## Expanding the ESLint configuration

...

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
