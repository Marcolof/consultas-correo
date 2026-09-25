import { Route, Routes } from 'react-router-dom'
import { ReclamosListPage } from '@/pages/ReclamosListPage'
import { VersionsLandingPage } from '@/pages/VersionsLandingPage'
import { AsistentePage } from '@/v2/pages/AsistentePage'
import { EnviosListPage } from '@/v2/pages/EnviosListPage'
import { EnvioDetallePage } from '@/v2/pages/EnvioDetallePage'
import { ReclamoConfirmacionPage } from '@/v2/pages/ReclamoConfirmacionPage'
import { ReclamoDirectoPage } from '@/v2/pages/ReclamoDirectoPage'
import { AyudaPage } from '@/v3/pages/AyudaPage'
import { FormularioPage } from '@/v3/pages/FormularioPage'
import { AppShell } from './AppShell'

/**
 * Rutas del prototipo.
 *
 * La raíz es la landing del módulo (selector de versiones), sin el chrome
 * de MiCorreo. Cada propuesta vive bajo su propio prefijo y sí comparte el
 * chrome:
 *
 *   /v1            V1 — sección única de gestiones (propuesta presentada)
 *   /v2            V2 — asistente guiado (buscador + árbol de preguntas)
 *   /v2/envios     V2 — entrada contextual desde un envío
 *   /v3            V3 — todas las gestiones a la vista, en 4 grupos
 *   /v3/formulario V3 — formulario con los datos de la cuenta ya cargados
 *
 * V2 tiene pocas rutas a propósito: todo el recorrido del asistente vive en
 * `/v2` y su estado viaja en la query (`?p=`, `?q=`, `?envio=`), así
 * cualquier paso se puede enlazar y recargar.
 *
 * Los enlaces viejos a `/?profile=...` se redirigen a `/v1` desde la propia
 * landing — ver `pages/VersionsLandingPage.tsx`.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route index element={<VersionsLandingPage />} />

      <Route element={<AppShell />}>
        <Route path="v1" element={<ReclamosListPage />} />

        <Route path="v2" element={<AsistentePage />} />
        <Route path="v2/reclamo" element={<ReclamoDirectoPage />} />
        <Route path="v2/envios" element={<EnviosListPage />} />
        <Route path="v2/envios/:envioId" element={<EnvioDetallePage />} />
        <Route path="v2/reclamos/:casoId" element={<ReclamoConfirmacionPage />} />

        <Route path="v3" element={<AyudaPage />} />
        <Route path="v3/formulario" element={<FormularioPage />} />
      </Route>
    </Routes>
  )
}
