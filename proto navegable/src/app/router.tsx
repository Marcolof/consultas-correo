import { Route, Routes } from 'react-router-dom'
import { ReclamosListPage } from '@/pages/ReclamosListPage'
import { AppShell } from './AppShell'

/**
 * Rutas del prototipo. Agregar pantallas nuevas como `<Route>` bajo
 * `AppShell` para que compartan el chrome (header, sidebar, footer).
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ReclamosListPage />} />
      </Route>
    </Routes>
  )
}
