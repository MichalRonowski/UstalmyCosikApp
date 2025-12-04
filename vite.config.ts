import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Ustalmy Cosik App',
        short_name: 'UstalmyCosik',
        description: 'Progressive Web App with Firebase Firestore',
        theme_color: '#646cff',
        background_color: '#1a1a1a',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/pwa-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/pwa-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
