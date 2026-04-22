# 🔬 Ingeniería Inversa — Recall 2.0

> Análisis de cómo fue construido

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────┐
│           Recall 2.0                    │
├─────────────────────────────────────────┤
│  User Input Layer                        │
│  ├─ Browser Extension (Chrome/Firefox) │
│  ├─ Web App (dashboard)                │
│  ├─ Mobile (iOS/Android)               │
│  └─ API + MCP                         │
├─────────────────────────────────────────┤
│  Processing Layer                      │
│  ├─ AI Summarization (LLM)             │
│  ├─ Entity Extraction                 │
│  ├─ Tagging (auto)                    │
│  └─ Connection Detection             │
├─────────────────────────────────────────┤
│  Storage Layer                         │
│  ├─ Cards (contenido)                 │
│  ├─ Graph (conexiones)               │
│  └─ User Data                        │
├─────────────────────────────────────────┤
│  Output Layer                         │
│  ├─ Chat (agentic)                   │
│  ├─ Quiz (spaced repetition)         │
│  └─ Graph View                       │
└─────────────────────────────────────────┘
```

---

## 🔧 Stack Técnico (estimado)

| Componente | Tecnología | Evidencia |
|------------|------------|-----------|
| Frontend | React/Next.js | UI patterns modernos |
| Backend | Python/Node | API flexibility |
| Database | PostgreSQL + Vector | Semantic search |
| AI | Multiple (GPT, Claude, etc.) | Plugged LLMs |
| Storage | S3/Cloudflare | Media files |
| Auth | Clerk/Firebase | Social login |

---

## 🎯 Decisiones de Producto Clave

### 1. Agentic Chat con Dual Mode
**Qué hicieron:** No solo chat con knowledge — permite internet + ambos.
**Por qué:** Da flexibilidad para diferentes casos de uso.

### 2. Graph View como Discovery
**Qué сделали:** Visual no solo para mostrar — para найти connections.
**Por qué:** El valor no es ver, es DESCUBRIR.

### 3. Quiz 2.0 con 7 tipos
**Qué hicieron:** Multiple choice + true/false + fill-blank + short + matching + ordering + flashcard.
**Por qué:** Diferentes tipos testean diferente comprensión.

### 4. MCP Access desde Day 1
**Qué hicieron:** Exponer el tool via MCP early.
**Por qué:** Extensibilidad = adoption en developer community.

### 5. Freemium con código de descuento
**Qué hicieron:** Free tier + Ben25 código.
**Por qué:** Referral virality + discount crea urgencia.

---

## 📊 Modelo de Negocio

```
┌──────────────────┬──────────────────┐
│     Free Tier    │    Pro Tier     │
├──────────────────┼──────────────────┤
│ 50 cards        │ Unlimited        │
│ Basic search     │ Semantic search  │
│ Limited quiz    │ Full quiz       │
│ No MCP         │ MCP access      │
│ No API         │ API + webhooks │
└──────────────────┴──────────────────┘
```

**Estrategia:** Freemium classiques. Convertir power users → revenue.

---

## 🔑 Lecciones para Construir

| Learn | Aplicación |
|-------|-----------|
| AI niveló el campo → knowledge como advantage | No competir en features, competir en contexto |
| MCP early = developer adoption | Expón tu herramienta lo antes posible |
| Graph como discovery, no como display | Features que sorprenden > features que simplemente funcionan |
| Quiz spaced repetition es real learning | No half-measures — implementá bien o no个省 |
| Discount code = viral | Referral loop integrado en launch |

---

## 🧪 Cómo lo haríamos diferente

1. **Más early**: MCP desde launch, no v2.0
2. **API primero**: Antes del graph, la API para developers
3. **local-first option**: Como Obsidian — data local, cloud optional

---

*Ingeniería Inversa: Learning Always — Recall 2.0*