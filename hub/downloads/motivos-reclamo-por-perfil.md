# Motivos de reclamo visibles por tipo de usuario

> ⚠️ **SUPERSEDED para la pantalla de listado (2026-09-02).** La sección
> pasó a llamarse "Mis gestiones" y sus chips de filtro ya no son estos
> perfiles de usuario — son 7 categorías de producto/servicio. Ver
> [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) para la
> definición vigente. Este documento se conserva completo porque el dato
> de negocio (qué motivo aplica a qué perfil) sigue siendo real y podría
> volver a ser relevante; sólo dejó de ser lo que decide qué se ve en la
> pantalla de gestiones.
>
> **Fuente**: definición funcional provista por el usuario el 2026-09-01,
> confirmada como regla de negocio real (no inferencia). Archivo de datos
> (única copia desde 2026-09-02, antes duplicado también en
> `documentation/data/`): [`../proto navegable/src/core/reclamos/data/motivos-reclamo-por-perfil.json`](../proto%20navegable/src/core/reclamos/data/motivos-reclamo-por-perfil.json)
> (`schema_version: 1`).
>
> **Estado: confirmado, pero incompleto** — define QUÉ motivo ve cada perfil,
> no CÓMO se determina el perfil de un usuario logueado (ver sección
> "Preguntas que abre" al final).

## 1. Propósito

Esta estructura es la fuente de verdad de qué **motivos de reclamo** debe
ofrecer el selector del paso 1 del alta de reclamo, según el **perfil** del
usuario que inició sesión. Reemplaza — al menos conceptualmente — el
`<select>` único y plano de ~20 opciones que hoy expone
[`html reference/reclaclamos.html`](../html%20reference/reclaclamos.html) por
igual a cualquier usuario, sin distinguir perfiles.

## 2. Perfiles (3 hoy, ampliable)

| Perfil | Label | Cant. de motivos visibles |
|---|---|---|
| `fulfillment` | Fulfillment | 17 |
| `franquicias` | Franquicias | 4 |
| `individuo` | Individuo | 12 |

`fulfillment` es el perfil con más motivos visibles (superset casi completo);
`franquicias` es el más acotado y el único con motivos exclusivos propios
(sellos digitales).

## 3. Matriz completa: motivo × perfil

19 motivos en total. `✓` = visible para ese perfil.

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

### Lectura rápida

- **Motivos transversales a los 3 perfiles** (2): "Errores en mi factura",
  "Errores con el saldo de mi cuenta".
- **Motivos exclusivos de `fulfillment`** (6): armado de envíos, demora en
  el armado, diferencia en el armado, diferencia de stock, carga de
  pedidos, no veo el stock — todos ligados a operación logística, no a un
  envío individual.
- **Motivos exclusivos de `franquicias`** (2): ambos sobre sellos digitales
  — es el único perfil sin superposición con "Demora en el servicio" ni con
  los motivos de entrega/paquete.
- **`individuo` es subconjunto de `fulfillment`** salvo por los motivos
  operativos de logística: todo lo que ve `individuo` también lo ve
  `fulfillment`, pero no al revés.

## 4. Forma del dato y extensibilidad

El JSON modela la relación motivo↔perfil **dos veces** (`profiles[].reason_ids`
y `reasons[].profiles`) — son redundantes entre sí, no dos fuentes distintas:
listan exactamente la misma relación desde cada lado, probablemente para que
el consumidor no tenga que invertir el índice en runtime.

Para **agregar un perfil nuevo**: agregar una entrada en `profiles` con su
`label` y `reason_ids`, y agregar ese id de perfil al array `profiles` de
cada motivo que corresponda en `reasons` (mantener ambos lados sincronizados).

Para **agregar un motivo nuevo**: agregar una entrada en `reasons` con
`label` y la lista de perfiles que lo ven, y agregar su id al `reason_ids`
de cada perfil correspondiente.

`schema_version: 1` sugiere que se espera evolución del esquema — no hay
todavía un changelog de qué cambiaría en una v2.

## 5. Relación con lo ya documentado

