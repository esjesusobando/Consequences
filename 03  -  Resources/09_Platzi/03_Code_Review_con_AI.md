
https://github.com/platzi/tests-codereview-ai/tree/preclase-02-catalogo-inicial
## Resumen

Aprender a juzgar la inteligencia artificial en tus revisiones de código y tests es la habilidad que separa a quien solo produce de quien decide. Este contenido es para ingenieros de software que ya usan IA a diario y necesitan saber cuándo confiar en ella y cuándo intervenir, medido con números y no con corazonadas.

Imagina esta escena: le pides a la IA que revise tu _pull request_ y te devuelve 18 comentarios impecables sobre nombres de variables. Pero el bug de seguridad que estaba en una de las líneas ni lo vio. Y aquí viene lo incómodo: aunque la herramienta falló, tú sigues siendo el responsable.

Por qué juzgar la IA importa más que usarla

La mayoría de los ingenieros ya sabe usar herramientas de inteligencia artificial. Producen mucho, muy rápido. El problema es que casi nadie sabe si lo que salió realmente sirve.

Por eso el foco no está en aprender a usar la IA, sino en **juzgarla y mejorar tu interacción con ella** para obtener mejores resultados en tests y revisiones. Se trata de tres capacidades concretas:

- Distinguir cuándo confiar en la IA y cuándo intervenir manualmente.
- Medir su desempeño con números en lugar de intuición.
- Mejorar la interacción para producir resultados más confiables.

> **¿Por qué no basta con que la IA revise mi código?** Porque puede generar comentarios correctos pero irrelevantes, como observaciones sobre nombres de variables, y pasar por alto fallos críticos como un bug de seguridad. La responsabilidad final sigue siendo tuya.

En un mercado donde cualquiera le puede pedir código a una inteligencia artificial, el diferencial deja de ser producir y pasa a ser decidir [1:52].

Cómo se aprende a validar tests y revisiones con IA

Todo el aprendizaje ocurre sobre un proyecto real: un servicio de pagos que arranca funcionando, pero que por dentro está lleno de trampas puestas a propósito [0:56]. Esas trampas son las que te obligan a afinar el criterio.

El recorrido práctico se construye en etapas claras:

1. Hacer que la IA genere tests que realmente prueben algo, no solo tests decorativos.
2. Validar esa suite de tests contra un conjunto de reglas que ya no aceptan engaños.
3. Montar un revisor de código que emita veredictos consumibles por un _pipeline_, y no párrafos sueltos.
4. Calibrar ese revisor contra decisiones humanas reales.
5. Integrar todo en un flujo de _continuous integration, continuous deployment_.

Cada paso apunta a lo mismo: que la IA deje de ser una caja negra y se convierta en algo que puedes medir y auditar.

> **¿Qué es una suite de tests validada contra reglas?** Es un conjunto de pruebas evaluado con criterios estrictos que verifican si los tests realmente comprueban comportamiento útil, en lugar de aceptar tests que pasan sin probar nada real.

Qué es un revisor de código con veredictos consumibles

Un buen revisor automatizado no te entrega opiniones sueltas. Emite un **veredicto estructurado** que un _pipeline_ puede leer y usar para tomar decisiones automáticas [1:07]. La diferencia es enorme: un párrafo suelto lo tiene que interpretar un humano; un veredicto consumible lo procesa la máquina.

Y hay un detalle clave: ese revisor se calibra contra decisiones humanas reales para descubrir en qué categorías es de fiar y en cuáles no [1:12]. No confías en él a ciegas, confías donde los datos dicen que acierta.

Cómo integrar la IA en un flujo de CI/CD que mejora solo

El objetivo final es integrar todo en un flujo de _continuous integration, continuous deployment_ que mejora solo con cada error que captura [1:22]. Cada fallo detectado alimenta el sistema y lo vuelve más preciso con el tiempo.

> **¿Qué es continuous integration, continuous deployment (CI/CD)?** Es un flujo automatizado que integra y despliega cambios de código de forma continua. Aquí se usa para que las revisiones con IA se ejecuten y aprendan automáticamente en cada iteración.

