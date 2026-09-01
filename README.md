# Consultas / Reclamos — MiCorreo

Proyecto de evolución UX de "Consultas y Reclamos" de MiCorreo (Correo
Argentino). Estado: en definición — ver
[`documentation/brief-consultas-reclamos.md`](documentation/brief-consultas-reclamos.md)
para el alcance actual y las preguntas abiertas.

## Estructura del repo

- **[`proto navegable/`](proto%20navegable)** — prototipo navegable en React +
  TypeScript + Vite. Chrome de MiCorreo (header, sidebar, footer) y
  primitivos de UI extraídos con fidelidad visual, sin funcionalidad de
  negocio todavía. Ver su propio [README](proto%20navegable/README.md).
- **[`hub/`](hub)** — portada estática que enlaza el prototipo y la
  documentación. Pensada como punto de entrada único al proyecto.
- **[`documentation/`](documentation)** — brief de alto nivel y guía de
  estilos/UI extraída del proyecto de referencia.
- **`.project/project.yaml`** — estado del proyecto (decisiones, fuentes,
  artefactos, próximos pasos) mantenido por el Orchestrator.

## Cómo correrlo localmente

```bash
cd "proto navegable"
npm install
npm run dev        # http://localhost:4300
```

El Hub (`hub/index.html`) es estático: se puede abrir directo o servir con
cualquier servidor estático (por ejemplo `npx serve .` desde la raíz del
repo, y entrar a `/hub/`).

## Nota sobre fuentes

Las fuentes Gilroy no están en este repositorio (son comerciales, sin
licencia de redistribución pública) — ver la sección "Fuentes" en el
[README de `proto navegable`](proto%20navegable/README.md#fuentes-gilroy--no-están-en-el-repo).
