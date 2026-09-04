# Análisis funcional — "Mis gestiones" (antes "Consultas y Reclamos")

> **Para**: Analista Funcional (AFU).
> **Estado: borrador — consolida lo confirmado hasta el 2026-09-02.** No es
> un documento nuevo de fuente: reorganiza y resume, para lectura funcional,
> lo ya relevado en [`brief-consultas-reclamos.md`](brief-consultas-reclamos.md),
> [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) y
> [`pantalla-reclamos-listado.md`](pantalla-reclamos-listado.md). Ante
> cualquier diferencia, esos documentos (y sus JSON de datos) son la
> fuente de verdad; este documento es una vista de lectura rápida.
>
> **2026-09-02 — cambio importante**: la sección cambió de nombre
> ("Reclamos" → "Mis gestiones", nombre que puede volver a cambiar) y se
> agregó un eje de **categorías de producto/servicio** (7, chips) además
> del tipo de usuario. El tipo de usuario **sigue existiendo** — ahora 4
> tipos (se agregó "Pyme") — y decide qué categorías son visibles, no qué
> motivos individuales (esa regla vieja, sección 3, sí quedó superada).
>
> Se marca explícitamente qué está **confirmado** (dato de negocio provisto
> por el usuario), qué es **inferido por intuición** (agrupación nuestra
> sobre datos reales, no validada) y qué es **inventado** (sin ningún dato
> real detrás, generado sólo para no dejar la pantalla vacía). No se
> inventan reglas de negocio, criterios de aceptación ni resultados de
> testing.

## 1. Objetivo del proyecto

Mejorar la experiencia de "Mis gestiones" (antes "Consultas y Reclamos")
de MiCorreo (Correo Argentino), de forma incremental: la primera entrega
debe aportar valor por sí sola sobre lo que ya existe en producción, sin
necesidad de cubrir todavía todo el alcance futuro del proyecto.
*(Confirmado — brief original del usuario.)*

## 2. Alcance funcional cubierto hasta hoy

