---
name: premium-image-studio
description: "Suite creativa para generación y gestión de identidades visuales, banners y activos digitales con IA. Triggers: premium image, banner, identidad visual, generar imagen, catalogar assets."
version: 1.0.0
---

# Premium Image Studio

## Esencia Original
> **Propósito:** Generar y gestionar identidades visuales premium con principios de diseño Apple
> **Flujo:** Curar estética → Generar imágenes → Optimizar → Catalogar activos


Esta Skill eleva la generación de imágenes a un nivel de estudio profesional, aplicando principios de diseño de Apple (minimalismo, HSL, reticulado) y orquestando sistemas de gestión de activos.

## Triggers

- "Genera una imagen para mi blog con estilo minimalista."
- "Crea un banner premium para mi perfil."
- "Diseña una identidad visual para un nuevo proyecto AI."
- "Optimiza y cataloga estas imágenes recién generadas."

## Workflow: The Studio Way

### 1. Curación Estética (Design Curation)
Antes de generar, el estudio define los parámetros visuales basados en el **Pilar 1**:
- **Paletas HSL**: Evitar colores planos. Usar `hsl(230, 100%, 67%)` o variantes premium.
- **Glassmorphism**: Aplicar efectos de desenfoque y semitransparencia si el activo es para UI.
- **Grillas**: Asegurar equilibrio visual.

### 2. Deep Prompt Engineering (v4.9)
El estudio no usa prompts simples. Construye comandos detallados que incluyen:
- Iluminación cinemática.
- Composición de regla de tercios.
- Texturas macro y materiales premium (carbono, vidrio esmerilado).

### 3. Orquestación de Motores (Engine Integration)
- Usa `01_Personal_Os/04_Operations/03_Scripts_Os/18_Generacion_Contenido.py` para el contexto creativo.
- Integra `02_High_Value/15_Dieter_Rams_Design` para auditoría de diseño.
- Aplica `03_Utilities/08_Managing_Image_Assets` para:
  - Catalogación en `assets/images/`.
  - Renombrado semántico (ej: `banner_ai_premium_01.png`).
  - Optimización de tamaño.

## Instrucciones de Ejecución

1. **Escuchar**: Identificar el "Sabor" que busca el usuario (Dark Mode, Sleek, Corporate).
2. **Generar**: Invocar las herramientas de generación con prompts vitaminizados.
3. **Validar**: ¿Cumple con los estándares de "Steve Jobs"? Si no, iterar.
4. **Entregar**: Mostrar el resultado e informar la ubicación del archivo en el catálogo.

> [!TIP]
> Para resultados excepcionales, pide al usuario el "Brand Voice" o el tema específico antes de generar.

## ⚠️ Gotchas

### Prompt sin contexto de marca
> Generar imágenes sin conocer el brand voice o la paleta del usuario.

- **Por qué**: Una imagen técnicamente perfecta pero fuera de tono con la marca es ruido visual. El usuario no la va a usar.
- **Solución**: Siempre preguntar por el brand voice antes de generar. Si no hay, pedir 3 referencias visuales.

### Sin catalogación post-generación
> Generar y entregar sin catalogar en el sistema de assets.

- **Por qué**: La imagen se pierde en el filesystem. Nadie la reencuentra.
- **Solución**: Catalogar siempre en `assets/images/` con nombre semántico (`proyecto_tipo_variante_01.png`).

### Exceso de glassmorphism
> Aplicar desenfoque y semitransparencia en toda la composición.

- **Por qué**: Glassmorphism en exceso reduce legibilidad y se siente como trend de 2023.
- **Solución**: Glass solo en overlays de navegación o modales. El contenido principal siempre opaco.

---

## 💾 State Persistence

> **Qué persists**: Assets generados, catalogación en sistema de archivos, paletas por proyecto.
> **Dónde**: `assets/images/` con naming semántico (`proyecto_tipo_variante_01.png`).
> **Cuándo restore**: Al iniciar una sesión para un proyecto existente, recuperar el brand voice, paletas y assets previos del proyecto desde el sistema de archivos.
> **Formato**: Archivos de imagen en disco + metadatos en Eagle (tags, anotaciones, ratings).

### Estado que se preserva entre sesiones:
1. **Brand Voice activo**: Recuperar del YAML de la skill de Brand Voice si existe.
2. **Paletas por proyecto**: Última paleta HSL usada para cada proyecto.
3. **Catálogo de assets**: Lista de assets generados con nombres semánticos.
4. **Configuración de motor**: Último motor usado (DALL·E, Midjourney, Stable Diffusion).

---

*Skill Version: 1.0.0*
