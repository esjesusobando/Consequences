# Export Type vs Value — `export type` is for Types Only

## Problem

`export type { sfToColor }` in RiskOverlay.tsx caused TypeScript error TS1205: "sfToColor is a value, not a type". The code compiles but fails type-check.

## Root Cause

```typescript
// Broken
export type { sfToColor };
```
`export type` can only re-export **types** (interfaces, type aliases). `sfToColor` is a **function value**, not a type.

## Solution

```typescript
// Fixed
export { sfToColor };
```
Use `export { ... }` for values (functions, constants, variables). Use `export type { ... }` only for types.

## Prevention

1. **Know the difference**: `export type` = types only, `export` = values
2. **IDE warning**: VS Code shows error when hovering — don't ignore it
3. **Run tsc before commit** — catches this instantly
4. **GGA code review** caught this — listen to it

## Related

- `import type { ... }` for imports
- `export type { ... }` for re-exports of types
- `import { ... }` / `export { ... }` for values
