
## Resumen

Si alguna vez pediste ayuda a una IA después de semanas de trabajo y te respondió cosas sin sentido, aquí entra el **context engineering**: la disciplina que decide qué información entra a tu inteligencia artificial antes de que escribas una sola palabra. Es para quienes quieren dejar de improvisar y empezar a diseñar el contexto de sus asistentes.

Imagina que llevas dos meses en un brief de marketing, una auditoría contable o un programa de reclutamiento gigante. Sabes qué se probó, qué fracasó y tienes media docena de decisiones tomadas. Llega el momento de pedirle ayuda a la IA y de pronto se inventa datos, te cambia el idioma y se te acaba el límite de la sesión [00:14]. Ese es el problema real que se resuelve aquí.

Por qué un mejor prompt no resuelve tu problema con la IA

La idea central es contundente: no importa qué tan bien redactado esté tu prompt. **No necesitas una mejor frase, necesitas memoria, herramientas y criterio** [00:33]. Y aquí viene lo interesante, porque cambia por completo la forma en que trabajamos con estos modelos.

Cuando la IA falla, no suele ser por tu forma de preguntar. Es porque no tiene la información correcta cargada, no recuerda lo que ya decidiste o se queda sin espacio para procesar todo. Ahí es donde el enfoque de arquitectura marca la diferencia frente a seguir puliendo palabras.

> **¿Qué es context engineering?** Es decidir qué información entra a tu IA antes de escribir el prompt, de dónde viene esa información y qué se descarta cuando ya no cabe en la sesión [00:42].

De dónde viene la información y qué se descarta cuando ya no cabe

El _context engineering_ trabaja sobre tres decisiones concretas: qué entra, de dónde viene y qué se tira. Piensa en el contexto como una maleta con espacio limitado: no puedes meter todo, así que eliges lo esencial y descartas lo que ya no aporta.

Este criterio importa porque los modelos tienen límites de sesión. Cuando saturas el espacio con datos irrelevantes, la IA empieza a alucinar o pierde el hilo. Diseñar ese flujo desde el inicio evita que se rompa a mitad del trabajo.

> **¿Por qué la IA inventa datos o cambia de idioma?** Suele pasar cuando el contexto está mal cargado o saturado. Si le das información desorganizada o excedes su límite de sesión, el modelo rellena huecos con datos falsos.

Por qué aprender con Claude de Anthropic te sirve en cualquier modelo

El trabajo se hace con **Claude de Anthropic**, y hay una razón estratégica detrás. Anthropic ha sido el laboratorio que publica primero los métodos y las herramientas, y el resto de la industria termina adoptándolos [01:04].

Hay una apuesta interesante aquí: es probable que la forma de trabajar el contexto que vas a aprender acabe siendo la de todos los modelos en unos cuantos meses [01:18]. Aun así, lo que se enseña es transferible.

- Los criterios son de arquitectura, así que se mueven contigo a cualquier modelo [01:28].
- El contenido aplica a toda la familia Anthropic del modelo cinco en adelante [01:38].
- Aprendes principios de diseño, no trucos que caducan con una actualización.

Dicho de otro modo, no memorizas comandos de una herramienta específica; adquieres una forma de pensar que sobrevive a los cambios de modelo.

Cómo se aprende auditando un asistente de IA real y heredado

Esto no es teoría. El ejercicio central es práctico: vas a auditar un asistente real heredado que nadie ha tocado en ocho meses [01:48]. Un sistema abandonado, con capas de decisiones olvidadas, como esos proyectos que heredas sin documentación.

El proceso sigue una lógica clara de diagnóstico y rediseño:

1. Encontrar lo que le sobra al asistente.
2. Detectar lo que le falta.
3. Diseñar el sistema que lo reemplaza [01:53].

Esa secuencia convierte un concepto abstracto en una habilidad concreta que puedes aplicar en tu propio trabajo, ya sea personal o profesional.

Quién guía este recorrido en inteligencia artificial

La guía es Frida Ruh, especialista en inteligencia artificial y prospectiva, con experiencia en el sector corporativo y en iniciativas de impacto social [02:04]. Su propósito es acompañarte a dejar de improvisar el contexto de tu IA y empezar a diseñarlo [02:15].

El objetivo final conecta con algo más grande: construir arquitecturas que hagan escalable el conocimiento de la inteligencia artificial [02:28]. Es decir, sistemas que crezcan contigo sin romperse cada vez que agregas información.

¿Ya te has topado con una IA que se inventa datos justo cuando más la necesitas? Cuéntame en los comentarios cómo lo resolviste y nos vemos en la siguiente clase.

---

## Resumen

La ventana de contexto en Claude explica por qué la misma instrucción da respuestas distintas y por qué tu asistente a veces se olvida de lo que le pediste. Esta guía es para quien construye o usa asistentes con IA y quiere entender qué entra, en qué orden y quién gana cuando dos instrucciones se contradicen.

Aquí vas a poder explicar, sin decir "mi herramienta alucinó", por qué el modelo perdió información. Y la respuesta casi siempre está en cómo se llena ese espacio invisible.

Qué entra en la ventana de contexto y por qué todo cuenta

Hay una frase en la documentación de Claude que conviene leer despacio: todo en la petición cuenta hacia la ventana de contexto. El _system prompt_, el historial, los resultados de herramientas, las imágenes, los documentos y también las definiciones de tus herramientas.

Y aquí viene lo interesante: las definiciones de las herramientas ocupan espacio aunque nunca las uses [00:36]. Si tu asistente tiene 40 herramientas y usas apenas seis, pagas el costo de las 40 en cada mensaje. Es como cargar el catálogo completo de la tienda en línea para vender solamente un cable.

> **¿Qué es la ventana de contexto?** Es el espacio total donde el modelo lee todo lo que le mandas en una petición: rol, historial, herramientas, documentos y tu mensaje. Todo compite por ese mismo espacio, aunque no lo uses.

En qué orden llegan las instrucciones al modelo

Cada pieza que le mandas al modelo llega en una secuencia. Conocerla te ayuda a entender qué pesa más y qué se cae primero.

- El _system prompt_: el rol, las restricciones, el formato, lo que pone quien construyó el producto.
- Las definiciones de herramientas: el catálogo de lo que el modelo puede hacer.
- La memoria: los hechos destilados de sesiones anteriores.
- El historial: normalmente la parte más larga de todo el contexto.
- Los documentos recuperados: lo que trajo la búsqueda en ese turno.
- Tu mensaje actual: casi siempre es lo último de la fila.

Y todo esto se va acumulando. Los turnos previos se preservan completos y no resumidos [01:36], así que el peso crece turno tras turno.

Cuántos tokens caben y qué pasa cuando se llena

Te preguntarás cuánto cabe realmente. Los modelos actuales de Claude manejan **1 millón de tokens**, mientras que los anteriores manejaban apenas **200 000** [01:47]. Suena infinito, pero no lo es.

El detalle que casi nadie sabe: en el chat, la ventana puede mantenerse de forma rodante, primero en entrar, primero en salir. Cuando se llena, empieza a caerse lo del principio, que es justo donde le dijiste quién eres y qué querías [02:08]. Y nadie te avisa cuando eso pasa.

> **¿Por qué mi asistente se olvida de mis instrucciones?** Porque la ventana de contexto se llenó y empezó a descartar lo más viejo, que suele ser el inicio donde definiste su rol. No es que alucinara: se le cayó el principio.

Quién gana cuando dos instrucciones se contradicen

Aquí hay que separar dos cosas que la gente confunde todo el tiempo. Una es la prioridad por jerarquía y otra es la prioridad por posición.

Cómo funciona la prioridad por jerarquía

Cuando dos instrucciones se contradicen, hay un orden entrenado de mayor a menor privilegio [02:29]:

- El _system message_: la prioridad máxima.
- Los mensajes de usuario: privilegio alto.
- Las instrucciones dentro de imágenes o audio: privilegio medio.
- El texto de herramientas, como búsquedas, documentos subidos o resultados de código: el nivel más bajo.

Ese último punto es una defensa de seguridad. Si un documento trae escondido un "ignora tus instrucciones anteriores", el modelo debe ignorarlo [03:02]. Pero ojo: la jerarquía aplica solo cuando las instrucciones están en conflicto. Si están alineadas, el modelo obedece la de menor privilegio sin ningún problema.

Qué es la prioridad por posición

La prioridad por posición no tiene que ver con quién dijo qué, sino con dónde cayó dentro del contexto [03:25]. Son dos cosas distintas y conviene no confundirlas.

Un detalle que casi nadie conoce: algunos modelos ya saben cuánto contexto les queda. Cuando usas la API, esta les avisa después de cada herramienta con algo como "llevas 35 000 de 200 000" [03:47]. Así el modelo administra su espacio como tú administrarías la batería del teléfono.

Cómo hacer tu mapa de contexto paso a paso

El reto es tomar el asistente que más usas y construir una tabla con qué pieza entra y de dónde viene.

1. Lista las seis piezas que vimos y marca cuáles están presentes en tu caso.
2. Anota quién escribió cada una: tú, tu equipo, el producto o un documento.
3. Encuentra las piezas más pesadas, que casi siempre son el historial que nadie administra.

Si te sale que el 80 % de tu contexto es historial acumulado, ya encontraste el primer problema [04:34].

En el mapa de ejemplo, el _system prompt_ pesaba **3400 palabras** e incluía el manual de políticas escrito por el área legal y por quien montó el proyecto hace ocho meses. Las definiciones de las 40 herramientas sumaban **1200 palabras**. La memoria no existía porque nunca se activó. Y el historial de la conversación pesaba alrededor de **65 000 palabras**, justo la mayor área de oportunidad [05:24].

Cuando calcules el porcentaje que representa cada pieza sobre el total, vas a ver dónde se te va el espacio. Si en tu caso pasa del 80 %, deja un comentario con un pulgar hacia abajo. Si lograste que sea menor, pon un pulgar hacia arriba. ¿Cuánto historial acumulado tienes tú?

