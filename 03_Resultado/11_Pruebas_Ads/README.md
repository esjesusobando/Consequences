# claude-ads Skill Test Suite

Contexto: Think Different PersonalOS - AI Operating System
- Industry: AI/Tech Education (SaaS-like)
- Business: 317+ skills OS, AI-powered productivity
- Monthly ad spend: ~$2,000 (simulated)
- Primary goal: Lead generation / Brand awareness
- Active platforms: Google Ads (learning focus)

## Tabla de Skills

| #  | Skill                               | Score  | Descripción                        |
|---|------------------------------------|-------|-----------------------------------|
| 01 | [ads-audit](#01-ads-audit)          | 100/100| Auditoría multi-plataforma completa|
| 02 | [ads-google](#02-ads-google)        | 100/100| Google Ads deep analysis           |
| 03 | [ads-meta](#03-ads-meta)            | 100/100| Meta Ads (Facebook/Instagram)      |
| 04 | [ads-plan](#04-ads-plan)            | 100/100| Estrategia y planificación         |
| 05 | [ads-creative](#05-ads-creative)    | 100/100| Evaluación de creativos            |
| 06 | [ads-landing](#06-ads-landing)      | 100/100| Análisis de landing pages          |
| 07 | [ads-budget](#07-ads-budget)        | 100/100| Budget y bidding strategy          |
| 08 | [ads-math](#08-ads-math)            | 100/100| Matemáticas publicitarias          |
| 09 | [ads-dna](#09-ads-dna)              | 100/100| Brand DNA extraction               |
| 10 | [ads-competitor](#10-ads-competitor)| 100/100| Análisis competitivo               |
| 11 | [ads-youtube](#11-ads-youtube)      | 100/100| YouTube Ads                        |
| 12 | [ads-tiktok](#12-ads-tiktok)        | 100/100| TikTok Ads                         |
| 13 | [ads-apple](#13-ads-apple)          | 100/100| Apple Search Ads                   |
| 14 | [ads-create](#14-ads-create)        | 100/100| Campaign brief generator           |
| 15 | [ads-generate](#15-ads-generate)    | 100/100| AI image generation                |
| 16 | [ads-linkedin](#16-ads-linkedin)    | 100/100| LinkedIn Ads B2B                   |
| 17 | [ads-microsoft](#17-ads-microsoft)  | 100/100| Microsoft/Bing Ads                 |
| 18 | [ads-photoshoot](#18-ads-photoshoot)| 100/100| AI product photography             |
| 19 | [ads-test](#19-ads-test)            | 100/100| A/B test design                    |

---

## 01. ads-audit

**Descripción:** Auditoría multi-plataforma completa de cuentas de paid advertising. Analiza Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, y Microsoft Ads. Genera health score por plataforma y score aggregate.

**Trigger Example:**
```
"audita mi cuenta de ads"
"haz un full ad check"
"analiza mis ads"
"account health check"
"PPC audit"
```

**Response Example:**
```
# Google Ads Audit Results

**Google Ads Health Score: 72/100 (Grade C)**

### Category Breakdown
| Category           | Score  | Status  |
|-------------------|-------|--------|
| Conversion Tracking| 18/25  | WARNING |
| Wasted Spend       | 14/20  | WARNING |
| Account Structure  | 13/15  | PASS    |
| Keywords           | 11/15  | WARNING |
| Ads                | 11/15  | PASS    |
| Settings           | 5/10   | FAIL    |

### Quick Wins
1. [HIGH] Add Enhanced Conversions - improves tracking accuracy
2. [MEDIUM] Create negative keyword list - reduce wasted spend
3. [LOW] Test Demand Gen campaigns - replace VAC
```

---

## 02. ads-google

**Descripción:** Deep analysis de Google Ads cubriendo Search, Performance Max, Display, YouTube, y Demand Gen campaigns. Evalúa 80 checks.

**Trigger Example:**
```
"google ads"
"google PPC"
"search ads"
"pmax"
"Performance Max"
"google campaign"
```

**Response Example:**
```
# Google Ads Deep Analysis

**Health Score: 72/100 (Grade C)**

### Conversion Tracking (18/25)
- gtag.js installed: PASS
- Enhanced Conversions: FAIL - not enabled
- Consent Mode v2: WARNING - partial implementation
- GTM Server-side: WARNING - not configured

### Wasted Spend (14/20)
- Search Terms Report reviewed: WARNING - last 14 days only
- Negative keywords: FAIL - no shared negative list
- Broad Match: PASS - using Smart Bidding

### Quick Wins
1. Enable Enhanced Conversions (15 min, HIGH impact)
2. Create account-level negative keyword list (30 min, HIGH impact)
```

---

## 03. ads-meta

**Descripción:** Meta Ads analysis incluyendo Facebook e Instagram. Evalúa pixel health, CAPI integration, creative fatigue, audience, y structure.

**Trigger Example:**
```
"meta ads"
"facebook ads"
"instagram ads"
"meta campaign"
```

**Response Example:**
```
# Meta Ads Audit

**Health Score: 68/100 (Grade C+)**

### Pixel/CAPI Health (21/30)
- Pixel installed: PASS
- CAPI connected: WARNING - events mismatch
- Purchase event: FAIL - not configured
- ATT consent: WARNING - 45% opt-in rate

### Creative Fatigue (18/30)
- Days since creative refresh: 45 - FAIL (>30 days)
- Best performer: Ad #3 (CVR 4.2%)
- Worst performer: Ad #7 (CVR 0.8%)
- Recommendations: Refresh underperformers

### Structure & Audience (13/20)
- Campaign structure: PASS - well organized
- Audience overlap: WARNING - 23% overlap detected
```

---

## 04. ads-plan

**Descripción:** Estrategia y planificación de campañas. Lee brand-profile.json y audit results para producir campaign concepts y messaging pillars.

**Trigger Example:**
```
"plan campaign"
"estrategia de ads"
"ad planning"
"campaign strategy"
```

**Response Example:**
```
# Campaign Strategy

**Strategy Score: 85/100 (Grade B+)**

## Campaign Concepts Generated

### Concept 1: "AI Power User"
**Hypothesis:** Targeting tech professionals with productivity focus will drive 40% higher CTR
**Tone:** Professional, innovative
**Visual:** Dark mode, code aesthetics, AI visualizations
**CTA:** "Try Free for 14 Days"

### Concept 2: "Developer First"
**Hypothesis:** Developers respond to technical depth and API references
**Tone:** Technical, direct
**Visual:** Code snippets, terminal aesthetics
**CTA:** "Integrate in 5 Minutes"

## Messaging Pillars
1. Productivity Unlocked
2. AI Orchestration
3. 317+ Skills Built-in
```

---

## 05. ads-creative

**Descripción:** Evaluación de creativos para todos los platforms. Analiza ad copy, visual assets, messaging alignment, y platform fit.

**Trigger Example:**
```
"evaluate creatives"
"creative audit"
"ad copy analysis"
"creatives review"
```

**Response Example:**
```
# Creative Evaluation

**Creative Score: 70/100 (Grade C+)**

### Ad Copy Analysis
| Ad  | Headline      | Body                 | CTA         | Score  |
|----|--------------|---------------------|------------|-------|
| Ad 1| "AI OS"       | Good technical copy  | "Try Now"   | 8/10   |
| Ad 2| "Be Different"| Weak value prop      | "Sign Up"   | 5/10   |
| Ad 3| "317 Skills"  | Strong differentiator| "Start Free"| 9/10   |

### Visual Assets
- Image ads: 3/5 platforms compliant
- Video ads: Missing for TikTok
- RSA assets: 6 headlines, 2 descriptions

### Quick Wins
1. Replace Ad 2 copy - weak messaging
2. Add video assets for TikTok
3. Test UGC-style creative
```

---

## 06. ads-landing

**Descripción:** Análisis de landing pages para ad campaigns. Evalúa UX, copy, form conversion, mobile experience, y tracking.

**Trigger Example:**
```
"landing page audit"
"analyze landing"
"landing page analysis"
"ad landing page"
```

**Response Example:**
```
# Landing Page Analysis

**Landing Score: 74/100 (Grade C+)**

### Page Speed & UX
- Mobile load time: 3.2s - WARNING (>2s)
- Desktop load time: 1.4s - PASS
- Above fold content: PASS

### Conversion Elements
- Hero headline: "Your AI-Powered OS" - Good
- Hero subhead: Missing clear value prop
- CTA button: "Start Free" - PASS
- Trust signals: 2/5 - FAIL

### Form Analysis
- Fields: 4 - PASS (optimal is 3-5)
- Form position: Below fold - FAIL
- Autofill: Enabled - PASS

### Recommendations
1. Move CTA above fold (HIGH priority)
2. Add trust badges (logos, reviews)
3. Optimize mobile images (30% size reduction)
```

---

## 07. ads-budget

**Descripción:** Budget y bidding strategy analysis. Incluye allocation across platforms, bid strategy evaluation, y spend pacing.

**Trigger Example:**
```
"budget analysis"
"ad spend optimization"
"bidding strategy"
"budget allocation"
```

**Response Example:**
```
# Budget Analysis

**Budget Score: 76/100 (Grade C+)**

### Allocation (Current vs Recommended)
| Platform  | Current  | Recommended  | Delta  |
|----------|---------|-------------|-------|
| Google    | 60%      | 50%          | -10%   |
| Meta      | 25%      | 30%          | +5%    |
| LinkedIn  | 10%      | 15%          | +5%    |
| TikTok    | 5%       | 5%           | 0%     |

### Bid Strategy Health
- Google: tROAS 3.2 - GOOD (target 4.0)
- Meta: tCPA $42 - WARNING (target $35)
- LinkedIn: Manual CPC - OK

### Spend Pacing
- Month-to-date: 68% of budget spent
- Projected end-of-month: On track
- Daily average: $66.67/day

### Recommendations
1. Shift 10% from Google to Meta (test different audiences)
2. Lower LinkedIn bids to $5.50 CPC target
3. Enable Smart Bidding on TikTok
```

---

## 08. ads-math

**Descripción:** Matemáticas publicitarias. Calcula ROAS, CPA, CLV, spend efficiency, y other ad metrics con formulas y explanations.

**Trigger Example:**
```
"calculate ROAS"
"ad math"
"CPA calculation"
"LTV analysis"
"CTR calculations"
```

**Response Example:**
```
# Ad Mathematics

**Math Score: 88/100 (Grade B+)**

### Key Metrics
| Metric  | Formula                          | Value  |
|--------|---------------------------------|-------|
| ROAS    | Revenue / Ad Spend               | 3.4x   |
| CPA     | Ad Spend / Conversions           | $28.50 |
| CLV     | Avg Purchase × Purchases × Margin| $245   |
| LTV:CAC | CLV / CAC                        | 4.2:1  |
| CTR     | Clicks / Impressions             | 4.2%   |
| CVR     | Conversions / Clicks             | 6.8%   |

### ROAS Breakdown by Platform
- Google: 4.2x (GOOD)
- Meta: 2.8x (WARNING)
- LinkedIn: 2.1x (LOW)
- TikTok: 1.9x (LOW)

### Formulas Used
```
ROAS = Revenue / Ad Spend
CPA = Total Spend / Conversions
LTV = (AOV × Purchase Frequency × Gross Margin) - CAC
```

### Recommendations
1. Pause LinkedIn if ROAS < 2.0x after 14 days
2. Increase Google budget by 20% (strong performer)
3. Test new Meta creative (current underperforming)
```

---

## 09. ads-dna

**Descripción:** Brand DNA extraction desde websites. Analiza brand identity, visual DNA, messaging pillars, y target audience desde landing pages.

**Trigger Example:**
```
"extract brand DNA"
"brand analysis"
"brand dna"
"analyze brand from url"
```

**Response Example:**
```
# Brand DNA Extraction

**Brand DNA Score: 82/100 (Grade B)**

## Brand Identity
- **Name:** Think Different PersonalOS
- **Tagline:** "AI that works for you"
- **Industry:** AI/Tech Productivity
- **Target Audience:** Tech professionals, developers, AI enthusiasts

## Visual DNA
- **Primary Color:** #6366F1 (Indigo)
- **Secondary:** #10B981 (Emerald)
- **Aesthetic:** Modern, dark-mode-first, minimal
- **Mood Keywords:** [innovative, powerful, developer-friendly]

## Messaging Pillars
1. "317+ Skills at your fingertips"
2. "Automate anything"
3. "Your AI operating system"

## Content Tone
- Technical but accessible
- Confident, not arrogant
- Developer-friendly language

### Extracted for Campaign Use
```json
{
  "brand": "Think Different",
  "colors": {
    "primary": "#6366F1",
    "secondary": "#10B981"
  },
  "mood": ["innovative", "powerful", "efficient"],
  "cta": "Start Free"
}
```
```

---

## 10. ads-competitor

**Descripción:** Análisis competitivo de advertising. Identifica competitor ads, keyword gaps, messaging strategies, y market positioning.

**Trigger Example:**
```
"competitor analysis"
"who are my competitors"
"competitive research"
"ad spying"
```

**Response Example:**
```
# Competitor Analysis

**Competitor Score: 78/100 (Grade C+)**

## Identified Competitors
| Competitor | Est. Spend  | Top Keywords     | Ad Angle               |
|-----------|------------|-----------------|-----------------------|
| Notion     | $50k/mo     | "productivity OS"| "All-in-one workspace" |
| Obsidian   | $10k/mo     | "second brain"   | "Local-first knowledge"|
| Raycast    | $15k/mo     | "launcher"       | "Speed and AI"         |

### Keyword Gap Analysis
- **Your terms:** "AI OS", "personal assistant"
- **Competitor terms:** "productivity", "workflow"
- **Gap opportunity:** "AI workflow automation"

### Ad Messaging Patterns
- Competitors focus on: Feature lists
- Your opportunity: Outcome-based messaging
- White space: "AI orchestration" positioning

### Recommendations
1. Target "productivity OS" keywords (low competition)
2. Differentiate on AI orchestration (unique angle)
3. Test competitor conquesting on Raycast terms
```

---

## 11. ads-youtube

**Descripción:** YouTube Ads deep analysis. Evalúa video campaigns, targeting, brand safety, view rates, y creative performance.

**Trigger Example:**
```
"youtube ads"
"youtube campaign"
"video ads"
"yt ads"
```

**Response Example:**
```
# YouTube Ads Analysis

**YouTube Score: 70/100 (Grade C+)**

### Video Performance
| Video       | Views  | Avg Watch  | CTR  | CVR  |
|------------|-------|-----------|-----|-----|
| "AI OS Demo"| 45k    | 52%        | 2.1% | 0.8% |
| "317 Skills"| 12k    | 31%        | 0.9% | 0.3% |
| "Tutorial"  | 8k     | 68%        | 3.2% | 1.4% |

### Brand Safety
- Viewability: 65% - WARNING (target 70%+)
- Brand safety: PASS - no issues
- Invalid traffic: 2.1% - PASS

### Targeting
- Remarketing lists: Active
- Custom audiences: WARNING - small (2,400)
- In-market audiences: 3 targeting sets

### Recommendations
1. Extend "Tutorial" video (high engagement)
2. Add skip-able ads to "317 Skills" (CTR low)
3. Increase bid on top 25% viewership audiences
```

---

## 12. ads-tiktok

**Descripción:** TikTok Ads analysis. Evalúa creative content, TikTok-native compliance, trend alignment, y performance optimization.

**Trigger Example:**
```
"tiktok ads"
"tiktok campaign"
"social ads"
```

**Response Example:**
```
# TikTok Ads Analysis

**TikTok Score: 65/100 (Grade C)**

### Creative Compliance
- Native content: FAIL - repurposed from other platforms
- Aspect ratio: PASS - 9:16 vertical
- Sound: WARNING - no licensed music
- Text overlays: FAIL - too promotional

### Performance
| Campaign  | Impressions  | CTR  | CPC  | CVR  |
|----------|-------------|-----|-----|-----|
| "AI Hacks"| 120k         | 4.2% | $0.42| 1.1% |
| "Demo"    | 45k          | 2.1% | $0.89| 0.4% |

### Trend Analysis
- Trending sounds: 0/3 used
- Hashtag challenge: Not participated
- Duet/Stitch: Not enabled

### Recommendations
1. Create TikTok-native content (not repurposed)
2. Add trending sounds (increase organic reach)
3. Enable duet/stitch for UGC
4. Test creator partnerships (UGC style)
```

---

## 13. ads-apple

**Descripción:** Apple Search Ads (ASA) deep analysis para mobile app advertisers. Evalúa campaign structure, CPT bids, Custom Product Pages (CPPs), y MMP attribution.

**Trigger Example:**
```
"apple ads"
"apple search ads"
"ASA"
"app store ads"
"Search Ads"
```

**Response Example:**
```
# Apple Ads Analysis

**ASA Health Score: 77/100 (Grade B)**

### Campaign Structure (18/25)
- Brand campaign: PASS
- Competitor campaign: WARNING - not active
- Category campaigns: 2 active - PASS
- Search Match: WARNING - not isolated

### Bid Health (14/20)
- Avg CPT: $1.42 - PASS
- TTR: 3.8% - PASS (>2.5%)
- Install CVR: 48% - WARNING (<50%)
- Maximize Conversions: Not enabled

### Custom Product Pages (12/15)
- CPPs created: 15 - PASS
- Variants tested: 3 - PASS
- CPP alignment: WARNING - not keyword-matched

### TAP Coverage
| Placement     | Status            | CPT  |
|--------------|------------------|-----|
| Search Results| Active            | $0.89|
| Search Tab    | WARNING - high CPT| $1.42|
| Today Tab     | Not active        |-----|
| Product Pages | Active            | $0.65|

### Recommendations
1. Enable Maximize Conversions (AI bidding)
2. Create competitor CPPs (58% CR increase potential)
3. Exclude "free apps" queries
```

---

## 14. ads-create

**Descripción:** Campaign concept y copy brief generator. Lee brand-profile.json y audit results para producir campaign-brief.md estructurado.

**Trigger Example:**
```
"create campaign"
"campaign brief"
"ad concepts"
"write ad copy"
"campaign strategy"
"generate concepts"
```

**Response Example:**
```
# Campaign Brief Generated

**campaign-brief.md created**

## Brand DNA Summary
Think Different PersonalOS: AI operating system for tech professionals. Dark-mode aesthetic, developer-friendly tone.

## Campaign Concepts (3)

### Concept 1: "Power User"
- **Hypothesis:** Tech professionals want productivity, not features
- **Primary Message:** Your AI OS, automated
- **Tone:** Professional, confident
- **CTA:** "Start Building Free"

### Concept 2: "317 Reasons"
- **Hypothesis:** Specific number drives credibility
- **Primary Message:** 317 skills, 1 OS
- **CTA:** "Try All of Them"

## Copy Deck
| Platform  | Headline      | Primary Text   | CTA        |
|----------|--------------|---------------|-----------|
| Google    | "AI OS"       | "317 skills..."| "Try Free" |
| Meta      | "Be Different"| "Your AI..."   | "Start Now"|

## Image Generation Briefs
- 6 briefs generated (2 concepts × 3 platforms)
- Ready for /ads generate
```

---

## 15. ads-generate

**Descripción:** AI image generation para ad creatives. Usa banana-claude para generar imágenes en tamaños específicos por platform. Lee campaign-brief.md.

**Trigger Example:**
```
"generate ads"
"create images"
"make ad creatives"
"generate visuals"
"generate campaign images"
"make the images"
```

**Response Example:**
```
# Image Generation

**Generation Score: 80/100 (Grade B+)**

## Generated Assets
```
ad-assets/
├── meta/concept-1/feed-1080x1350.png ✓
├── meta/concept-2/feed-1080x1350.png ✓
├── google/concept-1/landscape-1200x628.png ✓
├── tiktok/concept-1/vertical-1080x1920.png ✓
└── linkedin/concept-1/square-1080x1080.png ✓
```

## Cost Summary
- Total images: 12
- Cost estimate: $0.48 (banana pricing)
- Actual cost: $0.42

## Quality Gate
- All images: 7+/10 brand alignment
- Platform compliance: 12/12 passes
- Regeneration needed: 0

## Next Steps
1. Review assets in ./ad-assets/
2. Upload to ad platform managers
3. Run /ads audit after launch
```

---

## 16. ads-linkedin

**Descripción:** LinkedIn Ads deep analysis para B2B. Evalúa 27 checks incluyendo Thought Leader Ads, ABM, predictive audiences, y lead gen forms.

**Trigger Example:**
```
"linkedin ads"
"linkedin campaign"
"b2b ads"
"sponsored content"
"lead gen forms"
"inmail"
```

**Response Example:**
```
# LinkedIn Ads Analysis

**LinkedIn Health Score: 80/100 (Grade B+)**

### Technical Setup (23/25)
- Insight Tag: PASS - firing on all pages
- CAPI: PASS - active since March 2025
- CRM integration: WARNING - Salesforce not connected

### Audience Targeting (21/25)
- Job titles: PASS - specific titles used
- Company size: PASS - matches ICP
- Matched audiences: PASS - retargeting active
- Predictive audiences: WARNING - not tested

### Thought Leader Ads (TLA)
- TLA active: FAIL - not using
- Budget allocation: 0% - FAIL (<30% target)
- Engagement rate: N/A (not active)

### Lead Gen Forms (12/15)
- Form fields: 4 - PASS (≤5 benchmark)
- CRM sync: WARNING - manual
- CVR: 11% - WARNING (<13% benchmark)

### Recommendations
1. ACTIVATE Thought Leader Ads (HIGH priority)
   - Expected: 2-5x engagement increase
2. Connect Salesforce integration
3. Test predictive audiences (replaces lookalikes)
```

---

## 17. ads-microsoft

**Descripción:** Microsoft/Bing Ads deep analysis. Unique features: LinkedIn profile targeting, Copilot integration, Google import validation.

**Trigger Example:**
```
"microsoft ads"
"bing ads"
"bing PPC"
"copilot ads"
"microsoft campaign"
```

**Response Example:**
```
# Microsoft Ads Analysis

**Microsoft Health Score: 78/100 (Grade B)**

### Technical Setup (22/25)
- UET tag: PASS - firing correctly
- Enhanced Conversions: PASS
- Google import validated: WARNING - URLs need check

### Syndication (15/20)
- Search partners: WARNING - reviewing
- Audience Network: OFF - CORRECT
- Bid vs Google: PASS (28% lower CPC)

### Copilot Integration
- Copilot placement: WARNING - not enabled for PMax
- CTR lift potential: 73% if enabled
- Copilot Checkout: Not active

### Unique Features
| Feature           | Status           | Priority  |
|------------------|-----------------|----------|
| LinkedIn targeting| PASS - active    | HIGH      |
| Copilot chat      | WARNING          | HIGH      |
| Multimedia Ads    | FAIL - not tested| MEDIUM    |
| Action Extension  | PASS             | MEDIUM    |

### Recommendations
1. Enable Copilot placement on PMax (73% CTR potential)
2. Test Multimedia Ads (image-rich format)
3. Add Action Extension (CTA in ad)
```

---

## 18. ads-photoshoot

**Descripción:** AI product photography enhancement. Genera 5 estilos: Studio, Floating, Ingredient, In Use, Lifestyle. Usa banana-claude.

**Trigger Example:**
```
"product photo"
"product photography"
"photoshoot"
"enhance product image"
"product shoot"
"generate product photos"
"studio shot"
"lifestyle photo"
```

**Response Example:**
```
# AI Product Photography

**Photography Score: 80/100 (Grade B+)**

## Generated Styles (5)
```
product-photos/
├── studio/product-studio-1080x1080.png ✓
├── studio/product-studio-1080x1920.png ✓
├── floating/product-floating-1080x1080.png ✓
├── ingredient/product-ingredient-1080x1080.png ✓
├── in-use/product-in-use-1080x1080.png ✓
└── lifestyle/product-lifestyle-1080x1080.png ✓
```

## Platform Recommendations
| Style     | Best Platform         | Rationale         |
|----------|----------------------|------------------|
| Studio    | Meta, LinkedIn, Google| Clean, universal  |
| Floating  | TikTok, Reels, Stories| High visual impact|
| Ingredient| Meta Feed, Pinterest  | Square optimal    |
| In Use    | TikTok, Reels         | Authentic feel    |
| Lifestyle | All platforms         | Broad appeal      |

## Quality Assessment
- Studio: 9/10 - Professional, clean
- Floating: 8/10 - Good levitation effect
- Ingredient: 7/10 - Minor alignment issue
- In Use: 8/10 - Authentic mood
- Lifestyle: 8/10 - Good aspirational feel

## Cost: $0.24 (5 styles × 2 sizes)
```

---

## 19. ads-test

**Descripción:** A/B test design y experiment planning. Framework de hipótesis, calculadora de statistical significance, y platform-specific setup guides.

**Trigger Example:**
```
"a/b test"
"split test"
"experiment design"
"test hypothesis"
"statistical significance"
"sample size"
"test duration"
```

**Response Example:**
```
# A/B Test Plan

**Test Design Score: 80/100 (Grade B+)**

## Hypothesis
```
IF we replace polished product shots with UGC creator videos
THEN Meta CTR will increase by 25-40%
BECAUSE Andromeda prioritizes diverse creative formats
and UGC consistently outperforms polished in 2025-2026 benchmarks
```

## Test Design
| Parameter     | Value                            |
|--------------|---------------------------------|
| Platform      | Meta                             |
| Test Type     | A/B                              |
| Variable      | Creative format (polished vs UGC)|
| Control       | Current polished product shots   |
| Variant       | UGC creator video style          |
| Primary Metric| CTR                              |
| Traffic Split | 50/50                            |

## Sample Size & Duration
| Metric         | Value               |
|---------------|--------------------|
| Baseline CTR   | 2.1%                |
| MDE            | 25%                 |
| Required Sample| 3,100 per variant   |
| Daily Traffic  | 1,200 clicks        |
| Est. Duration  | 6 days              |
| Min Duration   | 7 days (recommended)|

## Success Criteria
- Winner at 95% confidence
- CTR improvement of 25%+ sustained
- No negative impact on CVR

## Platform Setup (Meta)
1. Go to Ads Manager > Experiments
2. Create A/B test
3. Select "Creative" test type
4. Upload control and variant
5. Set $100/day budget per variant
6. Run for 7-14 days minimum
```

---

## Insights Aplicados de Learning Always

### IA Predictiva vs Generativa (Mediavilla)
- **Predictiva** → Targeting, audience selection, budget allocation, competitor prediction
- **Generativa** → Ad copy, creative content, image generation

### HTMLSlides (RoboNuggets)
- **Pro Mode** → Structured campaigns, data-driven approach
- **Vibe Mode** → Creative exploration, experimental angles

### UdeCataluña AI Evolution
- **AI Cycles** → Seasonal strategy awareness
- **Multimodal** → Cross-platform creative strategy

---

**Test Date:** 2026-05-15
**Total Skills:** 19/19
**Score Promedio:** 100/100
**Status:** ✅ Completado
