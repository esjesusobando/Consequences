---
title: "Smart Component: Jetro AI Chat Assistant with Operational Context"
category: ai-integrations
date: 2026-02-12
tags: [ai, assistant, react, zustand, glassmorphism, context-awareness]
components: [JetroChat, drilling-store]
severity: low
status: resolved
---

# Smart Component: Jetro AI Chat Assistant with Operational Context

## Problem Symptom

**Market Gap:**

- Competitive drilling software is often passive and data-heavy, requiring the user to interpret all results manually.
- Lack of proactive guidance made the app feel like a "tool" rather than an "engineering partner".

## Root Cause Analysis

### Strategic Explanation

The "Drilling Calculator" needed a narrative layer. Users have all the data (VDR, Hydraulics, Pressures) but often miss the "So What?".

1. **Context Fragmentation**: Data is spread across 4 columns.
2. **Interpretative Gap**: Users need to know if the current TFA is optimal or if the rheology is sufficient for hole cleaning.
3. **Static UI**: No conversational bridge between data input and engineering advice.

## Investigation Steps Tried

### ❌ Attempts That Didn't Work

- **Standard Info Tooltips**: Too static and easily ignored by experienced users.
- **Auto-generated Text Summaries**: Lacked interaction and felt like "documentation reading" rather than assistance.

### ✅ Working Solution

**Jetro AI Implementation:**

Created a floating, context-aware chat assistant that subscribes to the Zustand store.

```typescript
// src/components/sections/JetroChat.tsx
const generateAIResponse = (query: string) => {
  // Uses store data for precision responses
  if (q.includes("tfa")) {
    response = `Currently you have a TFA of ${results.hydraulics.totalFlowArea.toFixed(4)}...`;
  }
};
```

## Step-by-Step Fix

### 1. Create Premium UI

Designed `JetroChat.css` with:

- **Glassmorphism**: 20px blur and 0.1 alpha borders.
- **Micro-animations**: Pulse effects for the trigger and slide up for the window.
- **HSL Colors**: Coherent with the "Elite Engineering" palette.

### 2. Store Integration

Hooked the component into `useDrillingStore` to read:

- `wellData.bitNozzles`
- `results.hydraulics.totalFlowArea`
- `mudData.rheologyModel`

### 3. Logic Layer

Implemented a heuristic logic that simulates a LLM specialized in drilling, using the local state to provide "Superhuman" insights without expensive API calls for basic engineering queries.

## Prevention Strategies

### 1. State Subscription Optimization

Ensure Jetro only re-renders on relevant data changes to maintain "Pure Green" performance (120fps UI).

### 2. Logic Separation

Plan for a future bridge with a real LLM (Jetro Prime) while keeping the heuristic logic as a fallback for offline/high-speed interactions.

## Files Modified

- [NEW] `src/components/sections/JetroChat.tsx`
- [NEW] `src/components/sections/JetroChat.css`
- `src/App.tsx`: Integrated the floating component at the root level.

## Testing Verification

✅ **Interaction Test**: Clicking the floating icon opens the chat window with a smooth animation.
✅ **Context Test**: Querying "TFA" returns the exact value currently calculated in the hydraulics engine.
✅ **Zen Mode Compatibility**: Verified Jetro stays accessible/visible even in "Jetro Zen" mode for constant assistance.
