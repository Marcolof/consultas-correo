# Propuesta V3 — Ayuda y soporte

**Estado:** alternativa en exploración · **Fecha:** 24/09/2026 · **Actualizado:** 30/09/2026
**Rutas en el prototipo:** `/prototipo/v3`, `/prototipo/v3/formulario`,
`/prototipo/v3/envio` y `/prototipo/v3/reclamo-envio`

> V3 **no reemplaza** a V1 ni a V2. Las tres conviven y se eligen desde la
> landing del prototipo (`/prototipo/`).

---

## 1. La idea

| | V1 | V2 | V3 |
|---|---|---|---|
| Qué ve al entrar | Catálogo completo con chips | Una pregunta | **4 temas, cada uno con una descripción** |
| Pasos hasta el formulario | 1 (filtrar y elegir) | 2 (tema → gestión) | **2** (tema → subtema) |
| Formulario | — | De referencia, con datos editables | **Datos de la cuenta de sólo lectura; sólo se escribe la consulta** |

V3 agrupa por **tipo de problema** en lugar de por categoría de producto.
Cada tarjeta se toca entera y **sólo muestra una descripción**: los
subtemas aparecen recién al entrar (`/v3?t=<tema>`), y son los que llevan al
formulario. Así la tarjeta agrupa, en vez de ser una lista de atajos.

> **Cambio del 24/09/2026**: la primera versión de V3 listaba los subtemas
> dentro de cada tarjeta, como la imagen de referencia. El usuario lo
> descartó: esos ítems funcionaban como accesos, y los accesos ya están
> abajo. Las descripciones evitan nombrar temas que dependen del tipo de
> usuario (stock, franquicias), para no prometer algo que ese usuario no va
> a ver adentro.

## 2. De dónde sale

Dos imágenes de referencia aportadas por el usuario el 24/09/2026:

1. **"Ayuda y Soporte"**: buscador + 4 tarjetas con su lista de gestiones.
2. **"Contacto, sugerencias y reclamos"**: formulario en dos columnas, con la
   información registrada a la izquierda y los detalles de la gestión a la
   derecha.

**Estilo de las tarjetas de tema**: tomado de Figma "Mi Correo 2.0" (nodo
`13658:332679`, aportado por el usuario el 24/09/2026): radio 16, ícono
dentro de un círculo amarillo claro, título y descripción en el color de
texto principal. Se sumaron a `tokens.css` como `--radius-card` y
`--surface-brand-subtle`.

**Contorno en vez de sombra** (25/09/2026, a pedido del usuario, sobre el
Figma `13664:4975`): todas las tarjetas y filas de listado de **V1, V2 y
V3** —incluido el listado de consultas de V1— pasaron de sombra a un borde
de 1px `#D9D9D9` (token `--border-card`, que corresponde a
`Stroke/color-stroke-default` del Figma). Las sombras que quedan son de
menús, modales y avisos.

**De las imágenes de referencia se tomó la información y la disposición, no
el estilo.** Tipografía, colores, radios y sombras son los tokens de MiCorreo
que ya usan V1 y V2. Los emojis de las tarjetas se reemplazaron por íconos
de Lucide.

## 3. La agrupación es mock

La documentación agrupa por **categoría de producto/servicio**
(`categorias-gestiones.json`). La referencia agrupa por **tipo de problema**.
Son ejes distintos, y el usuario autorizó explícitamente hardcodear la
agrupación de la referencia para esta propuesta. Vive en
`proto navegable/src/v3/data/ayuda.json`.