Lo único construido y navegable hoy es el **listado de "Mis gestiones"**
(pantalla `ReclamosListPage`, ruta `/prototipo/` dentro del sitio único
del proyecto — el nombre de archivo no se tocó, ver
[`mis-gestiones-categorias.md`](mis-gestiones-categorias.md#1-cambio-de-nombre-reclamos--mis-gestiones)).
No están construidas: alta de una gestión nueva, pantalla de detalle de
una gestión, ni ningún otro tipo de consulta.

Fuera de alcance / no definido todavía (ver sección 8): qué otros tipos de
consulta existen en el producto real más allá de la gestión, y qué
significa "administrar consultas".

### 2.1 Pantallas y componentes afectados

> Distinción pedida explícitamente por el usuario: no todo lo que cambió
> es una pantalla — una parte es chrome global que aparece en cualquier
> vista, no un lugar al que se navega.

| Tipo | Nombre | Cómo se accede | Detalle |
|---|---|---|---|
| **Pantalla** | "Mis gestiones" (nombre **provisorio**, antes "Reclamos" — ver sección 1 de [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md#1-cambio-de-nombre-reclamos--mis-gestiones)) | Dropdown "Mi cuenta" del header (ítem homónimo, ver fila siguiente) | Pantalla completa rediseñada: categorías (chips), buscador con tags de sinónimo, contador, listado. Único artefacto construido de punta a punta — `pages/ReclamosListPage.tsx`. |
| **Componente global** (no es una pantalla) | Barra de navegación superior (header) — ítem del dropdown "Mi cuenta", antes "Ingresar Reclamos" | Visible en el header de **toda** la app, no en una ruta puntual | Es chrome replicado del sitio real (`core/navigation/navigation.config.ts`), no navega a ningún lado hoy (ni antes ni después de este cambio). Lo único que cambió (2026-09-03) es que el **texto** del ítem sigue automáticamente al nombre vigente de la sección (`SECTION_LABEL`) en vez de tener el string "Ingresar Reclamos" hardcodeado — si el nombre de la pantalla vuelve a cambiar, este ítem se actualiza solo. Detalle técnico en [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md#1-cambio-de-nombre-reclamos--mis-gestiones). |

Ambas filas son consecuencia del mismo cambio de nombre ("Reclamos" →
"Mis gestiones"), pero son dos superficies distintas del código
(`pages/ReclamosListPage.tsx` vs. `core/navigation/navigation.config.ts`)
con impacto distinto: la pantalla es el producto en sí; el ítem del menú
es sólo un punto de entrada textual hacia ella, sin lógica propia.

## 3. Histórico — motivo×perfil (SUPERSEDED 2026-09-02)

*(Confirmado en su momento — definición funcional provista por el usuario
el 2026-09-01. Reemplazado por las categorías de la sección 4.)*

Hasta el 2026-09-01, el negocio distinguía 3 perfiles de usuario
(Individuo, Franquicias, Fulfillment) que veían subconjuntos distintos de
**motivos individuales**. Esa matriz motivo×perfil queda **superada**: no
decide nada en la pantalla actual. El detalle completo sigue disponible
en [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md) por
trazabilidad. (Lo que **no** quedó superado es la idea de que el tipo de
usuario importa — ver sección 4.2, es un mecanismo nuevo, no una
reactivación de este.)

## 4. Categorías vigentes y visibilidad por tipo de usuario (2026-09-02)

*(Fuente: definición provista por el usuario el 2026-09-02, en dos
mensajes de la misma sesión. Detalle completo en
[`mis-gestiones-categorias.md`](mis-gestiones-categorias.md).)*

### 4.1 Las 7 categorías (contenido)

| # | Categoría | Gestiones | Origen del contenido | Disponible hoy |
|---|---|:---:|---|---|
| 1 | Mi Cuenta | 2 | Inferido por intuición | Sí |
| 2 | Paquetería Nacional | 6 | Inferido por intuición | Sí |
| 3 | Paquetería Internacional | 4 | **Inventado** | **No — fuera del alcance de este MVP** |
| 4 | Franquicias | 4 | **Confirmado** por el usuario | Sí |
| 5 | Fulfillment | 6 | **Confirmado** por el usuario | Sí |
| 6 | Mis Comunicaciones Digitales | 4 | **Inventado** | **No — fuera del alcance de este MVP** |
| 7 | Oficios Judiciales | 1 | Inferido por intuición | Sí |

**Sólo Franquicias y Fulfillment tienen contenido que el negocio confirmó
textualmente.** Las otras 5 categorías se completaron con dos criterios
distintos que no hay que confundir:

- **Inferido por intuición** (Mi Cuenta, Paquetería Nacional, Oficios
  Judiciales): son gestiones reales (de la matriz de motivos ya conocida),
  reagrupadas por intuición en la categoría que parece corresponder — el
  contenido es real, la categoría asignada no está confirmada.
- **Inventado** (Paquetería Internacional, Mis Comunicaciones Digitales):
  no hay ninguna gestión real todavía; se generaron 4 gestiones de relleno
  por categoría, cada una con el label terminado en literalmente
  **"(Gestión inventada)"**, para que la pantalla no se vea vacía.

> ⚠️ **2026-09-03 — decisión de alcance del usuario:** Paquetería
> Internacional y Mis Comunicaciones Digitales quedan **fuera del alcance
> de este MVP**, planificadas para una **próxima salida** una vez que
> exista contenido real. No aparecen como chip ni suman a "Todos" para
> ningún tipo de usuario. Detalle técnico e implementación en
> [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) sección 5.1.

⚠️ **"Todos" NO es "las 27 gestiones del sistema"** — es la unión de las
categorías visibles para el tipo de usuario activo (corregido 2026-09-02,
era un bug: mostraba las 27 sin importar el perfil) **y que además no
estén fuera de este MVP** (ver el recuadro de arriba). Con Paquetería
Internacional y Mis Comunicaciones Digitales fuera de alcance:
Individuo/Pyme con "Todos": 9 gestiones. Franquicias: 13. Fulfillment: 15.
Ver sección 4.2.

### 4.2 Visibilidad por tipo de usuario (quién ve qué categoría)

**4 tipos de usuario** (Individuo, Pyme, Franquicias, Fulfillment — se
agregó "Pyme" el 2026-09-02) deciden qué categorías (chips) existen,
**no** cuál viene preseleccionada — "Todos" es siempre el default y está
disponible para los 4 tipos:

| Tipo de usuario | Categorías que NO ve |
|---|---|
| Individuo | Franquicias, Fulfillment |
| Pyme | Franquicias, Fulfillment |
| Franquicias | Fulfillment |
| Fulfillment | Franquicias |

Las 5 categorías restantes (Mi Cuenta, Paquetería Nacional, Paquetería
Internacional, Mis Comunicaciones Digitales, Oficios Judiciales) se ven
por igual en los 4 tipos — no hay ninguna exclusión mencionada sobre
ellas. Si el usuario tenía elegida una categoría que deja de estar
disponible al cambiar de tipo, el filtro vuelve solo a "Todos" (mismo
patrón que la regla anterior con perfiles).

## 5. Flujo funcional de la pantalla (listado de "Mis gestiones")

1. El usuario ingresa a la pantalla con un tipo de usuario ya determinado
   (mecanismo de determinación: **no definido**, ver sección 8) y ve
   "Todos" + las categorías visibles para ese tipo (5 a 7 según la tabla
   de la sección 4.2).
2. La pantalla muestra: buscador de texto libre, chips de categoría
   ("Todos" preseleccionado), contador de resultados y el listado de
   gestiones.
3. **Buscar**: el usuario escribe texto libre; el listado se filtra por
   coincidencia contra el label **y** los tags de búsqueda de cada gestión
   (hasta 50 por gestión, sinónimos generados por Claude — ver
   [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) sección 9),
   sin distinguir mayúsculas ni acentos. Si se escriben varias palabras,
   alcanza con que una sola matchee (palabras de relleno como "no"/"me" no
   bloquean el resultado) y los resultados más relevantes (más palabras
   coincidentes) aparecen primero. No dispara ningún llamado a backend en
   el prototipo — es filtrado en memoria sobre datos estáticos.
4. **Filtrar por categoría**: el usuario elige un chip; el listado se
   acota a las gestiones de esa categoría (o a la unión completa si el
   chip es "Todos"). Buscador y chip se combinan (AND). Aparece un link
   "Limpiar filtro" cuando el chip activo no es "Todos".
5. **Sin resultados**: si la combinación de búsqueda + chip no encuentra
   nada, se muestra un estado vacío con mensaje y sugerencia de cambiar la
   búsqueda o la categoría.
6. **Seleccionar una gestión de la lista**: hoy sólo muestra un aviso
   temporal ("pantalla de detalle todavía no implementada") — **no hay
   pantalla de detalle construida todavía**.
7. **Cambio de tipo de usuario** (mecanismo de prototipo, no de
   producción): un panel de control permite simular los 4 tipos para
   validar qué categorías aparecen, en la misma sesión.

## 6. Historias de usuario

> Formato *Como / Quiero / Para*, con criterios de aceptación derivados de
> lo que ya está construido y verificado en el prototipo — no de negocio
> no confirmado. Donde el criterio depende de una regla no validada
> (sección 4.1), se marca explícitamente. Numeración `HU-XX` propia de
> este documento, no del backlog del proyecto (todavía no existe uno).

**HU-01 — Ver mis gestiones agrupadas por categoría**
Como usuario de MiCorreo (cualquier tipo), quiero ver mis gestiones
agrupadas por categoría de producto/servicio en vez de un listado plano de
motivos, para encontrar más rápido la que me corresponde sin leer 27
opciones sueltas.
- Criterios de aceptación:
  - Al entrar a la pantalla, el chip "Todos" viene seleccionado y el
    listado muestra la unión de gestiones de las categorías visibles para
    mi tipo de usuario (ver HU-06).
  - Cada categoría visible aparece como chip, en el orden fijo de
    `GESTION_CATEGORIES` (sección 4.1), no en orden alfabético ni de uso.
  - El contador arriba del listado siempre refleja la cantidad de
    resultados actualmente visibles (post-filtro y post-búsqueda).

**HU-02 — Encontrar una gestión sin saber el nombre exacto**
Como usuario, quiero escribir en el buscador con mis propias palabras
(no necesariamente el título exacto de la gestión), para no tener que
adivinar cómo está redactada en el sistema.
- Criterios de aceptación:
  - El buscador matchea contra el label de la gestión **y** contra sus
    tags de sinónimo (hasta 50 por gestión — ver
    [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) sección 9).
  - No distingue mayúsculas ni acentos.
  - Si escribo una frase de varias palabras, alcanza con que **una** sea
    relevante (3+ letras) para obtener resultados — palabras de relleno
    ("no", "me", "la") no bloquean la búsqueda.
  - Los resultados con más palabras coincidentes aparecen primero.
  - La búsqueda responde al instante, tecla por tecla (no hay que apretar
    "Buscar" ni esperar un debounce) — es filtrado en memoria, sin
    llamado a backend en el prototipo.

**HU-03 — Acotar el listado por categoría**
Como usuario, quiero tocar una categoría puntual para ver sólo sus
gestiones, para no scrollear entre las de otras categorías que no me
interesan ahora.
- Criterios de aceptación:
  - Al tocar un chip, el listado se acota a las gestiones de esa
    categoría exclusivamente.
  - Buscador y categoría se combinan con AND: si además hay texto en el
    buscador, el resultado es la intersección de ambos filtros.
  - Aparece un link "Limpiar filtro" en la misma línea que el contador,
    alineado a la derecha, sólo cuando el chip activo no es "Todos".

**HU-04 — Volver a ver todo con un solo toque**
Como usuario que filtró por una categoría y quiere volver atrás, quiero
un atajo para sacar el filtro sin tener que volver a tocar "Todos" a
mano.
- Criterios de aceptación:
  - Tocar "Limpiar filtro" vuelve el chip activo a "Todos" sin alterar el
    texto de búsqueda que hubiera escrito.

**HU-05 — Entender cuándo no hay resultados**
Como usuario que buscó o filtró y no encontró nada, quiero un mensaje
claro en vez de una pantalla vacía sin explicación, para saber que tengo
que ajustar el buscador o el filtro, no que el sistema está roto.
- Criterios de aceptación:
  - Si la combinación de búsqueda + categoría no devuelve ítems, se
    muestra un estado vacío con mensaje y sugerencia de cambiar la
    búsqueda o la categoría (`EmptyState`, no una lista en blanco).

**HU-06 — No ver categorías que no me corresponden**
Como usuario Individuo o Pyme, quiero que la pantalla no me muestre
categorías de otro tipo de cuenta (Franquicias, Fulfillment) que no uso,
para no confundirme con opciones que no aplican a mi cuenta.
- Criterios de aceptación:
  - Individuo y Pyme no ven el chip "Franquicias" ni "Fulfillment", ni
    sus gestiones dentro de "Todos".
  - Franquicias no ve "Fulfillment" (ni viceversa) — nunca conviven para
    un mismo tipo de usuario.
  - Si tenía seleccionada una categoría que deja de estar disponible al
    cambiar de tipo de usuario, el filtro vuelve solo a "Todos" (no
    queda un chip fantasma seleccionado ni la pantalla se rompe).
  - *(Depende de cómo se determina el tipo de usuario de una cuenta real
    en producción — pregunta abierta 11 de la sección 8. Hoy en el
    prototipo se simula desde un panel de control, no hay autenticación.)*

**HU-07 — Usar la pantalla desde el celular**
Como usuario que entra desde un smartphone, quiero que la pantalla se vea
y use bien en una pantalla angosta, para gestionar mis reclamos sin
depender de una computadora.
- Criterios de aceptación:
  - En ancho mobile, el menú lateral se colapsa a un ícono de hamburguesa.
  - Buscador, chips y listado se recalculan al ancho disponible, sin
    scroll horizontal.
  - *(Hoy verificado sólo con el modo "Responsive" forzado del panel de
    prototipo, que replica el mismo breakpoint real de 768px — no
    probado todavía en un dispositivo físico ni en distintos navegadores
    mobile.)*

**HU-08 (diferida, no implementada) — Ver el detalle de una gestión**
Como usuario que tocó una gestión de la lista, quiero ver su detalle
(estado, historial, próximos pasos, acciones disponibles), para entender
qué está pasando con mi reclamo sin tener que iniciar sesión en otro
lado.
- Estado: **no implementada**. Hoy tocar una fila sólo muestra un aviso
  temporal ("pantalla de detalle todavía no implementada"). Bloqueada por
  la pregunta abierta 8 de la sección 8 (qué datos y acciones debería
  tener) — no se puede escribir un criterio de aceptación real sin esa
  definición.

**HU-09 (fuera de este MVP) — Ver gestiones de Paquetería Internacional y
Mis Comunicaciones Digitales**
Como usuario, quiero ver gestiones reales de envíos internacionales y de
comunicaciones digitales, para no tener que buscar esa ayuda por otro
canal.
- Estado: **fuera del alcance de este MVP** (decisión del usuario,
  2026-09-03 — ver sección 4.1). Las 4 gestiones de relleno de cada
  categoría son contenido inventado, no una historia real: existen sólo
  para poder previsualizar el layout desde el panel de control del
  prototipo, no para que un usuario real las use hoy.

## 7. Análisis funcional detallado

### 7.1 Reglas de negocio (numeradas para referencia cruzada)

| Regla | Enunciado | Fuente |
|---|---|---|
| RN-01 | "Todos" es la unión de las gestiones de las categorías visibles para el tipo de usuario activo — nunca el universo completo de 27 gestiones. | Confirmado (corrección de bug 2026-09-02) |
| RN-02 | Franquicias y Fulfillment son mutuamente excluyentes: ningún tipo de usuario ve ambas categorías a la vez. | Confirmado, textual del usuario |
| RN-03 | Individuo y Pyme no ven Franquicias ni Fulfillment. | Confirmado, textual del usuario |
| RN-04 | Las 5 categorías restantes (Mi Cuenta, Paquetería Nacional, Paquetería Internacional, Mis Comunicaciones Digitales, Oficios Judiciales) no tienen exclusión de perfil documentada. | **Supuesto** — no confirmado por exclusión textual, ver pregunta 3 de la sección 8 |
| RN-05 | Búsqueda y filtro de categoría se combinan con AND (intersección), no OR. | Confirmado por implementación, verificado en navegador |
| RN-06 | Dentro de la búsqueda, coincidir una palabra de la frase alcanza (OR entre palabras); el resultado se ordena por cantidad de palabras coincidentes. | Confirmado por implementación (2026-09-03), verificado en navegador |
| RN-07 | Si la categoría activa deja de estar disponible al cambiar de tipo de usuario, el filtro cae a "Todos" automáticamente. | Confirmado por implementación, verificado en navegador |
| RN-08 | Paquetería Internacional y Mis Comunicaciones Digitales quedan fuera del MVP: sin chip, sin aporte a "Todos", para ningún tipo de usuario, independientemente de RN-04. | Confirmado, decisión de alcance del usuario (2026-09-03) |

### 7.2 Casos borde verificados

- **Cambio de tipo de usuario con texto de búsqueda activo**: el texto del
  buscador **no se borra** al cambiar de tipo de usuario — sólo se
  recalculan las categorías visibles y, si corresponde, el chip activo
  (RN-07). Si el texto de búsqueda dejaba de tener sentido para el nuevo
  tipo (ej. buscaba "franquicia" y ahora soy Individuo), el resultado
  pasa a 0 ítems con el estado vacío de HU-05, no un error.
- **Búsqueda vacía tras borrar todo el texto**: vuelve a mostrar el
  listado completo del filtro de categoría activo, sin re-render roto ni
  parpadeo del contador.
- **Mínimo de gestiones visibles**: ningún tipo de usuario puede quedar
  con 0 gestiones en "Todos" — el piso son las 9 de Mi Cuenta (2) +
  Paquetería Nacional (6) + Oficios Judiciales (1), visibles para los 4
  tipos por igual (sujeto a RN-04).
- **Búsqueda por nombre de categoría**: cada gestión lleva el nombre de
  su propia categoría como tag adicional, así que buscar "Mi Cuenta" (con
  "Todos" seleccionado, sin tocar ningún chip) trae el mismo resultado
  que tocar el chip "Mi Cuenta" — no hay lógica de código separada para
  esto, es sólo un tag más.
- **Sin persistencia**: recargar la página resetea todo (tipo de usuario,
  categoría, texto de búsqueda) al estado por defecto — no hay
  `localStorage` ni backend detrás; es esperable en un prototipo, pero es
  una diferencia real contra producción a tener en cuenta si el AFU
  necesita especificar persistencia de sesión.

### 7.3 No funcional (implicancias a validar de cara a producción)

- **Sin backend real**: todo el filtrado (búsqueda + categoría) ocurre en
  memoria sobre un JSON estático de 27 gestiones. No hay paginación,
  loading state, ni manejo de error de red — ninguno de estos aplica hoy
  porque no hay ninguna llamada asincrónica en el flujo. Si el dato real
  viene de una API, hay que definir esos 3 puntos antes de producción.
- **Búsqueda sin debounce**: cada tecla dispara un re-render y un
  re-filtrado inmediato del array completo (27 ítems hoy). Es
  imperceptible a esta escala; si el catálogo real de gestiones crece
  varios órdenes de magnitud, conviene revisar si sigue siendo necesario
  un debounce o filtrado del lado del servidor.
- **Accesibilidad no auditada**: los componentes (`SearchInput`,
  `ChipGroup`, `NavListItem`) tienen atributos ARIA básicos (`aria-label`,
  roles nativos de `button`/`input`), pero no se hizo una auditoría de
  accesibilidad (contraste, navegación por teclado end-to-end, lector de
  pantalla) — no confirmar cumplimiento sin probarlo.
- **Internacionalización**: todo el texto está hardcodeado en español
  dentro de los componentes (salvo `SECTION_LABEL`/tags, que son datos).
  No hay mecanismo de i18n — no aplica hoy, pero es relevante si el
  producto lo necesita a futuro.

## 8. Pendiente de definición (preguntas para el AFU / negocio)

Ninguna de estas preguntas fue respondida todavía — no se resolvieron por
inferencia ni se asumió una respuesta por defecto en el prototipo:

1. ¿Las asignaciones **"por intuición"** de gestiones a Mi Cuenta,
   Paquetería Nacional y Oficios Judiciales son correctas? (detalle en
   [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) sección 4).
2. ¿Qué gestiones reales van a completar **Paquetería Internacional** y
   **Mis Comunicaciones Digitales**? Quedaron fuera del alcance de este
   MVP (2026-09-03) para una próxima salida — la pregunta sigue abierta
   para esa salida futura, no para esta entrega.
3. ¿Las 5 categorías sin exclusión mencionada (Mi Cuenta, Paquetería
   Nacional, Paquetería Internacional, Mis Comunicaciones Digitales,
   Oficios Judiciales) son realmente visibles para los 4 tipos de usuario
   por igual, o hay exclusiones adicionales no mencionadas?
4. Motivos que antes eran transversales a los 3 perfiles ("Errores en mi
   factura", "Errores con el saldo de mi cuenta") ahora sólo figuran en la
   categoría Franquicias — ¿deberían aparecer también en Fulfillment y/o
   Mi Cuenta?
5. ¿"Pyme" tiene alguna diferencia de negocio real con "Individuo" más
   allá del nombre, o son equivalentes hoy (mismas categorías visibles)?
6. ¿Qué **tipos de consulta** existen en el producto real más allá de la
   gestión (seguimiento, listado, edición, historial)? ¿Cuáles entran en
   esta v1 y cuáles quedan para después?
7. ¿Qué significa concretamente **"administrar consultas"** en este
   proyecto — qué acciones incluye (editar, cancelar, reabrir, exportar)?
8. ¿Cómo se define la **pantalla de detalle** de una gestión (hoy
   inexistente): qué datos muestra, qué acciones permite?
9. ¿Cómo se va a comprobar que esta primera entrega **aporta valor**
   (criterio de aceptación)? No definido todavía.
10. Nombre definitivo de la sección: ¿"Mis gestiones" queda firme o vuelve
    a cambiar? (el propio usuario avisó que es probable que cambie).
11. ¿Cómo se determina el tipo de usuario (Individuo/Pyme/Franquicias/
    Fulfillment) de un usuario logueado en producción?

**Confirmado por el acta del 31/08/2026** (no son preguntas, son alcance
ya cerrado): los formularios particulares de cada gestión **no se
rediseñan** en esta entrega — se mantiene el formulario actual; y la
detección de motivo por IA (texto libre) es visión a futuro,
**explícitamente fuera** del MVP.

## 9. Trazabilidad de fuentes

| Afirmación | Fuente | Confianza |
|---|---|---|
| Nombre "Mis gestiones" y las 7 categorías (sección 4) | Mensaje explícito del usuario, 2026-09-02 | Alta — dato de negocio textual |
| Contenido de Franquicias y Fulfillment (sección 4) | Mensaje explícito del usuario, 2026-09-02 | Alta — listas dadas textualmente |
| Contenido de Mi Cuenta, Paquetería Nacional, Oficios Judiciales | Agrupación por intuición de Claude sobre motivos ya confirmados | Media-baja — el motivo es real, la categoría asignada no está validada |
| Contenido de Paquetería Internacional y Mis Comunicaciones Digitales | Inventado por pedido explícito del usuario | N/A — es contenido de relleno, marcado como tal |
| Paquetería Internacional y Mis Comunicaciones Digitales fuera del MVP actual | Decisión explícita del usuario, 2026-09-03 | Alta — decisión de alcance textual, no inferida |
| 4 tipos de usuario y qué categorías ve cada uno (sección 4.2) | Mensaje explícito del usuario, 2026-09-02 | Alta — regla textual, sin inferencia en las exclusiones dadas |
| 3 perfiles y matriz motivo×perfil (sección 3, histórico) | JSON provisto por el usuario, 2026-09-01 | Alta en su momento — superado el 2026-09-02 para esta pantalla |
| Flujo de alta de reclamo en producción (2 pasos) | `html reference/reclaclamos.html` | Alta — observación directa de producción |
| MVP no incluye rediseño de formularios ni IA | Acta de reunión funcional N°1, 31/08/2026 | Alta — acta formal con acuerdos firmados |
| Preguntas de la sección 8 | Brief original + preguntas abiertas acumuladas | N/A — son preguntas, no afirmaciones |
| Historias de usuario (sección 6) y análisis detallado (sección 7) | Derivadas por Claude de comportamiento ya implementado y verificado en navegador, más las secciones 1-5 de este documento | Alta para lo verificado en navegador; baja/inferencial donde se marca explícitamente (ej. HU-06, HU-07) |

## 10. Documentos relacionados

- [`brief-consultas-reclamos.md`](brief-consultas-reclamos.md) — definición
  general de alto nivel y fricciones detectadas en el flujo de alta actual.
- [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) — definición
  vigente: las 7 categorías, qué es confirmado/inferido/inventado, y el
  cambio de nombre de sección.
- [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md) —
  histórico: la regla de perfil de usuario, superada para esta pantalla.
- [`pantalla-reclamos-listado.md`](pantalla-reclamos-listado.md) — detalle
  técnico/UI de la pantalla (componentes, tokens, modo responsive, panel de
  "Casos de uso").
- [`guia-de-estilos-ui.md`](guia-de-estilos-ui.md) — sistema de diseño del
  prototipo.
