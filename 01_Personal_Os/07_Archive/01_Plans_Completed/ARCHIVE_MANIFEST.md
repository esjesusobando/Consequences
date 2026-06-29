> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# 📦 ARCHIVE MANIFEST — Fusión de Skills 2026-05-29

> **De 385 skills → 20 mega-skills**
> Cada skill listada aquí será leída, su valor inyectado en la mega-skill correspondiente, y luego movida a `01_Personal_Os/01_Core/02_Tools/02_Skills/Archive_Delete_Skills/` con numeración secuencial.

---

## ✅ NO SE TOCAN

| Área                       | Skills  | Razón                     |
|---------------------------|--------|--------------------------|
| **00_Agent_Teams_Lite**    | 13      | Ecosistema Angel Team Life|
| **00_Compound_Engineering**| 63      | Ecosistema Gentleman      |
| **00_Personal_Os**         | 32      | Decisión del usuario      |
| **00_Skill_Auditor**       | 1       | Sistema                   |
| **00_System_Core**         | 1       | Sistema                   |
| **00_Workflows** (sdd-*)   | ~10     | SDD agent tasks           |
| **10_Laia_Learning**       | 1       | Laia                      |
| **TOTAL**                  | **~121**|                           |

---

## 📦 CLUSTER ADS → `05_Paid_Ads`

| #  | Directorio actual                         | name          | Valor único                                        |
|---|------------------------------------------|--------------|---------------------------------------------------|
| 1  | 05_Claude_Ads/01_Ads/                     | ads           | Orquestador principal, scoring 250+ checks, routing|
| 2  | 05_Claude_Ads/05_Skills/01_Ads_Apple/     | ads-apple     | Apple Search Ads: CPPs, TAP, MMP attribution       |
| 3  | 05_Claude_Ads/05_Skills/02_Ads_Audit/     | ads-audit     | Full multi-platform audit orchestration            |
| 4  | 05_Claude_Ads/05_Skills/03_Ads_Budget/    | ads-budget    | 70/20/10, 3x Kill Rule, 20% scaling                |
| 5  | 05_Claude_Ads/05_Skills/04_Ads_Competitor/| ads-competitor| Competitor intel, estimated spend                  |
| 6  | 05_Claude_Ads/05_Skills/05_Ads_Create/    | ads-create    | Campaign brief from brand-profile.json             |
| 7  | 05_Claude_Ads/05_Skills/06_Ads_Creative/  | ads-creative  | Creative fatigue, format diversity                 |
| 8  | 05_Claude_Ads/05_Skills/07_Ads_Dna/       | ads-dna       | Brand DNA extraction from URL                      |
| 9  | 05_Claude_Ads/05_Skills/08_Ads_Generate/  | ads-generate  | AI image generation for ads                        |
| 10 | 05_Claude_Ads/05_Skills/09_Ads_Google/    | ads-google    | 80 checks: Search, PMax, Display, YouTube          |
| 11 | 05_Claude_Ads/05_Skills/10_Ads_Landing/   | ads-landing   | Landing page quality assessment                    |
| 12 | 05_Claude_Ads/05_Skills/11_Ads_Linkedin/  | ads-linkedin  | 27 checks: Thought Leader, ABM, predictive         |
| 13 | 05_Claude_Ads/05_Skills/12_Ads_Math/      | ads-math      | PPC calculator CPA/ROAS (zero-dependency)          |
| 14 | 05_Claude_Ads/05_Skills/13_Ads_Meta/      | ads-meta      | 50 checks: Pixel/CAPI, Advantage+, fatigue         |
| 15 | 05_Claude_Ads/05_Skills/14_Ads_Microsoft/ | ads-microsoft | 24 checks: Copilot, import validation              |
| 16 | 05_Claude_Ads/05_Skills/15_Ads_Photoshoot/| ads-photoshoot| 5 product photography styles                       |
| 17 | 05_Claude_Ads/05_Skills/16_Ads_Plan/      | ads-plan      | Industry templates, platform selection             |
| 18 | 05_Claude_Ads/05_Skills/17_Ads_Test/      | ads-test      | A/B test design, significance, sample size         |
| 19 | 05_Claude_Ads/05_Skills/18_Ads_Tiktok/    | ads-tiktok    | 28 checks: Creative-first, Smart+, Shop            |
| 20 | 05_Claude_Ads/05_Skills/19_Ads_Youtube/   | ads-youtube   | VAC→Demand Gen, Shorts, CTV                        |
| 21 | 05_Claude_Ads/SKILL.md                    | (area index)  | Área de skills                                     |

