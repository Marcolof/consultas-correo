import { useNavigate, useParams } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/shared/layout'
import { Alert, Button, EmptyState } from '@/shared/ui'
import { findReclamo } from '../core/reclamosStore'
import styles from './v2.module.css'

/**
 * Cierre del recorrido: el número de caso.
 *
 * No hay pantalla de seguimiento — el alcance de V2 termina acá. El reclamo
 * vive sólo en memoria, así que entrar directo por URL a un caso creado en
 * otra sesión muestra el estado vacío en vez de inventar uno.
 */
export function ReclamoConfirmacionPage() {
  const { casoId } = useParams()
  const navigate = useNavigate()
  const reclamo = findReclamo(casoId)

  if (reclamo === null) {
    return (
      <PageContainer>
        <EmptyState
          title="No encontramos ese reclamo"
          description="Los reclamos de esta demostración no se guardan: al recargar la página vuelven a cero."
          action={
            <Button variant="secondary" onClick={() => void navigate('/v2')}>
              Volver al inicio
            </Button>
          }
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Listo, recibimos tu reclamo" />

      <div className={styles.stack}>
        <Alert tone="success" title={`Tu número de caso es ${reclamo.id}`}>
          Guardalo: te vamos a contactar por el medio que elegiste.
        </Alert>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Resumen</h2>
          <div className={styles.dataGrid}>
            <div className={styles.dataItem}>
              <p className={styles.dataLabel}>Motivo</p>
              <p className={styles.dataValue}>{reclamo.motivoLabel}</p>
            </div>
            {reclamo.envioNumero !== undefined && (
              <div className={styles.dataItem}>
                <p className={styles.dataLabel}>Envío asociado</p>
                <p className={styles.dataValue}>{reclamo.envioNumero}</p>
              </div>
            )}
            <div className={styles.dataItem}>
              <p className={styles.dataLabel}>Fecha de ingreso</p>
              <p className={styles.dataValue}>{reclamo.creadoEl}</p>
            </div>
          </div>
        </section>

        <div className={styles.formActions}>
          <Button onClick={() => void navigate('/v2')}>Volver al inicio</Button>
        </div>
      </div>
    </PageContainer>
  )
}
