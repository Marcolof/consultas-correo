# Guía de estilos, UI y front — MiCorreo

> Fuente: extraído del proyecto de referencia `Envios internacionales/Envio
> internacional CLAUDE` (React + TypeScript + Vite), que a su vez replica el
> HTML/CSS de producción de MiCorreo (`estilos.css`, `estilos-inputs.css`,
> Bootstrap customizado). Esta guía documenta lo que se trajo a la base nueva
> `Reclamos claude/proto navegable`: **sólo chrome y design system, sin
> funcionalidad de negocio**.

---

## 1. Arquitectura de tokens (3 capas)

Todo el look del producto vive en `src/styles/tokens.css`, organizado en tres
capas que **no deben saltearse**:

| Capa | Qué es | Quién la usa |
|---|---|---|
| **1. Primitive** | Valores crudos (`--grey-400: #ccc`, `--space-4: 1rem`) | Nadie directamente desde un componente |
| **2. Semantic** | Rol de uso (`--text-muted`, `--surface-page`, `--border-focus`) | Puede usarse en componentes genéricos |
| **3. Component** | Medida propia de un componente (`--button-height`, `--field-radius`, `--modal-width-md`) | Es lo que consume cada `.module.css` |

**Regla dura:** un componente nuevo consume tokens de capa 2 o 3, nunca
literales (`#152663`, `14px`) ni tokens de capa 1 directo. Si hace falta un
valor que no existe, se agrega el token correspondiente en `tokens.css` — no
se hardcodea en el componente.

`src/styles/globals.css` importa `tokens.css`, declara las `@font-face` de
Gilroy y trae el reset base (`box-sizing`, márgenes, `:focus-visible`, etc.).
No se debe redefinir nada de esto en un componente: si hace falta una
variante, sale de un token.

---

## 2. Marca y paleta

```
--correo-yellow: #ffce00   → color de marca (fondos de header, botones primarios)
--correo-blue:   #152663   → contraste de marca (texto sobre amarillo, acentos, focus de radios)
--correo-grey-700: #49454f → texto secundario/labels
--correo-near-black: #191919 → texto principal
```

Escala de grises (de clarísimo a texto principal): `--grey-050` (`#fafafa`,
fondo de página) → `--grey-100` → `--grey-150` → `--grey-200` (riel del
sidebar) → `--grey-300` (deshabilitado) → `--grey-400` (borde de input) →
`--grey-600` → `--grey-700` → `--grey-800` → `--grey-900` (texto principal).

Estados: `--red-*` (error), `--green-*` (éxito), `--blue-focus` (`#2196f3`,
borde de foco de inputs — **no** es el azul de marca).

### Tokens semánticos de superficie y texto

```
--surface-page      → fondo general de la app (gris muy claro)
--surface-raised     → tarjetas, inputs, modales (blanco)
--surface-sunken     → fondos hundidos (hover de tabla, disabled)
--surface-rail       → riel del sidebar
--surface-brand      → header (amarillo)

--text-primary   / --text-secondary / --text-muted / --text-subtle / --text-disabled
--text-link      → azul de marca
--text-on-brand  → texto sobre fondo amarillo (también azul de marca)
```

---

## 3. Tipografía

Una sola familia, **Gilroy**, con pesos numéricos (no una familia por peso,
como hacía el CSS legacy con `"Gilroy-Medium"`):

| Token | Peso | Archivo |
|---|---|---|
| `--font-weight-light` | 300 | Gilroy-Light.ttf |
| `--font-weight-regular` | 400 | Gilroy-Regular.ttf |
| `--font-weight-medium` | 500 | Gilroy-Medium.ttf |
| `--font-weight-semibold` | 600 | Gilroy-SemiBold.ttf |
| `--font-weight-bold` | 700 | Gilroy-Bold.ttf |
| `--font-weight-heavy` | 800 | Gilroy-Heavy.ttf |

El peso base del `<body>` es `--font-weight-base` (= medium/500) para
acercarse al trazo del HTML de referencia; es revertible a 400 en un único
lugar (`tokens.css`).

Escala de tamaños: `--font-size-3xs` (11px, label flotante) hasta
`--font-size-2xl` (24px). Los más usados: `--font-size-sm` (14px, inputs y
texto de tabla), `--font-size-base` (16px, botones y cuerpo).

---

## 4. Espaciado, radios y sombras

- **Espaciado**: escala de 4px compatible con los `rem` de Bootstrap
  (`--space-1` = 4px … `--space-12` = 48px).
- **Radios**: desde `--radius-xs` (5px, inputs) hasta `--radius-pill` (32px,
  botones) y `--radius-full` (círculos: avatar, badges).
- **Sombras**: `--shadow-row` (filas de tabla), `--shadow-dropdown` /
  `--shadow-modal` (menús y modales), `--shadow-inset-active` (feedback de
  click en botones).
