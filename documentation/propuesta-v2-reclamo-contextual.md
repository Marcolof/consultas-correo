# Propuesta V2 — Asistente guiado

**Estado:** alternativa en exploración · **Última actualización:** 22/09/2026
**Ruta en el prototipo:** `/prototipo/v2`

> **Esta propuesta NO reemplaza a V1.** Las dos conviven y se eligen desde la
> landing del módulo (`/prototipo/`). V1 es la propuesta ya presentada al
> cliente; V2 es una segunda lectura del mismo problema, abierta a partir de
> la inconformidad del cliente con el enfoque de sección única.

---

## 1. La idea

En V1 el usuario entra a una sección y tiene que **encontrar su caso dentro
del catálogo completo**. En V2 no hay catálogo a la vista: el sistema hace
unas pocas preguntas y **va podando** hasta dejarlo en el lugar correcto.

| | V1 | V2 |
|---|---|---|
| Qué ve al entrar | Todas las gestiones disponibles | Una pregunta |
| Cómo llega a su caso | Filtrando y buscando | Contestando, o buscando |
| Qué completa después | Todo el formulario | Sólo lo que no se dedujo de sus respuestas |
| Si se equivoca | Vuelve a filtrar | Cambia una respuesta y el resto se recalcula |

### Dos caminos, un solo árbol

El buscador **no es una pantalla aparte**: busca sobre las hojas del mismo
árbol y, al elegir un resultado, deja el asistente exactamente donde habría
quedado contestando pregunta por pregunta. Por eso el resultado muestra
también su ruta (`Sí, tengo cuenta › Mi cuenta o facturación › Errores en mi
factura`): el usuario ve dónde está parado y puede seguir desde ahí.

## 2. Las reglas de diseño

Acordadas explícitamente con el usuario el 22/09/2026:

1. **Máximo 3 preguntas** antes de llegar a destino. Si una rama necesita
   más, se reordena el árbol; no se agrega un paso. La regla vive escrita en
   `arbol.json` (`_regla_de_profundidad`). **No se muestra un contador**
   ("Pregunta 2 de 3") a propósito: condiciona al usuario.
2. **El buscador queda**, como atajo para quien ya sabe qué quiere.
3. **Se puede volver atrás** a cualquier respuesta ya dada y cambiarla.
4. **Poco texto.** Sin subtítulos explicativos, sin descripciones bajo las
   opciones y sin ayudas debajo de cada pregunta: el encabezado pregunta y
   las tarjetas responden.
5. **Nada inventado en el listado de opciones.** Ver más abajo.

Los íconos son de **Lucide** (`lucide-react`). El árbol declara ids
semánticos (`cuenta`, `paquete`, `oficio`…) y `components/Icono.tsx` los
resuelve a un ícono concreto, así cambiar de librería no obliga a tocar el
dato. Las tarjetas llevan una sombra suave para despegarse del fondo.

### Distribución

Sigue la imagen de referencia aportada por el usuario (una página de
"Contactanos" con una grilla de pocas opciones grandes y, debajo, una fila de
accesos rápidos). Dos diferencias deliberadas: el contenido de cada tarjeta
va centrado como en la referencia, pero **la página no se centra** —
conserva la alineación a la izquierda del chrome real de MiCorreo, decidida
el 02/09/2026 contra una captura de producción.

### Regla de contenido: nada inventado en el listado

**Cada hoja del árbol es, palabra por palabra, una gestión documentada.** Las
19 gestiones reales de
[`categorias-gestiones.json`](../proto%20navegable/src/core/gestiones/data/categorias-gestiones.json)
están todas, y no hay ninguna de más: las 8 marcadas "(Gestión inventada)"
de Paquetería Internacional y Mis Comunicaciones Digitales quedan fuera. Las
agrupaciones de segundo nivel son las categorías de ese mismo archivo.

