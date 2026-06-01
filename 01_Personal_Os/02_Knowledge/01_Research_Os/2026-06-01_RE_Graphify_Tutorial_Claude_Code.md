# Ingeniería Inversa: Graphify Tutorial

## Tecnologías usadas
- [Tree-sitter]: Parsing incremental y robusto para crear ASTs de código
  - Purpose: Extraer estructura sintáctica de archivos de código (funciones, clases, imports, etc.)
- [NetworkX]: Biblioteca de Python para creación y manipulación de grafos complejos
  - Purpose: Construir el grafo de conocimiento a partir de nodos y aristas extraídas
- [Leiden algorithm] (vía graspologic): Algoritmo de detección de comunidades basado en densidad de aristas
  - Purpose: Agrupar nodos relacionados en comunidades semánticas para mejor navegación
- [D3.js]: Biblioteca de JavaScript para visualizaciones interactivas basadas en SVG
  - Purpose: Generar la visualización HTML interactiva del grafo (graph.html)
- [tree-sitter]: Parser incremental para múltiples lenguajes de programación
  - Purpose: Extraer ASTs precisos sin necesidad de compilación completa

## Patrones de diseño
- [Pipeline de extracción]: Separación clara entre extracción estructural (AST-only) y semántica (LLM)
  - Permite operación sin API keys cuando solo se necesita comprensión estructural
- [Arquitectura de plugins]: Integración específica por plataforma (Cursor, Claude Code, OpenCode)
  - Cada plataforma tiene su método de instalación y configuración óptima
- [Separation of concerns]: Los distintos outputs tienen propósitos específicos
  - graph.json: Grafo completo para consultas programáticas
  - GRAPH_REPORT.md: Resumen estructural para lectura rápida
  - graph.html: Visualización interactiva para exploración manual
  - manifest.json: Metadatos de la extracción para trazabilidad

## Estructura del contenido
- [Extracción estructural]: Parsing de archivos de código mediante tree-sitter (modo AST-only)
  - Se extraen: clases, funciones, métodos, imports/exports, llamadas, herencias
  - No requiere LLM ni API keys externas
  - Funciona con 25+ lenguajes de programación
- [Extracción semántica]: Procesamiento de documentos, papers, imágenes (requiere LLM)
  - Se extraen: conceptos, relaciones, motivaciones de diseño
  - Utiliza el LLM disponible en la plataforma (Claude, GPT-4, etc.)
  - Se puede omitir con --no-cluster o --no-semantic en algunos comandos
- [Construcción del grafo]: Fusiones de nodos y aristas de ambas extracciones
  - Los nodos representan elementos de código o conceptos semánticos
  - Las aristas representan relaciones (imports, llamadas, referencias semánticas, etc.)
  - Cada edge tiene un tag: EXTRACTED, INFERRED, o AMBIGUOUS
- [Detección de comunidades]: Algoritmo de Leiden para agrupar nodos relacionados
  - Basado en densidad de conexiones internas vs externas
  - Cada comunidad recibe un label automático (o manual con LLM si se especifica)
  - Facilita la navegación a nivel alto (¿en qué área del código estamos?)

## Qué podemos aprender
- [Comprensión arquitectural]: Los "god nodes" (nodos con más conexiones) revelan la verdadera complejidad del código
  - No siempre son los archivos más grandes, sino los más conectados
  - Indican puntos de acoplamiento que podrían necesitar refactorización
- [Análisis de dependencias]: Las relaciones entre nodos muestran el verdadero flujo de dependencias
  - Revela dependencias transitivas no obvias
  - Ayuda a entender el impacto de cambios en un módulo específico
- [Detección de capas]: Las comunidades suelen corresponder a capas arquitecturales (presentation, business logic, data access)
  - Permite validar si el código sigue una arquitectura en capas o está más acoplado
- [Impacto de cambios]: Al consultar el grafo antes de hacer cambios, se puede estimar el alcance
  - Preguntas como "¿qué se vería afectado si cambio este módulo?" tienen respuesta directa
  - Reduce el riesgo de efectos colaterales no intencionales

## Cómo replicar enfoques similares
- [Enfoque 1]: Para proyectos medianos a grandes (>50 archivos), siempre generar un knowledge graph estructural
  - El costo inicial de generación se amortiza rápidamente en reducciones de tokens
  - Especialmente valioso en equipos que usan modelos de lenguaje con límite de tokens
- [Enfoque 2]: Separar la extracción estructural (rápida, sin LLM) de la semántica (más lenta, con LLM)
  - Permite actualizaciones frecuentes del grafo estructural sin costo de API
  - La extracción semántica se puede hacer menos frecuentemente o solo cuando se necesita
- [Enfoque 3]: Integrar el conocimiento graph en el flujo de desarrollo estándar
  - Usar hooks de git para mantener el graph actualizado automáticamente
  - Consultar el graph antes de hacer cambios arquitecturales importantes
  - Usar las consultas de grafo en lugar de grepping cuando sea posible