Lo importante no es el proyecto en sí. Lo importante es el método que se instala en ti: una forma de trabajar que te convierte en el profesional al que el equipo mira cuando la pregunta es si se puede confiar o no en algo para producción [1:40].

Qué habilidades y conceptos desarrollas

Detrás de este recorrido hay competencias muy concretas que vale la pena nombrar:

- Criterio técnico para decidir cuándo la IA es confiable y cuándo no [0:33].
- Generación de tests significativos, que prueban comportamiento real y no cobertura vacía [0:59].
- Diseño de un revisor de código con salida estructurada para _pipelines_ [1:07].
- Calibración contra decisiones humanas para mapear fortalezas y debilidades por categoría [1:12].
- Automatización en _CI/CD_ con retroalimentación continua [1:22].

Tu profesora en este camino es María Paula Duque, ingeniera de software [1:28], y el mensaje de fondo es directo: producir código ya no es el diferencial, decidir sobre él sí lo es.

¿Con cuál de estas etapas crees que tu equipo tiene hoy el mayor punto ciego? Cuéntamelo en los comentarios.

---

## Resumen

Cuando le pides a la IA que escriba tests o revise código, obtienes respuestas que parecen profesionales pero fallan de formas muy específicas. Aprender a detectar esos fallos es la base para dejar de confiar ciegamente en la IA y empezar a supervisarla con criterio, algo clave para cualquier desarrollador que use herramientas de generación de código.

El proyecto que usamos durante todo el curso es _Payments USC_, una API de pagos en _Python_ con _FastAPI_ que además incluye un _SDK client_ en _TypeScript_. Es un servicio financiero pequeño pero con la complejidad suficiente para lo que buscamos [00:36]. Y aquí viene lo interesante: **este repositorio tiene bugs y vulnerabilidades sembrados a propósito** para descubrirlos clase a clase [01:09].

Qué pasa cuando le pides tests a la IA con un prompt ingenuo

Imagina que quieres crear los tests del módulo `amounts.py`, que maneja toda la lógica del dinero: define tipos de cambio, comisiones mínimas por moneda y utilidades para parsear, validar montos, redondear centavos y calcular comisiones totales [01:47].

El **prompt ingenuo** es el que cualquiera escribiría la primera vez: literalmente "escribe los tests para amounts.py" [02:21]. Unos minutos después, la IA devuelve 40 tests que corren con _PyTest_ y pasan todos [02:36]. Se ve como una suite profesional.

> **¿Por qué un test que pasa no significa que sea correcto?** Porque un test puede documentar el comportamiento actual del código en lugar de verificar la regla de negocio real. Si el código tiene un bug, el test lo valida como si fuera correcto y pasa igual.

Por qué la IA no distingue entre el código y la lógica de negocio

Entre esos 40 tests hay uno con un error inyectado a propósito: dice que el _fee_ es cero cuando el monto es cero [03:20]. El problema es que Cloud no supo diferenciar si debía respetar el código existente o la lógica de negocio real.

Y ahí está la trampa. No puedes identificar ese fallo con solo mirar los tests por encima. Las preguntas que quedan sin respuesta son demoledoras:

- ¿Qué otras cosas asumió mal la IA?
- Si cambias una línea del código, ¿alguno de esos 40 tests lo detecta?
- ¿Cuáles tests sobran y cuáles faltan?

El problema no es que el test pase o no, sino que **no tienes un criterio para evaluarlo** [04:15].

Qué falla cuando le pides revisar un pull request

Lo mismo ocurre si creas un _pull request_ y solo le dices "revisa este PR". La IA devuelve un párrafo genérico: el código se ve bien, una sugerencia de nombre de variable, un comentario sobre un espacio [04:25].

> **¿Por qué la IA no detecta los bugs importantes en una revisión de código?** Porque sin una rúbrica clara no sabe qué buscar. Si los bugs no aparecen y tú tampoco sabes qué buscar, no notas su ausencia.

Cuáles son los tres modos más comunes en que falla la IA