Verificado por script: 19 documentadas, 19 hojas, ninguna sin usar, ninguna
de más, profundidad máxima exactamente 3.

Lo único que **no** sale del dato, y por lo tanto hay que validar:

1. el corte inicial entre "Tengo cuenta en MiCorreo" y "No tengo cuenta";
2. que "No tengo cuenta" lleve a las gestiones de Paquetería Nacional;
3. qué gestión abre qué formulario de referencia;
4. el filtro por estado del envío (`visibleSi`).

### Qué ve cada tipo de usuario

Las agrupaciones que se muestran dependen del **tipo de usuario activo**, que
en el prototipo se simula desde el panel "Casos de uso" (botón inferior
derecho). No es una regla nueva de V2: es la misma `profile_category_visibility`
que ya usa V1, y V2 la **consulta** desde su fuente canónica en vez de
copiarla.

| Tipo de usuario | Ve |
|---|---|
| Individuo / Pyme | Mi Cuenta · Paquetería Nacional · Oficios Judiciales |
| Franquicias | + Franquicias (no ve Fulfillment) |
| Fulfillment | + Fulfillment (no ve Franquicias) |

El filtro alcanza también al **buscador**: buscar "stock" siendo Individuo da
cero resultados, porque Fulfillment no existe para ese usuario. Y si alguien
cambia de tipo de usuario estando dentro de una agrupación que deja de verse,
el recorrido vuelve al paso anterior y lo avisa, en vez de dejarlo en una
rama inaccesible.

### Lo que NO tiene

**No hay pantalla de "Mis gestiones" ni seguimiento de reclamos.** Se había
construido una y se quitó el 22/09/2026 a pedido del usuario: nunca se pidió,
y el HTML de producción tampoco la tiene (ver sección 2 del
[`brief`](brief-consultas-reclamos.md)). El alcance de V2 termina en el
número de caso.

## 3. Cómo está armado

### El árbol es un dato, no código

Todo vive en `proto navegable/src/v2/data/arbol.json`. La pantalla es un
motor que muestra el nodo actual. **Agregar, sacar o reordenar una rama es
editar ese JSON.**

No está anidado: es un **diccionario plano de nodos que se apuntan por id**.
Así un mismo nodo (por ejemplo "no tengo cuenta") existe una sola vez aunque
le lleguen varias ramas, en vez de estar copiado en cada una.

Tres tipos de nodo:

| Tipo | Qué hace | Por qué importa |
|---|---|---|
| `pregunta` | Opciones que apuntan a otro nodo | Es la rama |
| `informacion` | Responde y cierra **sin generar reclamo** | Un buen triage resuelve casos sin abrir un caso |
| `formulario` | Abre el formulario que corresponde | Es la hoja |