---

## 📦 CLUSTER CONTENIDO → 3 mega-skills

### → `01_Content_Engine` (brand, copy, social, email, video scripts)

| #  | Directorio                                             | name                     | Valor                        |
|---|-------------------------------------------------------|-------------------------|-----------------------------|
| 1  | 01_Creacion_Contenidos/01_Brand_Voice/                 | brand-voice-guardian     | Tone of voice enforcement    |
| 2  | 01_Creacion_Contenidos/imported/...brand-voice-guardian| brand-voice-guardian     | **DUPLICADO**                |
| 3  | 01_Creacion_Contenidos/02_Content_Ideation/            | content-ideation         | Topic extraction, pain points|
| 4  | 01_Creacion_Contenidos/imported/...content-ideation    | content-ideation         | **DUPLICADO**                |
| 5  | 01_Creacion_Contenidos/03_Content_Transformer/         | content-transformer      | Multi-channel repurposing    |
| 6  | 01_Creacion_Contenidos/04_Offer_And_Bio_Writer/        | offer-and-bio-writer     | Bio, LP, DM scripts          |
| 7  | 01_Creacion_Contenidos/imported/...offer-and-bio-writer| offer-and-bio-writer     | **DUPLICADO**                |
| 8  | 01_Creacion_Contenidos/05_Youtube_Script_Writer/       | youtube-script-writer    | Retention hooks, timestamps  |
| 9  | 01_Creacion_Contenidos/06_Youtube_Title_Generator/     | youtube-title-generator  | CTR scoring, A/B variants    |
| 10 | 01_Creacion_Contenidos/07_Youtube_Full_Video/          | youtube-full-video-epic  | Full YouTube pipeline        |
| 11 | 01_Creacion_Contenidos/content-strategy/               | content-strategy         | Content strategy framework   |
| 12 | 01_Creacion_Contenidos/copy-editing/                   | copy-editing             | Copy editing rules           |
| 13 | 01_Creacion_Contenidos/copywriting/                    | copywriting              | Copywriting patterns         |
| 14 | 01_Creacion_Contenidos/email-sequence/                 | email-sequence           | Email sequence design        |
| 15 | 01_Creacion_Contenidos/launch-strategy/                | launch-strategy          | Campaign launch framework    |
| 16 | 01_Creacion_Contenidos/marketing-ideas/                | marketing-ideas          | Topic generation             |
| 17 | 01_Creacion_Contenidos/marketing-psychology/           | marketing-psychology     | Psychological triggers       |
| 18 | 01_Creacion_Contenidos/product-marketing-context/      | product-marketing-context| Product positioning          |
| 19 | 01_Creacion_Contenidos/social-content/                 | social-content           | Social media creation        |

### → `02_SEO_Analytics` (SEO, analytics, testing, tools)

| #  | Directorio                                     | name                   | Valor                         |
|---|-----------------------------------------------|-----------------------|------------------------------|
| 20 | 01_Creacion_Contenidos/08_Seo_Sota_Master/     | seo-sota-master        | Elite SEO: technical + content|
| 21 | 01_Creacion_Contenidos/ab-test-setup/          | ab-test-setup          | A/B test planning             |
| 22 | 01_Creacion_Contenidos/analytics-tracking/     | analytics-tracking     | GA4, GTM, tracking            |
| 23 | 01_Creacion_Contenidos/competitor-alternatives/| competitor-alternatives| Vs pages for SEO              |
| 24 | 01_Creacion_Contenidos/free-tool-strategy/     | free-tool-strategy     | Marketing tool strategy       |
| 25 | 01_Creacion_Contenidos/programmatic-seo/       | programmatic-seo       | SEO at scale                  |
| 26 | 01_Creacion_Contenidos/referral-program/       | referral-program       | Referral design               |
| 27 | 01_Creacion_Contenidos/schema-markup/          | schema-markup          | JSON-LD structured data       |
| 28 | 01_Creacion_Contenidos/seo-audit/              | seo-audit              | Technical SEO audit           |
| 29 | 01_Creacion_Contenidos/14_Marketing_Tech/      | marketing-tech         | MarTech index                 |
| 30 | 01_Creacion_Contenidos/15_Marketing_Scripts/   | marketing-scripts      | Automation scripts            |

