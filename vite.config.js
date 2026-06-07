import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE_URL || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'StreamPick — Toby Privé',
        short_name: 'StreamPick',
        description: 'Top 100 films & series met live OMDB-scores',
        theme_color: '#0d0d0d',
        background_color: '#030712',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            // Cache OMDB poster images for 7 days
            urlPattern: /^https:\/\/m\.media-amazon\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'omdb-posters',
              expiration: { maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            // Cache OMDB API responses for 24h
            urlPattern: /^https:\/\/www\.omdbapi\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'omdb-api',
              expiration: { maxEntries: 150, maxAgeSeconds: 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
