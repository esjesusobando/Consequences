---
title: "Producción de Contenido — Ciclo Completo"
version: 1.0
owner: "Estratega de Marketing"
last_reviewed: "2026-06-27"
tags: [contenido, produccion, editorial, marketing]
dependencies:
  - "Brand Voice Guide"
  - "BRIEF_TEMPLATE.md"
  - "01-onboarding-nuevo-cliente.md"
inputs:
  - name: "brief_contenido"
    type: "document"
    description: "Brief con objetivos, audiencia, tono y KPIs de la pieza o campaña"
  - name: "calendario_editorial"
    type: "document"
    description: "Calendario con fechas y plataformas de publicación"
  - name: "brand_assets"
    type: "folder"
    description: "Logo, colores, tipografía, ejemplos de tono"
outputs:
  - name: "pieza_contenido"
    type: "document"
    description: "Pieza de contenido lista para publicar (post, thread, newsletter, artículo)"
  - name: "analytics_post"
    type: "report"
    description: "Métricas de performance a los 7 días de publicación"
  - name: "lecciones_aprendidas"
    type: "document"
    description: "Notas sobre qué funcionó y qué mejorar para la próxima iteración"
---

# Playbook: Producción de Contenido — Ciclo Completo

## Objetivo
Producir contenido consistente y de alta calidad para clientes de la agencia, siguiendo un ciclo reproducible desde la ideación hasta la medición de resultados. El ciclo completo no debería tomar más de 4 horas por pieza principal.

## Cuándo Usarlo
- Cuando hay que producir una pieza de contenido nueva (post, thread, newsletter, artículo)
- Cuando se arranca una campaña con múltiples piezas
- Cuando un cliente nuevo necesita contenido desde el día 1
- Cuando una pieza existente necesita ser adaptada a otra plataforma

## Actores
- **Estratega**: define el qué, el por qué, y el tono. Aprueba el brief y la pieza final.
- **Creador**: redacta el contenido siguiendo el brief y la brand voice.
- **Analista**: revisa calidad, verifica KPIs y mide resultados post-publicación.

## Prerrequisitos
- [ ] Brief de contenido completado (objetivo, audiencia, tono, CTA)
- [ ] Brand voice del cliente documentada
- [ ] Calendario editorial con fechas asignadas
- [ ] Acceso a las plataformas de publicación
- [ ] Template de pieza (si aplica)

---

## Paso a Paso

### 1. Ideación y Brief (Estratega — 30 min)
Definir qué se va a producir y por qué.

**Input:** Calendario editorial + objetivos del cliente
**Output:** Brief de contenido aprobado

```yaml
brief_contenido:
  cliente: "{{nombre del cliente}}"
  pieza: "post | thread | newsletter | articulo"
  objetivo: "awareness | engagement | conversion | authority"
  audiencia:
    perfil: "{{descripción}}"
    dolor: "{{qué problema resuelve}}"
  tono: "{{brand voice del cliente}}"
  hook_idea: "{{idea principal para el gancho}}"
  cta: "{{qué querés que haga el lector}}"
  kpis:
    - "{{kpi 1}}"
    - "{{kpi 2}}"
```

**Check:**
- [ ] El hook responde a un interés real de la audiencia?
- [ ] El objetivo es medible?
- [ ] El CTA está alineado con la campaña activa?

### 2. Drafting (Creador — 60 min)
Redactar la pieza siguiendo el brief.

**Input:** Brief aprobado
**Output:** Borrador de la pieza

#### Para posts de LinkedIn:
1. Hook (primera línea) — captura atención en < 150 caracteres
2. Cuerpo (3-5 párrafos) — desarrolla la idea con ejemplos concretos
3. CTA (última línea) — qué acción querés que tomen
4. Alt text para imágenes

#### Para threads de Twitter/X:
1. Tweet 1: hook + hilo conductor
2. Tweets 2-N: desarrollo puntual, un concepto por tweet
3. Tweet final: conclusión + CTA + link a recurso
4. Cada tweet debe funcionar standalone

#### Para newsletters:
1. Asunto: < 50 caracteres, despierta curiosidad
2. Saludo + contexto de la edición
3. Cuerpo: 1 idea principal + 2-3 ideas secundarias
4. Recursos / lecturas recomendadas
5. Despedida + CTA

#### Para artículos de blog:
1. Título SEO: < 60 caracteres, incluye keyword principal
2. Introducción: el problema que resuelve el artículo
3. Desarrollo: secciones con subtítulos
4. Conclusión: resumen + CTA
5. Meta description: < 160 caracteres

**Check:**
- [ ] Sigue la brand voice del cliente?
- [ ] El hook funciona sin contexto previo?
- [ ] El CTA es claro y accionable?
- [ ] Sin jerga interna del cliente que la audiencia no entienda?

