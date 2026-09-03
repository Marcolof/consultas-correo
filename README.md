# Consultas / Reclamos — MiCorreo

Proyecto de evolución UX de "Consultas y Reclamos" de MiCorreo (Correo
Argentino). La sección se renombró a **"Mis gestiones"** (2026-09-02; el
nombre puede volver a cambiar). El alcance de negocio sigue en definición
— ver [`documentation/brief-consultas-reclamos.md`](documentation/brief-consultas-reclamos.md)
para las preguntas abiertas — pero ya hay una primera pantalla real
navegable: el listado de "Mis gestiones", filtrable por 7 categorías de
producto/servicio (ver [`documentation/mis-gestiones-categorias.md`](documentation/mis-gestiones-categorias.md)).

**Sitio público (único)**: https://consultas-correo-v1.vercel.app
El prototipo vive dentro del mismo sitio, en
[`/prototipo/`](https://consultas-correo-v1.vercel.app/prototipo/) — no hay
una segunda URL que mantener.

## Estructura del repo

- **[`hub/`](hub)** — portada estática, es la **raíz pública** del proyecto.
  Enlaza el prototipo y los 6 documentos, con botón de descarga en cada uno.
  En el deploy se le agrega `hub/prototipo/` (el prototipo ya compilado):
  esa carpeta es **salida de build**, está en `.gitignore` y la genera
  [`scripts/build-hub.mjs`](scripts/build-hub.mjs) — no se edita a mano.
- **[`proto navegable/`](proto%20navegable)** — prototipo navegable en React +
  TypeScript + Vite. Chrome de MiCorreo (header, sidebar, footer) con
  fidelidad visual + la primera pantalla de negocio real (listado de
  "Mis gestiones", filtrable por 7 categorías de producto/servicio). Ver
  su propio [README](proto%20navegable/README.md).
- **[`documentation/`](documentation)** — brief de alto nivel, guía de
  estilos/UI, la definición vigente de categorías de "Mis gestiones", y la
  definición histórica de motivos por perfil de usuario (superseded).
- **`.project/project.yaml`** — estado del proyecto (decisiones, fuentes,
  artefactos, próximos pasos) mantenido por el Orchestrator.

## Cómo correrlo localmente

**Prototipo solo** (React + Vite, con hot reload):

```bash
npm install        # instala también las deps de "proto navegable"
npm run dev        # http://localhost:4300/prototipo/
```

**Sitio completo** (Hub + prototipo compilado adentro, como en producción):

```bash
npm run build      # compila el prototipo y lo copia a hub/prototipo/
npx serve hub      # o cualquier servidor estático apuntando a hub/
```

## Nota sobre fuentes

Las fuentes Gilroy no están en este repositorio (son comerciales, sin
licencia de redistribución pública) — ver la sección "Fuentes" en el
[README de `proto navegable`](proto%20navegable/README.md#fuentes-gilroy--no-están-en-el-repo).
