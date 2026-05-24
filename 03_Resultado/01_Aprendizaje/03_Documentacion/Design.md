# Metodología 

Para implementar esta metodología, el autor del video utiliza una herramienta principal y una "habilidad" (skill) específica de programación. Aquí tienes los detalles técnicos para que puedas replicarlo:

### 1. La herramienta base: Claude Code
No es el chat convencional de la web, sino una interfaz de línea de comandos (CLI) o extensión para IDEs que puede editar archivos directamente en tu computadora.
 * **Qué es:** Un agente de IA que tiene permisos para leer y escribir código en tu sistema local.
 * **Dónde obtenerlo:** Se puede descargar desde claude.ai/download (buscando la pestaña de "Claude Code") o instalando la extensión en editores como **Cursor** o **VS Code**.
### 2. La "Skill" de Diapositivas (HTML Slides)
La metodología se basa en un repositorio que contiene la estructura lógica para que Claude entienda cómo "vibe-codear" (programar por intuición) presentaciones en HTML.

 * **Nombre de la Skill:** html-slides
 * **Autora original:** Zara Zhang (Virgil)
 * **URL del Repositorio:** https://github.com/zarazhang/html-slides

**Cómo se instala en Claude Code:**
Una vez que tienes Claude Code abierto en tu terminal o IDE, simplemente le das la instrucción:
> *"Install this skill: https://github.com/zarazhang/html-slides"*
> 

### 3. Herramientas de Diseño mencionadas

Para el **Nivel 2** (personalización de marca) y **Nivel 3** (componentes), el autor utiliza:
 * **Brand Design Book (PDF):** El usuario carga un manual de identidad corporativa. Si no tienes uno, puedes usar una captura de pantalla de un sitio web que te guste (como Apple.com) y pedirle a Claude que extraiga el "Design System".
 * **Unsplash API:** No necesitas una cuenta, solo pídele a Claude en el prompt: *"Busca imágenes en Unsplash sobre [tema] e intégralas en la diapositiva X"*.
 * **Tailwind CSS y Framer Motion:** Son las bibliotecas de código que Claude utiliza internamente para que las diapositivas se vean modernas y tengan animaciones fluidas sin que tú tengas que escribir el código manualmente.

### Resumen del flujo de trabajo:
 1. **Abres Claude Code** en una carpeta vacía.
 2. **Instalas la skill** de Zara Zhang con la URL de GitHub.
 3. **Cargas tu manual de marca** (o referencias visuales).
 4. **Ejecutas el prompt** pidiendo la presentación, y Claude creará un archivo .html en tu carpeta que podrás abrir en cualquier navegador.
