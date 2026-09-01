# Consultas / Reclamos — definición general (alto nivel)

> **Estado: borrador inicial.** Este documento resume lo confirmado hasta
> ahora y dónde quedan huecos. No resuelve las definiciones de negocio
> pendientes — sólo las deja explícitas para que se puedan cerrar cuando
> corresponda, en vez de perderse entre conversaciones.

## 1. Objetivo (según brief original del usuario)

Mejorar la experiencia de uso de "consultas" y definir una evolución gradual
de sus funcionalidades. La primera versión debe aportar valor por sí sola
sobre lo que ya existe, sin necesidad de cubrir todas las capacidades futuras
del proyecto.

## 2. Qué observamos hoy (confirmado)

La única fuente concreta disponible hasta ahora es
[`html reference/reclaclamos.html`](../html%20reference/reclaclamos.html),
una captura de la pantalla `reclamosform` de producción de MiCorreo. Es un
flujo de **alta de un reclamo nuevo**, en dos pasos:

1. **Motivo del reclamo** — un único `<select>` con ~20 opciones planas, sin
   agrupar ni buscar (demoras, diferencias de stock, errores de facturación,
   paquete dañado, problemas de sesión, etc.).
2. **Buscar el envío asociado** — un formulario con 8 filtros visibles a la
   vez (TN, destinatario, fecha desde/hasta, provincia y sucursal de origen,
   provincia y sucursal de destino) para localizar el envío sobre el que se
   reclama, y una tabla de resultados para elegirlo.

No encontramos en este HTML una vista de **"mis reclamos" ya cargados**
(listado, seguimiento, estado): el archivo sólo cubre el alta.

**Confirmado el 2026-09-01** (definición funcional provista por el usuario,
no inferencia): el negocio distingue **3 perfiles de usuario**
(`fulfillment`, `franquicias`, `individuo`) que deberían ver **subconjuntos
distintos** de motivos de reclamo — cosa que la pantalla de producción
capturada arriba **no hace hoy** (muestra los ~20 motivos por igual a
cualquiera). Detalle completo en
[`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md).

## 3. Fricciones detectadas (hipótesis de trabajo, no confirmadas por research de usuario)

- Selector de motivo largo y plano — sin categorías ni búsqueda, difícil de
  escanear.
- 8 filtros simultáneos para buscar un envío, sin combos rápidos (ej. "últimos
  30 días") ni autocompletado.
- No hay evidencia de una pantalla de seguimiento de reclamos ya cargados.

Estas son lecturas de UX sobre el HTML existente, no problemas confirmados
por usuarios reales — hay que tratarlas como punto de partida para
conversar, no como backlog cerrado.

## 4. Definiciones abiertas (pendientes — no resolver por inferencia)

Repetidas del brief original, siguen sin respuesta:

- ¿Qué tipos de consulta existen en el producto real, más allá del alta de
  reclamo? (¿seguimiento, listado, edición, historial?)
- ¿Cuáles de esos tipos entran en la v1 y cuáles quedan para después?
- ¿Qué necesidades o dificultades reales reportan los usuarios (no sólo lo
  que se infiere mirando el HTML)?
- ¿Qué filtros y herramientas son realmente necesarios (vs. cuáles sobran)?
- ¿Qué significa concretamente "administrar consultas" en este proyecto —
  qué acciones incluye (editar, cancelar, reabrir, exportar, asignar)?
- ¿Cómo se va a comprobar que la primera entrega aporta valor (criterio de
  aceptación)?
- ¿Cómo se determina el perfil (`fulfillment` / `franquicias` / `individuo`)
  de un usuario logueado? ¿Puede tener más de uno? Ver sección "Preguntas
  que abre" en [`motivos-reclamo-por-perfil.md`](motivos-reclamo-por-perfil.md).

## 5. Referencias de diseño

- **Lo existente**: `html reference/reclaclamos.html` (fidelidad de
  producción).
- **Lo nuevo**: Figma "Mi Correo 2.0" (mencionado por el usuario en
  conversaciones previas; no verificado ni sincronizado en este proyecto
  todavía — acceso a Figma no autorizado en esta sesión).
- **Chrome y componentes reutilizables**: base de UI en
  [`proto navegable`](../proto%20navegable) + [guía de estilos](guia-de-estilos-ui.md).

## 6. Próximo paso sugerido

Cerrar la sección 4 con quien tenga el conocimiento de negocio/usuario antes
de construir pantallas de Reclamos sobre `proto navegable` — para no tomar
decisiones de alcance por inferencia. Mientras tanto, el prototipo y la guía
de estilos pueden seguir madurando de forma independiente.
