import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Raise warning limit so we see real issues
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor chunks so React is cached separately from app code
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Enable minification (default is esbuild, fastest)
    minify: 'esbuild',
    // Generate source maps only in dev
    sourcemap: false,
    // Target modern browsers — smaller output
    target: 'es2020',
  },
})
