# Pantalla: Listado de Reclamos

> **Estado: draft, primera pantalla real del prototipo.** Reemplaza al
> `StarterPage` de ejemplo. Construida el 2026-09-01 sobre
> [`proto navegable`](../proto%20navegable), basada en una imagen de
> referencia (layout) y en la definición funcional de
> [motivos por perfil](motivos-reclamo-por-perfil.md) (datos reales).

## 1. Qué hace

Ruta índice (`/`) del prototipo: `src/pages/ReclamosListPage.tsx`. Muestra:

1. Título "Reclamos" (`PageHeader`, sin descripción ni acciones).
2. Un buscador de una línea, con esquinas de 12px (`--radius-md-lg`) — no
   totalmente redondeado, por fidelidad con la propuesta de Figma.
3. Chips de filtro directamente debajo del buscador (sin título de
   sección — el rótulo "Tipos de Reclamos" que estaba arriba se sacó a
   pedido del usuario, 2026-09-02): **Todos**, Individuo, Franquicias,
   Fulfillment — el subconjunto realmente visible depende del "caso de uso"
   activo (ver sección 4).
4. Contador ("N reclamos", antes decía "N consultas") que refleja el
   resultado real de filtro + búsqueda combinados.
5. Listado de motivos (filas clickeables con flecha, sin sombra — sólo
   fondo y borde, a pedido del usuario), con scroll propio.

Los datos **no son mock arbitrario**: motivos, perfiles y qué perfil ve qué
motivo salen de `core/reclamos/reasonProfiles.ts`, que a su vez lee
`core/reclamos/data/motivos-reclamo-por-perfil.json` — una copia del mismo
JSON documentado en [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md).
Cambiar de chip realmente cambia qué se ve (12 para Individuo, 4 para
Franquicias, 17 para Fulfillment, 19 para Todos) — no es una maqueta
estática.

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

## 4. Mecanismo nuevo: "Casos de uso" (perfil activo simulado)

El botón flotante junto al `ChatBubble` (`app/HubAccessButton.tsx`) ahora
despliega un menú con 2 opciones:

1. **Volver al Hub** — comportamiento anterior, sin cambios.
2. **Casos de uso** — abre un `Modal` con una sección "Usuarios": un
   `ChipGroup` de selección única entre Individuo (default), Franquicias y
   Fulfillment.

Este selector escribe un **contexto global** (`core/session/activeUseCase.ts`,
provisto en `app/providers.tsx`) que representa qué perfil de usuario se
está simulando — es tooling de prototipo, no autenticación real.

**Vínculo con el listado (corregido el 2026-09-01):** el "caso de uso"
activo **no decide qué chip viene elegido** — el chip por defecto es
siempre **"Todos"**, en las tres identidades. Lo que decide es **qué chips
existen** para navegar: ver
[`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md#6-visibilidad-de-perfiles-entre-sí-regla-nueva-2026-09-01)
para la regla completa (`core/reclamos/profileVisibility.ts`). En resumen:

- Individuo ve los chips: Todos, Individuo.
- Franquicias ve: Todos, Individuo, Franquicias.
- Fulfillment ve: Todos, Individuo, Fulfillment.

Si el chip elegido deja de estar disponible al cambiar de caso de uso (por
ejemplo, tenías "Fulfillment" elegido y pasás a "Individuo"), el filtro
vuelve a "Todos" automáticamente — es la única situación en la que el caso
de uso toca la selección; nunca la fuerza a priori.

> Versión anterior de este documento (2026-09-01, misma fecha, corregida
> más tarde) decía que el filtro arrancaba en el perfil activo. Era una
> decisión de UX no pedida explícitamente; el usuario la revirtió y aclaró
> que el mecanismo real es de **visibilidad de opciones**, no de
> preselección. Se deja esta nota por trazabilidad.

### Escalabilidad

- Agregar un perfil nuevo a los **motivos** que ve: un solo lugar,
  `core/reclamos/reasonProfiles.ts` → `RECLAMO_PROFILES` (y el JSON de
  datos, si el perfil trae motivos propios).
- Agregar/cambiar qué **chips ve** cada perfil: un solo lugar,
  `documentation/data/visibilidad-perfiles.json` (+ su copia en
  `core/reclamos/data/`) — es dato, no lógica hardcodeada, así que una regla
  irregular a futuro (por ejemplo, un perfil que no vea "Individuo") es un
  cambio de datos, no de código.
- Agregar más "condiciones" al panel "Casos de uso" (mencionado por el
  usuario como algo a futuro): el `Modal` de `HubAccessButton.tsx` está
  armado para sumar secciones hermanas de "Usuarios" y "Pantalla" — hay un
  comentario en el código marcando dónde van.

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
  implementada"). No hay pantalla de detalle de reclamo definida aún.
- El buscador filtra sólo por `label` del motivo, sin acentos
  (comparación normalizada a mano, sin diacríticos) — no busca por
  categoría ni por sinónimos.
- Sigue sin resolverse cómo se determina el perfil de un usuario real (ver
  sección 6 de [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md))
  — "Casos de uso" es una simulación manual para el prototipo, no una
  propuesta de cómo funcionaría en producción.
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