### → `03_Marketing_Strategy` (CRO, pricing, agents, strategy)

| #  | Directorio                                        | name                      | Valor                       |
|---|--------------------------------------------------|--------------------------|----------------------------|
| 31 | 01_Creacion_Contenidos/13_Marketing_Strategy/     | marketing-strategy        | Strategic planning          |
| 32 | 01_Creacion_Contenidos/form-cro/                  | form-cro                  | Form conversion optimization|
| 33 | 01_Creacion_Contenidos/onboarding-cro/            | onboarding-cro            | User onboarding             |
| 34 | 01_Creacion_Contenidos/page-cro/                  | page-cro                  | Landing page CRO            |
| 35 | 01_Creacion_Contenidos/paywall-upgrade-cro/       | paywall-upgrade-cro       | Paywall conversion          |
| 36 | 01_Creacion_Contenidos/popup-cro/                 | popup-cro                 | Popup optimization          |
| 37 | 01_Creacion_Contenidos/pricing-strategy/          | pricing-strategy          | Pricing models              |
| 38 | 01_Creacion_Contenidos/signup-flow-cro/           | signup-flow-cro           | Signup optimization         |
| 39 | 01_Creacion_Contenidos/01_Agent_Onboarding/       | onboarding-agent-employee | AI agent setup              |
| 40 | 01_Creacion_Contenidos/02_Executive_Assistant/    | executive-assistant-ai    | AI exec assistant           |
| 41 | 01_Creacion_Contenidos/03_Head_Of_Marketing/      | head-of-marketing-director| CMO strategy agent          |
| 42 | 01_Creacion_Contenidos/11_Ai_Agents/              | ai-agents-marketing       | Marketing AI index          |
| 43 | 01_Creacion_Contenidos/12_Compound_Engine/        | compound-engine           | Compounding philosophy      |
| 44 | 01_Creacion_Contenidos/09_Remotion_Video_Creator/ | remotion-best-practices   | → Video                     |
| 45 | 01_Creacion_Contenidos/10_Remotion_Best_Practices/| remotion-best-practices   | **DUPLICADO** → Video       |
| 46 | 01_Creacion_Contenidos/paid-ads/                  | paid-ads                  | **DUPLICADO** → Ads         |
| 47 | 01_Creacion_Contenidos/01_Creacion_Contenidos/    | creacion-contenidos       | Area index                  |

---

## 📦 CLUSTER DISEÑO → 3 mega-skills

### → `06_Design_System` (tokens, brand, components)

| #  | Directorio                               | name                  | Valor                           |
|---|-----------------------------------------|----------------------|--------------------------------|
| 1  | 02_Diseno_Ui_Ux/10_Design_Systems/       | design-systems        | Atomic design, tokens, Storybook|
| 2  | 02_Diseno_Ui_Ux/12_Shadcn/               | shadcn                | shadcn/ui component registry    |
| 3  | 02_Diseno_Ui_Ux/07_Brand_Identity/       | brand-identity        | Brand guidelines                |
| 4  | 02_Diseno_Ui_Ux/08_Brand_Voice_Generator/| brand-voice-generator | Tone of voice system            |
| 5  | 02_Diseno_Ui_Ux/10_Visual_Language/      | engram-visual-language| Visual language                 |
| 6  | 02_Diseno_Ui_Ux/04_Directrices_Marca/    | brand-guidelines      | Anthropic brand                 |

### → `07_UI_Prototyping` (mockups, diagrams, HTML, premium assets)

