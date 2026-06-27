---
name: "18_Workflow_Youtube"
description: "Agent: 18_Workflow_Youtube"
---

# Workflow: YouTube — De Idea a Publicación

**Agentes involucrados:** Estratega → Creador → Analista
**Ciclo:** Completo (planificar → producir → medir)

---

## Flujo

```
IDEA (tú)
  │
  ▼
[ESTRATEGA] → Brief de video (target, tono, CTA, keywords)
  │
  ▼
[CREADOR] → Script + Descripción + Tags + Thumbnail brief
  │
  ▼
REVISIÓN HUMANA ✅
  │
  ▼
PUBLICACIÓN (manual o vía MCP)
  │
  ▼
[ANALISTA] → Reporte de rendimiento + optimizaciones
  │
  ▼
FEEDBACK → ESTRATEGA (próximo brief mejorado)
```

---

## Paso a Paso

### 1. Disparador
Tú dices: *"Tengo una idea para un video sobre [tema]"*

### 2. Estratega
```markdown
@Marketing_Estratega
"Generá un brief para un video de YouTube sobre [tema].
Audiencia: [perfil]. 
Objetivo: [educar / vender / construir autoridad].
Formato: [tutorial / caso de estudio / opinión]."
```

**Output:** Brief con hook, key messages, CTA, keywords SEO, referencias.

### 3. Creador
```markdown
@Marketing_Creador
"Tomá este brief y producí:
1. Script completo con hook, desarrollo, CTA
2. Descripción optimizada SEO (primeras 2 líneas clave)
3. Tags (5-10)
4. Brief para thumbnail (qué mostrar, texto, estilo)

Usá la plantilla de youtube-script.md"
```

**Output:** Script + metadata lista para grabar/publicar.

### 4. Revisión Humana
- [ ] Hook atrapa en primeros 5 segundos?
- [ ] Key messages cubiertos?
- [ ] CTA claro?
- [ ] SEO optimizado?
- [ ] Tono consistente con marca?

### 5. Analista (post-publicación, 48h-7d después)
```markdown
@Marketing_Analista
"Analizá el rendimiento de [video]:
- Views vs canal promedio
- Retención (dónde cae)
- CTR del título
- Comentarios (sentimiento)
- Comparar con brief original"
```

**Output:** Reporte + recomendaciones para próximo video.

---

## MCPs Necesarios (futuro)
- YouTube Data API → subir videos, obtener analytics
- Make → automatizar publicación cruzada
- Notion/Airtable → calendario editorial

---

*Marketing Agents v1.0 — Workflow YouTube*
