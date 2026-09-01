# Consultas / Reclamos — MiCorreo

Proyecto de evolución UX de "Consultas y Reclamos" de MiCorreo (Correo
Argentino). El alcance de negocio sigue en definición — ver
[`documentation/brief-consultas-reclamos.md`](documentation/brief-consultas-reclamos.md)
para las preguntas abiertas — pero ya hay una primera pantalla real
navegable: el listado de Reclamos, con datos reales de qué motivo/perfil
puede ver cada tipo de usuario.

**Hub público**: https://consultas-correo-v1.vercel.app

## Estructura del repo

- **[`hub/`](hub)** — portada estática, es la **raíz pública** del proyecto
  (deployada en Vercel con Root Directory = `hub`). Enlaza el prototipo y
  los 4 documentos, con botón de descarga en cada uno.
- **[`proto navegable/`](proto%20navegable)** — prototipo navegable en React +
  TypeScript + Vite. Chrome de MiCorreo (header, sidebar, footer) con
  fidelidad visual + la primera pantalla de negocio real (listado de
  Reclamos, filtrable por perfil de usuario simulado desde el panel
  "Casos de uso"). Ver su propio [README](proto%20navegable/README.md).
- **[`documentation/`](documentation)** — brief de alto nivel, guía de
  estilos/UI, y las 2 definiciones funcionales de negocio (motivos de
  reclamo por perfil, y la pantalla de Reclamos en detalle).
- **`.project/project.yaml`** — estado del proyecto (decisiones, fuentes,
  artefactos, próximos pasos) mantenido por el Orchestrator.

## Cómo correrlo localmente

**Prototipo** (React + Vite):

```bash
cd "proto navegable"
npm install
npm run dev        # http://localhost:4300
```

**Hub** (estático, sin build):

```bash
npx serve hub       # o cualquier servidor estático apuntando a hub/
```

## Nota sobre fuentes

Las fuentes Gilroy no están en este repositorio (son comerciales, sin
licencia de redistribución pública) — ver la sección "Fuentes" en el
[README de `proto navegable`](proto%20navegable/README.md#fuentes-gilroy--no-están-en-el-repo).
