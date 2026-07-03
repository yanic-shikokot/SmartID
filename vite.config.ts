import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png'
      ],

      manifest: {
        name: 'SmartID School Manager',
        short_name: 'SmartID',
        description: 'School management system for Kenyan schools',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        lang: 'en',
        categories: ['education', 'productivity'],

        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/maskable-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],

        shortcuts: [
          {
            name: 'Scan QR',
            short_name: 'Scan',
            description: 'Scan a student ID',
            url: '/scan',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192'
              }
            ]
          },
          {
            name: 'Students',
            short_name: 'Students',
            description: 'View students',
            url: '/students',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192'
              }
            ]
          },
          {
            name: 'Fees',
            short_name: 'Fees',
            description: 'Manage fees',
            url: '/fees',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192'
              }
            ]
          }
        ]
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