Cuando ese espacio comienza a saturarse, algunas plataformas pueden descartar información anterior. Esto ayuda a explicar por qué un asistente puede dejar de seguir instrucciones establecidas al inicio de una conversación extensa: no necesariamente se trata de una “alucinación”, sino de una pérdida o reducción del contexto disponible.

Cuando existen **instrucciones contradictorias**, también importa su jerarquía. Las instrucciones del sistema tienen mayor prioridad que las del usuario, mientras que el contenido procedente de documentos, búsquedas o herramientas tiene un nivel inferior. Esta jerarquía evita, por ejemplo, que una instrucción escondida dentro de un documento pueda modificar las reglas principales del asistente.

También debe distinguirse entre **prioridad por jerarquía** y **prioridad por posición**. La primera depende de quién proporciona la instrucción; la segunda, del lugar que ocupa la información dentro del contexto.

Una práctica útil es construir un **mapa de contexto** del asistente: identificar qué información recibe, quién la proporciona y cuánto espacio consume. En conversaciones largas, el historial suele convertirse en una de las principales fuentes de saturación.

La pregunta clave sería: **¿mi asistente realmente necesita conservar todo el historial para responder bien o estamos llenando su contexto con información que ya no aporta valor?**

**La IA no "alucina", le da amnesia por nuestra mala arquitectura.** Tres verdades directas de esta clase:

1. **El impuesto invisible:** Herramientas definidas pero no usadas = tokens desperdiciados.
2. **Amnesia rodante:** Si el historial crece sin límite, empuja y borra tu _System Prompt_.
3. **Jerarquía vs. Posición:** El modelo prioriza por seguridad, pero el espacio físico manda.

👎 Mi historial devora más del 80% de la ventana. Toca meter bisturí al código.

---

Toda en la petición cuento hacia la Ventana de Contexto.

- El System Prompts - Rol , Restricciones - Formato, lo define quien construyó el producto.
- El Historial, que normalmente es la parte más larga de todo el contexto
- Los Resultados de Herramientas
- Las imágenes
- Los Documentos recuperados, lo que trajo la busqy¿ueda en este turno. y 
- Las definiciones de sus herramientas, estas ocupan espacios aunque nunca las uses. Aunque no las uses las pagas. El catálogo de lo que el  agente puede hacer. 
- La Memoria, los hechos destilados de sesiones anteriores. 
- Y por ultimo tu mensaje actual. 

Y todo esto se va acumulando. 


- Prioridad Maxima - System Message
- Usuario
- Imagen - Audio
- Herramientas 


---

## Resumen

Decidir qué información se queda en el contexto de un agente y qué se descarta es la parte difícil, y para eso existen cuatro principios que puedes aplicar hoy mismo: _relevance_, _recency_, _retrieval_ y _ranking_. Si trabajas construyendo o auditando agentes de IA, cada uno arregla un tipo distinto de falla y viene respaldado por evidencia dura.

La idea central es sencilla: con estos cuatro criterios puedes auditar cualquier agente y saber exactamente dónde está fallando. Vamos uno por uno.

¿Qué es la relevancia en el contexto de un agente?

La relevancia es el principio raíz de todo. En palabras de Anthropic, se trata de encontrar el conjunto más pequeño posible de _tokens_ de alta señal que maximiza la probabilidad del resultado que quieres [00:31].

Y ojo con la palabra clave: **el más pequeño posible no significa el más completo**. Aquí está el dato que incomoda: en un _benchmark_ de llamadas a funciones, un modelo falló con 46 herramientas y solo funcionó con 19 [01:00]. Le quitaron capacidades y mejoró.

Damos por hecho que más opciones lo hacen más capaz, cuando en realidad lo vuelven indeciso.

> **¿Cómo sé si una línea sobra en mi _prompt_?** Pregúntate: si quito esta línea, ¿cambia alguna respuesta? Si no cambia nada, simplemente sobra y puedes eliminarla.

¿Por qué la recencia evita que los errores se arrastren?

La recencia o _recency_ significa que lo nuevo tiene que poder ganarle a lo viejo. Un estudio de Microsoft y Salesforce encontró que, en conversaciones de varios turnos, cuando hay una respuesta incorrecta temprana el desempeño cae 39% en promedio [01:41].

¿La razón? Los modelos hacen suposiciones en los primeros turnos e intentan cerrar la solución antes de tiempo.

Llévalo a un sistema de soporte. El agente se equivoca en el turno tres, lo corriges en el cuatro y sigue arrastrando el error hasta el final. ¿Por qué? Porque tu corrección no borró nada, solo agregó. Ahora el dato equivocado y el correcto conviven en el mismo contexto [02:16].

La pregunta de auditoría aquí es directa: ¿lo viejo se puede morir o solo se acumula?

¿Qué significa recuperar información _just in time_?

El _retrieval_ nos dice algo simple: en lugar de cargar, busca. En vez de precargar todo por si acaso, los agentes modernos mantienen referencias ligeras, como una ruta de archivo o un _link_, y traen la información solo en el momento en que la necesitan. Anthropic la llama estrategia _just in time_ [02:45].

Es lo que hace una persona competente: no se memoriza el manual, sabe dónde está y lo abre cuando alguien pregunta.

¿Cuál es el _trade off_ de buscar en lugar de precargar?

Buscar es más lento. Por eso muchos sistemas son híbridos: traen lo crítico por adelantado y el resto bajo demanda [03:11].

> **¿Qué debo precargar y qué dejar para búsqueda?** Pregúntate por cada dato: ¿esto tiene que estar aquí siempre o solo cuando alguien lo pida? Lo crítico va por adelantado, el resto bajo demanda.

¿Por qué el orden del contexto cambia la exactitud?

El _ranking_ significa que el orden pesa tanto como el contenido, y es el principio que menos gente conoce. La misma información con el mismo texto rinde distinto según dónde caiga.

Los números lo dejan claro:

- Al inicio o al final del contexto: entre 70 y 75% de exactitud.
- A la mitad: apenas entre 55 y 60%.
- La diferencia: de 15 a 20 puntos solo por la posición [03:35].

Si el SLA, es decir el acuerdo de nivel de servicio, está enterrado en el párrafo 40 de un documento de 60, el modelo lo verá peor que si estuviera en la primera línea, aunque el texto sea idéntico [03:53].

La pregunta de auditoría: ¿lo más importante está donde más se ve?

¿Cómo trabajan juntos los cuatro principios?

Cada principio cubre una decisión distinta, y juntos forman un sistema completo [04:07]:

- **Relevance** decide qué entra.
- **Recency** decide qué sale.
- **Retrieval** decide cuándo entra.
- **Ranking** decide dónde se coloca.

Si solo aplicas uno, arreglas la cuarta parte del problema. Por eso conviene pensarlos como un conjunto.

> **¿Qué es un SLA en un agente de soporte?** Es el acuerdo de nivel de servicio, el dato que define tiempos y condiciones de respuesta. Si queda enterrado a la mitad del contexto, el modelo lo aplica peor.

¿Cómo auditar un agente de soporte con estos principios?

El reto práctico es auditar un agente de soporte en su versión más ingenua, que tiene los cuatro defectos, uno por principio [04:26]:

- En _relevance_: le pegaron el manual de políticas completo en el _system prompt_.
- En _recency_: nunca borra nada del historial.
- En _retrieval_: no tiene herramientas, todo está precargado.
- En _ranking_: el dato del SLA está a la mitad del bloque más largo.

El ejercicio va en cuatro pasos, y los dos últimos son los que más valen [04:45]:

1. Empareja cada defecto con el principio que viola.
2. Escribe la corrección concreta para cada uno en una frase.
3. Construye el agente con los cuatro defectos, hazle cinco preguntas de cliente y guarda las respuestas.
4. Aplica un solo principio, repite las mismas cinco preguntas y compara.

Ese cuarto paso separa a quien entendió de quien memorizó. Vas a ver la mejora directamente.

Anota cuál principio te dio más ganancia por menos esfuerzo y déjamelo en los comentarios.

Los cuatro principios son **relevance** (el conjunto más pequeño de tokens útiles), **recency** (evitar que los errores viejos pesen más que las correcciones), **retrieval** (buscar bajo demanda en vez de precargar todo), y **ranking** (el orden importa tanto como el contenido).

---

## Resumen

Escribir un buen system prompt en 2026 ya no consiste en decir "eres un experto". El prompt más efectivo suele ser más corto que el que tienes hoy, y aquí verás por qué esa idea contraintuitiva funciona. Esto te sirve si trabajas con modelos de IA y quieres respuestas más precisas sin pelear contra tus propias instrucciones.

La clave está en entender que un rol suelto ya no alcanza. Antes bastaba con "eres un analista de datos" y ese era todo el contexto. Hoy ese rol compite con la memoria del proyecto, las descripciones de las herramientas y los documentos que subiste. Un rol impecable puede perder contra una memoria que dice lo contrario [00:34].

Cuáles son los tres bloques de un system prompt

Un system prompt bien estructurado se divide en tres partes, y cada una tiene su propia trampa [00:22].

- **Rol**: quién es y qué decisiones puede tomar. La trampa es escribir adjetivos como _experto_ o _profesional_ en vez de límites reales.
- **Constraints**: las restricciones. La trampa es acumularlas hasta que empiezan a contradecirse entre sí.
- **Output**: formato, longitud y estructura. La trampa es no describirlo porque parece obvio, y nunca es obvio.

De los tres, el que más problemas causa es el segundo. Ahí es donde casi todos nos equivocamos.

Qué es la zona Ricitos de Oro en un prompt

Anthropic describe dos formas de fallar con las restricciones, y hay que evitar ambas [01:00]. Es como la sopa del cuento: ni tan fría ni tan caliente.

- **Sobreespecificar**: una lógica compleja y demasiado detallada que busca provocar un comportamiento exacto. Se rompe con el primer caso que no estaba previsto.
- **Subespecificar**: una guía sin señales concretas. El modelo termina adivinando.

