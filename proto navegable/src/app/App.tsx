import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './providers'
import { AppRouter } from './router'

/**
 * Raíz de la aplicación.
 *
 * `basename` sale de `import.meta.env.BASE_URL`, que Vite completa con el
 * `base` de `vite.config.ts` ('/prototipo/'). Así el router y los assets
 * comparten una única fuente de verdad: cambiar la carpeta donde vive el
 * prototipo dentro del Hub es tocar sólo `vite.config.ts`.
 */
export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  )
}