- Contrasta con el hallazgo de
  [`brief-consultas-reclamos.md`](brief-consultas-reclamos.md) sección 2: la
  pantalla de producción capturada en `html reference/reclaclamos.html`
  muestra los ~20 motivos **sin distinguir perfil** — este JSON confirma que
  el negocio SÍ diferencia motivos por tipo de usuario, aunque la pantalla
  actual no lo refleje. Es evidencia concreta de una mejora real de v1 (no
  sólo una hipótesis de UX): filtrar el selector de motivo según el perfil
  logueado.
- Casi todos los `label` coinciden literalmente con las opciones del
  `<select>` de producción (mismo texto, mismos acentos). La excepción es
  que en el JSON dos labels terminan en punto ("Problema con el pago de
  sellos digitales.", "Problemas para generar el sello digital.") — el resto
  no. Puede ser una inconsistencia menor de datos, no una diferencia de
  significado.

## 6. Visibilidad de perfiles entre sí (regla nueva, 2026-09-01)

> **Fuente**: definición funcional provista por el usuario el 2026-09-01,
> a raíz de construir la pantalla de Reclamos. Archivo de datos:
> [`../proto navegable/src/core/reclamos/data/visibilidad-perfiles.json`](../proto%20navegable/src/core/reclamos/data/visibilidad-perfiles.json)
> (`schema_version: 1`).

Es una regla **distinta** de la de la sección 3: acá no se trata de qué
*motivos* ve cada perfil, sino de qué **chips de tipo de reclamo** (perfiles
como opción de filtro) puede ver un usuario según su propio perfil activo.

| Perfil activo | Chips que ve |
|---|---|
| Individuo | Todos, Individuo |
| Franquicias | Todos, Individuo, Franquicias |
| Fulfillment | Todos, Individuo, Fulfillment |

Patrón observado (no una regla codificada aparte, es lo que dicen los
datos): todo perfil ve **su propio chip** + **Individuo** + **Todos**;
nadie ve el chip de un perfil ajeno que no sea Individuo. Individuo es el
único perfil "universalmente visible" además de Todos.

**Importante — esto NO redefine qué es "Todos"**: seleccionar el chip
"Todos" sigue mostrando la unión completa de motivos (19), sin importar qué
perfil esté activo ni qué chips vea. La restricción de esta sección es
sobre qué **chips existen** para navegar, no sobre qué **datos** trae
"Todos". Si el negocio quisiera que "Todos" también se acotara por perfil,
es una definición nueva, todavía no pedida.

El chip por defecto sigue siendo **"Todos"** en todos los casos — el perfil
activo no decide qué chip viene elegido, sólo cuáles existen. Si el chip
elegido deja de estar disponible al cambiar de perfil activo, el prototipo
vuelve a "Todos" automáticamente.

**Para agregar un perfil nuevo** a esta regla: una entrada más en
`visibility` (`proto navegable/src/core/reclamos/data/visibilidad-perfiles.json`, única copia) con la lista de chips que
puede ver. No hay que tocar la matriz de la sección 3 salvo que ese perfil
también tenga motivos propios.

## 7. Preguntas que abre (no resueltas por este archivo)

- ¿Cómo se determina el **perfil** de un usuario logueado? Este JSON asume
  que el perfil ya se conoce en tiempo de mostrar el selector — no dice si
  viene del rol de cuenta, de un flag, de una elección manual, etc.
- ¿Un mismo usuario puede tener **más de un perfil** simultáneamente (por
  ejemplo, una cuenta con fulfillment Y franquicias)? El esquema no lo
  contempla — cada usuario parecería tener un único perfil activo.
- ¿Qué pasa con un usuario que no matchea ningún perfil? ¿Ve todos los
  motivos (fallback al comportamiento actual) o ninguno?
- ¿Estos 3 perfiles son estables o se espera que aparezcan más pronto? (la
  nota inicial del usuario dice "podría ampliarse").
- ¿"Todos" debería acotarse también por perfil (sección 6), o se mantiene
  siempre como la unión completa de motivos como está hoy?