> **¿Cuál es el punto ideal de un system prompt?** Es el conjunto mínimo de información que describe completamente el comportamiento esperado. Mínimo y completo al mismo tiempo, ese es el _sweet spot_.

Darle espacio al modelo para explorar los patrones a su alrededor le permite ser más inteligente al resolver tu solicitud, en vez de gastar esfuerzo resolviendo conflictos internos.

Cómo saber si una restricción sobra

Aquí viene la regla más importante de toda la clase [02:22]: solo escribes una restricción si puedes nombrar el caso concreto en el que el modelo se equivocó sin ella.

> **¿Cuándo debo agregar una restricción a mi prompt?** Solo cuando puedes nombrar el caso real donde el modelo falló sin ella. Si no puedes nombrarlo, no es una restricción: es una corazonada.

Cada regla rígida que pones equivale a apostar que conoces todos los casos límite. Y la verdad es que casi nunca los conocemos. Los modelos actuales tienen juicio para decisiones que antes había que dictarles.

Cómo se ve una instrucción antes y después

Un ejemplo real muestra el poder de esta regla [01:37]. La versión vieja decía: _nunca escribas comentarios, no escribas docstrings de múltiples párrafos, una línea corta máximo_. El problema es que chocaba con otra instrucción activa que pedía _dejar documentación según sea necesario_.

Dos instrucciones peleando en el mismo contexto, y el modelo gastando energía en resolver el conflicto en lugar de trabajar.

La versión nueva es una sola línea: _escribe código que se lea como el código de alrededor, igual a su densidad de comentarios, nombres e idioma_. Cubre más casos porque no pelea con nada.

Cómo reescribir un prompt inflado paso a paso

Veamos un prompt real de atención al cliente para una tienda de electrónica llamada Volta Electrónica, que opera en México, Colombia y Chile [04:12]. El original acumulaba restricciones que se contradecían entre sí.

Al pasar el filtro caso por caso, esto es lo que sucede:

- _Sé breve y al grano_: es una preferencia, no una falla documentada. Va fusionada con el output.
- _Explica cada paso con detalle_: contradice a la anterior. Se borra.
- _Nunca más de dos oraciones_: vuelve a contradecir. Se borra.
- _No uses lenguaje técnico_: se conserva, porque hubo un caso real donde se le dijo _RMA_ a un cliente y no entendió.
- _No prometas nada que no puedas cumplir_: se conserva, porque prometió reponer un producto descontinuado.
- _Nunca inventes información_: se conserva, ligada al SLA de 30 días.
- _Siempre verifica antes de responder_: ¿verificar contra qué? No es accionable. Se borra.
- _No des fechas de entrega_: se conserva, porque decía _llega el martes_ y luego _llega el viernes_.
- _Sé claro_: demasiado subjetivo. Se elimina.

Después del filtro, el prompt queda limpio: un rol concreto ("eres el asistente de soporte de Volta Electrónica"), los _constraints_ que sí tienen un caso documentado, y un output sencillo de máximo tres párrafos que siempre cierra con el siguiente paso concreto para el cliente [06:18].

> **¿Por qué un system prompt corto funciona mejor?** Porque cada restricción innecesaria genera conflictos internos que el modelo debe resolver. Menos reglas contradictorias significan más capacidad para responder bien tu solicitud.

Cómo aplicar esto en tu propio prompt

El reto de la clase es directo y lo puedes hacer hoy [06:38]. Toma cualquier instrucción larga que le hayas escrito a una IA esta semana y transfórmala.

1. Sepárala en tres bloques: rol, constraints y output. Vas a descubrir que tenías mucho de uno y casi nada de otro.
2. Pasa el filtro por cada restricción. Si no puedes nombrar el caso donde falló sin ella, bórrala.
3. Cuenta las líneas antes y después. Si no bajaste, no fuiste suficientemente estricto.
4. Corre ambas versiones en sesiones distintas con la misma tarea y compara.

Verás que la versión corta casi siempre gana. ¿Te animas a compartir un pantallazo del antes y después de tu prompt en los comentarios?

---

## Resumen

¿Dónde pones una pieza nueva de información cuando diseñas un asistente con IA? Esa decisión, aparentemente menor, provoca más desastres en sistemas reales que casi cualquier otro error. El mismo dato en el lugar equivocado puede saturarte el contexto, desaparecer cuando lo necesitas o contradecir otra instrucción.

El objetivo es simple: salir con un árbol de decisión que apliques sin pensarle demasiado, como si programaras condiciones. Si esto, entonces esto. Esto le sirve a cualquiera que construya asistentes, agentes o flujos con modelos de lenguaje y quiera dejar de improvisar dónde va cada dato.

Cuáles son los cinco lugares donde puede vivir la información

Toda información termina en uno de cinco destinos, y cada uno tiene su criterio de entrada [00:36]. La clave no es qué tan importante es un dato, sino **cada cuándo cambia y cada cuándo se necesita**.

- **System prompt**: identidad, restricciones duras y formato. Aplica siempre, sin excepción.
- **User prompt**: la tarea de este momento. Cambia a cada turno.
- **Memoria**: preferencias, decisiones y estado del proyecto. Sobrevive durante la sesión.
- **Herramientas**: datos que cambian, son enormes o volátiles. Es lo que no cabe o no para de moverse.
- **Base de conocimiento**: documentación estable y voluminosa que solo se necesita en algunas ocasiones.

Fíjate en el patrón: el criterio siempre gira alrededor de frecuencia de cambio y frecuencia de uso, nunca de relevancia percibida.

> **¿Qué diferencia hay entre memoria y base de conocimiento?** La memoria guarda datos que cambian y deben sobrevivir a la sesión, como el estado de un proyecto. La base de conocimiento guarda documentación estable y grande que solo consultas de vez en cuando.

Cómo funciona el árbol de decisión para ubicar cada dato

Piénsalo como programador, con lógica condicional [01:30]. Ante cualquier dato nuevo, respondes preguntas en cadena hasta llegar a un destino.

1. ¿Aplica a toda la interacción? Si cabe en pocas líneas, va al system prompt. Si es larga, va a un archivo o skill referenciado que se carga solo cuando hace falta.
2. Si no aplica a todo, ¿cambia con el tiempo? Si cambia y la necesitas ahora, se agrega como herramienta. Si cambia pero no la necesitas ahora, no la traigas.
3. Si no cambia con el tiempo, ¿debe sobrevivir a la sesión? Si sí, va a memoria. Si no, queda en el user prompt.

Con estas tres preguntas cubres cualquier pieza de información sin adivinar.

Cómo se ve el árbol aplicado a una tienda de electrónica

Con cinco datos reales el árbol se vuelve evidente [02:47]:

- Responder en español neutro y nunca prometer fechas de entrega: aplica siempre, va al **system prompt**.
- El cliente ya reportó el mismo problema tres veces: debe sobrevivir a la sesión, va a **memoria**.
- Cuántas unidades quedan de un modelo: cambia cada hora, va a **herramientas**.
- El manual de herramientas de 12.000 palabras: estable y enorme, va a **base de conocimiento**.
- "Ayúdame a redactar este ticket": es de este turno, va al **user prompt**.

Una vez que ves los cinco casos separados, cuesta volver a mezclarlos.

Por qué meter el manual completo al system prompt es el peor error

El error más común es cargar ese manual de 12.000 palabras al system prompt "para tenerlo a la mano" [03:35]. El problema es que **gastas tu presupuesto de atención en algo que solo se usa en el 5 % de los casos**.

Esta idea, según la clase, ha salvado sistemas enteros y le ha ahorrado mucho dinero a las empresas. Es el aprendizaje que conviene no soltar.

> **¿Dónde van las instrucciones de cómo usar una herramienta?** Van en la descripción de la herramienta, nunca en el system prompt. Si las pones en los dos lados, tarde o temprano actualizas uno y olvidas el otro, y ahí nacen las contradicciones.

Ese origen duplicado explica un caso anterior donde una regla decía "deja documentación según sea apropiado" en un lugar y "no agregues comentarios" en otro [04:23]. Nadie las escribió juntas ni las leyó juntas, así que el modelo tuvo que vivir con ambas.

Qué recomienda Anthropic sobre instrucciones, skills y referencias

El artículo más reciente de Anthropic aporta tres reglas prácticas [04:52] que refinan cómo escribes el contexto.

- **Instrucciones del proyecto ligeras**: gasta tokens en los _gotcha_, esos momentos de "claro, es eso", no en lo obvio.
- **Guías y skills sin sobrerestringir**: su valor está en codificar tu criterio, no en amarrar al modelo.
- **Referencias en código**: el modelo prefiere mil veces un _mockup_ en HTML que una descripción larguísima.

La lógica de fondo es la misma del árbol: pon cada cosa donde rinde, no donde parezca cómodo.

Cómo construir tu mapa de fuentes de contexto

El reto es armar un mapa de fuentes de contexto de un asistente que uses o un caso hipotético [05:23]. Sirve para detectar qué tienes mal ubicado hoy.

1. Crea una tabla con cuatro columnas: información, destino, por qué y vigencia.
2. Lista entre 8 y 12 piezas de información que ese asistente necesita.
3. Pasa cada pieza por el árbol de decisión y asígnale un destino.
4. Marca en rojo las que hoy están en el lugar equivocado.
5. Mueve una sola pieza r oja a donde le toca y úsala tres días así.

Ese cuarto paso, el de mover y probar, es donde empiezas a ver cambios reales. Elige la instrucción que más te esté doliendo, casi siempre es algo que repites en cada sesión y que debería vivir en el proyecto entero. Guarda esta tabla: es una de las cinco piezas de tu entregable final.

¿Qué dato de tu asistente sospechas que está en el lugar equivocado? Cuéntamelo y revisémoslo juntos.


---

RESUMEN
La búsqueda de información en agentes de IA no es un solo paso, sino tres. Si trabajas construyendo o dando instrucciones a asistentes de IA, entender cómo traer datos sin llenar el contexto de basura es lo que separa un agente eficiente de uno costoso y lento.

