# Empty Array Guard Pattern

## Problem

`computeUncertaintyProfile` crashed when `adjacentTrajectory` was an empty array `[]`. The code checked `if (adjacentTrajectory && ...)` which is truthy for empty arrays, then tried to access `adjacentTrajectory[bestIdx]` causing an index error.

## Root Cause

```typescript
// Before (broken)
if (adjacentTrajectory && primary.length > 0)
```
The original check was missing `adjacentTrajectory.length > 0`. Empty arrays are truthy in JS/TS.

## Solution

```typescript
// After (fixed)
if (adjacentTrajectory && adjacentTrajectory.length > 0 && primary.length > 0)
```

The key addition: `adjacentTrajectory.length > 0` explicitly checks for empty arrays before attempting to index.

## Prevention

1. **Always check `.length > 0`** when an array could be empty — truthiness is not enough
2. **Add regression test** for empty array case (see test file lines 167-181)
3. **Type narrow** with `Array.isArray()` if input could be non-array

## Test Added

```typescript
it("Empty adjacent trajectory does not crash", () => {
  const result = computeUncertaintyProfile(trajectory, {
    tool,
    adjacentTrajectory: [],  // empty array — was crashing
  });
  expect(result.length).toBe(2);
  for (const station of result) {
    expect(station.riskLevel).toBeUndefined();
  }
});
```
