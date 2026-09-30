import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClientApp } from './app/ClientApp'
import './styles/globals.css'

/**
 * Entrada del paquete para cliente (`npm run build:cliente`): sólo la V3,
 * sin landing de versiones ni acceso al Hub. Ver `vite.client.config.ts`.
 */
const container = document.getElementById('root')
if (container === null) {
  throw new Error('No se encontró el elemento #root en client.html.')
}

createRoot(container).render(
  <StrictMode>
    <ClientApp />
  </StrictMode>,
)