La parte operativa consiste en saber cómo recuperar un dato justo cuando lo necesitas. Y para eso existen tres herramientas que casi nadie domina completo: búsqueda, caché y compactación.

¿Cómo funciona realmente la búsqueda de información en un agente?

La mayoría cree que buscar es un solo movimiento. En realidad, traer información tiene tres pasos y casi todo el mundo solo piensa en uno.

La búsqueda encuentra candidatos por palabras o por semántica.
El ranking los ordena por relevancia, no solo por similitud.
La selección decide cuántos entran, y esa es una decisión de presupuesto, no de calidad [01:04].
Y aquí viene lo interesante. Un hallazgo de Chrome mostró que los modelos son casi perfectos buscando coincidencias literales, pero se degradan feo cuando la relación entre pregunta y respuesta es semántica [01:26].

¿Qué significa eso en la vida real? Si buscas la palabra devolución sin acento, el sistema también encuentra devolución con acento. Pero si buscas "me llegó roto", no siempre encuentra cuando el cliente escribió "producto con daño en tránsito". Y esa suele ser justo la consulta real de tu cliente.

¿Qué son búsqueda, ranking y selección en recuperación de información? Son los tres pasos para traer un dato: la búsqueda encuentra candidatos, el ranking los ordena por relevancia y la selección decide cuántos entran según tu presupuesto de contexto.

¿Qué es el caché y cuánto dinero te ahorra?

El caché se refiere a recuperar en vez de repetir. Vale la pena que lo consideres aunque no programes, porque tiene números concretos detrás.

El caché guarda los prefijos de tu petición. En el siguiente mensaje, el sistema reutiliza eso y solo procesa lo nuevo. Pero con una condición estricta: el prefijo se construye siempre en un orden fijo [02:00].

Primero las herramientas.
Luego el system prompt.
Luego los mensajes.
Un cambio en cualquiera de estos niveles invalida ese nivel y todos los siguientes. Y ojo, este orden no es el mismo que usas para una solicitud común, así que conviene que compares cómo estructuras instrucciones, herramientas y memoria en cada caso [02:36].

¿Por qué poner una fecha en el system prompt rompe todo?

Aquí está el error más repetido. A veces ponemos un timestamp en el system prompt, algo como "considera que la fecha de hoy es tal" [03:20]. Como eso cambia en cada petición, termina destruyendo el caché de toda la conversación.

¿Cuánto ahorra leer del caché? La lectura del caché cuesta la décima parte que procesar el mismo texto de nuevo, y además es más rápido. Pero el contenido cacheado sigue ocupando la ventana de contexto: el caché cambia lo que pagas, no el espacio que usas.

¿Qué es la compactación y cómo escribir un buen resumen?

Compactar es tomar una conversación cerca del límite, resumirla y arrancar una ventana nueva con ese resumen. Y aquí hay una confusión frecuente: existen dos compactaciones [04:15].

La automática, que hace la herramienta sola cuando te acercas al límite.
La intencional, que haces tú con un prompt.
Trabajarás la segunda, porque la automática te deja seguir chateando, pero no te deja elegir qué se salva ni ver qué se perdió. Y controlar eso es justo lo que necesitas aprender.

Anthropic recomienda un orden explícito para escribir ese resumen. Primero maximiza el recall, es decir, captura todo lo relevante aunque quede largo. Después itera hacia la precisión y quita lo superficial [04:52]. El orden importa: si empiezas optimizando brevedad, tiras cosas que ya no vas a poder recuperar. En un resumen no hay vuelta atrás.

Existe una versión más ligera: borrar los resultados crudos de herramientas viejas. Si tu agente consultó el inventario hace 20 turnos, la tabla completa ya no sirve, pero el número que importaba sí [05:18]. Esta parte casi nunca aparece en cursos y es la que más ahorra.

¿Cuándo no debes traer información al contexto?

Hay reglas claras para no traer datos de más. No traigas información cuando:

El modelo ya lo sabe.
El dato no cambia la decisión.
Lo que traes es más largo que lo que aporta.
Ya lo trajiste hace unos turnos y sigue intacto en el contexto.
Ese último punto es el más común en agentes que ya operan con clientes, porque buscan lo mismo una y otra vez, ya que nadie les dijo que ya lo tenían [06:04].

¿Cómo se ve una auditoría de recuperación con un caso real?

Recuerda el caso de Volta Electrónica. La idea es revisar la conversación con tu agente y evaluar cada elemento que recuperó o pegaste tú [06:32].

Por ejemplo, en la conversación aparece el ticket original completo. La pregunta clave es: ¿poner el ticket cambia la respuesta? Si la cambia, va a una tabla y se valida contra si ya estaba en el contexto. Lo mismo aplica al historial de cliente, el manual de garantías o la captura del estatus de envío.

Algunos ejemplos concretos ayudan a ver el criterio:

El ticket original completo no vale la pena en el contexto porque no hace sentido.
La política de garantía extendida quizás no cambia la respuesta porque ya viene en el system prompt.
El correo del proveedor sobre el lote sí cambia la respuesta, pero no hay que tenerlo en el contexto.
Se trata de evaluar cada elemento para decidir si va en el contexto, en las instrucciones de las herramientas o en el caché [07:40].

¿En qué consiste el reto de auditoría de recuperación?

El reto es hacer una auditoría de recuperación en tu asistente de trabajo. El proceso es directo [08:16].

Revisa una conversación larga de esta semana y cuenta cuántas veces trajo información.
Marca cuáles cambiaron tu respuesta final. Vas a encontrar que muchas no cambiaron nada.
Encuentra la repetición: algo que buscó dos veces en la misma sesión.
Como bonus, escribe tu prompt de compactación para ese caso en el orden correcto: primero completo y luego corto. Guárdalo, te va a servir.

¿Ya detectaste cuántas veces tu agente busca lo mismo sin necesidad? Cuéntame qué encontraste en tu auditoría.

---
## Resumen

¿Va en el prompt, en una herramienta o en una memoria? Cuando empiezas a diseñar contexto para un sistema de IA, esta es la pregunta que más se repite. Y aquí viene lo interesante: no depende de tu gusto, depende de un árbol de decisión con reglas claras. Esta guía es para quien construye contexto y quiere evitar el error que casi nadie te advierte, que la memoria también se daña.

¿Cómo decidir si la información va al prompt, a una herramienta o a la memoria?

Todo parte de un árbol de tres ramas. Solo necesitas hacerte tres preguntas en orden y seguir el flujo [00:14].

1. ¿La información ya la tengo enfrente y es corta? Si la respuesta es sí, va directamente al prompt.
2. ¿Cambia con el tiempo, es grande o vive en otro sistema? Si es así, te vas a _tool calling_.
3. ¿Es sobre el usuario o el proyecto y debe seguir siendo cierta mañana? Si sí, la almacenas como memoria.

Ese orden importa porque cada rama resuelve un tipo distinto de necesidad. Y para elegir bien, hay tres criterios que sostienen toda la decisión.

> **¿Cuándo debo usar tool calling en lugar del prompt?** Usa _tool calling_ cuando el dato cambia con el tiempo, es demasiado grande o vive en otro sistema. La herramienta trae el dato justo en el momento en que la llamas, no antes.

¿Qué criterios determinan dónde colocar el contexto?

Más allá del árbol, hay tres factores que definen el destino de cada dato [00:40]. Piénsalos como el filtro final antes de decidir.

- **Vigencia**: el prompt dura solo un turno, la herramienta trae el dato del momento en que la llamas, y la memoria dura hasta que alguien la borre.
- **Costo**: el prompt cuesta tokens siempre, uses o no la información, incluso si dices "hola" o "gracias". La herramienta cuesta solo cuando se usa. La memoria cuesta muy poco porque es un resumen.
- **Riesgo**: el prompt puede saturar el contexto, la herramienta puede traer basura o fallar, y la memoria puede guardar algo falso y arrastrarlo para siempre.

Ese último riesgo es el que menos se ve venir, y por eso merece una sección propia.

¿Por qué la memoria de un sistema de IA está diseñada para romperse?

Cuando un sistema tiene memoria activada, pasa algo que vale la pena reconocer. La instrucción que se inyecta al modelo dice, en mayúsculas: **"SIEMPRE REVISA TU DIRECTORIO DE MEMORIA ANTES DE HACER CUALQUIER COSA"** [01:19]. Cada vez que le mandas algo, ese es el prompt que se ejecuta por detrás.

Y se pone más revelador. La instrucción también dice: **asume interrupción** [01:37]. Tu ventana de contexto puede reiniciarse en cualquier momento, así que corres el riesgo de perder cualquier progreso que no esté registrado en tu directorio de memoria o en alguna herramienta.

Esto es muy fuerte. Al asumir interrupción, el sistema parte de la idea de que se va a romper. No es un accidente, es diseño.

¿Cómo trabajar en varias sesiones sin perder el progreso?

El patrón recomendado para trabajo de múltiples sesiones es transferible a cualquier equipo, incluso a humanos [01:56]. Funciona así:

1. En la sesión inicial, crea los archivos: bitácora de progreso y checklist de lo que falta.
2. Cada sesión nueva abre leyendo esos archivos y recupera el estado sin volver a explorar.
3. Cada sesión cierra actualizando la bitácora con lo que se hizo y lo que sigue.
4. Marca algo como completo solo después de verificarlo, no cuando quedó escrito ni mientras lo estás haciendo.

Ese último principio aplica igual a agentes y a personas. Verificar antes de dar por cerrado evita arrastrar errores hacia adelante.

> **¿Qué significa que la memoria se envenena?** Significa que si guardas un dato incorrecto, no se queda en esa sesión: lo arrastras mañana, la semana siguiente y el mes que entra. Y cada vez lo crees más porque ya estaba ahí.

¿Cómo auditar la memoria de tu herramienta de IA?

