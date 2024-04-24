import vercel from 'vite-plugin-vercel'
import ssr from 'vike/plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

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
