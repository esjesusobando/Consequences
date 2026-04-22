# Ingeniería Inversa — Claude Computer Use

## Arquitectura

```
┌─────────────────────────────────────────┐
│       Claude Desktop App                │
├─────────────────────────────────────────┤
│  Chat Tab    │  Cowork Tab  │  Code Tab │
├─────────────────────────────────────────┤
│  Computer Use Engine                   │
│  ├─ Screenshot capture                 │
│  ├─ Vision model (analysis)             │
│  ├─ Action planning                    │
│  └─ Execution (click, type, navigate)  │
├─────────────────────────────────────────┤
│  Integrations                          │
│  ├─ MCP Connectors                     │
│  ├─ Dispatch (mobile)                 │
│  └─ Chrome Extension                  │
└─────────────────────────────────────────┘
```

## Stack Técnico

| Component | Tecnología |
|-----------|------------|
| Frontend | Electron/React |
| Vision | Anthropic (computer use model) |
| Desktop | macOS native |
| Mobile | Claude Mobile App |
| MCP | Multiple servers |

---

## Decisiones Clave

### 1. Vision-Action Loop
**Qué:** Screenshots continuos + model analysis
**Para qué:** Autonomous multi-step tasks

### 2. Dispatch First
**Qué:** Mobile app como remote control
**Para qué:** "Work from anywhere"

### 3. MCP Open Architecture
**Qué:** Any app can be connected
**Para qué:** Extendability = adoption

### 4. Research Preview
**Qué:** Explicit "preview" label
**Para qué:** Manage expectations, iterate fast

---

## Pricing Model (mcp: recall same)

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Chat only |
| Pro | $20/mo | Computer Use, Dispatch |
| Max | $100-200/mo | Advanced + priority |

---

## Lecciones parabuild

| Learn | Apply |
|-------|-------|
| Remote work needs dispatch | Add mobile trigger |
| Vision = autonomy | Screen capture first |
| MCP = extensibility | Open API from day 1 |
| Preview = fast iteration | Ship early, iterate |