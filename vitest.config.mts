import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'test/**',
      'src/components/ui/__tests__/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover'],
      exclude: [
        'node_modules/',
        'src/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        'src/components/ui/**', // shadcn components
        '*.config.*',
        'src/env.js',
      ],
    },
  },
})
