# Destructuring Optional Param — Syntax Fix

## Problem

`onTubeClick?` and `onMarkerClick?` in destructuring position are **invalid TypeScript syntax**. Causes TS1005 (',' expected) and TS1138 (Parameter declaration expected) errors.

## Root Cause

```typescript
// Broken — ? in destructuring position
export function WellRenderer({
  onTubeClick?,  // INVALID
}: {
  onTubeClick: (wellId: string) => void;
}) { ... }
```
The `?` after the destructured name is not valid syntax for optional properties.

## Solution

```typescript
// Fixed — ? in type position
export function WellRenderer({
  onTubeClick,  // no ?
}: {
  onTubeClick?: (wellId: string) => void;  // ? in type annotation
}) { ... }
```
Move the `?` to the **type annotation**, not the destructuring pattern.

## Prevention

1. **Pattern**: `const { prop } = obj` — prop name has no `?`
2. **Type**: `{ prop?: Type }` — `?` goes on the type
3. **Run tsc** — catches this immediately
4. **Don't confuse** with function params: `function fn({ prop } = {})` vs `function fn({ prop? }: { prop?: Type })`

## Files Fixed

- `RiskOverlay.tsx` line 146: `onMarkerClick?: (entry: CollisionEntry) => void;`
- `WellRenderer.tsx` lines 42, 54: `onTubeClick` destructured, `onTubeClick?:` in type
