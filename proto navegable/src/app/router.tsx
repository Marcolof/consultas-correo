import { Route, Routes } from 'react-router-dom'
import { StarterPage } from '@/pages/StarterPage'
import { AppShell } from './AppShell'

/**
 * Única ruta de la base: reemplazar `StarterPage` por las pantallas reales
 * a medida que el proyecto avance, o agregar más `<Route>` bajo `AppShell`.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<StarterPage />} />
      </Route>
    </Routes>
  )
}