Estos tres patrones se repiten y conviene reconocerlos [05:03]:

1. **Alucina APIs y paquetes.** Se inventa funciones que no existen o importa librerías que nadie publicó, y lo hace con tanta seguridad que un atacante podría registrar esa librería falsa. Esto se conoce como _Slop Squat_.
2. **Olvida las autorizaciones.** Escribe _endpoints_ que verifican que estás logueado, pero olvidan verificar que tengas permisos para la acción.
3. **Te da la razón en lugar de retarte.** La IA está diseñada para complacerte: si pides tests, te da tests diseñados para pasar. Pero un buen test existe para intentar romper el código.

Cómo se estructura el trabajo del curso en cuatro bloques

Todo lo que construimos se divide en cuatro bloques prácticos que funcionan como mapa de ruta [05:58]:

1. **Generar pruebas** tratando la generación de tests como un problema de evaluación, no de escritura.
2. **Revisar código** construyendo un revisor automático, el _LLM as Judge_, y calibrándolo.
3. **Auditar lo existente** soltando la IA sobre código que no conoce para buscar bugs y vulnerabilidades, siempre con escepticismo.
4. **Integrar y calibrar** convirtiendo el trabajo en una infraestructura real de _continuous integration_ y _continuous deployment_.

Qué son los evals y por qué son lo mismo que el testing

Debajo de todo hay un concepto fundamental: los _evals_. En la industria de la IA, los _evals_ son exámenes estandarizados para medir el desempeño de un modelo [06:47].

Y aquí está la revelación: **la disciplina de los evals y el testing tradicional son, en esencia, lo mismo con distintos nombres** [07:04]:

- Un _LLM as Judge_ equivale a un revisor de PR con IA.
- Un _red teaming_ o ataque dirigido equivale a tests de seguridad o adversariales.
- Un _regression eval_ equivale a la compuerta del _continuous integration_ que no deja entrar basura.

Cómo funciona el archivo failures.md como catálogo de fallos

El primer artefacto del curso es un archivo llamado `failures.md`, creado en la raíz del proyecto [07:52]. Será tu catálogo de fallos específicos del repo y por módulo.

Se inaugura anotando lo que la IA ignoró o hizo mal al crear los tests. Por ejemplo, la entrada sobre el _fee_ en cero: la IA documentó el comportamiento actual del código, que no devuelve _fee_ cuando el monto es cero, como si fuera el contrato de negocio, sin cuestionar si debería aplicar el _fee_ mínimo [08:32].

El detalle concreto: cuando el _amount_ es 0.03 sí devuelve un _fee_, pero cuando es cero no devuelve ninguno, tratando ese valor de forma inconsistente [09:04]. Para cerrar, se hace _commit_ con el mensaje "catálogo de fallos inicial" [09:24].

La idea central es dejar de ver la IA como un generador mágico de respuestas y empezar a verla como **un motor que necesita supervisión, calibración y criterios claros** [09:47]. Pasamos de preguntar qué dice la IA a preguntar cómo sabemos que lo que dice es cierto.

¿Ya te has encontrado con tests que pasan pero esconden un bug? Cuéntame en los comentarios cómo lo detectaste.

----

## Resumen

El catálogo de fallos es la pieza que separa a un tester experto de uno que solo mira la superficie y dice que todo se ve bien. Si le pides tests a la IA de entrada, obtienes _happy paths_ decorados. La clave está en definir primero qué probar, y eso te toca a ti, porque entiendes el negocio.

Esto es para quienes escriben pruebas asistidas por IA y quieren que cubran los puntos que de verdad importan, no los fáciles.

Por qué escribir el test dejó de ser lo caro

El trabajo cambió de lugar. Antes lo costoso era escribir el código del test. Hoy escribirlo toma segundos y lo escaso es saber qué probar.

Por eso en esta etapa no escribimos ni una línea de test. En su lugar llenamos el _failures mode_, ese archivo que dejamos casi vacío y que va a convertirse en el corazón del proceso [00:15].

El catálogo de fallos es una lista de verificación con doble función:

- Como semilla de _prompts_: cada modo de falla se convierte en una instrucción concreta que la IA usa para generar el test que lo cubre.
- Como rúbrica de calificación: cuando la IA devuelve una suite, el catálogo es la regla contra la que mides si cumplió o si se quedó con lo fácil [00:52].

Y aquí viene lo interesante: el catálogo lo lideras tú, la IA solo te ayuda a explorar.

> **¿Qué es un catálogo de fallos?** Es una lista de verificación con los modos en que un módulo puede fallar. Sirve para generar tests dirigidos y para calificar si esos tests cubrieron lo importante.

Cuáles son las familias clásicas de modos de falla

Existen familias que se repiten en el diseño de pruebas y que funcionan como referencia para estructurar todo. No son sobre la IA, son sobre el dominio [02:20].

1. **Valores de frontera**: qué pasa justo en el límite. Cuando _amount_ es cero, en un céntimo mínimo, en el máximo permitido [01:32].
2. **Particiones de equivalencia**: qué clase de entrada se comporta distinto. Un valor positivo, uno cero, uno negativo, uno no numérico [01:47].
3. **Null o vacío**: qué pasa si falta el dato. Si _user ID_ es _none_, si hay una divisa ausente, un cuerpo vacío [02:00].
4. **Condiciones de carrera**: qué pasa si ocurre dos veces a la vez. Por ejemplo, un doble reintento del SDK sin idempotencia [02:08].
5. **Bypass de autorización**: puede actuar quien no debería. Por ejemplo, reembolsar a una cuenta que no es la tuya [02:15].

Estas cinco categorías son sobre el negocio, no sobre la herramienta. Por eso quien entiende el negocio de pagos manda, y la IA explora.

Cómo pedirle a la IA que explore en vez de generar tests

En lugar de pedir tests directamente, le damos a la IA un trabajo de exploración más profundo. Se hizo para `amounts.py`, pero aplica a todos los módulos importantes que quieras testear [03:00].

El _prompt_ pide algo distinto:

text No escribas test. Recorre amounts.py y enumera todos los modos de falla agrupados por frontera, equivalencia, null/vacío y contrato de negocio. Para cada modo de falla entrega: un ID, categoría, riesgo, entrada que lo dispara, comportamiento actual observado, contrato esperado recomendado, estado del contrato (confirmado / pendiente de decisión) y por qué importa para pagos.

La instrucción incluye una regla decisiva: no asumas que la implementación actual es correcta. Si no puedes inferir el contrato de negocio, márcalo como pendiente en vez de convertir el comportamiento actual en especificación [03:50].

Esto importa porque luego será tu tarea confirmar cuál debe ser el comportamiento real, y ahí es donde encuentras y resuelves _bugs_ [04:15].

> **¿Por qué no dejar que la IA asuma el contrato de negocio?** Porque convertiría el comportamiento actual en especificación, incluso si ese comportamiento es un bug. Marcarlo como pendiente obliga a una decisión humana.

Qué distingue un fallo confirmado de uno pendiente de decisión

La IA devolvió un catálogo curado con alrededor de 12 modos de falla, divididos por las categorías pedidas. Algunos quedaron confirmados y otros pendientes [04:30].

El caso confirmado fue el N2 de null o vacío. En `normalize_currency`, cuando llega un entero o una lista en lugar de un _string_, el código lanza un _attribute error_ sin capturar en vez de un _currency error_. Es una inconsistencia observable, no necesita decisión de negocio [05:00].

El caso pendiente fue el B2, de frontera: el del cero. Cuando el monto es cero, el código retorna _fee_ cero e ignora el mínimo de 30 centavos. La IA no sabe si eso es intencional ni cuál es la política real del negocio, así que decidir sola sería peligroso [05:30].

Esa es exactamente la línea:

- **Confirmado**: comportamiento claro en el código, sin ambigüedad de negocio.
- **Pendiente de decisión**: requiere que un humano defina cuál debe ser el contrato real.

