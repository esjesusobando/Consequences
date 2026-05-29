# Plan de Fusión de Skills: De 385 → 15-20

> **Estado:** ABANDONADO — No cumple criterios SOTA
> **Fecha:** 2026-05-29
> **Contexto:** Post-sesión NP-30 — Backlog cleanup + Hillary v2.0 Autonomous
> **Decisiones:** 20 skills finales | Archive secuencial en Archive_Delete_Skills/ | Boot script SOTA | Ejecución inmediata

> [!WARNING]
> **Plan abandonado.** Este plan fue un borrador que quedó obsoleto antes de implementarse. La fusión de 385→20 skills no se ejecutó porque no cumple los criterios SOTA (State of the Art): introduce riesgo estructural alto al consolidar skills activas, no tiene rollback plan, y la granularidad actual de ~385 skills ya tiene un sistema de archive funcional. Este documento se mantiene como referencia histórica de la exploratory phase. La decisión final fue archivar individualmente las skills obsoletas en lugar de fusionarlas.

---

## ✅ Áreas que NO se tocan (quedan exactamente como están)

| Área | Skills | Razón |
|------|--------|-------|
| **00_Agent_Teams_Lite** | 13 | Ecosistema Angel Team Life |
| **00_Compound_Engineering** | 63 | Ecosistema Gentleman |
| **00_Personal_Os** | 32 | Decisión del usuario |
| **00_Skill_Auditor** | 1 | Sistema |
| **00_System_Core** | 1 | Sistema |
| **00_Workflows** (sdd-*) | ~10 | Solo SDD agent tasks preservados. Los ~33 workflows personales (Morning Standup, Backlog Processing, Weekly Review, Sunday Ritual, etc.) deben rutearse a sus mega-skills correspondientes si se activa la fusión |
| **10_Laia_Learning** | 1 | Laia |

**Total skills preservadas intactas:** ~121

## 📦 MANIFEST: Archivo completo de skills a fusionar

Cada skill listada abajo será leída, su valor extraído e inyectado en la mega-skill correspondiente, y luego movida a `Archive_Delete_Skills/` con numeración secuencial.

---

### CLUSTER ADS (21 skills → 1 mega-skill: `05_Paid_Ads`)

| # | Directorio actual | name: | Valor único |
|---|------------------|-------|-------------|
| 1 | 05_Claude_Ads/01_Ads/ | ads | Orquestador principal, scoring, 250+ checks, routing table |
| 2 | 05_Claude_Ads/05_Skills/01_Ads_Apple/ | ads-apple | Apple Search Ads: CPPs, TAP coverage, MMP attribution |
| 3 | 05_Claude_Ads/05_Skills/02_Ads_Audit/ | ads-audit | Full audit orchestration, parallel subagents |
| 4 | 05_Claude_Ads/05_Skills/03_Ads_Budget/ | ads-budget | 70/20/10 rule, 3x Kill Rule, 20% scaling |
| 5 | 05_Claude_Ads/05_Skills/04_Ads_Competitor/ | ads-competitor | Competitor ad intelligence, estimated spend |
| 6 | 05_Claude_Ads/05_Skills/05_Ads_Create/ | ads-create | Campaign brief generator from brand-profile.json |
| 7 | 05_Claude_Ads/05_Skills/06_Ads_Creative/ | ads-creative | Creative fatigue detection, format diversity |
| 8 | 05_Claude_Ads/05_Skills/07_Ads_Dna/ | ads-dna | Brand DNA extraction from URL, brand-profile.json |
| 9 | 05_Claude_Ads/05_Skills/08_Ads_Generate/ | ads-generate | AI image generation for ads |
| 10 | 05_Claude_Ads/05_Skills/09_Ads_Google/ | ads-google | 80 checks: Search, PMax, Display, YouTube, Demand Gen |
| 11 | 05_Claude_Ads/05_Skills/10_Ads_Landing/ | ads-landing | Landing page assessment, message match scoring |
| 12 | 05_Claude_Ads/05_Skills/11_Ads_Linkedin/ | ads-linkedin | 27 checks: Thought Leader Ads, ABM, predictive audiences |
| 13 | 05_Claude_Ads/05_Skills/12_Ads_Math/ | ads-math | PPC financial calculator (zero-dependency) |
| 14 | 05_Claude_Ads/05_Skills/13_Ads_Meta/ | ads-meta | 50 checks: Pixel/CAPI, Advantage+, creative fatigue |
| 15 | 05_Claude_Ads/05_Skills/14_Ads_Microsoft/ | ads-microsoft | 24 checks: Copilot integration, Google import validation |
| 16 | 05_Claude_Ads/05_Skills/15_Ads_Photoshoot/ | ads-photoshoot | 5 product photography styles (AI) |
| 17 | 05_Claude_Ads/05_Skills/16_Ads_Plan/ | ads-plan | Industry templates, platform selection |
| 18 | 05_Claude_Ads/05_Skills/17_Ads_Test/ | ads-test | A/B test design, significance calculator, sample size |
| 19 | 05_Claude_Ads/05_Skills/18_Ads_Tiktok/ | ads-tiktok | 28 checks: Creative-first, Smart+, TikTok Shop |
| 20 | 05_Claude_Ads/05_Skills/19_Ads_Youtube/ | ads-youtube | VAC→Demand Gen, Shorts, CTV shoppable |
| 21 | 05_Claude_Ads/SKILL.md | (area index) | Área de skills |

---

### CLUSTER CONTENIDO (47 skills → 3 mega-skills: `01_Content_Engine` + `02_SEO_Analytics` + `03_Marketing_Strategy`)