| #  | Directorio                                          | name                  | Valor                         |
|---|----------------------------------------------------|----------------------|------------------------------|
| 7  | 02_Diseno_Ui_Ux/08_Huashu_Design/                   | huashu-design         | HTML prototypes, animations   |
| 8  | 02_Diseno_Ui_Ux/09_Canvas_Diagram_Studio/           | canvas-diagram-studio | Excalidraw diagrams           |
| 9  | 02_Diseno_Ui_Ux/11_Pencil_Design_Studio/            | (sin name)            | Design sketching              |
| 10 | 02_Diseno_Ui_Ux/05_Excalidraw_Flowchart/            | excalidraw-diagram    | JSON diagram modeling         |
| 11 | 02_Diseno_Ui_Ux/06_Design_Sota/                     | design-sota           | Stripe/Linear/Vercel aesthetic|
| 12 | 02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/                   | ui-ux-pro-max         | UI/UX intelligence DB         |
| 13 | 02_Diseno_Ui_Ux/09_Dumbledor_Design/                | dumbledor-design      | Editorial high-impact         |
| 14 | 02_Diseno_Ui_Ux/12_Premium_Image_Studio/            | premium-image-studio  | Image asset creation          |
| 15 | 02_Diseno_Ui_Ux/13_Carousel_Master/                 | carousel-master       | IG/LinkedIn carousels         |
| 16 | 02_Diseno_Ui_Ux/14_Video_Visuals_Producer/          | video-visuals-producer| Video/PPTX production         |
| 17 | 02_Diseno_Ui_Ux/11_Marvel_Avengers/                 | marvel-avengers       | Multi-agent design            |
| 18 | 02_Diseno_Ui_Ux/04_Product_Design/                  | (area index)          | Product design index          |
| 19 | 02_Diseno_Ui_Ux/04_Product_Design/01_Product_Design/| (area index)          | Sub-index                     |

### → `08_UI_Engineering` (taste, minimalism, redesign, Dieter Rams)

| #  | Directorio                                    | name                      | Valor                   |
|---|----------------------------------------------|--------------------------|------------------------|
| 20 | 02_Diseno_Ui_Ux/01_Taste_Skill/               | design-taste-frontend     | Senior UI/UX engineering|
| 21 | 02_Diseno_Ui_Ux/1. TASTE SKILLS/              | design-taste-frontend     | **DUPLICADO**           |
| 22 | 02_Diseno_Ui_Ux/02_Taste_Skills/              | design-taste-frontend     | **DUPLICADO**           |
| 23 | 02_Diseno_Ui_Ux/02_Soft_Skill/                | high-end-visual-design    | Awwwards-tier premium   |
| 24 | 02_Diseno_Ui_Ux/03_Minimalist_Skill/          | minimalist-ui             | Editorial monochrome    |
| 25 | 02_Diseno_Ui_Ux/2. DISEÑO MINIMALISTA/        | minimalist-ui             | **DUPLICADO**           |
| 26 | 02_Diseno_Ui_Ux/03_Diseno_Minimalista/        | minimalist-ui             | **DUPLICADO**           |
| 27 | 02_Diseno_Ui_Ux/04_Redesign_Skill/            | redesign-existing-projects| Generic → premium       |
| 28 | 02_Diseno_Ui_Ux/06_Dieter_Rams_Design/        | dieter-rams-design        | 10 principles audit     |
| 29 | 02_Diseno_Ui_Ux/15_Youtube_Thumbnail_Prompter/| youtube-thumbnail-prompter| → Video Production      |
| 30 | 02_Diseno_Ui_Ux/16_Video_Prompt_Builder/      | video-prompt-builder      | → Video Production      |
| 31 | 02_Diseno_Ui_Ux/05_Output_Skill/              | full-output-enforcement   | → System Master         |
| 32 | 02_Diseno_Ui_Ux/02_Diseno_Ui_Ux/              | (area index)              | Area index              |

---

## 📦 CLUSTER VIDEO → `04_Video_Production`

