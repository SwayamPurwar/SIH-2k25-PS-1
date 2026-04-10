import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'AquaGuard Health',
        short_name: 'AquaGuard',
        description: 'Smart Water-Borne Disease Monitoring for Remote Areas',
        theme_color: '#059669', // This is your Emerald-600 brand color!
        background_color: '#ffffff',
        display: 'standalone', // This makes it look like a native app (no browser search bar)
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3256/3256114.png', // Temporary logo
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // This tells the app to cache ALL your UI files so they load offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jsx}'],
        runtimeCaching: [
          {
            // This caches your API requests (like the Map and Leaderboard) 
            // so they still show the last known data when offline!
            urlPattern: /^http:\/\/localhost:5000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } // Keep data for 24 hours
            }
          }
        ]
      }
    })
  ],
})