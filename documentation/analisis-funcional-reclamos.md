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
(pantalla `ReclamosListPage`, ruta `/` del prototipo — el nombre de
archivo no se tocó, ver [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md#1-cambio-de-nombre-reclamos--mis-gestiones)).
No están construidas: alta de una gestión nueva, pantalla de detalle de
una gestión, ni ningún otro tipo de consulta.

Fuera de alcance / no definido todavía (ver sección 6): qué otros tipos de
consulta existen en el producto real más allá de la gestión, y qué
significa "administrar consultas".

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

| # | Categoría | Gestiones | Origen del contenido |
|---|---|:---:|---|
| 1 | Mi Cuenta | 2 | Inferido por intuición |
| 2 | Paquetería Nacional | 6 | Inferido por intuición |
| 3 | Paquetería Internacional | 4 | **Inventado** |
| 4 | Franquicias | 4 | **Confirmado** por el usuario |
| 5 | Fulfillment | 6 | **Confirmado** por el usuario |
| 6 | Mis Comunicaciones Digitales | 4 | **Inventado** |
| 7 | Oficios Judiciales | 1 | Inferido por intuición |

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

⚠️ **"Todos" NO es "las 27 gestiones del sistema"** — es la unión de las
categorías visibles para el tipo de usuario activo (corregido 2026-09-02,
era un bug: mostraba las 27 sin importar el perfil). Individuo/Pyme con
"Todos": 17 gestiones. Franquicias: 21. Fulfillment: 23. Ver sección 4.2.

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
   (mecanismo de determinación: **no definido**, ver sección 6) y ve
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

## 6. Pendiente de definición (preguntas para el AFU / negocio)

Ninguna de estas preguntas fue respondida todavía — no se resolvieron por
inferencia ni se asumió una respuesta por defecto en el prototipo:

1. ¿Las asignaciones **"por intuición"** de gestiones a Mi Cuenta,
   Paquetería Nacional y Oficios Judiciales son correctas? (detalle en
   [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) sección 4).
2. ¿Qué gestiones reales van a completar **Paquetería Internacional** y
   **Mis Comunicaciones Digitales**, hoy con contenido inventado?
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

## 7. Trazabilidad de fuentes

| Afirmación | Fuente | Confianza |
|---|---|---|
| Nombre "Mis gestiones" y las 7 categorías (sección 4) | Mensaje explícito del usuario, 2026-09-02 | Alta — dato de negocio textual |
| Contenido de Franquicias y Fulfillment (sección 4) | Mensaje explícito del usuario, 2026-09-02 | Alta — listas dadas textualmente |
| Contenido de Mi Cuenta, Paquetería Nacional, Oficios Judiciales | Agrupación por intuición de Claude sobre motivos ya confirmados | Media-baja — el motivo es real, la categoría asignada no está validada |
| Contenido de Paquetería Internacional y Mis Comunicaciones Digitales | Inventado por pedido explícito del usuario | N/A — es contenido de relleno, marcado como tal |
| 4 tipos de usuario y qué categorías ve cada uno (sección 4.2) | Mensaje explícito del usuario, 2026-09-02 | Alta — regla textual, sin inferencia en las exclusiones dadas |
| 3 perfiles y matriz motivo×perfil (sección 3, histórico) | JSON provisto por el usuario, 2026-09-01 | Alta en su momento — superado el 2026-09-02 para esta pantalla |
| Flujo de alta de reclamo en producción (2 pasos) | `html reference/reclaclamos.html` | Alta — observación directa de producción |
| MVP no incluye rediseño de formularios ni IA | Acta de reunión funcional N°1, 31/08/2026 | Alta — acta formal con acuerdos firmados |
| Preguntas de la sección 6 | Brief original + preguntas abiertas acumuladas | N/A — son preguntas, no afirmaciones |

## 8. Documentos relacionados

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