Un nodo `informacion` puede ofrecer una salida alternativa ("ya lo intenté,
quiero reclamar igual"), así la autoayuda nunca es un callejón sin salida.

### El contexto acumulado

Cada respuesta deja un dato en un **contexto**. Ese contexto hace dos cosas:

- **Saltea preguntas.** Una pregunta cuya respuesta ya está en el contexto no
  se muestra. Es lo que hace que el mismo árbol sirva para el usuario anónimo
  (que contesta "¿tenés cuenta?") y para el logueado (que no la ve nunca).
- **Acorta el formulario final.** Un campo marcado con `contexto` se muestra
  precargado si el dato está, y se le pide al usuario si no está. Un solo
  formulario cubre los dos casos, sin definiciones duplicadas.

### Los accesos rápidos

Debajo de las opciones, sólo en el inicio, hay una fila de atajos
(`accesos_rapidos` en el mismo JSON). Cada uno salta a **un nodo del mismo
árbol** declarando su `camino`, o a otra pantalla con `ruta`. No son una
estructura paralela: son posiciones del árbol a las que se llega de un clic.

Hoy son seis, y **cinco de ellos son gestiones documentadas** de las 19
reales: Demora en el servicio, Inconvenientes con la entrega, Paquete
dañado, Errores en mi factura y No veo el stock. El sexto es **Ingresar un
reclamo**, que va directo al formulario sin pasar por el asistente.

**El orden importa y es deliberado** (cambio del 22/09): "Ingresar un
reclamo" va **último, al extremo derecho**. Es el único atajo que no
corresponde a una gestión documentada y el único que saltea el recorrido
guiado; dejarlo primero lo convertía en la salida más directa, justo lo
contrario de lo que busca la propuesta. Ahora las gestiones concretas van
antes y el formulario en blanco queda como último recurso.

Los que apuntan a una gestión **se ocultan solos** si el tipo de usuario
activo no ve esa categoría: un Individuo ve 4 atajos, un usuario Franquicias
ve 5 (con "Errores en mi factura") y uno Fulfillment ve 5 (con "No veo el
stock"). No es una lista aparte: se valida recorriendo el mismo árbol.

**Cuáles son los de mayor uso es una suposición.** No hay dato de frecuencia
real; se eligieron los que parecen más habituales entre las 19 documentadas.

> **Qué se sacó (22/09):** había un atajo **"Mis envíos"** que abría
> `/v2/envios`. Se quitó porque llevaba a una pantalla que **no existe en la
> documentación del proyecto** — el listado de envíos es contenido inventado
> (`envios.json`), no una pantalla relevada. Un atajo del inicio no puede ser
> la puerta a algo que no está documentado. En su lugar entró **Paquete
> dañado**, que sí es una de las 19 gestiones reales.

### La entrada desde un envío

Entrar a reclamar desde un envío es **empezar con respuestas ya dadas**. El
contexto arranca con `esUsuario`, `tema=envio` y los datos del envío, así que
las dos primeras preguntas se saltean solas y el usuario cae directo en la
tercera.

> **Estado al 22/09:** este recorrido **ya no tiene entrada desde la
> interfaz**. Al sacar el atajo "Mis envíos", las pantallas `/v2/envios` y
> `/v2/envios/:id` quedaron **huérfanas**: sólo se llega por URL directa. El
> mecanismo de contexto precargado sigue funcionando y se puede demostrar con
> `?envio=CD482910073AR`, que es lo que importa conceptualmente. **Queda
> pendiente decidir** si esas dos pantallas se borran o se conservan como
> demostración: son la única pieza que muestra el "reclamo contextual" de la
> reunión de Claims, pero se apoyan en datos inventados.

Además, una opción puede declarar en qué estados aplica (`visibleSi`), así un
envío demorado no ofrece "llegó dañado". Si no hay estado en el contexto, se
muestran todas.

**Contraste medido en el prototipo**, mismo formulario de demora:

| Camino | Precargados | A completar |
|---|---|---|
| Desde el envío | 4 | 3 |
| Sin cuenta, contestando preguntas | 0 | 7 |

### El buscador

Al escribir, el resultado no aparece de golpe: se muestra un indicador breve
("Buscando…") y recién después la lista. El campo tiene una **cruz a la
derecha** para vaciar la búsqueda, y arriba a la izquierda queda un botón
**"← Volver"** para retomar el recorrido guiado sin borrar a mano.

El **contador de resultados** ("6 resultados") no va en esa misma línea:
baja un nivel y queda **pegado arriba del listado**, que es lo que cuenta.
Así la línea de arriba dice siempre lo mismo —cómo salir— y el resto de la
pantalla es el resultado.

La espera es deliberada: el filtro es en memoria y responde al instante, pero
sin ese intervalo el cambio de contenido no se percibe.

### Volver atrás (22/09)

Los pasos ya elegidos se muestran como una fila de "migas" clicleables, y
cualquiera de ellas devuelve a ese punto. Pero apuntarle a una miga es un
gesto de precisión, y era la **única** forma de retroceder al entrar a una
tarjeta.

Ahora, **a la izquierda de esa fila y antes de las migas**, hay un botón
**"← Volver"** que deshace **un** paso. Está en el mismo sitio y con el
mismo tratamiento que el "← Volver" de la búsqueda, a propósito: se llegue
por tarjeta, por atajo o por buscador, la salida está siempre arriba a la
izquierda.

Se quitó **"Empezar de nuevo"**. Volver al principio es tocar la primera
miga, que ya hace exactamente eso: el botón repetía una función que la fila
de migas resuelve sola y competía visualmente con el "Volver". Las migas
siguen siendo la forma de saltar a cualquier punto intermedio.

> La única "Empezar de nuevo" que queda es la del cartel de error
> ("No pudimos seguir desde acá"), donde no hay migas a las que volver.

El atajo "Ingresar un reclamo" abre otra pantalla (`/v2/reclamo`) y ya tenía
su propio "← Volver" al inicio del asistente.

### El estado vive en la URL

El recorrido se reconstruye entero desde `?p=op1,op2` (más `?q=` para la
búsqueda y `?envio=` para la entrada contextual). Consecuencias:

- cualquier paso es enlazable y sobrevive a un F5;
- volver atrás es recortar esa lista;
- si un enlace guardado apunta a una opción que ya no aplica, el asistente
  para en la pregunta anterior y lo avisa, en vez de adivinar.

## 4. El árbol de hoy

```
Elegí un tema
├─ Mi Cuenta → 2 gestiones
├─ Paquetería Nacional → 6 gestiones
├─ Franquicias → 4 gestiones          (sólo usuario Franquicias)
├─ Fulfillment → 6 gestiones          (sólo usuario Fulfillment)
└─ Oficios Judiciales → 1 gestión
```

**Dos preguntas hasta el formulario**, y cuántas tarjetas se ven en la
primera depende del tipo de usuario: Individuo y Pyme ven **3**, Franquicias
y Fulfillment ven **4**.

### Por qué el primer nivel son las categorías

El 22/09/2026 se quitó la pregunta inicial "¿Tenés cuenta en MiCorreo?": a
esta sección **no llega un usuario sin cuenta**, así que la pregunta era
inválida. Al buscar con qué reemplazarla, la respuesta estaba en la
documentación: **no existe ningún nivel de agrupación por encima de las
categorías**. `mis-gestiones-categorias.md` describe una base de dos
niveles —tipo de usuario → categorías, categoría → gestiones— y el análisis
funcional describe el mismo recorrido. Inventar tres "temas principales"
por encima habría sido agregar una capa que nadie definió.

Así que el primer nivel **son las categorías**, y el hecho de que a un
usuario común le queden exactamente 3 no es una decisión de diseño: es lo
que resulta de aplicar la regla de visibilidad documentada.

Las 19 hojas son las 19 gestiones documentadas. Paquetería Internacional y
Mis Comunicaciones Digitales no aparecen porque su contenido es inventado y
ya estaban fuera del MVP en V1.

## 4.1 Los formularios son de referencia

Los formularios reales **ya existen en producción**, viven en otras URLs y
varían según la consulta. Los del prototipo no los reemplazan ni los
proponen: están rotulados en pantalla como **"Formulario de referencia"**,
con la aclaración de que los verdaderos tienen otra URL. Sirven para mostrar
una sola cosa: con qué datos llegaría el caso si el asistente lo entregara.

Por eso el foco no está en sus campos sino en el corte entre "Datos que ya
tenemos" y "Lo que necesitamos de vos".

## 5. Qué es dato real y qué no

| Archivo | Qué contiene | Nivel |
|---|---|---|
| `src/v2/data/arbol.json` — hojas y agrupaciones | Las 19 gestiones documentadas y las categorías de V1 | **Dato real**, tomado de `categorias-gestiones.json` |
| `src/v2/data/arbol.json` — orden y cortes | Qué se pregunta primero y cómo se agrupa | **Hipótesis de diseño** — es lo primero a validar |
| `src/v2/data/formularios.json` | Campos de los formularios de referencia | Inventado, y rotulado como referencia en pantalla |
| `src/v2/data/envios.json` | 4 envíos de ejemplo | Inventado (nombres, direcciones y números ficticios). **Desde el 22/09 ya no se llega por la interfaz** — ver "La entrada desde un envío" |

Lo que no está validado no es *qué* gestiones existen —eso está
documentado— sino **si ése es el camino correcto para llegar a ellas**.

## 6. Conflicto de alcance con el acta del 31/08/2026

El acta acordó que en este MVP (producción 07/10/2026) **no se rediseñan los
formularios**: sólo la pantalla inicial. V2 rediseña el recorrido completo,
formulario incluido.

No es un descuido: sin el formulario que se acorta, V2 no tiene argumento —
el valor de la propuesta *es* que el usuario escriba menos. Por eso V2 se
presenta como **alternativa fuera del MVP vigente**. Si V2 pasara a ser el
camino elegido, la fecha del 07/10/2026 deja de ser sostenible.

## 7. Preguntas abiertas

1. **¿Las categorías son el mejor primer nivel?** Es el único agrupamiento
   documentado, pero la asignación de gestiones a Mi Cuenta, Paquetería
   Nacional y Oficios Judiciales sigue marcada como "inferida por intuición"
   en `mis-gestiones-categorias.md` sección 4. Si esa agrupación cambia,
   cambia la primera pantalla.
2. **Oficios Judiciales tiene una sola gestión**, así que su segunda
   pregunta ofrece una sola opción. ¿El negocio tiene más gestiones para
   esa categoría, o conviene que esa tarjeta vaya directo al formulario?
3. ¿Los accesos rápidos que son gestiones son los correctos? Se eligieron
   por suposición entre las 19 documentadas; **no hay dato de frecuencia
   real de uso**. (El 22/09 "Mis envíos" se reemplazó por "Paquete dañado"
   y "Ingresar un reclamo" pasó al extremo derecho.)
4. ¿A qué URL real debería llevar cada formulario? Hoy el prototipo muestra
   un formulario de referencia en vez de redirigir.
5. ¿Qué otras entidades además del envío deberían tener entrada contextual
   (facturación, saldo, sellos), y en qué orden?
6. ¿Qué datos puede precargar realmente el sistema en cada formulario?
7. ¿Debería haber respuestas de autoayuda que resuelvan sin abrir reclamo?
8. **¿Se borran las pantallas de envíos?** `/v2/envios` y `/v2/envios/:id`
   quedaron sin entrada desde la interfaz al sacar el atajo "Mis envíos".
   Son la única demostración del "reclamo contextual" de la reunión de
   Claims, pero se apoyan en datos inventados. Opciones: borrarlas, dejarlas
   como demo por URL directa, o reemplazarlas por una entrada contextual
   sobre alguna entidad que sí esté documentada.
   El motor las soportaba y se quitaron el 22/09 porque ninguna está
   documentada; se pueden reponer cuando el negocio defina su contenido.
8. ¿Cómo se relaciona esto con el microservicio "MS Claims"? El prototipo
   asume un formulario por tipo de problema, que es lo que un adaptador
   resolvería.
9. ¿Alcanza con "← Volver" como única salida? El 22/09 se unificó el
   rótulo en los dos caminos y se sacó "Empezar de nuevo"; queda por ver en
   validación si alguien busca un reinicio explícito.

## 8. Documentos relacionados

- [`brief-consultas-reclamos.md`](brief-consultas-reclamos.md) — alcance general.
- [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) — la regla vigente de V1.
- [`pantalla-reclamos-listado.md`](pantalla-reclamos-listado.md) — la pantalla de V1.
- [`analisis-funcional-reclamos.md`](analisis-funcional-reclamos.md) — análisis funcional de V1.
