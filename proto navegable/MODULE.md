# Prototipo — Consultas / Reclamos (MiCorreo)

> **Actualizado: 2026-09-22.** Este documento describe el módulo del
> prototipo para que desarrollo pueda extraerlo sin arrastrar el Hub, la
> documentación ni las presentaciones.

## Propósito y alcance

Réplica del chrome de MiCorreo (header, sidebar, footer, tokens y
primitivos de UI) más **dos propuestas navegables** de la sección de
reclamos, que conviven y se comparan:

| Versión | Ruta | Qué propone | Estado |
|---|---|---|---|
| **V1** | `/prototipo/v1` | Sección única "Mis gestiones": catálogo completo filtrable por categorías | Presentada al cliente |
| **V2** | `/prototipo/v2` | Asistente guiado: pocas preguntas que podan hasta la gestión correcta | Alternativa en exploración |

`/prototipo/` es la **landing del módulo**: el selector entre las dos, sin
el chrome de MiCorreo (no es una pantalla del producto).

## Origen y trazabilidad

- **Chrome, tokens y primitivos**: extraídos del proyecto de referencia
  "Envio internacional CLAUDE" (fuera de esta raíz, sólo lectura).
- **Fidelidad visual**: `html reference/reclaclamos.html`, captura de la
  pantalla `reclamosform` de producción. **No está en el repositorio**
  (dominio interno + token de sesión embebido).
- **Reglas de negocio**: ver [`CHANGES.md`](CHANGES.md) y
  [`../documentation/`](../documentation).

## Carpeta extraíble

`proto navegable/`

## Interfaz pública

- **Entry point**: `src/main.tsx` → `src/app/App.tsx` (`<App />`).
- **Configuración requerida**: `base` en `vite.config.ts` (hoy
  `/prototipo/`). El `basename` del router lo lee de
  `import.meta.env.BASE_URL`, así que **cambiar la carpeta es tocar un solo
  archivo**.
- **Contratos públicos**: no expone una API tipada todavía — el host monta
  la app completa, no componentes sueltos.

## Ejecución independiente

```text
npm install
npm run dev        # http://localhost:4300/prototipo/
npm run build      # genera dist/
npm run typecheck
```

Funciona sin el Hub: no importa nada de `hub/`, `documentation/` ni
`presentaciones/`.

## Rutas y deep links

| Ruta | Pantalla |
|---|---|
| `/` | Landing: selector V1 / V2 |
| `/v1` | V1 — listado de "Mis gestiones" |
| `/v2` | V2 — asistente (buscador + árbol + accesos rápidos + formulario) |
| `/v2/reclamo` | V2 — formulario de referencia directo |
| `/v2/envios` | V2 — listado de envíos (entrada contextual) |
| `/v2/envios/:envioId` | V2 — detalle de un envío |
| `/v2/reclamos/:casoId` | V2 — confirmación con número de caso |

**Query params** (`src/core/session/deepLink.ts` y la propia
`AsistentePage`):

- Comunes: `?profile=individuo|pyme|franquicias|fulfillment`,
  `?responsive=1`, `?useCases=1`, `?hideTooling=1`, `?userMenuOpen=1`
- V1: `?category=<id>`, `?q=<texto>`, `?paqueteriaInternacional=1`,
  `?comunicacionesDigitales=1`
- V2: `?p=op1,op2` (camino recorrido), `?q=<texto>`, `?envio=<id>`

Los enlaces viejos a `/prototipo/?<param de V1>` **se redirigen solos** a
`/prototipo/v1` conservando la query — ver `src/pages/VersionsLandingPage.tsx`.

## Dependencias compartidas

Ninguna externa al módulo. Dentro:

- `src/styles/tokens.css` — tokens de MiCorreo en 3 capas.
- `src/shared/ui/` — 20+ primitivos (Button, Field, Select, Modal, Toast…).
- `src/shared/layout/` — chrome (Header, Sidebar, Footer, PageContainer).
- `src/core/gestiones/` — **regla de negocio vigente**, compartida por V1 y V2.

Paquetes npm: `react`, `react-dom`, `react-router-dom`, `lucide-react`.

**Fuentes Gilroy**: comerciales, **no están en el repositorio**. Hay que
proveerlas aparte en `src/assets/fonts/`.

## Mocks y adapters

### Incluidos para simulación

- `src/core/gestiones/data/categorias-gestiones.json` — las 7 categorías,
  sus gestiones y la visibilidad por tipo de usuario. **Dato de negocio
  real** (con las salvedades de origen documentadas).
- `src/v2/data/arbol.json` — el árbol de preguntas. Sus hojas son las 19
  gestiones documentadas; el **orden y los cortes son hipótesis de diseño**.
- `src/v2/data/formularios.json` y `src/v2/data/envios.json` —
  **inventados**, cada archivo lo declara en su campo `_advertencia`.
- `src/v2/core/reclamosStore.ts` — alta de reclamos **en memoria**, se
  pierde al recargar.
- Panel "Casos de uso" (`src/app/HubAccessButton.tsx`) — tooling del
  prototipo, **no es chrome de producción**. Simula tipo de usuario,
  viewport y categorías en construcción.

### A implementar o reemplazar en producción

- **Autenticación y tipo de usuario**: hoy se simula. Cómo se determina en
  producción **no está definido** (ver preguntas abiertas de la documentación).
- **Backend de gestiones**: el catálogo es estático.
- **Alta de reclamo**: no hay persistencia ni servicio.
- **Formularios reales**: existen en producción en otras URLs y varían según
  la consulta. El prototipo muestra un "Formulario de referencia" rotulado
  como tal; **falta la tabla gestión → URL real**.
- **Navegación del chrome**: el sidebar y el menú "Mi cuenta" son fidelidad
  visual, no navegan.

## Límite de estilos y assets

Todo el CSS es **CSS Modules** dentro del módulo. Lo único global es
`src/styles/globals.css` + `tokens.css`. V2 concentra sus estilos en
`src/v2/pages/v2.module.css`; no toca los de V1.

La clase global `force-mobile` (switch "Responsive" del panel) obliga a que
cada módulo repita sus reglas mobile bajo `:global(.force-mobile)` — ver los
`.module.css` de Header, Sidebar, AppShell y v2.

## Cómo extraerlo

1. Copiar la carpeta `proto navegable/` completa.
2. Proveer las fuentes Gilroy en `src/assets/fonts/`.
3. `npm install` y `npm run dev`.
4. Ajustar `base` en `vite.config.ts` al destino real.
5. Reemplazar los mocks de la sección anterior por servicios reales.
6. Decidir qué hacer con el panel "Casos de uso": es tooling de prototipo y
   **no debería llegar a producción** (`?hideTooling=1` ya lo oculta).

## Validación

- **Estado del contrato**: `partial`.
- **Build / typecheck**: limpios (`npm run build`, `npm run typecheck`).
- **Standalone**: sí — el módulo corre solo, sin el Hub.
- **Deep links**: verificados en navegador, incluida la recarga directa y el
  redirect de compatibilidad de los enlaces viejos de V1.
- **Acoplamientos pendientes**:
  - `HubAccessButton.tsx` tiene `HUB_URL = '/'` hardcodeado: asume que el
    Hub es la raíz del mismo sitio. Fuera de ese contexto hay que pasarlo
    por configuración (es lo único que mira hacia afuera del módulo).
  - No hay tests automatizados. Toda la validación fue manual en navegador.
  - Las fuentes comerciales impiden un `npm install && npm run dev` limpio
    desde cero sin proveerlas antes.
