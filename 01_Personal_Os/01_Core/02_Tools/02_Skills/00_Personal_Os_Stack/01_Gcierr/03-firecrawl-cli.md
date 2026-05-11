# Firecrawl CLI: La Web Entera, Lista para tu LLM

> De "copiar y pegar HTML sucio" a "dataset limpio para RAG en 15 minutos". Una CLI que convierte cualquier sitio en markdown/JSON estructurado, sin pelearse con navegadores headless, anti-bots ni selectores CSS.

---

## Por qué existe esta skill

Scrapear la web para alimentar LLMs es un dolor clásico:

- BeautifulSoup se rompe con JavaScript.
- Puppeteer/Playwright requieren mantener un navegador headless, proxies, cookies, rate limits.
- Los datos llegan sucios: menús, banners, ads, footers, schema.org basura.
- Parsear HTML a markdown legible para un LLM es otro proyecto aparte.

**Firecrawl CLI resuelve todo eso en un comando.** Scrape, crawl y extracción estructurada (con schema JSON) desde terminal, listo para pegar en un pipeline RAG.

---

## Setup rapido (60 segundos)

```bash
# Instalacion + init con todas las features (incluye modo browser para JS pesado)
npx -y firecrawl-cli@latest init --all --browser

# Login con tu cuenta (abre browser, OAuth)
firecrawl login

# Verificar
firecrawl --version
firecrawl whoami
```

Una vez logueado, la CLI guarda tu API key en `~/.firecrawl/config.json` y queda lista para usar desde cualquier directorio.

---

## Caso 1: Scrape de una URL unica (markdown limpio)

El modo mas basico: darle una URL y recibir markdown listo para un LLM, sin nav, sin ads, sin ruido.

### Comando

```bash
firecrawl scrape https://www.anthropic.com/news/claude-opus-4 \
  --format markdown \
  --output ./scrapes/opus4.md
```

### Output esperado

```
[Firecrawl] Scraping https://www.anthropic.com/news/claude-opus-4 ...
[Firecrawl] Rendered with headless browser (JS ejecutado OK)
[Firecrawl] Content extracted: 8,412 chars
[Firecrawl] Guardado en: ./scrapes/opus4.md
[Firecrawl] Tokens aprox: 2,103
```

### Contenido del archivo generado (ejemplo)

```markdown
# Introducing Claude Opus 4

Today we are announcing Claude Opus 4, our most capable model...

## Benchmarks

| Benchmark                   | Opus 4                 | GPT-4                  | Gemini                 |
|-----------------------------|------------------------|------------------------|------------------------|
| SWE-bench                   | 72.5%                  | 54.6%                  | 51.2%                  |
| MMLU                        | 88.7%                  | 86.4%                  | 85.9%                  |

## Availability

Claude Opus 4 is available today via the API...
```

Nota: sin menu de navegacion, sin cookies banner, sin footer legal. Solo el contenido real.

---

## Caso 2: Crawl completo de un dominio (docs.anthropic.com)

Para armar un dataset completo (RAG, fine-tuning, knowledge base), se recorre todo un dominio siguiendo links internos.

### Comando

```bash
firecrawl crawl https://docs.anthropic.com \
  --limit 500 \
  --max-depth 4 \
  --format markdown,json \
  --include "/en/docs/**" \
  --exclude "/changelog/**" \
  --concurrency 8 \
  --output ./datasets/anthropic-docs/
```

### Output esperado (streaming)

```
[Firecrawl Crawl] Seed: https://docs.anthropic.com
[Firecrawl Crawl] Descubriendo sitemap.xml ... 438 URLs
[Firecrawl Crawl] Aplicando filtros include/exclude ... 312 URLs validas
[Firecrawl Crawl] Concurrencia: 8  |  Rate limit: 60 req/min

  [001/312]  /en/docs/intro                            OK   (1.2s,  4.1kB)
  [002/312]  /en/docs/api/getting-started              OK   (0.8s,  6.7kB)
  [003/312]  /en/docs/prompt-engineering/overview      OK   (1.1s,  9.3kB)
  [004/312]  /en/docs/models/claude-opus-4             OK   (0.9s,  7.8kB)
  ...
  [312/312]  /en/docs/tool-use/streaming               OK   (1.0s,  5.4kB)

[Firecrawl Crawl] Completado en 4m 21s
[Firecrawl Crawl] Guardado: 312 archivos en ./datasets/anthropic-docs/
[Firecrawl Crawl] Indice: ./datasets/anthropic-docs/_index.json
```