| #  | Directorio                                | name                   | Valor                              |
|---|------------------------------------------|-----------------------|-----------------------------------|
| 1  | 03_Video_Media/19_Video_Intel/            | video-intel            | YouTube/GitHub knowledge extraction|
| 2  | 03_Video_Media/01_Video_Prompt_Builder/   | video-prompt-builder   | Seedance shot-by-shot prompts      |
| 3  | 03_Video_Media/02_Remotion_Browser_Search/| remotion-browser-search| Browser typing animation sequence  |
| 4  | 03_Video_Media/03_Remotion_Cards_Showcase/| remotion-cards-showcase| Cards animation with LogoBurst     |
| 5  | 03_Video_Media/04_Remotion_Audio_Engine/  | remotion-audio-engine  | Audio timing, SFX, BGM             |
| 6  | 03_Video_Media/02_James_Cameron/          | james-cameron-video    | Video production index             |
| 7  | 03_Video_Media/03_Video_Media/            | video-media            | Area index                         |

---

## 📦 CLUSTER AUTOMATIZACION → 3 mega-skills

### → `09_N8N_Master`

| #   | Directorio                           | name                  | Valor                 |
|----|-------------------------------------|----------------------|----------------------|
| 1   | 04_Automatizacion/01_N8N_JS/         | n8n-code-javascript   | JS in Code nodes      |
| 2   | 04_Automatizacion/02_N8N_Python/     | n8n-code-python       | Python in Code nodes  |
| 3   | 04_Automatizacion/03_N8N_Expressions/| n8n-expression-syntax | {{}} expression syntax|
| 4   | 04_Automatizacion/04_N8N_MCP/        | n8n-mcp-tools-expert  | MCP tools usage       |
| 5   | 04_Automatizacion/05_N8N_Nodes/      | n8n-node-configuration| Node config patterns  |
| 6   | 04_Automatizacion/06_N8N_Validation/ | n8n-validation-expert | Error interpretation  |
| 7   | 04_Automatizacion/07_N8N_Workflows/  | n8n-workflow-patterns | Architecture patterns |
| 8-14| Duplicados n8n-*                     | (copias)              | **DUPLICADOS**        |
| 15  | 04_Automatizacion/14_N8n/            | n8n-automation        | Area index            |

### → `10_Cloud_Tools` (GWS, Obsidian, Firecrawl, URLs)

| #  | Directorio                              | name              | Valor                 |
|---|----------------------------------------|------------------|----------------------|
| 16 | 04_Automatizacion/10_GWS_Client/        | gws-cli           | Google Workspace CLI  |
| 17 | 04_Automatizacion/11_Gws_Client/        | gws-cli           | **DUPLICADO**         |
| 18 | 04_Automatizacion/13_Content_From_Url/  | content-from-url  | URL content extraction|
| 19 | 04_Automatizacion/14_Compound_Knowledge/| compound-knowledge| Knowledge network     |
| 20 | 04_Automatizacion/08_AI_News_Weekly/    | ai-news-weekly    | AI news briefing      |

### → `11_Learning_Engine`

| #  | Directorio                                     | name                     | Valor                   |
|---|-----------------------------------------------|-------------------------|------------------------|
| 21 | 04_Automatizacion/15_Os_Self_Improvement/      | os-self-improvement      | OS improvement detection|
| 22 | 04_Automatizacion/16_Reverse_Engineering/      | reverse-engineering      | Pattern extraction      |
| 23 | 04_Automatizacion/17_Learning_Url_To_Knowledge/| learning-url-to-knowledge| URL→8 deliverables      |
| 24 | 04_Automatizacion/04_Automatizacion/           | automatizacion           | Area index              |

---

## 📦 CLUSTER TOOLS → 6 mega-skills

### → `12_Frontend_Stack` (React, Next, Angular, TS, CSS)

