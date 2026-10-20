import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from the GitHub Pages project path; update if the repo is renamed.
  base: '/tarot-app/',
  plugins: [react()],
})