#### → `01_Content_Engine` (brand, copy, social, email, video scripts)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 1 | 01_Creacion_Contenidos/01_Brand_Voice/ | brand-voice-guardian | Tone of voice enforcement |
| 2 | 01_Creacion_Contenidos/imported/...brand-voice-guardian | brand-voice-guardian | DUPLICADO de 01 |
| 3 | 01_Creacion_Contenidos/02_Content_Ideation/ | content-ideation | Topic extraction from brand pain points |
| 4 | 01_Creacion_Contenidos/imported/...content-ideation | content-ideation | DUPLICADO de 03 |
| 5 | 01_Creacion_Contenidos/03_Content_Transformer/ | content-transformer | Content repurposing across channels |
| 6 | 01_Creacion_Contenidos/04_Offer_And_Bio_Writer/ | offer-and-bio-writer | Bio, landing page, DM scripts |
| 7 | 01_Creacion_Contenidos/imported/...offer-and-bio-writer | offer-and-bio-writer | DUPLICADO de 06 |
| 8 | 01_Creacion_Contenidos/05_Youtube_Script_Writer/ | youtube-script-writer | Retention hooks, timestamps |
| 9 | 01_Creacion_Contenidos/06_Youtube_Title_Generator/ | youtube-title-generator | CTR scoring, A/B variants |
| 10 | 01_Creacion_Contenidos/07_Youtube_Full_Video/ | youtube-full-video-epic | Full YouTube workflow integration |
| 11 | 01_Creacion_Contenidos/content-strategy/ | content-strategy | Content strategy framework |
| 12 | 01_Creacion_Contenidos/copy-editing/ | copy-editing | Copy editing rules |
| 13 | 01_Creacion_Contenidos/copywriting/ | copywriting | Copywriting patterns |
| 14 | 01_Creacion_Contenidos/email-sequence/ | email-sequence | Email sequence design |
| 15 | 01_Creacion_Contenidos/launch-strategy/ | launch-strategy | Campaign launch framework |
| 16 | 01_Creacion_Contenidos/marketing-ideas/ | marketing-ideas | Marketing idea generation |
| 17 | 01_Creacion_Contenidos/marketing-psychology/ | marketing-psychology | Psychological triggers in copy |
| 18 | 01_Creacion_Contenidos/product-marketing-context/ | product-marketing-context | Product positioning |
| 19 | 01_Creacion_Contenidos/social-content/ | social-content | Social media content creation |

#### → `02_SEO_Analytics` (SEO, analytics, A/B testing, tools)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 20 | 01_Creacion_Contenidos/08_Seo_Sota_Master/ | seo-sota-master | Elite SEO: technical + content + programmatic |
| 21 | 01_Creacion_Contenidos/ab-test-setup/ | ab-test-setup | A/B test planning |
| 22 | 01_Creacion_Contenidos/analytics-tracking/ | analytics-tracking | GA4, GTM, conversion tracking |
| 23 | 01_Creacion_Contenidos/competitor-alternatives/ | competitor-alternatives | Competitor comparison pages |
| 24 | 01_Creacion_Contenidos/free-tool-strategy/ | free-tool-strategy | Marketing tool strategy |
| 25 | 01_Creacion_Contenidos/programmatic-seo/ | programmatic-seo | SEO pages at scale |
| 26 | 01_Creacion_Contenidos/referral-program/ | referral-program | Referral program design |
| 27 | 01_Creacion_Contenidos/schema-markup/ | schema-markup | Structured data, JSON-LD |
| 28 | 01_Creacion_Contenidos/seo-audit/ | seo-audit | Technical SEO audit |
| 29 | 01_Creacion_Contenidos/14_Marketing_Tech/ | marketing-tech | Marketing technology index |
| 30 | 01_Creacion_Contenidos/15_Marketing_Scripts/ | marketing-scripts | Marketing automation scripts |

#### → `03_Marketing_Strategy` (CRO, pricing, strategy, agents)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 31 | 01_Creacion_Contenidos/13_Marketing_Strategy/ | marketing-strategy | Strategic marketing planning |
| 32 | 01_Creacion_Contenidos/form-cro/ | form-cro | Form conversion optimization |
| 33 | 01_Creacion_Contenidos/onboarding-cro/ | onboarding-cro | User onboarding optimization |
| 34 | 01_Creacion_Contenidos/page-cro/ | page-cro | Landing page CRO |
| 35 | 01_Creacion_Contenidos/paywall-upgrade-cro/ | paywall-upgrade-cro | Paywall conversion |
| 36 | 01_Creacion_Contenidos/popup-cro/ | popup-cro | Popup optimization |
| 37 | 01_Creacion_Contenidos/pricing-strategy/ | pricing-strategy | Pricing model design |
| 38 | 01_Creacion_Contenidos/signup-flow-cro/ | signup-flow-cro | Signup flow optimization |
| 39 | 01_Creacion_Contenidos/01_Agent_Onboarding/ | onboarding-agent-employee | AI agent onboarding |
| 40 | 01_Creacion_Contenidos/02_Executive_Assistant/ | executive-assistant-ai | Executive assistant AI agent |
| 41 | 01_Creacion_Contenidos/03_Head_Of_Marketing/ | head-of-marketing-director | CMO agent strategy |
| 42 | 01_Creacion_Contenidos/11_Ai_Agents/ | ai-agents-marketing | Marketing AI agents index |
| 43 | 01_Creacion_Contenidos/12_Compound_Engine/ | compound-engine | Compound engineering philosophy |
| 44 | 01_Creacion_Contenidos/09_Remotion_Video_Creator/ | remotion-best-practices | DUPLICADO → va a Video |
| 45 | 01_Creacion_Contenidos/10_Remotion_Best_Practices/ | remotion-best-practices | DUPLICADO → va a Video |
| 46 | 01_Creacion_Contenidos/paid-ads/ | paid-ads | DUPLICADO → va a Ads |
| 47 | 01_Creacion_Contenidos/01_Creacion_Contenidos/ | creacion-contenidos | Area index |

