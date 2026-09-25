import { Link, Navigate } from 'react-router-dom'
import styles from './VersionsLandingPage.module.css'

/**
 * Landing del módulo del prototipo: desde acá se entra a cada propuesta.
 *
 * No usa el chrome de MiCorreo a propósito — esta pantalla no forma parte
 * del producto, es la portada del módulo (el chrome arranca al entrar a una
 * versión).
 */

/**
 * Params que antes de existir esta landing apuntaban directo a la pantalla
 * de V1 (los usan los iframes de la presentación y cualquier enlace ya
 * compartido). Si llega alguno, se redirige a `/v1` conservando la query
 * para no romper esos enlaces.
 */
const PARAMS_DE_V1: readonly string[] = [
  'profile',
  'category',
  'q',
  'responsive',
  'useCases',
  'paqueteriaInternacional',
  'comunicacionesDigitales',
  'userMenuOpen',
  'hideTooling',
]

interface VersionCard {
  readonly to: string
  readonly version: string
  readonly titulo: string
  readonly estado: string
  readonly resumen: string
  readonly puntos: readonly string[]
}

const VERSIONES: readonly VersionCard[] = [
  {
    to: '/v1',
    version: 'V1',
    titulo: 'Sección única de gestiones',
    estado: 'Propuesta presentada',
    resumen:
      'El usuario entra a una sección propia y encuentra su gestión buscando dentro del catálogo completo, agrupado por categorías de producto y servicio.',
    puntos: [
      'Una pantalla, 7 categorías de producto/servicio',
      'Buscador con sinónimos sobre todas las gestiones',
      'El catálogo visible depende del tipo de usuario',
    ],
  },
  {
    to: '/v2',
    version: 'V2',
    titulo: 'Asistente que te guía hasta tu caso',
    estado: 'Alternativa en exploración',
    resumen:
      'En vez de mostrar el catálogo entero, el sistema hace unas pocas preguntas y va podando hasta el reclamo correcto. Buscar y responder preguntas son dos caminos al mismo lugar.',
    puntos: [
      'Dos pasos hasta el formulario, con accesos rápidos',
      'Cada respuesta acorta el formulario final',
      'Se puede volver atrás y cambiar cualquier respuesta',
    ],
  },
  {
    to: '/v3',
    version: 'V3',
    titulo: 'Todas las gestiones a la vista',
    estado: 'Alternativa en exploración',
    resumen:
      'Sin preguntas intermedias: las gestiones se agrupan por tipo de problema y cada una está a un clic. El formulario muestra los datos de la cuenta y sólo pide la consulta.',
    puntos: [
      'Cuatro grupos por tipo de problema',
      'Formulario sin datos que ya tiene la cuenta',
      'Mismo buscador y accesos rápidos que V2',
    ],
  },
]

export function VersionsLandingPage() {
  const search = typeof window === 'undefined' ? '' : window.location.search
  const params = new URLSearchParams(search)
  const esEnlaceViejoDeV1 = PARAMS_DE_V1.some((param) => params.has(param))

  if (esEnlaceViejoDeV1) {
    return <Navigate to={`/v1${search}`} replace />
  }

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <header className={styles.head}>
          <p className={styles.kicker}>Correo Argentino · MiCorreo</p>
          <h1 className={styles.title}>Consultas y Reclamos</h1>
          <p className={styles.lede}>
            Tres propuestas distintas para resolver el mismo problema. Cada una se
            recorre completa; conviven para poder compararlas.
          </p>
        </header>

        <div className={styles.cards}>
          {VERSIONES.map((version) => (
            <Link key={version.version} to={version.to} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.version}>{version.version}</span>
                <span className={styles.estado}>{version.estado}</span>
              </div>

              <h2 className={styles.cardTitle}>{version.titulo}</h2>
              <p className={styles.cardResumen}>{version.resumen}</p>

              <ul className={styles.puntos}>
                {version.puntos.map((punto) => (
                  <li key={punto}>{punto}</li>
                ))}
              </ul>

              <span className={styles.cta}>Recorrer {version.version} →</span>
            </Link>
          ))}
        </div>

        <footer className={styles.foot}>
          <a href="/" className={styles.hubLink}>
            ← Volver al Hub del proyecto
          </a>
        </footer>
      </main>
    </div>
  )
}
