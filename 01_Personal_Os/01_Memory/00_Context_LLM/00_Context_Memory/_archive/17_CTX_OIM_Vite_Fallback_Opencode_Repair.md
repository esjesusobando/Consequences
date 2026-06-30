# Context Memory: OIM Vite Fallback & Opencode Repair

**Session ID**: CTX_005
**Status**: 🟢 Pure Green

## 1. Goal
Reparar el comando global `opencode` en Windows, activar el índice y motor the `qmd`, y diagnosticar un fallo fantasma del frontend React/Vite en `06_OIM_Original`. Y reorganizar convenciones de nomenclaturas para Context Memory.

## 2. Acciones y Descubrimientos (Discoveries)
- **Opencode**: La instalación global de `npm` había sido interrumpida dejando temporales corruptos `.opencode` y arrojando `EFTYPE`. Limpiado con una reinstalación formal.
- **QMD**: Se activó satisfactoriamente corriendo `75_Update_QMD_Index.py` re-indexando las colecciones locales del OS.
- **OIM Vite Fallback**: 
  - *Problema*: Vite intenta inyectar `.env` estrictamente en el cliente (`process.env.GEMINI_API_KEY`), pero si `.env` no existe, se inyecta `undefined`.
  - *Vite Silent Routing*: Si el origin port (`3000`) está retenido por el host, Vite levanta sin chistar en `3001`, lo cual confundió al humano que visitaba `3000` asumiendo que "la terminal crasheó".
  
## 3. Resoluciones Estratégicas
1. `.env` ejemplo clonado internamente en OIM y puerto 3001 validado.
2. `opencode --version` respondiendo en 1.3.17 limpiamente en consola.
3. Se generó un *Compound Learning* en la base `03_Process_Notes`.
4. Se acató la nueva regla arquitectónica de convenciones de Context Memory: `00_CTX_Tema.md` con las fechas adjuntadas al final del body en caso de archivo previo.

## 4. Alineamiento Metodológico (Core/Rules)
Se validó la primacía de `00_Core/01_Rules` guiada por `CLAUDE.md` y `01_Personal_Os/11_AGENTS.md` como la *Fuente de Verdad*, comprobando que todos los agentes apuntan al mismo centro operativo en el workspace v6.1 sin fisuras.

---
* **Fecha de Sesion:** 2026-04-06