| #  | Directorio                              | name                       | Valor                 |
|---|----------------------------------------|---------------------------|----------------------|
| 1  | 06_Tools/01_React_19/                   | react-19                   | React 19 + Compiler   |
| 2  | 06_Tools/02_Nextjs_15/                  | nextjs-15                  | Next.js App Router    |
| 3  | 06_Tools/03_Tailwind_4/                 | tailwind-4                 | Tailwind CSS 4        |
| 4  | 06_Tools/05_Typescript/                 | typescript                 | TS strict patterns    |
| 5  | 06_Tools/06_Zustand_5/                  | zustand-5                  | Zustand state         |
| 6  | 06_Tools/07_Zod_4/                      | zod-4                      | Zod validation        |
| 7  | 06_Tools/08_Ai_Sdk_5/                   | ai-sdk-5                   | Vercel AI SDK         |
| 8  | 06_Tools/architecture/                  | angular-architecture       | Angular architecture  |
| 9  | 06_Tools/core/                          | angular-core               | Angular core          |
| 10 | 06_Tools/forms/                         | angular-forms              | Angular forms         |
| 11 | 06_Tools/performance/                   | angular-performance        | Angular perf          |
| 12 | 06_Tools/08_Vercel_React_Best_Practices/| vercel-react-best-practices| Vercel perf guidelines|

### → `13_Backend_Stack` (Django, Pytest, Payload, APIs)

| #  | Directorio                              | name                       | Valor             |
|---|----------------------------------------|---------------------------|------------------|
| 13 | 06_Tools/13_Django_Drf/                 | django-drf                 | Django REST       |
| 14 | 06_Tools/16_Pytest/                     | pytest                     | Pytest patterns   |
| 15 | 06_Tools/17_Playwright/                 | playwright                 | E2E testing       |
| 16 | 06_Tools/19_Payload_Cms/                | payload-cms-v3             | Payload CMS       |
| 17 | 06_Tools/20_Meilisearch/                | meilisearch                | Search engine     |
| 18 | 06_Tools/15_Server_Api/                 | engram-server-api          | API contracts     |
| 19 | 06_Tools/18_Firecrawl/                  | firecrawl                  | Web scraping      |
| 20 | 06_Tools/11_Invoice_Intelligence/       | invoice-intelligence       | OCR invoices      |
| 21 | 06_Tools/12_Health_Data_Analyst/        | health-data-analyst        | Health data       |
| 22 | 06_Tools/14_Silicon_Valley_Data_Analyst/| silicon-valley-data-analyst| Executive insights|

### → `14_DevOps_Pipeline`

| #  | Directorio                          | name                   | Valor           |
|---|------------------------------------|-----------------------|----------------|
| 23 | 06_Tools/01_Vercel_Deploy/          | Vercel Production      | Deploy          |
| 24 | 06_Tools/02_Supabase_Integration/   | (sin)                  | Supabase setup  |
| 25 | 06_Tools/03_MCP_Integration/        | (sin)                  | MCP integration |
| 26 | 06_Tools/04_Observability/          | observability-skill    | Metrics, logging|
| 27 | 06_Tools/10_E2b_Sandbox/            | e2b-sandbox            | Cloud execution |
| 28 | 06_Tools/11_Error_Handling_Patterns/| error-handling-patterns| Resilience      |
| 29 | 06_Tools/13_Release_Agent/          | release-agent          | Releases        |
| 30 | 06_Tools/09_Using_Git_Worktrees/    | using-git-worktrees    | Git worktrees   |

### → `15_Testing_Strategy` (TDD, debug, coverage, E2E, QA)

