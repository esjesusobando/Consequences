# Prospect Machine: Automatización de Outreach con IA usando Claude Code

> **Fecha:** 2026-04-14  
> **Fuente:** stevearneson.com/prospect  
> **Tipo:** Case Study / Sistema de Automatización  
> **Etiquetas:** #Outreach #Prospecting #ClaudeCode #LinkedIn #Automación #LeadGeneration

---

## 🎯 Propósito del Sistema

El sistema de Steve Arneson es un **prospect intelligence workflow** que usa Claude Code para transformar contactos exportados (LinkedIn, Facebook, Instagram, Gmail) en una lista priorizada de prospectos con mensajes personalizados.

**Claim principal:** "What would take a human researcher 3 days, Claude does in under an hour."

---

## 🔧 Stack Tecnológico

| Herramienta                  | Función                                                          |
|------------------------------|------------------------------------------------------------------|
| **Claude Code**              | Agente de IA local que ejecuta todo el análisis y genera outputs |
| **LinkedIn Connections.csv** | Datos de contactos-exportados                                    |
| **Facebook friends.json**    | Datos de contactos-exportados                                    |
| **Instagram followers.json** | Datos de contactos-exportados                                    |
| **Gmail contacts.csv**       | Datos de contactos-exportados                                    |
| **HTML/CSS**                 | Dashboard visual generado por Claude                             |

---

## 📊 Sistema de Scoring (5 Dimensiones)

| Dimensión     | Puntos   | Descripción                                                      |
|---------------|----------|------------------------------------------------------------------|
| **Authority** | 30 pts   | ¿Es un comprador? CEO/Founder = máximo, Manager = mínimo         |
| **Scale**     | 20 pts   | Tamaño de empresa = más presupuesto/complejidad                  |
| **Network**   | 25 pts   | Señales públicas de influencia (board seats, speaking, podcasts) |
| **Proximity** | 15 pts   | Qué tan cerca está su industria de lo que ofreces                |
| **Warmth**    | 10 pts   | ¿Tienes su email? ¿Cuánto tiempo conectados?                     |

### Rangos de Prioridad

| Score      | Acción                                            |
|------------|---------------------------------------------------|
| **70–100** | "INVEST NOW" — Reach out esta semana              |
| **50–69**  | "WARM UP" — Engagement en 30 días                 |
| **30–49**  | "WATCH LIST" — Monitorear y re-visitar en 90 días |

**Nota:** Los pesos son ajustables según el modelo de negocio del usuario.

---

## 🔄 Flujo de Trabajo Completo

### Paso 1: Exportar Datos (5 min)
- LinkedIn: Settings & Privacy → Data Privacy → Get a copy → Connections
- Facebook: Download your information → Friends
- Instagram: Download your information → Followers
- Gmail: Google Contacts → Export

### Paso 2: Prompt 1 (Claude pregunta)
> "Which platforms do you have data from: LinkedIn, Facebook, Instagram, Gmail, or a mix? And do you already have the export files, or do you need me to walk you through how to get them first?"

### Paso 3: Prompt 2 (4 preguntas de configuración)

Claude hace 4 preguntas una por una:
1. **Ideal prospect** — ¿Qué job titles representan tu prospecto ideal?
2. **Industry signals** — ¿Qué industrias o señales específicas te interesan?
3. **Communication voice** — ¿Cómo describirías tu forma de hablar? (formal/casual, funny/straight)
4. **CTA** — ¿Qué querés que pase después de que lean tu mensaje?

### Paso 4: Análisis Automático (45 min)
1. Leer archivos CSV/JSON y filtrar por Q1
2. Contar decision-makers vs total
3. Investigar top 25 con web search público (no scraping)
4. Scorear cada uno (100 puntos máx)
5. Escribir mensajes personalizados para top 10
6. Generar HTML dashboard + CSV

---

## ✍️ Reglas para Outreach Messages

- **2–3 oraciones máximo**
- Referenciar algo **real y específico** de la empresa/persona
- Nunca empezar con "I came across your profile" (ya están conectados)
- Nunca decir "hope this finds you well" u otro filler
- Terminar con el CTA definido por el usuario
- **Sonar como un smart friend, no como vendor**

### Ejemplo de Output

> "Managing $1B+ in multifamily assets and speaking at conferences: you're operating at a level where the right AI systems can save serious time on underwriting, investor reporting, and deal flow. I specialize in exactly that intersection. Would love to compare notes."

---

## 📊 Outputs Generados

### 1. CSV con Prospect Shortlist
- Name, Role, Company, Score, Tier
- AI Signal, Outreach Message
- LinkedIn URL, Email

### 2. HTML Intelligence Dashboard
- Diseño custom según preferencias del usuario
- Cards en grid (4–5 visibles above the fold)
- Scoredisplayed como jersey number
- **Copy button en cada mensaje**
- Tier badges, segment bars
- Colores de marca

---

## ⏱️ Métricas de Tiempo

| Actor       | Tiempo                                                         |
|-------------|----------------------------------------------------------------|
| **Usuario** | ~15 min (export, 4 respuestas, revisar, enviar)                |
| **Claude**  | ~45 min (filtrar, investigar 25, scorear, escribir, construir) |
| **Total**   | ~1 hora                                                        |

---

## ⚖️ Compliance & Legal

- **100% ToS compliant** — Solo usa datos propios exportados
- **No scraping** — Solo datos que el usuario descargó
- **No automation que toque LinkedIn** — Todo manual
- **Solo web search público** — Para investigación de prospectos

---

## 💡 Análisis: ¿Por qué funciona este sistema?

### 1. **Data Ownership**
El usuario usa SUS PROPIOS DATOS. No hay riesgo legal.

### 2. **IA como Amplificador, no Reemplazo**
Claude ejecuta la operativa (filtrado, scoring, investigación, writing), pero el humano provee el juicio y envía manualmente.

### 3. **Configuración Personalizada**
Las 4 preguntas de entrada fazem que TODO el output sea custom para el usuario. No es un template genérico.

### 4. **Output Accionable**
No solo dá datos — dá mensajes listos para copiar-y-pegar y un dashboard visual.

### 5. **Sin Dependencia de Herramientas**
Solo requiere Claude Code (gratis). No hay tool subscriptions.

---

## 🔗 Relevancia para Think Different / Unicorn

### Analogías con Nuestro Sistema

1. **Export → Analyze → Output** = El mismo pattern que seguimos en análisis de videos
2. **Scoring system** = Similar a cómo Prioritization Agent scorea tareas/features
3. **Custom prompts based on user input** = El concepto de "setup questions" que guía toda la ejecución
4. **Multi-source data** = Similar a cómo agregamos datos de múltiples canales en Unicorn
5. **Human in the loop** = "You send everything manually" — la IA no automatiza la acción final

### Oportunidades de Mejora

1. **Automatizar el export** — En lugar de 5 min de export manual, podíamos crear un script
2. **Multi-channel outreach** — Envío automático (con permission) vs manual
3. **CRM integration** —直接把 datos a HubSpot/Salesforce
4. **Follow-up tracking** — Saber quién respondió, quién no

---

## 🏷️ Tags

`#prospecting` `#outreach` `#claude-code` `#lead-generation` `#automation` `#linkedin` `#workflow` `#ai-agent` `#human-in-the-loop`

---

*Documentado: 2026-04-14*  
*Fuente: https://stevearneson.com/prospect*