Los títulos de grupo **se acortaron** a pedido del usuario ("no son muy user
friendly"). Los ítems conservan el texto de la referencia.

| Grupo (V3) | Ítems | Sólo Franquicias | Sólo Fulfillment |
|---|---|---|---|
| Envíos y paquetes — **nacionales** | Demora en el servicio · Fallas en la entrega · Paquetes dañados · Faltantes de contenido | — | Demora en el armado · Diferencia en el armado |
| Envíos y paquetes — **internacionales** (⚠️ hipotéticos, ver sección 9) | Demora en la entrega internacional · Problemas con la aduana · Paquete extraviado en tránsito internacional · Costos de importación no informados | — | — |
| Pagos y facturación | Cobros erróneos · No puedo pagar mis envíos · Pago de oficios judiciales | Errores con el saldo de mi cuenta · Errores en mi factura | — |
| Cuenta y plataforma | Inconvenientes para alta de usuario · Inconveniente al generar envío | Problemas con el sello digital · Pago de sellos digitales · Reclamos de Franquicias | Inconveniente con la carga de envíos · Inconveniente con la carga de pedidos · No visualizo stock · Diferencia de stock |
| Otras consultas | Problemas de seguimiento · Falta o error en información de seguimiento | — | — |

**"Cuenta y plataforma" concentra lo propio de cada tipo de usuario.** En la
primera versión, un usuario Franquicias entraba ahí y no encontraba nada de
Franquicias. Ahora ve sus 3 consultas de sellos y reclamos; Fulfillment ve
sus 4 de carga y stock; Individuo y Pyme ven sólo las 2 comunes.

### Trazabilidad contra la documentación

Cada ítem guarda a qué gestión documentada corresponde; el asunto que viaja
en el formulario es el nombre documentado, igual que en la referencia.
**V3 cubre las 19 gestiones documentadas.**

Diferencias con la imagen de referencia, todas del 24/09/2026:

- **4 gestiones documentadas agregadas** que la referencia no tenía: las
  dos de sellos digitales y "Inconveniente en la carga de los pedidos" en
  Cuenta y plataforma; "Diferencia en el armado del envío" en Envíos y
  paquetes, junto a "Demora en el armado".
- **2 ítems movidos** de "General" a Cuenta y plataforma: "Diferencia de
  stock" y "Reclamos de Franquicias".

**Ítems de la referencia sin gestión documentada** (3), que siguen igual:

- Inconveniente al generar envío
- Problemas de seguimiento
- Reclamos de Franquicias

## 4. Se conserva la regla de tipo de usuario

Aunque los grupos mezclan categorías, cada ítem sabe de qué categoría
documentada viene, y se filtra con la misma
`profile_category_visibility` que usan V1 y V2 (se consulta, no se copia).
Un Individuo no ve "Demora en el armado" ni "Errores en mi factura" aunque
estén dentro de grupos que sí ve. Un grupo que queda vacío no se muestra.

Los 3 ítems sin gestión documentada: "Reclamos de Franquicias" se asignó a
Franquicias por su nombre; los otros dos se ven para todos. **Ambas cosas son
inferencia.**

El filtro alcanza al buscador, a los accesos rápidos y al formulario: un
enlace directo a una gestión que ese usuario no ve muestra "Esta gestión no
está disponible".

## 5. Lo que se mantiene de V2

- **Buscador**: demora breve con "Buscando…", cruz para vaciar, "← Volver"
  arriba a la izquierda y contador pegado al listado. Usa los tags de las
  gestiones documentadas.
- **Accesos rápidos** al pie, como tarjetas más chicas. Los mismos que V2,
  con "Ingresar un reclamo" al final.

## 6. El formulario

El usuario llega **siempre registrado**, así que sus datos no se piden: se
muestran de **sólo lectura** en "Información registrada", como vienen de la
cuenta. Es el cambio de fondo respecto del formulario de V2, que seguía
pidiendo datos que el sistema ya tiene.

Lo único que el usuario escribe es **la consulta**. Si entra por "Ingresar
un reclamo" (sin gestión elegida), elige además el asunto.

Detalles:

- Hay dos salidas: la **flecha junto al título** (como en la referencia) y el
  botón **"Atrás"** al pie. Las dos vuelven a donde se estaba, con el tema o
  la búsqueda incluidos; si se entró por enlace directo, van al inicio de V3.
- El nombre sale de la misma sesión simulada que el saludo del header.
- **Los datos de cuenta son ficticios.** En la referencia, "Tipo de
  documento" mostraba "Consumidor final", que es una condición frente al IVA;
  se usó "DNI".
- **El captcha es una maqueta visual**, no valida nada.
- Al enviar se muestra el número de caso en el mismo panel. No hay pantalla
  de seguimiento.

Este formulario es el de las gestiones que **no** son de un envío puntual
(cobros, facturas, cuenta, etc.). Las de envío pasan antes por la búsqueda
del envío (sección 7) y terminan en su propio formulario (sección 8).

## 7. Búsqueda del envío (`/v3/envio`) — agregada el 30/09/2026

En producción (`/reclamosform`, relevado el 30/09/2026) los motivos de
reclamo **se dividen en dos formularios distintos**:

| Motivos de producción | Qué pide primero | Formulario |
|---|---|---|
| Demora en el servicio · Falta o error en la información de seguimiento · Inconvenientes con la entrega · Paquete dañado · Paquete con faltante de contenido | **Buscar y elegir el envío** | Reclamo de envío (sección 8) |
| Recibí un cobro erróneo · Errores en mi factura · Errores con el saldo de mi cuenta · Inconvenientes con la carga de envíos · Inconvenientes con el pago de oficios judiciales · Inconvenientes para dar de alta un usuario adicional · No puedo pagar mis envíos | Nada | Formulario de la sección 6 |

**Criterio del usuario (30/09/2026): todo lo referido a envíos va al
formulario de envío**, aunque producción liste más motivos que los de la
tabla. En V3 se marcaron así (campo `envio` en `ayuda.json`):

- Los 5 de producción: Demora en el servicio, Fallas en la entrega, Paquetes
  dañados, Faltantes de contenido y Falta o error en información de
  seguimiento.
- **Agregados por el criterio "todo lo de envíos"** (a confirmar): Problemas
  de seguimiento, Demora en el armado y Diferencia en el armado (Fulfillment).
- Los 4 internacionales hipotéticos (sección 9).

### Pantalla

Diseño: Figma "Mi Correo 2.0", "Estado default" (`13826:86552`), "Con
búsqueda" (`13826:86982`) y componente "Filtros reclamos" (`13818:80453`).

- **Título con flecha de volver**: la navegación hacia atrás vive en el título.
- **Filtros** (los mismos 8 de producción): TN, Destinatario, Fecha desde,
  Fecha hasta, Provincia de origen / Sucursal de origen, Provincia de destino
  / Sucursal de destino. La sucursal se habilita recién al elegir su
  provincia. Arrancan **visibles**, en 4 columnas × 2 filas, y se pliegan con
  el botón "Filtros".
- **Estado vacío inicial**: "Aún no hay resultados — Utilizá los filtros para
  encontrar resultados".
- **Al aplicar**: el panel se pliega (animado) y los filtros activos quedan
  como **chips** que se quitan de a uno, con "Limpiar filtro". Debajo:
  contador ("24 envíos"), tabla con filas alternadas (Fecha ordenable, TN,
  Estado, Envío cargado por, Origen, Destino) y paginador con "Filas por
  página".
- **Sin coincidencias**: "No encontramos envíos con esos filtros".
- **Ancho**: la pantalla usa todo el ancho disponible (hasta 1600px), para que
  la tabla no quede angosta.
- **Estado en la URL**: los filtros aplicados viajan en la URL; volver desde
  el reclamo conserva la búsqueda.

### Lo que se mantiene IGUAL que producción (pedido del usuario)

- **Calendario**: estilo global de producción (bootstrap-datepicker):
  « Mes Año », semana Do–Sa, días de meses vecinos en gris, ~205 × 230px.
  Es el componente compartido `DatePicker`.
- **Menú ⋮ de cada envío**: Reclamo · Detalle · Seguimientos.
- **Modal "Detalles del envío"** y **modal "Movimientos del envío"**: se
  replicaron tal cual, aunque no sigan el estilo de V3. Rediseñarlos queda
  para más adelante.

### Datos

**Los envíos son inventados** (24 envíos de ejemplo en
`proto navegable/src/v3/core/envios.ts`): producción no devolvió resultados
en el ambiente de dev y después la sesión venció. Siguen el formato de la
tabla de Figma y de los modales de producción. Las sucursales existen sólo
para algunas provincias.

## 8. Reclamo de un envío (`/v3/reclamo-envio`) — agregado el 30/09/2026

Se llega con "Reclamo" desde el menú ⋮ de un envío. Toma **toda la
información** del formulario de producción, con el estilo de V3:

- **Panel lateral de sólo lectura** con tres grupos: Datos del remitente (de
  la cuenta), Datos del destinatario y Datos del servicio (TN, importe
  abonado, valor del contenido, tipo de producto), estos dos precargados del
  envío.
- **Asunto** como en producción: gestión + producto (p. ej. "Demora en el
  servicio - Paq.ar Clásico"), más el TN.
- **Dos campos amplios**, los únicos que escribe el usuario, con **contador de
  caracteres**:
  - "Descripción del contenido" (96px de alto, máx. 250 caracteres).
  - "Descripción del reclamo" (200px, máx. 1000). En producción se llama
    sólo "Descripción"; se agregó "del reclamo" para distinguirlo.
  - **Los máximos son propuestos**: no se pudo relevar el de producción.
- Sin captcha, igual que el formulario de reclamo de producción.
- Al enviar: número de caso en el mismo panel.

## 9. ⚠️ Envíos internacionales: gestiones HIPOTÉTICAS

Desde el 30/09/2026, "Envíos y paquetes" se divide en **Envíos nacionales**
(primero, con las gestiones de siempre) y **Envíos internacionales**.

**Las 4 gestiones internacionales son hipotéticas: no existen en
producción ni en la documentación del negocio.** Son las 4 que ya figuraban
como inventadas en la categoría Paquetería Internacional de
[`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) (sección 5):

- Demora en la entrega internacional
- Problemas con la aduana
- Paquete extraviado en tránsito internacional
- Costos de importación no informados

Decisión del usuario (30/09/2026): **en la interfaz se muestran como
cualquier otra gestión**, sin el sufijo "(Gestión inventada)" ni ninguna
marca de "hipotética". Su carácter hipotético se registra **sólo en la
documentación** (este documento y `mis-gestiones-categorias.md`). Se buscan
con los mismos tags de la categoría inventada y, como son de envío, pasan
por la búsqueda del envío.

Antes de presentarlas como reales hay que reemplazarlas por las gestiones
internacionales que defina el negocio.

## 10. Pendiente: SIE

**SIE** es otra posible incorporación a los reclamos que mencionó el
usuario el 30/09/2026. **Hoy queda pendiente**: no forma parte de los casos
de uso ni de ninguna pantalla del prototipo, pero podría sumarse más
adelante. No hay en el proyecto ninguna definición de qué gestiones o
tipo de usuario abarcaría; se documenta sólo su estado.

## 11. Paquete para el cliente

`npm run build:cliente` (dentro de `proto navegable/`) genera una carpeta
con **sólo V3** que se abre con doble clic, sin servidor ni links al Hub o a
Vercel: `Paquete cliente V3/` (fuera del repositorio), con
`Abrir propuesta V3.html`, `assets/` y un `LEEME.txt`. Incluye las fuentes
Gilroy y arranca con el perfil Individuo. Ver `vite.client.config.ts` y
`scripts/finalize-cliente.mjs`.

## 12. Preguntas abiertas

1. ¿La agrupación por tipo de problema se adopta, o se vuelve a la de
   categorías? Son ejes distintos y hoy conviven en V1/V2 vs V3.
2. ¿Qué gestión real corresponde a "Inconveniente al generar envío",
   "Problemas de seguimiento" y "Reclamos de Franquicias"? ¿"Problemas de
   seguimiento" no duplica a "Falta o error en información de seguimiento"?
3. ¿"Pago de sellos digitales" va en Cuenta y plataforma (con el resto de
   sellos) o en Pagos y facturación? Hoy está junto a los sellos, para que
   Franquicias encuentre todo lo suyo en un lugar.
4. ¿Qué datos de la cuenta tiene que mostrar el formulario para cada tipo de
   usuario? (Franquicias y Fulfillment probablemente tengan razón social.)
5. ¿"Tipo de documento: Consumidor final" de la referencia era un error, o
   el campo real es la condición frente al IVA?
6. ¿"Problemas de seguimiento", "Demora en el armado" y "Diferencia en el
   armado" van al formulario de envío? Se marcaron así por el criterio "todo
   lo de envíos", sin que producción lo confirme.
7. ¿Qué gestiones internacionales reales reemplazan a las 4 hipotéticas?
8. ¿Cuáles son los largos máximos reales de "Descripción del contenido" y
   "Descripción"?
9. ¿SIE se incorpora a los reclamos? ¿Con qué gestiones y para qué tipos de
   usuario?

## 13. Documentos relacionados

- [`propuesta-v2-reclamo-contextual.md`](propuesta-v2-reclamo-contextual.md) — V2.
- [`mis-gestiones-categorias.md`](mis-gestiones-categorias.md) — la regla de categorías y tipos de usuario.