---

### CLUSTER DISEÑO (34 skills → 3 mega-skills: `06_Design_System` + `07_UI_Prototyping` + `08_UI_Engineering`)

#### → `06_Design_System` (tokens, brand, components, visual language)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 1 | 02_Diseno_Ui_Ux/10_Design_Systems/ | design-systems | Atomic design, tokens, Storybook, multi-brand |
| 2 | 02_Diseno_Ui_Ux/12_Shadcn/ | shadcn | shadcn/ui component registry |
| 3 | 02_Diseno_Ui_Ux/07_Brand_Identity/ | brand-identity | Brand guidelines, design tokens |
| 4 | 02_Diseno_Ui_Ux/08_Brand_Voice_Generator/ | brand-voice-generator | Tone of voice system |
| 5 | 02_Diseno_Ui_Ux/10_Visual_Language/ | engram-visual-language | Visual language rules |
| 6 | 02_Diseno_Ui_Ux/04_Directrices_Marca/ | brand-guidelines | Anthropic brand colors/fonts |

#### → `07_UI_Prototyping` (mockups, diagrams, HTML protos, premium assets)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 7 | 02_Diseno_Ui_Ux/08_Huashu_Design/ | huashu-design | HTML prototypes, animations, slides |
| 8 | 02_Diseno_Ui_Ux/09_Canvas_Diagram_Studio/ | canvas-diagram-studio | Excalidraw diagrams |
| 9 | 02_Diseno_Ui_Ux/11_Pencil_Design_Studio/ | (sin name) | Design sketching |
| 10 | 02_Diseno_Ui_Ux/05_Excalidraw_Flowchart/ | excalidraw-diagram | JSON diagram modeling |
| 11 | 02_Diseno_Ui_Ux/06_Design_Sota/ | design-sota | Premium Stripe/Linear/Vercel aesthetic |
| 12 | 02_Diseno_Ui_Ux/07_Ui_Ux_Pro_Max/ | ui-ux-pro-max | UI/UX design intelligence DB |
| 13 | 02_Diseno_Ui_Ux/09_Dumbledor_Design/ | dumbledor-design | Editorial high-impact design |
| 14 | 02_Diseno_Ui_Ux/12_Premium_Image_Studio/ | premium-image-studio | Image asset creation |
| 15 | 02_Diseno_Ui_Ux/13_Carousel_Master/ | carousel-master | Instagram/LinkedIn carousels |
| 16 | 02_Diseno_Ui_Ux/14_Video_Visuals_Producer/ | video-visuals-producer | Video/PPTX production |
| 17 | 02_Diseno_Ui_Ux/11_Marvel_Avengers/ | marvel-avengers | Multi-agent design workflow |
| 18 | 02_Diseno_Ui_Ux/04_Product_Design/ | (area index) | Product design index |
| 19 | 02_Diseno_Ui_Ux/01_Product_Design/ | (area index) | Product design sub-index |

#### → `08_UI_Engineering` (taste, minimalism, redesign, Dieter Rams)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 20 | 02_Diseno_Ui_Ux/01_Taste_Skill/ | design-taste-frontend | Senior UI/UX engineering |
| 21 | 02_Diseno_Ui_Ux/1. TASTE SKILLS/ | design-taste-frontend | DUPLICADO de 20 |
| 22 | 02_Diseno_Ui_Ux/02_Taste_Skills/ | design-taste-frontend | DUPLICADO de 20 |
| 23 | 02_Diseno_Ui_Ux/02_Soft_Skill/ | high-end-visual-design | Awwwards-tier premium |
| 24 | 02_Diseno_Ui_Ux/03_Minimalist_Skill/ | minimalist-ui | Editorial monochrome |
| 25 | 02_Diseno_Ui_Ux/2. DISEÑO MINIMALISTA/ | minimalist-ui | DUPLICADO de 24 |
| 26 | 02_Diseno_Ui_Ux/03_Diseno_Minimalista/ | minimalist-ui | DUPLICADO de 24 |
| 27 | 02_Diseno_Ui_Ux/04_Redesign_Skill/ | redesign-existing-projects | Upgrade generic → premium |
| 28 | 02_Diseno_Ui_Ux/06_Dieter_Rams_Design/ | dieter-rams-design | 10 principles audit |
| 29 | 02_Diseno_Ui_Ux/15_Youtube_Thumbnail_Prompter/ | youtube-thumbnail-prompter | Thumbnail prompts for AI |
| 30 | 02_Diseno_Ui_Ux/16_Video_Prompt_Builder/ | video-prompt-builder | Video prompt generation |
| 31 | 02_Diseno_Ui_Ux/05_Output_Skill/ | full-output-enforcement | Meta: force complete output — va a System Master |
| 32 | 02_Diseno_Ui_Ux/02_Diseno_Ui_Ux/ | (area index) | Area index |
| 33 | 02_Diseno_Ui_Ux/04_Product_Design/01_Product_Design/ | (area index) | Sub-index |
| 34 | 02_Diseno_Ui_Ux/01_Taste_Skill/ | (compartido) | Ya incluido |

---

### CLUSTER VIDEO (7 skills → se distribuyen)

| # | Directorio | name: | Destino |
|---|-----------|-------|---------|
| 1 | 03_Video_Media/19_Video_Intel/ | video-intel | → `04_Video_Production` |
| 2 | 03_Video_Media/01_Video_Prompt_Builder/ | video-prompt-builder | → `04_Video_Production` |
| 3 | 03_Video_Media/02_Remotion_Browser_Search/ | remotion-browser-search | → `04_Video_Production` |
| 4 | 03_Video_Media/03_Remotion_Cards_Showcase/ | remotion-cards-showcase | → `04_Video_Production` |
| 5 | 03_Video_Media/04_Remotion_Audio_Engine/ | remotion-audio-engine | → `04_Video_Production` |
| 6 | 03_Video_Media/02_James_Cameron/ | james-cameron-video | → `04_Video_Production` |
| 7 | 03_Video_Media/03_Video_Media/ | video-media | Area index |