### Estructura del dataset generado

```
datasets/anthropic-docs/
├── _index.json                    # Indice maestro con metadata
├── en-docs-intro.md
├── en-docs-intro.json
├── en-docs-api-getting-started.md
├── en-docs-api-getting-started.json
├── en-docs-prompt-engineering-overview.md
└── ...
```

---

## Caso 3: Extraccion de leads desde un directorio

Referencia: `firecrawl-cli/extrayendo_leads.sh`

Esto es el caso clasico B2B: tomar un directorio (camaras de comercio, YellowPages, listas de proveedores) y sacar un CSV de leads listo para outreach.

### Script adaptado

```bash
#!/bin/bash
# extrayendo_leads.sh

echo "[Firecrawl AI] Iniciando escaneo profundo del directorio..."

firecrawl crawl https://directorio-empresas.example.com/rubro/software \
  --limit 200 \
  --extract-schema ./schemas/lead.json \
  --format json \
  --output ./leads/

echo "Extraccion exitosa (Anti-Bot Bypass: OK)."
echo "Consolidando en leads_competencia.csv ..."

firecrawl merge ./leads/*.json --output leads_competencia.csv --format csv
```

### Schema `lead.json`

```json
{
  "type": "object",
  "properties": {
    "empresa":       { "type": "string" },
    "sitio_web":     { "type": "string", "format": "uri" },
    "email":         { "type": "string", "format": "email" },
    "telefono":      { "type": "string" },
    "direccion":     { "type": "string" },
    "rubro":         { "type": "string" },
    "empleados":     { "type": "integer" },
    "descripcion":   { "type": "string" }
  },
  "required": ["empresa", "sitio_web"]
}
```

### Output JSON por lead

```json
{
  "url": "https://directorio-empresas.example.com/empresa/acme-sa",
  "extracted": {
    "empresa": "ACME S.A.",
    "sitio_web": "https://acme.com.ar",
    "email": "contacto@acme.com.ar",
    "telefono": "+54 11 4555-1234",
    "direccion": "Av. Corrientes 1234, CABA",
    "rubro": "Software B2B",
    "empleados": 45,
    "descripcion": "Consultora de software especializada en fintech"
  },
  "confidence": 0.94,
  "scraped_at": "2026-04-17T14:22:10Z"
}
```

### CSV final

```csv
empresa,sitio_web,email,telefono,empleados,rubro
ACME S.A.,https://acme.com.ar,contacto@acme.com.ar,+54 11 4555-1234,45,Software B2B
Globant-like Co,https://globantlike.com,hello@globantlike.com,+54 11 4777-9999,320,Software B2B
...
```

200 leads en ~6 minutos. Sin escribir una linea de Puppeteer.

---

## Firecrawl vs el resto

| Feature                                        | Firecrawl CLI                 | BeautifulSoup                 | Puppeteer                    | Playwright                   |
|------------------------------------------------|-------------------------------|-------------------------------|------------------------------|------------------------------|
| JS rendering                                   | Si (auto)                     | No                            | Si                           | Si                           |
| Markdown limpio para LLM                       | Si (nativo)                   | No (DIY)                      | No (DIY)                     | No (DIY)                     |
| Crawl recursivo + sitemap                      | Si (flag)                     | No                            | Manual                       | Manual                       |
| Extraccion con JSON schema                     | Si (nativo)                   | No                            | No                           | No                           |
| Anti-bot bypass                                | Si                            | No                            | Parcial                      | Parcial                      |
| Rate limiting built-in                         | Si                            | No                            | Manual                       | Manual                       |
| Concurrencia configurable                      | Si (flag)                     | Manual                        | Manual                       | Manual                       |
| Tiempo de setup                                | 1 min                         | 10 min                        | 30 min                       | 30 min                       |
| Mantenimiento cuando cambia UI                 | Bajo                          | Alto                          | Muy alto                     | Muy alto                     |
| Curva de aprendizaje                           | Zero-to-hero                  | Media                         | Alta                         | Alta                         |
| Costo stack                                    | API + free CLI                | Gratis                        | Infra headless               | Infra headless               |

