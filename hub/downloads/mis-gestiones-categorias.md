# "Mis gestiones" — categorías y visibilidad por tipo de usuario

> **Vigente al 2026-09-03.** Fuente: definición provista por el usuario el
> 2026-09-02, ampliada varias veces (la última, 2026-09-03, sube el límite
> de tags y mejora el buscador — ver sección 9). Ver el dato crudo (la
> "base de datos" de 2 niveles, con tags de búsqueda) en
> [`../proto navegable/src/core/gestiones/data/categorias-gestiones.json`](../proto%20navegable/src/core/gestiones/data/categorias-gestiones.json)
> (`schema_version: 6`) — **única copia**, pensada para que un dev la edite
> directamente, sin tocar código de lógica.
>
> **Reemplaza, para esta pantalla,** a la matriz motivo×perfil documentada
> en [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md) —
> ese documento queda como **histórico/SUPERSEDED**, no se borra porque
> sigue siendo un dato de negocio real. El mecanismo de **visibilidad por
> tipo de usuario SÍ sigue vivo** (ver sección 6) — lo que cambió es sobre
> qué eje actúa: antes decidía qué *motivos* veía un perfil, ahora decide
> qué *categorías* (chips) ve un tipo de usuario.

## 0. ¿Dónde vive el archivo que filtra las agrupaciones?

