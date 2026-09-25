# Registro de cambios del prototipo

> Diferencias respecto de las fuentes externas y decisiones de UX relevantes,
> para facilitar la lectura de una PR de desarrollo. El detalle completo, con
> fechas y motivos, vive en [`../.project/project.yaml`](../.project/project.yaml).

## Respecto de la fuente de fidelidad (`html reference/reclaclamos.html`)

| Cambio | Motivo |
|---|---|
| Tokens en 3 capas (primitive → semantic → component) | El CSS original mezclaba valores crudos en los componentes |
| Una familia "Gilroy" con pesos numéricos | El original declaraba una familia por peso (`Gilroy-Medium` como family) |
| Peso base del cuerpo subido a 500 | Acercar el trazo al del HTML de referencia. Revertible en un token |
| El ítem "Ingresar Reclamos" del menú "Mi cuenta" lee `SECTION_LABEL` | Evitar que un futuro rename de la sección deje el menú desincronizado |
| Ícono utilitario con token `--icon-enabled` | En el original el X del modal usaba `fill="black"` fijo |

## Cambios de UX propios (no están en producción)

### V1 — "Mis gestiones" (`/v1`)

- La sección se renombró de "Reclamos" a **"Mis gestiones"**. El nombre vive
  en una única constante (`core/gestiones/sectionLabel.ts`) porque el negocio
  avisó que es probable que vuelva a cambiar.
- El selector plano de ~20 motivos se reemplazó por **buscador + chips de
  categoría**.
- Se agregaron **tags de búsqueda** por gestión (13-25 por ítem, generados
  por Claude, no validados por el negocio) y un algoritmo permisivo: alcanza
  con que una palabra significativa matchee, con ranking por relevancia.
- **Visibilidad por tipo de usuario**: qué categorías ve cada uno sale de
  `profile_category_visibility`. Regla de negocio real.
- Paquetería Internacional y Mis Comunicaciones Digitales están **ocultas por
  defecto**: su contenido es inventado y quedaron fuera del MVP.

### V2 — Asistente guiado (`/v2`) — alternativa, 2026-09-22

- El catálogo deja de estar a la vista: **un árbol de preguntas** poda hasta
  la gestión correcta en 2 pasos.
- El árbol vive entero en `src/v2/data/arbol.json`. **Agregar o reordenar una
  rama es editar ese JSON**, no tocar React.
- Sus **19 hojas son las 19 gestiones documentadas**, palabra por palabra.
  Verificado por script.
- **Contexto acumulado**: cada respuesta guarda un dato; una pregunta cuya
  respuesta ya se conoce se saltea sola. Es lo que hace que entrar desde un
  envío deje sólo una pregunta.
- **Formularios de referencia**: los reales ya existen en otras URLs. El
  prototipo lo rotula en pantalla en vez de proponer formularios nuevos.
- **Sin pantalla de seguimiento**: se construyó una y se quitó — nunca se
  pidió y el HTML de producción tampoco la tiene.
- **Los atajos del inicio apuntan sólo a gestiones documentadas.** El atajo
  "Mis envíos" se quitó porque abría una pantalla que no existe en la
  documentación (datos inventados); entró "Paquete dañado" en su lugar.
- **"Ingresar un reclamo" va último, al extremo derecho.** Es el único atajo
  que saltea el recorrido guiado: dejarlo primero lo volvía la salida más
  directa. El orden de `accesos_rapidos` en `arbol.json` es significativo.
- **"← Volver" deshace un paso**, arriba y a la izquierda, antes de las
  migas. Antes, entrar a una tarjeta dejaba los breadcrumbs como única salida.
- **Los dos caminos salen igual.** En la búsqueda el botón se llama también
  "← Volver" (era "Volver a las preguntas") y está a la izquierda; el
  contador de resultados bajó a quedar pegado arriba del listado.
- **Se quitó "Empezar de nuevo".** La primera miga ya vuelve al principio.
  Sobrevive sólo dentro del cartel de error, donde no hay migas.

### V3 — Ayuda y soporte (`/v3`) — alternativa, 2026-09-24

- Todas las gestiones **a la vista en 4 grupos por tipo de problema**. La
  agrupación es **mock**, tomada de una imagen de referencia: no es la de la
  documentación. Vive en `src/v3/data/ayuda.json`.
- Cada ítem guarda su gestión y categoría documentadas: la visibilidad por
  tipo de usuario se conserva aunque los grupos mezclen categorías.
- **Formulario sin datos que ya tiene la cuenta**: se muestran de sólo
  lectura; sólo se escribe la consulta. Datos de cuenta ficticios; captcha
  como maqueta visual.
- Sombra difusa y centrada nueva (`--shadow-soft` en `tokens.css`).
- V3 no importa nada de V2: se puede borrar una sin romper la otra.

## Decisiones tomadas y revertidas (para no repetirlas)

| Qué se hizo | Por qué se deshizo |
|---|---|
| Pantalla "Mis gestiones" con listado y estados de reclamo en V2 | Nunca se pidió; producción no la tiene |
| Primera pregunta "¿Tenés cuenta en MiCorreo?" | A esta sección no llega un usuario sin cuenta |
| Motivos de reclamo redactados por Claude ("Llegó dañado o incompleto"…) | Sólo pueden usarse gestiones documentadas |
| Nodos de autoayuda (recuperar contraseña, crear cuenta) | Ninguno está documentado. El motor los sigue soportando |
| Contador "Pregunta 2 de 3" | Condiciona al usuario |
| Íconos SVG dibujados a mano | Se reemplazaron por Lucide |
| Atajo "Mis envíos" en el inicio de V2 | Abría un listado de envíos inventado, no documentado. Las pantallas `/v2/envios` quedaron sin entrada desde la interfaz |
| Botón "Empezar de nuevo" junto a las migas | Duplicaba lo que hace la primera miga y competía con el "← Volver" |
| "← Volver" a la derecha de las migas | La salida tiene que estar donde arranca la lectura: a la izquierda, y en los dos caminos igual |

## Aislamiento

El módulo **no importa nada** de `hub/`, `documentation/` ni
`presentaciones/`. El único acoplamiento hacia afuera es `HUB_URL = '/'` en
`app/HubAccessButton.tsx` — ver [`MODULE.md`](MODULE.md).