Resumen: Firecrawl CLI es la opcion correcta cuando el objetivo es **alimentar un LLM**. Puppeteer/Playwright siguen ganando si lo que se necesita es simular interacciones complejas (form submits, login con 2FA, tests E2E).

---

## Caso de uso estrella: RAG dataset en 15 minutos vs 3 dias

### Antes (stack tradicional)

- Dia 1: escribir scraper con Playwright, manejar cookies, lidiar con Cloudflare.
- Dia 2: parser HTML->markdown, limpieza de nav/ads, normalizacion.
- Dia 3: pipeline de chunking, embeddings, vector store, QA.

### Ahora (con Firecrawl CLI)

```bash
# 1. Scrape completo (5 min)
firecrawl crawl https://docs.miempresa.com \
  --limit 1000 --format markdown --output ./kb/

# 2. Chunkear + embeddings (8 min)
firecrawl pipeline ./kb/ \
  --chunk-size 1000 \
  --embed-model text-embedding-3-large \
  --vector-store pinecone://my-rag-index

# 3. Query de prueba (1 min)
firecrawl rag query "como configuro el SSO?" \
  --index pinecone://my-rag-index \
  --model claude-opus-4
```

Resultado: knowledge base indexada, chunkeada y consultable desde Claude en **menos tiempo del que tardas en configurar Playwright**.

---

## Tips para llevarlo a produccion

### Rate limits

```bash
# Respetar el sitio target
firecrawl crawl URL --rate-limit 30 --concurrency 4 --delay 500ms

# Usar proxy pool si scrapeas a escala
firecrawl crawl URL --proxy-pool residential --sticky-session 10m
```

### Paralelizacion inteligente

```bash
# Split por seccion, correr en paralelo
firecrawl crawl URL/blog/**  --output ./blog/  &
firecrawl crawl URL/docs/**  --output ./docs/  &
firecrawl crawl URL/api/**   --output ./api/   &
wait
```

### Extraccion con schemas (structured output)

```bash
# Definir schema una vez, reusarlo en cualquier crawl
firecrawl scrape URL \
  --extract-schema ./schemas/product.json \
  --extract-mode strict     # falla si el schema no se llena
```

```json
// product.json
{
  "type": "object",
  "properties": {
    "name":   { "type": "string" },
    "price":  { "type": "number" },
    "sku":    { "type": "string" },
    "stock":  { "type": "integer" },
    "images": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["name", "price"]
}
```

### Resume/reintentos

```bash
# Los crawls largos guardan checkpoint; si se corta, retomar:
firecrawl crawl URL --resume ./datasets/anthropic-docs/_checkpoint.json
```

### Cache local

```bash
firecrawl scrape URL --cache 24h     # no re-scrapea si ya tiene copia fresca
firecrawl cache clear
```

---

## Para el video (copiar/pegar en demo)

```bash
# Setup
npx -y firecrawl-cli@latest init --all --browser
firecrawl login

# Demo 1: un scrape limpio
firecrawl scrape https://www.anthropic.com/news/claude-opus-4 \
  --format markdown --output demo1.md

# Demo 2: crawl de docs
firecrawl crawl https://docs.anthropic.com \
  --limit 50 --format markdown --output ./docs-dataset/

# Demo 3: leads estructurados
firecrawl crawl https://directorio-empresas.example.com/rubro/software \
  --limit 20 --extract-schema ./schemas/lead.json \
  --format json --output ./leads/
firecrawl merge ./leads/*.json --output leads.csv --format csv

# Guinda: RAG en 15 minutos
firecrawl pipeline ./docs-dataset/ \
  --chunk-size 1000 \
  --embed-model text-embedding-3-large \
  --vector-store pinecone://demo-index
firecrawl rag query "cual es el context window de opus 4?" \
  --index pinecone://demo-index --model claude-opus-4
```

### Frase final del video

> "Tres dias de ingenieria, resueltos con tres comandos. Firecrawl CLI: la web entera, lista para tu LLM."
