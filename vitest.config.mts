import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'e2e/**',
      'src/test/components/ui/**',
    ],
  },
})