**Una sola copia** (consolidado 2026-09-02 — antes había 2, una en
`documentation/data/` y otra en la app, ver sección "Nota de
consolidación" al final):

- [`proto navegable/src/core/gestiones/data/categorias-gestiones.json`](../proto%20navegable/src/core/gestiones/data/categorias-gestiones.json)

Es también la fuente de documentación: no hay una copia separada "para
leer" y otra "para que corra la app" — es el mismo archivo. Editarlo ahí
alcanza; no hay nada que sincronizar a mano.

El código que lo consume es `proto navegable/src/core/gestiones/categories.ts`
(`visibleCategoriesForProfile()` lee `profile_category_visibility`;
`itemsForFilter()` lee `categories`). La pantalla
(`proto navegable/src/pages/ReclamosListPage.tsx`) llama a esas 2
funciones — ninguna regla de negocio está hardcodeada en el componente.

## 1. Cambio de nombre: "Reclamos" → "Mis gestiones"

El usuario confirmó que la sección deja de llamarse "Reclamos" y pasa a
**"Mis gestiones"**. Aclaró explícitamente que es probable que este nombre
vuelva a cambiar — por eso, en el código, el nombre vive en una única
constante ([`core/gestiones/sectionLabel.ts`](../proto%20navegable/src/core/gestiones/sectionLabel.ts)):

```ts
export const SECTION_LABEL = 'Mis gestiones'
export const ITEM_LABEL_SINGULAR = 'gestión'
export const ITEM_LABEL_PLURAL = 'gestiones'
```

Todo lo que antes decía "reclamo(s)" en la UI de esta pantalla (título,
placeholder del buscador, contador, mensajes de estado vacío) ahora lee de
estas constantes. Si el negocio vuelve a cambiar el nombre, se edita un
solo archivo.

**No se renombró** el chrome de navegación replicado del sitio real
(`core/navigation/navigation.config.ts`, ítem "Ingresar Reclamos" del menú
de usuario) — es una réplica fiel de un menú que existe hoy en producción,
no la pantalla que estamos rediseñando; cambiarlo rompería la fidelidad
con el sitio real. Tampoco se renombraron nombres internos de archivos/
carpetas (`ReclamosListPage.tsx`, `core/reclamos/`) — es un identificador
técnico, no texto visible; renombrarlo no aporta valor de UX y sí agrega
riesgo de romper algo por un cambio de alcance no pedido.

## 2. Las 7 categorías (chips)

| # | Categoría | Origen del contenido | Disponible hoy |
|---|---|---|---|
| 1 | Mi Cuenta | Inferido por intuición | Sí |
| 2 | Paquetería Nacional | Inferido por intuición | Sí |
| 3 | Paquetería Internacional | **Inventado** (sin datos reales aún) | **No** — oculta hasta que exista contenido real, ver sección 5.1 |
| 4 | Franquicias | **Confirmado** por el usuario | Sí |
| 5 | Fulfillment | **Confirmado** por el usuario | Sí |
| 6 | Mis Comunicaciones Digitales | **Inventado** (sin datos reales aún) | **No** — oculta hasta que exista contenido real, ver sección 5.1 |
| 7 | Oficios Judiciales | Inferido por intuición | Sí |

Sólo 2 de las 7 categorías (Franquicias, Fulfillment) tienen contenido que
el negocio confirmó textualmente. Las otras 5 son responsabilidad nuestra,
con dos niveles de certeza distintos que no hay que confundir:

- **Inferido por intuición** (Mi Cuenta, Paquetería Nacional, Oficios
  Judiciales): son gestiones REALES que ya existían en la matriz
  motivo×perfil anterior (los 19 motivos de
  [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md)),
  reagrupadas por intuición en la categoría que parece corresponder. El
  contenido en sí es real; la asignación a esta categoría puntual **no
  está confirmada**.
- **Inventado** (Paquetería Internacional, Mis Comunicaciones Digitales):
  no existe ninguna gestión real todavía para estas 2 categorías. Se
  generaron 4 gestiones de relleno por categoría, cada una con el label
  literal terminado en **"(Gestión inventada)"**, para que la pantalla no
  se vea vacía y se pueda evaluar el layout — no representan ningún dato
  real del negocio, ni siquiera una hipótesis.

## 3. Contenido confirmado por el usuario (2026-09-02)

**Fulfillment** (6 gestiones):
- Demora en el armado de los envíos
- Diferencia en el armado del envío
- Diferencia de stock
- Inconvenientes con la carga de envíos
- Inconveniente en la carga de los pedidos
- No veo el stock

**Franquicias** (4 gestiones):
- Problemas para generar el sello digital
- Problema con el pago de sellos digitales
- Errores en mi factura
- Errores con el saldo de mi cuenta

## 4. Contenido inferido por intuición (pendiente de confirmación)

**Mi Cuenta** (2 gestiones):
- Recibí un cobro erróneo
- Inconvenientes para dar de alta un usuario adicional

**Paquetería Nacional** (6 gestiones):
- Demora en el servicio
- Falta o error en la información de seguimiento
- Inconvenientes con la entrega
- No puedo pagar mis envíos
- Paquete dañado
- Paquete con faltante de contenido

**Oficios Judiciales** (1 gestión):
- Inconvenientes con el pago de oficios judiciales

Estas asignaciones parten de los 19 motivos ya conocidos, descartando los
10 que el usuario ya confirmó explícitamente para Franquicias/Fulfillment.
El criterio fue puramente semántico (a qué categoría "suena" más cercano
cada motivo) — **no es un criterio de negocio validado**. Oficios
Judiciales quedó con una sola gestión porque es la única del set original
que encaja sin ambigüedad; probablemente el negocio tenga más para
agregar ahí.

## 5. Contenido inventado (sin dato real)

**Paquetería Internacional** (4 gestiones inventadas):
- Demora en la entrega internacional (Gestión inventada)
- Problemas con la aduana (Gestión inventada)
- Paquete extraviado en tránsito internacional (Gestión inventada)
- Costos de importación no informados (Gestión inventada)

**Mis Comunicaciones Digitales** (4 gestiones inventadas):
- No recibí la notificación de mi envío (Gestión inventada)
- Error en el contenido de una comunicación digital (Gestión inventada)
- No puedo acceder a mis comunicaciones (Gestión inventada)
- Comunicación enviada a un destinatario incorrecto (Gestión inventada)

### 5.1 Ocultas por defecto hasta que exista contenido real (2026-09-03)

> ⚠️ **Estado actual: Paquetería Internacional y Mis Comunicaciones
> Digitales NO están disponibles en la pantalla.** No es un bug ni una
> regresión — es una decisión explícita del usuario, porque su contenido
> es 100% inventado y no quería mostrarlo por defecto.

Antes de este cambio, estas 2 categorías se veían igual que las demás
(chip + gestiones dentro de "Todos") para cualquier tipo de usuario, pese a
ser contenido de relleno. Ahora:

- **No aparecen como chip** para ningún tipo de usuario.
- **No suman a "Todos"** — un individuo con "Todos" pasó de 17 a 9
  gestiones (17 menos las 8 de estas 2 categorías).
- Esto es independiente de `profile_category_visibility` (sección 6): no
  es una regla de negocio de perfil, es "esto todavía no existe".

**Cómo volver a verlas (sólo para demos puntuales):** el panel "Casos de
uso" tiene una sección nueva, **"Categorías en construcción"**, con 2
switches — "Ver Paquetería Internacional" y "Ver Comunicaciones
Digitales". Activar uno agrega esa categoría al chip y a "Todos" al
instante, para el tipo de usuario que esté simulado en ese momento.
Apagarlo la vuelve a ocultar. Por defecto ambos arrancan apagados.

Implementado en
[`core/gestiones/categories.ts`](../proto%20navegable/src/core/gestiones/categories.ts)
(`HIDDEN_BY_DEFAULT_CATEGORY_IDS`, `applyUnavailableCategoryToggles`) +
[`core/session/categoryToggles.ts`](../proto%20navegable/src/core/session/categoryToggles.ts)
(estado de los 2 switches, mismo patrón que `forcedViewport.ts`). También
deep-linkeable: `?paqueteriaInternacional=1` / `?comunicacionesDigitales=1`
(ver `core/session/deepLink.ts`) — pensado para poder armar un slide de
presentación que las muestre sin tener que tocar el switch a mano.

Verificado en navegador: con ambos switches apagados, perfil Individuo con
"Todos" da 9 gestiones (antes 17); al activar "Ver Paquetería
Internacional" el chip reaparece y el contador sube a 13 (9 + 4).

## 6. Nivel 1 — qué categorías ve cada tipo de usuario (vigente)

> **Confirmado por el usuario, 2026-09-02.** Este es el mecanismo que
> había quedado sacado del panel "Casos de uso" en un paso anterior de la
> misma sesión — el usuario aclaró que el tipo de usuario **sí sigue
> impactando** qué se ve, sólo que ahora el eje que filtra son las
> categorías, no los motivos individuales.

**4 tipos de usuario** (antes 3 — se agregó **Pyme**):

| Tipo de usuario | Categorías que NO ve |
|---|---|
| Individuo | Franquicias, Fulfillment |
| Pyme | Franquicias, Fulfillment |
| Franquicias | Fulfillment |
| Fulfillment | Franquicias |

Dicho en positivo — categorías visibles por tipo de usuario (además de
"Todos", que es universal y no depende de ningún tipo):

> Esta tabla describe el dato de `profile_category_visibility` tal cual
> está, sin aplicar todavía el ocultamiento de la sección 5.1. En la
> práctica, Paquetería Internacional y Mis Comunicaciones Digitales no se
> muestran para NINGÚN tipo de usuario mientras sus switches estén
> apagados — la tabla de abajo es "a quién le correspondería verlas si
> existieran", no "qué se ve hoy en pantalla".

| Tipo de usuario | Categorías visibles |
|---|---|
| Individuo | Mi Cuenta, Paquetería Nacional, Paquetería Internacional, Mis Comunicaciones Digitales, Oficios Judiciales |
| Pyme | Mi Cuenta, Paquetería Nacional, Paquetería Internacional, Mis Comunicaciones Digitales, Oficios Judiciales |
| Franquicias | Mi Cuenta, Paquetería Nacional, Paquetería Internacional, **Franquicias**, Mis Comunicaciones Digitales, Oficios Judiciales |
| Fulfillment | Mi Cuenta, Paquetería Nacional, Paquetería Internacional, **Fulfillment**, Mis Comunicaciones Digitales, Oficios Judiciales |

Regla textual dada por el usuario, sin inferencia: *"un usuario franquicia
no podría ver el grupo ni el chip de 'Fulfillment', un usuario fulfillment
no vería grupo (chip) 'Franquicia', un usuario individuo o pyme no va a
ver grupo (chip) de 'Franquicia' y 'Fulfillment'"*. Las 5 categorías
restantes (Mi Cuenta, Paquetería Nacional, Paquetería Internacional, Mis
Comunicaciones Digitales, Oficios Judiciales) no tienen ninguna exclusión
mencionada — se asume que las ven los 4 tipos por igual (**supuesto, no
confirmado explícitamente por exclusión textual, pero es la lectura
directa de "sólo Franquicias/Fulfillment se restringen"**).

**"Todos" siempre está disponible** para los 4 tipos de usuario — pero
⚠️ **NO significa "todas las gestiones del sistema"**. Significa la unión
de las categorías que ESE tipo de usuario puede ver, **y que además no
estén ocultas por la sección 5.1**. Con Paquetería Internacional y Mis
Comunicaciones Digitales apagadas (su estado por defecto): Individuo o
Pyme con "Todos" ve 9 gestiones; Franquicias ve 13; Fulfillment ve 15. Con
ambos switches prendidos, esos números vuelven a ser 17/21/23 — los
números "históricos" de antes de la sección 5.1, que siguen siendo
correctos como conteo de las 5 categorías activas hoy más las 2 ocultas.
(Aparte: hubo un bug real corregido el 2026-09-02, `itemsForFilter`
operaba sobre el universo completo de categorías en vez de sobre las
visibles para el perfil activo — no relacionado con el ocultamiento de
5.1, que es una decisión de producto, no un bug.)

Fuente de datos: `user_types` + `profile_category_visibility` en
[`proto navegable/src/core/gestiones/data/categorias-gestiones.json`](../proto%20navegable/src/core/gestiones/data/categorias-gestiones.json).
Implementado en `core/gestiones/categories.ts` →
`visibleCategoriesForProfile()`, consumido por `ReclamosListPage.tsx` y
simulable desde el panel "Casos de uso" (sección "Usuarios", restaurada).
Mismo comportamiento de antes: si la categoría elegida deja de estar
visible al cambiar de tipo de usuario, el filtro vuelve solo a "Todos".

## 7. Nivel 2 — qué gestiones agrupa cada categoría

Ver secciones 2 a 5 de este documento: la matriz categoría→gestiones, con
su origen (confirmado / inferido / inventado). Es el segundo nivel de la
misma base de datos (`categories` en el JSON) — independiente del Nivel 1:
cambiar quién ve una categoría no cambia qué gestiones tiene esa
categoría, y viceversa.

## 8. Qué pasó con el mecanismo anterior (motivo×perfil)

La matriz motivo×perfil (`motivos-reclamo-por-perfil.md`, "Regla A") sigue
**superada**: no se usa para decidir qué gestiones individuales ve un
usuario. Lo que se recuperó en la sección 6 es un mecanismo nuevo y
propio de las categorías, no una reactivación de esa regla vieja.
`core/reclamos/reasonProfiles.ts` y `core/reclamos/profileVisibility.ts`
(+ sus JSON) siguen sin uso, documentados como histórico.

## 9. Tags de búsqueda por gestión (2026-09-02, ampliado 2026-09-03)

> **Generados por Claude, no son un dato de negocio confirmado.** El
> criterio: hasta **50** tags por gestión (subido de 10 el 2026-09-03, a
> pedido del usuario), palabras o sinónimos que alguien podría escribir en
> el buscador sin acertar el texto exacto del label.

Cada gestión tiene un array `tags` en
[`proto navegable/src/core/gestiones/data/categorias-gestiones.json`](../proto%20navegable/src/core/gestiones/data/categorias-gestiones.json). El
buscador de la pantalla matchea contra `label` **y** `tags` (no distingue
mayúsculas ni acentos, igual que antes). Ejemplo pedido por el usuario:

| Gestión | Tags |
|---|---|
| Inconvenientes con el pago de oficios judiciales | justicia, citación, oficial, cobro, error, falla, judicial, pago |

Buscar "justicia" encuentra esa gestión aunque la palabra no aparezca en
el label — verificado en navegador.

### 9.1 Tag de categoría — generalizado a las 7 (2026-09-02, 2da ampliación)

Empezó como caso especial de Fulfillment/Franquicias y **se generalizó a
las 7 categorías** el mismo día, a pedido del usuario: cada gestión lleva
el nombre de su propia categoría como tag además de sus tags semánticos
propios.

| Categoría | Tag agregado |
|---|---|
| Mi Cuenta | `mi cuenta` |
| Paquetería Nacional | `paqueteria nacional` |
| Paquetería Internacional | `paqueteria internacional` |
| Franquicias | `franquicia` / `franquicias` |
| Fulfillment | `fulfillment` |
| Mis Comunicaciones Digitales | `comunicaciones digitales` |
| Oficios Judiciales | `oficios judiciales` |

Efecto: escribir el nombre de una categoría en el buscador (con el chip
"Todos" seleccionado, sin tocar ningún chip) muestra todas sus gestiones.
Verificado en navegador: "Mi Cuenta" → 2 gestiones exactas; "Paquetería
Nacional" (con tilde y mayúsculas) → las 6 gestiones exactas.

**No es una regla de código aparte** — es literalmente un tag más,
matcheado por el mismo mecanismo de búsqueda que cualquier otro.

### 9.2 Ampliación por patrón en el label (2026-09-02)

El usuario pidió reglas explícitas de sinónimo, dadas como ejemplo:
"si el nombre de la gestión dice 'error', agregar un tag 'falla'"; "si
dice 'demora', agregar un tag 'problema'". Se aplicaron de forma
consistente a las 27 gestiones (no sólo a las que el usuario mencionó
como ejemplo):

- **Label contiene "error"/"erróneo"/"incorrecto"** → se agregó el tag
  `falla` (si no lo tenía ya).
- **Label contiene "demora"** → se agregó el tag `problema` (si no lo
  tenía ya).
- **Extensión del mismo criterio**: label contiene "problema(s)" o
  "inconveniente(s)" y todavía no tenía el tag `problema` → se agregó
  también, por coherencia con la regla anterior.

Ningún ítem superó el máximo vigente en ese momento (10 tags; quedaron
entre 5 y 9). Ejemplo verificado en navegador: con perfil Individuo
activo, buscar "falla" da 5 gestiones y buscar "problema" da 6 — ambos
números coinciden exactamente con la cuenta manual de qué ítems, dentro
de las categorías visibles para ese perfil, llevan cada tag.

### 9.3 Límite subido a 50 y sinónimos coloquiales (2026-09-03)

El usuario pidió dos cosas en la misma sesión:

1. **Subir el límite de 10 a 50 tags por gestión** — 10 quedaba corto para
   cubrir variantes de lenguaje natural.
2. **Agregar muchos más sinónimos coloquiales**, con ejemplos explícitos:
   toda gestión relacionada con "paquete" suma tags como `caja`, `envio`,
   `bulto`; "faltante" suma `robo`, `vacio`, `incompleto`. Se aplicó el
   mismo criterio (frases que un usuario real escribiría, no sólo palabras
   sueltas) a las 27 gestiones: cada una subió de 5-10 tags a un rango de
   13-25, incluyendo frases cortas ("no me deja pagar", "no llego nunca",
   "no puedo agregar") además de palabras sueltas. `categorias-gestiones.json`
   subió a `schema_version: 6`. Ningún ítem se acerca al nuevo máximo de 50
   — hay margen amplio para seguir ampliando sin tocar código ni límites.

### 9.4 Mejora del algoritmo de búsqueda (2026-09-03)

Dos problemas reportados por el usuario probando el buscador con más de
una palabra:

- **Antes de este cambio** (fix intermedio del mismo día): la búsqueda
  exigía que **todas** las palabras escritas aparecieran, cada una en
  cualquier combinación de `label`/`tags` — resolvía "error justicia"
  (dos tags de la misma gestión) pero **rompía frases naturales**: escribir
  "no me acepta pago" daba **0 resultados**, porque "no", "me" y "acepta"
  no son tags de ninguna gestión y el AND fallaba por esas palabras, aunque
  "pago" sí matcheaba.
- **Fix definitivo**: en
  [`ReclamosListPage.tsx`](../proto%20navegable/src/pages/ReclamosListPage.tsx),
  la búsqueda ahora:
  1. Descarta palabras de relleno de 1-2 letras ("no", "me", "la", "un") a
     la hora de exigir el match — si la frase entera fuera sólo relleno,
     usa todas las palabras igual (fallback).
  2. Alcanza con que **una sola** palabra significativa matchee `label` o
     algún `tag` — ya no hace falta que matcheen todas.
  3. Ordena los resultados por **cantidad de palabras que matchearon**,
     de mayor a menor — una gestión que matchea 2 palabras de la frase
     aparece antes que una que sólo matchea 1.

Verificado en navegador (perfil Individuo): "no me acepta pago" → 4
resultados, con "No puedo pagar mis envíos" primero (tiene el tag
`acepta`, agregado en 9.3). "error justicia" → 6 resultados, con
"Inconvenientes con el pago de oficios judiciales" primero (matchea
ambas palabras); el resto matchea sólo "error", ordenado después.

## 10. Preguntas abiertas

1. ¿Las asignaciones "por intuición" de la sección 4 son correctas? Hay
   que validarlas con el negocio antes de tratarlas como definitivas.
2. ¿Qué gestiones reales van a completar Paquetería Internacional y Mis
   Comunicaciones Digitales una vez que existan?
3. ¿Las 5 categorías sin exclusión mencionada (Mi Cuenta, Paquetería
   Nacional, Paquetería Internacional, Mis Comunicaciones Digitales,
   Oficios Judiciales) son realmente visibles para los 4 tipos de usuario
   por igual, o hay exclusiones adicionales que no se mencionaron?
4. Motivos que hoy son transversales en la matriz anterior ("Errores en mi
   factura", "Errores con el saldo de mi cuenta" aparecían en Individuo,
   Franquicias y Fulfillment) ahora sólo están en la categoría Franquicias
   — ¿deberían aparecer también en Fulfillment y/o Mi Cuenta?
5. ¿"Pyme" tiene alguna diferencia de negocio real con "Individuo" más
   allá del nombre, o por ahora son equivalentes en todo (mismas
   categorías visibles, sin motivos propios documentados)?
6. ¿Los tags generados por Claude (sección 9, ahora 13-25 por gestión) son
   razonables, o el negocio quiere revisarlos/reemplazarlos? Ninguno fue
   validado.
7. ¿El tag especial de categoría (Fulfillment/Franquicias) debería
   extenderse a las otras 5 categorías, o queda exclusivo de estas 2 por
   ahora?
8. La búsqueda ahora es más permisiva (con que una palabra de la frase
   matchee alcanza, sección 9.4) — ¿el negocio prefiere este comportamiento
   más amplio, o volver a exigir que matcheen todas las palabras a costa de
   frases naturales más largas?

## 11. Nota de consolidación (2026-09-02)

El usuario preguntó si tener el mismo JSON duplicado en `documentation/`
y en la app era correcto — no lo era: eran 2 copias manuales sin ningún
mecanismo que las mantuviera sincronizadas (mismo riesgo que dos fuentes
de verdad). Se verificó que ambas copias eran idénticas byte a byte (sin
drift todavía) y se eliminó `documentation/data/categorias-gestiones.json`,
dejando **una sola copia real**: la de
`proto navegable/src/core/gestiones/data/`. Esta sección y el resto del
documento ahora enlazan directamente a esa ruta.

Se aplicó el mismo criterio a los 2 datasets históricos/superseded
(`motivos-reclamo-por-perfil.json`, `visibilidad-perfiles.json`): también
tenían copia en `documentation/data/`, también idénticas, también
eliminadas — ver [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md).

**Lo que NO se tocó**: las copias en `hub/downloads/*.json`. Esas
cumplen un propósito distinto (no es el problema de "doc vs. código" que
preguntó el usuario) — el Hub deployado en Vercel usa Root Directory=`hub`,
así que ese deploy no incluye ni `documentation/` ni `proto navegable/`;
sin una copia propia, el botón de descarga del Hub no tendría qué servir.
Es una duplicación justificada por el entorno de deploy, documentada como
tal — no un descuido.