El reto de esta vez es más una auditoría, y puede ser un poco incómoda [02:35]. Se trata de abrir la memoria de la herramienta de IA que más usas y leerla completa, entrada por entrada.

El proceso para revisarla es sencillo [03:11]:

- Ve a tu perfil en la parte inferior izquierda y da clic en Configuración.
- Entra a Privacidad y baja hasta las preferencias de memoria.
- Da clic en Administrar para ver las categorías de memoria guardadas.

Adentro vas a encontrar cosas que ni recordabas. En el ejemplo de la clase aparecen memorias profesionales de escritura, como _nunca utilices em dashes_ o _mantén la puntuación simple y directa_ [03:30]. También hay memorias de perfil que ya caducaron, como una que decía "fundadora de Kiwi Hub", un proyecto que ya terminó [03:56].

¿Cómo eliminar o actualizar una memoria incorrecta?

Cuando encuentres una memoria que ya no aplica, la solución es directa [04:12]. Seleccionas la entrada y le das la instrucción entre comillas: "Elimina esta memoria", luego enter. El sistema filtra, actualiza el perfil y confirma con "memoria actualizada".

Para ordenar la auditoría, etiqueta cada entrada con una de estas tres categorías:

- **Sigue siendo cierta**: la conservas.
- **Ya no aplica**: la borras.
- **Nunca fue cierta**: la borras.

Probablemente encuentres una o dos memorias que llevan siendo falsas desde hace meses. Después de limpiar, define tu criterio de expiración: cada cuánto vas a repetir esta revisión.

Escríbelo y compártelo en los comentarios para ver qué tan estrictos nos vamos a poner. ¿Cada semana, cada mes, cada trimestre?

---

## Resumen

Los límites de contexto en herramientas de IA son ese costo invisible que nadie te explica hasta que te quedas sin cuota un jueves a las 4 de la tarde. Aquí aprenderás a diferenciar el mundo del chat del mundo de la API, cómo se consumen tus tokens y cómo calcular tu propio presupuesto de contexto. Es una lección clave si trabajas a diario con modelos como Claude y no quieres quedarte sin herramienta cuando más la necesitas.

Hay un mito que conviene desmentir de una vez: como pagas suscripción, crees que el contexto sale gratis. **No sale gratis, sale caro, solo que a veces lo pagas en otra moneda.** Y si no entiendes eso, un día te quedas sin acceso justo cuando lo necesitas.

Qué diferencia hay entre el chat y la API

Existen dos mundos que tendemos a mezclar y funcionan con lógicas completamente distintas [00:36].

En el chat no pagas por token, pagas una mensualidad. Pero esa mensualidad tiene reglas internas:

- Una ventana rodante de varias horas que arranca con tu primer mensaje, donde todo sale de la misma bolsa.
- Un tope semanal adicional al de la ventana.
- Una bolsa compartida entre las superficies del producto, donde consumir de una te quita de la otra.

Cuando se te acaba, el sistema te manda a esperar y no hay forma de pagar más en ese momento [01:20]. Así que la corrección no llega abriendo la cartera, llega con paciencia.

> **¿Por qué se me acaba tan rápido la cuota del chat?** Porque las conversaciones larguísimas, los archivos pesados, los proyectos con bases de conocimiento enormes y las sesiones donde el modelo usa herramientas sin parar queman tu cuota mucho más rápido.

El mundo dos es la API, donde sí pagas por uso: por token de entrada y token de salida [01:44]. Aquí también viven los parámetros que se afinan de verdad, como el _caché_, el _retrieval_ y la latencia. Es el terreno de quien construye productos.

Cuánto cuestan realmente los tokens en la API

Al momento de grabar esta lección, los precios de referencia para Claude Opus 5 sirven para dimensionar cada ajuste que hagas [02:12]. Recuerda que puedes consultar valores actualizados en el enlace de la caja de recursos.

- 5 USD por millón de tokens de entrada.
- 25 USD por millón de tokens de salida.
- 50 centavos por la lectura de _caché_.

Con estos números entiendes por qué pasar cierto umbral de tokens de entrada suele activar tarifas más altas [02:36]. Si le pides al modelo que pegue el documento completo, no solo baja la calidad, también te sale más caro. Dos golpes en una sola decisión.

> **¿Qué es un token de entrada frente a uno de salida?** El token de entrada es lo que tú le mandas al modelo y el de salida es lo que el modelo te responde. En la API pagas por ambos por separado, y el de salida cuesta más.

Cuáles son los costos que no aparecen en la factura

Aquí viene lo interesante: hay tres costos que duelen y que nunca llegan en un correo de facturación [02:56].

1. **La latencia**: más tokens de entrada significan más tiempo de procesamiento. Por eso el chat se siente lento después de un rato trabajando.
2. **El ruido**: la precisión cae del 95% a cerca del 60% solo por la longitud del input.
3. **La confusión**: más herramientas disponibles dan peor desempeño, como en el caso de las 46 herramientas contra las 19 que el modelo terminaba ocupando.

Ninguno de estos tres te llega en una factura, pero los tres te están costando en tiempo, calidad y dinero.

Dónde reviso mis límites de uso

Para revisar todo lo anterior, ve a la parte inferior izquierda y da clic en uso [03:44]. Ahí aparecen tus estadísticas reales.

- La sesión actual, que se restablece cada cinco horas.
- Los límites semanales para todos los modelos, donde los de _Fable_ pueden ocupar hasta el 50% de tu cuota semanal.
- Los créditos de uso de la API, con tu presupuesto disponible y lo que ya gastaste.

En el ejemplo, la sesión iba en 3%, el límite semanal en 15% con restablecimiento el viernes a las 12, y de la API se había gastado 4.56, apenas el 23% del presupuesto [04:20]. Un detalle importante: aunque le metas más dinero a los créditos, no lo puedes ocupar hasta la fecha de restablecimiento [04:52].

Cómo calculo mi presupuesto de contexto

Ese es el reto para los próximos tres días. La idea es sencilla y medible [05:04].

1. Anota a qué hora te quedaste sin cuota y qué estabas haciendo.
2. Identifica al culpable: casi siempre es una sesión eterna sin cerrar, un archivo enorme pegado en el chat o un proyecto con demasiada base de conocimiento.
3. Aplica una corrección y vuelve a medir la semana siguiente.

La corrección más efectiva suele ser la más simple: **cierra el chat y empieza uno nuevo.** Suena tonto, pero funciona.

Y si trabajas con la API, da un paso más: revisa si tu _system prompt_ tiene algo que cambie en cada petición [05:40]. Ahí se te está yendo el _caché_ por completo, y con él, tu dinero.

¿Ya identificaste a qué hora sueles quedarte sin cuota y quién es el culpable? Cuéntame en los comentarios cuál fue tu corrección más efectiva.


---

RESUMEN
¿Alguna vez sentiste que la IA entendía todo al inicio de una conversación, pero tres días después responde como si acabara de empezar? Eso tiene nombre y solución. El Context Rot es la razón por la que tu asistente parece volverse menos inteligente en sesiones largas, y aquí aprenderás cuatro técnicas para contrarrestarlo.

No crasheó ni tiene un error. Simplemente se quedó sin espacio. Es una de las quejas más frecuentes que escucho, casi siempre con la misma frase: "de repente se puso tonta".

Por qué la IA pierde precisión en conversaciones largas

El problema tiene un nombre técnico y viene directo de la arquitectura del modelo, no de una falla puntual. Según la definición de Anthropic, a medida que aumenta el número de tokens en la ventana, la capacidad del modelo para recuperar información con precisión disminuye [00:38].

Dicho de forma simple: no es sostenible trabajar todo en una sola sesión. Y tiene lógica. Es exactamente lo que te pasa en una reunión que dura más de tres horas: al final ya nadie recuerda con claridad lo que se dijo al inicio.

¿Qué es el Context Rot? Es la degradación en la precisión de una IA cuando la conversación acumula demasiados tokens. No es un bug, es parte de cómo está construido el modelo. Entre más larga la sesión, peor recupera la información.

Qué es la curva en U o lost in the middle

Hay un segundo hallazgo interesante: la curva en U del trabajo, conocida como lost in the middle [01:11]. Se relaciona con cómo se construye el contexto y qué tan preciso se vuelve a medida que avanzamos.

La información del inicio o las primeras conversaciones tiene entre 70 y 75% de precisión.
Conforme avanzas, cae a 55 o 60%.
La última conversación vuelve a subir a entre 70 y 75%.
Esa diferencia de 15 a 20 puntos depende solo de dónde esté ubicada la conversación. La misma frase, palabra por palabra, puede degradarse de forma considerable según su posición.

Cuáles son las cuatro técnicas para contrarrestar el Context Rot

La buena noticia es que existen métodos concretos para recuperar la precisión. Estas son las cuatro técnicas [01:52]:

Compaction: resumir la sesión y empezar de nuevo con ese resumen.
Pruning: eliminar los resultados crudos de herramientas viejas. La conclusión se queda, pero el volcado de datos se va.
Notas estructuradas: el agente escribe fuera de la ventana, en otro ecosistema, y lo lee de vuelta cuando lo necesita. Es como saltar entre conversaciones.
Subagentes: cada tarea arranca con una ventana limpia. Uno consume decenas de miles de tokens y devuelve entre 1,000 y 2,000 destilados.
Piénsalo así: en lugar de pedirle a una sola persona que sea experta en todo, recuerde todo y ejerza todas las profesiones al mismo tiempo, eliges personas distintas cada vez. Tarde o temprano, esa persona sobrecargada ya no puede más.

Cómo se parece la compresión a tu cerebro cuando duermes

Nuestro propio sistema hace algo parecido para evitar el colapso. Cuando te vas a dormir, tu cerebro consolida: retiene lo importante del día y suelta el resto [02:47].

No guarda el "video" completo de tus últimas 16 horas, solo lo que será útil. La compresión es exactamente eso.