- **Capas (`z-index`)**: escala nombrada de `--z-base` a `--z-demo-toolbar`
  para que un componente nuevo no invente un número al azar.

---

## 5. Chrome de la aplicación

### Header (`shared/layout/Header`)
Barra superior fija, fondo amarillo (`--surface-brand`), `60px` de alto
(`--header-height`). De izquierda a derecha: botón hamburguesa (abre el
cajón en mobile) → logo Correo Argentino / MiCorreo →, a la derecha, "Nuevo
envío" y el bloque de usuario (avatar circular con inicial + "Hola,
{nombre}" + "Mi cuenta" con menú desplegable).

### Sidebar (`shared/layout/Sidebar`)
Dos presentaciones del mismo árbol de navegación
(`core/navigation/navigation.config.ts`):
- **Riel** (`≥768px`): 61px de ancho (`--sidebar-rail-width`), sólo íconos,
  fijo a la izquierda, fondo `--surface-rail`.
- **Cajón** (`<768px`, offcanvas): 340px, con textos, íconos y submenús
  colapsables.

Los ítems (Panel, Mis envíos, Servicios, Mi saldo, Integraciones) son los
mismos que expone el HTML de producción (`reclamosform`, `envioCla`, etc.).
Es **chrome puro**: ningún ítem navega a una pantalla real todavía.

### Footer (`shared/layout/Footer`)
Pie simple: copyright + enlaces inertes (Preguntas frecuentes, Términos y
condiciones, Botón de baja).

### Layout de pantalla
- `PageContainer`: envoltorio de contenido. `width="narrow"` (max 1200px,
  centrado) para formularios y grillas; `width="full"` para pantallas que
  manejan su propia grilla a todo el ancho.
- `PageHeader`: título + descripción + acciones a la derecha, estándar de
  toda pantalla.
- `ChatBubble`: botón de chat flotante, decorativo (no abre nada).

**Composición típica de una pantalla nueva:**

```tsx
<PageContainer>
  <PageHeader title="…" description="…" actions={<Button>…</Button>} />
  {/* contenido de la pantalla */}
</PageContainer>
```

`AppShell` ya resuelve los márgenes por el header fijo y el riel lateral —
una pantalla nunca debe manejar ese offset por su cuenta.

---

## 6. Primitivos de formulario

Todos viven en `shared/ui` y consumen los tokens de la sección 1. Comparten
un mismo sistema de **label flotante** (`Field` + `Field.module.css`): el
label reposa centrado sobre el control y sube (con fondo propio, tipo
"notch") al enfocar o al tener valor. Se resuelve con
`:not(:placeholder-shown)` — por eso **todo input necesita `placeholder`**
(por defecto, el propio label).

| Componente | Rol |
|---|---|
| `Input` / `Textarea` | Campo de texto con label flotante |
| `Select` | Desplegable — label siempre arriba (no tiene estado "vacío") |
| `NumberInput` | Input numérico con spinners propios (oculta las flechas nativas) |
| `Field` | Envoltorio compartido (label, hint, error) — no se usa suelto, lo envuelven `Input`/`Select`/`Textarea` |
| `Checkbox` / `RadioGroup` | Casillas y radios, marcados en azul de marca (el amarillo no cumple contraste) |
| `RadioDot` | Indicador visual de radio dibujado en SVG (Design System), decorativo |
| `Switch` | Toggle accesible (`role="switch"`, no `<input type="checkbox">`) |
| `ChipGroup` | Filtro de selección única en píldoras — activo en azul de marca sólido. Agregado 2026-09-01 (ver sección 7bis) |

Todos aceptan `error` (texto rojo bajo el campo + borde rojo) o `invalid`
(sólo el borde rojo, para formularios que centralizan el error en un banner
aparte).

### `SearchInput` — la excepción sin label flotante

Agregado el 2026-09-01. No comparte `Field`: un buscador no necesita label
flotante (el placeholder alcanza) y su ícono de lupa rompería el selector
CSS `.control + .label` del que depende el mecanismo de label. Pill
redondeado (`--search-input-radius: var(--radius-pill)`), 48px de alto
(`--search-input-height`), placeholder siempre visible (a diferencia de
`Input`, que lo oculta).

---

## 7. Botones

`Button` (`shared/ui/Button`) tiene 4 variantes y no conoce reglas de
negocio — quien lo usa decide si va deshabilitado:

| Variante | Uso |
|---|---|
| `primary` | Fondo amarillo pleno, texto azul — acción principal |
| `secondary` | Blanco con borde amarillo — acción secundaria |
| `tertiary` | Sin fondo, sólo subrayado inferior amarillo |
| `link` | Sin fondo ni borde, como un enlace |