Los pendientes son esos _bugs_ inyectados a propósito que necesitan tu firma para resolverse.

Por qué el catálogo se vuelve un activo versionado del repo

Con el resultado ya curado, la IA reemplaza las dos entradas iniciales del _failures mode_ por un catálogo estructurado por categoría y por módulo [06:10].

Ahora ese archivo es un activo del repo, versionado y con tu firma encima de las decisiones de negocio que lo requieran [06:40]. Eso significa que:

- Alimenta el _prompt_ que generará tests que cubran los puntos álgidos.
- Sirve como rúbrica para calificar lo que la IA produzca.
- Se mantiene como fuente de verdad para futuras iteraciones.

En la siguiente etapa este catálogo se convierte en el motor de un _prompt_ que sí genera tests útiles, usando una estructura de tres capas que no le deja a la IA decidir qué merece probarse [07:05].

¿Ya identificaste los modos de falla críticos de tu propio dominio? Cuéntame en los comentarios cuáles crees que la IA marcaría como pendientes.

**PROMPT:**

No escribas tests.

Recorre amounts.py y enumera modos de falla agrupados por frontera, equivalencia, null/vacio y contrato de negocio. Para cada modo de falla, entrega esta estructura:

- ID:
- Categoria:
- Riesgo:
- Entrada que lo desestima:
- Comportamiento actual observado en el código:
- Contrato esperado recomendado:
- Estado del contrato: confirmado I pendiente de decisión
- Por que importa para pagos:

No asumas que la implementación actual es correcta. Si no puedes inferir el contrato de negocio, márcalo como pendiente en vez de convertir el comportamiento actual en especificación. Sé mesurado


Me parece un framework sencillo de seguir para realizar prubas:

1. **Valores de frontera**: qué pasa justo en el límite. Cuando _amount_ es cero, en un céntimo mínimo, en el máximo permitido.
2. **Particiones de equivalencia**: qué clase de entrada se comporta distinto. Un valor positivo, uno cero, uno negativo, uno no numérico.
3. **Null o vacío**: qué pasa si falta el dato. Si _user ID_ es _none_, si hay una divisa ausente, un cuerpo vacío.
4. **Condiciones de carrera**: qué pasa si ocurre dos veces a la vez. Por ejemplo, un doble reintento del SDK sin idempotencia.
5. **Bypass de autorización**: puede actuar quien no debería. Por ejemplo, reembolsar a una cuenta que no es la tuya.

---

RESUMEN
Escribir tests con IA suena tentador, pero pedir "escribe test para esta función" produce ruido sintácticamente perfecto que no prueba nada. Aquí aprendes a construir un prompt de tres capas que convierte a la IA en un ejecutor de tus decisiones, no en un inventor de comportamientos. Es material clave para desarrolladores que quieren tests confiables y auditables.

La premisa es directa: un prompt vago le delega a la IA una decisión que es tuya. Hoy le devuelves esa decisión a su dueño y usas la IA solo para ejecutar lo que tú ya pensaste.

Por qué un prompt vago para tests genera ruido

Cuando le dices a la IA "escribe test para esta función" sin contexto, ella tiende a inyectar datos estáticos y perezosos. Te pone un monto de 100 o una moneda dólar y produce lo que en la clase llaman un test decorativo: se ve bien en el repositorio, pasa, pero no presiona el código en absoluto.

Y aquí viene lo interesante. En un sistema de pagos la lógica no falla con 100 dólares. Falla cuando inyectas un monto en el límite exacto del céntimo, cuando envías divisas con caracteres extraños o cuando intentas procesar un valor negativo [4:30].

¿Qué es un test decorativo? Es un test que pasa pero no verifica nada real. Usa datos genéricos como un monto de 100 y nunca golpea los bordes donde el código realmente se rompe.

Cómo funciona el prompt de tres capas para tests

La estructura es simple: tres capas y cada una responde una pregunta distinta [0:26]. Qué hace el sistema, dónde puede romperse y qué fórmula debe tener el test para que sea auditable de un vistazo.

Qué incluye cada capa del prompt