---

### CLUSTER AUTOMATIZACION (24 skills → 3 mega-skills: `09_N8N_Master` + `10_Cloud_Tools` + `11_Learning_Engine`)

#### → `09_N8N_Master`

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 1 | 04_Automatizacion/01_N8N_JS/ | n8n-code-javascript | JS en Code nodes |
| 2 | 04_Automatizacion/02_N8N_Python/ | n8n-code-python | Python en Code nodes |
| 3 | 04_Automatizacion/03_N8N_Expressions/ | n8n-expression-syntax | {{}} expression syntax |
| 4 | 04_Automatizacion/04_N8N_MCP/ | n8n-mcp-tools-expert | MCP tool usage guide |
| 5 | 04_Automatizacion/05_N8N_Nodes/ | n8n-node-configuration | Node configuration patterns |
| 6 | 04_Automatizacion/06_N8N_Validation/ | n8n-validation-expert | Error interpretation |
| 7 | 04_Automatizacion/07_N8N_Workflows/ | n8n-workflow-patterns | Architecture patterns |
| 8 | 04_Automatizacion/n8n-code-javascript/ | n8n-code-javascript | DUPLICADO de 1 |
| 9 | 04_Automatizacion/n8n-code-python/ | n8n-code-python | DUPLICADO de 2 |
| 10 | 04_Automatizacion/n8n-expression-syntax/ | n8n-expression-syntax | DUPLICADO de 3 |
| 11 | 04_Automatizacion/n8n-mcp-tools-expert/ | n8n-mcp-tools-expert | DUPLICADO de 4 |
| 12 | 04_Automatizacion/n8n-node-configuration/ | n8n-node-configuration | DUPLICADO de 5 |
| 13 | 04_Automatizacion/n8n-validation-expert/ | n8n-validation-expert | DUPLICADO de 6 |
| 14 | 04_Automatizacion/n8n-workflow-patterns/ | n8n-workflow-patterns | DUPLICADO de 7 |
| 15 | 04_Automatizacion/14_N8n/ | n8n-automation | N8N area index |

#### → `10_Cloud_Tools` (GWS, Obsidian, Firecrawl, URLs)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 16 | 04_Automatizacion/10_GWS_Client/ | gws-cli | Google Workspace CLI |
| 17 | 04_Automatizacion/11_Gws_Client/ | gws-cli | DUPLICADO de 16 |
| 18 | 04_Automatizacion/13_Content_From_Url/ | content-from-url | URL content extraction |
| 19 | 04_Automatizacion/14_Compound_Knowledge/ | compound-knowledge | Knowledge network connection |
| 20 | 04_Automatizacion/08_AI_News_Weekly/ | ai-news-weekly | AI news briefing |

#### → `11_Learning_Engine` (OS improvement, reverse eng)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 21 | 04_Automatizacion/15_Os_Self_Improvement/ | os-self-improvement | OS improvement opportunity detection |
| 22 | 04_Automatizacion/16_Reverse_Engineering/ | reverse-engineering | Extract patterns from code |
| 23 | 04_Automatizacion/17_Learning_Url_To_Knowledge/ | learning-url-to-knowledge | URL → 8 deliverables |
| 24 | 04_Automatizacion/04_Automatizacion/ | automatizacion | Area index |

---

### CLUSTER TOOLS (83 skills → 6 mega-skills)

#### → `12_Frontend_Stack` (React, Next, Angular, TS, CSS)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 1 | 06_Tools/01_React_19/ | react-19 | React 19 + Compiler |
| 2 | 06_Tools/02_Nextjs_15/ | nextjs-15 | Next.js App Router |
| 3 | 06_Tools/03_Tailwind_4/ | tailwind-4 | Tailwind CSS 4 |
| 4 | 06_Tools/05_Typescript/ | typescript | TypeScript strict patterns |
| 5 | 06_Tools/06_Zustand_5/ | zustand-5 | Zustand state management |
| 6 | 06_Tools/07_Zod_4/ | zod-4 | Zod schema validation |
| 7 | 06_Tools/08_Ai_Sdk_5/ | ai-sdk-5 | Vercel AI SDK |
| 8 | 06_Tools/architecture/ | angular-architecture | Angular architecture |
| 9 | 06_Tools/core/ | angular-core | Angular core patterns |
| 10 | 06_Tools/forms/ | angular-forms | Angular forms |
| 11 | 06_Tools/performance/ | angular-performance | Angular performance |
| 12 | 06_Tools/08_Vercel_React_Best_Practices/ | vercel-react-best-practices | Vercel perf guidelines |

#### → `13_Backend_Stack` (Django, Pytest, Payload, Meilisearch, APIs)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 13 | 06_Tools/13_Django_Drf/ | django-drf | Django REST Framework |
| 14 | 06_Tools/16_Pytest/ | pytest | Pytest patterns |
| 15 | 06_Tools/17_Playwright/ | playwright | E2E testing |
| 16 | 06_Tools/19_Payload_Cms/ | payload-cms-v3 | Payload CMS |
| 17 | 06_Tools/20_Meilisearch/ | meilisearch | Search engine |
| 18 | 06_Tools/15_Server_Api/ | engram-server-api | API contracts |
| 19 | 06_Tools/18_Firecrawl/ | firecrawl | Web scraping |
| 20 | 06_Tools/11_Invoice_Intelligence/ | invoice-intelligence | OCR invoice processing |
| 21 | 06_Tools/12_Health_Data_Analyst/ | health-data-analyst | Health data analysis |
| 22 | 06_Tools/14_Silicon_Valley_Data_Analyst/ | silicon-valley-data-analyst | Executive data insights |