Tamaños: `sm` (32px), `md` (44px, default), `step` (ancho fijo 124px, para
Atrás/Siguiente de wizards). `shape="square"` quita el radio propio cuando
un contenedor externo ya recorta las esquinas (p. ej. un botón "Pagar" pegado
al fondo de una tarjeta).

### `ChipGroup` vs. `Tabs` — no confundir

Agregado el 2026-09-01, junto con la primera pantalla real (Reclamos).
Ambos son "botones que cambian algo al hacer click" pero con roles e
identidades visuales distintas — no usar uno por el otro:

| | `Tabs` | `ChipGroup` |
|---|---|---|
| Para qué sirve | Cambiar de panel/sección | Filtrar/segmentar una lista |
| Activo | Bloque **amarillo**, esquinas superiores redondeadas | Píldora **azul de marca** sólida, radio completo |
| Tokens | `--tab-*` | `--chip-*` |

---

## 8. Feedback y overlays

- **`Alert`**: banner inline de una fila mínima, tonos `danger` / `success` /
  `info` / `warning`. `danger` lleva `role="alert"`, el resto `role="status"`.
- **`Badge`**: píldora de estado, mismos 5 tonos que `Alert` más `neutral`.
- **`Toast`** + `ToastProvider`: cola de notificaciones flotante abajo a la
  derecha, auto-cierre a los 4s. Se consume con `useToast()` dentro del
  `ToastProvider` (ya montado en `app/providers.tsx`).
- **`Modal`**: base de diálogo (portal sobre `body`, cierra con Escape/click
  afuera si `closable`, bloquea el scroll del fondo). Tamaños `sm/md/lg/xl`.
- **`ConfirmDialog`**: confirmación de dos botones sobre `Modal`. `emphasis`
  decide cuál de los dos botones es el primario (por defecto, Confirmar).

---

## 9. Datos y navegación secundaria

- **`DataTable`**: tabla genérica con look `.mcr-table` (filas separadas,
  sombra y radio por fila, encabezado sticky). Incluye skeleton de carga y
  slot de estado vacío.
- **`Pagination`**: paginador con elipsis cuando hay muchas páginas.
- **`NavListItem`** *(2026-09-01)*: fila clickeable de una lista simple —
  label a la izquierda, flecha a la derecha. Para listados de navegación
  (p. ej. motivos de reclamo), no para datos tabulares (eso es `DataTable`).
- **`EmptyState`**: bloque centrado para listas/tablas sin resultados (ícono
  opcional + título + descripción + acción).
- **`Tabs`**: pestaña activa como bloque amarillo con esquinas superiores
  redondeadas sobre una línea amarilla inferior. Puede cambiar un panel
  (`onChange`) o navegar a otra ruta (`to`).
- **`Stepper`**: indicador de pasos de 3 puntos conectados — visitado (azul),
  activo (disco amarillo con anillo), pendiente (outline gris).

---

## 10. Assets

- **Logo**: `assets/img/CorreoArgentino-MiCorreo.png` — se usa a tamaño
  natural recortado a 28px de alto en el header (nunca estirar).
- **Fuentes**: `assets/fonts/Gilroy-*.ttf` (Light, Regular, Medium, SemiBold,
  Bold, Heavy).
- **Íconos del sidebar/header**: `add.png`, `caja.png`, `enchufe.png`,
  `home.png`, `moneda.png`, `persona.png`, `servicios.png`,
  `navbar-toggler.svg`. Son los PNG de producción; cada uno puede traer un
  margen transparente distinto dentro del canvas — si un ícono nuevo se ve de
  otro tamaño que el resto, hay que recortarle el margen, no forzar un
  `transform: scale()` parche.
- **`chatbot.png`**: botón de chat flotante — ya incluye su propio círculo,
  no se le agrega un fondo encima.

---

## 11. Qué NO forma parte de este chrome

Deliberadamente **no** se trajo a la base nueva (porque es funcionalidad de
negocio del proyecto de referencia, no design system):

- Motor de roles/permisos, feature flags, escenarios de demo.
- Mocks de datos y módulos de dominio (envíos, cuenta, saldo, comunicaciones
  digitales).
- El usuario que hoy se ve en el header (`core/user.ts` en `proto navegable`) es
  un dato estático de ejemplo — reemplazarlo por la sesión real cuando
  corresponda.

## 12. Cómo agregar un componente nuevo

1. Carpeta en `src/shared/ui/<Nombre>/` con `<Nombre>.tsx` +
   `<Nombre>.module.css` + `index.ts`.
2. El CSS consume tokens semánticos/de componente — si falta uno, se agrega
   primero en `tokens.css` (capa que corresponda) y se documenta acá.
3. Exportar desde `src/shared/ui/index.ts`.
4. Si el componente es de layout de página (no un primitivo de formulario ni
   feedback), va en `src/shared/layout/` en lugar de `shared/ui`.
