// ABOUTME: Vite build configuration for the benchmark showcase SPA.
// ABOUTME: Configures React plugin and GitHub Pages base path.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/hpp-p0-benchmark/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
