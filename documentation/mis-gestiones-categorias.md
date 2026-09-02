# "Mis gestiones" — categorías y visibilidad por tipo de usuario

> **Vigente al 2026-09-02.** Fuente: definición provista por el usuario el
> 2026-09-02, ampliada el mismo día (dos veces). Ver el dato crudo (la
> "base de datos" de 2 niveles, ahora con tags de búsqueda) en
> [`data/categorias-gestiones.json`](data/categorias-gestiones.json)
> (`schema_version: 3`) — pensado para que un dev lo edite directamente,
> sin tocar código.
>
> **Reemplaza, para esta pantalla,** a la matriz motivo×perfil documentada
> en [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md) —
> ese documento queda como **histórico/SUPERSEDED**, no se borra porque
> sigue siendo un dato de negocio real. El mecanismo de **visibilidad por
> tipo de usuario SÍ sigue vivo** (ver sección 6) — lo que cambió es sobre
> qué eje actúa: antes decidía qué *motivos* veía un perfil, ahora decide
> qué *categorías* (chips) ve un tipo de usuario.

## 0. ¿Dónde vive el archivo que filtra las agrupaciones?

Hay **2 copias del mismo archivo** (duplicación deliberada, mismo patrón
que el resto del proyecto — no hay build step que las mantenga
sincronizadas solas, hay que editar ambas si cambia una):

- **Fuente/documentación**: [`documentation/data/categorias-gestiones.json`](data/categorias-gestiones.json)
- **La que realmente lee la app**: `proto navegable/src/core/gestiones/data/categorias-gestiones.json`

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

| # | Categoría | Origen del contenido |
|---|---|---|
| 1 | Mi Cuenta | Inferido por intuición |
| 2 | Paquetería Nacional | Inferido por intuición |
| 3 | Paquetería Internacional | **Inventado** (sin datos reales aún) |
| 4 | Franquicias | **Confirmado** por el usuario |
| 5 | Fulfillment | **Confirmado** por el usuario |
| 6 | Mis Comunicaciones Digitales | **Inventado** (sin datos reales aún) |
| 7 | Oficios Judiciales | Inferido por intuición |

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
⚠️ **NO significa "todas las 27 gestiones del sistema"**. Significa la
unión de las categorías que ESE tipo de usuario puede ver. Un Individuo o
Pyme con "Todos" seleccionado ve 17 gestiones (nunca las de Franquicias
ni Fulfillment); Franquicias ve 21; Fulfillment ve 23. Este era un bug
real corregido el 2026-09-02 (`itemsForFilter` operaba sobre el universo
completo de categorías en vez de sobre las visibles para el perfil
activo) — el usuario lo detectó probando el prototipo.

Fuente de datos: `user_types` + `profile_category_visibility` en
[`data/categorias-gestiones.json`](data/categorias-gestiones.json).
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

## 9. Tags de búsqueda por gestión (2026-09-02)

> **Generados por Claude, no son un dato de negocio confirmado.** El
> criterio: hasta 10 tags por gestión, palabras o sinónimos que alguien
> podría escribir en el buscador sin acertar el texto exacto del label.

Cada gestión tiene un array `tags` en
[`data/categorias-gestiones.json`](data/categorias-gestiones.json). El
buscador de la pantalla matchea contra `label` **y** `tags` (no distingue
mayúsculas ni acentos, igual que antes). Ejemplo pedido por el usuario:

| Gestión | Tags |
|---|---|
| Inconvenientes con el pago de oficios judiciales | justicia, citación, oficial, cobro, error, falla, judicial, pago |

Buscar "justicia" encuentra esa gestión aunque la palabra no aparezca en
el label — verificado en navegador.

### 9.1 Caso especial: tag de categoría en Fulfillment y Franquicias

Además de sus tags semánticos propios, **todas las gestiones de
Fulfillment** llevan el tag literal `"fulfillment"`, y **todas las de
Franquicias** llevan `"franquicia"`/`"franquicias"`. Efecto: un usuario
puede escribir "fulfillment" en el buscador (con el chip "Todos"
seleccionado, sin tocar el chip "Fulfillment") y ve las 6 gestiones de esa
categoría — verificado en navegador.

**No es una regla de código aparte** — es literalmente un tag más,
matcheado por el mismo mecanismo de búsqueda que cualquier otro. Por
pedido explícito del usuario, este comportamiento hoy sólo se dio a
Fulfillment y Franquicias; las demás categorías no tienen ese tag de
categoría (aunque nada impide agregarlo a futuro, es sólo editar el JSON).

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
6. ¿Los tags generados por Claude (sección 9) son razonables, o el negocio
   quiere revisarlos/reemplazarlos? Ninguno fue validado.
7. ¿El tag especial de categoría (Fulfillment/Franquicias) debería
   extenderse a las otras 5 categorías, o queda exclusivo de estas 2 por
   ahora?