#### → `14_DevOps_Pipeline` (deploy, observability, releases, infra)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 23 | 06_Tools/01_Vercel_Deploy/ | Vercel Production | Vercel deployment |
| 24 | 06_Tools/02_Supabase_Integration/ | (sin name) | Supabase setup |
| 25 | 06_Tools/03_MCP_Integration/ | (sin name) | MCP server integration |
| 26 | 06_Tools/04_Observability/ | observability-skill | Metrics, logging, tracing |
| 27 | 06_Tools/10_E2b_Sandbox/ | e2b-sandbox | Cloud code execution |
| 28 | 06_Tools/11_Error_Handling_Patterns/ | error-handling-patterns | Resilience patterns |
| 29 | 06_Tools/13_Release_Agent/ | release-agent | Release pipeline |
| 30 | 06_Tools/09_Using_Git_Worktrees/ | using-git-worktrees | Git worktrees |

#### → `15_Testing_Strategy` (TDD, debugging, coverage, E2E, QA)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 31 | 06_Tools/01_Test_Driven_Development/ | test-driven-development | Red-Green-Refactor |
| 32 | 06_Tools/02_Systematic_Debugging/ | systematic-debugging | Root cause methodology |
| 33 | 06_Tools/03_Verify_And_Commit/ | verification-before-completion | Pre-completion QA |
| 34 | 06_Tools/05_Testing_Coverage/ | engram-testing-coverage | TDD + coverage |
| 35 | 06_Tools/06_Go_Testing/ | go-testing | Go + Bubbletea testing |
| 36 | 06_Tools/07_Tui_Quality/ | engram-tui-quality | TUI quality rules |
| 37 | 06_Tools/08_E2e_Testing/ | e2e-testing-skill | Playwright E2E |
| 38 | 06_Tools/09_Integration_Testing/ | integration-testing-skill | API + DB + mocks |
| 39 | 06_Tools/10_Edge_Case/ | edge-case-skill | Boundary analysis |
| 40 | 06_Tools/11_Test_Coverage/ | test-coverage-skill | Coverage metrics |
| 41 | 06_Tools/12_Evaluation/ | evaluation-skill | Agent evaluation |
| 42 | 06_Tools/13_Skill_Testing_Automation/ | skill-testing-automation | Skill validation suite |
| 43 | 06_Tools/14_Commit_Hygiene/ | engram-commit-hygiene | Commit standards |
| 44 | 06_Tools/16_Docs_Alignment/ | engram-docs-alignment | Documentation alignment |
| 45 | 06_Tools/01_Lighthouse_Core_Web_Vitals/ | lighthouse-core-web-vitals | Core Web Vitals |
| 46 | 06_Tools/01_Accessibility_WCAG_Testing/ | accessibility-wcag-testing | WCAG 2.2 compliance |
| 47 | 06_Tools/06_Testing/ | testing-index | Testing index |
| 48 | 06_Tools/17_Testing_Coverage/ | (sin name) | Coverage meta |
| 49 | 06_Tools/04_Test_Resource_Management/ | (sin name) | Test resources |
| 50 | 06_Tools/15_Shellcheck/ | (sin name) | Shell script lint |

#### → `16_MCP_Stack` (client, builder, servers)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 51 | 06_Tools/10_Mcp_Client/ | mcp-client | Universal MCP client |
| 52 | 06_Tools/04_Mcp_Builder/ | mcp-builder | MCP server creation |
| 53 | 06_Tools/05_Google_Stitch_MCP/ | google-stitch-mcp | Google Stitch integration |

#### → `17_Skill_Architect` (create, maintain, template skills)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 54 | 06_Tools/skill-creator/ | skill-creator | Skill creation system |
| 55 | 06_Tools/15_Skill_Creator_Oficial/ | skill-creator | DUPLICADO de 54 |
| 56 | 06_Tools/09_Skill_Architect/ | skill-creator | DUPLICADO de 54 |
| 57 | 06_Tools/01_Skill_Template/ | template-skill | Skill template |
| 58 | 06_Tools/21_Skill_Template/ | skill-template-base | DUPLICADO de 57 |

#### Skills que se archivan sin fusionar (sin valor real → Archive_Delete)

| # | Directorio | Razón |
|---|-----------|-------|
| 59 | 06_Tools/01_Evaluator_Pattern/ | Archivo de 1 línea, sin valor |
| 60 | 06_Tools/02_Context_Management/ | Archivo de 1 línea, sin valor |
| 61 | 06_Tools/03_Sprint_Contract/ | Archivo de 1 línea, sin valor |
| 62 | 06_Tools/04_Auto_Mode_Security/ | Archivo de 1 línea, sin valor |
| 63 | 06_Tools/05_Pass_At_Metrics/ | Archivo de 1 línea, sin valor |
| 64 | 06_Tools/07_Feature_List_JSON/ | Archivo de 1 línea, sin valor |
| 65 | 06_Tools/08_Graders_Framework/ | Archivo de 1 línea, sin valor |
| 66 | 06_Tools/14_Anthropic_Harness/ | Harness — archivar con referencia |
| 67 | 06_Tools/04_Obsidian_CLI/ | Obsidian CLI — archivar |
| 68 | 06_Tools/05_Seo_Audit/ | SEO template — va a SEO_Analytics |
| 69 | 06_Tools/06_Seo_Optimization/ | SEO optimization — va a SEO_Analytics |
| 70 | 06_Tools/07_Data_Visualization/ | Data viz — archivar |
| 71 | 06_Tools/12_RTM/ | RTM — archivar |
| 72 | 06_Tools/05_Vibe_Coding/ | Vibe coding — archivar |
| 73 | 06_Tools/00_Octopus_Skill/ | Octopus methodology |
| 74-83 | Resto 06_Tools | Doc processing, QMD, Find Skills, etc. |