| #  | Directorio                             | name                          | Valor             |
|---|---------------------------------------|------------------------------|------------------|
| 31 | 06_Tools/01_Test_Driven_Development/   | test-driven-development       | Red-Green-Refactor|
| 32 | 06_Tools/02_Systematic_Debugging/      | systematic-debugging          | RCA methodology   |
| 33 | 06_Tools/03_Verify_And_Commit/         | verification-before-completion| Pre-completion QA |
| 34 | 06_Tools/05_Testing_Coverage/          | engram-testing-coverage       | TDD+coverage      |
| 35 | 06_Tools/06_Go_Testing/                | go-testing                    | Go+Bubbletea      |
| 36 | 06_Tools/07_Tui_Quality/               | engram-tui-quality            | TUI quality       |
| 37 | 06_Tools/08_E2e_Testing/               | e2e-testing-skill             | Playwright E2E    |
| 38 | 06_Tools/09_Integration_Testing/       | integration-testing-skill     | API+DB+mocks      |
| 39 | 06_Tools/10_Edge_Case/                 | edge-case-skill               | Boundary analysis |
| 40 | 06_Tools/11_Test_Coverage/             | test-coverage-skill           | Coverage metrics  |
| 41 | 06_Tools/12_Evaluation/                | evaluation-skill              | Agent evaluation  |
| 42 | 06_Tools/13_Skill_Testing_Automation/  | skill-testing-automation      | Skill validation  |
| 43 | 06_Tools/14_Commit_Hygiene/            | engram-commit-hygiene         | Commit standards  |
| 44 | 06_Tools/16_Docs_Alignment/            | engram-docs-alignment         | Doc alignment     |
| 45 | 06_Tools/01_Lighthouse_Core_Web_Vitals/| lighthouse-core-web-vitals    | Web Vitals        |
| 46 | 06_Tools/01_Accessibility_WCAG_Testing/| accessibility-wcag-testing    | WCAG 2.2          |
| 47 | 06_Tools/06_Testing/                   | testing-index                 | Testing index     |
| 48 | 06_Tools/17_Testing_Coverage/          | (sin)                         | Coverage meta     |
| 49 | 06_Tools/04_Test_Resource_Management/  | (sin)                         | Test resources    |
| 50 | 06_Tools/15_Shellcheck/                | (sin)                         | Shell lint        |

### → `16_MCP_Stack`

| #  | Directorio                    | name             | Valor               |
|---|------------------------------|-----------------|--------------------|
| 51 | 06_Tools/10_Mcp_Client/       | mcp-client       | Universal MCP client|
| 52 | 06_Tools/04_Mcp_Builder/      | mcp-builder      | MCP server creation |
| 53 | 06_Tools/05_Google_Stitch_MCP/| google-stitch-mcp| Stitch integration  |

### → `17_Skill_Architect`

| #  | Directorio                        | name               | Valor         |
|---|----------------------------------|-------------------|--------------|
| 54 | 06_Tools/skill-creator/           | skill-creator      | Skill creation|
| 55 | 06_Tools/15_Skill_Creator_Oficial/| skill-creator      | **DUPLICADO** |
| 56 | 06_Tools/09_Skill_Architect/      | skill-creator      | **DUPLICADO** |
| 57 | 06_Tools/01_Skill_Template/       | template-skill     | Template      |
| 58 | 06_Tools/21_Skill_Template/       | skill-template-base| **DUPLICADO** |

### → Archivo directo (sin valor fusionable)

| #    | Directorio                                    | Razón                |
|-----|----------------------------------------------|---------------------|
| 59   | 06_Tools/01_Evaluator_Pattern/                | 1 línea, sin valor   |
| 60   | 06_Tools/02_Context_Management/               | 1 línea, sin valor   |
| 61   | 06_Tools/03_Sprint_Contract/                  | 1 línea, sin valor   |
| 62   | 06_Tools/04_Auto_Mode_Security/               | 1 línea, sin valor   |
| 63   | 06_Tools/05_Pass_At_Metrics/                  | 1 línea, sin valor   |
| 64   | 06_Tools/07_Feature_List_JSON/                | 1 línea, sin valor   |
| 65   | 06_Tools/08_Graders_Framework/                | 1 línea, sin valor   |
| 66   | 06_Tools/14_Anthropic_Harness/                | Framework, referencia|
| 67   | 06_Tools/04_Obsidian_CLI/                     | Obsidian CLI         |
| 68   | 06_Tools/05_Seo_Audit/                        | → SEO_Analytics      |
| 69   | 06_Tools/06_Seo_Optimization/                 | → SEO_Analytics      |
| 70   | 06_Tools/07_Data_Visualization/               | Data viz             |
| 71   | 06_Tools/12_RTM/                              | RTM traceability     |
| 72   | 06_Tools/05_Vibe_Coding/                      | Vibe coding          |
| 73   | 06_Tools/00_Octopus_Skill/                    | Octopus methodology  |
| 74-83| Resto (Find Skills, QMD, Doc Processing, etc.)| Varios               |