¿Para qué sirve la compaction en IA? Sirve para resumir una conversación larga en un texto corto que otra sesión pueda continuar sin releer todo. Funciona como tu cerebro al dormir: guarda lo útil y descarta el ruido.

Cómo aplicar la compresión de sesiones paso a paso

Llevemos esto a la práctica con un ejemplo real: un market brief sobre el ecosistema fintech en México [03:09]. Esa sesión ya incluía archivos subidos, iteraciones, documentos y código generado. En otras palabras, ya estaba bastante larga.

El proceso es directo:

Escribe este prompt: "Resume esta sesión para que alguien más pueda continuarla sin leer nada de lo anterior".
Copia ese resumen y pégalo en una sesión completamente nueva.
Da la instrucción de lo que quieres lograr, por ejemplo: escribir la sección de panorama competitivo con el mismo formato y nivel de detalle de las secciones ya aprobadas.
Compara ese resultado con el que da la sesión vieja al hacer la misma petición.
Y aquí viene lo interesante. La sesión original devolvió el brief completo con las cuatro secciones habituales, los supuestos y la cadena de evidencia [04:14]. En cambio, el resumen condensado ni siquiera extrajo la información de los archivos subidos.

El resumen respondió algo revelador: no podía escribir la sección porque ya no tenía ni el brief ni los archivos CSV, así que no podía citar las fuentes [04:52]. Para hacerlo, habría que reimportar toda la información de nuevo.

Cómo construir tu primer prompt de compresión afinado

El reto es repetir este proceso exacto con una conversación tuya lo suficientemente larga [05:15]. La clave está en detectar qué se perdió.

Toma una conversación extensa y aplica el prompt de resumen.
Pega el resultado en una sesión nueva y observa qué falta.
Identifica los elementos ausentes, como la información de esos archivos.
Regresa y agrega esa lista de elementos faltantes a tu prompt.
Esa lista reconciliada es tu primer prompt de compresión bien afinado. Guárdalo, porque será tu punto de partida para no volver a perder contexto valioso.

¿Ya identificaste cuál fue el dato que tu resumen dejó fuera? Cuéntame en los comentarios qué se perdió en tu primera prueba.

---

ESUMEN
El contexto contaminado en IA es peor que un contexto largo, y aprenderás a diagnosticar las cuatro formas clásicas en que se degrada. Si trabajas con agentes o modelos conversacionales, esta guía te da una tabla de diagnóstico reutilizable para saber qué está fallando y cómo resolverlo.

Ya sabes que el contexto se degrada con la longitud, pero hay algo más grave: cuando el contexto se convierte en basura. Aquí viene lo interesante, porque cada falla se ve distinta desde fuera y se soluciona de manera diferente [00:20].

Qué es el envenenamiento de contexto y cómo se ve

El envenenamiento ocurre cuando una alucinación o un error entra al contexto y se queda ahí, citándose una y otra vez. El problema no es que aparezca el error, sino que el modelo lo confirma como verdad.

Piensa en un agente jugando Pokémon cuyos objetivos y resumen quedaron contaminados con desinformación [00:38]. Empieza a perseguir metas imposibles con total convicción, porque su propio contexto se lo confirma.

En tu trabajo esto se refleja en una IA que insiste en algo que nunca fue cierto y te cita a ti como si tú se lo hubieras dicho.

¿Qué es el envenenamiento de contexto? Es cuando un error o alucinación entra al contexto de la IA y se queda citándose repetidamente. El modelo lo trata como verdad y persigue conclusiones falsas con convicción.

Cómo distinguir la distraccion de la confusion

Estas dos fallas se confunden entre sí, pero atacan puntos distintos del razonamiento. Vamos a separarlas.

Por que la IA repite lo que ya no funciono

La distracción aparece cuando el contexto crece y el modelo se apoya en el historial en lugar de generar algo nuevo [01:11]. Le pides una alternativa y te da la misma idea, solo que con otras palabras.

Es un loop casi infinito. El modelo vuelve a proponer lo que ya demostró que no servía, atrapado en su propia memoria.

Cuando el modelo elige la herramienta equivocada

La confusión llega cuando le das información superflua que lo obliga a procesar cosas irrelevantes [01:34]. El resultado es que elige la herramienta incorrecta o no elige ninguna cuando debería.

Es como pedirle un gráfico y que responda "no, no puedo hacerlo", aunque minutos antes te entregó un reporte completo.

Que hago cuando la IA se contradice a si misma

La cuarta falla es la contradicción: la IA te da información contradictoria dentro del mismo contexto [01:52]. Esto termina descarrilando el razonamiento por completo.

Se manifiesta en respuestas inconsistentes entre turnos, sin motivo aparente. Un turno dice una cosa, el siguiente afirma lo contrario.

¿Cómo sé si mi IA tiene contexto contaminado? Fíjate en el síntoma. Si inventa y repite, es envenenamiento. Si no propone nada nuevo, es distracción. Si usa mal las herramientas, es confusión. Si se contradice entre turnos, es choque.

Cual es la tabla de diagnostico para cada falla

Esta tabla es de lo que más me piden repetir, así que pégala junto a tu escritorio [02:20]. Cada síntoma tiene una acción concreta:

Si inventa cosas y las repite, es envenenamiento: abre una sesión o chat nuevo.
Si ya no propone nada nuevo, es distracción: compacta y reinicia en un chat nuevo.
Si usa la herramienta equivocada, es confusión: poda el catálogo, es decir, elimina herramientas.
Si hay contradicciones entre turnos, es un choque: busca dónde se están duplicando las instrucciones.
Si se olvidó de lo que estaba al inicio, es degradación normal: muévelo a la memoria o al system prompt.
Cada falla pide una respuesta distinta, y confundirlas es lo que hace que sigas peleando con el modelo sin avanzar.

Por que corregir a la IA muchas veces empeora el contexto

Aquí está el punto más contraintuitivo y también el más valioso [03:07]. Cuando hay envenenamiento, tu instinto es escribir "no, eso está mal, el SLA es de 14 días".

Parece lo correcto, pero mira lo que acabas de hacer. No borraste nada, al contrario: agregaste. Ahora el contexto contiene la información errónea, tu corrección y además la discusión sobre la información errónea.

Muchas veces la corrección correcta no es corregir, es empezar de nuevo con el contexto limpio. Sumar texto encima del error solo lo hace más pesado.

¿Debo corregir a la IA cuando alucina o empezar de cero? Corregir agrega el error, tu corrección y la discusión al contexto. Casi siempre es mejor abrir una sesión limpia y reformular la pregunta desde cero.

Como compruebo que el problema es el contexto y no el modelo

Más que un desafío, es un ejercicio de detective en tu propio historial [03:41]. Revisa tus últimas dos semanas y busca un caso en que la IA te dijo algo erróneo y tú seguiste conversando, ya sea corrigiéndola o ignorándola.

Después clasifícalo con la tabla anterior. ¿Cuál de las cuatro fallas fue?

Luego reconstruye el momento en que ocurrió el error, que casi siempre es más temprano de lo que piensas. Y el paso que más te va a sorprender: abre una sesión limpia, formula la pregunta donde estaba el error y compara [04:15].

Si la sesión limpia responde bien, ya tienes la prueba de que el problema nunca fue el modelo, fue el contexto. ¿Ya identificaste cuál de las cuatro fallas te ha estado saboteando? Cuéntame en los comentarios cuál encontraste.

---

RESUMEN
Aprender a detectar la degradación de contexto en modelos de IA solo se logra provocándola tú mismo. En este taller vas a romper una sesión de forma deliberada, diagnosticar qué falló y probar cuatro mitigaciones para ver cuál funciona mejor. Es un recurso pensado para quienes trabajan con conversaciones largas y quieren entender por qué la IA empieza a ignorar instrucciones.

¿Cómo se provoca la degradación en una sesión de IA?

La idea es simple pero poderosa: necesitas una sesión que se rompa de verdad, no una simulación. Para eso, abres una sesión nueva y estableces tres reglas verificables, sin ambigüedad [00:39].

En el ejemplo del taller, las tres reglas fueron:

Responder siempre en español.
Entregar todo resultado numérico en formato de tabla.
Nunca inventar cifras que no se hayan dado.
Después trabajas de verdad durante 30 o 40 turnos sobre un caso real, o pegas un prompt preparado que fuerce al modelo a ejecutar esa cantidad de tareas de golpe [01:15]. Puedes pegar documentos largos, pedir análisis, cambiar de tema y regresar. El paso final: sin recordarle nada, haces una pregunta que dependa de las tres reglas al mismo tiempo [01:55].

¿Qué es la degradación de contexto en IA? Es cuando el modelo empieza a olvidar o ignorar las instrucciones iniciales conforme la conversación se alarga, perdiendo reglas que definiste al principio.

¿En qué momento el modelo empieza a romper las reglas?

En el taller, un detalle clave es pedir que cada 10 tareas el modelo se detenga y espere [02:20]. Así puedes comparar el resultado de las primeras 10 contra las siguientes y ver en vivo cómo empieza a alucinar.

En las primeras tareas, el modelo cumplió: respondió en español, usó tablas y armó el manual completo con sus siete secciones [03:20]. Pero pronto se quedó corto en las respuestas y, en un punto, declaró que "todas las cifras del manual son inventadas", rompiendo la regla de no inventar datos [04:15].

Otro hallazgo importante: la instrucción decía "empieza con la tarea uno", y el modelo entendió que solo debía hacer la tarea uno [04:35]. La lección es clara: describe con precisión lo que quieres. Una mejor redacción habría sido "ejecuta cada una de las tareas de manera ordenada".

El quiebre más revelador llegó en el bloque de la tarea 15 en adelante. En la tarea 25 se pidió deliberadamente una respuesta en inglés dentro de una instrucción [06:00]. Ahí el modelo empezó a contestar en inglés y solo retomó el español en la tarea 18 [07:05]. En teoría, las reglas de sesión deberían pesar más que el prompt de la tarea, pero no fue así.