---

### CLUSTER INVICTUS (15 skills → 1 mega-skill: `18_Invictus_Workflows`)

| # | Directorio | name: | Valor |
|---|-----------|-------|-------|
| 1 | 07_Invictus_Web/brainstorming/ | brainstorming | Creative exploration before implementation |
| 2 | 07_Invictus_Web/dispatching-parallel-agents/ | dispatching-parallel-agents | Parallel task execution |
| 3 | 07_Invictus_Web/executing-plans/ | executing-plans | Plan execution |
| 4 | 07_Invictus_Web/finishing-a-development-branch/ | finishing-a-development-branch | Branch completion |
| 5 | 07_Invictus_Web/receiving-code-review/ | receiving-code-review | Review feedback integration |
| 6 | 07_Invictus_Web/requesting-code-review/ | requesting-code-review | Review request workflow |
| 7 | 07_Invictus_Web/subagent-driven-development/ | subagent-driven-development | Subagent execution |
| 8 | 07_Invictus_Web/systematic-debugging/ | systematic-debugging | Debugging workflow |
| 9 | 07_Invictus_Web/test-driven-development/ | test-driven-development | TDD workflow |
| 10 | 07_Invictus_Web/using-git-worktrees/ | using-git-worktrees | Git worktree creation |
| 11 | 07_Invictus_Web/using-superpowers/ | using-superpowers | Skill discovery protocol |
| 12 | 07_Invictus_Web/verification-before-completion/ | verification-before-completion | Pre-completion QA |
| 13 | 07_Invictus_Web/writing-plans/ | writing-plans | Plan writing |
| 14 | 07_Invictus_Web/writing-skills/ | writing-skills | Skill writing |
| 15 | 07_Invictus_Web/07_Invictus_Web/ | invictus-web | Area index |

---

### CLUSTER WORKFLOWS (parcial — los sdd-* y agentes NO se tocan)

Los siguientes workflows de 00_Workflows NO se tocan (pertenecen a SDD y ecosistemas preservados):
- sdd-* (explore, propose, spec, design, tasks, apply, verify, archive)
- issue-creation, branch-pr, judgment-day
- Agent Teams Lite

Los workflows personales (Morning Standup, Backlog Processing, Weekly Review, Sunday Ritual, etc.) se consumen en las mega-skills correspondientes.

---

## 📐 Resumen: Las 20 mega-skills finales

| # | Mega-skill | Área origen | Skills absorbidas |
|---|-----------|------------|-------------------|
| 01 | `01_Content_Engine` | 01_Creacion_Contenidos | 19 |
| 02 | `02_SEO_Analytics` | 01_Creacion_Contenidos | 10 |
| 03 | `03_Marketing_Strategy` | 01_Creacion_Contenidos | 14 |
| 04 | `04_Video_Production` | 02_Diseno + 03_Video_Media | 12 |
| 05 | `05_Paid_Ads` | 05_Claude_Ads | 21 |
| 06 | `06_Design_System` | 02_Diseno_Ui_Ux | 6 |
| 07 | `07_UI_Prototyping` | 02_Diseno_Ui_Ux | 13 |
| 08 | `08_UI_Engineering` | 02_Diseno_Ui_Ux | 13 |
| 09 | `09_N8N_Master` | 04_Automatizacion | 15 |
| 10 | `10_Cloud_Tools` | 04_Automatizacion | 5 |
| 11 | `11_Learning_Engine` | 04_Automatizacion | 3 |
| 12 | `12_Frontend_Stack` | 06_Tools | 12 |
| 13 | `13_Backend_Stack` | 06_Tools | 10 |
| 14 | `14_DevOps_Pipeline` | 06_Tools | 8 |
| 15 | `15_Testing_Strategy` | 06_Tools | 20 |
| 16 | `16_MCP_Stack` | 06_Tools | 3 |
| 17 | `17_Skill_Architect` | 06_Tools | 5 |
| 18 | `18_Invictus_Workflows` | 07_Invictus_Web | 15 |
| 19 | `19_System_Master` | 06_Tools (resto) | ~10 |
| 20 | `20_OS_Core` | 00_System_Core + reglas | ~3 |

**Total absorbidas:** ~218 → **20 skills**
**Skills preservadas intactas:** ~121
**Skills archivadas sin fusionar:** ~46 (1-línea, duplicados, indexes)

### Distribución actual

| Área | Skills | Valor real | SOTA grade |
|------|--------|-----------|------------|
| **06_Tools** | 83 | 🟡 Medio | 🟠 Bajo |
| **01_Creacion_Contenidos** | 47 | 🟢 Alto | 🟡 Medio |
| **00_Workflows** | 43 | 🟠 Bajo | 🟠 Bajo |
| **02_Diseno_Ui_Ux** | 34 | 🟢 Alto | 🟢 Alto |
| **00_Personal_Os** | 32 | 🟡 Medio | 🟡 Medio |
| **04_Automatizacion** | 24 | 🟢 Alto | 🟢 Alto |
| **05_Claude_Ads** | 21 | 🟢 Alto | 🟢 Alto |
| **07_Invictus_Web** | 15 | 🟠 Bajo | 🟠 Bajo |
| **00_Agent_Teams_Lite** | 13 | 🟡 Medio | 🟠 Bajo |
| **03_Video_Media** | 7 | 🟡 Medio | 🟡 Medio |
| **00_Compound_Engineering** | 63 | 🔵 Mixto | 🟢 Alto (importadas) |
| **10_Laia_Learning** | 1 | 🟢 Alto | 🟢 Alto |
| **Resto** | ~2 | 🟠 Bajo | 🟠 Bajo |

