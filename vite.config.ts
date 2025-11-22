import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  server: {
    port: 5173, // 不写也行，默认5173
    open: true, // 自动打开浏览器（可选）
    proxy: {
      // 这里是代理配置！！！
      '/api': {
        target: 'http://localhost:3000', // 你后端的地址
        changeOrigin: true,             // 修改请求源
        rewrite: path => path.replace(/^\/api/, '') // 去掉 api 前缀（可选）
      }
    }
  }
})
