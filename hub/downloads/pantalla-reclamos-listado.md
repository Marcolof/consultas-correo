# Pantalla: Listado de "Mis gestiones" (antes "Reclamos")

> **Estado: draft.** Construida el 2026-09-01 sobre
> [`proto navegable`](../proto%20navegable), basada en una imagen de
> referencia (layout). **2026-09-02: la sección se renombró de "Reclamos" a
> "Mis gestiones" y el eje de filtro pasó de perfil de usuario a 7
> categorías de producto/servicio** — ver
> [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) para la
> definición completa y qué contenido es confirmado, inferido o inventado.
> El nombre de la sección vive en una constante
> (`core/gestiones/sectionLabel.ts`) porque el usuario avisó que es
> probable que se vuelva a renombrar.

## 1. Qué hace

Ruta índice (`/`) del prototipo: `src/pages/ReclamosListPage.tsx` (nombre
de archivo sin cambiar — ver nota sobre alcance del renombre en
[`mis-gestiones-categorias.md`](mis-gestiones-categorias.md#1-cambio-de-nombre-reclamos--mis-gestiones)).
Muestra:

1. Título **"Mis gestiones"** (`PageHeader`, sin descripción ni acciones).
2. Un buscador de una línea, con esquinas de 12px (`--radius-md-lg`) — no
   totalmente redondeado, por fidelidad con la propuesta de Figma. Ancho
   máximo de 1000px incluyendo padding (`box-sizing: border-box`).
3. Chips de filtro directamente debajo del buscador: **Todos** + las
   categorías visibles para el tipo de usuario activo (hasta 7: Mi
   Cuenta, Paquetería Nacional, Paquetería Internacional, Franquicias,
   Fulfillment, Mis Comunicaciones Digitales, Oficios Judiciales) — ver
   sección 4, el tipo de usuario (Individuo/Pyme/Franquicias/Fulfillment)
   decide cuáles se ven. A la derecha aparece un link **"Limpiar
   filtro"** sólo cuando el chip activo no es "Todos".
4. Contador ("N gestiones") que refleja el resultado real de filtro +
   búsqueda combinados.
5. Listado de gestiones (filas clickeables con flecha, sin sombra — sólo
   fondo y borde), con scroll propio.

Los datos de las categorías salen de `core/gestiones/categories.ts`, que
lee `core/gestiones/data/categorias-gestiones.json` — copia del mismo JSON
documentado en
[`mis-gestiones-categorias.md`](mis-gestiones-categorias.md). Sólo
Franquicias (4) y Fulfillment (6) tienen contenido confirmado por el
negocio; el resto es inferido por intuición o directamente inventado
(marcado en el propio label con "(Gestión inventada)") — no es una
maqueta estática, pero tampoco hay que confundir el contenido de relleno
con datos reales.

## 2. Componentes reutilizados (sin cambios)

`PageContainer`, `PageHeader`, `EmptyState`, `Modal`, `useToast` (cola de
notificaciones) — todos ya existían en la base de UI, sin tocar su código.

## 3. Componentes nuevos agregados a `shared/ui`

La imagen de referencia no coincidía con ningún primitivo existente en 3
casos. Se agregaron siguiendo el mismo patrón (`.tsx` + `.module.css` +
`index.ts`, tokens nuevos donde hacía falta):

| Componente | Por qué es nuevo | Tokens nuevos que consume |
|---|---|---|
| `ChipGroup` | Filtro en píldoras con activo en **azul de marca sólido** — visualmente distinto de `Tabs` (activo amarillo, para navegar entre paneles, no para filtrar) | `--chip-*` |
| `NavListItem` | Fila clickeable (label + flecha) para listados de navegación simple — no hay overlap real con `DataTable` (es tabular) ni con `Button` | `--nav-list-item-*` |
| `SearchInput` | Buscador de una línea sin label flotante — `Input`/`Field` siempre muestran un label (aunque sea flotante), y esto rompía el patrón visual del buscador de la referencia | `--search-input-*` |

Los 3 tokens nuevos están documentados en
[`guia-de-estilos-ui.md`](guia-de-estilos-ui.md) (sección de tokens) y en
`tokens.css` con comentarios explicando quién los usa.

**Nota de arquitectura sobre `SearchInput`**: no reutiliza `Field` (el
envoltorio de label flotante que comparten `Input`/`Select`/`NumberInput`)
porque su mecanismo de label flotante depende de que el `<input>` sea
hermano directo del `<label>` en el DOM (selector CSS `.control + .label`);
envolver el input en un contenedor para el ícono de lupa rompía esa regla.
Se decidió que un buscador no necesita label flotante de todos modos (el
placeholder alcanza), así que se armó como primitivo aparte en vez de forzar
el patrón de `Field` donde no encaja.

## 4. "Casos de uso" — sección "Usuarios" (vigente, ahora sobre categorías)

El botón flotante junto al `ChatBubble` (`app/HubAccessButton.tsx`)
despliega un menú con 2 opciones: **Volver al Hub** y **Casos de uso**
(abre un `Modal` con 2 secciones: "Usuarios" y "Pantalla").

> Esta sección se sacó del panel más temprano en la misma sesión del
> 2026-09-02 (cuando se pensó que las 7 categorías eran fijas para todos)
> y se restauró el mismo día cuando el usuario aclaró que el tipo de
> usuario **sigue impactando** qué se ve — ahora sobre las categorías, con
> un tipo nuevo agregado ("Pyme"). Ver
> [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md#6-nivel-1--qué-categorías-ve-cada-tipo-de-usuario-vigente)
> para la regla completa.

"Usuarios" es un `ChipGroup` de selección única entre **Individuo**
(default), **Pyme**, **Franquicias** y **Fulfillment**
(`core/session/activeUseCase.ts` + `core/gestiones/categories.ts` →
`visibleCategoriesForProfile()`). El tipo activo decide **qué categorías
(chips) existen** en el listado — no cuál viene preseleccionada: el chip
por defecto sigue siendo siempre "Todos", y si la categoría elegida deja
de estar disponible al cambiar de tipo de usuario, el filtro vuelve solo
a "Todos" (mismo patrón exacto que la regla anterior con perfiles, ahora
sobre un eje distinto).

Regla de visibilidad (resumen; detalle completo en
[`mis-gestiones-categorias.md`](mis-gestiones-categorias.md)):

- Individuo y Pyme no ven Franquicias ni Fulfillment.
- Franquicias no ve Fulfillment.
- Fulfillment no ve Franquicias.
- El resto de las categorías (Mi Cuenta, Paquetería Nacional, Paquetería
  Internacional, Mis Comunicaciones Digitales, Oficios Judiciales) se ven
  siempre, para los 4 tipos de usuario.

### Escalabilidad

Agregar un tipo de usuario nuevo o cambiar qué categorías ve cada uno es
editar `documentation/data/categorias-gestiones.json` (`user_types` +
`profile_category_visibility`) — dato, no lógica hardcodeada — sin tocar
código.

## 5. Sección "Pantalla" — modo responsive forzado (2026-09-01)

El panel "Casos de uso" (ahora de tamaño `md`, antes `sm`, para que entren
las dos secciones cómodas) suma una segunda sección: **"Pantalla"**, con un
switch **"Responsive"**.

Al activarlo, el prototipo pasa al layout mobile **sin depender del ancho
real de la ventana**:

- El riel del `Sidebar` desaparece — sólo queda la hamburguesa.
- La barra superior queda vacía salvo la hamburguesa: logo, "Nuevo envío" y
  el bloque de usuario se ocultan (ya están disponibles desde el cajón del
  `Sidebar`, que trae su propio logo en el header del drawer, y los ítems
  "Mi cuenta" / "Nuevo envío").
- Al abrir el cajón (hamburguesa), se ve el mismo árbol de siempre: Panel,
  Mis envíos, Servicios, Mi saldo, Integraciones, Mi cuenta, Nuevo envío —
  igual a la imagen de referencia.
- **El ancho real de la pantalla se achica** a 390px (ancho típico de
  smartphone), centrado, con una sombra marcando el borde — no es sólo un
  reacomodo de layout con la ventana del navegador intacta.

**Cómo se implementó**: se agregó una clase global `force-mobile` (no un
módulo CSS — a propósito, para poder referenciarla desde varios
`.module.css` distintos) que `AppShell.tsx` aplica a un `<div>` envolvente
cuando `isResponsive` es `true` (`core/session/forcedViewport.ts`, un
contexto nuevo, mismo patrón que `activeUseCase.ts`). `Header.module.css`,
`Sidebar.module.css` y `AppShell.module.css` tienen reglas
`:global(.force-mobile) ...` que **repiten exactamente** las mismas reglas
del breakpoint real (`max-width: 767.98px` / `min-width: 768px`), así que
"mobile real" (achicar la ventana) y "mobile forzado" (el switch) se ven
siempre igual — no hay dos definiciones divergentes del layout mobile.

**El angostamiento real (2026-09-01, ajuste sobre la primera versión)**: la
primera versión sólo reacomodaba el layout (ocultaba sidebar/header) pero
la ventana seguía teniendo su ancho real — el usuario pidió que además se
vea efectivamente angosto. Se logró con un truco de CSS: aplicar
`transform` (cualquier valor distinto de `none`, acá `translateZ(0)`) a un
elemento lo convierte en el **containing block** de sus descendientes
`position: fixed` — dejan de posicionarse contra la ventana del navegador y
pasan a posicionarse contra ESE elemento. El wrapper con `force-mobile` ya
existía (era sólo un `<div>` sin estilos propios); se le agregó
`max-width: 390px` + `margin: 0 auto` + el `transform`, y automáticamente
el Header (`left/right: 0`), el riel del Sidebar y los botones flotantes
(`ChatBubble`, `HubAccessButton`, con `bottom/right`) quedan recortados a
esos 390px en vez de a la ventana completa — sin tocar sus propios
`.module.css` de posicionamiento. El `Modal` de "Casos de uso" queda afuera
de este efecto a propósito: se renderiza en un portal directo a `<body>`
(`shared/ui/Modal`), así que el panel de control sigue viéndose a tamaño
normal mientras el contenido que controla se ve angosto — mismo patrón que
el "device toolbar" de las devtools de un navegador.

**Cambio de alcance en el breakpoint real, no sólo en el forzado**: antes,
angostar la ventana real sólo ocultaba el texto "Hola, {nombre} / Mi
cuenta" del header (el logo, "Nuevo envío" y el avatar seguían visibles).
Se corrigió el breakpoint real (`Header.module.css`) para que oculte todo
el bloque `.main` (logo + acciones + usuario), no sólo el texto — porque
así lo describió el usuario para "modo responsive", y no tendría sentido
que el switch mostrara un mobile distinto del que se ve angostando la
ventana de verdad.

## 6. Preguntas / límites que quedan (no resueltos acá)

- Las filas del listado no navegan a ningún lado todavía — al tocarlas
  muestran un `Toast` de aviso ("pantalla de detalle todavía no
  implementada"). No hay pantalla de detalle de gestión definida aún.
- El buscador filtra sólo por `label` de la gestión, sin acentos
  (comparación normalizada a mano, sin diacríticos) — no busca por
  categoría ni por sinónimos.
- 5 de las 7 categorías tienen contenido inferido por intuición o
  directamente inventado — ver
  [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) sección 7
  para las preguntas abiertas sobre esto.
- El modo responsive forzado cubre sidebar, header, drawer y el padding de
  `PageContainer` (`:global(.force-mobile) .content` fuerza `--space-4`,
  16px, agregado 2026-09-02 — antes quedaba en 48px porque el
  `@media (min-width: 768px)` seguía activo al no cambiar el ancho real de
  la ventana). No se auditó exhaustivamente si algún otro componente con
  `@media` propio necesitaría el mismo tipo de override.
- En pantallas anchas, `PageContainer` (variante `narrow`) ya no centra su
  contenido con `margin: 0 auto` — queda pegado a la izquierda (con su
  padding) en vez de flotar en el medio dejando espacio muerto simétrico a
  los costados (corregido 2026-09-02, a pedido del usuario).
- El padding horizontal de `PageContainer` en desktop se ajustó a 3rem
  (`--space-12`) para fidelidad con la web real de MiCorreo (clase `.px-5`
  de Bootstrap, verificado en captura de producción, 2026-09-02).