¿Qué es la curva en U en el contexto de la IA? Es el patrón donde el modelo recuerda mejor lo que está al inicio y al final de la conversación, y olvida lo del medio. En este caso, la regla final fue la primera en romperse.

¿Qué pasa cuando la herramienta compacta la conversación sola?

Aquí hay una trampa que puede confundirte. Varias herramientas resumen la conversación por su cuenta cuando se acercan al límite, y eso puede ocurrir justo a la mitad de tu experimento [07:45].

Cuando eso sucede, a veces las reglas sobreviven, pero no porque el contexto haya aguantado, sino porque la compactación automática las rescató en el resumen. Si te pasa:

Anota en qué turno apareció la compactación.
Trata esa corrida como una quinta mitigación que no elegiste.
Corre la primera instrucción de nuevo en una herramienta que no compacte sola, otro modelo o una sesión más corta y densa, para tener tu línea base limpia [08:20].
Esto enseña algo del mundo real: cuando el sistema te ayuda sin avisarte, medir se vuelve más difícil. Por eso conviene saber qué hace tu herramienta por debajo.

¿Cómo diagnosticar qué se rompió en la sesión?

Para diagnosticar usamos las tres preguntas guía de la clase anterior [08:55]:

¿Cuál regla se perdió? Casi siempre es la del inicio, aunque aquí fue la final por la curva en U.
¿Se contradijo o solo olvidó? Contradecirse es choque, olvidar es degradación pura. El arreglo depende de cuál sea.
¿Repitió algo que ya no funcionaba? Eso es distracción.
Cada respuesta apunta a un tipo distinto de problema, y por eso conviene diagnosticar antes de arreglar.

¿Cuál es la mejor forma de aplicar mitigaciones sin confundirte?

La regla de oro es medir cada mitigación por separado. Si aplicas las cuatro juntas, nunca vas a saber cuál sirvió de verdad [09:35].

El reto es repetir el taller completo con una vuelta más para llevarlo a tu día a día:

Documenta tu experimento en una tabla con tres columnas: mitigación aplicada, reglas que sobrevivieron y costo en esfuerzo.
Elige una sola mitigación como práctica por default, la de mejor relación entre resultado y esfuerzo.
Escríbela como una regla operativa que le puedas dar a un compañero.
Un buen ejemplo de regla operativa sería: "en este equipo, las reglas de formato viven en el proyecto, nunca en el chat" [10:35]. Esa regla va directo a tu documento de mantenimiento y es de las piezas que más se agradecen en un handoff, porque le ahorra a la siguiente persona todo este taller.

¿Ya hiciste tu propio experimento? Déjame en los comentarios algún hallazgo interesante que hayas tenido durante la ejecución.

---

RESUMEN
Todo lo que has hecho a mano en el chat, decidir qué le dices, qué recuerdas y qué le pides que busque, es exactamente lo que un agente de IA hace de forma automática. La memoria de un agente es la diferencia entre una herramienta que empieza de cero cada vez y un colaborador que aprende tus patrones. Esto le sirve a cualquiera que ya use IA y quiera dar el salto de escribir prompts a diseñar sistemas.

Por qué aprender context engineering en el chat te prepara para diseñar agentes

La diferencia entre una sesión de chat y un agente no es de concepto, es de escala y de quién ejecuta. Cuando decides "esto lo pongo en el proyecto y no en el chat", ya estás haciendo arquitectura de contexto, aunque no lo llames así.

Aquí está la distinción que importa: quien sabe escribir prompts es útil, pero quien sabe dónde debe venir cada pieza de información es quien diseña el sistema. Esa es la habilidad real que entrenas cuando practicas context engineering usando solo el chat [00:38].

¿Qué es el context engineering? Es la práctica de decidir dónde vive cada pieza de información dentro de un sistema de IA: qué va en las instrucciones, qué en la memoria y qué en la conversación puntual. No es escribir mejores prompts, es diseñar de dónde llega cada dato.

Un agente, cuando lo despojas de todo lo demás, hace solo dos cosas: identidad y memoria.

Qué diferencia la identidad de la memoria en un agente

Un agente bien diseñado se sostiene sobre dos pilares que conviene no confundir [01:15].

Identidad: es el system prompt. Describe quién es, qué decisiones puede tomar y qué nunca hace. Se escribe una sola vez, aunque cambie poco a poco.
Memoria: es lo que se construye día tras día. Incluye preferencias, decisiones, cosas que salieron mal y patrones.
Un agente sin memoria es una herramienta: cada vez que lo abres, empiezas de cero. Uno con memoria curada mantiene el estado del proyecto entre sesiones sin necesidad de recargar todo el contexto cada vez.

Por qué la memoria curada vale más que recordar tus gustos

Un día vas a querer que la IA te conozca como tu mejor amigo, y no es lo que parece. No se trata de que recuerde que te gusta el café con leche de avena. Eso es memoria paja y no sirve para nada [01:55].

Lo valioso es que note tus patrones reales:

Que siempre subestimas los plazos por un 30%.
Que tus reportes funcionan mejor cuando empiezan por la conclusión.
Que los viernes tomas las peores decisiones.
Eso es lo que haría un buen colaborador tras dos años contigo. Un agente bien diseñado puede lograrlo en semanas, pero solo si la memoria está curada.

Cuál es el riesgo de una memoria que persiste

Y aquí viene el precio. Memoria que persiste también es error que persiste [02:30]. Un agente que se equivocó sobre ti y guardó ese error actúa con confianza sobre una premisa falsa. Y tú le crees, porque "ya me conoce".

La frase que resume el peligro: un agente que te conoce bien es un activo, uno que cree que te conoce bien es un riesgo.

¿Por qué es peligrosa la memoria de un agente de IA? Porque si guarda un dato incorrecto sobre ti, seguirá actuando con confianza sobre esa premisa falsa. El error no se corrige solo: persiste hasta que alguien lo detecta y lo borra.

Por eso conviene dar instrucciones proactivas para que muestre el texto exacto antes de escribir o modificar cualquier memoria y espere tu confirmación.

Cómo montar un proyecto en Claude Cowork paso a paso

Lo que montas hoy todavía no es un agente, es un proyecto. Trae instrucciones más memoria, pero no decide solo, no ejecuta pasos ni llama herramientas. Es el cerebro, todavía no las manos [03:05].

La herramienta usada es Claude Cowork, que mete el motor agéntico de Claude Code en la app de escritorio con permiso sobre tus carpetas para ejecutar tareas de varios pasos en uno solo. Viene incluido en los planes de pago [03:30].

El flujo dentro de la app de escritorio es este:

Ir al apartado de inicio y elegir Cowork en lugar de Chat.
Entrar a Proyectos y dar clic en crear un nuevo proyecto con un nombre, por ejemplo Volta Electronics.
Pegar las instrucciones que definen la identidad del agente y qué decide o no decide solo.
Seleccionar una carpeta dedicada donde tendrá permiso para crear, mover y eliminar archivos.
Un detalle clave del permiso: si la carpeta autorizada es Volta, el agente solo puede accionar del nivel de esa carpeta hacia abajo. No toca nada del nivel superior, como la carpeta Proyectos que la contiene [05:40].

Qué instrucciones proteger para que el agente no guarde información sensible

Antes de ejecutar, conviene fijar reglas sobre qué nunca debe almacenar [06:20]:

Nunca guardar datos personales ni juicios de clientes.
Nada dicho en modo lluvia de ideas.
Cifras de política ni nada que venga del contenido de un ticket.
En la prueba, el caso fue un cliente de Guadalajara que compró audífonos de 4800 pesos con falla al mes y medio, fuera de los 30 días de reembolso. La decisión: reembolso completo más un cupón de 100 pesos. El output pedido fueron dos documentos: un Excel con ubicación, precio y causa de reemplazo, y un .doc con las políticas para adjuntar al correo [07:30].

Sobre el modelo, la tarea era simple, así que se bajó de Opus 4.8 a Sonnet 5 con esfuerzo medio, suficiente para resolverla sin gastar de más [09:10].

Lo interesante: el agente no inventó información. Preguntó cómo manejar el identificador del cliente y qué modelo de audífonos usar antes de generar los archivos, respetando la instrucción de no rellenar huecos por su cuenta [10:00].

Cómo construir el cerebro de tu futuro agente

El reto es armar tu propio proyecto en cinco pasos concretos [11:30].

Escribe su identidad en cinco líneas, sin adjetivos, incluyendo qué decide solo y qué nunca decide sin ti.
Lista cinco patrones tuyos que valga la pena que aprenda. Ojo, patrones, no preferencias: si el dato no cambia una recomendación futura, no es un patrón.
Define qué no debe recordar nunca. Esta lista es tan importante como la anterior y casi nadie la escribe.
Móntalo: crea el proyecto, pega la identidad como instrucciones y los cinco patrones como memoria inicial. Este paso es opcional y solo si tienes licencia de pago.
Pruébalo con una decisión real de tu trabajo esta semana y compara su recomendación con la tuya.
¿Qué patrón tuyo crees que un agente debería aprender primero? Cuéntamelo en los comentarios.

---
## Resumen

Si trabajas con IA y quieres entender por qué tu asistente a veces te ignora, inventa datos o te da la razón sin merecerla, estos tres experimentos de _context engineering_ son para ti. Sirven para diagnosticar cómo tu herramienta prioriza instrucciones, recuerda información y valida tus ideas, y son la base del entregable final que integra todo el curso.

¿En qué idioma te contesta la IA cuando hay instrucciones mezcladas?

Este es el escenario clásico: tienes memoria en inglés, un proyecto con instrucciones en español y le escribes al chat en inglés. ¿A qué le hace caso primero?

Existe una **jerarquía formal de privilegio entrenado**. El orden es claro:

1. Primero el _system prompt_.
2. Después la información del usuario.
3. Hasta abajo el texto de herramientas y documentos.

Pero aquí viene lo interesante: esa jerarquía existe solo para conflictos de seguridad, es decir, para cuando un documento o _prompt_ intenta secuestrar tus instrucciones [00:38]. El idioma no es un ataque, así que en la práctica el orden cambia.

