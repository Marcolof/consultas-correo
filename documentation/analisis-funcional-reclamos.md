# Análisis funcional — Consultas y Reclamos (listado de Reclamos)

> **Para**: Analista Funcional (AFU).
> **Estado: borrador — consolida lo confirmado hasta el 2026-09-01.** No es
> un documento nuevo de fuente: reorganiza y resume, para lectura funcional,
> lo ya relevado en [`brief-consultas-reclamos.md`](brief-consultas-reclamos.md),
> [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md) y
> [`pantalla-reclamos-listado.md`](pantalla-reclamos-listado.md). Ante
> cualquier diferencia, esos tres documentos (y sus JSON de datos) son la
> fuente de verdad; este documento es una vista de lectura rápida.
>
> Se marca explícitamente qué está **confirmado** (dato de negocio provisto
> por el usuario o observado en producción), qué es **hipótesis de UX**
> (lectura nuestra, no validada) y qué queda **pendiente de definición**
> (pregunta abierta que el negocio todavía no respondió). No se inventan
> reglas, criterios de aceptación ni resultados de testing.

## 1. Objetivo del proyecto

Mejorar la experiencia de "Consultas y Reclamos" de MiCorreo (Correo
Argentino), de forma incremental: la primera entrega debe aportar valor por
sí sola sobre lo que ya existe en producción, sin necesidad de cubrir todavía
todo el alcance futuro del proyecto. *(Confirmado — brief original del
usuario.)*

## 2. Alcance funcional cubierto hasta hoy

Lo único construido y navegable hoy es el **listado de Reclamos** (pantalla
`ReclamosListPage`, ruta `/` del prototipo). No están construidas: alta de
un reclamo nuevo, pantalla de detalle de un reclamo, ni ningún otro tipo de
consulta.

Fuera de alcance / no definido todavía (ver sección 6): qué otros tipos de
consulta existen en el producto real más allá del reclamo, y qué significa
"administrar consultas".

## 3. Actores / perfiles de usuario

*(Confirmado — definición funcional provista por el usuario el 2026-09-01,
no inferencia.)*

El negocio distingue **3 perfiles de usuario**, cada uno con un subconjunto
distinto de motivos de reclamo visibles:

| Perfil (id) | Label | Motivos de reclamo visibles |
|---|---|:---:|
| `fulfillment` | Fulfillment | 17 de 19 |
| `individuo` | Individuo | 12 de 19 |
| `franquicias` | Franquicias | 4 de 19 |

`fulfillment` es el perfil con más motivos visibles (casi el universo
completo); `franquicias` es el más acotado, y el único con motivos
exclusivos propios (sellos digitales). `individuo` es subconjunto de
`fulfillment` salvo por los motivos operativos de logística.

**Contraste con producción**: la pantalla de alta de reclamo hoy en vivo
(`html reference/reclaclamos.html`) muestra los ~19-20 motivos por igual a
cualquier usuario, sin distinguir perfil. La diferenciación por perfil es
una mejora real de esta iniciativa, no algo que ya exista.

## 4. Reglas de negocio confirmadas

### 4.1 Regla A — qué motivos de reclamo ve cada perfil

Matriz completa (✓ = visible para ese perfil):

| Motivo | Fulfillment | Franquicias | Individuo |
|---|:---:|:---:|:---:|
| Demora en el armado de los envíos | ✓ | | |
| Demora en el servicio | ✓ | | ✓ |
| Diferencia en el armado del envío | ✓ | | |
| Diferencia de stock | ✓ | | |
| Recibí un cobro erróneo | ✓ | | ✓ |
| Errores en mi factura | ✓ | ✓ | ✓ |
| Falta o error en la información de seguimiento | ✓ | | ✓ |
| Errores con el saldo de mi cuenta | ✓ | ✓ | ✓ |
| Inconvenientes con la carga de envíos | ✓ | | ✓ |
| Inconvenientes con la entrega | ✓ | | ✓ |
| Inconveniente en la carga de los pedidos | ✓ | | |
| Inconvenientes con el pago de oficios judiciales | ✓ | | ✓ |
| Inconvenientes para dar de alta un usuario adicional | ✓ | | ✓ |
| No puedo pagar mis envíos | ✓ | | ✓ |
| No veo el stock | ✓ | | |
| Paquete dañado | ✓ | | ✓ |
| Paquete con faltante de contenido | ✓ | | ✓ |
| Problema con el pago de sellos digitales | | ✓ | |
| Problemas para generar el sello digital | | ✓ | |

Fuente de datos: [`data/motivos-reclamo-por-perfil.json`](data/motivos-reclamo-por-perfil.json).

### 4.2 Regla B — qué chips de filtro ve cada perfil activo

Regla **distinta** de la anterior: no define qué motivos ve un perfil, sino
qué **chips de filtro** (perfiles como opción de navegación) puede ver un
usuario según su propio perfil activo.

| Perfil activo | Chips visibles |
|---|---|
| Individuo | Todos, Individuo |
| Franquicias | Todos, Individuo, Franquicias |
| Fulfillment | Todos, Individuo, Fulfillment |

Patrón: todo perfil ve **su propio chip** + **Individuo** + **Todos**; nadie
ve el chip de un perfil ajeno que no sea Individuo.

**Importante**: el chip **"Todos" siempre viene seleccionado por defecto**
al entrar a la pantalla — el perfil activo decide qué chips *existen* para
navegar, nunca cuál viene *preseleccionado*. Si el usuario tenía un chip no
disponible seleccionado y cambia de perfil, el filtro vuelve solo a "Todos".
Esto fue una corrección explícita del usuario sobre una primera versión que
sí preseleccionaba el chip según el perfil.