### 3. Revisión de Calidad (Analista — 20 min)
Revisar el borrador contra los quality gates antes de pasar a diseño/publicación.

**Input:** Borrador de la pieza
**Output:** Feedback estructurado + pieza aprobada / rechazada / con cambios

**Checklist de revisión:**
- [ ] Hook potente: engancha en las primeras 2 líneas?
- [ ] Claridad: se entiende sin conocimientos previos?
- [ ] Tono consistente: coincide con la brand voice del cliente?
- [ ] Brief alignment: cumple el objetivo definido?
- [ ] CTA presente: el lector sabe exactamente qué hacer?
- [ ] Sin errores: ortografía, gramática, datos incorrectos?
- [ ] Longitud adecuada para la plataforma?
- [ ] Incluye elementos visuales (si aplica)?

**Si hay cambios:** devolver al Creador con comentarios específicos. Ejemplo:
> "El hook es débil — no deja claro por qué debería importarle al lector. Probá con un dato concreto en lugar de una pregunta genérica."

### 4. Publicación y Distribución (Creador — 15 min)
Publicar la pieza en la plataforma correspondiente y configurar tracking.

**Input:** Pieza aprobada
**Output:** Pieza publicada + parámetros de tracking

1. Publicar en plataforma (LinkedIn, Twitter, Newsletter, Blog)
2. Configurar UTM parameters: `?utm_source={plataforma}&utm_medium=social&utm_campaign={campaña}`
3. Si es newsletter: programar envío en Mailchimp / ConvertKit / equivalente
4. Compartir internamente: avisar al equipo que la pieza está publicada
5. Si aplica: programar repost o variante para otras plataformas

**Check:**
- [ ] UTM parameters configurados?
- [ ] Preview visual ok en la plataforma?
- [ ] Links funcionan? (probar cada uno)
- [ ] Imágenes subidas correctamente?

### 5. Medición y Aprendizaje (Analista — 15 min a los 7 días)
Medir la performance de la pieza y documentar aprendizajes.

**Input:** Pieza publicada + 7 días de datos
**Output:** Reporte de performance + lecciones aprendidas

1. Recolectar métricas a los 7 días:
   - Impresiones / alcance
   - Engagement (likes, comments, shares, clicks)
   - CTR (si aplica)
   - Conversiones (si aplica)
2. Comparar contra KPIs del brief
3. Documentar qué funcionó y qué mejorar:
```yaml
lecciones:
  pieza: "{{título}}"
  plataforma: "{{plataforma}}"
  funcionó:
    - "{{qué funcionó}}"
  mejorar:
    - "{{qué mejorar}}"
  kpis_cumplidos: true | false
  notas: "{{aprendizajes para próxima iteración}}"
```
4. Archivar en `01_Personal_Os/05_Projects/{cliente}/lecciones/`

---

## Calidad Gates

- [ ] Brief aprobado antes de empezar a redactar
- [ ] Brand voice documentada y accesible para el Creador
- [ ] Borrador revisado por Analista antes de publicar
- [ ] Tracking configurado antes de la primera publicación
- [ ] Métricas recolectadas a los 7 días
- [ ] Lecciones documentadas y archivadas

## Errores Comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Brief vago | Contenido fuera de foco, no resuena | Volver a ideación con preguntas más específicas |
| Brand voice inconsistente | El contenido suena a otro cliente o a IA genérica | Revisar brand voice guide, agregar ejemplos concretos de tono |
| Sin CTA | El lector no sabe qué hacer | Agregar CTA explícito en los últimos 2 párrafos |
| Hook débil | Bajo engagement en los primeros segundos | Reescribir hook con dato, pregunta provocadora o historia |
| Sin tracking | No se puede medir ROI | Configurar UTM antes de publicar, no después |
| Publicar sin revisión | Errores que dañan credibilidad | Siempre pasar por calidad gates antes de publicar |
| Métricas no recolectadas | No se aprende de lo que funciona | Agendar recordatorio a los 7 días post-publicación |

## Métricas

| Métrica | Target | Cómo medir |
|---------|--------|-----------|
| Tiempo brief → publicación | < 4h por pieza | Timeline tracking |
| Piezas aprobadas al 1er review | 80%+ | Analista tracker |
| Engagement rate por plataforma | > 3% LinkedIn, > 1% Twitter | Analytics nativo |
| KPIs cumplidos por pieza | 70%+ | Comparación vs brief |
| Lecciones documentadas | 100% de las piezas | Archivo en carpeta de lecciones |

---

## Histórico

| Versión | Fecha | Cambio | Autor |
|---------|-------|--------|-------|
| 1.0 | 2026-06-27 | Creación inicial | Capital Token |
