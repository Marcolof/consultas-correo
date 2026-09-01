import { useState } from 'react'
import { PageContainer, PageHeader } from '@/shared/layout'
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Input,
  Select,
  Switch,
  Tabs,
} from '@/shared/ui'
import type { SelectOption } from '@/core/types/common'

const MOTIVOS: readonly SelectOption[] = [
  { value: 'DEMORA', label: 'Demora en el servicio' },
  { value: 'DANIO', label: 'Paquete dañado' },
  { value: 'FALTANTE', label: 'Paquete con faltante de contenido' },
]

/**
 * Pantalla de arranque: muestra el chrome (header + sidebar) y los
 * primitivos de `shared/ui` ya montados con los tokens de MiCorreo.
 * Reemplazar por la pantalla real cuando arranque el desarrollo.
 */
export function StarterPage() {
  const [tab, setTab] = useState('datos')
  const [accepted, setAccepted] = useState(false)
  const [notifyMe, setNotifyMe] = useState(true)

  return (
    <PageContainer>
      <PageHeader
        title="Base de UI — MiCorreo"
        description="Chrome y componentes globales extraídos del proyecto de referencia. Punto de partida para nuevas pantallas."
        actions={<Button variant="primary">Acción primaria</Button>}
      />

      <Alert tone="info" title="Esto es un starter">
        Sidebar, header, footer, fuentes, tokens y primitivos de formulario ya están
        montados. Borrá esta página cuando empieces la pantalla real.
      </Alert>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Tabs
          items={[
            { id: 'datos', label: 'Datos' },
            { id: 'estados', label: 'Estados' },
          ]}
          activeId={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'datos' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-6)',
          }}
        >
          <Input id="nombre" label="Nombre" />
          <Input id="email" label="Correo electrónico" type="email" />
          <Select id="motivo" label="Motivo" options={MOTIVOS} />
          <Checkbox
            id="acepta"
            label="Acepto los términos"
            checked={accepted}
            onChange={setAccepted}
          />
          <Switch
            id="notificaciones"
            label="Recibir notificaciones"
            checked={notifyMe}
            onChange={setNotifyMe}
          />
        </div>
      )}

      {tab === 'estados' && (
        <div
          style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}
        >
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Resuelto</Badge>
          <Badge tone="warning">En revisión</Badge>
          <Badge tone="danger">Rechazado</Badge>
        </div>
      )}
    </PageContainer>
  )
}