---

## 📦 CLUSTER INVICTUS → `18_Invictus_Workflows`

| #  | Directorio                                     | name                          | Valor               |
|---|-----------------------------------------------|------------------------------|--------------------|
| 1  | 07_Invictus_Web/brainstorming/                 | brainstorming                 | Creative exploration|
| 2  | 07_Invictus_Web/dispatching-parallel-agents/   | dispatching-parallel-agents   | Parallel execution  |
| 3  | 07_Invictus_Web/executing-plans/               | executing-plans               | Plan execution      |
| 4  | 07_Invictus_Web/finishing-a-development-branch/| finishing-a-development-branch| Branch completion   |
| 5  | 07_Invictus_Web/receiving-code-review/         | receiving-code-review         | Review feedback     |
| 6  | 07_Invictus_Web/requesting-code-review/        | requesting-code-review        | Review request      |
| 7  | 07_Invictus_Web/subagent-driven-development/   | subagent-driven-development   | Subagent execution  |
| 8  | 07_Invictus_Web/systematic-debugging/          | systematic-debugging          | Debugging workflow  |
| 9  | 07_Invictus_Web/test-driven-development/       | test-driven-development       | TDD workflow        |
| 10 | 07_Invictus_Web/using-git-worktrees/           | using-git-worktrees           | Worktree creation   |
| 11 | 07_Invictus_Web/using-superpowers/             | using-superpowers             | Skill discovery     |
| 12 | 07_Invictus_Web/verification-before-completion/| verification-before-completion| Pre-completion QA   |
| 13 | 07_Invictus_Web/writing-plans/                 | writing-plans                 | Plan writing        |
| 14 | 07_Invictus_Web/writing-skills/                | writing-skills                | Skill writing       |
| 15 | 07_Invictus_Web/07_Invictus_Web/               | invictus-web                  | Area index          |

---

## 📐 RESUMEN: Las 20 mega-skills finales

| #  | Mega-skill             | Origen                | Skills absorbidas  |
|---|-----------------------|----------------------|-------------------|
| 01 | `01_Content_Engine`    | 01_Creacion_Contenidos| 19                 |
| 02 | `02_SEO_Analytics`     | 01_Creacion_Contenidos| 10                 |
| 03 | `03_Marketing_Strategy`| 01_Creacion_Contenidos| 14                 |
| 04 | `04_Video_Production`  | 02_Diseno + 03_Video  | 12                 |
| 05 | `05_Paid_Ads`          | 05_Claude_Ads         | 21                 |
| 06 | `06_Design_System`     | 02_Diseno_Ui_Ux       | 6                  |
| 07 | `07_UI_Prototyping`    | 02_Diseno_Ui_Ux       | 13                 |
| 08 | `08_UI_Engineering`    | 02_Diseno_Ui_Ux       | 13                 |
| 09 | `09_N8N_Master`        | 04_Automatizacion     | 15                 |
| 10 | `10_Cloud_Tools`       | 04_Automatizacion     | 5                  |
| 11 | `11_Learning_Engine`   | 04_Automatizacion     | 3                  |
| 12 | `12_Frontend_Stack`    | 06_Tools              | 12                 |
| 13 | `13_Backend_Stack`     | 06_Tools              | 10                 |
| 14 | `14_DevOps_Pipeline`   | 06_Tools              | 8                  |
| 15 | `15_Testing_Strategy`  | 06_Tools              | 20                 |
| 16 | `16_MCP_Stack`         | 06_Tools              | 3                  |
| 17 | `17_Skill_Architect`   | 06_Tools              | 5                  |
| 18 | `18_Invictus_Workflows`| 07_Invictus_Web       | 15                 |
| 19 | `19_System_Master`     | 06_Tools (resto)      | ~10                |
| 20 | `20_OS_Core`           | 00_System_Core        | ~3                 |

**Total absorbidas:** ~218 → **20 skills**
**Skills preservadas intactas:** ~121
**Skills archivadas sin fusionar:** ~46 (1-línea, duplicados, indexes)