Cada capa cumple una función específica y no se mezclan entre sí:

Sistema bajo prueba: describes exactamente qué hace la función, sus firmas, los contratos y sus dependencias. El objetivo es dar contexto duro para que la IA no alucine comportamientos que no existen [1:03].
Modos de falla: pegas directamente en el prompt las clases de equivalencia y los casos límite de tu catálogo. Aquí inyectas el cerebro de la operación y fuerzas a la IA a salir del happy path [1:31].
Forma del test: exiges un test por clase, con fixtures ricos y una estructura estandarizada. Si la salida no es legible, no es fácil de auditar [2:04].
La capa dos es donde vive tu conocimiento del negocio. Somos nosotros quienes sabemos cómo debe comportarse el sistema, así que forzamos a la IA a golpear los bordes en lugar de quedarse en el camino feliz.

Qué es la estructura triple A en un test

A la tercera capa siempre le exiges la estructura triple A: arrange, act y assert. Ese es el esqueleto innegociable de un buen test [2:37].

Arrange o preparar: configuras el escenario inicial con los datos de entrada, los fixtures y el estado. Por ejemplo, creas un usuario, inyectas un balance o generas un token de sesión [2:47].
Act o actuar: ejecutas la acción bajo prueba, pero solo una acción. Por ejemplo, llamas al endpoint con un modo negativo [3:04].
Assert o afirmar: verificas el resultado. Por ejemplo, esperas una respuesta 400 Bad Request con un mensaje de error específico [3:15].
Pedir esta estructura explícitamente hace que los tests sean comparables entre sí. Un test que mezcla 10 actions y 15 asserts es imposible de revisar [3:34].

¿Para qué sirve la estructura triple A? Estandariza cada test en tres bloques (preparar, actuar, afirmar) para que puedas auditarlo de un vistazo y compararlo con otros tests.

Cómo cerrar modos de falla pendientes antes de generar tests

Antes de escribir los tests hay que cerrar los modos de falla que quedaron pendientes de decisión. La idea es tomar la lógica de negocio real y especificar, para cada caso, cuál es el comportamiento correcto.

En la clase quedaron dos ejemplos claros:

Pérdida de precisión con float: si entra un float, Python puede introducir decimales basura y el monto cobrado queda mal. La decisión humana fue que parse_amount debe rechazar entradas float con AmountError [5:38].
Monto en cero: un monto de 0.00 no cobra comisión, pero 0.01 ya cobra 0.30 dólares de comisión mínima. La decisión humana fue que los montos de cobro en cero son inválidos y validate_amount con decimal cero debe fallar con AmountError [5:04].
El prompt aquí es explícito: no escribas tests todavía, no cambies código de producción, cierra exactamente estos modos pendientes y no otros [5:26]. Cada decisión humana se convierte en un contrato verificable con la misma estructura que ya tenían los modos cerrados.

Qué significa que fallen tests recién generados

Al correr el prompt de tres capas se generaron los tests con la estructura triple A. La instrucción fue clara: usar solo modos de falla con estado de contrato confirmado y listar al final cualquier modo pendiente como pregunta abierta [7:22].

Un detalle técnico: en la iteración anterior se usó pytest, pero esta vez se especificó unittest como framework [8:20]. Al ejecutar la suite el resultado fue revelador.

¿Es malo que fallen tests recién generados? No siempre. Si los tests están basados en contratos oficiales y fallan, significa que encontraron bugs reales en el código, no errores en los tests.

De 29 tests, fallaron cinco [9:04]. Y eso es una buena señal, porque el prompt no solo generó tests: encontró bugs reales. Los tests estaban basados en los contratos confirmados, así que el problema estaba en el código, no en la prueba.

Cómo arreglar el código sin tocar los tests

Aquí entra una lógica parecida al test driven development. Como los tests ya definen lo que debe pasar, ahora hay que ajustar el código para que cumpla el contrato.

El prompt de corrección tiene reglas estrictas [10:12]:

No cambies tests, no cambies el failures mode y no agregues dependencias.
Para cada test fallido, identifica el ID del modo de falla que lo cubre.
Si el test representa un contrato confirmado y es correcto, ajusta el código con el cambio mínimo.
Si el test no está alineado con un contrato confirmado, no cambies el código para satisfacerlo, explícalo.
Tras correr ese prompt, la IA arregló el código, dejó un análisis de qué modo de falla usó para corregir cada parte y no tocó ningún test. Al ejecutar de nuevo, los 29 tests pasaron [11:10].

Pero cuidado con la falsa tranquilidad. Que un test pase no prueba nada por sí solo: puede estar en verde porque tu código es correcto o porque tu test no verifica nada. Distinguir entre esos dos casos requiere un oráculo, no un puntaje inventado por la IA.

¿Ya probaste estructurar tus prompts de test por capas? Cuéntame en los comentarios qué bugs reales te ayudó a descubrir.

---

# Prompt

No escribas test todavia.

No cambies codigo de producccion.

Usa FAILERE-MODES.md

Cierra exactamente estos modos pendientes y no otros:

- FM-EQUIV-01: Decision humana = parse_amounr debe rechazar entradas floatcon AmountError.

- FM-FRONT-03: Decision humana = los montos de cobro en cero son invalidos; validate_amount(Decimal("0")) debe fallar con AmountError.

Para cada uno, ayudame a convertir la decision humana en contrato verificable.

Entrega las respuestas con esta estructura:

- ID:

- Decision humana:

- Contrato resultante:

- Razon de negocio:

- Impacto esperado en tests:

- Cambio recomendado en FAILURE-MODES.md:

No cambies estas decisiones.

No cierres otros pendientes.

No conviertas el comportamiento actual del codigo en especificaiones si contradice estas decisiones.

2.1. prompt

[INSTRUCCIONES]

- No cambies codigo de produccion.

- No inventes contratos nuevos.

- Genera tests unitarios para los modos de falla cuyo estado del contrato sea confirmado en FAILURE-MODES.md. Si encuentras otro modo pendiente de decision, no escribas tests para el; listalo al final como pregunta abierta.

[CAPA 1 - Sistema bajo prueba]

Modulo: src/payments_svc/amounts.py

Framwork de test: unittest de la libreria estandar.

Archivo destino: tests/payments_svc/amounts_test.py

Funciones bajo prueba: parse_amounts, normalize_currency, validate_amounts, round_amount, round_money, calculate_fee, y total_with_fee.

[CAPA 2 - Modos de falla a cubrir]

- Lee FAILURE-MODES.md y usa las decisiones de contrato ya reflejados en sus contratos esperados.

- Usa solo los modos de falla de amounts.py cuyo Estado del contrato sea confirmado.

- No escribas test para otros modos que sigan pendientes de decisión.

[CAPA 3 - Forma de salida]

- Entrega solo el contenido test/test_amounts.py.

- Usa unittest.

- Cada test debe tener un comentario corto con el ID del modo de falla que cubre.

- Nombra cada test segun el contrato que protege.

- Usa la estructura Arrange, Act, Assert mediante comentarios dentro de cada test.

- No pruebes detalles internos irrelevantes si no estan conectados con un modo de falla confirmado.

- Al final del archivo, no incluyas explicaciones en prosa.

[SALIDAS ADICIONALES DESPUES DEL CODIGO]

- Test generados y modo de falla que cubren.

- Modos pendientes que no se convirtieron en test, y por que.

2.1.1 prompt

Los test ya existen y fallan por contratos confirmados en FAILURE-MODES.md.

No cambies test.

No cambies FAILURE-MODES.md.

No agregues dependencias.

Analiza la salida real de tests que aparece arriba.

Patra cada test fallido:

- identifica el ID de FAILURE-MODES.md que cubre

- configura si el test representa un contrato confirmado

- si el test es correcto, ajustasolo src/payments_svc/amounts.py para cubrir este contrato

- siel test no esta alineado con un contrato confirmado, no cambies codigo para satisfacerlo; explicalo

Haz el cambio minimo y explica que tests deberian pasar despues.

----