> **¿Por qué la IA ignora la jerarquía con el idioma?** Porque la jerarquía formal solo aplica a conflictos de seguridad. Como el idioma no contradice nada crítico, suele ganar el chat por ser lo más reciente y específico.

La lección es directa: cuando el idioma importa de verdad, no lo dejes a la jerarquía. Ponlo donde no compita, en el _system prompt_ o en el proyecto, nunca como comentario de paso.

Pruébalo en dos herramientas distintas, como ChatGPT y Claude, o ChatGPT y Copilot. Los resultados van a diferir, y de esa diferencia también aprendes.

¿Cómo funciona la memoria entre sesiones de un modelo de IA?

El segundo experimento pone a prueba qué recuerda tu asistente cuando cierras una conversación y abres otra. Y aquí hay tres cosas que se confunden todo el tiempo:

- **Memoria explícita**: lo que guardaste a propósito.
- **Memoria automática**: lo que el sistema decidió guardar por su cuenta.
- **Nada**: cuando la sesión empieza completamente limpia.

Para diferenciarlas, haz esto: abre una sesión y dale un dato verificable, por ejemplo "nuestro SLA de devolución es de 14 días hábiles" [1:35]. Cierra esa conversación, abre una nueva y pregunta de forma indirecta: "¿cuántos días tengo para procesar esta devolución?".

> **¿Cuál es la mejor respuesta que puede darte un agente sin memoria?** Cuando dice "no lo tengo, ¿me lo confirmas?". Un agente que admite que no sabe vale más que uno que inventa con seguridad.

¿Lo supo, lo inventó o te preguntó? La tercera opción es la que mejor te conviene. Un agente honesto sobre sus límites es más útil que uno confiado y equivocado.

¿Qué es la sycophancy y cómo evitar que la IA te dé siempre la razón?

El tercer experimento aborda algo incómodo: por qué el modelo te da la razón sin merecerla. En inglés se llama _sycophancy_, que es la tendencia del modelo a estar excesivamente de acuerdo contigo a costa de la precisión [2:20].

A veces creemos que somos brillantes porque el modelo nos dice que sí a todo, pero eso viene de cómo se entrena. El **refuerzo con retroalimentación humana** optimiza por lo que a la gente le gusta, y a la gente le gusta que le den la razón.

Lo grave es que te da esa razón superbién redactada y muy convincente. La buena noticia es que el contexto está en tus manos. Estas cinco estrategias funcionan en orden de efectividad:

1. No cargues el contexto con tu conclusión. Pregunta "¿qué ves aquí?" en lugar de "creo que esto está mal, ¿verdad?".
2. Pide el caso contrario: "dame el mejor argumento en contra de lo que te acabo de decir".
3. Ponlo en el _system prompt_, no en el chat. Una instrucción de "señálame cuando me equivoque" se erosiona en la conversación, pero en el _system prompt_ persiste.
4. Separa las sesiones. Pide la evaluación en un contexto limpio, sin el historial donde ya defendiste tu postura.
5. Usa una rúbrica: define cómo se ve una buena respuesta y pide validación contra ella, no contra tu opinión.

Después de aplicarlas, notarás que el modelo empieza a ser un colaborador crítico en vez de un espejo complaciente.

¿Cómo integrar las cinco piezas del entregable final?

El reto final no te pide nada nuevo, solo juntar las cinco piezas que armaste a lo largo del curso [3:45]. Estas son:

- El _system prompt_, donde cada restricción está justificada con un caso real de falla.
- El mapa de fuentes de contexto, esa tablita que hiciste antes.
- La lista de _tools_, con parámetros expresivos e instrucciones de uso en la descripción de cada herramienta, no en el _system prompt_.
- El documento de mantenimiento para _handoff_: qué hay en la superficie y por qué, qué se revisa y cada cuánto, qué memorias expiran, cuáles son los momentos _gotcha_ y qué no agregar nunca al _system prompt_.

¿Qué debe revisar el checklist de evaluación?

Con esas piezas armas un _checklist_ que verifica la salud de tu sistema. Debes:

- Confirmar que no haya contradicciones.
- Generar el _prompt_ mínimo viable.
- Quitar todas las herramientas sin uso.
- Evitar que la información crítica quede enterrada.
- Auditar la memoria para que sobreviva a la prueba de los 40 turnos.

Esa cuarta pieza, el documento de _handoff_, es la que más se parece al trabajo del día a día. Escribe pensando en quién va a heredar tu sistema, porque ahí está el verdadero valor de un asistente bien construido.

¿Con qué proyecto profesional o personal vas a poner en práctica todo esto? Déjamelo en los comentarios y ahí voy a estar superatenta.

----

RESUMEN
Montar un asistente ejecutivo con Claude Code es la forma más práctica de centralizar tu trabajo diario en una sola carpeta que la inteligencia artificial pueda leer, actualizar y usar como contexto permanente. La idea es simple: en lugar de repetirle a la IA quién eres cada vez que abres una conversación, dejas que viva en un hub local con todo tu contexto listo para ejecutar tareas reales.

Esta guía es para profesionales no programadores que quieren dejar de improvisar prompts sueltos y empezar a operar con un sistema. Si trabajas con múltiples herramientas, reuniones y entregables, aquí encontrarás el flujo exacto para armarlo.

¿Qué es un asistente ejecutivo con IA y por qué usar una carpeta local?

Un asistente ejecutivo basado en IA es una carpeta viva en tu computador que funciona como el sistema operativo de tu trabajo. Ahí guardas objetivos, proyectos, decisiones y transcripts, y la IA lee todo ese contexto cada vez que la abres.

¿Qué es un CLAUDE.md? Es el primer archivo que lee Claude Code al abrir una carpeta. Contiene las reglas de comportamiento, tu rol, tus objetivos y el tono con el que quieres que la IA te hable a ti y a tus colaboradores.

La ventaja de tener una sola carpeta sombrilla es que nada queda por fuera. Cada idea, reunión o decisión que proceses ahí se acumula y hace crecer el contexto disponible para las siguientes tareas [1:45].

¿Cómo se estructura la carpeta del asistente?

Al correr el prompt de configuración, Claude Code genera automáticamente una estructura organizada. En el ejemplo de la clase aparecen carpetas como proyectos, conectores, contexto, ideas y el archivo raíz CLAUDE.md.

Proyectos: entregables activos y su estado.
Conectores: fuentes de datos vinculadas como Slack o Gmail.
Contexto: información sobre tu equipo, empresa y stakeholders.
Ideas: capturador rápido de pensamientos, incluso por voz.
CLAUDE.md: reglas maestras que rigen todo el comportamiento.
¿Cómo configurar tu asistente ejecutivo con un prompt de entrevista?

El truco es invertir el flujo: en lugar de tú promptear a la IA, dejas que la IA te entreviste. Se corre un prompt de cuatro a cinco pasos donde respondes con voz natural, sin preocuparte por la estructura [2:30].

Las preguntas del flujo son:

Tu rol: a qué te dedicas y en qué empresa trabajas.
Tu equipo: quiénes son tus colaboradores y sus funciones.
Tu foco actual: en qué proyecto estás enfocado ahora mismo.
Tus objetivos: metas del trimestre y cómo medirás el éxito.
Tus conectores: qué fuentes de datos usas a diario.
¿Qué conectores conviene enlazar? Los que uses todos los días. En el caso de la clase se conectan Gmail, Google Calendar, Google Drive, Slack y Zoom, para que la IA pueda leer correos, reuniones y mensajes sin fricción.

Respondiendo con voz das más información en menos tiempo. La recomendación de Felipe es no ir rápido: entre más detalle des, mejor te va a servir el asistente después.

¿Cómo definir objetivos que la IA pueda perseguir?

Aquí mezclas dos capas. Por un lado, objetivos ambiciosos y de largo plazo, como ser la empresa número uno de educación en la era de IA. Por otro, entregables concretos de la semana con métricas claras, como lanzar un nuevo feature de Learn o cerrar una meta de ventas [5:10].

Cada conversación futura con el asistente tendrá esos objetivos en mente y empujará las decisiones hacia ellos. Ese es el efecto de dejar el contexto persistente en el CLAUDE.md.

¿Qué puedes pedirle a tu asistente ejecutivo una vez configurado?

Con el contexto cargado, el asistente pasa de responder preguntas sueltas a ejecutar rutinas completas. Puedes automatizar tu preparación diaria, procesar información dispersa y hasta redactar mensajes desde Claude Code hacia Slack o correo.

Algunos usos concretos:

Preparar tu día: revisa tu calendario, resume las reuniones y te alista para cada una.
Resumir Slack y correo: extrae lo importante de tus canales y bandeja de entrada.
Cuadrar entregas: ayuda a coordinar proyectos activos con tu equipo.
Capturar ideas por voz: las organiza en la carpeta ideas sin que tengas que escribir.
Redactar mensajes: los envía directamente desde Claude Code al destinatario correcto.
Cuando una rutina queda bien hecha, puedes convertirla en un skill reutilizable. Así, en vez de repetir instrucciones cada mañana, basta con invocar el skill y el asistente ejecuta el flujo completo [8:20].

¿Cómo se mantiene vivo el asistente en el tiempo?

La clave es que sea un folder vivo, no un documento estático. Cada reunión que transcribes, cada decisión que tomas y cada cambio de prioridad debe loguearse dentro de esta carpeta. Si trabajas por fuera, ese contexto se pierde y el asistente empieza a quedarse ciego.

El CLAUDE.md también es editable. Puedes ajustar el tono con el que la IA te habla a ti, cambiarlo cuando redacta para tus colaboradores, o pedirle mensajes casuales y cortos para Slack. Todas esas reglas viven en el mismo archivo raíz.

Ahora es tu turno: arma tu primera carpeta de asistente ejecutivo, crea un skill útil y cuéntanos en los comentarios cómo lo estás usando para ordenar tu día.

---

