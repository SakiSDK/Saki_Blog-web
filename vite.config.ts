import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@stores': resolve(__dirname, 'src/stores'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/utils.scss" as util;
          @use "@/styles/mixins.scss" as mix;
          @use "@/styles/animations.scss" as anim;
        `
          // @use "@/styles/main.scss" as *;
      }
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
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
