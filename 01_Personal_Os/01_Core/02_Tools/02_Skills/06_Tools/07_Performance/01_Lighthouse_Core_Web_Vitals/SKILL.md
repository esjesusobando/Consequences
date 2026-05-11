---
name: lighthouse-core-web-vitals
description: Lighthouse CI configuration, Core Web Vitals optimization, and performance budgeting for modern web applications
created: 2026-05-11
owner: architect
tags: [performance, lighthouse, core-web-vitals, ci-cd, optimization]
---

# Lighthouse CI / Core Web Vitals

## Purpose

Lighthouse CI pipeline setup, Core Web Vitals optimization, and performance budget enforcement for production web applications.

## Core Web Vitals Targets (2026 SOTA)

| Metric | Target | Good | Needs Work | Poor |
|--------|--------|------|------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 2.5s | 2.5s–4s | > 4s |
| **INP** (Interaction to Next Paint) | < 200ms | < 200ms | 200ms–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.1 | 0.1–0.25 | > 0.25 |
| **TTFB** (Time to First Byte) | < 200ms | < 200ms | 200ms–600ms | > 600ms |
| **FID** (First Input Delay) | < 100ms | Deprecated 2024 | — | — |

> **Note:** INP replaced FID as the official Core Web Vital in March 2024. FID is deprecated.

## Capabilities

### Lighthouse CI Pipeline Setup

- `lhci autorun` — Run Lighthouse CI against target URLs
- CI-ready headless Chrome with budget assertions
- JSON configuration via `.lighthouserc.json` or `lighthouserc.js`
- GitHub Actions, GitLab CI, CircleCI integration

### Performance Budget Enforcement

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "first-contentful-paint": ["warn", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interaction-to-next-paint": ["error", { "maxNumericValue": 200 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "speed-index": ["warn", { "maxNumericValue": 3000 }],
        "server-response-time": ["error", { "maxNumericValue": 200 }],
        "uses-optimized-images": "warn",
        "uses-webp-images": "warn",
        "uses-long-cache-ttl": "warn"
      }
    }
  }
}
```

### LCP Optimization Techniques

1. **Server response time (TTFB)** — Reduce backend latency below 200ms
2. **Render-blocking resources** — Inline critical CSS, defer non-critical JS
3. **Image optimization** — AVIF/WebP with proper sizing, `fetchpriority="high"` on hero image
4. **Font preloading** — `<link rel="preload">` for critical fonts, `font-display: swap`
5. **CDN usage** — Serve static assets from edge CDN
6. **Preconnect** — `<link rel="preconnect">` for critical third-party origins
7. **LCP element identification** — Use Lighthouse to find the LCP element, optimize its loading

### INP Optimization Techniques

1. **Long tasks breakdown** — Break JavaScript into smaller chunks (< 50ms)
2. **RequestIdleCallback / scheduler.yield()** — Yield to browser for pending work
3. **Web Workers** — Offload heavy computation off main thread
4. **CSS containment** — Use `contain: layout paint` on dynamic components
5. **Passive event listeners** — Mark scroll/touch listeners as `passive: true`
6. **Debounce/throttle** — Limit event handler frequency
7. **Interaction latency reduction** — Avoid synchronous layout thrashing in handlers

### CLS Prevention

1. **Explicit dimensions** — Always set `width` and `height` on images/videos
2. **Font-display swap** — Reserve font fallback space with `size-adjust`
3. **Reserve space for ads/dynamic content** — Use `min-height` or aspect-ratio boxes
4. **Avoid layout shifts from inserted content** — Append below viewport when possible
5. **Stable positions** — Use `position: fixed` for sticky headers/overlays

### CrUX API Integration

```javascript
// Real User Metrics from CrUX API
const { CrUXApi } = require('@lhci/utils');

async function getCruxMetrics(url) {
  const api = new CrUXApi({ key: process.env.CRUX_API_KEY });
  const record = await api.query({
    origin: url,
    metrics: ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift']
  });
  return record;
}
```

### CI/CD Integration

**GitHub Actions:**
```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    configPath: './lighthouserc.json'
    uploadArtifacts: true
```

**GitLab CI:**
```yaml
lighthouse:
  script:
    - npm install -g @lhci/cli
    - lhci autorun
  artifacts:
    paths:
      - .lighthouseci/
```

## Commands

| Command | Description |
|---------|-------------|
| `lhci autorun` | Run Lighthouse CI with budget assertions |
| `lhci healthcheck` | Verify Lighthouse CI setup |
| `lhci assert` | Run assertions against a Lighthouse report |
| `npm run lighthouse` | Custom Lighthouse run script |
| `npm run perf:report` | Generate performance report |

## SOTA Standards 2026

### Modern Performance Patterns

- **Server Components** — Move rendering to server to reduce JS bundle and main-thread work
- **Image optimization** — AVIF > WebP > JPEG, proper `srcset`, `fetchpriority`
- **Font preloading** — Critical font preload, `font-display: optional` for non-critical
- **Resource hints** — `preconnect`, `preload`, `prefetch` for critical resources
- **Critical CSS inlining** — Extract and inline above-the-fold CSS
- **Code splitting** — Lazy load non-critical routes/components
- **Compression** — Brotli/Gzip at CDN level

### Budget Thresholds (SOTA)

```json
{
  "budgets": [
    {
      "resourceCounts": [
        { "resourceType": "script", "budget": 50 },
        { "resourceType": "image", "budget": 30 }
      ],
      "resourceSizes": [
        { "resourceType": "total", "budget": 500 },
        { "resourceType": "script", "budget": 150 },
        { "resourceType": "image", "budget": 200 }
      ],
      "timings": [
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "interaction-to-next-paint", "budget": 200 },
        { "metric": "cumulative-layout-shift", "budget": 0.1 },
        { "metric": "total-blocking-time", "budget": 300 }
      ]
    }
  ]
}
```

### Performance Monitoring Stack

- **Lighthouse CI** — Synthetic performance testing in CI
- **CrUX** — Real User Metrics (RUM) from Chrome
- **WebPageTest** — Advanced performance waterfall analysis
- **Chrome DevTools** — Performance profiling and INP debugging
- **PerformanceObserver API** — Client-side Core Web Vitals collection

## References

- [web.dev Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Chrome UX Report (CrUX)](https://developer.chrome.com/docs/crux)
- [INP Documentation](https://web.dev/articles/inp)
- [LCP Documentation](https://web.dev/articles/lcp)
- [CLS Documentation](https://web.dev/articles/cls)
