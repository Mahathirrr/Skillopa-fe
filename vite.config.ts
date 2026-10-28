import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const e2eApiTarget = process.env.E2E_API_PROXY_TARGET ?? 'https://skillopa.showcaseproject.my.id'

const apiProxy = {
  '/api': {
    target: e2eApiTarget,
    changeOrigin: true,
    secure: true,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor'
          if (id.includes('node_modules/react-router')) return 'router-vendor'
          if (id.includes('node_modules/@tanstack/react-query')) return 'query-vendor'
          if (id.includes('node_modules/lucide-react')) return 'icons-vendor'
          if (id.includes('node_modules/i18next') || id.includes('react-i18next')) return 'i18n-vendor'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