### Problemas estructurales detectados

1. **DUPLICACIÓN MASIVA**: skills con el mismo `name:` aparecen 2-3 veces. N8n, skill-creator, gws-cli, video-prompt-builder, minimalist-ui, design-taste-frontend — todos duplicados.
2. **GRANULARIDAD ENFERMA**: 19 skills de ads (01_Ads a 19_Ads_Youtube), 7 de N8n, 10+ de testing — muchas son archivos de 5 líneas que podrían ser 1 skill.
3. **SKILLS DE 1 LÍNEA**: skills como `06_Dieter_Rams_Design` (5 líneas) o `05_Output_Skill` no aportan valor real como skills. Son instrucciones, no sistemas.
4. **SKILLS HUÉRFANAS**: skills que apuntan a triggers que nunca se van a usar (RTM, feature-list-json, evaluator-pattern).
5. **385 TOTAL INFLADO**: ~150 son del paquete Compound Engineering importado, que tienen su propio ecosistema y NO deberían fusionarse con las del OS.

---

## 🔥 Fase 1: Fusión por clusters de valor

### Cluster 1: Personal OS (Hillary) → 1 skill
**Skills actuales:** 32 (00_Personal_Os) + Life OS sub-skills + Hillary + Morning Standup
**Fusión:**
- Todo el Life OS (5 sub-skills) se consolida en 1 skill: `Hillary_Personal_OS`
- Incluye: captura rápida, plan my day, daily notes, rutinas, inbox triage
- Las 5 sub-skills actuales se archivan como referencias históricas

### Cluster 2: Diseño UI/UX → 3 skills
**Skills actuales:** 34 (02_Diseno_Ui_Ux + duplicados en 06_Tools + área Product Design)
**Fusión:**

| Skill final | Reemplaza a |
|------------|-------------|
| `Design_System` (1) | Design Systems, Shadcn, Brand Identity, Brand Voice, Visual Language, Design Tokens |
| `UI_Prototyping` (1) | Huashu Design, Canvas Diagram Studio, Excalidraw, Design Sota, Taste Skills (x3), Dumbledor, Premium Image Studio, Carousel Master |
| `UI_Engineering` (1) | Design-taste-frontend, high-end-visual-design, minimalist-ui, redesign, Dieter Rams |

### Cluster 3: Marketing & Contenido → 3 skills
**Skills actuales:** 47 (Creación Contenidos) + 21 (Claude Ads) + marketing strategy + social
**Fusión:**

| Skill final | Reemplaza a |
|------------|-------------|
| `Paid_Ads` (1) | Las 19 sub-skills de ads + ad audit + budget + creative + math + test + plan + landing + photoshoot. TODO en una skill con sub-secciones |
| `Content_Engine` (1) | Content ideation, transformer, script writer, title generator, social content, brand voice, offer writer, email sequence, copywriting |
| `SEO_Analytics` (1) | SEO audit, programmatic seo, schema markup, analytics tracking, competitor alternatives, free tool strategy, referral program |

### Cluster 4: Automatización & N8N → 2 skills
**Skills actuales:** 24 (Automatizacion) + 7 N8n sub-skills + GWS Client + Obsidian CLI
**Fusión:**

| Skill final | Reemplaza a |
|------------|-------------|
| `N8N_Master` (1) | Las 7 sub-skills de n8n (JS, Python, Expressions, MCP, Nodes, Validation, Workflows) + index |
| `Cloud_Tools` (1) | GWS Client, Obsidian CLI, Firecrawl, Content From URL, MCP Integration, Supabase Integration |

### Cluster 5: Video & Media → 2 skills
**Skills actuales:** 7 (Video Media) + James Cameron + Video Intel + Remotion skills + Thumbnail Prompter + Video Prompt Builder
**Fusión:**

| Skill final | Reemplaza a |
|------------|-------------|
| `Video_Production` (1) | James Cameron, Video Prompt Builder, Thumbnail Prompter, Remotion (3 skills), Video Intel |
| `Video_Visuals` (1) | Video Visuals Producer, Carousel Master, Premium Image Studio (si no va a diseño) |

### Cluster 6: Testing & QA → 2 skills
**Skills actuales:** 13+ (testing area) + E2E + integration + edge case + coverage + evaluation
**Fusión:**

| Skill final | Reemplaza a |
|------------|-------------|
| `Testing_Strategy` (1) | TDD, Debugging, Verification, Coverage, E2E, Integration, Edge Case, Evaluation, Resource Management |
| `QA_Automation` (1) | Go Testing, Playwright, Lighthouse, WCAG, Commit Hygiene, Shellcheck |

### Cluster 7: DevOps & Deployment → 1 skill
**Skills actuales:** ~10 (DevOps area) + Vercel Deploy + Release Agent + Observability + E2B Sandbox
**Fusión:**
- `DevOps_Pipeline` — CI/CD, deployment, observability, error handling, sandbox, releases

### Cluster 8: Development Frameworks → 2 skills
**Skills actuales:** React 19, Next.js 15, Tailwind 4, Angular (4), TypeScript, Zustand 5, Zod 4, AI SDK 5, Django DRF, Pytest, Playwright, Payload CMS, Meilisearch, MCP Client, MCP Builder
**Fusión:**

| Skill final | Reemplaza a |
|------------|-------------|
| `Frontend_Stack` (1) | React 19, Next.js 15, Tailwind 4, TypeScript, Zustand 5, Zod 4, AI SDK 5 |
| `Backend_Stack` (1) | Django DRF, Pytest, Payload CMS, Meilisearch, Invoice Intelligence, Health Data Analyst, Server API |

