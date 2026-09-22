import { useNavigate } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/shared/layout'
import { ReclamoFormulario } from '../components/ReclamoFormulario'
import styles from './v2.module.css'

/**
 * Acceso directo al formulario, sin pasar por el asistente.
 *
 * Es el atajo "Ingresar un reclamo" del inicio: para quien ya sabe lo que
 * quiere y no necesita que lo guíen. Al no venir de ninguna respuesta, el
 * contexto arranca vacío y el formulario se muestra completo.
 */
export function ReclamoDirectoPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <button type="button" className={styles.backLink} onClick={() => void navigate('/v2')}>
        ← Volver
      </button>

      <PageHeader title="Ingresar un reclamo" />

      <ReclamoFormulario
        formularioId="otro"
        contexto={{}}
        motivoLabel="Reclamo ingresado sin asistente"
        onEnviado={(reclamo) => void navigate(`/v2/reclamos/${reclamo.id}`)}
      />
    </PageContainer>
  )
}
