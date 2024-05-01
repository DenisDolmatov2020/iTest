import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js' // Указание алиаса для полной сборки Vue
    }
  },
  server: {
    proxy: {
      // ключ - это путь в твоем приложении, который нужно проксировать
      // значение - это целевой хост
      '/api': {
        target: 'http://127.0.0.1:3000', // адрес бэкенд-сервера
        changeOrigin: true, // необходимо для виртуальных хостов
        // pathRewrite: {'^/api': ''}, // используй, если нужно убрать /api из пути
      },
    },
  },
})