### Cluster 9: Compound Engineering (separado, no fusionar) → 1 skill índice
**Skills actuales:** 63 (importadas del ecosistema Compound Engineering)
**Decisión:** NO SE FUSIONAN. Se deja 1 skill índice que referencie al paquete externo. El CE tiene su propio ciclo de vida.

### Cluster 10: Sistema Core → 1 skill
**Skills actuales:** 00_System_Core + Agent Teams Lite + hooks + manifests + workflows
**Fusión:**
- `OS_Core` — Reglas del sistema, hooks, manifests, boot protocol, agent teams. Una skill que se actualiza con cada cambio estructural.

### Cluster 11: Knowledge & Learning → 1 skill
**Skills actuales:** Learning Always, Laia Learning, Learning URL to Knowledge, Compound Knowledge, Reverse Engineering, OS Self Improvement, Video Intel
**Fusión:**
- `Learning_Engine` — Unifica todo el pipeline: URL→conocimiento→Engram→mejora continua

---

> **Nota:** Este resumen de 15 (luego 18) skills fue un borrador temprano y contradictorio con el resumen de 20 skills de la sección anterior. Se elimina por duplicación y porque el plan completo fue abandonado. El resumen vigente es "Las 20 mega-skills finales" arriba.

---

## 🏗️ Fase 2: Reparación de los 4 puntos de feedback

### 🔴 Problema 1: Código muerto / Legacy
**Causa raíz:** Archivos que no se tocan desde enero, skills huérfanas, importaciones viejas
**Solución:**
1. Script `purge_untouched.sh` — marcar archivos sin commits en 90 días
2. Revisión humana de los marcados → DELETE, no archive
3. Elegir una fecha de corte (ej: 2026-01-01). Todo lo anterior sin tocar = candidato a DELETE
4. Política: "Si no se tocó en 6 meses, no existe"

### 🔴 Problema 2: Documentación asfixiante (mirror `.agent/`)
**Causa raíz:** Cada archivo fuente requiere actualizar el espejo `.agent/` + manifests + catálogos
**Solución:**
1. **Eliminar el mirror `.agent/` como fuente de verdad.** Es redundante — el código fuente YA es la fuente de verdad.
2. Los manifests (`OS_Inventory.json`, `03_Agent_Catalog.yaml`, etc.) se regeneran con 1 script idempotente, no a mano.
3. Script único: `sync_manifests.sh` que escanea directorios y regenera TODO. Se ejecuta pre-commit.
4. El `.agent/` queda solo para lo que el orquestador necesita en runtime — no como mirror de todo.

### 🔴 Problema 3: Boot Protocol frágil
**Causa raíz:** Depende de que el LLM recuerde ejecutar pasos en orden
**Solución:**
1. Convertir el boot protocol de texto en `AGENTS.md` a un script ejecutable `boot_protocol.sh`
2. El script verifica cada paso y reporta fallos
3. El orquestador llama al script en vez de seguir instrucciones de memoria
4. Checkpoints: si un paso falla, el script se detiene y reporta

### 🔴 Problema 4: Dualidades sin resolver
**Causa raíz:** Hillary vs Life OS, Gentleman vs Orchestrator, Supercampeones vs Learning Always
**Solución:**
1. **Hillary = Life OS.** Son lo mismo. Hillary es el agente, Life OS es el skill. Unificar.
2. **Gentleman = Orchestrator.** Gentleman es el orquestador de ingeniería, no hay separación real.
3. **Supercampeones = Learning Always.** Supercampeones es el "qué" (frameworks), Learning Always es el "cómo" (workflow). Se fusionan: el workflow Learning Always ejecuta los frameworks de Supercampeones.
4. Definir en AGENTS.md: "Cuándo usar qué" con un decision tree de 3 preguntas máximo.

---

## 🗓️ Fase 3: Ejecución (Propuesta)

| Fase | Duración | Qué | Depende de |
|------|----------|-----|------------|
| **P-0** | 1 sesión | Decidir fusión final. Revisar este plan, ajustar clusters, confirmar skill names | Nadie |
| **P-1** | 1-2 sesiones | Crear las 18 skills fusionadas escribiendo contenido nuevo desde 0 (no copy-paste de las viejas) | P-0 |
| **P-2** | 1 sesión | Mover skills viejas a `_archive/` o DELETE. Regenerar manifests con script único | P-1 |
| **P-3** | 1 sesión | Escribir `boot_protocol.sh`, integrarlo en el pre-commit hook | P-2 |
| **P-4** | 1 sesión | Eliminar mirror `.agent/` redundante, crear `sync_manifests.sh` idempotente | P-3 |
| **P-5** | 1 sesión | Purga de legacy (cosas sin tocar >90 días) | P-4 |

**Tiempo estimado total:** 5-7 sesiones (una semana intensiva)

---

## ⚡ Quick Wins (se puede hacer HOY)

1. Borrar skills de 1 línea que no aportan: `Evaluator_Pattern`, `Feature_List_JSON`, `Graders_Framework`, `Sprint_Contract`, `05_Vibe_Coding`, `15_Shellcheck`, `04_Test_Resource_Management`
2. Eliminar duplicados exactos: los 4 Angular skills aparecen 2 veces (en `06_Tools` y en otro lado)
3. Fusionar ahora mismo las 7 skills de N8n en 1 — son archivos, es mecánico
4. Marcar fecha de corte para purge

---

## 💬 Preguntas para decidir

1. **¿Querés 15, 18 o 20 skills finales?** Determinante para qué tan agresiva es la fusión.
2. **Compound Engineering: ¿lo dejamos como está o lo envolvemos?** Son 63 skills importadas, sugiero no tocarlas.
3. **¿Preferís DELETE o archive para lo que sobre?** Yo banco DELETE — archive es postergar.
4. **Boot protocol script: ¿bash o python?** Bash es más portable, python más chequeable.