Además: seleccionar "Todos" sigue mostrando la unión completa de los 19
motivos, sin importar el perfil activo — esta regla no acota qué trae
"Todos", sólo qué chips están disponibles para elegir.

Fuente de datos: [`data/visibilidad-perfiles.json`](data/visibilidad-perfiles.json).

## 5. Flujo funcional de la pantalla (listado de Reclamos)

1. El usuario ingresa a la pantalla con un perfil activo ya determinado
   (mecanismo de determinación: **no definido**, ver sección 6).
2. La pantalla muestra: buscador de texto libre, chips de filtro (según
   Regla B para ese perfil, "Todos" preseleccionado), contador de
   resultados y el listado de reclamos.
3. **Buscar**: el usuario escribe texto libre; el listado se filtra por
   coincidencia de texto en el label del motivo (sin distinguir mayúsculas
   ni acentos). No dispara ningún llamado a backend en el prototipo — es
   filtrado en memoria sobre datos estáticos.
4. **Filtrar por chip**: el usuario elige un chip; el listado se acota a
   los motivos de la Regla A que correspondan a ese chip (o a la unión
   completa si el chip es "Todos"). Buscador y chip se combinan (AND).
5. **Sin resultados**: si la combinación de búsqueda + chip no encuentra
   nada, se muestra un estado vacío con mensaje y sugerencia de cambiar la
   búsqueda o el filtro.
6. **Seleccionar un reclamo de la lista**: hoy sólo muestra un aviso
   temporal ("pantalla de detalle todavía no implementada") — **no hay
   pantalla de detalle construida todavía**.
7. **Cambio de perfil activo** (mecanismo de prototipo, no de producción):
   un panel de control permite simular los 3 perfiles para validar la
   Regla A y la Regla B en la misma sesión, sin recargar. Este panel es
   una herramienta de prototipo, no una pantalla de producción.

## 6. Pendiente de definición (preguntas para el AFU / negocio)

Ninguna de estas preguntas fue respondida todavía — no se resolvieron por
inferencia ni se asumió una respuesta por defecto en el prototipo:

1. ¿Cómo se determina el **perfil** (`fulfillment` / `franquicias` /
   `individuo`) de un usuario logueado en producción? ¿Viene del rol de
   cuenta, de un flag, de una elección manual del propio usuario?
2. ¿Un mismo usuario puede tener **más de un perfil** simultáneamente (por
   ejemplo, una cuenta con fulfillment y franquicias a la vez)? Los datos
   de negocio provistos asumen un único perfil activo por usuario.
3. ¿Qué pasa con un usuario que **no matchea ningún perfil**? ¿Ve todos los
   motivos (fallback al comportamiento actual de producción, sin
   diferenciar), o no ve ninguno?
4. ¿Los 3 perfiles son **estables** o se espera que se agreguen más pronto?
   (el usuario mencionó que "podría ampliarse", sin fecha ni alcance).
5. ¿El chip **"Todos" debería acotarse también por perfil** (mostrar sólo
   la unión de lo que ese perfil puede ver), o se mantiene siempre como el
   universo completo de motivos, como está hoy?
6. ¿Qué **tipos de consulta** existen en el producto real más allá del alta
   de reclamo (seguimiento, listado, edición, historial)? ¿Cuáles entran en
   esta v1 y cuáles quedan para después?
7. ¿Qué significa concretamente **"administrar consultas"** en este
   proyecto — qué acciones incluye (editar, cancelar, reabrir, exportar,
   asignar a otro perfil)?
8. ¿Cómo se define la **pantalla de detalle** de un reclamo (hoy
   inexistente): qué datos muestra, qué acciones permite?
9. ¿Cómo se va a comprobar que esta primera entrega **aporta valor**
   (criterio de aceptación)? No definido todavía.

## 7. Trazabilidad de fuentes

| Afirmación | Fuente | Confianza |
|---|---|---|
| 3 perfiles y matriz motivo×perfil (sección 4.1) | JSON provisto por el usuario, 2026-09-01 | Alta — dato de negocio explícito |
| Chips visibles por perfil activo (sección 4.2) | Descripción en prosa del usuario (ejemplos A/B/C), formalizada como JSON | Alta — ejemplos concretos dados por el usuario |
| "Todos" preseleccionado por defecto | Corrección explícita del usuario sobre una versión anterior | Alta — corrección directa, no inferencia |
| Flujo de alta de reclamo en producción (2 pasos) | `html reference/reclaclamos.html` | Alta — observación directa de producción |
| Fricciones de UX del flujo de alta actual | Lectura nuestra sobre el HTML | Hipótesis — no validada con usuarios reales |
| Preguntas de la sección 6 | Brief original + preguntas abiertas acumuladas | N/A — son preguntas, no afirmaciones |

## 8. Documentos relacionados

- [`brief-consultas-reclamos.md`](brief-consultas-reclamos.md) — definición
  general de alto nivel y fricciones detectadas en el flujo de alta actual.
- [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md) —
  detalle completo de las Reglas A y B, con su forma de dato y
  extensibilidad.
- [`pantalla-reclamos-listado.md`](pantalla-reclamos-listado.md) — detalle
  técnico/UI de la pantalla (componentes, tokens, modo responsive, panel de
  "Casos de uso").
- [`guia-de-estilos-ui.md`](guia-de-estilos-ui.md) — sistema de diseño del
  prototipo.
