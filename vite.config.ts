import react from '@vitejs/plugin-react'
import path from 'path'
import ssr from 'vike/plugin'
import { defineConfig } from 'vite'
import vercel from 'vite-plugin-vercel'

export default defineConfig({
  plugins: [
    react({}),
    ssr({
      prerender: true,
    }),
    vercel(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
