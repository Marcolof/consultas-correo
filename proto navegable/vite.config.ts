import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  /**
   * El prototipo no vive en la raíz de un dominio propio: se compila y se
   * copia dentro del Hub (`hub/prototipo/`), que es el único sitio
   * deployado. Sin este `base`, todos los assets (JS/CSS/fuentes) se
   * pedirían a `/assets/...` en vez de `/prototipo/assets/...`.
   *
   * Tiene que quedar sincronizado con el `basename` del BrowserRouter
   * (`src/app/App.tsx`) y con la carpeta destino de `scripts/build-hub.mjs`.
   */
  base: '/prototipo/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 4300,
    open: false,
  },
})
