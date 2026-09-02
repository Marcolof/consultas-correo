# proto navegable

Base de chrome UI de **MiCorreo** (Correo Argentino) en React + TypeScript + Vite.

> Nombre de carpeta: `proto navegable` (nombre de paquete npm: `proto-navegable`,
> por ser el equivalente válido sin espacios). Antes se llamaba `mlof-ui-base`
> — renombrada para que el nombre sea legible de cara al Hub y a GitHub.

El **chrome** (header, sidebar, footer, tokens, primitivos de UI) está
extraído del proyecto de referencia `Envio internacional CLAUDE` con
**fidelidad visual** (tokens, tipografía, medidas) y sin nada de su
funcionalidad de negocio (no hay roles, permisos, envíos, mocks ni
escenarios de ese proyecto). Sobre esa base ya se construyó la primera
pantalla real de **este** proyecto — el listado de **"Mis gestiones"**
(antes "Reclamos") — con datos reales de negocio (qué gestión pertenece a
qué categoría). Ver [`documentation/mis-gestiones-categorias.md`](../documentation/mis-gestiones-categorias.md).

## Qué incluye

- **Chrome de la app**: `Header` (barra superior con logo, "Nuevo envío" y menú
  de usuario), `Sidebar` (riel de íconos en desktop + cajón deslizante en
  mobile), `Footer`.
- **Layout de pantalla**: `PageContainer`, `PageHeader`.
- **Design tokens** (`src/styles/tokens.css`): paleta, tipografía (Gilroy),
  espaciado, radios, sombras, capas — en tres niveles (primitive → semantic →
  component). Ver [`documentation/guia-de-estilos-ui.md`](../documentation/guia-de-estilos-ui.md).
- **Primitivos de UI** (`src/shared/ui`): `Button`, `Input`, `Textarea`,
  `Select`, `NumberInput`, `SearchInput`, `Field`, `Checkbox`, `RadioGroup`,
  `RadioDot`, `Switch`, `ChipGroup`, `Modal`, `ConfirmDialog`, `Alert`,
  `Badge`, `Toast`, `DataTable`, `Pagination`, `NavListItem`, `EmptyState`,
  `Stepper`, `Tabs`.
- **Assets**: fuentes Gilroy (.ttf), logo de Correo Argentino / MiCorreo,
  íconos del sidebar y del header, botón de chat flotante.
- **Pantallas reales**: `ReclamosListPage` (`/`, nombre de archivo sin
  cambiar) — listado de "Mis gestiones" filtrable por 7 categorías de
  producto/servicio, con datos reales (no mock) desde
  `src/core/gestiones/categories.ts`. El nombre de la sección vive en
  `src/core/gestiones/sectionLabel.ts` (una sola constante, editable si el
  negocio vuelve a renombrarla). Ver
  [`documentation/pantalla-reclamos-listado.md`](../documentation/pantalla-reclamos-listado.md)
  y [`documentation/mis-gestiones-categorias.md`](../documentation/mis-gestiones-categorias.md).
- **Tooling de prototipo** (no es chrome de producción): el botón flotante
  junto al `ChatBubble` abre "Volver al Hub" y "Casos de uso" (switch
  "Responsive"). Ver `src/app/HubAccessButton.tsx`.
- **Histórico, sin uso hoy**: `src/core/reclamos/` (motivos por perfil de
  usuario) y `src/core/session/activeUseCase.ts` — mecanismo superado por
  las categorías de "Mis gestiones", conservado por si vuelve a ser
  relevante.

## Qué NO incluye (a propósito)

Todo lo que en el proyecto de referencia es **funcionalidad**, no chrome:
motor de roles/permisos, feature flags, escenarios de demo, mocks de datos,
y los módulos de negocio (envíos, cuenta, saldo, comunicaciones digitales).
El usuario que se muestra en el header (`src/core/user.ts`) es un dato
estático de ejemplo: reemplazarlo por la sesión real cuando corresponda.

## Fuentes (Gilroy) — no están en el repo

Gilroy es una fuente comercial sin licencia de redistribución pública. Los
`.ttf` están excluidos del repositorio (ver `.gitignore` en la raíz del
proyecto), así que:

- **En local**, copiá los 6 pesos (`Gilroy-Light/Regular/Medium/SemiBold/Bold/Heavy.ttf`)
  a `src/assets/fonts/` antes de correr `npm run dev` — quien tenga acceso al
  archivo de fuentes original del proyecto los provee por fuera de git.
- **Sin los archivos**, la app funciona igual pero cae al resto de la pila
  tipográfica (`system-ui`, `-apple-system`, `Segoe UI`) definida en
  `--font-family-base` (`src/styles/tokens.css`) — no rompe nada, sólo pierde
  fidelidad tipográfica exacta.
- Esto también aplica al build de producción / deploy (Vercel u otro): sin
  las fuentes cargadas en el entorno de build, se sirve con el fallback.

## Uso

```bash
npm install
npm run dev
```

Sirve en `http://localhost:4300`.

```bash
npm run typecheck   # tsc -b --noEmit
npm run build        # build de producción
```

## Cómo seguir desde acá

1. Agregar páginas nuevas como rutas en `src/app/router.tsx`, siguiendo el
   patrón de `ReclamosListPage`.
2. Si la pantalla nueva necesita un componente que no está acá, agregarlo en
   `src/shared/ui/<Componente>/` siguiendo el mismo patrón: `.tsx` +
   `.module.css` (consumiendo tokens, nunca literales) + `index.ts`.
3. No tocar `src/styles/tokens.css` salvo que haga falta un token nuevo — y en
   ese caso, agregarlo en la capa que corresponda (primitive/semantic/component)
   y documentarlo en la guía de estilos.
